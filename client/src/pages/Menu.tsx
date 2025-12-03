import { useState, useMemo } from "react";
import { Link } from "wouter";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { ArrowLeft, Plus, Flame, Dumbbell, SlidersHorizontal, X, ArrowUpDown, Loader2, UtensilsCrossed } from "lucide-react";
import { useCart } from "@/contexts/CartContext";
import { useToast } from "@/hooks/use-toast";
import Header from "@/components/Header";
import { useQuery } from "@tanstack/react-query";
import type { MenuItem as DbMenuItem } from "@shared/schema";

interface MenuItem {
  id: number;
  name: string;
  description: string;
  price: string;
  priceValue: number;
  calories: number;
  protein: number;
  image: string;
  category: string;
}

const categories = [
  { id: "all", name: "All Items" },
  { id: "starters", name: "Starters" },
  { id: "bbq", name: "BBQ" },
  { id: "karahi", name: "Karahi & Curries" },
  { id: "rice", name: "Rice & Biryani" },
  { id: "breads", name: "Naans & Breads" },
  { id: "drinks", name: "Drinks" },
];

const priceRanges = [
  { id: "all", name: "All Prices", min: 0, max: Infinity },
  { id: "under10", name: "Under $10", min: 0, max: 10 },
  { id: "10to20", name: "$10 - $20", min: 10, max: 20 },
  { id: "20to30", name: "$20 - $30", min: 20, max: 30 },
  { id: "over30", name: "Over $30", min: 30, max: Infinity },
];

const calorieRanges = [
  { id: "all", name: "All Calories", min: 0, max: Infinity },
  { id: "under300", name: "Under 300 cal", min: 0, max: 300 },
  { id: "300to500", name: "300 - 500 cal", min: 300, max: 500 },
  { id: "over500", name: "Over 500 cal", min: 500, max: Infinity },
];

const proteinRanges = [
  { id: "all", name: "All Protein", min: 0, max: Infinity },
  { id: "under15", name: "Under 15g", min: 0, max: 15 },
  { id: "15to35", name: "15g - 35g", min: 15, max: 35 },
  { id: "over35", name: "Over 35g (High)", min: 35, max: Infinity },
];

const sortOptions = [
  { id: "default", name: "Default" },
  { id: "price-low", name: "Price: Low to High" },
  { id: "price-high", name: "Price: High to Low" },
  { id: "calories-low", name: "Calories: Low to High" },
  { id: "calories-high", name: "Calories: High to Low" },
  { id: "protein-high", name: "Protein: High to Low" },
  { id: "name-az", name: "Name: A to Z" },
];

