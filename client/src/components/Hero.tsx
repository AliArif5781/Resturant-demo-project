import { Sparkles, Heart, Clock } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import familyFeastImage from "@assets/generated_images/Family_feast_meal_spread_ba86b29a.png";

interface HeroProps {
  onStartOrdering?: () => void;
  onSurprise?: () => void;
  onViewFavorites?: () => void;
  onOrderLater?: () => void;
  activeOrder?: {
    orderNumber: string;
    status: string;
    timeLeft: string;
  };
}

export default function Hero({
  onStartOrdering,
  onSurprise,
  onViewFavorites,
  onOrderLater,
  activeOrder,
}: HeroProps) {
  return (
    <section className="relative overflow-hidden bg-gradient-to-br from-slate-900 via-slate-800 to-orange-900 text-white">
      <div className="absolute inset-0 opacity-30">
        <div className="absolute top-20 left-10 w-72 h-72 bg-orange-500 rounded-full blur-3xl animate-pulse" />
        <div className="absolute bottom-20 right-10 w-96 h-96 bg-blue-500 rounded-full blur-3xl animate-pulse" style={{ animationDelay: "1s" }} />
      </div>

      <div className="container mx-auto px-4 py-12 md:py-20 relative z-10">
        {activeOrder && (
          <div className="mb-6 animate-in fade-in slide-in-from-top-4 duration-500">
            <Badge className="bg-primary/20 text-primary-foreground border border-primary/50 px-4 py-2" data-testid="badge-active-order">
              <span className="inline-block w-2 h-2 bg-primary rounded-full mr-2 animate-pulse" />
              Order #{activeOrder.orderNumber} · {activeOrder.status} · ~{activeOrder.timeLeft} left
            </Badge>
          </div>
        )}

        <div className="grid md:grid-cols-2 gap-12 items-center">
          <div className="space-y-6 animate-in fade-in slide-in-from-left-8 duration-700">
            <p className="text-primary text-sm font-medium uppercase tracking-wide">
              Order from your phone. Skip the wait.
            </p>
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold leading-tight">
              Good evening, let's get your food started.
            </h1>
            <p className="text-lg text-slate-300 leading-relaxed">
              Browse the full Karahi Point menu, get smart suggestions, and order without waiting for a server.
            </p>

            <div className="space-y-4 pt-4">
              <Button
                size="lg"
                className="w-full sm:w-auto text-base px-8"
                onClick={onStartOrdering}
                data-testid="button-start-ordering"
              >
                Start Ordering
                <span className="text-xs ml-2 opacity-80">Browse menu & add items</span>
              </Button>

              <div className="flex flex-wrap gap-3">
                <Button
                  variant="outline"
                  className="bg-white/10 border-white/20 hover:bg-white/20 backdrop-blur-sm"
                  onClick={onSurprise}
                  data-testid="button-surprise"
                >
                  <Sparkles className="h-4 w-4 mr-2" />
                  Surprise me
                </Button>
                <Button
                  variant="outline"
                  className="bg-white/10 border-white/20 hover:bg-white/20 backdrop-blur-sm"
                  onClick={onViewFavorites}
                  data-testid="button-favorites"
                >
                  <Heart className="h-4 w-4 mr-2" />
                  View favorites
                </Button>
                <Button
                  variant="outline"
                  className="bg-white/10 border-white/20 hover:bg-white/20 backdrop-blur-sm"
                  onClick={onOrderLater}
                  data-testid="button-order-later"
                >
                  <Clock className="h-4 w-4 mr-2" />
                  Order for later
                </Button>
              </div>
            </div>
          </div>

          <div className="relative animate-in fade-in slide-in-from-right-8 duration-700 delay-150 hidden md:block">
            <div className="relative">
              <img
                src={familyFeastImage}
                alt="Delicious food spread"
                className="rounded-2xl shadow-2xl"
                data-testid="img-hero-food"
              />
              <div className="absolute -bottom-4 -left-4 bg-white text-foreground p-4 rounded-xl shadow-xl animate-in zoom-in duration-500 delay-300">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center">
                    🔥
                  </div>
                  <div>
                    <p className="font-bold text-sm">Dish of the Day</p>
                    <p className="text-xs text-muted-foreground">Chicken Karahi</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
