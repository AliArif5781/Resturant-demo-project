import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Flame, Dumbbell, Award } from "lucide-react";
import { motion } from "framer-motion";
import { useCart } from "@/contexts/CartContext";
import { useToast } from "@/hooks/use-toast";
import { useQuery } from "@tanstack/react-query";
import type { MenuItem as DbMenuItem } from "@shared/schema";
import { useMemo } from "react";

interface DishOfTheDayProps {
  onAddToOrder?: () => void;
}

export default function DishOfTheDay({ onAddToOrder }: DishOfTheDayProps) {
  const { addToCart } = useCart();
  const { toast } = useToast();

  const { data: apiMenuData } = useQuery<{ items: DbMenuItem[] }>({
    queryKey: ["/api/menu-items"],
  });

  const dishOfTheDay = useMemo(() => {
    const items = apiMenuData?.items || [];
    if (items.length === 0) return null;
    return items[0];
  }, [apiMenuData]);

  const handleAddToOrder = () => {
    if (!dishOfTheDay) return;
    
    addToCart({
      id: 1000,
      name: dishOfTheDay.name,
      price: `$${dishOfTheDay.price}`,
      image: dishOfTheDay.image,
      calories: parseInt(String(dishOfTheDay.calories)),
      protein: parseInt(String(dishOfTheDay.protein)),
    });
    toast({
      title: "Added to cart",
      description: `${dishOfTheDay.name} has been added to your cart.`,
    });
    onAddToOrder?.();
  };

  if (!dishOfTheDay) {
    return null;
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-100px" }}
      transition={{ duration: 0.6 }}
    >
      <Card className="overflow-hidden border-0 bg-gradient-to-br from-card to-card/80" data-testid="card-dish-of-day">
        <CardContent className="p-0">
          <div className="grid md:grid-cols-2 gap-0 items-stretch">
            <div className="relative h-72 md:h-full min-h-[300px] overflow-hidden group">
              {dishOfTheDay.image && (
                <motion.img
                  src={dishOfTheDay.image}
                  alt={dishOfTheDay.name || "Featured dish"}
                  className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                  data-testid="img-dish-of-day"
                />
              )}
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent md:bg-gradient-to-r md:from-transparent md:via-transparent md:to-black/20" />
              <div className="absolute top-4 left-4 flex gap-2">
                <Badge className="bg-primary text-primary-foreground border-0 shadow-lg">
                  <Award className="h-3.5 w-3.5 mr-1.5" />
                  Featured
                </Badge>
              </div>
            </div>
            <div className="p-6 md:p-8 lg:p-10 space-y-5 flex flex-col justify-center">
              <div className="space-y-3">
                <h3 className="text-2xl md:text-3xl font-bold text-foreground" data-testid="text-dish-name">
                  {dishOfTheDay.name || "Featured Dish"}
                </h3>
                <p className="text-foreground/70 text-base md:text-lg leading-relaxed" data-testid="text-dish-description">
                  {dishOfTheDay.description || "A delicious featured item from our menu."}
                </p>
              </div>
              
              {dishOfTheDay.category && (
                <div className="flex flex-wrap gap-2">
                  <Badge variant="secondary" className="gap-1.5 py-1.5 px-3" data-testid="badge-category">
                    <Award className="h-3.5 w-3.5 text-orange-500" />
                    {dishOfTheDay.category}
                  </Badge>
                </div>
              )}

              <div className="flex flex-wrap gap-2">
                <Badge variant="outline" className="bg-orange-50 dark:bg-orange-950 text-orange-700 dark:text-orange-300 border-orange-200 dark:border-orange-800 gap-1.5" data-testid="badge-calories">
                  <Flame className="h-3.5 w-3.5" />
                  {dishOfTheDay.calories} cal
                </Badge>
                <Badge variant="outline" className="bg-green-50 dark:bg-green-950 text-green-700 dark:text-green-300 border-green-200 dark:border-green-800 gap-1.5" data-testid="badge-protein">
                  <Dumbbell className="h-3.5 w-3.5" />
                  {dishOfTheDay.protein}g protein
                </Badge>
              </div>

              <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pt-2">
                <div className="space-y-1">
                  <p className="text-3xl md:text-4xl font-bold text-primary" data-testid="text-price">${dishOfTheDay.price}</p>
                  <p className="text-sm text-muted-foreground">Per serving</p>
                </div>
                <Button 
                  onClick={handleAddToOrder} 
                  size="lg"
                  className="w-full sm:w-auto shadow-lg shadow-primary/25" 
                  data-testid="button-add-to-order"
                >
                  Add to Order
                </Button>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
}
