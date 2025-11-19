import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import chickenKarahiImage from "@assets/generated_images/Chicken_Karahi_dish_closeup_1ee23ad4.png";

interface DishOfTheDayProps {
  onAddToOrder?: () => void;
  onSeeSimilar?: () => void;
}

export default function DishOfTheDay({ onAddToOrder, onSeeSimilar }: DishOfTheDayProps) {
  return (
    <Card className="overflow-hidden hover-elevate active-elevate-2 border-0" data-testid="card-dish-of-day">
      <CardContent className="p-0">
        <div className="grid md:grid-cols-2 gap-6 items-center">
          <div className="relative h-64 md:h-full">
            <img
              src={chickenKarahiImage}
              alt="Chicken Karahi"
              className="w-full h-full object-cover"
              data-testid="img-dish-of-day"
            />
          </div>
          <div className="p-6 space-y-4">
            <Badge className="bg-primary/20 text-primary border-0 animate-pulse" data-testid="badge-dish-label">
              🌟 Dish of the Day
            </Badge>
            <h3 className="text-2xl font-bold" data-testid="text-dish-name">Chicken Karahi (Bone-In)</h3>
            <p className="text-muted-foreground" data-testid="text-dish-description">
              Slow-cooked tomato-based karahi with fresh ginger, chilies & coriander.
            </p>
            <div className="flex flex-wrap gap-2">
              <Badge variant="secondary" data-testid="badge-spice">🌶 Medium spice</Badge>
              <Badge variant="secondary" data-testid="badge-serves">👥 Serves 2</Badge>
              <Badge variant="secondary" data-testid="badge-time">⏱ ~25 min</Badge>
            </div>
            <div className="flex flex-wrap gap-2">
              <Badge variant="outline" className="bg-blue-50 text-blue-700 border-blue-200" data-testid="badge-calories">🔥 520 cal</Badge>
              <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200" data-testid="badge-protein">💪 42g protein</Badge>
            </div>
            <div className="flex items-center justify-between pt-2">
              <p className="text-3xl font-bold text-primary" data-testid="text-price">$24.99</p>
            </div>
            <div className="flex gap-3">
              <Button onClick={onAddToOrder} className="flex-1" data-testid="button-add-to-order">
                Add to Order
              </Button>
              <Button variant="outline" onClick={onSeeSimilar} data-testid="button-see-similar">
                See similar
              </Button>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
