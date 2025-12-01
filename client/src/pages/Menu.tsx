import { useState } from "react";
import { Link } from "wouter";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Home, ShoppingCart, Plus, Flame, Dumbbell } from "lucide-react";
import { useCart } from "@/contexts/CartContext";
import { useToast } from "@/hooks/use-toast";

import karahiImage from "@assets/generated_images/Chicken_Karahi_dish_closeup_1ee23ad4.png";
import kabobImage from "@assets/generated_images/Beef_bihari_kabab_e2e73340.png";
import biryaniImage from "@assets/generated_images/Chicken_Biryani_overhead_shot_73a10a24.png";
import butterChickenImage from "@assets/generated_images/Butter_chicken_curry_8dff6ea9.png";
import naanImage from "@assets/generated_images/Garlic_naan_bread_closeup_e1772073.png";
import lassiImage from "@assets/generated_images/Mango_lassi_beverage_bebcb27b.png";
import bbqImage from "@assets/generated_images/BBQ_mixed_grill_platter_6ba4d702.png";
import samoasImage from "@assets/generated_images/Samosa_chaat_starter_82ea98a8.png";
import pakoraImage from "@assets/generated_images/Vegetable_pakora_appetizers_1e9a5a83.png";

interface MenuItem {
  id: number;
  name: string;
  description: string;
  price: string;
  calories: number;
  protein: number;
  image: string;
  category: string;
}

const allMenuItems: MenuItem[] = [
  {
    id: 1,
    name: "Chicken Karahi (Bone-In)",
    description: "Slow-cooked tomato-based karahi with fresh ginger, chilies & coriander.",
    price: "$24.99",
    calories: 520,
    protein: 42,
    image: karahiImage,
    category: "Karahi & Curries",
  },
  {
    id: 2,
    name: "Beef Bihari Kabab",
    description: "Tender beef strips marinated in yogurt and spices, grilled to perfection.",
    price: "$26.99",
    calories: 380,
    protein: 38,
    image: kabobImage,
    category: "BBQ",
  },
  {
    id: 3,
    name: "Chicken Biryani",
    description: "Aromatic basmati rice layered with spiced chicken and herbs.",
    price: "$21.99",
    calories: 650,
    protein: 35,
    image: biryaniImage,
    category: "Rice & Biryani",
  },
  {
    id: 4,
    name: "Butter Chicken",
    description: "Rich, creamy tomato-based curry with tender chicken pieces.",
    price: "$19.99",
    calories: 480,
    protein: 32,
    image: butterChickenImage,
    category: "Karahi & Curries",
  },
  {
    id: 5,
    name: "Garlic Naan",
    description: "Freshly baked bread with garlic and butter.",
    price: "$3.99",
    calories: 290,
    protein: 8,
    image: naanImage,
    category: "Naans & Breads",
  },
  {
    id: 6,
    name: "Mango Lassi",
    description: "Refreshing yogurt drink blended with sweet mango pulp.",
    price: "$5.99",
    calories: 180,
    protein: 6,
    image: lassiImage,
    category: "Drinks",
  },
  {
    id: 7,
    name: "Mixed Grill Platter",
    description: "Seekh kabab, chicken tikka, and beef boti on a sizzling plate.",
    price: "$28.99",
    calories: 720,
    protein: 65,
    image: bbqImage,
    category: "BBQ",
  },
  {
    id: 8,
    name: "Samosa Chaat",
    description: "Crispy samosas topped with chickpeas, yogurt, and tangy chutneys.",
    price: "$7.99",
    calories: 320,
    protein: 9,
    image: samoasImage,
    category: "Starters",
  },
  {
    id: 9,
    name: "Vegetable Pakora",
    description: "Crispy vegetable fritters with mint chutney.",
    price: "$6.99",
    calories: 240,
    protein: 6,
    image: pakoraImage,
    category: "Starters",
  },
];

const categories = [
  { id: "all", name: "All Items" },
  { id: "starters", name: "Starters" },
  { id: "bbq", name: "BBQ" },
  { id: "karahi", name: "Karahi & Curries" },
  { id: "rice", name: "Rice & Biryani" },
  { id: "breads", name: "Naans & Breads" },
  { id: "drinks", name: "Drinks" },
];

export default function Menu() {
  const [activeCategory, setActiveCategory] = useState("all");
  const { addToCart, totalItems } = useCart();
  const { toast } = useToast();

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

  const filteredItems = activeCategory === "all"
    ? allMenuItems
    : allMenuItems.filter(item => {
        const categoryMap: Record<string, string> = {
          "starters": "Starters",
          "bbq": "BBQ",
          "karahi": "Karahi & Curries",
          "rice": "Rice & Biryani",
          "breads": "Naans & Breads",
          "drinks": "Drinks",
        };
        return item.category === categoryMap[activeCategory];
      });

  return (
    <div className="min-h-screen bg-background">
      <header className="border-b sticky top-0 bg-background/80 backdrop-blur-md z-50" data-testid="header-menu">
        <div className="container mx-auto px-4 py-3">
          <div className="flex items-center justify-between gap-4">
            <Link href="/" data-testid="link-brand-home">
              <div className="flex items-center gap-3 cursor-pointer">
                <span className="font-bold text-lg" data-testid="text-brand-name">Karahi Point</span>
              </div>
            </Link>
            <div className="flex items-center gap-2">
              <Link href="/">
                <Button variant="ghost" className="gap-2" data-testid="button-home">
                  <Home className="h-4 w-4" />
                  Home
                </Button>
              </Link>
              <Link href="/cart">
                <Button variant="outline" className="gap-2" data-testid="button-cart">
                  <ShoppingCart className="h-4 w-4" />
                  Cart
                  {totalItems > 0 && (
                    <Badge className="ml-1 h-5 w-5 flex items-center justify-center p-0 text-xs">
                      {totalItems}
                    </Badge>
                  )}
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-4 py-8">
        <div className="mb-8">
          <h1 className="text-4xl font-bold mb-2" data-testid="text-menu-title">Our Menu</h1>
          <p className="text-muted-foreground" data-testid="text-menu-subtitle">
            Explore our authentic Pakistani cuisine crafted with love and tradition.
          </p>
        </div>

        <div className="flex gap-2 overflow-x-auto pb-4 mb-8 scrollbar-hide">
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

        <div className="grid sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {filteredItems.map((item) => (
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

        {filteredItems.length === 0 && (
          <div className="text-center py-12">
            <p className="text-muted-foreground" data-testid="text-no-items">No items found in this category.</p>
          </div>
        )}
      </main>
    </div>
  );
}
