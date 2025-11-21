import { useEffect, useState } from "react";
import { useLocation, Link } from "wouter";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { CheckCircle, Home, ShoppingBag, Clock, Package, Truck, CheckCheck, Download, Calendar, MapPin, Flame, Dumbbell, Loader2 } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { useQuery, useMutation } from "@tanstack/react-query";
import { apiRequest, queryClient } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";
import type { Order } from "@shared/schema";

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
  const { toast } = useToast();

  useEffect(() => {
    window.scrollTo(0, 0);
    
    // Get order data from sessionStorage
    const savedOrder = sessionStorage.getItem("lastOrder");
    if (savedOrder) {
      setOrderData(JSON.parse(savedOrder));
    } else {
      // If no order data, redirect to home
      setLocation("/");
    }
  }, [setLocation]);

  // Fetch real-time order status from API
  const { data: orderStatusData } = useQuery<{ order: Order }>({
    queryKey: ["/api/orders", orderData?.orderId],
    enabled: !!orderData?.orderId,
    refetchInterval: 3000, // Poll every 3 seconds for status updates
  });

  // Use real-time status if available, otherwise use cached status
  const currentStatus = orderStatusData?.order?.status || orderData?.status || "pending";
  const preparationTime = orderStatusData?.order?.preparationTime;
  const guestArrived = orderStatusData?.order?.guestArrived === "true";
  const isConfirmed = currentStatus === "preparing" || currentStatus === "completed";

  // Mutation to mark guest as arrived
  const markArrivedMutation = useMutation({
    mutationFn: async () => {
      if (!orderData?.orderId) throw new Error("No order ID");
      await apiRequest("PATCH", `/api/orders/${orderData.orderId}/arrived`);
    },
    onSuccess: () => {
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

  // Initialize countdown timer when preparation time is available
  useEffect(() => {
    if (preparationTime && isConfirmed && remainingSeconds === null) {
      // Convert minutes to seconds
      const timeInMinutes = typeof preparationTime === 'number' ? preparationTime : parseInt(preparationTime.toString(), 10);
      setRemainingSeconds(timeInMinutes * 60);
    }
  }, [preparationTime, isConfirmed, remainingSeconds]);

  // Countdown timer effect
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

  // Format time as MM:SS
  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  if (!orderData) {
    return null;
  }

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        type: "spring",
        stiffness: 100,
      },
    },
  };

  const orderSteps = [
    { id: "pending", icon: Clock, label: "Order Pending", time: "Processing" },
    { id: "preparing", icon: Package, label: "Preparing", time: "Pending" },
    { id: "ready", icon: Truck, label: "Out for Delivery", time: "Pending" },
    { id: "completed", icon: CheckCheck, label: "Delivered", time: "Pending" },
  ];
  
  // Map status to step index
  const statusToStepIndex: Record<string, number> = {
    pending: 0,
    preparing: 1,
    ready: 2,
    completed: 3,
  };
  
  const currentStepIndex = statusToStepIndex[currentStatus] ?? 0;

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b sticky top-0 bg-background z-50" data-testid="header-order-confirmation">
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

      <div className="container mx-auto px-4 py-8">
        {/* Success Message */}
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ type: "spring", stiffness: 100 }}
          className="text-center mb-8"
        >
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ type: "spring", delay: 0.2, stiffness: 200 }}
            className={`inline-flex items-center justify-center w-24 h-24 bg-gradient-to-br ${
              isConfirmed
                ? "from-green-100 to-emerald-200 dark:from-green-900/40 dark:to-emerald-800/40"
                : "from-orange-100 to-amber-200 dark:from-orange-900/40 dark:to-amber-800/40"
            } rounded-full mb-6 shadow-lg`}
          >
            {isConfirmed ? (
              <CheckCircle className="h-16 w-16 text-green-600 dark:text-green-400" />
            ) : (
              <motion.div
                animate={{ rotate: 360 }}
                transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
              >
                <Loader2 className="h-16 w-16 text-orange-600 dark:text-orange-400" />
              </motion.div>
            )}
          </motion.div>
          <h1 className={`text-5xl font-bold mb-3 bg-gradient-to-r ${
            isConfirmed
              ? "from-green-600 to-emerald-600 dark:from-green-400 dark:to-emerald-400"
              : "from-orange-600 to-amber-600 dark:from-orange-400 dark:to-amber-400"
          } bg-clip-text text-transparent`} data-testid="text-order-success-title">
            {isConfirmed ? "Order Confirmed Successfully!" : "Your Order is Pending"}
          </h1>
          <p className="text-xl text-muted-foreground mb-6 max-w-2xl mx-auto" data-testid="text-order-success-subtitle">
            {isConfirmed
              ? `Great news, ${orderData.userName}! Your order has been confirmed and our kitchen is now preparing your delicious meal.`
              : `Thank you for your order, ${orderData.userName}! Your order has been received and is currently being processed. We'll notify you once it's confirmed and ready for preparation.`
            }
          </p>
          <div className="flex flex-wrap items-center justify-center gap-4">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.4 }}
            >
              <Badge variant="outline" className={`text-lg px-6 py-3 ${
                isConfirmed
                  ? "bg-green-50 dark:bg-green-950 border-green-200 dark:border-green-800 text-green-700 dark:text-green-300"
                  : "bg-orange-50 dark:bg-orange-950 border-orange-200 dark:border-orange-800 text-orange-700 dark:text-orange-300"
              }`}>
                {isConfirmed ? (
                  <>
                    <Package className="h-4 w-4 mr-2" />
                    Status: Preparing
                  </>
                ) : (
                  <>
                    <Clock className="h-4 w-4 mr-2" />
                    Status: Pending
                  </>
                )}
              </Badge>
            </motion.div>
            {preparationTime && isConfirmed && remainingSeconds !== null && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.45 }}
              >
                <Badge variant="outline" className="text-lg px-6 py-3 bg-green-50 dark:bg-green-950 border-green-200 dark:border-green-800 text-green-700 dark:text-green-300">
                  <Clock className="h-4 w-4 mr-2" />
                  Est. Time: {remainingSeconds > 0 ? formatTime(remainingSeconds) : "Ready Soon!"}
                </Badge>
              </motion.div>
            )}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.5 }}
            >
              <Badge variant="outline" className="text-lg px-6 py-3 bg-blue-50 dark:bg-blue-950 border-blue-200 dark:border-blue-800 text-blue-700 dark:text-blue-300">
                <Calendar className="h-4 w-4 mr-2" />
                {orderData.orderDate}
              </Badge>
            </motion.div>
          </div>
        </motion.div>

        {/* Order Timeline */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="max-w-5xl mx-auto mb-8"
        >
          <Card data-testid="card-order-timeline">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                {isConfirmed ? (
                  <>
                    <Package className="h-5 w-5 text-green-600 dark:text-green-400" />
                    Order Status - Preparing Your Food
                  </>
                ) : (
                  <>
                    <Clock className="h-5 w-5 text-orange-600 dark:text-orange-400" />
                    Order Status - Awaiting Confirmation
                  </>
                )}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-4 gap-4 md:gap-2">
                {orderSteps.map((step, index) => {
                  const Icon = step.icon;
                  // Check if this step is active (current or completed)
                  const isActive = index <= currentStepIndex;
                  const isCompleted = index < currentStepIndex;
                  const isCurrent = index === currentStepIndex;
                  
                  return (
                    <motion.div
                      key={index}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: 0.1 * index }}
                      className="relative"
                    >
                      <div className="flex flex-col items-center text-center gap-3">
                        <motion.div
                          animate={{
                            scale: isActive ? 1 : 0.9,
                            opacity: isActive ? 1 : 0.5,
                          }}
                          transition={{ duration: 0.3 }}
                          className={`flex items-center justify-center w-16 h-16 rounded-full ${
                            isCompleted
                              ? "bg-green-100 dark:bg-green-900/30 border-2 border-green-500"
                              : isActive
                              ? step.id === "preparing"
                                ? "bg-green-100 dark:bg-green-900/30 border-2 border-green-500"
                                : isCurrent
                                  ? "bg-orange-100 dark:bg-orange-900/30 border-2 border-orange-500 animate-pulse"
                                  : "bg-green-100 dark:bg-green-900/30 border-2 border-green-500"
                              : "bg-muted border-2 border-muted-foreground/20"
                          }`}
                        >
                          <Icon
                            className={`h-7 w-7 ${
                              isCompleted
                                ? "text-green-600 dark:text-green-400"
                                : isActive
                                ? step.id === "preparing"
                                  ? "text-green-600 dark:text-green-400"
                                  : isCurrent
                                    ? "text-orange-600 dark:text-orange-400"
                                    : "text-green-600 dark:text-green-400"
                                : "text-muted-foreground"
                            }`}
                          />
                        </motion.div>
                        <div>
                          <p
                            className={`font-semibold text-sm ${
                              isActive 
                                ? step.id === "preparing" && isActive
                                  ? "text-green-600 dark:text-green-400"
                                  : "text-foreground"
                                : "text-muted-foreground"
                            }`}
                          >
                            {step.label}
                          </p>
                          <p className={`text-xs mt-1 ${
                            isCurrent 
                              ? step.id === "preparing"
                                ? "text-green-600 dark:text-green-400 font-medium"
                                : "text-orange-600 dark:text-orange-400 font-medium"
                              : "text-muted-foreground"
                          }`}>
                            {step.id === "preparing" && remainingSeconds !== null && (isActive || isCurrent)
                              ? remainingSeconds > 0 
                                ? formatTime(remainingSeconds)
                                : "Ready Soon!"
                              : isCurrent 
                                ? "Processing" 
                                : isCompleted 
                                  ? "Completed" 
                                  : "Pending"}
                          </p>
                        </div>
                      </div>
                      {index < orderSteps.length - 1 && (
                        <div className="hidden md:block absolute top-8 left-[calc(50%+2rem)] w-[calc(100%-4rem)] h-0.5 bg-gradient-to-r from-muted-foreground/20 to-transparent" />
                      )}
                    </motion.div>
                  );
                })}
              </div>
            </CardContent>
          </Card>
        </motion.div>

        {/* Order Items */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          className="max-w-5xl mx-auto mb-8"
        >
          <Card data-testid="card-order-items">
            <CardHeader>
              <CardTitle className="flex items-center gap-3 text-2xl">
                <div className="p-3 bg-gradient-to-br from-primary/10 to-primary/5 rounded-full">
                  <ShoppingBag className="h-6 w-6 text-primary" />
                </div>
                Your Order Details
                <Badge variant="secondary" className="ml-auto">
                  {orderData.items.reduce((sum, item) => sum + item.quantity, 0)} {orderData.items.reduce((sum, item) => sum + item.quantity, 0) === 1 ? "item" : "items"}
                </Badge>
              </CardTitle>
            </CardHeader>
            <CardContent className="p-6">
              <motion.div
                variants={containerVariants}
                initial="hidden"
                animate="visible"
                className="space-y-6"
              >
                {orderData.items.map((item, index) => (
                  <motion.div
                    key={item.id}
                    variants={itemVariants}
                    className="group relative overflow-hidden rounded-lg border-2 bg-card hover-elevate transition-all duration-300"
                    data-testid={`order-item-${item.id}`}
                  >
                    <div className="flex flex-col lg:flex-row gap-0">
                      {item.image && (
                        <div className="relative w-full lg:w-80 h-64 lg:h-auto flex-shrink-0 overflow-hidden">
                          <img
                            src={item.image}
                            alt={item.name}
                            className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                            data-testid={`img-order-item-${item.id}`}
                          />
                          <div className="absolute top-4 right-4">
                            <Badge className="bg-white/90 dark:bg-black/80 text-foreground backdrop-blur-sm shadow-lg">
                              Qty: {item.quantity}
                            </Badge>
                          </div>
                        </div>
                      )}

                      <div className="flex-1 p-6 space-y-4">
                        <div>
                          <h3 className="text-2xl font-bold mb-3 text-foreground" data-testid={`text-order-item-name-${item.id}`}>
                            {item.name}
                          </h3>
                          {item.description && (
                            <div className="relative pl-4 border-l-4 border-primary/30">
                              <p className="text-base leading-relaxed text-muted-foreground" data-testid={`text-order-item-description-${item.id}`}>
                                {item.description}
                              </p>
                            </div>
                          )}
                        </div>

                        {(item.calories || item.protein) && (
                          <div className="flex gap-3 flex-wrap">
                            {item.calories && (
                              <Badge variant="outline" className="bg-orange-50 dark:bg-orange-950/50 text-orange-700 dark:text-orange-300 border-orange-200 dark:border-orange-800 px-4 py-2">
                                <Flame className="h-4 w-4 mr-1.5" />
                                {item.calories} cal
                              </Badge>
                            )}
                            {item.protein && (
                              <Badge variant="outline" className="bg-green-50 dark:bg-green-950/50 text-green-700 dark:text-green-300 border-green-200 dark:border-green-800 px-4 py-2">
                                <Dumbbell className="h-4 w-4 mr-1.5" />
                                {item.protein}g protein
                              </Badge>
                            )}
                          </div>
                        )}

                        <Separator />

                        <div className="flex flex-wrap items-center justify-between gap-4 pt-2">
                          <div className="flex items-baseline gap-2">
                            <span className="text-sm text-muted-foreground">Unit Price:</span>
                            <span className="text-lg font-semibold">{item.price}</span>
                          </div>
                          <div className="flex items-baseline gap-2">
                            <span className="text-sm text-muted-foreground">Quantity:</span>
                            <span className="text-lg font-semibold" data-testid={`text-order-quantity-${item.id}`}>
                              ×{item.quantity}
                            </span>
                          </div>
                          <div className="flex items-baseline gap-2">
                            <span className="text-sm text-muted-foreground">Subtotal:</span>
                            <span className="text-2xl font-bold text-primary" data-testid={`text-order-item-price-${item.id}`}>
                              ${(Number(item.price.replace(/[^0-9.]/g, "")) * item.quantity).toFixed(2)}
                            </span>
                          </div>
                        </div>
                      </div>
                    </div>
                  </motion.div>
                ))}
              </motion.div>
            </CardContent>
          </Card>
        </motion.div>

        {/* Order Summary */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6 }}
          className="max-w-5xl mx-auto mb-8"
        >
          <Card data-testid="card-order-summary">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Package className="h-5 w-5 text-primary" />
                Order Summary
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-3">
                <div className="flex justify-between items-center pb-2">
                  <span className="text-muted-foreground">Subtotal</span>
                  <span className="text-lg font-semibold">{orderData.subtotal}</span>
                </div>
                <div className="flex justify-between items-center pb-2">
                  <span className="text-muted-foreground">Tax</span>
                  <span className="text-lg font-semibold">{orderData.tax}</span>
                </div>
                <Separator />
                <div className="flex justify-between items-center pt-2">
                  <span className="text-xl font-bold">Total</span>
                  <span className="text-2xl font-bold text-primary">{orderData.total}</span>
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>

        {/* Action Buttons */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.7 }}
          className="max-w-5xl mx-auto"
        >
          <Card>
            <CardContent className="p-6">
              <div className="flex flex-wrap gap-4 justify-center items-center">
                {isConfirmed && !guestArrived && (
                  <Button 
                    size="lg" 
                    variant="default" 
                    className="gap-2"
                    onClick={() => markArrivedMutation.mutate()}
                    disabled={markArrivedMutation.isPending}
                    data-testid="button-mark-arrived"
                  >
                    <MapPin className="h-5 w-5" />
                    {markArrivedMutation.isPending ? "Marking..." : "I am Arrived"}
                  </Button>
                )}
                {guestArrived && (
                  <Badge variant="outline" className="text-lg px-6 py-3 bg-green-50 dark:bg-green-950 border-green-200 dark:border-green-800 text-green-700 dark:text-green-300">
                    <CheckCircle className="h-5 w-5 mr-2" />
                    You've Arrived - Order Will Be Delivered Soon
                  </Badge>
                )}
                <Link href="/">
                  <Button size="lg" variant="outline" className="gap-2" data-testid="button-continue-shopping">
                    <Home className="h-5 w-5" />
                    Continue Shopping
                  </Button>
                </Link>
                <Button 
                  size="lg" 
                  variant="outline" 
                  className="gap-2"
                  onClick={() => window.print()}
                  data-testid="button-download-receipt"
                >
                  <Download className="h-5 w-5" />
                  Download Receipt
                </Button>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </div>
    </div>
  );
}