export default function Menu() {
  const [activeCategory, setActiveCategory] = useState("all");
  const [priceRange, setPriceRange] = useState("all");
  const [calorieRange, setCalorieRange] = useState("all");
  const [proteinRange, setProteinRange] = useState("all");
  const [sortBy, setSortBy] = useState("default");
  const [showFilters, setShowFilters] = useState(false);
  const { addToCart } = useCart();
  const { toast } = useToast();

  const { data: apiMenuData, isLoading } = useQuery<{ items: DbMenuItem[] }>({
    queryKey: ["/api/menu-items"],
  });

  const allMenuItems: MenuItem[] = useMemo(() => {
    const apiItems = apiMenuData?.items || [];
    
    return apiItems.map((item, index) => ({
      id: index + 1000,
      name: item.name,
      description: item.description,
      price: `$${item.price}`,
      priceValue: parseFloat(String(item.price)),
      calories: parseInt(String(item.calories)),
      protein: parseInt(String(item.protein)),
      image: item.image,
      category: item.category,
    }));
  }, [apiMenuData]);

  const handleAddToCart = (item: MenuItem) => {
    addToCart({
      id: item.id,
      name: item.name,
      price: item.price,
      image: item.image,
      calories: item.calories,
      protein: item.protein,
      description: item.description,
    });
    toast({
      title: "Added to cart",
      description: `${item.name} has been added to your cart.`,
    });
  };

  const activeFiltersCount = useMemo(() => {
    let count = 0;
    if (activeCategory !== "all") count++;
    if (priceRange !== "all") count++;
    if (calorieRange !== "all") count++;
    if (proteinRange !== "all") count++;
    if (sortBy !== "default") count++;
    return count;
  }, [activeCategory, priceRange, calorieRange, proteinRange, sortBy]);

  const clearAllFilters = () => {
    setActiveCategory("all");
    setPriceRange("all");
    setCalorieRange("all");
    setProteinRange("all");
    setSortBy("default");
  };

  const filteredAndSortedItems = useMemo(() => {
    const categoryMap: Record<string, string> = {
      "starters": "Starters",
      "bbq": "BBQ",
      "karahi": "Karahi & Curries",
      "rice": "Rice & Biryani",
      "breads": "Naans & Breads",
      "drinks": "Drinks",
    };

    const selectedPriceRange = priceRanges.find(p => p.id === priceRange) || priceRanges[0];
    const selectedCalorieRange = calorieRanges.find(c => c.id === calorieRange) || calorieRanges[0];
    const selectedProteinRange = proteinRanges.find(p => p.id === proteinRange) || proteinRanges[0];

    let filtered = allMenuItems.filter(item => {
      if (activeCategory !== "all" && item.category !== categoryMap[activeCategory]) {
        return false;
      }
      if (item.priceValue < selectedPriceRange.min || item.priceValue >= selectedPriceRange.max) {
        return false;
      }
      if (item.calories < selectedCalorieRange.min || item.calories >= selectedCalorieRange.max) {
        return false;
      }
      if (item.protein < selectedProteinRange.min || item.protein >= selectedProteinRange.max) {
        return false;
      }
      return true;
    });

    switch (sortBy) {
      case "price-low":
        filtered.sort((a, b) => a.priceValue - b.priceValue);
        break;
      case "price-high":
        filtered.sort((a, b) => b.priceValue - a.priceValue);
        break;
      case "calories-low":
        filtered.sort((a, b) => a.calories - b.calories);
        break;
      case "calories-high":
        filtered.sort((a, b) => b.calories - a.calories);
        break;
      case "protein-high":
        filtered.sort((a, b) => b.protein - a.protein);
        break;
      case "name-az":
        filtered.sort((a, b) => a.name.localeCompare(b.name));
        break;
      default:
        break;
    }

    return filtered;
  }, [activeCategory, priceRange, calorieRange, proteinRange, sortBy]);

  return (
    <div className="min-h-screen bg-background">
      <Header />

      <main className="container mx-auto px-4 py-8 pt-24">
        <div className="mb-8">
          <Link href="/">
            <Button variant="ghost" className="gap-2 mb-4 -ml-2" data-testid="button-back-home">
              <ArrowLeft className="h-4 w-4" />
              Back to Home
            </Button>
          </Link>
          <h1 className="text-4xl font-bold mb-2" data-testid="text-menu-title">Our Menu</h1>
          <p className="text-muted-foreground" data-testid="text-menu-subtitle">
            Explore our authentic Pakistani cuisine crafted with love and tradition.
          </p>
        </div>

        <div className="flex gap-2 overflow-x-auto pb-4 mb-4 scrollbar-hide">
          {categories.map((category) => (
            <Badge
              key={category.id}
              variant={activeCategory === category.id ? "default" : "secondary"}
              className="cursor-pointer whitespace-nowrap px-4 py-2"
              onClick={() => setActiveCategory(category.id)}
              data-testid={`badge-filter-${category.id}`}
            >
              {category.name}
            </Badge>
          ))}
        </div>

        <div className="flex flex-wrap items-center gap-3 mb-6">
          <Button
            variant="outline"
            size="sm"
            className="gap-2"
            onClick={() => setShowFilters(!showFilters)}
            data-testid="button-toggle-filters"
          >
            <SlidersHorizontal className="h-4 w-4" />
            Filters
            {activeFiltersCount > 0 && (
              <Badge variant="default" className="ml-1 h-5 w-5 flex items-center justify-center p-0 text-xs">
                {activeFiltersCount}
              </Badge>
            )}
          </Button>

          <Select value={sortBy} onValueChange={setSortBy}>
            <SelectTrigger className="w-[180px]" data-testid="select-sort">
              <ArrowUpDown className="h-4 w-4 mr-2" />
              <SelectValue placeholder="Sort by" />
            </SelectTrigger>
            <SelectContent>
              {sortOptions.map((option) => (
                <SelectItem key={option.id} value={option.id} data-testid={`sort-option-${option.id}`}>
                  {option.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          {activeFiltersCount > 0 && (
            <Button
              variant="ghost"
              size="sm"
              className="gap-2 text-muted-foreground"
              onClick={clearAllFilters}
              data-testid="button-clear-filters"
            >
              <X className="h-4 w-4" />
              Clear all
            </Button>
          )}

          <div className="ml-auto text-sm text-muted-foreground" data-testid="text-results-count">
            {filteredAndSortedItems.length} {filteredAndSortedItems.length === 1 ? "item" : "items"}
          </div>
        </div>

        {showFilters && (
          <Card className="mb-6 p-4" data-testid="card-filters">
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
              <div className="space-y-2">
                <label className="text-sm font-medium flex items-center gap-2">
                  Price Range
                </label>
                <Select value={priceRange} onValueChange={setPriceRange}>
                  <SelectTrigger data-testid="select-price">
                    <SelectValue placeholder="Select price range" />
                  </SelectTrigger>
                  <SelectContent>
                    {priceRanges.map((range) => (
                      <SelectItem key={range.id} value={range.id} data-testid={`price-option-${range.id}`}>
                        {range.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium flex items-center gap-2">
                  <Flame className="h-4 w-4 text-orange-500" />
                  Calories
                </label>
                <Select value={calorieRange} onValueChange={setCalorieRange}>
                  <SelectTrigger data-testid="select-calories">
                    <SelectValue placeholder="Select calorie range" />
                  </SelectTrigger>
                  <SelectContent>
                    {calorieRanges.map((range) => (
                      <SelectItem key={range.id} value={range.id} data-testid={`calorie-option-${range.id}`}>
                        {range.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium flex items-center gap-2">
                  <Dumbbell className="h-4 w-4 text-green-500" />
                  Protein
                </label>
                <Select value={proteinRange} onValueChange={setProteinRange}>
                  <SelectTrigger data-testid="select-protein">
                    <SelectValue placeholder="Select protein range" />
                  </SelectTrigger>
                  <SelectContent>
                    {proteinRanges.map((range) => (
                      <SelectItem key={range.id} value={range.id} data-testid={`protein-option-${range.id}`}>
                        {range.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>
          </Card>
        )}

        {activeFiltersCount > 0 && (
          <div className="flex flex-wrap gap-2 mb-6" data-testid="active-filters">
            {activeCategory !== "all" && (
              <Badge variant="secondary" className="gap-1 pr-1">
                {categories.find(c => c.id === activeCategory)?.name}
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-4 w-4 p-0 ml-1"
                  onClick={() => setActiveCategory("all")}
                  data-testid="remove-category-filter"
                >
                  <X className="h-3 w-3" />
                </Button>
              </Badge>
            )}
            {priceRange !== "all" && (
              <Badge variant="secondary" className="gap-1 pr-1">
                {priceRanges.find(p => p.id === priceRange)?.name}
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-4 w-4 p-0 ml-1"
                  onClick={() => setPriceRange("all")}
                  data-testid="remove-price-filter"
                >
                  <X className="h-3 w-3" />
                </Button>
              </Badge>
            )}
            {calorieRange !== "all" && (
              <Badge variant="secondary" className="gap-1 pr-1">
                {calorieRanges.find(c => c.id === calorieRange)?.name}
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-4 w-4 p-0 ml-1"
                  onClick={() => setCalorieRange("all")}
                  data-testid="remove-calorie-filter"
                >
                  <X className="h-3 w-3" />
                </Button>
              </Badge>
            )}
            {proteinRange !== "all" && (
              <Badge variant="secondary" className="gap-1 pr-1">
                {proteinRanges.find(p => p.id === proteinRange)?.name}
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-4 w-4 p-0 ml-1"
                  onClick={() => setProteinRange("all")}
                  data-testid="remove-protein-filter"
                >
                  <X className="h-3 w-3" />
                </Button>
              </Badge>
            )}
            {sortBy !== "default" && (
              <Badge variant="secondary" className="gap-1 pr-1">
                {sortOptions.find(s => s.id === sortBy)?.name}
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-4 w-4 p-0 ml-1"
                  onClick={() => setSortBy("default")}
                  data-testid="remove-sort-filter"
                >
                  <X className="h-3 w-3" />
                </Button>
              </Badge>
            )}
          </div>
        )}

        {isLoading ? (
          <div className="flex items-center justify-center py-12">
            <Loader2 className="h-8 w-8 animate-spin text-primary" />
          </div>
        ) : (
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {filteredAndSortedItems.map((item) => (
            <Card
              key={item.id}
              className="overflow-hidden hover-elevate active-elevate-2 group border-0"
              data-testid={`card-menu-item-${item.id}`}
            >
              <CardContent className="p-0">
                <div className="relative h-48 overflow-hidden">
                  <img
                    src={item.image}
                    alt={item.name}
                    className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-110"
                    data-testid={`img-menu-item-${item.id}`}
                  />
                  <Badge className="absolute top-3 left-3 bg-background/90 text-foreground" data-testid={`badge-category-${item.id}`}>
                    {item.category}
                  </Badge>
                </div>
                <div className="p-4 space-y-3">
                  <div>
                    <h3 className="font-bold text-lg" data-testid={`text-item-name-${item.id}`}>{item.name}</h3>
                    <p className="text-sm text-muted-foreground line-clamp-2" data-testid={`text-item-desc-${item.id}`}>
                      {item.description}
                    </p>
                  </div>
                  <div className="flex gap-2 flex-wrap">
                    <Badge variant="outline" className="bg-orange-50 dark:bg-orange-950 text-orange-700 dark:text-orange-300 border-orange-200 dark:border-orange-800">
                      <Flame className="h-3 w-3 mr-1" />
                      {item.calories} cal
                    </Badge>
                    <Badge variant="outline" className="bg-green-50 dark:bg-green-950 text-green-700 dark:text-green-300 border-green-200 dark:border-green-800">
                      <Dumbbell className="h-3 w-3 mr-1" />
                      {item.protein}g protein
                    </Badge>
                  </div>
                  <div className="flex items-center justify-between pt-2">
                    <p className="text-xl font-bold text-primary" data-testid={`text-item-price-${item.id}`}>{item.price}</p>
                  </div>
                </div>
              </CardContent>
              <CardFooter className="p-4 pt-0">
                <Button className="w-full gap-2" onClick={() => handleAddToCart(item)} data-testid={`button-add-${item.id}`}>
                  <Plus className="h-4 w-4" />
                  Add to Cart
                </Button>
              </CardFooter>
            </Card>
          ))}
        </div>
        )}

        {!isLoading && filteredAndSortedItems.length === 0 && (
          <div className="text-center py-12">
            <UtensilsCrossed className="h-16 w-16 mx-auto text-muted-foreground/50 mb-4" />
            {allMenuItems.length === 0 ? (
              <>
                <p className="text-xl font-semibold mb-2" data-testid="text-no-items">No menu items yet</p>
                <p className="text-muted-foreground mb-4">Menu items will appear here once added through the admin dashboard.</p>
              </>
            ) : (
              <>
                <p className="text-muted-foreground mb-4" data-testid="text-no-items">No items match your filters.</p>
                <Button variant="outline" onClick={clearAllFilters} data-testid="button-clear-filters-empty">
                  Clear all filters
                </Button>
              </>
            )}
          </div>
        )}
      </main>
    </div>
  );
}
