import { useMemo } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Plus, Flame, Dumbbell, TrendingUp, Star } from "lucide-react";
import { motion } from "framer-motion";
import karahiImage from "@assets/generated_images/Chicken_Karahi_dish_closeup_1ee23ad4.png";
import kabobImage from "@assets/generated_images/Beef_bihari_kabab_e2e73340.png";
import biryaniImage from "@assets/generated_images/Chicken_Biryani_overhead_shot_73a10a24.png";
import butterChickenImage from "@assets/generated_images/Butter_chicken_curry_8dff6ea9.png";
import naanImage from "@assets/generated_images/Garlic_naan_bread_closeup_e1772073.png";
import lassiImage from "@assets/generated_images/Mango_lassi_beverage_bebcb27b.png";
import { useCart } from "@/contexts/CartContext";
import { useToast } from "@/hooks/use-toast";
import { useQuery } from "@tanstack/react-query";
import type { MenuItem as DbMenuItem } from "@shared/schema";

interface PopularItem {
  id: number;
  name: string;
  orders: number;
  price: string;
  calories: number;
  protein: number;
  image: string;
  description: string;
  rating: number;
}

const defaultPopularItems: PopularItem[] = [
  { id: 1, name: "Chicken Karahi", orders: 24, price: "$24.99", calories: 520, protein: 42, image: karahiImage, description: "Tender chicken cooked in a wok with tomatoes, ginger, and aromatic spices", rating: 4.9 },
  { id: 2, name: "Beef Bihari Kabab", orders: 18, price: "$26.99", calories: 380, protein: 38, image: kabobImage, description: "Marinated beef strips grilled to perfection with traditional Bihari spices", rating: 4.8 },
  { id: 3, name: "Chicken Biryani", orders: 21, price: "$21.99", calories: 650, protein: 35, image: biryaniImage, description: "Fragrant basmati rice layered with spiced chicken and caramelized onions", rating: 4.9 },
  { id: 4, name: "Butter Chicken", orders: 15, price: "$19.99", calories: 480, protein: 32, image: butterChickenImage, description: "Creamy tomato curry with tender chicken pieces in rich butter sauce", rating: 4.7 },
  { id: 5, name: "Garlic Naan", orders: 32, price: "$3.99", calories: 290, protein: 8, image: naanImage, description: "Soft flatbread brushed with garlic butter and fresh herbs", rating: 4.8 },
  { id: 6, name: "Mango Lassi", orders: 14, price: "$5.99", calories: 180, protein: 6, image: lassiImage, description: "Refreshing yogurt-based drink blended with sweet mango pulp", rating: 4.6 },
];

export default function PopularNow() {
  const { addToCart } = useCart();
  const { toast } = useToast();

  const { data: apiMenuData, isLoading } = useQuery<{ items: DbMenuItem[] }>({
    queryKey: ["/api/menu-items"],
  });

  const popularItems: PopularItem[] = useMemo(() => {
    const apiItems = apiMenuData?.items || [];
    
    if (apiItems.length > 0) {
      return apiItems.slice(0, 6).map((item, index) => ({
        id: index + 1000,
        name: item.name,
        orders: Math.floor(Math.random() * 30) + 10,
        price: `$${item.price}`,
        calories: parseInt(String(item.calories)),
        protein: parseInt(String(item.protein)),
        image: item.image,
        description: item.description,
        rating: 4.5 + Math.random() * 0.5,
      }));
    }
    
    return defaultPopularItems;
  }, [apiMenuData]);

  const handleAddToCart = (item: PopularItem) => {
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

  return (
    <motion.div 
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-100px" }}
      transition={{ duration: 0.6 }}
      className="space-y-6"
    >
      <div className="flex items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-2">
            <TrendingUp className="h-5 w-5 text-primary" />
            <Badge variant="secondary" className="font-medium">Trending</Badge>
          </div>
          <h2 className="text-2xl md:text-3xl font-bold" data-testid="text-popular-title">Popular Right Now</h2>
          <p className="text-muted-foreground mt-1" data-testid="text-popular-subtitle">What guests are loving this hour</p>
        </div>
      </div>

      <div className="flex gap-4 overflow-x-auto pb-4 scrollbar-hide -mx-4 px-4 md:mx-0 md:px-0">
        {popularItems.map((item, idx) => (
          <motion.div
            key={item.id}
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: idx * 0.1, duration: 0.4 }}
          >
            <Card
              className="min-w-[280px] max-w-[280px] overflow-hidden border-0 group"
              data-testid={`card-popular-${item.id}`}
            >
              <CardContent className="p-0">
                <div className="relative h-44 overflow-hidden">
                  <img
                    src={item.image}
                    alt={item.name}
                    className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                    data-testid={`img-popular-${item.id}`}
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent" />
                  <div className="absolute top-3 right-3">
                    <Badge className="bg-white/90 text-foreground border-0 shadow-lg gap-1">
                      <Star className="h-3 w-3 fill-yellow-500 text-yellow-500" />
                      {item.rating.toFixed(1)}
                    </Badge>
                  </div>
                  <div className="absolute bottom-3 left-3">
                    <Badge className="bg-primary/90 text-primary-foreground border-0 shadow-lg">
                      {item.orders} ordered today
                    </Badge>
                  </div>
                </div>
                <div className="p-4 space-y-3">
                  <div className="flex items-start justify-between gap-2">
                    <div className="flex-1 min-w-0">
                      <h3 className="font-bold text-lg truncate" data-testid={`text-popular-name-${item.id}`}>
                        {item.name}
                      </h3>
                      <p className="text-xl font-bold text-primary mt-0.5" data-testid={`text-popular-price-${item.id}`}>
                        {item.price}
                      </p>
                    </div>
                    <Button 
                      size="icon" 
                      onClick={() => handleAddToCart(item)} 
                      className="shadow-lg shadow-primary/25 shrink-0"
                      data-testid={`button-add-popular-${item.id}`}
                    >
                      <Plus className="h-4 w-4" />
                    </Button>
                  </div>
                  <div className="flex gap-2 flex-wrap">
                    <Badge variant="outline" className="bg-orange-50 dark:bg-orange-950 text-orange-700 dark:text-orange-300 border-orange-200 dark:border-orange-800" data-testid={`text-popular-calories-${item.id}`}>
                      <Flame className="h-3 w-3 mr-1" />
                      {item.calories} cal
                    </Badge>
                    <Badge variant="outline" className="bg-green-50 dark:bg-green-950 text-green-700 dark:text-green-300 border-green-200 dark:border-green-800" data-testid={`text-popular-protein-${item.id}`}>
                      <Dumbbell className="h-3 w-3 mr-1" />
                      {item.protein}g
                    </Badge>
                  </div>
                  <div className="relative h-1.5 bg-muted rounded-full overflow-hidden">
                    <motion.div
                      initial={{ width: 0 }}
                      whileInView={{ width: `${(item.orders / 32) * 100}%` }}
                      viewport={{ once: true }}
                      transition={{ delay: 0.3, duration: 0.8, ease: "easeOut" }}
                      className="absolute inset-y-0 left-0 bg-gradient-to-r from-primary to-primary/70 rounded-full"
                    />
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        ))}
      </div>
    </motion.div>
  );
}
