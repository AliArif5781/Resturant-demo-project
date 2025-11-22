import { useQuery } from "@tanstack/react-query";
import { useAuth } from "@/contexts/AuthContext";
import { Link, useLocation } from "wouter";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Clock, ChefHat, Package, CheckCircle, ArrowLeft, XCircle } from "lucide-react";
import type { Order } from "@shared/schema";

export default function Orders() {
  const { currentUser } = useAuth();
  const [, setLocation] = useLocation();

  const { data: ordersData, isLoading } = useQuery<{ orders: Order[] }>({
    queryKey: ["/api/orders"],
    enabled: !!currentUser,
  });

  const orders = ordersData?.orders || [];

  const handleOrderClick = (order: Order) => {
    // Save order data to sessionStorage for the OrderConfirmation page
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

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "pending":
        return <Clock className="h-4 w-4" />;
      case "preparing":
        return <ChefHat className="h-4 w-4" />;
      case "ready":
        return <Package className="h-4 w-4" />;
      case "completed":
        return <CheckCircle className="h-4 w-4" />;
      case "rejected":
        return <XCircle className="h-4 w-4" />;
      default:
        return <Clock className="h-4 w-4" />;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "pending":
        return "bg-orange-100 dark:bg-orange-950/50 text-orange-700 dark:text-orange-300 border-orange-200 dark:border-orange-800";
      case "preparing":
        return "bg-green-100 dark:bg-green-950/50 text-green-700 dark:text-green-300 border-green-200 dark:border-green-800";
      case "ready":
        return "bg-blue-100 dark:bg-blue-950/50 text-blue-700 dark:text-blue-300 border-blue-200 dark:border-blue-800";
      case "completed":
        return "bg-emerald-100 dark:bg-emerald-950/50 text-emerald-700 dark:text-emerald-300 border-emerald-200 dark:border-emerald-800";
      case "rejected":
        return "bg-red-100 dark:bg-red-950/50 text-red-700 dark:text-red-300 border-red-200 dark:border-red-800";
      default:
        return "bg-gray-100 dark:bg-gray-950/50 text-gray-700 dark:text-gray-300 border-gray-200 dark:border-gray-800";
    }
  };

  if (!currentUser) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-900 to-slate-900 flex items-center justify-center p-4">
        <Card className="w-full max-w-md">
          <CardContent className="pt-6 text-center">
            <p className="text-muted-foreground mb-4">Please sign in to view your orders</p>
            <Link href="/signin">
              <Button data-testid="button-signin">Sign In</Button>
            </Link>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-900 to-slate-900 p-4">
      <div className="container mx-auto max-w-4xl">
        <div className="mb-6">
          <Link href="/">
            <Button variant="ghost" size="sm" data-testid="button-back">
              <ArrowLeft className="mr-2 h-4 w-4" />
              Back to Menu
            </Button>
          </Link>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>My Orders</CardTitle>
          </CardHeader>
          <CardContent>
            {isLoading ? (
              <div className="text-center py-8 text-muted-foreground">
                Loading orders...
              </div>
            ) : orders.length === 0 ? (
              <div className="text-center py-8">
                <p className="text-muted-foreground mb-4">No orders yet</p>
                <Link href="/">
                  <Button data-testid="button-start-ordering">Start Ordering</Button>
                </Link>
              </div>
            ) : (
              <div className="space-y-3">
                {orders.map((order) => (
                  <Card
                    key={order.id}
                    className="hover-elevate cursor-pointer"
                    onClick={() => handleOrderClick(order)}
                    data-testid={`order-card-${order.id}`}
                  >
                    <CardContent className="p-4">
                      <div className="flex items-center justify-between gap-4">
                        <div className="flex-1">
                          <div className="flex items-center gap-3 mb-2">
                            <span className="font-semibold text-lg">
                              #{order.id.slice(0, 8).toUpperCase()}
                            </span>
                            <Badge 
                              variant="outline" 
                              className={`${getStatusColor(order.status)}`}
                            >
                              {getStatusIcon(order.status)}
                              <span className="ml-1 capitalize">{order.status}</span>
                            </Badge>
                          </div>
                          <div className="text-sm text-muted-foreground">
                            {new Date(order.createdAt).toLocaleDateString()} at{" "}
                            {new Date(order.createdAt).toLocaleTimeString()}
                          </div>
                          {order.preparationTime && (
                            <div className="text-sm text-muted-foreground mt-1">
                              Preparation time: {order.preparationTime} mins
                            </div>
                          )}
                          {order.status === "rejected" && order.rejectionReason && (
                            <div className="text-sm text-red-600 dark:text-red-400 mt-1">
                              Rejected: {order.rejectionReason}
                            </div>
                          )}
                        </div>
                        <div className="text-right">
                          <div className="font-bold text-xl">
                            ${Number(order.total).toFixed(2)}
                          </div>
                          <div className="text-sm text-muted-foreground">
                            {Array.isArray(order.items) ? order.items.length : 0} items
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
