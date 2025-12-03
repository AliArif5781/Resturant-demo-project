import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { motion } from "framer-motion";
import { Plus, Flame, Dumbbell, Sparkles, Star } from "lucide-react";
import butterChickenImage from "@assets/generated_images/Butter_chicken_curry_8dff6ea9.png";
import biryaniImage from "@assets/generated_images/Chicken_Biryani_overhead_shot_73a10a24.png";
import bbqImage from "@assets/generated_images/BBQ_mixed_grill_platter_6ba4d702.png";
import naanImage from "@assets/generated_images/Garlic_naan_bread_closeup_e1772073.png";
import karahiImage from "@assets/generated_images/Chicken_Karahi_dish_closeup_1ee23ad4.png";
import kabobImage from "@assets/generated_images/Beef_bihari_kabab_e2e73340.png";
import lassiImage from "@assets/generated_images/Mango_lassi_beverage_bebcb27b.png";
import samoasImage from "@assets/generated_images/Samosa_chaat_starter_82ea98a8.png";
import pakoraImage from "@assets/generated_images/Vegetable_pakora_appetizers_1e9a5a83.png";
import { useCart } from "@/contexts/CartContext";
import { useToast } from "@/hooks/use-toast";
import { useMemo } from "react";
import { useQuery } from "@tanstack/react-query";
import type { MenuItem as DbMenuItem } from "@shared/schema";

interface MenuItem {
  id: number;
  name: string;
  description: string;
  price: string;
  calories: number;
  protein: number;
  image: string;
  category: "curry" | "bbq" | "rice" | "bread" | "drink" | "appetizer";
  pairsWith: string[];
  badge?: string;
  score?: number;
  rating: number;
}

const defaultMenuItems: MenuItem[] = [
  {
    id: 1,
    name: "Chicken Karahi (Bone-In)",
    description: "Slow-cooked tomato-based karahi with fresh ginger, chilies & coriander.",
    price: "$24.99",
    calories: 520,
    protein: 42,
    image: karahiImage,
    category: "curry",
    pairsWith: ["bread", "rice", "drink"],
    rating: 4.9,
  },
  {
    id: 2,
    name: "Beef Bihari Kabab",
    description: "Tender beef strips marinated in yogurt and spices, grilled to perfection.",
    price: "$26.99",
    calories: 380,
    protein: 38,
    image: kabobImage,
    category: "bbq",
    pairsWith: ["bread", "rice", "drink", "appetizer"],
    rating: 4.8,
  },
  {
    id: 3,
    name: "Chicken Biryani",
    description: "Aromatic basmati rice layered with spiced chicken and herbs.",
    price: "$21.99",
    calories: 650,
    protein: 35,
    image: biryaniImage,
    category: "rice",
    pairsWith: ["curry", "drink", "appetizer"],
    rating: 4.9,
  },
  {
    id: 4,
    name: "Butter Chicken",
    description: "Rich, creamy tomato-based curry with tender chicken pieces.",
    price: "$19.99",
    calories: 480,
    protein: 32,
    image: butterChickenImage,
    category: "curry",
    pairsWith: ["bread", "rice", "drink"],
    rating: 4.7,
  },
  {
    id: 5,
    name: "Garlic Naan",
    description: "Freshly baked bread with garlic and butter.",
    price: "$3.99",
    calories: 290,
    protein: 8,
    image: naanImage,
    category: "bread",
    pairsWith: ["curry", "bbq"],
    rating: 4.8,
  },
  {
    id: 6,
    name: "Mango Lassi",
    description: "Refreshing yogurt drink blended with sweet mango pulp.",
    price: "$5.99",
    calories: 180,
    protein: 6,
    image: lassiImage,
    category: "drink",
    pairsWith: ["curry", "bbq", "rice", "appetizer"],
    rating: 4.6,
  },
  {
    id: 7,
    name: "Mixed Grill Platter",
    description: "Seekh kabab, chicken tikka, and beef boti on a sizzling plate.",
    price: "$28.99",
    calories: 720,
    protein: 65,
    image: bbqImage,
    category: "bbq",
    pairsWith: ["bread", "rice", "drink"],
    rating: 4.9,
  },
  {
    id: 8,
    name: "Samosa Chaat",
    description: "Crispy samosas topped with chickpeas, yogurt, and tangy chutneys.",
    price: "$7.99",
    calories: 320,
    protein: 9,
    image: samoasImage,
    category: "appetizer",
    pairsWith: ["curry", "bbq", "drink"],
    rating: 4.5,
  },
  {
    id: 9,
    name: "Vegetable Pakora",
    description: "Crispy vegetable fritters with mint chutney.",
    price: "$6.99",
    calories: 240,
    protein: 6,
    image: pakoraImage,
    category: "appetizer",
    pairsWith: ["curry", "bbq", "drink"],
    rating: 4.4,
  },
];

