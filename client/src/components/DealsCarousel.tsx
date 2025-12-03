import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { useState, useEffect, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useQuery } from "@tanstack/react-query";
import type { MenuItem as DbMenuItem } from "@shared/schema";

interface Deal {
  id: number;
  title: string;
  description: string;
  price: string;
  image: string;
  category: string;
}

export default function DealsCarousel() {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isPaused, setIsPaused] = useState(false);

  const { data: apiMenuData } = useQuery<{ items: DbMenuItem[] }>({
    queryKey: ["/api/menu-items"],
  });

  const deals: Deal[] = useMemo(() => {
    const items = apiMenuData?.items || [];
    if (items.length === 0) return [];
    
    return items.slice(0, 4).map((item, index) => ({
      id: index + 1,
      title: item.name || "",
      description: item.description || "",
      price: `$${item.price || "0"}`,
      image: item.image || "",
      category: item.category || "",
    }));
  }, [apiMenuData]);

  useEffect(() => {
    if (isPaused || deals.length === 0) return;
    const timer = setInterval(() => {
      setCurrentIndex((i) => (i + 1) % deals.length);
    }, 5000);
    return () => clearInterval(timer);
  }, [isPaused, deals.length]);

  const next = () => deals.length > 0 && setCurrentIndex((i) => (i + 1) % deals.length);
  const prev = () => deals.length > 0 && setCurrentIndex((i) => (i - 1 + deals.length) % deals.length);

  if (deals.length === 0) {
    return null;
  }

  return (
    <motion.div 
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-100px" }}
      transition={{ duration: 0.6 }}
      className="space-y-4"
      onMouseEnter={() => setIsPaused(true)}
      onMouseLeave={() => setIsPaused(false)}
    >
      <div className="flex items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl md:text-3xl font-bold" data-testid="text-deals-title">Today's Specials</h2>
          <p className="text-muted-foreground mt-1">Limited time offers you don't want to miss</p>
        </div>
        <div className="flex gap-2">
          <Button size="icon" variant="outline" onClick={prev} data-testid="button-prev-deal">
            <ChevronLeft className="h-4 w-4" />
          </Button>
          <Button size="icon" variant="outline" onClick={next} data-testid="button-next-deal">
            <ChevronRight className="h-4 w-4" />
          </Button>
        </div>
      </div>

      <div className="relative overflow-hidden rounded-lg">
        <AnimatePresence mode="wait">
          <motion.div
            key={currentIndex}
            initial={{ opacity: 0, x: 100 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -100 }}
            transition={{ duration: 0.4, ease: "easeOut" }}
          >
            <Card className="overflow-hidden border-0" data-testid={`card-deal-${deals[currentIndex].id}`}>
              <CardContent className="p-0">
                <div className="relative h-64 md:h-80">
                  {deals[currentIndex].image && (
                    <img
                      src={deals[currentIndex].image}
                      alt={deals[currentIndex].title}
                      className="w-full h-full object-cover"
                      data-testid={`img-deal-${deals[currentIndex].id}`}
                    />
                  )}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/50 to-black/20" />
                  {deals[currentIndex].category && (
                    <div className="absolute top-4 right-4">
                      <Badge className="bg-primary text-primary-foreground border-0 shadow-lg gap-1.5 px-3 py-1.5" data-testid={`badge-deal-${deals[currentIndex].id}`}>
                        {deals[currentIndex].category}
                      </Badge>
                    </div>
                  )}
                  <div className="absolute bottom-0 left-0 right-0 p-6 md:p-8">
                    <motion.div
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.2 }}
                    >
                      <h3 className="text-2xl md:text-3xl font-bold mb-2 text-gray-100" data-testid={`text-deal-title-${deals[currentIndex].id}`}>
                        {deals[currentIndex].title}
                      </h3>
                      <p className="hidden lg:block text-base md:text-lg text-gray-300 mb-3" data-testid={`text-deal-desc-${deals[currentIndex].id}`}>
                        {deals[currentIndex].description}
                      </p>
                      <p className="text-xl md:text-2xl font-bold text-gray-100" data-testid={`text-deal-price-${deals[currentIndex].id}`}>
                        {deals[currentIndex].price}
                      </p>
                    </motion.div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        </AnimatePresence>
      </div>

      <div className="flex justify-center gap-2">
        {deals.map((_, idx) => (
          <button
            key={idx}
            onClick={() => setCurrentIndex(idx)}
            className={`h-1.5 rounded-full transition-all duration-300 ${
              idx === currentIndex ? "bg-primary w-8" : "bg-muted w-1.5 hover:bg-muted-foreground/50"
            }`}
            data-testid={`button-dot-${idx}`}
          />
        ))}
      </div>
    </motion.div>
  );
}
