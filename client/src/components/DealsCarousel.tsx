import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { ChevronLeft, ChevronRight, Clock, Percent, Zap, Users } from "lucide-react";
import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import bbqImage from "@assets/generated_images/BBQ_mixed_grill_platter_6ba4d702.png";
import biryaniImage from "@assets/generated_images/Chicken_Biryani_overhead_shot_73a10a24.png";
import feastImage from "@assets/generated_images/Family_feast_meal_spread_ba86b29a.png";
import curryStock from "@assets/stock_images/spicy_curry_lamb_mea_65fcbc8c.jpg";

const deals = [
  {
    id: 1,
    title: "BBQ Combo for 2",
    description: "2 BBQ items + naan + drink",
    price: "From $34.99",
    originalPrice: "$41.99",
    badge: "Save 15%",
    badgeIcon: Percent,
    image: bbqImage,
  },
  {
    id: 2,
    title: "Family Feast 4-5",
    description: "Mixed karahi + biryani + naan",
    price: "From $64.99",
    originalPrice: "$79.99",
    badge: "Best Value",
    badgeIcon: Users,
    image: feastImage,
  },
  {
    id: 3,
    title: "Late Night Biryani",
    description: "After 9 PM special discount",
    price: "From $18.99",
    originalPrice: "$21.99",
    badge: "Limited Time",
    badgeIcon: Clock,
    image: biryaniImage,
  },
  {
    id: 4,
    title: "Curry Lovers Special",
    description: "Any 2 curries + 2 naans",
    price: "From $39.99",
    originalPrice: "$47.99",
    badge: "Popular",
    badgeIcon: Zap,
    image: curryStock,
  },
];

export default function DealsCarousel() {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isPaused, setIsPaused] = useState(false);

  useEffect(() => {
    if (isPaused) return;
    const timer = setInterval(() => {
      setCurrentIndex((i) => (i + 1) % deals.length);
    }, 5000);
    return () => clearInterval(timer);
  }, [isPaused]);

  const next = () => setCurrentIndex((i) => (i + 1) % deals.length);
  const prev = () => setCurrentIndex((i) => (i - 1 + deals.length) % deals.length);

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
                  <img
                    src={deals[currentIndex].image}
                    alt={deals[currentIndex].title}
                    className="w-full h-full object-cover"
                    data-testid={`img-deal-${deals[currentIndex].id}`}
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/50 to-black/20" />
                  <div className="absolute top-4 right-4">
                    <Badge className="bg-primary text-primary-foreground border-0 shadow-lg gap-1.5 px-3 py-1.5" data-testid={`badge-deal-${deals[currentIndex].id}`}>
                      {(() => {
                        const Icon = deals[currentIndex].badgeIcon;
                        return <Icon className="h-3.5 w-3.5" />;
                      })()}
                      {deals[currentIndex].badge}
                    </Badge>
                  </div>
                  <div className="absolute bottom-0 left-0 right-0 p-6 md:p-8">
                    <motion.div
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.2 }}
                    >
                      <h3 className="text-2xl md:text-3xl font-bold mb-2 text-white" data-testid={`text-deal-title-${deals[currentIndex].id}`}>
                        {deals[currentIndex].title}
                      </h3>
                      <p className="text-base md:text-lg text-white/90 mb-3" data-testid={`text-deal-desc-${deals[currentIndex].id}`}>
                        {deals[currentIndex].description}
                      </p>
                      <div className="flex items-center gap-3">
                        <p className="text-xl md:text-2xl font-bold text-white" data-testid={`text-deal-price-${deals[currentIndex].id}`}>
                          {deals[currentIndex].price}
                        </p>
                        <p className="text-lg text-white/60 line-through">
                          {deals[currentIndex].originalPrice}
                        </p>
                      </div>
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
