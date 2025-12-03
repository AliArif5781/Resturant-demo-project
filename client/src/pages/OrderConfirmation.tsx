import { useEffect, useState, useMemo } from "react";

const useReducedMotion = () => {
  const [prefersReducedMotion, setPrefersReducedMotion] = useState(false);
  
  useEffect(() => {
    const mediaQuery = window.matchMedia("(prefers-reduced-motion: reduce)");
    setPrefersReducedMotion(mediaQuery.matches);
    
    const handleChange = (e: MediaQueryListEvent) => {
      setPrefersReducedMotion(e.matches);
    };
    
    mediaQuery.addEventListener("change", handleChange);
    return () => mediaQuery.removeEventListener("change", handleChange);
  }, []);
  
  return prefersReducedMotion;
};
import { useLocation, Link } from "wouter";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { 
  CheckCircle, Home, ShoppingBag, Clock, Package, CheckCheck, 
  Calendar, MapPin, Flame, Dumbbell, XCircle, Sparkles, Ban,
  ChefHat, Timer, UtensilsCrossed, CookingPot, Star, Heart,
  Utensils
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { useQuery, useMutation } from "@tanstack/react-query";
import { apiRequest, queryClient } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";
import type { Order } from "@shared/schema";
import kitchenBgImage from "@assets/stock_images/professional_restaur_b40a6500.jpg";
import biryaniImage from "@assets/generated_images/Chicken_Biryani_overhead_shot_73a10a24.png";
import karahiImage from "@assets/generated_images/Chicken_Karahi_dish_closeup_1ee23ad4.png";
import naanImage from "@assets/generated_images/Garlic_naan_bread_closeup_e1772073.png";
import tikkaImage from "@assets/stock_images/aromatic_chicken_tik_1a7c825e.jpg";

function CelebrationConfetti({ reducedMotion = false }: { reducedMotion?: boolean }) {
  const confettiColors = [
    "bg-yellow-400",
    "bg-green-400",
    "bg-blue-400",
    "bg-red-400",
    "bg-purple-400",
    "bg-pink-400",
    "bg-orange-400",
    "bg-amber-400",
  ];

  const confettiPieces = useMemo(() => Array.from({ length: 60 }, (_, i) => ({
    id: i,
    color: confettiColors[Math.floor(Math.random() * confettiColors.length)],
    delay: Math.random() * 0.5,
    x: Math.random() * 100,
    rotation: Math.random() * 360,
    scale: 0.5 + Math.random() * 0.5,
    shape: Math.random() > 0.5 ? "rounded-full" : "rounded-sm",
  })), []);

  if (reducedMotion) return null;

  return (
    <div className="fixed inset-0 pointer-events-none z-50 overflow-hidden" aria-hidden="true">
      {confettiPieces.map((piece) => (
        <motion.div
          key={piece.id}
          className={`absolute w-3 h-3 ${piece.color} ${piece.shape}`}
          initial={{
            top: "-10%",
            left: `${piece.x}%`,
            opacity: 1,
            rotate: 0,
            scale: piece.scale,
          }}
          animate={{
            top: "110%",
            opacity: [1, 1, 0],
            rotate: piece.rotation * 4,
          }}
          transition={{
            duration: 3 + Math.random() * 2,
            delay: piece.delay,
            ease: "easeIn",
          }}
        />
      ))}
    </div>
  );
}

function FloatingElements({ reducedMotion = false }: { reducedMotion?: boolean }) {
  const foodImages = [biryaniImage, karahiImage, naanImage, tikkaImage];
  
  if (reducedMotion) return null;
  
  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none" aria-hidden="true">
      {foodImages.map((img, i) => (
        <motion.div
          key={`food-${i}`}
          className="absolute hidden md:block"
          style={{
            left: i % 2 === 0 ? `${5 + i * 3}%` : `${75 + i * 3}%`,
            top: `${15 + i * 18}%`,
          }}
          animate={{ 
            y: [-5, 5, -5],
            rotate: [-3, 3, -3],
            scale: [1, 1.02, 1]
          }}
          transition={{ 
            duration: 4 + i,
            repeat: Infinity,
            ease: "easeInOut",
            delay: i * 0.5
          }}
        >
          <div className="relative">
            <div className="absolute inset-0 bg-gradient-to-br from-orange-500/30 to-amber-600/30 rounded-full blur-xl scale-110" />
            <img 
              src={img} 
              alt="" 
              className="w-16 h-16 lg:w-20 lg:h-20 rounded-full object-cover border-2 border-white/30 shadow-lg shadow-black/20"
            />
          </div>
        </motion.div>
      ))}
      
      {[...Array(8)].map((_, i) => (
        <motion.div
          key={`icon-${i}`}
          className="absolute"
          initial={{ 
            x: `${10 + Math.random() * 80}%`, 
            y: `${Math.random() * 100}%`,
            opacity: 0.15 
          }}
          animate={{ 
            y: ["-10%", "110%"],
            opacity: [0.15, 0.35, 0.15],
            rotate: [0, 180, 360]
          }}
          transition={{ 
            duration: 12 + Math.random() * 8,
            repeat: Infinity,
            delay: i * 1.5,
            ease: "linear"
          }}
        >
          {i % 4 === 0 ? (
            <Star className="h-5 w-5 md:h-6 md:w-6 text-yellow-300/40" />
          ) : i % 4 === 1 ? (
            <Sparkles className="h-6 w-6 md:h-8 md:w-8 text-white/30" />
          ) : i % 4 === 2 ? (
            <Utensils className="h-5 w-5 md:h-6 md:w-6 text-amber-200/25" />
          ) : (
            <Heart className="h-4 w-4 md:h-5 md:w-5 text-red-300/20" />
          )}
        </motion.div>
      ))}
    </div>
  );
}

