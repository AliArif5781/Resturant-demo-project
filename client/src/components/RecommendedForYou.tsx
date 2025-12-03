import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { motion } from "framer-motion";
import { Plus, Flame, Dumbbell, Sparkles } from "lucide-react";
import { useCart } from "@/contexts/CartContext";
import { useToast } from "@/hooks/use-toast";
import { useMemo } from "react";
import { useQuery } from "@tanstack/react-query";
import { useLocation } from "wouter";
import type { MenuItem as DbMenuItem } from "@shared/schema";

interface MenuItem {
  id: number;
  dbId: string;
  name: string;
  description: string;
  price: string;
  calories: number;
  protein: number;
  image: string;
  category: string;
}

export default function RecommendedForYou() {
  const { items: cartItems, addToCart } = useCart();
  const { toast } = useToast();
  const [, setLocation] = useLocation();

  const { data: apiMenuData } = useQuery<{ items: DbMenuItem[] }>({
    queryKey: ["/api/menu-items"],
  });

  const allMenuItems: MenuItem[] = useMemo(() => {
    const apiItems = apiMenuData?.items || [];
    
    return apiItems.map((item, index) => ({
      id: index + 1000,
      dbId: item.id,
      name: item.name || "",
      description: item.description || "",
      price: `$${item.price || "0"}`,
      calories: parseInt(String(item.calories || 0)),
      protein: parseInt(String(item.protein || 0)),
      image: item.image || "",
      category: item.category || "",
    }));
  }, [apiMenuData]);

  const recommendations = useMemo(() => {
    return allMenuItems.slice(0, 4);
  }, [allMenuItems]);

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

  if (allMenuItems.length === 0) {
    return null;
  }

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

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6">
        {recommendations.map((item, idx) => (
          <motion.div
            key={item.id}
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: idx * 0.1, duration: 0.4 }}
          >
            <Card
              className="overflow-hidden group border-0 h-full flex flex-col cursor-pointer hover-elevate"
              data-testid={`card-recommended-${item.id}`}
              onClick={() => setLocation(`/item/${item.dbId}`)}
            >
              <CardContent className="p-0 flex-1">
                <div className="relative h-36 md:h-48 overflow-hidden">
                  {item.image && (
                    <img
                      src={item.image}
                      alt={item.name}
                      className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                      data-testid={`img-recommended-${item.id}`}
                    />
                  )}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent" />
                  {item.category && (
                    <div className="absolute top-2 right-2 md:top-3 md:right-3">
                      <Badge className="bg-white/90 text-foreground border-0 shadow-lg gap-1 text-xs">
                        {item.category}
                      </Badge>
                    </div>
                  )}
                </div>
                <div className="p-3 md:p-4 space-y-2">
                  <h3 className="font-bold text-sm md:text-base line-clamp-1" data-testid={`text-recommended-name-${item.id}`}>
                    {item.name}
                  </h3>
                  <p className="text-xs md:text-sm text-muted-foreground line-clamp-4" data-testid={`text-recommended-desc-${item.id}`}>
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
                  onClick={(e) => {
                    e.stopPropagation();
                    handleQuickAdd(item);
                  }} 
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
