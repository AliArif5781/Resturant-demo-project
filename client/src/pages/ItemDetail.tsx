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
      
      <main className="container mx-auto px-6 md:px-12 lg:px-20 py-8 md:py-12">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <Button 
            variant="ghost" 
            onClick={() => setLocation("/")}
            className="mb-6"
            data-testid="button-back"
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back
          </Button>

          <div className="grid md:grid-cols-2 gap-8 lg:gap-12">
            <div className="relative aspect-square md:aspect-[4/3] lg:aspect-square overflow-hidden rounded-lg">
              <img
                src={item.image}
                alt={item.name}
                className="w-full h-full object-cover"
                data-testid="img-item-detail"
              />
              <div className="absolute top-4 right-4">
                <Badge className="bg-white/90 text-foreground border-0 shadow-lg" data-testid="badge-category">
                  {item.category}
                </Badge>
              </div>
            </div>

            <div className="space-y-6">
              <div>
                <h1 className="text-3xl md:text-4xl font-bold mb-2" data-testid="text-item-name">
                  {item.name}
                </h1>
                <p className="text-3xl font-bold text-primary" data-testid="text-item-price">
                  ${item.price}
                </p>
              </div>

              <div className="flex gap-3 flex-wrap">
                <Badge 
                  variant="outline" 
                  className="bg-orange-50 dark:bg-orange-950 text-orange-700 dark:text-orange-300 border-orange-200 dark:border-orange-800 text-sm py-1 px-3"
                  data-testid="badge-calories"
                >
                  <Flame className="h-4 w-4 mr-1.5" />
                  {item.calories} calories
                </Badge>
                <Badge 
                  variant="outline" 
                  className="bg-green-50 dark:bg-green-950 text-green-700 dark:text-green-300 border-green-200 dark:border-green-800 text-sm py-1 px-3"
                  data-testid="badge-protein"
                >
                  <Dumbbell className="h-4 w-4 mr-1.5" />
                  {item.protein}g protein
                </Badge>
              </div>

              <div>
                <h2 className="text-lg font-semibold mb-2">Description</h2>
                <p className="text-muted-foreground leading-relaxed" data-testid="text-item-description">
                  {item.description}
                </p>
              </div>

              <Card className="border-0 bg-muted/50">
                <CardContent className="p-4">
                  <div className="flex items-center justify-between gap-4">
                    <div className="flex items-center gap-3">
                      <span className="text-sm font-medium text-muted-foreground">Quantity:</span>
                      <div className="flex items-center gap-2">
                        <Button
                          size="icon"
                          variant="outline"
                          onClick={decrementQuantity}
                          disabled={quantity <= 1}
                          data-testid="button-decrease-quantity"
                        >
                          <Minus className="h-4 w-4" />
                        </Button>
                        <span className="w-8 text-center font-semibold" data-testid="text-quantity">
                          {quantity}
                        </span>
                        <Button
                          size="icon"
                          variant="outline"
                          onClick={incrementQuantity}
                          data-testid="button-increase-quantity"
                        >
                          <Plus className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="text-sm text-muted-foreground">Total</p>
                      <p className="text-xl font-bold text-primary" data-testid="text-total-price">
                        ${(parseFloat(String(item.price)) * quantity).toFixed(2)}
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Button 
                size="lg" 
                className="w-full gap-2 shadow-lg shadow-primary/25"
                onClick={handleAddToCart}
                data-testid="button-add-to-cart"
              >
                <Plus className="h-5 w-5" />
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
