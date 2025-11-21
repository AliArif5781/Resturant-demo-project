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
import { Package, Home, Check, X, Clock, MapPin } from "lucide-react";
import { useQuery, useMutation } from "@tanstack/react-query";
import { apiRequest, queryClient } from "@/lib/queryClient";
import type { Order } from "@shared/schema";

export default function AdminDashboard() {
  const [, setLocation] = useLocation();
  const { currentUser, signout, getUserRole } = useAuth();
  const { toast } = useToast();
  const [loading, setLoading] = useState(true);
  const [isAdmin, setIsAdmin] = useState(false);
  const [showPrepTimeDialog, setShowPrepTimeDialog] = useState(false);
  const [selectedOrderId, setSelectedOrderId] = useState<string>("");
  const [preparationTime, setPreparationTime] = useState("");

  const { data: ordersData, isLoading: ordersLoading } = useQuery<{ orders: Order[] }>({
    queryKey: ["/api/orders"],
    enabled: isAdmin,
  });

  const orders = ordersData?.orders || [];

  const updateOrderStatusMutation = useMutation({
    mutationFn: async ({ orderId, status, preparationTime }: { orderId: string; status: string; preparationTime?: string }) => {
      const response = await apiRequest("PATCH", `/api/orders/${orderId}/status`, { status, preparationTime });
      return await response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/orders"] });
      setShowPrepTimeDialog(false);
      setPreparationTime("");
      setSelectedOrderId("");
      toast({
        title: "Success",
        description: "Order status updated successfully",
      });
    },
    onError: (error: any) => {
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
                            </div>
                            <div className="text-right space-y-2">
                              <div className="text-lg font-bold" data-testid={`text-order-total-${order.id}`}>
                                ${order.total}
                              </div>
                              <div className="flex flex-col items-end gap-2">
                                <Badge 
                                  variant={
                                    order.status === "completed" ? "default" : 
                                    order.status === "cancelled" ? "destructive" : 
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
                                onClick={() => updateOrderStatusMutation.mutate({ orderId: order.id, status: "cancelled" })}
                                disabled={updateOrderStatusMutation.isPending}
                                className="gap-2 bg-red-100 dark:bg-red-900 text-red-900 dark:text-red-100 border-red-300 dark:border-red-700"
                                data-testid={`button-cancel-${order.id}`}
                              >
                                <X className="h-4 w-4" />
                                Cancel
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
    </div>
  );
}
