import { useMemo } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Plus, Flame, Dumbbell, TrendingUp } from "lucide-react";
import { motion } from "framer-motion";
import { useCart } from "@/contexts/CartContext";
import { useToast } from "@/hooks/use-toast";
import { useQuery } from "@tanstack/react-query";
import { useLocation } from "wouter";
import type { MenuItem as DbMenuItem } from "@shared/schema";

interface PopularItem {
  id: number;
  dbId: string;
  name: string;
  price: string;
  calories: number;
  protein: number;
  image: string;
  description: string;
  category: string;
}

export default function PopularNow() {
  const { addToCart } = useCart();
  const { toast } = useToast();
  const [, setLocation] = useLocation();

  const { data: apiMenuData, isLoading } = useQuery<{ items: DbMenuItem[] }>({
    queryKey: ["/api/menu-items"],
  });

  const popularItems: PopularItem[] = useMemo(() => {
    const apiItems = apiMenuData?.items || [];
    
    return apiItems.slice(0, 6).map((item, index) => ({
      id: index + 1000,
      dbId: item.id,
      name: item.name || "",
      price: `$${item.price || "0"}`,
      calories: parseInt(String(item.calories || 0)),
      protein: parseInt(String(item.protein || 0)),
      image: item.image || "",
      description: item.description || "",
      category: item.category || "",
    }));
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

  if (popularItems.length === 0) {
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
              className="min-w-[280px] max-w-[280px] overflow-hidden border-0 group cursor-pointer hover-elevate"
              data-testid={`card-popular-${item.id}`}
              onClick={() => setLocation(`/item/${item.dbId}`)}
            >
              <CardContent className="p-0">
                <div className="relative h-44 overflow-hidden">
                  {item.image && (
                    <img
                      src={item.image}
                      alt={item.name}
                      className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                      data-testid={`img-popular-${item.id}`}
                    />
                  )}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent" />
                  {item.category && (
                    <div className="absolute top-3 right-3">
                      <Badge className="bg-white/90 text-foreground border-0 shadow-lg gap-1">
                        {item.category}
                      </Badge>
                    </div>
                  )}
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
                      onClick={(e) => {
                        e.stopPropagation();
                        handleAddToCart(item);
                      }} 
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
                </div>
              </CardContent>
            </Card>
          </motion.div>
        ))}
      </div>
    </motion.div>
  );
}
