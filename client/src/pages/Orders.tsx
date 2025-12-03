import { useQuery } from "@tanstack/react-query";
import { useAuth } from "@/contexts/AuthContext";
import { Link, useLocation } from "wouter";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { 
  Clock, ChefHat, Package, CheckCircle, XCircle, Home, 
  ShoppingBag, Calendar, Receipt, ArrowRight, Utensils,
  Timer, Sparkles, Ban
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import type { Order } from "@shared/schema";

function OrderStatusProgress({ status }: { status: string }) {
  const steps = [
    { id: "pending", icon: Clock, label: "Pending" },
    { id: "preparing", icon: ChefHat, label: "Preparing" },
    { id: "completed", icon: CheckCircle, label: "Ready" },
  ];

  const statusToIndex: Record<string, number> = {
    pending: 0,
    preparing: 1,
    completed: 2,
  };

  const currentIndex = statusToIndex[status] ?? -1;
  const isRejected = status === "rejected";
  const isCancelled = status === "cancelled";

  if (isRejected || isCancelled) {
    return (
      <div className="flex items-center gap-2">
        <div className="p-1.5 rounded-full bg-red-100 dark:bg-red-900/40">
          {isRejected ? (
            <XCircle className="h-4 w-4 text-red-600 dark:text-red-400" />
          ) : (
            <Ban className="h-4 w-4 text-red-600 dark:text-red-400" />
          )}
        </div>
        <span className="text-sm font-medium text-red-600 dark:text-red-400 capitalize">
          {status}
        </span>
      </div>
    );
  }

  return (
    <div className="flex items-center gap-1">
      {steps.map((step, index) => {
        const Icon = step.icon;
        const isActive = index <= currentIndex;
        const isCurrent = index === currentIndex;

        return (
          <div key={step.id} className="flex items-center">
            <motion.div
              initial={false}
              animate={{
                scale: isCurrent ? 1.1 : 1,
                backgroundColor: isActive 
                  ? index === 2 ? "rgb(34 197 94)" : "rgb(234 88 12)" 
                  : "rgb(229 231 235)",
              }}
              className={`p-1.5 rounded-full transition-all ${
                isActive 
                  ? isCurrent 
                    ? "shadow-md" 
                    : ""
                  : "dark:bg-gray-700"
              }`}
            >
              <Icon className={`h-3.5 w-3.5 ${
                isActive ? "text-white" : "text-gray-400 dark:text-gray-500"
              }`} />
            </motion.div>
            {index < steps.length - 1 && (
              <div className={`w-4 h-0.5 mx-0.5 transition-colors ${
                index < currentIndex 
                  ? "bg-orange-500" 
                  : "bg-gray-200 dark:bg-gray-700"
              }`} />
            )}
          </div>
        );
      })}
    </div>
  );
}

function OrderCard({ order, onClick }: { order: Order; onClick: () => void }) {
  const items = Array.isArray(order.items) ? order.items : [];
  const isActive = order.status === "pending" || order.status === "preparing";
  const isCompleted = order.status === "completed";
  const isRejected = order.status === "rejected";
  const isCancelled = order.status === "cancelled";

  const getOrderName = () => {
    if (items.length === 0) return "Order";
    if (items.length === 1) return items[0].name;
    if (items.length === 2) return `${items[0].name} & ${items[1].name}`;
    return `${items[0].name} +${items.length - 1} more`;
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      whileHover={{ scale: 1.01 }}
      whileTap={{ scale: 0.99 }}
      transition={{ type: "spring", stiffness: 400, damping: 25 }}
    >
      <Card
        className="overflow-hidden cursor-pointer hover:shadow-lg transition-all duration-300"
        onClick={onClick}
        data-testid={`order-card-${order.id}`}
      >
        <CardContent className="p-0">
          <div className="p-4 md:p-5">
            <div className="flex items-start justify-between gap-4">
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-3 mb-3 flex-wrap">
                  <div className="flex items-center gap-2">
                    <div className={`p-2 rounded-lg ${
                      isActive 
                        ? "bg-gradient-to-br from-orange-500 to-amber-600" 
                        : isCompleted 
                          ? "bg-gradient-to-br from-green-500 to-emerald-600"
                          : isRejected || isCancelled
                            ? "bg-gradient-to-br from-red-500 to-rose-600"
                            : "bg-gradient-to-br from-gray-400 to-gray-500"
                    } shadow-md`}>
                      <Utensils className="h-4 w-4 text-white" />
                    </div>
                    <div>
                      <h3 className="font-bold text-lg leading-tight truncate max-w-[200px] md:max-w-none" data-testid={`text-order-name-${order.id}`}>
                        {getOrderName()}
                      </h3>
                      <p className="text-xs text-muted-foreground font-mono">
                        #{order.id.slice(0, 8).toUpperCase()}
                      </p>
                    </div>
                  </div>
                </div>

                <div className="flex flex-wrap items-center gap-3 text-sm text-muted-foreground mb-3">
                  <div className="flex items-center gap-1.5">
                    <Calendar className="h-3.5 w-3.5" />
                    <span>{new Date(order.createdAt).toLocaleDateString()}</span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <Timer className="h-3.5 w-3.5" />
                    <span>{new Date(order.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <ShoppingBag className="h-3.5 w-3.5" />
                    <span>{items.length} item{items.length !== 1 ? 's' : ''}</span>
                  </div>
                </div>

                <OrderStatusProgress status={order.status} />

                {order.preparationTime && isActive && (
                  <motion.div 
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="mt-3 inline-flex items-center gap-2 px-3 py-1.5 bg-orange-100 dark:bg-orange-900/30 rounded-full"
                  >
                    <motion.div
                      animate={{ rotate: 360 }}
                      transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
                    >
                      <Timer className="h-3.5 w-3.5 text-orange-600 dark:text-orange-400" />
                    </motion.div>
                    <span className="text-xs font-medium text-orange-700 dark:text-orange-300">
                      Est. {order.preparationTime} mins
                    </span>
                  </motion.div>
                )}

                {isRejected && order.rejectionReason && (
                  <div className="mt-3 p-2 bg-red-50 dark:bg-red-900/20 rounded-lg border border-red-200 dark:border-red-800">
                    <p className="text-xs text-red-600 dark:text-red-400">
                      <span className="font-medium">Reason:</span> {order.rejectionReason}
                    </p>
                  </div>
                )}
              </div>

              <div className="text-right flex flex-col items-end gap-2">
                <div className="p-3 bg-gradient-to-br from-muted/50 to-muted rounded-xl">
                  <p className="text-2xl font-bold text-foreground" data-testid={`text-order-total-${order.id}`}>
                    ${Number(order.total).toFixed(2)}
                  </p>
                </div>
                <Button 
                  variant="ghost" 
                  size="sm" 
                  className="text-xs gap-1 text-muted-foreground hover:text-foreground"
                  data-testid={`button-view-order-${order.id}`}
                >
                  View Details
                  <ArrowRight className="h-3 w-3" />
                </Button>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
}

function EmptyOrdersState() {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ type: "spring", stiffness: 200 }}
      className="text-center py-16"
    >
      <motion.div
        animate={{ y: [-5, 5, -5] }}
        transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
        className="inline-flex items-center justify-center w-24 h-24 bg-gradient-to-br from-orange-100 to-amber-100 dark:from-orange-900/30 dark:to-amber-900/30 rounded-full mb-6 shadow-lg"
      >
        <ShoppingBag className="h-12 w-12 text-orange-500" />
      </motion.div>
      <h3 className="text-2xl font-bold mb-2" data-testid="text-no-orders-title">No orders yet</h3>
      <p className="text-muted-foreground mb-6 max-w-sm mx-auto">
        Start exploring our delicious menu and place your first order!
      </p>
      <Link href="/">
        <Button 
          size="lg" 
          className="gap-2 bg-gradient-to-r from-orange-500 to-amber-600 hover:from-orange-600 hover:to-amber-700 shadow-lg"
          data-testid="button-start-ordering"
        >
          <Utensils className="h-4 w-4" />
          Start Ordering
        </Button>
      </Link>
    </motion.div>
  );
}

function LoadingState() {
  return (
    <div className="space-y-4">
      {[1, 2, 3].map((i) => (
        <motion.div
          key={i}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: i * 0.1 }}
        >
          <Card className="overflow-hidden">
            <CardContent className="p-5">
              <div className="flex items-start justify-between gap-4">
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-3">
                    <div className="w-10 h-10 bg-muted rounded-lg animate-pulse" />
                    <div className="space-y-2">
                      <div className="h-5 w-32 bg-muted rounded animate-pulse" />
                      <div className="h-3 w-20 bg-muted rounded animate-pulse" />
                    </div>
                  </div>
                  <div className="flex gap-4 mb-3">
                    <div className="h-4 w-24 bg-muted rounded animate-pulse" />
                    <div className="h-4 w-16 bg-muted rounded animate-pulse" />
                  </div>
                  <div className="flex gap-2">
                    <div className="h-6 w-6 bg-muted rounded-full animate-pulse" />
                    <div className="h-6 w-6 bg-muted rounded-full animate-pulse" />
                    <div className="h-6 w-6 bg-muted rounded-full animate-pulse" />
                  </div>
                </div>
                <div className="text-right">
                  <div className="h-12 w-20 bg-muted rounded-xl animate-pulse" />
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      ))}
    </div>
  );
}

