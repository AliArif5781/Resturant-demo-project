import { useEffect, useState } from "react";
import { useLocation, Link } from "wouter";
import { useAuth } from "@/contexts/AuthContext";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { useToast } from "@/hooks/use-toast";
import { 
  Package, Home, Check, X, Clock, MapPin, Sparkles, Eye, UtensilsCrossed,
  LayoutDashboard, TrendingUp, AlertCircle, CheckCircle, Timer,
  ChefHat, Flame, Users, DollarSign, Bell, RefreshCw
} from "lucide-react";
import { useQuery, useMutation } from "@tanstack/react-query";
import { apiRequest, queryClient } from "@/lib/queryClient";
import type { Order } from "@shared/schema";
import { motion, AnimatePresence } from "framer-motion";

type OrderStatus = "all" | "pending" | "preparing" | "completed" | "rejected" | "cancelled";

function StatusWidget({ 
  title, 
  count, 
  icon: Icon, 
  color, 
  isActive, 
  onClick,
  pulse = false,
  testId
}: { 
  title: string;
  count: number;
  icon: React.ElementType;
  color: string;
  isActive: boolean;
  onClick: () => void;
  pulse?: boolean;
  testId: string;
}) {
  const colorClasses: Record<string, { bg: string; border: string; text: string; iconBg: string }> = {
    orange: {
      bg: "bg-orange-50 dark:bg-orange-950/30",
      border: "border-orange-200 dark:border-orange-800",
      text: "text-orange-700 dark:text-orange-300",
      iconBg: "bg-orange-100 dark:bg-orange-900/50"
    },
    blue: {
      bg: "bg-blue-50 dark:bg-blue-950/30",
      border: "border-blue-200 dark:border-blue-800",
      text: "text-blue-700 dark:text-blue-300",
      iconBg: "bg-blue-100 dark:bg-blue-900/50"
    },
    green: {
      bg: "bg-green-50 dark:bg-green-950/30",
      border: "border-green-200 dark:border-green-800",
      text: "text-green-700 dark:text-green-300",
      iconBg: "bg-green-100 dark:bg-green-900/50"
    },
    red: {
      bg: "bg-red-50 dark:bg-red-950/30",
      border: "border-red-200 dark:border-red-800",
      text: "text-red-700 dark:text-red-300",
      iconBg: "bg-red-100 dark:bg-red-900/50"
    },
    gray: {
      bg: "bg-muted/50",
      border: "border-border",
      text: "text-muted-foreground",
      iconBg: "bg-muted"
    }
  };

  const colors = colorClasses[color] || colorClasses.gray;

  return (
    <motion.div
      whileHover={{ scale: 1.02 }}
      whileTap={{ scale: 0.98 }}
      transition={{ type: "spring", stiffness: 400, damping: 17 }}
    >
      <Card 
        className={`cursor-pointer transition-all duration-200 ${colors.bg} ${colors.border} border-2 ${
          isActive ? "ring-2 ring-primary ring-offset-2" : ""
        }`}
        onClick={onClick}
        data-testid={testId}
      >
        <CardContent className="p-4 md:p-6">
          <div className="flex items-center justify-between gap-4">
            <div className="space-y-1">
              <p className={`text-sm font-medium ${colors.text}`}>{title}</p>
              <div className="flex items-baseline gap-2">
                <span className={`text-3xl md:text-4xl font-bold ${colors.text}`}>
                  {count}
                </span>
                {pulse && count > 0 && (
                  <motion.span
                    animate={{ scale: [1, 1.2, 1] }}
                    transition={{ duration: 2, repeat: Infinity }}
                    className="text-xs text-orange-600 dark:text-orange-400 font-medium"
                  >
                    NEW
                  </motion.span>
                )}
              </div>
            </div>
            <div className={`p-3 md:p-4 rounded-full ${colors.iconBg} relative`}>
              <Icon className={`h-6 w-6 md:h-8 md:w-8 ${colors.text}`} />
              {pulse && count > 0 && (
                <motion.div
                  className="absolute -top-1 -right-1 w-3 h-3 bg-orange-500 rounded-full"
                  animate={{ scale: [1, 1.3, 1], opacity: [1, 0.7, 1] }}
                  transition={{ duration: 1.5, repeat: Infinity }}
                />
              )}
            </div>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
}

function OrderCard({ 
  order, 
  onProceed, 
  onReject, 
  onComplete, 
  onViewDetails,
  isUpdating,
  completingOrderId 
}: { 
  order: Order;
  onProceed: (orderId: string) => void;
  onReject: (orderId: string) => void;
  onComplete: (orderId: string) => void;
  onViewDetails: (order: Order) => void;
  isUpdating: boolean;
  completingOrderId: string | null;
}) {
  const items = Array.isArray(order.items) ? order.items : [];
  
  const statusConfig: Record<string, { badge: string; className: string }> = {
    pending: { 
      badge: "Pending", 
      className: "bg-orange-100 dark:bg-orange-900/50 text-orange-800 dark:text-orange-200 border-orange-300 dark:border-orange-700" 
    },
    preparing: { 
      badge: "In Progress", 
      className: "bg-blue-100 dark:bg-blue-900/50 text-blue-800 dark:text-blue-200 border-blue-300 dark:border-blue-700" 
    },
    completed: { 
      badge: "Completed", 
      className: "bg-green-100 dark:bg-green-900/50 text-green-800 dark:text-green-200 border-green-300 dark:border-green-700" 
    },
    rejected: { 
      badge: "Rejected", 
      className: "bg-red-100 dark:bg-red-900/50 text-red-800 dark:text-red-200 border-red-300 dark:border-red-700" 
    },
    cancelled: { 
      badge: order.cancelledBy === "guest" ? "Cancelled by Guest" : "Cancelled", 
      className: "bg-gray-100 dark:bg-gray-900/50 text-gray-800 dark:text-gray-200 border-gray-300 dark:border-gray-700" 
    }
  };

  const config = statusConfig[order.status] || statusConfig.pending;

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -10 }}
      transition={{ duration: 0.2 }}
    >
      <Card className="hover-elevate transition-all duration-200" data-testid={`card-order-${order.id}`}>
        <CardContent className="p-4 md:p-6">
          <div className="flex flex-col gap-4">
            <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-4">
              <div className="flex-1 space-y-3">
                <div className="flex items-start justify-between gap-2 flex-wrap">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
                      <Users className="h-5 w-5 text-primary" />
                    </div>
                    <div>
                      <h3 className="font-semibold text-lg" data-testid={`text-order-user-${order.id}`}>
                        {order.userName || order.userEmail}
                      </h3>
                      <div className="flex items-center gap-2 text-sm text-muted-foreground">
                        <Clock className="h-3.5 w-3.5" />
                        <span>
                          {new Date(order.createdAt).toLocaleDateString()} {new Date(order.createdAt).toLocaleTimeString()}
                        </span>
                      </div>
                    </div>
                  </div>
                  <div className="flex flex-col items-end gap-2">
                    <Badge 
                      variant="outline"
                      className={config.className}
                      data-testid={`badge-order-status-${order.id}`}
                    >
                      {config.badge}
                    </Badge>
                    {order.guestArrived === true && (
                      <Badge 
                        variant="outline" 
                        className="bg-emerald-50 dark:bg-emerald-950/50 text-emerald-700 dark:text-emerald-300 border-emerald-200 dark:border-emerald-800"
                        data-testid={`badge-guest-arrived-${order.id}`}
                      >
                        <MapPin className="h-3 w-3 mr-1" />
                        Guest Arrived
                      </Badge>
                    )}
                  </div>
                </div>

                <div className="flex items-center gap-4 text-sm">
                  <div className="flex items-center gap-1.5 text-muted-foreground">
                    <Package className="h-4 w-4" />
                    <span>{items.length} {items.length === 1 ? "item" : "items"}</span>
                  </div>
                  <div className="flex items-center gap-1.5 font-semibold text-primary">
                    <DollarSign className="h-4 w-4" />
                    <span data-testid={`text-order-total-${order.id}`}>{order.total}</span>
                  </div>
                </div>

                <div className="flex flex-wrap gap-1.5">
                  {items.slice(0, 3).map((item: any, idx: number) => (
                    <Badge key={idx} variant="secondary" className="text-xs font-normal">
                      {item.name} x{item.quantity}
                    </Badge>
                  ))}
                  {items.length > 3 && (
                    <Badge variant="outline" className="text-xs font-normal">
                      +{items.length - 3} more
                    </Badge>
                  )}
                </div>
              </div>
            </div>
            
            <Separator />

            <div className="flex flex-wrap gap-2">
              <Button
                size="sm"
                variant="outline"
                onClick={() => onViewDetails(order)}
                className="gap-2"
                data-testid={`button-view-details-${order.id}`}
              >
                <Eye className="h-4 w-4" />
                View Details
              </Button>

              {order.status === "pending" && (
                <>
                  <Button
                    size="sm"
                    onClick={() => onProceed(order.id)}
                    disabled={isUpdating}
                    className="gap-2 bg-green-600 hover:bg-green-700 text-white"
                    data-testid={`button-proceed-${order.id}`}
                  >
                    <Check className="h-4 w-4" />
                    Accept Order
                  </Button>
                  <Button
                    size="sm"
                    variant="destructive"
                    onClick={() => onReject(order.id)}
                    disabled={isUpdating}
                    className="gap-2"
                    data-testid={`button-reject-${order.id}`}
                  >
                    <X className="h-4 w-4" />
                    Reject
                  </Button>
                </>
              )}

              {order.status === "preparing" && (
                <div className="flex flex-col md:flex-row gap-2 w-full md:w-auto">
                  {order.preparationTime && (
                    <div className="flex items-center gap-2 px-3 py-1.5 bg-blue-50 dark:bg-blue-950/50 rounded-md border border-blue-200 dark:border-blue-800">
                      <Timer className="h-4 w-4 text-blue-600 dark:text-blue-400" />
                      <span className="text-sm font-medium text-blue-700 dark:text-blue-300">
                        Est: {order.preparationTime}
                      </span>
                    </div>
                  )}
                  <Button
                    size="sm"
                    onClick={() => onComplete(order.id)}
                    disabled={completingOrderId === order.id}
                    className="gap-2 bg-green-600 hover:bg-green-700 text-white"
                    data-testid={`button-completed-${order.id}`}
                  >
                    <CheckCircle className="h-4 w-4" />
                    {completingOrderId === order.id ? "Completing..." : "Mark Complete"}
                  </Button>
                </div>
              )}
            </div>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
}

