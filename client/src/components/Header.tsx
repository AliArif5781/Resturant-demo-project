import { User, ShoppingCart, LogOut, Package, Clock, ChefHat, CheckCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { ScrollArea } from "@/components/ui/scroll-area";
import { useCart } from "@/contexts/CartContext";
import { useAuth } from "@/contexts/AuthContext";
import { Link, useLocation } from "wouter";
import { useToast } from "@/hooks/use-toast";
import { useQuery } from "@tanstack/react-query";
import type { Order } from "@shared/schema";

interface HeaderProps {
  mode?: "dine-in" | "pickup";
  tableNumber?: string;
}

export default function Header({
  mode = "dine-in",
  tableNumber = "T12",
}: HeaderProps) {
  const { totalItems } = useCart();
  const { currentUser, signout } = useAuth();
  const [, setLocation] = useLocation();
  const { toast } = useToast();

  // Fetch user's orders
  const { data: ordersData } = useQuery<{ orders: Order[] }>({
    queryKey: ["/api/orders"],
    enabled: !!currentUser,
  });

  const userOrders = ordersData?.orders || [];

  const handleSignout = async () => {
    try {
      await signout();
      toast({
        title: "Success",
        description: "Signed out successfully",
      });
      setLocation("/");
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message || "Failed to sign out",
        variant: "destructive",
      });
    }
  };

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
        return <Clock className="h-3 w-3" />;
      case "preparing":
        return <ChefHat className="h-3 w-3" />;
      case "ready":
        return <Package className="h-3 w-3" />;
      case "completed":
        return <CheckCircle className="h-3 w-3" />;
      default:
        return <Clock className="h-3 w-3" />;
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
      default:
        return "bg-gray-100 dark:bg-gray-950/50 text-gray-700 dark:text-gray-300 border-gray-200 dark:border-gray-800";
    }
  };

  return (
    <header className="bg-transparent" data-testid="header-main">
      <div className="container mx-auto px-4 py-3">
        <div className="flex items-center justify-between gap-4">
          <Link href="/">
            <div className="flex items-center gap-3 cursor-pointer">
              <span className="font-bold text-lg text-white">Karahi Point</span>
            </div>
          </Link>

          <div className="flex items-center gap-2">
            <Link href="/cart">
              <Button
                size="icon"
                variant="ghost"
                className="relative"
                data-testid="button-cart"
              >
                <ShoppingCart className="h-5 w-5 text-white" />
                {totalItems > 0 && (
                  <Badge
                    className="absolute -top-1 -right-1 h-4 w-4 min-w-[1rem] flex items-center justify-center p-0 text-[10px] font-semibold bg-primary text-primary-foreground rounded-full"
                    data-testid="badge-cart-count"
                  >
                    {totalItems}
                  </Badge>
                )}
              </Button>
            </Link>

            {currentUser ? (
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Avatar
                    className="h-8 w-8 cursor-pointer"
                    data-testid="avatar-user"
                  >
                    {currentUser.photoURL && (
                      <AvatarImage src={currentUser.photoURL} />
                    )}
                    <AvatarFallback className="bg-accent text-xs">
                      {currentUser.displayName ? (
                        currentUser.displayName.charAt(0).toUpperCase()
                      ) : (
                        <User className="h-4 w-4" />
                      )}
                    </AvatarFallback>
                  </Avatar>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-80">
                  <DropdownMenuLabel data-testid="text-user-name">
                    {currentUser.displayName || currentUser.email}
                  </DropdownMenuLabel>
                  <DropdownMenuLabel
                    className="text-xs text-muted-foreground font-normal"
                    data-testid="text-user-email"
                  >
                    {currentUser.email}
                  </DropdownMenuLabel>
                  <DropdownMenuSeparator />
                  
                  {/* My Orders Section */}
                  <DropdownMenuLabel className="text-sm font-semibold">
                    My Orders
                  </DropdownMenuLabel>
                  <ScrollArea className="h-[300px]">
                    {userOrders.length === 0 ? (
                      <div className="px-2 py-4 text-center text-sm text-muted-foreground">
                        No orders yet
                      </div>
                    ) : (
                      <div className="space-y-1 px-1">
                        {userOrders.map((order) => (
                          <DropdownMenuItem
                            key={order.id}
                            onClick={() => handleOrderClick(order)}
                            className="cursor-pointer flex flex-col items-start gap-2 p-3 hover-elevate"
                            data-testid={`order-item-${order.id}`}
                          >
                            <div className="flex items-center justify-between w-full">
                              <span className="font-medium text-sm">
                                #{order.id.slice(0, 8).toUpperCase()}
                              </span>
                              <Badge 
                                variant="outline" 
                                className={`text-xs ${getStatusColor(order.status)}`}
                              >
                                {getStatusIcon(order.status)}
                                <span className="ml-1 capitalize">{order.status}</span>
                              </Badge>
                            </div>
                            <div className="flex items-center justify-between w-full text-xs text-muted-foreground">
                              <span>{new Date(order.createdAt).toLocaleDateString()}</span>
                              <span className="font-semibold text-foreground">${Number(order.total).toFixed(2)}</span>
                            </div>
                          </DropdownMenuItem>
                        ))}
                      </div>
                    )}
                  </ScrollArea>
                  
                  <DropdownMenuSeparator />
                  <DropdownMenuItem
                    onClick={handleSignout}
                    data-testid="button-signout"
                  >
                    <LogOut className="mr-2 h-4 w-4" />
                    Sign out
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            ) : (
              <div className="flex items-center gap-2">
                <Link href="/signin">
                  <Button variant="white" size="sm" data-testid="button-signin">
                    Sign In
                  </Button>
                </Link>
                <Link href="/signup">
                  <Button
                    variant="default"
                    size="sm"
                    data-testid="button-signup"
                  >
                    Sign Up
                  </Button>
                </Link>
              </div>
            )}
          </div>
        </div>
      </div>
    </header>
  );
}
