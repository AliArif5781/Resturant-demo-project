import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { useState } from "react";
import bbqImage from "@assets/generated_images/BBQ_mixed_grill_platter_6ba4d702.png";
import biryaniImage from "@assets/generated_images/Chicken_Biryani_overhead_shot_73a10a24.png";
import feastImage from "@assets/generated_images/Family_feast_meal_spread_ba86b29a.png";

const deals = [
  {
    id: 1,
    title: "BBQ Combo for 2",
    description: "2 BBQ items + naan + drink",
    price: "From $34.99",
    badge: "Save 15%",
    image: bbqImage,
  },
  {
    id: 2,
    title: "Family Feast 4-5",
    description: "Mixed karahi + biryani + naan",
    price: "From $64.99",
    badge: "New",
    image: feastImage,
  },
  {
    id: 3,
    title: "Late Night Biryani",
    description: "After 9 PM · Save 10%",
    price: "From $18.99",
    badge: "Limited",
    image: biryaniImage,
  },
];

export default function DealsCarousel() {
  const [currentIndex, setCurrentIndex] = useState(0);

  const next = () => setCurrentIndex((i) => (i + 1) % deals.length);
  const prev = () => setCurrentIndex((i) => (i - 1 + deals.length) % deals.length);

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between gap-4">
        <h2 className="text-2xl font-bold" data-testid="text-deals-title">Today's Specials</h2>
        <div className="flex gap-2">
          <Button size="icon" variant="outline" onClick={prev} data-testid="button-prev-deal">
            <ChevronLeft className="h-4 w-4" />
          </Button>
          <Button size="icon" variant="outline" onClick={next} data-testid="button-next-deal">
            <ChevronRight className="h-4 w-4" />
          </Button>
        </div>
      </div>

      <div className="relative overflow-hidden">
        <div
          className="flex transition-transform duration-500 ease-out"
          style={{ transform: `translateX(-${currentIndex * 100}%)` }}
        >
          {deals.map((deal) => (
            <div key={deal.id} className="min-w-full px-2">
              <Card className="overflow-hidden hover-elevate active-elevate-2 border-0" data-testid={`card-deal-${deal.id}`}>
                <CardContent className="p-0">
                  <div className="relative h-64">
                    <img
                      src={deal.image}
                      alt={deal.title}
                      className="w-full h-full object-cover"
                      data-testid={`img-deal-${deal.id}`}
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent" />
                    <div className="absolute top-4 right-4">
                      <Badge className="bg-primary text-primary-foreground" data-testid={`badge-deal-${deal.id}`}>
                        {deal.badge}
                      </Badge>
                    </div>
                    <div className="absolute bottom-0 left-0 right-0 p-6 text-white">
                      <h3 className="text-2xl font-bold mb-2" data-testid={`text-deal-title-${deal.id}`}>{deal.title}</h3>
                      <p className="text-sm text-white/90 mb-2" data-testid={`text-deal-desc-${deal.id}`}>{deal.description}</p>
                      <p className="text-lg font-bold" data-testid={`text-deal-price-${deal.id}`}>{deal.price}</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          ))}
        </div>
      </div>

      <div className="flex justify-center gap-2">
        {deals.map((_, idx) => (
          <button
            key={idx}
            onClick={() => setCurrentIndex(idx)}
            className={`w-2 h-2 rounded-full transition-all ${
              idx === currentIndex ? "bg-primary w-8" : "bg-muted"
            }`}
            data-testid={`button-dot-${idx}`}
          />
        ))}
      </div>
    </div>
  );
}
