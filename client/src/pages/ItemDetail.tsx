import { useRoute, useLocation } from "wouter";
import { useQuery } from "@tanstack/react-query";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ArrowLeft, Plus, Flame, Dumbbell, Minus } from "lucide-react";
import { motion } from "framer-motion";
import { useCart } from "@/contexts/CartContext";
import { useToast } from "@/hooks/use-toast";
import { useState } from "react";
import type { MenuItem as DbMenuItem } from "@shared/schema";
import Header from "@/components/Header";
import Footer from "@/components/Footer";

export default function ItemDetail() {
  const [, setLocation] = useLocation();
  const [match, params] = useRoute("/item/:id");
  const { addToCart } = useCart();
  const { toast } = useToast();
  const [quantity, setQuantity] = useState(1);

  const { data: apiMenuData, isLoading } = useQuery<{ items: DbMenuItem[] }>({
    queryKey: ["/api/menu-items"],
  });

  const itemIndex = apiMenuData?.items?.findIndex((menuItem) => menuItem.id === params?.id) ?? -1;
  const item = itemIndex >= 0 ? apiMenuData?.items?.[itemIndex] : undefined;
  const numericId = itemIndex >= 0 ? itemIndex + 1000 : 0;

  const handleAddToCart = () => {
    if (!item) return;
    
    for (let i = 0; i < quantity; i++) {
      addToCart({
        id: numericId,
        name: item.name,
        price: `$${item.price}`,
        image: item.image,
        calories: parseInt(String(item.calories || 0)),
        protein: parseInt(String(item.protein || 0)),
        description: item.description,
      });
    }
    
    toast({
      title: "Added to cart",
      description: `${quantity}x ${item.name} has been added to your cart.`,
    });
  };

  const incrementQuantity = () => setQuantity((prev) => prev + 1);
  const decrementQuantity = () => setQuantity((prev) => (prev > 1 ? prev - 1 : 1));

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background">
        <Header />
        <div className="container mx-auto px-6 py-20">
          <div className="flex items-center justify-center h-64">
            <div className="animate-pulse text-muted-foreground">Loading...</div>
          </div>
        </div>
        <Footer />
      </div>
    );
  }

  if (!item) {
    return (
      <div className="min-h-screen bg-background">
        <Header />
        <div className="container mx-auto px-6 py-20">
          <div className="text-center space-y-4">
            <h1 className="text-2xl font-bold">Item not found</h1>
            <p className="text-muted-foreground">The menu item you're looking for doesn't exist.</p>
            <Button onClick={() => setLocation("/")} data-testid="button-back-home">
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back to Home
            </Button>
          </div>
        </div>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <Header />
      
      <main className="container mx-auto px-4 sm:px-6 md:px-12 lg:px-20 pt-24 pb-6 sm:pb-8 md:pb-12">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <Button 
            variant="outline" 
            onClick={() => setLocation("/")}
            className="mb-6 bg-background/80 backdrop-blur-sm border-border shadow-sm"
            data-testid="button-back"
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back
          </Button>

          <div className="flex flex-col lg:flex-row gap-6 lg:gap-12">
            <div className="relative w-full lg:w-1/2 flex-shrink-0">
              <div className="relative w-full aspect-[4/3] sm:aspect-[16/10] lg:aspect-square overflow-hidden rounded-lg">
                <img
                  src={item.image}
                  alt={item.name}
                  className="w-full h-full object-cover"
                  data-testid="img-item-detail"
                />
                <div className="absolute top-3 right-3 sm:top-4 sm:right-4">
                  <Badge className="bg-white/90 text-foreground border-0 shadow-lg text-xs sm:text-sm" data-testid="badge-category">
                    {item.category}
                  </Badge>
                </div>
              </div>
            </div>

            <div className="flex-1 space-y-4 sm:space-y-6">
              <div>
                <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold mb-1 sm:mb-2" data-testid="text-item-name">
                  {item.name}
                </h1>
                <p className="text-2xl sm:text-3xl font-bold text-primary" data-testid="text-item-price">
                  ${item.price}
                </p>
              </div>

              <div className="flex gap-2 sm:gap-3 flex-wrap">
                <Badge 
                  variant="outline" 
                  className="bg-orange-50 dark:bg-orange-950 text-orange-700 dark:text-orange-300 border-orange-200 dark:border-orange-800 text-xs sm:text-sm py-1 px-2 sm:px-3"
                  data-testid="badge-calories"
                >
                  <Flame className="h-3 w-3 sm:h-4 sm:w-4 mr-1 sm:mr-1.5" />
                  {item.calories} calories
                </Badge>
                <Badge 
                  variant="outline" 
                  className="bg-green-50 dark:bg-green-950 text-green-700 dark:text-green-300 border-green-200 dark:border-green-800 text-xs sm:text-sm py-1 px-2 sm:px-3"
                  data-testid="badge-protein"
                >
                  <Dumbbell className="h-3 w-3 sm:h-4 sm:w-4 mr-1 sm:mr-1.5" />
                  {item.protein}g protein
                </Badge>
              </div>

              <div>
                <h2 className="text-base sm:text-lg font-semibold mb-1 sm:mb-2">Description</h2>
                <p className="text-sm sm:text-base text-muted-foreground leading-relaxed" data-testid="text-item-description">
                  {item.description}
                </p>
              </div>

              <Card className="border-0 bg-muted/50">
                <CardContent className="p-3 sm:p-4">
                  <div className="flex items-center justify-between gap-3 sm:gap-4">
                    <div className="flex items-center gap-2 sm:gap-3">
                      <span className="text-xs sm:text-sm font-medium text-muted-foreground">Quantity:</span>
                      <div className="flex items-center gap-1 sm:gap-2">
                        <Button
                          size="icon"
                          variant="outline"
                          onClick={decrementQuantity}
                          disabled={quantity <= 1}
                          className="h-8 w-8 sm:h-9 sm:w-9"
                          data-testid="button-decrease-quantity"
                        >
                          <Minus className="h-3 w-3 sm:h-4 sm:w-4" />
                        </Button>
                        <span className="w-6 sm:w-8 text-center font-semibold text-sm sm:text-base" data-testid="text-quantity">
                          {quantity}
                        </span>
                        <Button
                          size="icon"
                          variant="outline"
                          onClick={incrementQuantity}
                          className="h-8 w-8 sm:h-9 sm:w-9"
                          data-testid="button-increase-quantity"
                        >
                          <Plus className="h-3 w-3 sm:h-4 sm:w-4" />
                        </Button>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="text-xs sm:text-sm text-muted-foreground">Total</p>
                      <p className="text-lg sm:text-xl font-bold text-primary" data-testid="text-total-price">
                        ${(parseFloat(String(item.price)) * quantity).toFixed(2)}
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Button 
                size="lg" 
                className="w-full gap-2 shadow-lg shadow-primary/25 text-sm sm:text-base"
                onClick={handleAddToCart}
                data-testid="button-add-to-cart"
              >
                <Plus className="h-4 w-4 sm:h-5 sm:w-5" />
                Add to Cart
              </Button>
            </div>
          </div>
        </motion.div>
      </main>

      <Footer />
    </div>
  );
}