export default function RecommendedForYou() {
  const { items: cartItems, addToCart } = useCart();
  const { toast } = useToast();

  const { data: apiMenuData } = useQuery<{ items: DbMenuItem[] }>({
    queryKey: ["/api/menu-items"],
  });

  const allMenuItems: MenuItem[] = useMemo(() => {
    const apiItems = apiMenuData?.items || [];
    
    if (apiItems.length > 0) {
      const categoryMap: Record<string, "curry" | "bbq" | "rice" | "bread" | "drink" | "appetizer"> = {
        "Karahi & Curries": "curry",
        "BBQ": "bbq",
        "Rice & Biryani": "rice",
        "Naans & Breads": "bread",
        "Drinks": "drink",
        "Starters": "appetizer",
      };
      
      return apiItems.map((item, index) => ({
        id: index + 1000,
        name: item.name,
        description: item.description,
        price: `$${item.price}`,
        calories: parseInt(String(item.calories)),
        protein: parseInt(String(item.protein)),
        image: item.image,
        category: categoryMap[item.category] || "curry",
        pairsWith: ["bread", "drink"] as string[],
        rating: 4.5 + Math.random() * 0.5,
      }));
    }
    
    return defaultMenuItems;
  }, [apiMenuData]);

  const recommendations = useMemo(() => {
    if (cartItems.length === 0) {
      return allMenuItems.slice(0, 4);
    }

    const cartCategories = cartItems
      .map(item => allMenuItems.find(menuItem => menuItem.id === item.id))
      .filter((item): item is MenuItem => item !== undefined);

    const pairsWithCategories = new Set<string>();
    cartCategories.forEach(item => {
      item.pairsWith.forEach(category => pairsWithCategories.add(category));
    });

    const recommendedItems = allMenuItems
      .map(item => {
        let score = 0;
        let badge = "Popular choice";

        if (pairsWithCategories.has(item.category)) {
          score += 10;
          if (item.category === "bread") {
            badge = "Perfect with your order";
          } else if (item.category === "drink") {
            badge = "Great pairing";
          } else if (item.category === "appetizer") {
            badge = "Start with this";
          } else if (item.category === "curry") {
            badge = "Pairs well";
          } else if (item.category === "rice") {
            badge = "Complete your meal";
          } else if (item.category === "bbq") {
            badge = "Add some protein";
          }
        }

        const hasNaan = cartItems.some(cartItem => 
          cartItem.name.toLowerCase().includes("naan")
        );
        if (!hasNaan && item.category === "bread") {
          score += 5;
          badge = "Don't forget naan!";
        }

        const hasDrink = cartItems.some(cartItem => 
          allMenuItems.find(m => m.id === cartItem.id)?.category === "drink"
        );
        if (!hasDrink && item.category === "drink") {
          score += 3;
          badge = "Refresh yourself";
        }

        return { ...item, score, badge };
      })
      .sort((a, b) => b.score - a.score)
      .slice(0, 4);

    return recommendedItems;
  }, [cartItems, allMenuItems]);

  const handleQuickAdd = (item: MenuItem) => {
    addToCart({
      id: item.id,
      name: item.name,
      price: item.price,
      image: item.image,
      calories: item.calories,
      protein: item.protein,
    });
    toast({
      title: "Added to cart",
      description: `${item.name} has been added to your cart.`,
    });
  };

  return (
    <motion.div 
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-100px" }}
      transition={{ duration: 0.6 }}
      className="space-y-6"
    >
      <div className="flex items-center gap-2">
        <Sparkles className="h-5 w-5 text-primary" />
        <div>
          <h2 className="text-2xl md:text-3xl font-bold" data-testid="text-recommended-title">Recommended for You</h2>
          <p className="text-muted-foreground mt-1" data-testid="text-recommended-subtitle">
            {cartItems.length > 0 
              ? "Based on items in your cart" 
              : "Based on what's popular tonight"}
          </p>
        </div>
      </div>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6">
        {recommendations.map((item, idx) => (
          <motion.div
            key={item.id}
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: idx * 0.1, duration: 0.4 }}
          >
            <Card
              className="overflow-hidden group border-0 h-full flex flex-col"
              data-testid={`card-recommended-${item.id}`}
            >
              <CardContent className="p-0 flex-1">
                <div className="relative h-36 md:h-48 overflow-hidden">
                  <img
                    src={item.image}
                    alt={item.name}
                    className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                    data-testid={`img-recommended-${item.id}`}
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent" />
                  <div className="absolute top-2 right-2 md:top-3 md:right-3">
                    <Badge className="bg-white/90 text-foreground border-0 shadow-lg gap-1 text-xs">
                      <Star className="h-3 w-3 fill-yellow-500 text-yellow-500" />
                      {item.rating.toFixed(1)}
                    </Badge>
                  </div>
                </div>
                <div className="p-3 md:p-4 space-y-2">
                  <Badge variant="secondary" className="text-xs gap-1" data-testid={`badge-recommended-${item.id}`}>
                    <Sparkles className="h-3 w-3" />
                    {item.badge}
                  </Badge>
                  <h3 className="font-bold text-sm md:text-base line-clamp-1" data-testid={`text-recommended-name-${item.id}`}>
                    {item.name}
                  </h3>
                  <p className="text-xs md:text-sm text-muted-foreground line-clamp-2 hidden sm:block" data-testid={`text-recommended-desc-${item.id}`}>
                    {item.description}
                  </p>
                  <div className="flex gap-1.5 flex-wrap">
                    <Badge variant="outline" className="bg-orange-50 dark:bg-orange-950 text-orange-700 dark:text-orange-300 border-orange-200 dark:border-orange-800 text-xs py-0.5" data-testid={`text-recommended-calories-${item.id}`}>
                      <Flame className="h-3 w-3 mr-0.5" />
                      {item.calories}
                    </Badge>
                    <Badge variant="outline" className="bg-green-50 dark:bg-green-950 text-green-700 dark:text-green-300 border-green-200 dark:border-green-800 text-xs py-0.5" data-testid={`text-recommended-protein-${item.id}`}>
                      <Dumbbell className="h-3 w-3 mr-0.5" />
                      {item.protein}g
                    </Badge>
                  </div>
                  <p className="text-base md:text-lg font-bold text-primary" data-testid={`text-recommended-price-${item.id}`}>
                    {item.price}
                  </p>
                </div>
              </CardContent>
              <CardFooter className="p-3 md:p-4 pt-0">
                <Button 
                  className="w-full gap-2 shadow-lg shadow-primary/20" 
                  size="sm"
                  onClick={() => handleQuickAdd(item)} 
                  data-testid={`button-quick-add-${item.id}`}
                >
                  <Plus className="h-4 w-4" />
                  <span className="hidden sm:inline">Quick Add</span>
                  <span className="sm:hidden">Add</span>
                </Button>
              </CardFooter>
            </Card>
          </motion.div>
        ))}
      </div>
    </motion.div>
  );
}