export default function AdminDashboard() {
  const [, setLocation] = useLocation();
  const { currentUser, signout, getUserRole } = useAuth();
  const { toast } = useToast();
  const [loading, setLoading] = useState(true);
  const [isAdmin, setIsAdmin] = useState(false);
  const [showPrepTimeDialog, setShowPrepTimeDialog] = useState(false);
  const [showRejectDialog, setShowRejectDialog] = useState(false);
  const [showDetailsDialog, setShowDetailsDialog] = useState(false);
  const [selectedOrderId, setSelectedOrderId] = useState<string>("");
  const [selectedOrderForDetails, setSelectedOrderForDetails] = useState<Order | null>(null);
  const [preparationTime, setPreparationTime] = useState("");
  const [rejectionReason, setRejectionReason] = useState("");
  const [showCompletionAnimation, setShowCompletionAnimation] = useState(false);
  const [completedOrderId, setCompletedOrderId] = useState<string>("");
  const [completingOrderId, setCompletingOrderId] = useState<string | null>(null);
  const [activeFilter, setActiveFilter] = useState<OrderStatus>("all");

  const { data: ordersData, isLoading: ordersLoading, refetch } = useQuery<{ orders: Order[] }>({
    queryKey: ["/api/orders"],
    enabled: isAdmin,
    refetchInterval: 3000,
  });

  const orders = ordersData?.orders || [];

  const orderCounts = {
    all: orders.length,
    pending: orders.filter(o => o.status === "pending").length,
    preparing: orders.filter(o => o.status === "preparing").length,
    completed: orders.filter(o => o.status === "completed").length,
    rejected: orders.filter(o => o.status === "rejected").length,
    cancelled: orders.filter(o => o.status === "cancelled").length,
  };

  const filteredOrders = activeFilter === "all" 
    ? orders 
    : orders.filter(order => order.status === activeFilter);

  const updateOrderStatusMutation = useMutation({
    mutationFn: async ({ orderId, status, preparationTime, rejectionReason }: { orderId: string; status: string; preparationTime?: string; rejectionReason?: string }) => {
      const response = await apiRequest("PATCH", `/api/orders/${orderId}/status`, { status, preparationTime, rejectionReason });
      return await response.json();
    },
    onSuccess: (data, variables) => {
      queryClient.invalidateQueries({ queryKey: ["/api/orders"] });
      setShowPrepTimeDialog(false);
      setShowRejectDialog(false);
      setPreparationTime("");
      setRejectionReason("");
      setSelectedOrderId("");
      setCompletingOrderId(null);
      
      if (variables.status === "completed") {
        setCompletedOrderId(variables.orderId);
        setShowCompletionAnimation(true);
        toast({
          title: "Order Completed!",
          description: "The order has been marked as complete.",
        });
        setTimeout(() => {
          setShowCompletionAnimation(false);
          setCompletedOrderId("");
        }, 3000);
      } else {
        toast({
          title: "Success",
          description: variables.status === "rejected" ? "Order rejected successfully" : "Order status updated successfully",
        });
      }
    },
    onError: (error: any) => {
      setCompletingOrderId(null);
      toast({
        title: "Error",
        description: error.message || "Failed to update order status",
        variant: "destructive",
      });
    },
  });

  const handleProceedClick = (orderId: string) => {
    setSelectedOrderId(orderId);
    setShowPrepTimeDialog(true);
  };

  const handleRejectClick = (orderId: string) => {
    setSelectedOrderId(orderId);
    setShowRejectDialog(true);
  };

  const handleConfirmProceed = () => {
    if (!preparationTime.trim()) {
      toast({
        title: "Error",
        description: "Please enter preparation time",
        variant: "destructive",
      });
      return;
    }
    updateOrderStatusMutation.mutate({ 
      orderId: selectedOrderId, 
      status: "preparing",
      preparationTime: preparationTime.trim()
    });
  };

  const handleConfirmReject = () => {
    if (!rejectionReason.trim()) {
      toast({
        title: "Error",
        description: "Please provide a reason for rejection",
        variant: "destructive",
      });
      return;
    }
    updateOrderStatusMutation.mutate({ 
      orderId: selectedOrderId, 
      status: "rejected",
      rejectionReason: rejectionReason.trim()
    });
  };

  const handleCompleteOrder = (orderId: string) => {
    setCompletingOrderId(orderId);
    updateOrderStatusMutation.mutate({ 
      orderId, 
      status: "completed"
    });
  };

  const handleViewDetails = (order: Order) => {
    setSelectedOrderForDetails(order);
    setShowDetailsDialog(true);
  };

  useEffect(() => {
    const checkAdminAccess = async () => {
      if (!currentUser) {
        setLocation("/signin");
        return;
      }

      const role = await getUserRole(currentUser.uid);
      if (role !== "admin") {
        toast({
          title: "Access Denied",
          description: "You don't have permission to access the admin dashboard",
          variant: "destructive",
        });
        setLocation("/");
        return;
      }

      setIsAdmin(true);
      setLoading(false);
    };

    checkAdminAccess();
  }, [currentUser, getUserRole, setLocation, toast]);

  const handleSignOut = async () => {
    try {
      await signout();
      toast({
        title: "Success",
        description: "Signed out successfully",
      });
      setLocation("/signin");
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message || "Failed to sign out",
        variant: "destructive",
      });
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-background">
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
        >
          <RefreshCw className="h-8 w-8 text-primary" />
        </motion.div>
      </div>
    );
  }

  if (!isAdmin) {
    return null;
  }

  return (
    <div className="min-h-screen bg-background">
      {showCompletionAnimation && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm"
        >
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            exit={{ scale: 0 }}
            className="bg-white dark:bg-card rounded-2xl p-8 text-center shadow-2xl"
          >
            <motion.div
              animate={{ scale: [1, 1.2, 1] }}
              transition={{ duration: 0.5, repeat: 2 }}
            >
              <Sparkles className="h-16 w-16 text-green-500 mx-auto mb-4" />
            </motion.div>
            <h2 className="text-2xl font-bold text-green-600 dark:text-green-400">Order Complete!</h2>
            <p className="text-muted-foreground mt-2">The order is ready for pickup</p>
          </motion.div>
        </motion.div>
      )}

      <header className="border-b bg-gradient-to-r from-primary/5 via-background to-primary/5 sticky top-0 z-40 backdrop-blur-md">
        <div className="container mx-auto px-4 py-3">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-lg bg-primary/10">
                <ChefHat className="h-6 w-6 text-primary" />
              </div>
              <div>
                <h1 className="text-lg sm:text-xl font-bold" data-testid="title-admin-dashboard">
                  Karahi Point Admin
                </h1>
                <p className="text-xs text-muted-foreground hidden sm:block">
                  {currentUser?.displayName || currentUser?.email}
                </p>
              </div>
            </div>
            <div className="flex items-center gap-2 flex-wrap">
              <Button 
                variant="outline" 
                size="sm"
                onClick={() => setLocation("/")}
                className="gap-2"
                data-testid="button-home"
              >
                <Home className="h-4 w-4" />
                <span className="hidden sm:inline">Home</span>
              </Button>
              <Button 
                variant="default" 
                size="sm"
                className="gap-2"
                data-testid="button-dashboard"
              >
                <LayoutDashboard className="h-4 w-4" />
                <span className="hidden sm:inline">Dashboard</span>
              </Button>
              <Button 
                variant="outline" 
                size="sm"
                onClick={() => setLocation("/admin/menu")} 
                data-testid="button-manage-menu"
              >
                <UtensilsCrossed className="h-4 w-4 sm:mr-2" />
                <span className="hidden sm:inline">Manage Menu</span>
              </Button>
              <Button 
                variant="ghost" 
                size="sm"
                onClick={handleSignOut} 
                data-testid="button-signout"
              >
                Sign Out
              </Button>
            </div>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-4 py-6 md:py-8">
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-6 md:mb-8"
        >
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
            <div>
              <h2 className="text-2xl md:text-3xl font-bold">Dashboard</h2>
              <p className="text-muted-foreground">
                Monitor and manage your restaurant orders in real-time
              </p>
            </div>
            <Button
              variant="outline"
              size="sm"
              onClick={() => refetch()}
              className="gap-2 w-fit"
              data-testid="button-refresh-orders"
            >
              <RefreshCw className="h-4 w-4" />
              Refresh
            </Button>
          </div>
        </motion.div>

        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 md:gap-4 mb-6 md:mb-8">
          <StatusWidget
            title="New Orders"
            count={orderCounts.pending}
            icon={Bell}
            color="orange"
            isActive={activeFilter === "pending"}
            onClick={() => setActiveFilter(activeFilter === "pending" ? "all" : "pending")}
            pulse={true}
            testId="widget-new-orders"
          />
          <StatusWidget
            title="In Progress"
            count={orderCounts.preparing}
            icon={ChefHat}
            color="blue"
            isActive={activeFilter === "preparing"}
            onClick={() => setActiveFilter(activeFilter === "preparing" ? "all" : "preparing")}
            testId="widget-in-progress"
          />
          <StatusWidget
            title="Completed"
            count={orderCounts.completed}
            icon={CheckCircle}
            color="green"
            isActive={activeFilter === "completed"}
            onClick={() => setActiveFilter(activeFilter === "completed" ? "all" : "completed")}
            testId="widget-completed"
          />
          <StatusWidget
            title="Total Orders"
            count={orderCounts.all}
            icon={Package}
            color="gray"
            isActive={activeFilter === "all"}
            onClick={() => setActiveFilter("all")}
            testId="widget-total-orders"
          />
        </div>

        <Card>
          <CardHeader className="pb-4">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
              <div>
                <CardTitle className="flex items-center gap-2" data-testid="title-orders-list">
                  <Package className="h-5 w-5 text-primary" />
                  {activeFilter === "all" ? "All Orders" : 
                   activeFilter === "pending" ? "New Orders" :
                   activeFilter === "preparing" ? "Orders In Progress" :
                   activeFilter === "completed" ? "Completed Orders" :
                   activeFilter === "rejected" ? "Rejected Orders" :
                   "Cancelled Orders"}
                </CardTitle>
                <CardDescription>
                  {filteredOrders.length} {filteredOrders.length === 1 ? "order" : "orders"} found
                </CardDescription>
              </div>
              {activeFilter !== "all" && (
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setActiveFilter("all")}
                  className="gap-2"
                  data-testid="button-clear-filter"
                >
                  <X className="h-4 w-4" />
                  Clear Filter
                </Button>
              )}
            </div>
          </CardHeader>
          <CardContent>
            {ordersLoading ? (
              <div className="flex items-center justify-center py-12">
                <motion.div
                  animate={{ rotate: 360 }}
                  transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                >
                  <RefreshCw className="h-8 w-8 text-muted-foreground" />
                </motion.div>
              </div>
            ) : filteredOrders.length === 0 ? (
              <div className="text-center py-12">
                <Package className="h-12 w-12 text-muted-foreground/50 mx-auto mb-4" />
                <p className="text-lg font-medium text-muted-foreground">No orders found</p>
                <p className="text-sm text-muted-foreground/70">
                  {activeFilter === "all" 
                    ? "Orders will appear here when customers place them"
                    : `No ${activeFilter} orders at the moment`}
                </p>
              </div>
            ) : (
              <div className="space-y-4">
                <AnimatePresence mode="popLayout">
                  {filteredOrders.map((order) => (
                    <OrderCard
                      key={order.id}
                      order={order}
                      onProceed={handleProceedClick}
                      onReject={handleRejectClick}
                      onComplete={handleCompleteOrder}
                      onViewDetails={handleViewDetails}
                      isUpdating={updateOrderStatusMutation.isPending}
                      completingOrderId={completingOrderId}
                    />
                  ))}
                </AnimatePresence>
              </div>
            )}
          </CardContent>
        </Card>
      </main>

      <Dialog open={showPrepTimeDialog} onOpenChange={setShowPrepTimeDialog}>
        <DialogContent data-testid="dialog-preparation-time">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <Timer className="h-5 w-5 text-primary" />
              Set Preparation Time
            </DialogTitle>
            <DialogDescription>
              Enter the estimated time needed to complete this order.
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="prep-time">Preparation Time (minutes)</Label>
              <Input
                id="prep-time"
                type="number"
                placeholder="e.g., 20"
                value={preparationTime}
                onChange={(e) => setPreparationTime(e.target.value)}
                data-testid="input-preparation-time"
                autoFocus
              />
              <p className="text-xs text-muted-foreground">
                Enter the time in minutes (e.g., 15, 30, 45)
              </p>
            </div>
          </div>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => {
                setShowPrepTimeDialog(false);
                setPreparationTime("");
                setSelectedOrderId("");
              }}
              disabled={updateOrderStatusMutation.isPending}
              data-testid="button-cancel-dialog"
            >
              Cancel
            </Button>
            <Button
              onClick={handleConfirmProceed}
              disabled={updateOrderStatusMutation.isPending || !preparationTime.trim()}
              className="gap-2 bg-green-600 hover:bg-green-700"
              data-testid="button-confirm-proceed"
            >
              <Check className="h-4 w-4" />
              {updateOrderStatusMutation.isPending ? "Processing..." : "Accept Order"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <Dialog open={showRejectDialog} onOpenChange={setShowRejectDialog}>
        <DialogContent data-testid="dialog-rejection-reason">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <AlertCircle className="h-5 w-5 text-destructive" />
              Reject Order
            </DialogTitle>
            <DialogDescription>
              Please provide a reason for rejecting this order. The customer will see this message.
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="rejection-reason">Rejection Reason</Label>
              <Input
                id="rejection-reason"
                placeholder="e.g., Out of stock, Kitchen closed, etc."
                value={rejectionReason}
                onChange={(e) => setRejectionReason(e.target.value)}
                data-testid="input-rejection-reason"
                autoFocus
              />
            </div>
          </div>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => {
                setShowRejectDialog(false);
                setRejectionReason("");
                setSelectedOrderId("");
              }}
              disabled={updateOrderStatusMutation.isPending}
              data-testid="button-cancel-reject-dialog"
            >
              Cancel
            </Button>
            <Button
              variant="destructive"
              onClick={handleConfirmReject}
              disabled={updateOrderStatusMutation.isPending || !rejectionReason.trim()}
              className="gap-2"
              data-testid="button-confirm-reject"
            >
              <X className="h-4 w-4" />
              {updateOrderStatusMutation.isPending ? "Rejecting..." : "Confirm Rejection"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <Dialog open={showDetailsDialog} onOpenChange={setShowDetailsDialog}>
        <DialogContent className="max-w-3xl max-h-[80vh] overflow-y-auto" data-testid="dialog-order-details">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <Eye className="h-5 w-5 text-primary" />
              Order Details
            </DialogTitle>
            <DialogDescription>
              {selectedOrderForDetails && (
                <div className="space-y-1 mt-2">
                  <p className="flex items-center gap-2">
                    <Users className="h-4 w-4" />
                    {selectedOrderForDetails.userName || selectedOrderForDetails.userEmail}
                  </p>
                  <p className="flex items-center gap-2">
                    <Package className="h-4 w-4" />
                    Order #{selectedOrderForDetails.id.substring(0, 8).toUpperCase()}
                  </p>
                  <p className="flex items-center gap-2">
                    <Clock className="h-4 w-4" />
                    {new Date(selectedOrderForDetails.createdAt).toLocaleDateString()} {new Date(selectedOrderForDetails.createdAt).toLocaleTimeString()}
                  </p>
                </div>
              )}
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4">
            {selectedOrderForDetails && Array.isArray(selectedOrderForDetails.items) && selectedOrderForDetails.items.map((item: any, index: number) => (
              <Card key={index} className="overflow-hidden" data-testid={`detail-item-${index}`}>
                <CardContent className="p-4">
                  <div className="flex gap-4">
                    <div className="relative w-20 h-20 md:w-24 md:h-24 rounded-lg overflow-hidden flex-shrink-0">
                      <img
                        src={item.image}
                        alt={item.name}
                        className="w-full h-full object-cover"
                        data-testid={`img-detail-item-${index}`}
                      />
                    </div>
                    <div className="flex-1 space-y-2">
                      <div className="flex items-start justify-between gap-2">
                        <h3 className="font-semibold text-base md:text-lg" data-testid={`text-detail-item-name-${index}`}>
                          {item.name}
                        </h3>
                        <Badge variant="secondary" className="flex-shrink-0">
                          x{item.quantity}
                        </Badge>
                      </div>
                      {item.description && (
                        <p className="text-sm text-muted-foreground line-clamp-2" data-testid={`text-detail-item-description-${index}`}>
                          {item.description}
                        </p>
                      )}
                      <div className="flex gap-3 flex-wrap text-sm">
                        {item.calories && (
                          <div className="flex items-center gap-1 text-orange-600 dark:text-orange-400">
                            <Flame className="h-3.5 w-3.5" />
                            <span>{item.calories} cal</span>
                          </div>
                        )}
                        {item.protein && (
                          <div className="flex items-center gap-1 text-green-600 dark:text-green-400">
                            <TrendingUp className="h-3.5 w-3.5" />
                            <span>{item.protein}g protein</span>
                          </div>
                        )}
                      </div>
                      <div className="flex items-center justify-between pt-2 border-t">
                        <span className="text-sm text-muted-foreground">${item.price} each</span>
                        <span className="font-semibold text-primary">
                          ${(Number(item.price) * item.quantity).toFixed(2)}
                        </span>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
            
            {selectedOrderForDetails && (
              <Card className="bg-muted/50">
                <CardContent className="p-4">
                  <div className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span className="text-muted-foreground">Subtotal</span>
                      <span>${selectedOrderForDetails.subtotal}</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-muted-foreground">Tax</span>
                      <span>${selectedOrderForDetails.tax}</span>
                    </div>
                    <Separator />
                    <div className="flex justify-between font-bold text-lg">
                      <span>Total</span>
                      <span className="text-primary">${selectedOrderForDetails.total}</span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            )}
          </div>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setShowDetailsDialog(false)}
              data-testid="button-close-details"
            >
              Close
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
