import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Plus } from "lucide-react";
import karahiImage from "@assets/generated_images/Chicken_Karahi_dish_closeup_1ee23ad4.png";
import kabobImage from "@assets/generated_images/Beef_bihari_kabab_e2e73340.png";
import biryaniImage from "@assets/generated_images/Chicken_Biryani_overhead_shot_73a10a24.png";
import butterChickenImage from "@assets/generated_images/Butter_chicken_curry_8dff6ea9.png";
import naanImage from "@assets/generated_images/Garlic_naan_bread_closeup_e1772073.png";
import lassiImage from "@assets/generated_images/Mango_lassi_beverage_bebcb27b.png";

const popularItems = [
  { id: 1, name: "Chicken Karahi", orders: 24, price: "$24.99", image: karahiImage },
  { id: 2, name: "Beef Bihari Kabab", orders: 18, price: "$26.99", image: kabobImage },
  { id: 3, name: "Chicken Biryani", orders: 21, price: "$21.99", image: biryaniImage },
  { id: 4, name: "Butter Chicken", orders: 15, price: "$19.99", image: butterChickenImage },
  { id: 5, name: "Garlic Naan", orders: 32, price: "$3.99", image: naanImage },
  { id: 6, name: "Mango Lassi", orders: 14, price: "$5.99", image: lassiImage },
];

export default function PopularNow() {
  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold mb-2" data-testid="text-popular-title">Popular right now</h2>
        <p className="text-muted-foreground" data-testid="text-popular-subtitle">What guests are loving this hour.</p>
      </div>

      <div className="flex gap-4 overflow-x-auto pb-4 scrollbar-hide">
        {popularItems.map((item, idx) => (
          <Card
            key={item.id}
            className="min-w-[280px] overflow-hidden hover-elevate active-elevate-2"
            style={{ animationDelay: `${idx * 100}ms` }}
            data-testid={`card-popular-${item.id}`}
          >
            <CardContent className="p-0">
              <div className="relative h-40">
                <img
                  src={item.image}
                  alt={item.name}
                  className="w-full h-full object-cover"
                  data-testid={`img-popular-${item.id}`}
                />
                <Badge className="absolute top-2 right-2 bg-primary/90" data-testid={`badge-popular-orders-${item.id}`}>
                  🔥 {item.orders} orders today
                </Badge>
              </div>
              <div className="p-4">
                <div className="flex items-center justify-between mb-3">
                  <div>
                    <h3 className="font-bold" data-testid={`text-popular-name-${item.id}`}>{item.name}</h3>
                    <p className="text-lg font-bold text-primary" data-testid={`text-popular-price-${item.id}`}>{item.price}</p>
                  </div>
                  <Button size="icon" data-testid={`button-add-popular-${item.id}`}>
                    <Plus className="h-4 w-4" />
                  </Button>
                </div>
                <div className="h-1 bg-muted rounded-full overflow-hidden">
                  <div
                    className="h-full bg-primary transition-all duration-500"
                    style={{ width: `${(item.orders / 32) * 100}%` }}
                  />
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
