import { useState, useEffect, useCallback } from "react";
import { Sparkles, Heart, Clock, ChevronLeft, ChevronRight, LayoutDashboard, MapPin, Phone, Star } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useAuth } from "@/contexts/AuthContext";
import { Link } from "wouter";
import { motion, AnimatePresence } from "framer-motion";
import familyFeastImage from "@assets/generated_images/Family_feast_meal_spread_ba86b29a.png";
import biryaniStock from "@assets/stock_images/delicious_indian_bir_7b4eed52.jpg";
import tikkaStock from "@assets/stock_images/aromatic_chicken_tik_1a7c825e.jpg";
import curryStock from "@assets/stock_images/spicy_curry_lamb_mea_0e4b7828.jpg";

interface HeroProps {
  onStartOrdering?: () => void;
  onSurprise?: () => void;
  onViewFavorites?: () => void;
  onOrderLater?: () => void;
}

const heroSlides = [
  {
    image: familyFeastImage,
    title: "Discovering\nThe Finest\nFlavors Of",
    highlight: "Karahi Point!",
    subtitle: "Authentic Pakistani cuisine crafted with love and tradition",
  },
  {
    image: biryaniStock,
    title: "Aromatic\nBiryani\nMade With",
    highlight: "Pure Saffron",
    subtitle: "Premium basmati rice layered with exotic spices",
  },
  {
    image: tikkaStock,
    title: "Perfectly\nGrilled\nTikka &",
    highlight: "BBQ Delights",
    subtitle: "Charcoal-grilled perfection in every bite",
  },
  {
    image: curryStock,
    title: "Rich &\nCreamy\nCurries",
    highlight: "From Our Kitchen",
    subtitle: "Traditional recipes passed down generations",
  },
];