function DecorativeFoodStrip() {
  const foodItems = [
    { img: biryaniImage, name: "Biryani" },
    { img: karahiImage, name: "Karahi" },
    { img: naanImage, name: "Naan" },
    { img: tikkaImage, name: "Tikka" },
  ];

  return (
    <div className="hidden xl:block fixed right-0 top-1/2 -translate-y-1/2 z-30 pr-4">
      <div className="flex flex-col gap-3">
        {foodItems.map((item, i) => (
          <motion.div
            key={i}
            initial={{ opacity: 0, x: 50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.5 + i * 0.15 }}
          >
            <motion.div
              animate={{ 
                y: [-2, 2, -2],
                rotate: [-1, 1, -1]
              }}
              transition={{ 
                duration: 3 + i * 0.5,
                repeat: Infinity,
                ease: "easeInOut"
              }}
              className="relative group"
            >
              <div className="absolute inset-0 bg-gradient-to-br from-orange-400/40 to-amber-500/40 rounded-full blur-lg scale-110 group-hover:scale-125 transition-transform" />
              <img 
                src={item.img} 
                alt={item.name}
                className="w-14 h-14 rounded-full object-cover border-2 border-white/40 shadow-lg shadow-black/20 group-hover:scale-105 transition-transform"
              />
            </motion.div>
          </motion.div>
        ))}
      </div>
    </div>
  );
}

function FoodPreparationAnimation({ status, reducedMotion = false }: { status: string; reducedMotion?: boolean }) {
  const isPreparing = status === "preparing";
  const isCompleted = status === "completed";
  const isPending = status === "pending";

  return (
    <div className="relative w-full py-10 sm:py-14 md:py-20 overflow-hidden" aria-hidden="true">
      <div 
        className="absolute inset-0 bg-cover bg-center bg-no-repeat scale-105"
        style={{ backgroundImage: `url(${kitchenBgImage})` }}
      />
      <div className="absolute inset-0 bg-gradient-to-r from-orange-900/92 via-amber-800/88 to-orange-900/92" />
      <div className="absolute inset-0 bg-gradient-to-b from-black/40 via-transparent to-black/50" />
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,transparent_0%,rgba(0,0,0,0.3)_100%)]" />
      
      <FloatingElements reducedMotion={reducedMotion} />
      
      <div className="relative flex items-center justify-center px-4">
        <div className="relative flex flex-col items-center gap-3 sm:gap-4 md:flex-row md:gap-8 lg:gap-12">
          <motion.div
            animate={isPreparing ? { 
              rotate: [0, -10, 10, -10, 0],
              y: [0, -8, 0]
            } : isCompleted ? {
              scale: [1, 1.1, 1],
            } : {}}
            transition={{ 
              duration: isPreparing ? 1.5 : 2, 
              repeat: Infinity,
              ease: "easeInOut"
            }}
            className="relative"
          >
            <div className={`p-4 sm:p-5 md:p-7 rounded-full backdrop-blur-sm transition-all duration-500 ${
              isCompleted 
                ? "bg-green-500/40 border-2 border-green-300 shadow-lg shadow-green-500/30" 
                : isPreparing 
                  ? "bg-white/25 border-2 border-white/60 shadow-lg shadow-orange-500/30" 
                  : "bg-white/15 border-2 border-white/40"
            }`}>
              {isCompleted ? (
                <CheckCircle className="h-8 w-8 sm:h-10 sm:w-10 md:h-14 md:w-14 text-white drop-shadow-lg" />
              ) : isPreparing ? (
                <CookingPot className="h-8 w-8 sm:h-10 sm:w-10 md:h-14 md:w-14 text-white drop-shadow-lg" />
              ) : (
                <Clock className="h-8 w-8 sm:h-10 sm:w-10 md:h-14 md:w-14 text-white drop-shadow-lg" />
              )}
            </div>
            
            {isPreparing && (
              <>
                <motion.div
                  className="absolute -top-3 left-1/2 -translate-x-1/2 w-2 h-8 bg-white/70 rounded-full blur-[1px]"
                  animate={{ 
                    opacity: [0.3, 0.9, 0.3],
                    y: [-5, -20, -5],
                    scale: [0.8, 1.3, 0.8]
                  }}
                  transition={{ duration: 2, repeat: Infinity }}
                />
                <motion.div
                  className="absolute -top-5 left-1/3 w-1.5 h-7 bg-white/50 rounded-full blur-[1px]"
                  animate={{ 
                    opacity: [0.2, 0.7, 0.2],
                    y: [-3, -18, -3],
                    scale: [0.6, 1.1, 0.6]
                  }}
                  transition={{ duration: 2.5, repeat: Infinity, delay: 0.3 }}
                />
                <motion.div
                  className="absolute -top-4 right-1/3 w-1.5 h-6 bg-white/60 rounded-full blur-[1px]"
                  animate={{ 
                    opacity: [0.4, 0.8, 0.4],
                    y: [-2, -15, -2],
                    scale: [0.7, 1.2, 0.7]
                  }}
                  transition={{ duration: 1.8, repeat: Infinity, delay: 0.6 }}
                />
              </>
            )}

            {isCompleted && (
              <motion.div
                className="absolute inset-0 rounded-full border-2 border-green-300"
                animate={{ scale: [1, 1.5, 1.8], opacity: [0.6, 0.3, 0] }}
                transition={{ duration: 2, repeat: Infinity }}
              />
            )}
          </motion.div>

          <div className="text-center text-white max-w-xs sm:max-w-sm md:max-w-md">
            <motion.h2 
              className="text-xl sm:text-2xl md:text-3xl lg:text-4xl font-bold mb-2 sm:mb-3 drop-shadow-lg"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
            >
              {isCompleted 
                ? "Order Ready!" 
                : isPreparing 
                  ? "Preparing Your Food" 
                  : "Order Received"
              }
            </motion.h2>
            <motion.p 
              className="text-sm sm:text-base md:text-lg text-white/90 drop-shadow"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.4 }}
            >
              {isCompleted 
                ? "Your delicious meal is ready for pickup" 
                : isPreparing 
                  ? "Our chefs are cooking your delicious meal" 
                  : "Waiting for restaurant confirmation"
              }
            </motion.p>

            <motion.div
              className="flex justify-center gap-2 mt-4"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.6 }}
            >
              {[...Array(3)].map((_, i) => (
                <motion.div
                  key={i}
                  className={`w-2 h-2 rounded-full ${
                    isCompleted ? "bg-green-300" : isPreparing ? "bg-white" : "bg-white/60"
                  }`}
                  animate={!isCompleted ? { 
                    scale: [1, 1.5, 1],
                    opacity: [0.5, 1, 0.5]
                  } : {}}
                  transition={{ 
                    duration: 1.5,
                    repeat: Infinity,
                    delay: i * 0.3
                  }}
                />
              ))}
            </motion.div>
          </div>

          <motion.div
            animate={isPreparing ? { 
              rotate: [0, 15, -15, 0],
              scale: [1, 1.08, 1]
            } : isCompleted ? {
              rotate: [0, 10, -10, 0]
            } : {}}
            transition={{ 
              duration: 2, 
              repeat: Infinity,
              ease: "easeInOut"
            }}
            className={`hidden md:block p-5 lg:p-7 rounded-full backdrop-blur-sm transition-all duration-500 ${
              isCompleted 
                ? "bg-green-500/40 border-2 border-green-300 shadow-lg shadow-green-500/30" 
                : isPreparing 
                  ? "bg-white/25 border-2 border-white/60 shadow-lg shadow-orange-500/30" 
                  : "bg-white/15 border-2 border-white/40"
            }`}
          >
            {isCompleted ? (
              <Sparkles className="h-10 w-10 lg:h-14 lg:w-14 text-white drop-shadow-lg" />
            ) : isPreparing ? (
              <UtensilsCrossed className="h-10 w-10 lg:h-14 lg:w-14 text-white drop-shadow-lg" />
            ) : (
              <ChefHat className="h-10 w-10 lg:h-14 lg:w-14 text-white drop-shadow-lg" />
            )}
          </motion.div>
        </div>
      </div>

      <motion.div 
        className="absolute bottom-0 left-0 right-0 h-1.5 bg-white/20"
      >
        <motion.div
          className={`h-full ${isCompleted ? "bg-green-400" : "bg-white"}`}
          initial={{ scaleX: 0 }}
          animate={{ 
            scaleX: isCompleted ? 1 : isPreparing ? [0.3, 0.7, 0.3] : 0.1 
          }}
          transition={{ 
            duration: isPreparing ? 3 : 0.5,
            repeat: isPreparing ? Infinity : 0,
            ease: "easeInOut"
          }}
          style={{ transformOrigin: "left" }}
        />
      </motion.div>
    </div>
  );
}

