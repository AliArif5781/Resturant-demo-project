import { useEffect, useState } from "react";
import { useLocation } from "wouter";
import { useAuth } from "@/contexts/AuthContext";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/hooks/use-toast";
import { Package, Home, Check, X } from "lucide-react";
import { useQuery, useMutation } from "@tanstack/react-query";
import { apiRequest, queryClient } from "@/lib/queryClient";
import type { Order } from "@shared/schema";

export default function AdminDashboard() {
  const [, setLocation] = useLocation();
  const { currentUser, signout, getUserRole } = useAuth();
  const { toast } = useToast();
  const [loading, setLoading] = useState(true);
  const [isAdmin, setIsAdmin] = useState(false);

  const { data: ordersData, isLoading: ordersLoading } = useQuery<{ orders: Order[] }>({
    queryKey: ["/api/orders"],
    enabled: isAdmin,
  });

  const orders = ordersData?.orders || [];

  const updateOrderStatusMutation = useMutation({
    mutationFn: async ({ orderId, status }: { orderId: string; status: string }) => {
      const response = await apiRequest("PATCH", `/api/orders/${orderId}/status`, { status });
      return await response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/orders"] });
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
                            <div className="text-right">
                              <div className="text-lg font-bold" data-testid={`text-order-total-${order.id}`}>
                                ${order.total}
                              </div>
                              <Badge 
                                variant={
                                  order.status === "completed" ? "default" : 
                                  order.status === "cancelled" ? "destructive" : 
                                  "secondary"
                                }
                                data-testid={`badge-order-status-${order.id}`}
                              >
                                {order.status}
                              </Badge>
                            </div>
                          </div>
                          
                          {order.status === "pending" && (
                            <div className="flex gap-2 flex-wrap">
                              <Button
                                size="sm"
                                variant="outline"
                                onClick={() => updateOrderStatusMutation.mutate({ orderId: order.id, status: "completed" })}
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
    </div>
  );
}