export default function Hero({
  onStartOrdering,
  onSurprise,
  onViewFavorites,
  onOrderLater,
}: HeroProps) {
  const { currentUser, getUserRole } = useAuth();
  const [isAdmin, setIsAdmin] = useState(false);
  const [currentSlide, setCurrentSlide] = useState(0);
  const [isPaused, setIsPaused] = useState(false);

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

  useEffect(() => {
    if (isPaused) return;
    const timer = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % heroSlides.length);
    }, 6000);
    return () => clearInterval(timer);
  }, [isPaused]);

  const nextSlide = useCallback(() => {
    setCurrentSlide((prev) => (prev + 1) % heroSlides.length);
  }, []);

  const prevSlide = useCallback(() => {
    setCurrentSlide((prev) => (prev - 1 + heroSlides.length) % heroSlides.length);
  }, []);

  const currentHero = heroSlides[currentSlide];

  return (
    <section 
      className="relative h-screen w-full overflow-hidden"
      onMouseEnter={() => setIsPaused(true)}
      onMouseLeave={() => setIsPaused(false)}
    >
      <AnimatePresence mode="wait">
        <motion.div
          key={currentSlide}
          initial={{ opacity: 0, scale: 1.1 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 1.05 }}
          transition={{ duration: 1.2, ease: "easeOut" }}
          className="absolute inset-0 bg-cover bg-center bg-no-repeat"
          style={{
            backgroundImage: `url(${currentHero.image})`,
          }}
          data-testid="img-hero-food"
        />
      </AnimatePresence>
      
      <div className="absolute inset-0 bg-gradient-to-r from-[#1a0f0a]/95 via-[#2d1810]/75 to-transparent" />
      <div className="absolute inset-0 bg-gradient-to-t from-[#1a0f0a]/90 via-transparent to-[#1a0f0a]/40" />

      <div className="relative z-10 flex flex-col h-full">
        <div className="flex-1 flex items-center">
          <div className="container mx-auto px-6 md:px-12 lg:px-20">
            <div className="max-w-2xl space-y-6">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2, duration: 0.6 }}
                className="flex items-center gap-3"
              >
                <Badge className="bg-primary/90 text-primary-foreground border-0 px-4 py-1.5 text-sm font-medium backdrop-blur-sm">
                  <Star className="h-3.5 w-3.5 mr-1.5 fill-current" />
                  4.9 Rating
                </Badge>
                <Badge variant="outline" className="bg-white/10 text-white border-white/30 px-4 py-1.5 text-sm backdrop-blur-sm">
                  <MapPin className="h-3.5 w-3.5 mr-1.5" />
                  Open Now
                </Badge>
              </motion.div>

              <AnimatePresence mode="wait">
                <motion.div
                  key={currentSlide}
                  initial={{ opacity: 0, x: -30 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: 30 }}
                  transition={{ duration: 0.5 }}
                >
                  <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-bold leading-[1.1] text-white">
                    {currentHero.title.split('\n').map((line, i) => (
                      <span key={i} className="block italic">{line}</span>
                    ))}
                    <span className="text-primary not-italic font-extrabold block mt-2">
                      {currentHero.highlight}
                    </span>
                  </h1>
                  <p className="text-lg md:text-xl text-white/80 mt-4 max-w-lg" data-testid="text-hero-subtitle">
                    {currentHero.subtitle}
                  </p>
                </motion.div>
              </AnimatePresence>
              
              <motion.div 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4, duration: 0.6 }}
                className="flex flex-wrap gap-2 sm:gap-3 pt-4 sm:pt-6"
              >
                {isAdmin ? (
                  <Link href="/admin">
                    <Button
                      size="default"
                      className="sm:h-11 sm:px-8 shadow-lg shadow-primary/25"
                      data-testid="button-admin-dashboard"
                    >
                      <LayoutDashboard className="h-4 w-4 mr-2" />
                      Go to Dashboard
                    </Button>
                  </Link>
                ) : (
                  <Link href="/menu">
                    <Button
                      size="default"
                      className="sm:h-11 sm:px-8 shadow-lg shadow-primary/25"
                      onClick={onStartOrdering}
                      data-testid="button-start-ordering"
                    >
                      Start Ordering
                    </Button>
                  </Link>
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
              </motion.div>

              <motion.div 
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.6, duration: 0.6 }}
                className="flex items-center gap-6 pt-8 text-white/70 text-sm"
              >
                <div className="flex items-center gap-2">
                  <Phone className="h-4 w-4" />
                  <span>(555) 123-4567</span>
                </div>
                <div className="h-4 w-px bg-white/30" />
                <div className="flex items-center gap-2">
                  <MapPin className="h-4 w-4" />
                  <span>Downtown Location</span>
                </div>
              </motion.div>
            </div>
          </div>
        </div>

        <div className="hidden sm:flex absolute right-4 top-1/2 -translate-y-1/2 flex-col gap-3 md:right-12">
          <Button
            size="icon"
            variant="outline"
            className="bg-white/10 border-white/30 text-white backdrop-blur-sm rounded-full"
            onClick={prevSlide}
            data-testid="button-prev-slide"
          >
            <ChevronLeft className="h-5 w-5" />
          </Button>
          <Button
            size="icon"
            variant="outline"
            className="bg-white/10 border-white/30 text-white backdrop-blur-sm rounded-full"
            onClick={nextSlide}
            data-testid="button-next-slide"
          >
            <ChevronRight className="h-5 w-5" />
          </Button>
        </div>

        <div className="absolute bottom-8 left-1/2 -translate-x-1/2 flex gap-2">
          {heroSlides.map((_, idx) => (
            <button
              key={idx}
              onClick={() => setCurrentSlide(idx)}
              className={`h-1.5 rounded-full transition-all duration-300 ${
                idx === currentSlide 
                  ? "bg-primary w-8" 
                  : "bg-white/40 w-1.5 hover:bg-white/60"
              }`}
              data-testid={`button-slide-${idx}`}
            />
          ))}
        </div>
      </div>
    </section>
  );
}