export default function Orders() {
  const { currentUser } = useAuth();
  const [, setLocation] = useLocation();

  const { data: ordersData, isLoading } = useQuery<{ orders: Order[] }>({
    queryKey: ["/api/orders/user", currentUser?.uid],
    queryFn: currentUser 
      ? () => fetch(`/api/orders/user/${currentUser.uid}`, {
          headers: {
            "x-firebase-uid": currentUser.uid,
          },
        }).then(res => res.json())
      : undefined,
    enabled: !!currentUser,
  });

  const orders = ordersData?.orders || [];

  const activeOrders = orders.filter(o => o.status === "pending" || o.status === "preparing");
  const pastOrders = orders.filter(o => o.status !== "pending" && o.status !== "preparing");

  const handleOrderClick = (order: Order) => {
    const orderData = {
      orderId: order.id,
      orderNumber: `#${order.id.slice(0, 8).toUpperCase()}`,
      items: Array.isArray(order.items) ? order.items : [],
      subtotal: `$${Number(order.subtotal).toFixed(2)}`,
      tax: `$${Number(order.tax).toFixed(2)}`,
      total: `$${Number(order.total).toFixed(2)}`,
      userEmail: order.userEmail,
      userName: order.userName || "Customer",
      orderDate: new Date(order.createdAt).toLocaleDateString(),
      status: order.status,
    };
    sessionStorage.setItem("lastOrder", JSON.stringify(orderData));
    setLocation("/order-confirmation");
  };

  if (!currentUser) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-background to-muted/30 flex items-center justify-center p-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ type: "spring", stiffness: 200 }}
        >
          <Card className="w-full max-w-md shadow-xl">
            <CardContent className="pt-8 pb-8 text-center">
              <motion.div
                animate={{ scale: [1, 1.05, 1] }}
                transition={{ duration: 2, repeat: Infinity }}
                className="inline-flex items-center justify-center w-20 h-20 bg-gradient-to-br from-orange-100 to-amber-100 dark:from-orange-900/30 dark:to-amber-900/30 rounded-full mb-6"
              >
                <Receipt className="h-10 w-10 text-orange-500" />
              </motion.div>
              <h2 className="text-2xl font-bold mb-2">View Your Orders</h2>
              <p className="text-muted-foreground mb-6">Please sign in to view your orders</p>
              <Link href="/signin">
                <Button 
                  size="lg"
                  className="gap-2 bg-gradient-to-r from-orange-500 to-amber-600 hover:from-orange-600 hover:to-amber-700"
                  data-testid="button-signin"
                >
                  Sign In
                  <ArrowRight className="h-4 w-4" />
                </Button>
              </Link>
            </CardContent>
          </Card>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-background via-background to-muted/30">
      <header className="border-b sticky top-0 bg-background/95 backdrop-blur-md z-50 shadow-sm">
        <div className="container mx-auto px-4 py-3">
          <div className="flex items-center justify-between gap-4">
            <Link href="/">
              <div className="flex items-center gap-3 cursor-pointer">
                <div className="p-2 bg-gradient-to-br from-orange-500 to-amber-600 rounded-lg shadow-md">
                  <Utensils className="h-5 w-5 text-white" />
                </div>
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

      <div className="container mx-auto max-w-4xl px-4 py-6 md:py-8">
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <div className="flex items-center gap-4 mb-2">
            <div className="p-3 bg-gradient-to-br from-orange-500/20 to-amber-600/20 dark:from-orange-500/30 dark:to-amber-600/30 rounded-xl">
              <Receipt className="h-8 w-8 text-orange-600 dark:text-orange-400" />
            </div>
            <div>
              <h1 className="text-3xl md:text-4xl font-bold" data-testid="text-orders-title">My Orders</h1>
              <p className="text-muted-foreground">Track your orders and view order history</p>
            </div>
          </div>
        </motion.div>

        {isLoading ? (
          <LoadingState />
        ) : orders.length === 0 ? (
          <Card className="shadow-lg">
            <CardContent className="pt-6">
              <EmptyOrdersState />
            </CardContent>
          </Card>
        ) : (
          <div className="space-y-8">
            {activeOrders.length > 0 && (
              <motion.section
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
              >
                <div className="flex items-center gap-3 mb-4">
                  <div className="flex items-center gap-2">
                    <motion.div
                      animate={{ scale: [1, 1.2, 1] }}
                      transition={{ duration: 1.5, repeat: Infinity }}
                      className="w-2 h-2 bg-orange-500 rounded-full"
                    />
                    <h2 className="text-xl font-bold" data-testid="text-active-orders-title">Active Orders</h2>
                  </div>
                  <Badge className="bg-orange-100 text-orange-700 dark:bg-orange-900/30 dark:text-orange-300 border-orange-200 dark:border-orange-800">
                    {activeOrders.length}
                  </Badge>
                </div>
                <div className="space-y-4">
                  <AnimatePresence mode="popLayout">
                    {activeOrders.map((order, index) => (
                      <motion.div
                        key={order.id}
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0, x: 20 }}
                        transition={{ delay: index * 0.1 }}
                      >
                        <OrderCard order={order} onClick={() => handleOrderClick(order)} />
                      </motion.div>
                    ))}
                  </AnimatePresence>
                </div>
              </motion.section>
            )}

            {pastOrders.length > 0 && (
              <motion.section
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
              >
                <div className="flex items-center gap-3 mb-4">
                  <h2 className="text-xl font-bold text-muted-foreground" data-testid="text-past-orders-title">Order History</h2>
                  <Badge variant="secondary">
                    {pastOrders.length}
                  </Badge>
                </div>
                <div className="space-y-4">
                  <AnimatePresence mode="popLayout">
                    {pastOrders.map((order, index) => (
                      <motion.div
                        key={order.id}
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0, x: 20 }}
                        transition={{ delay: index * 0.05 }}
                      >
                        <OrderCard order={order} onClick={() => handleOrderClick(order)} />
                      </motion.div>
                    ))}
                  </AnimatePresence>
                </div>
              </motion.section>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
