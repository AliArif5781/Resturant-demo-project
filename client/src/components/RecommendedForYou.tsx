import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import butterChickenImage from "@assets/generated_images/Butter_chicken_curry_8dff6ea9.png";
import biryaniImage from "@assets/generated_images/Chicken_Biryani_overhead_shot_73a10a24.png";
import bbqImage from "@assets/generated_images/BBQ_mixed_grill_platter_6ba4d702.png";
import naanImage from "@assets/generated_images/Garlic_naan_bread_closeup_e1772073.png";

const recommendations = [
  {
    id: 1,
    name: "Chicken Tikka Biryani",
    description: "Aromatic rice layered with spicy grilled chicken tikka, served with raita.",
    price: "$21.99",
    image: biryaniImage,
    badge: "You ordered similar last time",
  },
  {
    id: 2,
    name: "Butter Chicken",
    description: "Rich, creamy tomato-based curry with tender chicken pieces.",
    price: "$19.99",
    image: butterChickenImage,
    badge: "Guests who like BBQ pick this",
  },
  {
    id: 3,
    name: "Mixed Grill Platter",
    description: "Seekh kabab, chicken tikka, and beef boti on a sizzling plate.",
    price: "$28.99",
    image: bbqImage,
    badge: "Popular with your table",
  },
  {
    id: 4,
    name: "Garlic Naan",
    description: "Freshly baked bread with garlic and butter.",
    price: "$3.99",
    image: naanImage,
    badge: "Perfect with karahi",
  },
];

export default function RecommendedForYou() {
  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold mb-2" data-testid="text-recommended-title">Recommended for you</h2>
        <p className="text-muted-foreground" data-testid="text-recommended-subtitle">
          Based on what you've ordered and what's popular tonight.
        </p>
      </div>

      <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {recommendations.map((item, idx) => (
          <Card
            key={item.id}
            className="overflow-hidden hover-elevate active-elevate-2 group"
            style={{ animationDelay: `${idx * 50}ms` }}
            data-testid={`card-recommended-${item.id}`}
          >
            <CardContent className="p-0">
              <div className="relative h-48 overflow-hidden">
                <img
                  src={item.image}
                  alt={item.name}
                  className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-110"
                  data-testid={`img-recommended-${item.id}`}
                />
              </div>
              <div className="p-4 space-y-2">
                <Badge variant="secondary" className="text-xs" data-testid={`badge-recommended-${item.id}`}>
                  {item.badge}
                </Badge>
                <h3 className="font-bold" data-testid={`text-recommended-name-${item.id}`}>{item.name}</h3>
                <p className="text-sm text-muted-foreground line-clamp-2" data-testid={`text-recommended-desc-${item.id}`}>
                  {item.description}
                </p>
                <p className="text-lg font-bold text-primary" data-testid={`text-recommended-price-${item.id}`}>{item.price}</p>
              </div>
            </CardContent>
            <CardFooter className="p-4 pt-0 gap-2">
              <Button className="flex-1" data-testid={`button-quick-add-${item.id}`}>Quick Add</Button>
              <Button variant="outline" data-testid={`button-details-${item.id}`}>Details</Button>
            </CardFooter>
          </Card>
        ))}
      </div>
    </div>
  );
}
