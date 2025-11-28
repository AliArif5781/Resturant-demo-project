import { Sparkles, Heart, Clock, ChevronLeft, ChevronRight, ArrowUpRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import familyFeastImage from "@assets/generated_images/Family_feast_meal_spread_ba86b29a.png";

interface HeroProps {
  onStartOrdering?: () => void;
  onSurprise?: () => void;
  onViewFavorites?: () => void;
  onOrderLater?: () => void;
}

export default function Hero({
  onStartOrdering,
  onSurprise,
  onViewFavorites,
  onOrderLater,
}: HeroProps) {
  return (
    <section className="relative h-screen w-full overflow-hidden">
      <div
        className="absolute inset-0 bg-cover bg-center bg-no-repeat"
        style={{
          backgroundImage: `url(${familyFeastImage})`,
        }}
        data-testid="img-hero-food"
      />
      
      <div className="absolute inset-0 bg-gradient-to-r from-[#1a0f0a]/90 via-[#2d1810]/70 to-transparent" />
      <div className="absolute inset-0 bg-gradient-to-t from-[#1a0f0a]/80 via-transparent to-[#1a0f0a]/30" />

      <div className="relative z-10 flex flex-col h-full">
        <div className="flex-1 flex items-center">
          <div className="container mx-auto px-6 md:px-12 lg:px-20">
            <div className="max-w-2xl space-y-6 animate-in fade-in slide-in-from-left-8 duration-700">
              <h1 className="text-5xl md:text-6xl lg:text-7xl font-bold leading-[1.1] text-white italic">
                Discovering<br />
                The Finest<br />
                Flavors Of<br />
                <span className="text-primary not-italic font-extrabold">Karahi Point!</span>
              </h1>
              
              <div className="flex flex-wrap gap-3 pt-6">
                <Button
                  size="lg"
                  onClick={onStartOrdering}
                  data-testid="button-start-ordering"
                >
                  Start Ordering
                  <span className="text-xs ml-2 opacity-80">Browse menu & add items</span>
                </Button>
                
                <Button
                  variant="outline"
                  size="lg"
                  className="bg-white/10 border-white/30 text-white backdrop-blur-sm"
                  onClick={onSurprise}
                  data-testid="button-surprise"
                >
                  <Sparkles className="h-4 w-4 mr-2" />
                  Surprise me
                </Button>
                <Button
                  variant="outline"
                  size="lg"
                  className="bg-white/10 border-white/30 text-white backdrop-blur-sm"
                  onClick={onViewFavorites}
                  data-testid="button-favorites"
                >
                  <Heart className="h-4 w-4 mr-2" />
                  View favorites
                </Button>
                <Button
                  variant="outline"
                  size="lg"
                  className="bg-white/10 border-white/30 text-white backdrop-blur-sm"
                  onClick={onOrderLater}
                  data-testid="button-order-later"
                >
                  <Clock className="h-4 w-4 mr-2" />
                  Order for later
                </Button>
              </div>
            </div>
          </div>
        </div>

        <div className="absolute bottom-6 right-6 md:bottom-12 md:right-12 lg:right-20 max-w-sm">
          <div className="bg-[#1a0f0a]/60 backdrop-blur-md rounded-xl p-5 border border-white/10">
            <h3 className="text-white font-semibold text-lg mb-2">Authentic Pakistani Cuisine</h3>
            <p className="text-white/70 text-sm leading-relaxed mb-4">
              Karahi Point offers exceptional catering, bringing the essence of Pakistan to your events for a memorable experience.
            </p>
            <Button
              variant="outline"
              size="sm"
              className="bg-white/10 border-white/30 text-white backdrop-blur-sm"
              onClick={onStartOrdering}
              data-testid="button-learn-more"
            >
              Learn More
              <ArrowUpRight className="h-4 w-4 ml-1" />
            </Button>
          </div>
        </div>

        <div className="absolute right-6 top-1/2 -translate-y-1/2 flex flex-col gap-3 md:right-12">
          <Button
            size="icon"
            variant="outline"
            className="bg-white/10 border-white/30 text-white backdrop-blur-sm rounded-full"
            data-testid="button-prev-slide"
          >
            <ChevronLeft className="h-5 w-5" />
          </Button>
          <Button
            size="icon"
            variant="outline"
            className="bg-white/10 border-white/30 text-white backdrop-blur-sm rounded-full"
            data-testid="button-next-slide"
          >
            <ChevronRight className="h-5 w-5" />
          </Button>
        </div>
      </div>
    </section>
  );
}