interface OrderItem {
  id: number;
  name: string;
  price: string;
  quantity: number;
  image?: string;
  description?: string;
  calories?: number;
  protein?: number;
}

interface OrderData {
  orderId?: string;
  orderNumber: string;
  items: OrderItem[];
  subtotal: string;
  tax: string;
  total: string;
  userEmail: string;
  userName: string;
  orderDate: string;
  status?: string;
}

export default function OrderConfirmation() {
  const [, setLocation] = useLocation();
  const [orderData, setOrderData] = useState<OrderData | null>(null);
  const [remainingSeconds, setRemainingSeconds] = useState<number | null>(null);
  const [showCelebration, setShowCelebration] = useState(false);
  const [celebratedOrderIds, setCelebratedOrderIds] = useState<Set<string>>(new Set());
  const { toast } = useToast();
  const prefersReducedMotion = useReducedMotion();

  useEffect(() => {
    window.scrollTo(0, 0);
    const savedOrder = sessionStorage.getItem("lastOrder");
    if (savedOrder) {
      setOrderData(JSON.parse(savedOrder));
    } else {
      setLocation("/");
    }
  }, [setLocation]);

  const { data: orderStatusData } = useQuery<{ order: Order }>({
    queryKey: ["/api/orders", orderData?.orderId],
    enabled: !!orderData?.orderId,
    refetchInterval: 3000,
  });

  const currentStatus = orderStatusData?.order?.status || orderData?.status || "pending";
  const preparationTime = orderStatusData?.order?.preparationTime;
  const rejectionReason = orderStatusData?.order?.rejectionReason;
  const guestArrived = orderStatusData?.order?.guestArrived === true;
  const isConfirmed = currentStatus === "preparing" || currentStatus === "completed";
  const isRejected = currentStatus === "rejected";
  const isCancelled = currentStatus === "cancelled";
  const canCancel = currentStatus === "pending";

  const markArrivedMutation = useMutation({
    mutationFn: async () => {
      if (!orderData?.orderId) throw new Error("No order ID");
      const response = await apiRequest("PATCH", `/api/orders/${orderData.orderId}/arrived`);
      return await response.json();
    },
    onSuccess: (data: { order: Order }) => {
      queryClient.setQueryData(["/api/orders", orderData?.orderId], data);
      queryClient.invalidateQueries({ queryKey: ["/api/orders", orderData?.orderId] });
      toast({
        title: "Welcome!",
        description: "You've been marked as arrived. Our team will bring your order shortly!",
      });
    },
    onError: (error: Error) => {
      toast({
        title: "Error",
        description: error.message || "Failed to mark as arrived. Please try again.",
        variant: "destructive",
      });
    },
  });

  const cancelOrderMutation = useMutation({
    mutationFn: async () => {
      if (!orderData?.orderId) throw new Error("No order ID");
      const response = await apiRequest("PATCH", `/api/orders/${orderData.orderId}/cancel`);
      return await response.json();
    },
    onSuccess: (data: { order: Order }) => {
      queryClient.setQueryData(["/api/orders", orderData?.orderId], data);
      queryClient.invalidateQueries({ queryKey: ["/api/orders", orderData?.orderId] });
      queryClient.invalidateQueries({ queryKey: ["/api/orders"] });
      toast({
        title: "Order Cancelled",
        description: "Your order has been cancelled successfully.",
      });
    },
    onError: (error: Error) => {
      toast({
        title: "Error",
        description: error.message || "Failed to cancel order. Please try again.",
        variant: "destructive",
      });
    },
  });

  useEffect(() => {
    if (preparationTime && isConfirmed && remainingSeconds === null) {
      const timeInMinutes = typeof preparationTime === 'number' ? preparationTime : parseInt(preparationTime.toString(), 10);
      setRemainingSeconds(timeInMinutes * 60);
    }
  }, [preparationTime, isConfirmed, remainingSeconds]);

  useEffect(() => {
    if (currentStatus === "completed" && orderData?.orderId && !celebratedOrderIds.has(orderData.orderId)) {
      setShowCelebration(true);
      setCelebratedOrderIds(prev => new Set(prev).add(orderData.orderId!));
      toast({
        title: "Order Completed!",
        description: "Your delicious meal is ready! Enjoy!",
      });
      setTimeout(() => {
        setShowCelebration(false);
      }, 5000);
    }
  }, [currentStatus, orderData?.orderId, celebratedOrderIds, toast]);

  useEffect(() => {
    if (remainingSeconds === null || remainingSeconds <= 0) {
      return;
    }

    const timer = setInterval(() => {
      setRemainingSeconds((prev) => {
        if (prev === null || prev <= 1) {
          clearInterval(timer);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [remainingSeconds]);

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  if (!orderData) {
    return null;
  }

  const orderSteps = [
    { id: "pending", icon: Clock, label: "Order Pending", sublabel: "Awaiting confirmation" },
    { id: "preparing", icon: CookingPot, label: "Preparing", sublabel: "Cooking in progress" },
    { id: "completed", icon: CheckCheck, label: "Completed", sublabel: "Ready for pickup" },
  ];
  
  const statusToStepIndex: Record<string, number> = {
    pending: 0,
    preparing: 1,
    completed: 2,
  };
  
  const currentStepIndex = statusToStepIndex[currentStatus] ?? 0;

  return (
    <div className="min-h-screen bg-gradient-to-b from-background via-muted/20 to-muted/40 relative">
      {showCelebration && <CelebrationConfetti reducedMotion={prefersReducedMotion} />}
      <DecorativeFoodStrip />
      
      <div className="hidden lg:block fixed left-0 top-0 bottom-0 w-16 bg-gradient-to-r from-orange-500/5 to-transparent pointer-events-none z-10" />
      <div className="hidden lg:block fixed right-0 top-0 bottom-0 w-16 bg-gradient-to-l from-orange-500/5 to-transparent pointer-events-none z-10" />
      
      <header className="border-b sticky top-0 bg-background/95 backdrop-blur-md z-50 shadow-sm" data-testid="header-order-confirmation">
        <div className="container mx-auto px-4 py-3">
          <div className="flex items-center justify-between gap-4">
            <Link href="/" data-testid="link-brand-home">
              <div className="flex items-center gap-3 cursor-pointer">
                <span className="font-bold text-lg" data-testid="text-brand-name">Karahi Point</span>
              </div>
            </Link>
            <Link href="/">
              <Button variant="ghost" className="gap-2" data-testid="button-home">
                <Home className="h-4 w-4" />
                <span className="hidden sm:inline">Home</span>
              </Button>
            </Link>
          </div>
        </div>
      </header>

      {!isRejected && !isCancelled && (
        <FoodPreparationAnimation status={currentStatus} reducedMotion={prefersReducedMotion} />
      )}

      <div className="container mx-auto px-4 py-6 md:py-8 lg:py-10">
        {isRejected && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ type: "spring", stiffness: 100 }}
            className="max-w-3xl mx-auto mb-8"
          >
            <Card className="border-2 border-red-200 dark:border-red-800 bg-gradient-to-br from-red-50 to-red-100/50 dark:from-red-950/30 dark:to-red-900/20 shadow-lg">
              <CardContent className="p-6 md:p-8">
                <div className="flex flex-col items-center text-center gap-4">
                  <motion.div 
                    animate={{ scale: [1, 1.05, 1] }}
                    transition={{ duration: 2, repeat: Infinity }}
                    className="inline-flex items-center justify-center w-20 h-20 bg-red-100 dark:bg-red-900/40 rounded-full shadow-inner"
                  >
                    <XCircle className="h-12 w-12 text-red-600 dark:text-red-400" />
                  </motion.div>
                  <div>
                    <h2 className="text-2xl md:text-3xl font-bold text-red-900 dark:text-red-100 mb-2" data-testid="text-order-rejected-title">
                      Order Rejected
                    </h2>
                    <p className="text-red-700 dark:text-red-300 mb-4 text-sm md:text-base" data-testid="text-rejection-message">
                      We're sorry, but we had to reject your order for the following reason:
                    </p>
                    <div className="bg-white dark:bg-red-950/50 border border-red-200 dark:border-red-800 rounded-lg p-4 shadow-sm">
                      <p className="text-lg md:text-xl font-medium text-red-900 dark:text-red-100" data-testid="text-rejection-reason">
                        {rejectionReason || "No reason provided"}
                      </p>
                    </div>
                    <p className="text-sm text-red-600 dark:text-red-400 mt-4">
                      If you have any questions, please contact our support team.
                    </p>
                  </div>
                  <div className="flex flex-wrap gap-3 mt-4 justify-center">
                    <Link href="/">
                      <Button variant="default" className="gap-2" data-testid="button-return-home">
                        <Home className="h-4 w-4" />
                        Return to Menu
                      </Button>
                    </Link>
                    <Link href="/orders">
                      <Button variant="outline" className="gap-2" data-testid="button-view-orders">
                        <ShoppingBag className="h-4 w-4" />
                        View My Orders
                      </Button>
                    </Link>
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        )}

        {isCancelled && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ type: "spring", stiffness: 100 }}
            className="max-w-3xl mx-auto mb-8"
          >
            <Card className="border-2 border-orange-200 dark:border-orange-800 bg-gradient-to-br from-orange-50 to-orange-100/50 dark:from-orange-950/30 dark:to-orange-900/20 shadow-lg">
              <CardContent className="p-6 md:p-8">
                <div className="flex flex-col items-center text-center gap-4">
                  <motion.div 
                    animate={{ rotate: [0, -5, 5, 0] }}
                    transition={{ duration: 3, repeat: Infinity }}
                    className="inline-flex items-center justify-center w-20 h-20 bg-orange-100 dark:bg-orange-900/40 rounded-full shadow-inner"
                  >
                    <Ban className="h-12 w-12 text-orange-600 dark:text-orange-400" />
                  </motion.div>
                  <div>
                    <h2 className="text-2xl md:text-3xl font-bold text-orange-900 dark:text-orange-100 mb-2" data-testid="text-order-cancelled-title">
                      Order Cancelled
                    </h2>
                    <p className="text-orange-700 dark:text-orange-300 mb-4 text-sm md:text-base" data-testid="text-cancellation-message">
                      You have cancelled this order.
                    </p>
                    <p className="text-sm text-orange-600 dark:text-orange-400">
                      If this was a mistake or you'd like to place a new order, you can return to the menu.
                    </p>
                  </div>
                  <div className="flex flex-wrap gap-3 mt-4 justify-center">
                    <Link href="/">
                      <Button variant="default" className="gap-2" data-testid="button-return-home-cancelled">
                        <Home className="h-4 w-4" />
                        Return to Menu
                      </Button>
                    </Link>
                    <Link href="/orders">
                      <Button variant="outline" className="gap-2" data-testid="button-view-orders-cancelled">
                        <ShoppingBag className="h-4 w-4" />
                        View My Orders
                      </Button>
                    </Link>
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        )}

        {!isRejected && !isCancelled && (
          <div className="max-w-6xl mx-auto space-y-6 md:space-y-8">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
            >
              <Card className="shadow-2xl border-0 bg-gradient-to-br from-card via-card to-muted/30 backdrop-blur-sm overflow-hidden relative" data-testid="card-order-status">
                <div className="absolute top-0 left-0 right-0 h-1.5 bg-gradient-to-r from-orange-400 via-amber-500 to-orange-400" />
                <div className="absolute -top-20 -right-20 w-40 h-40 bg-orange-500/5 rounded-full blur-3xl" />
                <div className="absolute -bottom-20 -left-20 w-40 h-40 bg-amber-500/5 rounded-full blur-3xl" />
                
                <CardContent className="p-5 md:p-8 lg:p-10 relative">
                  <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-8 md:mb-10">
                    <div className="flex items-start gap-4">
                      <motion.div 
                        initial={{ scale: 0 }}
                        animate={{ scale: 1 }}
                        transition={{ type: "spring", stiffness: 200, delay: 0.2 }}
                        className="hidden sm:flex items-center justify-center w-14 h-14 md:w-16 md:h-16 rounded-2xl bg-gradient-to-br from-orange-400 to-amber-500 shadow-lg shadow-orange-500/20"
                      >
                        <Utensils className="h-7 w-7 md:h-8 md:w-8 text-white" />
                      </motion.div>
                      <div>
                        <motion.h2 
                          initial={{ opacity: 0, x: -20 }}
                          animate={{ opacity: 1, x: 0 }}
                          className="text-2xl md:text-3xl lg:text-4xl font-bold bg-gradient-to-r from-foreground via-foreground to-foreground/80 bg-clip-text" 
                          data-testid="text-order-greeting"
                        >
                          Thank you, {orderData.userName}!
                        </motion.h2>
                        <motion.p 
                          initial={{ opacity: 0 }}
                          animate={{ opacity: 1 }}
                          transition={{ delay: 0.3 }}
                          className="text-muted-foreground text-sm md:text-base mt-1 flex items-center gap-2"
                        >
                          <span className="font-mono bg-muted px-2 py-0.5 rounded text-xs md:text-sm">#{orderData.orderNumber}</span>
                        </motion.p>
                      </div>
                    </div>
                    <motion.div 
                      initial={{ opacity: 0, x: 20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: 0.4 }}
                      className="flex flex-wrap gap-2"
                    >
                      <Badge 
                        variant="outline" 
                        className={`px-4 py-2 text-sm font-semibold shadow-sm ${
                          currentStatus === "completed"
                            ? "bg-gradient-to-r from-green-100 to-emerald-100 dark:from-green-900/60 dark:to-emerald-900/60 border-green-300 dark:border-green-600 text-green-800 dark:text-green-200"
                            : isConfirmed
                            ? "bg-gradient-to-r from-blue-100 to-indigo-100 dark:from-blue-900/60 dark:to-indigo-900/60 border-blue-300 dark:border-blue-600 text-blue-800 dark:text-blue-200"
                            : "bg-gradient-to-r from-orange-100 to-amber-100 dark:from-orange-900/60 dark:to-amber-900/60 border-orange-300 dark:border-orange-600 text-orange-800 dark:text-orange-200"
                        }`}
                        data-testid="badge-order-status"
                      >
                        {currentStatus === "completed" ? (
                          <><Sparkles className="h-4 w-4 mr-2" /> Completed</>
                        ) : isConfirmed ? (
                          <><CookingPot className="h-4 w-4 mr-2" /> Preparing</>
                        ) : (
                          <><Clock className="h-4 w-4 mr-2" /> Pending</>
                        )}
                      </Badge>
                      <Badge variant="outline" className="px-4 py-2 text-sm bg-muted/60 border-border shadow-sm" data-testid="badge-order-date">
                        <Calendar className="h-4 w-4 mr-2" />
                        {orderData.orderDate}
                      </Badge>
                    </motion.div>
                  </div>

                  {preparationTime && isConfirmed && remainingSeconds !== null && (
                    <motion.div 
                      initial={{ opacity: 0, scale: 0.95 }}
                      animate={{ opacity: 1, scale: 1 }}
                      className="bg-gradient-to-r from-green-50 via-emerald-50 to-teal-50 dark:from-green-950/40 dark:via-emerald-950/40 dark:to-teal-950/40 border border-green-200 dark:border-green-800 rounded-xl p-4 md:p-6 mb-6 md:mb-8 shadow-sm"
                    >
                      <div className="flex flex-col sm:flex-row items-center justify-center gap-3 sm:gap-6">
                        <div className="flex items-center gap-3">
                          <div className="p-3 bg-green-100 dark:bg-green-900/50 rounded-full">
                            <Timer className="h-7 w-7 text-green-600 dark:text-green-400" />
                          </div>
                        </div>
                        <div className="text-center sm:text-left">
                          <p className="text-sm text-green-700 dark:text-green-300 font-medium">Estimated Ready In</p>
                          <p className="text-3xl md:text-4xl font-bold text-green-800 dark:text-green-200" data-testid="text-estimated-time">
                            {remainingSeconds > 0 ? formatTime(remainingSeconds) : "Ready Soon!"}
                          </p>
                        </div>
                      </div>
                    </motion.div>
                  )}

                  <div className="relative py-8 md:py-12">
                    <div className="absolute inset-0 overflow-hidden pointer-events-none">
                      <div className="absolute top-0 left-1/4 w-32 h-32 bg-orange-500/5 rounded-full blur-3xl" />
                      <div className="absolute bottom-0 right-1/4 w-32 h-32 bg-amber-500/5 rounded-full blur-3xl" />
                      {currentStatus === "completed" && (
                        <>
                          <div className="absolute top-1/2 left-1/3 w-24 h-24 bg-green-500/10 rounded-full blur-2xl animate-pulse" />
                          <div className="absolute top-1/2 right-1/3 w-24 h-24 bg-emerald-500/10 rounded-full blur-2xl animate-pulse" />
                        </>
                      )}
                    </div>

                    <div className="hidden md:flex absolute top-1/2 left-0 right-0 -translate-y-1/2 mx-auto max-w-md justify-center items-center px-24">
                      <div className="flex-1 h-2 bg-gradient-to-r from-muted/60 via-muted/40 to-muted/60 rounded-full relative overflow-hidden">
                        <motion.div 
                          initial={{ width: 0 }}
                          animate={{ width: `${Math.min((currentStepIndex / 2) * 100 + (currentStepIndex > 0 ? 10 : 0), 100)}%` }}
                          transition={{ duration: 1, ease: "easeOut", delay: 0.3 }}
                          className="absolute inset-y-0 left-0 rounded-full"
                          style={{
                            background: currentStatus === "completed" 
                              ? "linear-gradient(90deg, #22c55e 0%, #10b981 50%, #059669 100%)" 
                              : "linear-gradient(90deg, #ea580c 0%, #f97316 50%, #fb923c 100%)",
                          }}
                        />
                        {currentStepIndex > 0 && currentStepIndex < 2 && (
                          <motion.div
                            className="absolute inset-y-0 right-0 w-8 rounded-full"
                            animate={{ opacity: [0.5, 1, 0.5], x: [-2, 2, -2] }}
                            transition={{ duration: 1.5, repeat: Infinity }}
                            style={{
                              background: "linear-gradient(90deg, transparent, rgba(251, 146, 60, 0.8))",
                              left: `${(currentStepIndex / 2) * 100}%`,
                            }}
                          />
                        )}
                      </div>
                    </div>
                    
                    <div className="grid grid-cols-3 gap-4 md:gap-8 lg:gap-12 relative z-10">
                      {orderSteps.map((step, index) => {
                        const Icon = step.icon;
                        const isActive = index <= currentStepIndex;
                        const isCompleted = index < currentStepIndex;
                        const isCurrent = index === currentStepIndex;
                        
                        const getStepGradient = () => {
                          if (isCompleted) return "from-green-400 via-green-500 to-emerald-600";
                          if (isCurrent) {
                            if (step.id === "preparing") return "from-blue-400 via-blue-500 to-indigo-600";
                            if (step.id === "completed") return "from-green-400 via-green-500 to-emerald-600";
                            return "from-orange-400 via-orange-500 to-amber-600";
                          }
                          return "";
                        };

                        const getShadowColor = () => {
                          if (isCompleted) return "shadow-green-500/40";
                          if (isCurrent) {
                            if (step.id === "preparing") return "shadow-blue-500/40";
                            if (step.id === "completed") return "shadow-green-500/40";
                            return "shadow-orange-500/40";
                          }
                          return "shadow-muted/20";
                        };

                        const getBorderColor = () => {
                          if (step.id === "preparing") return "#3b82f6";
                          if (step.id === "completed") return "#22c55e";
                          return "#f97316";
                        };
                        
                        return (
                          <motion.div
                            key={step.id}
                            initial={{ opacity: 0, y: 20, scale: 0.9 }}
                            animate={{ opacity: 1, y: 0, scale: 1 }}
                            transition={{ delay: 0.2 + 0.15 * index, type: "spring", stiffness: 120 }}
                            className="flex flex-col items-center text-center"
                          >
                            <motion.div
                              animate={{
                                scale: isCurrent ? [1, 1.08, 1] : 1,
                                y: isCurrent ? [0, -5, 0] : 0,
                              }}
                              transition={{ 
                                duration: 2, 
                                repeat: isCurrent ? Infinity : 0,
                                ease: "easeInOut"
                              }}
                              className="relative mb-5"
                            >
                              <div className={`relative flex items-center justify-center w-18 h-18 md:w-24 md:h-24 lg:w-28 lg:h-28 rounded-3xl transition-all duration-500 ${
                                isActive
                                  ? `bg-gradient-to-br ${getStepGradient()} shadow-2xl ${getShadowColor()}`
                                  : "bg-gradient-to-br from-muted/80 to-muted/60 shadow-lg border border-muted-foreground/10"
                              }`}
                              style={{
                                width: 'clamp(4.5rem, 8vw, 7rem)',
                                height: 'clamp(4.5rem, 8vw, 7rem)',
                              }}
                              >
                                {isActive && (
                                  <div className="absolute inset-0 rounded-3xl bg-gradient-to-t from-white/20 to-transparent" />
                                )}
                                
                                <motion.div
                                  animate={isCurrent ? { rotate: step.id === "pending" ? [0, 0, 0] : [0, -5, 5, 0] } : {}}
                                  transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
                                >
                                  <Icon className={`h-8 w-8 md:h-10 md:w-10 lg:h-12 lg:w-12 ${
                                    isActive ? "text-white drop-shadow-lg" : "text-muted-foreground/70"
                                  }`} />
                                </motion.div>

                                {isActive && (
                                  <div className="absolute inset-0 rounded-3xl overflow-hidden">
                                    <motion.div
                                      className="absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent -translate-x-full"
                                      animate={{ translateX: ["100%", "-100%"] }}
                                      transition={{ duration: 3, repeat: Infinity, repeatDelay: 2 }}
                                    />
                                  </div>
                                )}
                              </div>
                              
                              {isCurrent && (
                                <>
                                  <motion.div
                                    className="absolute inset-0 rounded-3xl"
                                    style={{ border: `3px solid ${getBorderColor()}` }}
                                    animate={{ scale: [1, 1.15, 1.3], opacity: [0.8, 0.4, 0] }}
                                    transition={{ duration: 2, repeat: Infinity }}
                                  />
                                  <motion.div
                                    className="absolute inset-0 rounded-3xl"
                                    style={{ border: `2px solid ${getBorderColor()}` }}
                                    animate={{ scale: [1, 1.25, 1.45], opacity: [0.5, 0.25, 0] }}
                                    transition={{ duration: 2, repeat: Infinity, delay: 0.4 }}
                                  />
                                  <motion.div
                                    className="absolute -bottom-1 left-1/2 -translate-x-1/2 w-3 h-3 rounded-full"
                                    style={{ backgroundColor: getBorderColor() }}
                                    animate={{ scale: [1, 1.3, 1], opacity: [1, 0.7, 1] }}
                                    transition={{ duration: 1.5, repeat: Infinity }}
                                  />
                                </>
                              )}
                              
                              {isCompleted && (
                                <motion.div 
                                  initial={{ scale: 0 }}
                                  animate={{ scale: 1 }}
                                  transition={{ type: "spring", stiffness: 300, delay: 0.3 }}
                                  className="absolute -top-2 -right-2 w-8 h-8 md:w-9 md:h-9 bg-gradient-to-br from-green-400 to-green-600 rounded-full flex items-center justify-center shadow-lg shadow-green-500/30 border-3 border-white dark:border-card"
                                >
                                  <CheckCircle className="h-5 w-5 md:h-6 md:w-6 text-white" />
                                </motion.div>
                              )}

                              {!isActive && (
                                <div className="absolute inset-0 rounded-3xl border-2 border-dashed border-muted-foreground/20" />
                              )}
                            </motion.div>
                            
                            <motion.div
                              initial={{ opacity: 0 }}
                              animate={{ opacity: 1 }}
                              transition={{ delay: 0.4 + 0.1 * index }}
                            >
                              <p className={`text-sm md:text-lg font-bold mb-1 ${
                                isActive 
                                  ? isCurrent 
                                    ? step.id === "preparing" ? "text-blue-600 dark:text-blue-400" 
                                      : step.id === "completed" ? "text-green-600 dark:text-green-400"
                                      : "text-orange-600 dark:text-orange-400"
                                    : "text-green-600 dark:text-green-400"
                                  : "text-muted-foreground/60"
                              }`}>
                                {step.label}
                              </p>
                              <p className={`text-xs md:text-sm hidden sm:block ${
                                isActive ? "text-muted-foreground" : "text-muted-foreground/40"
                              }`}>
                                {step.sublabel}
                              </p>
                            </motion.div>
                          </motion.div>
                        );
                      })}
                    </div>

                    <div className="flex md:hidden justify-center mt-6 gap-2">
                      {orderSteps.map((step, index) => (
                        <motion.div
                          key={step.id}
                          className={`h-1.5 rounded-full transition-all ${
                            index <= currentStepIndex 
                              ? index === currentStepIndex && currentStatus !== "completed"
                                ? "w-8 bg-orange-500"
                                : "w-6 bg-green-500"
                              : "w-6 bg-muted"
                          }`}
                          animate={index === currentStepIndex ? { scale: [1, 1.1, 1] } : {}}
                          transition={{ duration: 1.5, repeat: Infinity }}
                        />
                      ))}
                    </div>
                  </div>

                  <div className="flex flex-wrap justify-center gap-3 mt-6 pt-6 border-t">
                    {canCancel && (
                      <Button
                        variant="destructive"
                        onClick={() => cancelOrderMutation.mutate()}
                        disabled={cancelOrderMutation.isPending}
                        className="gap-2"
                        data-testid="button-cancel-order"
                      >
                        <Ban className="h-4 w-4" />
                        {cancelOrderMutation.isPending ? "Cancelling..." : "Cancel Order"}
                      </Button>
                    )}
                    {isConfirmed && !guestArrived && (
                      <Button 
                        variant="default" 
                        className="gap-2"
                        onClick={() => markArrivedMutation.mutate()}
                        disabled={markArrivedMutation.isPending}
                        data-testid="button-mark-arrived"
                      >
                        <MapPin className="h-4 w-4" />
                        {markArrivedMutation.isPending ? "Marking..." : "I Have Arrived"}
                      </Button>
                    )}
                    {guestArrived && (
                      <Badge variant="outline" className="px-4 py-2 bg-green-50 dark:bg-green-950 border-green-200 dark:border-green-800 text-green-700 dark:text-green-300">
                        <CheckCircle className="h-4 w-4 mr-2" />
                        You've Arrived - Order Coming Soon
                      </Badge>
                    )}
                    <Link href="/">
                      <Button variant="outline" className="gap-2" data-testid="button-continue-shopping">
                        <Home className="h-4 w-4" />
                        Continue Shopping
                      </Button>
                    </Link>
                  </div>
                </CardContent>
              </Card>
            </motion.div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
                className="lg:col-span-2"
              >
                <Card className="shadow-lg border-0 bg-card/80 backdrop-blur-sm" data-testid="card-order-items">
                  <CardHeader className="pb-4">
                    <CardTitle className="flex items-center justify-between gap-2 flex-wrap">
                      <div className="flex items-center gap-2">
                        <div className="p-2 bg-primary/10 rounded-lg">
                          <ShoppingBag className="h-5 w-5 text-primary" />
                        </div>
                        <span>Order Items</span>
                      </div>
                      <Badge variant="secondary" className="text-xs">
                        {orderData.items.reduce((sum, item) => sum + item.quantity, 0)} {orderData.items.reduce((sum, item) => sum + item.quantity, 0) === 1 ? "item" : "items"}
                      </Badge>
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    {orderData.items.map((item, index) => (
                      <motion.div
                        key={item.id}
                        initial={{ opacity: 0, x: -10 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: 0.1 * index }}
                        className="flex gap-4 p-3 md:p-4 rounded-xl border bg-gradient-to-r from-card to-muted/30 hover-elevate transition-all"
                        data-testid={`order-item-${item.id}`}
                      >
                        {item.image && (
                          <div className="flex-shrink-0 w-20 h-20 md:w-24 md:h-24 rounded-xl overflow-hidden shadow-md">
                            <img
                              src={item.image}
                              alt={item.name}
                              className="w-full h-full object-cover"
                              data-testid={`img-order-item-${item.id}`}
                            />
                          </div>
                        )}
                        <div className="flex-1 min-w-0">
                          <div className="flex items-start justify-between gap-2">
                            <div>
                              <h4 className="font-semibold text-foreground text-sm md:text-base truncate" data-testid={`text-order-item-name-${item.id}`}>
                                {item.name}
                              </h4>
                              {item.description && (
                                <p className="text-xs md:text-sm text-muted-foreground line-clamp-2 mt-0.5" data-testid={`text-order-item-description-${item.id}`}>
                                  {item.description}
                                </p>
                              )}
                            </div>
                            <Badge variant="secondary" className="flex-shrink-0 text-xs font-semibold">
                              x{item.quantity}
                            </Badge>
                          </div>
                          
                          <div className="flex flex-wrap items-center gap-2 mt-2">
                            {item.calories && (
                              <Badge variant="outline" className="text-xs px-2 py-0.5 bg-orange-50 dark:bg-orange-950/50 text-orange-700 dark:text-orange-300 border-orange-200 dark:border-orange-800">
                                <Flame className="h-3 w-3 mr-1" />
                                {item.calories} cal
                              </Badge>
                            )}
                            {item.protein && (
                              <Badge variant="outline" className="text-xs px-2 py-0.5 bg-green-50 dark:bg-green-950/50 text-green-700 dark:text-green-300 border-green-200 dark:border-green-800">
                                <Dumbbell className="h-3 w-3 mr-1" />
                                {item.protein}g
                              </Badge>
                            )}
                          </div>

                          <div className="flex items-center justify-between mt-2 pt-2 border-t border-border/50">
                            <span className="text-xs text-muted-foreground">
                              {item.price} each
                            </span>
                            <span className="font-semibold text-primary text-sm md:text-base" data-testid={`text-order-item-price-${item.id}`}>
                              ${(Number(item.price.replace(/[^0-9.]/g, "")) * item.quantity).toFixed(2)}
                            </span>
                          </div>
                        </div>
                      </motion.div>
                    ))}
                  </CardContent>
                </Card>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 }}
              >
                <Card className="sticky top-20 shadow-lg border-0 bg-card/80 backdrop-blur-sm" data-testid="card-order-summary">
                  <CardHeader className="pb-4">
                    <CardTitle className="flex items-center gap-2">
                      <div className="p-2 bg-primary/10 rounded-lg">
                        <Package className="h-5 w-5 text-primary" />
                      </div>
                      Order Summary
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="space-y-3 bg-muted/30 rounded-lg p-4">
                      <div className="flex justify-between items-center text-sm">
                        <span className="text-muted-foreground">Subtotal</span>
                        <span className="font-medium">{orderData.subtotal}</span>
                      </div>
                      <div className="flex justify-between items-center text-sm">
                        <span className="text-muted-foreground">Tax</span>
                        <span className="font-medium">{orderData.tax}</span>
                      </div>
                      <Separator />
                      <div className="flex justify-between items-center">
                        <span className="font-bold text-lg">Total</span>
                        <span className="font-bold text-2xl text-primary" data-testid="text-order-total">
                          {orderData.total}
                        </span>
                      </div>
                    </div>

                    <Separator />

                    <div className="space-y-3 text-sm">
                      <div className="flex justify-between items-start gap-2">
                        <span className="text-muted-foreground flex-shrink-0">Email</span>
                        <span className="font-medium truncate text-right">{orderData.userEmail}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">Order Date</span>
                        <span className="font-medium">{orderData.orderDate}</span>
                      </div>
                    </div>

                    <div className="pt-4">
                      <Link href="/orders" className="block">
                        <Button variant="outline" className="w-full gap-2" data-testid="button-view-all-orders">
                          <ShoppingBag className="h-4 w-4" />
                          View All Orders
                        </Button>
                      </Link>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
