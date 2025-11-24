import { useEffect, useState } from "react";
import { useLocation } from "wouter";
import { useAuth } from "@/contexts/AuthContext";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import { Package, Home, Check, X, Clock, MapPin, Sparkles, Eye } from "lucide-react";
import { useQuery, useMutation } from "@tanstack/react-query";
import { apiRequest, queryClient } from "@/lib/queryClient";
import type { Order } from "@shared/schema";
import { motion, AnimatePresence } from "framer-motion";

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

  const { data: ordersData, isLoading: ordersLoading } = useQuery<{ orders: Order[] }>({
    queryKey: ["/api/orders"],
    enabled: isAdmin,
    refetchInterval: 3000,
  });

  const orders = ordersData?.orders || [];

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
      <div className="flex items-center justify-center min-h-screen">
        <p className="text-muted-foreground">Loading...</p>
      </div>
    );
  }

  if (!isAdmin) {
    return null;
  }

  return (
    <div className="min-h-screen bg-background">
      <header className="border-b">
        <div className="container mx-auto px-4 py-4">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <h1 className="text-xl sm:text-2xl font-bold" data-testid="title-admin-dashboard">
              Karahi Point Admin
            </h1>
            <div className="flex items-center gap-2 flex-wrap">
              <p className="text-sm text-muted-foreground hidden md:block">
                {currentUser?.displayName || currentUser?.email}
              </p>
              <Button 
                variant="outline" 
                size="sm"
                onClick={() => setLocation("/")} 
                data-testid="button-home"
              >
                <Home className="h-4 w-4 sm:mr-2" />
                <span className="hidden sm:inline">Home</span>
              </Button>
              <Button 
                variant="outline" 
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

      <main className="container mx-auto px-4 py-8">
        <div className="mb-8">
          <h2 className="text-3xl font-bold mb-2">Dashboard</h2>
          <p className="text-muted-foreground">
            Manage your restaurant operations and monitor performance
          </p>
        </div>

        <div className="max-w-sm mb-8">
          <Card data-testid="card-stats-orders">
            <CardHeader className="flex flex-row items-center justify-between gap-2 space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Orders</CardTitle>
              <Package className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{orders.length}</div>
              <p className="text-xs text-muted-foreground">
                {orders.length === 0 ? "No orders yet" : `${orders.length} total orders`}
              </p>
            </CardContent>
          </Card>
        </div>

        <Card>
          <CardHeader>
            <CardTitle data-testid="title-recent-orders">Recent Orders</CardTitle>
            <CardDescription>Latest orders from customers</CardDescription>
          </CardHeader>
          <CardContent>
            {ordersLoading ? (
              <div className="text-center py-8 text-muted-foreground">
                Loading orders...
              </div>
            ) : orders.length === 0 ? (
              <div className="text-center py-8 text-muted-foreground">
                No orders yet
              </div>
            ) : (
              <div className="space-y-4">
                {orders.map((order) => {
                  const items = Array.isArray(order.items) ? order.items : [];
                  return (
                    <Card key={order.id} className="border" data-testid={`card-order-${order.id}`}>
                      <CardContent className="p-4">
                        <div className="flex flex-col gap-4">
                          <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4">
                            <div className="flex-1 space-y-2">
                              <div className="flex items-center gap-2 flex-wrap">
                                <h3 className="font-semibold" data-testid={`text-order-user-${order.id}`}>
                                  {order.userName || order.userEmail}
                                </h3>
                                <span className="text-xs text-muted-foreground">
                                  {new Date(order.createdAt).toLocaleDateString()} {new Date(order.createdAt).toLocaleTimeString()}
                                </span>
                              </div>
                              <div className="text-sm text-muted-foreground">
                                {items.length} {items.length === 1 ? "item" : "items"}
                              </div>
                              <div className="flex flex-wrap gap-1">
                                {items.map((item: any, idx: number) => (
                                  <span key={idx} className="text-xs bg-muted px-2 py-1 rounded-md">
                                    {item.name} x{item.quantity}
                                  </span>
                                ))}
                              </div>
                              <Button
                                size="sm"
                                variant="outline"
                                onClick={() => handleViewDetails(order)}
                                className="gap-2 mt-2"
                                data-testid={`button-view-details-${order.id}`}
                              >
                                <Eye className="h-4 w-4" />
                                View Details
                              </Button>
                            </div>
                            <div className="text-right space-y-2">
                              <div className="text-lg font-bold" data-testid={`text-order-total-${order.id}`}>
                                ${order.total}
                              </div>
                              <div className="flex flex-col items-end gap-2">
                                <Badge 
                                  variant={
                                    order.status === "completed" ? "default" : 
                                    order.status === "rejected" || order.status === "cancelled" ? "destructive" : 
                                    "secondary"
                                  }
                                  className={
                                    order.status === "preparing" 
                                      ? "bg-green-100 dark:bg-green-900 text-green-900 dark:text-green-100 border-green-300 dark:border-green-700" 
                                      : ""
                                  }
                                  data-testid={`badge-order-status-${order.id}`}
                                >
                                  {order.status}
                                </Badge>
                                {order.guestArrived === true && (
                                  <Badge 
                                    variant="outline" 
                                    className="bg-blue-50 dark:bg-blue-950 text-blue-700 dark:text-blue-300 border-blue-200 dark:border-blue-800"
                                    data-testid={`badge-guest-arrived-${order.id}`}
                                  >
                                    <MapPin className="h-3 w-3 mr-1" />
                                    Guest Arrived
                                  </Badge>
                                )}
                              </div>
                            </div>
                          </div>
                          
                          {order.status === "pending" && (
                            <div className="flex gap-2 flex-wrap">
                              <Button
                                size="sm"
                                variant="outline"
                                onClick={() => handleProceedClick(order.id)}
                                disabled={updateOrderStatusMutation.isPending}
                                className="gap-2 bg-green-100 dark:bg-green-900 text-green-900 dark:text-green-100 border-green-300 dark:border-green-700"
                                data-testid={`button-proceed-${order.id}`}
                              >
                                <Check className="h-4 w-4" />
                                Proceed
                              </Button>
                              <Button
                                size="sm"
                                variant="outline"
                                onClick={() => handleRejectClick(order.id)}
                                disabled={updateOrderStatusMutation.isPending}
                                className="gap-2 bg-red-100 dark:bg-red-900 text-red-900 dark:text-red-100 border-red-300 dark:border-red-700"
                                data-testid={`button-reject-${order.id}`}
                              >
                                <X className="h-4 w-4" />
                                Reject
                              </Button>
                            </div>
                          )}

                          {order.status === "preparing" && order.preparationTime && (
                            <div className="flex flex-col gap-3 p-4 bg-gradient-to-r from-green-50 to-emerald-50 dark:from-green-950/30 dark:to-emerald-950/30 rounded-md border border-green-200 dark:border-green-800">
                              <div className="flex items-center gap-2 text-sm font-medium text-green-800 dark:text-green-300">
                                <Clock className="h-4 w-4" />
                                <span>Estimated Time: {order.preparationTime}</span>
                              </div>
                              <Button
                                size="sm"
                                onClick={() => handleCompleteOrder(order.id)}
                                disabled={completingOrderId === order.id}
                                className="gap-2 bg-green-600 dark:bg-green-700 text-white border-green-700 dark:border-green-600"
                                data-testid={`button-completed-${order.id}`}
                              >
                                <Check className="h-4 w-4" />
                                {completingOrderId === order.id ? "Completing..." : "Mark as Completed"}
                              </Button>
                            </div>
                          )}
                        </div>
                      </CardContent>
                    </Card>
                  );
                })}
              </div>
            )}
          </CardContent>
        </Card>
      </main>

      <Dialog open={showPrepTimeDialog} onOpenChange={setShowPrepTimeDialog}>
        <DialogContent data-testid="dialog-preparation-time">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <Clock className="h-5 w-5 text-primary" />
              Set Preparation Time
            </DialogTitle>
            <DialogDescription>
              Enter the estimated time needed to complete this order.
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="prep-time">Preparation Time (e.g., "15 minutes", "30 mins", "1 hour")</Label>
              <Input
                id="prep-time"
                placeholder="e.g., 20 minutes"
                value={preparationTime}
                onChange={(e) => setPreparationTime(e.target.value)}
                data-testid="input-preparation-time"
                autoFocus
              />
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
              className="gap-2"
              data-testid="button-confirm-proceed"
            >
              <Check className="h-4 w-4" />
              {updateOrderStatusMutation.isPending ? "Processing..." : "Confirm & Proceed"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <Dialog open={showRejectDialog} onOpenChange={setShowRejectDialog}>
        <DialogContent data-testid="dialog-rejection-reason">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <X className="h-5 w-5 text-destructive" />
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
                <div className="space-y-1">
                  <p>Customer: {selectedOrderForDetails.userName || selectedOrderForDetails.userEmail}</p>
                  <p>Order ID: {selectedOrderForDetails.id.substring(0, 8).toUpperCase()}</p>
                  <p>Date: {new Date(selectedOrderForDetails.createdAt).toLocaleDateString()} {new Date(selectedOrderForDetails.createdAt).toLocaleTimeString()}</p>
                </div>
              )}
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4">
            {selectedOrderForDetails && Array.isArray(selectedOrderForDetails.items) && selectedOrderForDetails.items.map((item: any, index: number) => (
              <Card key={index} className="overflow-hidden" data-testid={`detail-item-${index}`}>
                <CardContent className="p-4">
                  <div className="flex gap-4">
                    <div className="relative w-24 h-24 rounded-md overflow-hidden flex-shrink-0">
                      <img
                        src={item.image}
                        alt={item.name}
                        className="w-full h-full object-cover"
                        data-testid={`img-detail-item-${index}`}
                      />
                    </div>
                    <div className="flex-1 space-y-2">
                      <div className="flex items-start justify-between gap-2">
                        <h3 className="font-semibold text-lg" data-testid={`text-detail-item-name-${index}`}>
                          {item.name}
                        </h3>
                        <Badge variant="outline" className="flex-shrink-0">
                          Qty: {item.quantity}
                        </Badge>
                      </div>
                      {item.description && (
                        <p className="text-sm text-muted-foreground" data-testid={`text-detail-item-description-${index}`}>
                          {item.description}
                        </p>
                      )}
                      <div className="flex gap-2 flex-wrap">
                        {item.calories && (
                          <Badge variant="outline" className="bg-orange-50 dark:bg-orange-950 text-orange-700 dark:text-orange-300 border-orange-200 dark:border-orange-800" data-testid={`badge-detail-calories-${index}`}>
                            🔥 {item.calories} cal
                          </Badge>
                        )}
                        {item.protein && (
                          <Badge variant="outline" className="bg-green-50 dark:bg-green-950 text-green-700 dark:text-green-300 border-green-200 dark:border-green-800" data-testid={`badge-detail-protein-${index}`}>
                            💪 {item.protein}g protein
                          </Badge>
                        )}
                      </div>
                      <div className="flex items-center justify-between pt-2">
                        <span className="text-sm text-muted-foreground">Price per item</span>
                        <span className="font-bold text-primary">{item.price}</span>
                      </div>
                      <div className="flex items-center justify-between border-t pt-2">
                        <span className="font-medium">Subtotal</span>
                        <span className="font-bold text-lg text-primary">
                          ${(parseFloat(item.price.replace("$", "")) * item.quantity).toFixed(2)}
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
                    <div className="flex justify-between items-center text-sm">
                      <span className="text-muted-foreground">Subtotal</span>
                      <span className="font-semibold">${selectedOrderForDetails.subtotal}</span>
                    </div>
                    <div className="flex justify-between items-center text-sm">
                      <span className="text-muted-foreground">Tax</span>
                      <span className="font-semibold">${selectedOrderForDetails.tax}</span>
                    </div>
                    <div className="flex justify-between items-center text-lg border-t pt-2">
                      <span className="font-bold">Total</span>
                      <span className="font-bold text-primary text-xl">${selectedOrderForDetails.total}</span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            )}
          </div>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => {
                setShowDetailsDialog(false);
                setSelectedOrderForDetails(null);
              }}
              data-testid="button-close-details"
            >
              Close
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <AnimatePresence>
        {showCompletionAnimation && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm"
            data-testid="animation-completion"
          >
            <motion.div
              initial={{ scale: 0.5, opacity: 0, y: 50 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.8, opacity: 0, y: -50 }}
              transition={{
                type: "spring",
                stiffness: 260,
                damping: 20,
              }}
              className="relative"
            >
              <Card className="w-[90vw] max-w-md mx-4 overflow-hidden border-2 border-green-500/50 shadow-2xl">
                <CardContent className="p-8 text-center relative">
                  <motion.div
                    initial={{ scale: 0 }}
                    animate={{ scale: 1, rotate: 360 }}
                    transition={{
                      delay: 0.2,
                      type: "spring",
                      stiffness: 200,
                      damping: 15,
                    }}
                    className="mx-auto mb-6 w-20 h-20 rounded-full bg-gradient-to-br from-green-400 to-emerald-500 flex items-center justify-center"
                  >
                    <Check className="w-10 h-10 text-white" strokeWidth={3} />
                  </motion.div>

                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.4 }}
                  >
                    <h2 className="text-3xl font-bold mb-3 bg-gradient-to-r from-green-600 to-emerald-600 bg-clip-text text-transparent">
                      Order Prepared!
                    </h2>
                    <p className="text-lg text-muted-foreground mb-2">
                      Your order is ready
                    </p>
                    <p className="text-sm text-muted-foreground">
                      The customer has been notified
                    </p>
                  </motion.div>

                  <motion.div
                    className="absolute inset-0 pointer-events-none"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                  >
                    {[...Array(12)].map((_, i) => (
                      <motion.div
                        key={i}
                        className="absolute w-2 h-2 bg-gradient-to-r from-green-400 to-emerald-400 rounded-full"
                        initial={{
                          x: "50%",
                          y: "50%",
                          scale: 0,
                        }}
                        animate={{
                          x: `${50 + 40 * Math.cos((i * 2 * Math.PI) / 12)}%`,
                          y: `${50 + 40 * Math.sin((i * 2 * Math.PI) / 12)}%`,
                          scale: [0, 1, 0],
                          opacity: [0, 1, 0],
                        }}
                        transition={{
                          duration: 1.5,
                          delay: 0.3 + i * 0.05,
                          repeat: Infinity,
                          repeatDelay: 1,
                        }}
                      />
                    ))}
                  </motion.div>

                  <motion.div
                    className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-green-400 via-emerald-500 to-green-400"
                    initial={{ scaleX: 0 }}
                    animate={{ scaleX: 1 }}
                    transition={{ duration: 3 }}
                  />
                </CardContent>
              </Card>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
