import { useState, useEffect } from "react";
import { Sparkles, Heart, Clock, ChevronLeft, ChevronRight, LayoutDashboard } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/contexts/AuthContext";
import { Link } from "wouter";
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
  const { currentUser, getUserRole } = useAuth();
  const [isAdmin, setIsAdmin] = useState(false);

  useEffect(() => {
    const checkRole = async () => {
      if (currentUser) {
        const role = await getUserRole(currentUser.uid);
        setIsAdmin(role === "admin");
      } else {
        setIsAdmin(false);
      }
    };
    checkRole();
  }, [currentUser, getUserRole]);
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
              <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-bold leading-[1.1] text-white italic">
                Discovering<br />
                The Finest<br />
                Flavors Of<br />
                <span className="text-primary not-italic font-extrabold">Karahi Point!</span>
              </h1>
              
              <div className="flex flex-wrap gap-2 sm:gap-3 pt-4 sm:pt-6">
                {isAdmin ? (
                  <Link href="/admin">
                    <Button
                      size="default"
                      className="sm:h-11 sm:px-8"
                      data-testid="button-admin-dashboard"
                    >
                      <LayoutDashboard className="h-4 w-4 mr-2" />
                      Go to Dashboard
                      <span className="hidden sm:inline text-xs ml-2 opacity-80">Manage orders & menu</span>
                    </Button>
                  </Link>
                ) : (
                  <Button
                    size="default"
                    className="sm:h-11 sm:px-8"
                    onClick={onStartOrdering}
                    data-testid="button-start-ordering"
                  >
                    Start Ordering
                    <span className="hidden sm:inline text-xs ml-2 opacity-80">Browse menu & add items</span>
                  </Button>
                )}
                
                {!isAdmin && (
                  <>
                    <Button
                      variant="outline"
                      size="default"
                      className="bg-white/10 border-white/30 text-white backdrop-blur-sm sm:h-11"
                      onClick={onSurprise}
                      data-testid="button-surprise"
                    >
                      <Sparkles className="h-4 w-4 sm:mr-2" />
                      <span className="hidden sm:inline">Surprise me</span>
                    </Button>
                    <Button
                      variant="outline"
                      size="default"
                      className="bg-white/10 border-white/30 text-white backdrop-blur-sm sm:h-11"
                      onClick={onViewFavorites}
                      data-testid="button-favorites"
                    >
                      <Heart className="h-4 w-4 sm:mr-2" />
                      <span className="hidden sm:inline">View favorites</span>
                    </Button>
                    <Button
                      variant="outline"
                      size="default"
                      className="bg-white/10 border-white/30 text-white backdrop-blur-sm sm:h-11"
                      onClick={onOrderLater}
                      data-testid="button-order-later"
                    >
                      <Clock className="h-4 w-4 sm:mr-2" />
                      <span className="hidden sm:inline">Order for later</span>
                    </Button>
                  </>
                )}
              </div>
            </div>
          </div>
        </div>

        <div className="hidden sm:flex absolute right-4 top-1/2 -translate-y-1/2 flex-col gap-3 md:right-12">
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
