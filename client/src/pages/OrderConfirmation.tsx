import { useEffect, useState } from "react";
import { useLocation, Link } from "wouter";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { 
  CheckCircle, Home, ShoppingBag, Clock, Package, CheckCheck, 
  Calendar, MapPin, Flame, Dumbbell, XCircle, Sparkles, Ban,
  ChefHat, Timer, UtensilsCrossed, CookingPot
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { useQuery, useMutation } from "@tanstack/react-query";
import { apiRequest, queryClient } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";
import type { Order } from "@shared/schema";

function CelebrationConfetti() {
  const confettiColors = [
    "bg-yellow-400",
    "bg-green-400",
    "bg-blue-400",
    "bg-red-400",
    "bg-purple-400",
    "bg-pink-400",
  ];

  const confettiPieces = Array.from({ length: 50 }, (_, i) => ({
    id: i,
    color: confettiColors[Math.floor(Math.random() * confettiColors.length)],
    delay: Math.random() * 0.5,
    x: Math.random() * 100,
    rotation: Math.random() * 360,
    scale: 0.5 + Math.random() * 0.5,
  }));

  return (
    <div className="fixed inset-0 pointer-events-none z-50 overflow-hidden">
      {confettiPieces.map((piece) => (
        <motion.div
          key={piece.id}
          className={`absolute w-3 h-3 ${piece.color} rounded-sm`}
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

function FoodPreparationAnimation({ status }: { status: string }) {
  const isPreparing = status === "preparing";
  const isCompleted = status === "completed";
  const isPending = status === "pending";

  return (
    <div className="relative w-full h-48 md:h-64 overflow-hidden bg-gradient-to-br from-orange-500 via-amber-500 to-orange-600 dark:from-orange-600 dark:via-amber-600 dark:to-orange-700">
      <div className="absolute inset-0 bg-black/20" />
      
      <div className="absolute inset-0 flex items-center justify-center">
        <div className="relative flex items-center gap-6 md:gap-12">
          <motion.div
            animate={isPreparing ? { 
              rotate: [0, -15, 15, -15, 0],
              y: [0, -5, 0]
            } : {}}
            transition={{ 
              duration: 1.5, 
              repeat: Infinity,
              ease: "easeInOut"
            }}
            className="relative"
          >
            <div className={`p-4 md:p-6 rounded-full ${
              isCompleted 
                ? "bg-green-500/30 border-2 border-green-300" 
                : isPreparing 
                  ? "bg-white/20 border-2 border-white/50" 
                  : "bg-white/10 border-2 border-white/30"
            }`}>
              {isCompleted ? (
                <CheckCircle className="h-10 w-10 md:h-14 md:w-14 text-white" />
              ) : isPreparing ? (
                <CookingPot className="h-10 w-10 md:h-14 md:w-14 text-white" />
              ) : (
                <Clock className="h-10 w-10 md:h-14 md:w-14 text-white" />
              )}
            </div>
            
            {isPreparing && (
              <>
                <motion.div
                  className="absolute -top-2 left-1/2 w-1.5 h-6 bg-white/60 rounded-full"
                  animate={{ 
                    opacity: [0.3, 0.8, 0.3],
                    y: [-5, -15, -5],
                    scale: [0.8, 1.2, 0.8]
                  }}
                  transition={{ duration: 2, repeat: Infinity }}
                />
                <motion.div
                  className="absolute -top-4 left-1/3 w-1 h-5 bg-white/40 rounded-full"
                  animate={{ 
                    opacity: [0.2, 0.6, 0.2],
                    y: [-3, -12, -3],
                    scale: [0.6, 1, 0.6]
                  }}
                  transition={{ duration: 2.5, repeat: Infinity, delay: 0.3 }}
                />
                <motion.div
                  className="absolute -top-3 right-1/3 w-1 h-4 bg-white/50 rounded-full"
                  animate={{ 
                    opacity: [0.4, 0.7, 0.4],
                    y: [-2, -10, -2],
                    scale: [0.7, 1.1, 0.7]
                  }}
                  transition={{ duration: 1.8, repeat: Infinity, delay: 0.6 }}
                />
              </>
            )}
          </motion.div>

          <div className="text-center text-white">
            <motion.h2 
              className="text-2xl md:text-4xl font-bold mb-2"
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
              className="text-sm md:text-lg text-white/80"
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
          </div>

          <motion.div
            animate={isPreparing ? { 
              rotate: [0, 10, -10, 0],
              scale: [1, 1.05, 1]
            } : {}}
            transition={{ 
              duration: 2, 
              repeat: Infinity,
              ease: "easeInOut"
            }}
            className={`p-4 md:p-6 rounded-full ${
              isCompleted 
                ? "bg-green-500/30 border-2 border-green-300" 
                : isPreparing 
                  ? "bg-white/20 border-2 border-white/50" 
                  : "bg-white/10 border-2 border-white/30"
            }`}
          >
            {isCompleted ? (
              <Sparkles className="h-10 w-10 md:h-14 md:w-14 text-white" />
            ) : isPreparing ? (
              <UtensilsCrossed className="h-10 w-10 md:h-14 md:w-14 text-white" />
            ) : (
              <ChefHat className="h-10 w-10 md:h-14 md:w-14 text-white" />
            )}
          </motion.div>
        </div>
      </div>

      <motion.div 
        className="absolute bottom-0 left-0 right-0 h-1 bg-white/30"
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
    { id: "pending", icon: Clock, label: "Order Pending" },
    { id: "preparing", icon: CookingPot, label: "Preparing" },
    { id: "completed", icon: CheckCheck, label: "Completed" },
  ];
  
  const statusToStepIndex: Record<string, number> = {
    pending: 0,
    preparing: 1,
    completed: 2,
  };
  
  const currentStepIndex = statusToStepIndex[currentStatus] ?? 0;

  return (
    <div className="min-h-screen bg-background">
      {showCelebration && <CelebrationConfetti />}
      
      <header className="border-b sticky top-0 bg-background/95 backdrop-blur-md z-50" data-testid="header-order-confirmation">
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
                Home
              </Button>
            </Link>
          </div>
        </div>
      </header>

      {!isRejected && !isCancelled && (
        <FoodPreparationAnimation status={currentStatus} />
      )}

      <div className="container mx-auto px-4 py-6 md:py-8">
        {isRejected && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ type: "spring", stiffness: 100 }}
            className="max-w-3xl mx-auto mb-8"
          >
            <Card className="border-2 border-red-200 dark:border-red-800 bg-red-50 dark:bg-red-950/30">
              <CardContent className="p-6">
                <div className="flex flex-col items-center text-center gap-4">
                  <div className="inline-flex items-center justify-center w-16 h-16 bg-red-100 dark:bg-red-900/40 rounded-full">
                    <XCircle className="h-10 w-10 text-red-600 dark:text-red-400" />
                  </div>
                  <div>
                    <h2 className="text-2xl font-bold text-red-900 dark:text-red-100 mb-2" data-testid="text-order-rejected-title">
                      Order Rejected
                    </h2>
                    <p className="text-red-700 dark:text-red-300 mb-4" data-testid="text-rejection-message">
                      We're sorry, but we had to reject your order for the following reason:
                    </p>
                    <div className="bg-white dark:bg-red-950/50 border border-red-200 dark:border-red-800 rounded-md p-4">
                      <p className="text-lg font-medium text-red-900 dark:text-red-100" data-testid="text-rejection-reason">
                        {rejectionReason || "No reason provided"}
                      </p>
                    </div>
                    <p className="text-sm text-red-600 dark:text-red-400 mt-4">
                      If you have any questions, please contact our support team.
                    </p>
                  </div>
                  <div className="flex flex-wrap gap-3 mt-2 justify-center">
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
            <Card className="border-2 border-orange-200 dark:border-orange-800 bg-orange-50 dark:bg-orange-950/30">
              <CardContent className="p-6">
                <div className="flex flex-col items-center text-center gap-4">
                  <div className="inline-flex items-center justify-center w-16 h-16 bg-orange-100 dark:bg-orange-900/40 rounded-full">
                    <Ban className="h-10 w-10 text-orange-600 dark:text-orange-400" />
                  </div>
                  <div>
                    <h2 className="text-2xl font-bold text-orange-900 dark:text-orange-100 mb-2" data-testid="text-order-cancelled-title">
                      Order Cancelled
                    </h2>
                    <p className="text-orange-700 dark:text-orange-300 mb-4" data-testid="text-cancellation-message">
                      You have cancelled this order.
                    </p>
                    <p className="text-sm text-orange-600 dark:text-orange-400">
                      If this was a mistake or you'd like to place a new order, you can return to the menu.
                    </p>
                  </div>
                  <div className="flex flex-wrap gap-3 mt-2 justify-center">
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
          <div className="max-w-5xl mx-auto space-y-6">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
            >
              <Card data-testid="card-order-status">
                <CardContent className="p-4 md:p-6">
                  <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-6">
                    <div>
                      <h2 className="text-xl md:text-2xl font-bold text-foreground" data-testid="text-order-greeting">
                        Thank you, {orderData.userName}!
                      </h2>
                      <p className="text-muted-foreground text-sm md:text-base">
                        Order #{orderData.orderNumber}
                      </p>
                    </div>
                    <div className="flex flex-wrap gap-2">
                      <Badge 
                        variant="outline" 
                        className={`px-3 py-1.5 text-sm ${
                          currentStatus === "completed"
                            ? "bg-green-100 dark:bg-green-900/50 border-green-300 dark:border-green-700 text-green-800 dark:text-green-200"
                            : isConfirmed
                            ? "bg-blue-100 dark:bg-blue-900/50 border-blue-300 dark:border-blue-700 text-blue-800 dark:text-blue-200"
                            : "bg-orange-100 dark:bg-orange-900/50 border-orange-300 dark:border-orange-700 text-orange-800 dark:text-orange-200"
                        }`}
                        data-testid="badge-order-status"
                      >
                        {currentStatus === "completed" ? (
                          <><Sparkles className="h-3.5 w-3.5 mr-1.5" /> Completed</>
                        ) : isConfirmed ? (
                          <><CookingPot className="h-3.5 w-3.5 mr-1.5" /> Preparing</>
                        ) : (
                          <><Clock className="h-3.5 w-3.5 mr-1.5" /> Pending</>
                        )}
                      </Badge>
                      <Badge variant="outline" className="px-3 py-1.5 text-sm bg-muted" data-testid="badge-order-date">
                        <Calendar className="h-3.5 w-3.5 mr-1.5" />
                        {orderData.orderDate}
                      </Badge>
                    </div>
                  </div>

                  {preparationTime && isConfirmed && remainingSeconds !== null && (
                    <motion.div 
                      initial={{ opacity: 0, scale: 0.95 }}
                      animate={{ opacity: 1, scale: 1 }}
                      className="bg-gradient-to-r from-green-50 to-emerald-50 dark:from-green-950/30 dark:to-emerald-950/30 border border-green-200 dark:border-green-800 rounded-lg p-4 mb-6"
                    >
                      <div className="flex items-center justify-center gap-3">
                        <Timer className="h-6 w-6 text-green-600 dark:text-green-400" />
                        <div className="text-center">
                          <p className="text-sm text-green-700 dark:text-green-300">Estimated Ready In</p>
                          <p className="text-2xl md:text-3xl font-bold text-green-800 dark:text-green-200" data-testid="text-estimated-time">
                            {remainingSeconds > 0 ? formatTime(remainingSeconds) : "Ready Soon!"}
                          </p>
                        </div>
                      </div>
                    </motion.div>
                  )}

                  <div className="relative">
                    <div className="hidden md:block absolute top-8 left-0 right-0 h-0.5 bg-muted mx-12" />
                    <div className="grid grid-cols-3 gap-2 md:gap-4 relative z-10">
                      {orderSteps.map((step, index) => {
                        const Icon = step.icon;
                        const isActive = index <= currentStepIndex;
                        const isCompleted = index < currentStepIndex;
                        const isCurrent = index === currentStepIndex;
                        
                        return (
                          <motion.div
                            key={step.id}
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.1 * index }}
                            className="flex flex-col items-center text-center"
                          >
                            <motion.div
                              animate={{
                                scale: isCurrent ? [1, 1.05, 1] : 1,
                              }}
                              transition={{ 
                                duration: 2, 
                                repeat: isCurrent ? Infinity : 0,
                                ease: "easeInOut"
                              }}
                              className={`flex items-center justify-center w-12 h-12 md:w-16 md:h-16 rounded-full mb-2 transition-all ${
                                isCompleted
                                  ? "bg-green-500 dark:bg-green-600"
                                  : isCurrent
                                    ? step.id === "preparing"
                                      ? "bg-blue-500 dark:bg-blue-600"
                                      : "bg-orange-500 dark:bg-orange-600"
                                    : "bg-muted"
                              }`}
                            >
                              <Icon className={`h-5 w-5 md:h-7 md:w-7 ${
                                isActive ? "text-white" : "text-muted-foreground"
                              }`} />
                            </motion.div>
                            <p className={`text-xs md:text-sm font-medium ${
                              isActive ? "text-foreground" : "text-muted-foreground"
                            }`}>
                              {step.label}
                            </p>
                          </motion.div>
                        );
                      })}
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
                <Card data-testid="card-order-items">
                  <CardHeader className="pb-4">
                    <CardTitle className="flex items-center justify-between gap-2 flex-wrap">
                      <div className="flex items-center gap-2">
                        <ShoppingBag className="h-5 w-5 text-primary" />
                        <span>Order Items</span>
                      </div>
                      <Badge variant="secondary" className="text-xs">
                        {orderData.items.reduce((sum, item) => sum + item.quantity, 0)} {orderData.items.reduce((sum, item) => sum + item.quantity, 0) === 1 ? "item" : "items"}
                      </Badge>
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    {orderData.items.map((item) => (
                      <motion.div
                        key={item.id}
                        initial={{ opacity: 0, x: -10 }}
                        animate={{ opacity: 1, x: 0 }}
                        className="flex gap-4 p-3 md:p-4 rounded-lg border bg-card hover-elevate transition-all"
                        data-testid={`order-item-${item.id}`}
                      >
                        {item.image && (
                          <div className="flex-shrink-0 w-20 h-20 md:w-24 md:h-24 rounded-lg overflow-hidden">
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
                            <Badge variant="secondary" className="flex-shrink-0 text-xs">
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

                          <div className="flex items-center justify-between mt-2 pt-2 border-t">
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
                <Card className="sticky top-20" data-testid="card-order-summary">
                  <CardHeader className="pb-4">
                    <CardTitle className="flex items-center gap-2">
                      <Package className="h-5 w-5 text-primary" />
                      Order Summary
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="space-y-3">
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
                        <span className="font-bold text-xl text-primary" data-testid="text-order-total">
                          {orderData.total}
                        </span>
                      </div>
                    </div>

                    <Separator />

                    <div className="space-y-2 text-sm">
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">Email</span>
                        <span className="font-medium truncate ml-2">{orderData.userEmail}</span>
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
