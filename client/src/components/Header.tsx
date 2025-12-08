import { useState, useEffect } from "react";
import { User, ShoppingCart, LogOut, Package, UtensilsCrossed, Menu, LayoutDashboard, Bell } from "lucide-react";
import { useOrderNotifications } from "@/contexts/OrderNotificationContext";
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
import { useCart } from "@/contexts/CartContext";
import { useAuth } from "@/contexts/AuthContext";
import { Link, useLocation } from "wouter";
import { useToast } from "@/hooks/use-toast";

interface HeaderProps {
  mode?: "dine-in" | "pickup";
  tableNumber?: string;
}

export default function Header({
  mode,
  tableNumber,
}: HeaderProps = {}) {
  const { totalItems } = useCart();
  const { currentUser, signout, getUserRole } = useAuth();
  const { pendingOrderCount, isAdmin: isAdminNotification } = useOrderNotifications();
  const [, setLocation] = useLocation();
  const { toast } = useToast();
  const [userRole, setUserRole] = useState<string | null>(null);

  useEffect(() => {
    const fetchRole = async () => {
      if (currentUser) {
        const role = await getUserRole(currentUser.uid);
        setUserRole(role);
      } else {
        setUserRole(null);
      }
    };
    fetchRole();
  }, [currentUser, getUserRole]);

  const isAdmin = userRole === "admin";

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

  return (
    <header className="absolute top-0 left-0 right-0 z-50 bg-black/40 backdrop-blur-sm" data-testid="header-main">
      <div className="container mx-auto px-6 md:px-12 lg:px-20 py-5">
        <div className="flex items-center justify-between gap-4">
          <Link href="/">
            <div className="flex items-center gap-3 cursor-pointer">
              <span className="font-bold text-xl text-white tracking-tight" data-testid="text-brand-name">
                Karahi Point
              </span>
            </div>
          </Link>

          <nav className="hidden md:flex items-center">
            <Link href="/menu">
              <Button
                variant="ghost"
                className="text-white/90 rounded-full px-4 gap-2 hover:bg-white/20 hover:text-white transition-all duration-200"
                data-testid="link-menu"
              >
                <UtensilsCrossed className="h-4 w-4" />
                Menu
              </Button>
            </Link>
          </nav>

          <div className="flex items-center gap-2 md:gap-3">
            <Link href="/menu" className="md:hidden">
              <Button
                size="icon"
                variant="ghost"
                className="text-white/90 rounded-full"
                data-testid="button-menu-mobile"
              >
                <Menu className="h-5 w-5" />
              </Button>
            </Link>
            <Link href="/cart">
              <div className="relative">
                <Button
                  size="icon"
                  variant="ghost"
                  className="text-white/90 rounded-full"
                  data-testid="button-cart"
                >
                  <ShoppingCart className="h-5 w-5" />
                </Button>
                {totalItems > 0 && (
                  <span
                    className="absolute -top-1 -right-1 h-5 min-w-[1.25rem] flex items-center justify-center px-1 text-[10px] font-bold bg-primary text-primary-foreground rounded-full pointer-events-none"
                    data-testid="badge-cart-count"
                  >
                    {totalItems}
                  </span>
                )}
              </div>
            </Link>

            {isAdminNotification && (
              <Link href="/admin">
                <div className="relative">
                  <Button
                    size="icon"
                    variant="ghost"
                    className="text-white/90 rounded-full"
                    data-testid="button-notifications"
                  >
                    <Bell className="h-5 w-5" />
                  </Button>
                  {pendingOrderCount > 0 && (
                    <span
                      className="absolute -top-1 -right-1 h-5 min-w-[1.25rem] flex items-center justify-center px-1 text-[10px] font-bold bg-primary text-primary-foreground rounded-full pointer-events-none"
                      data-testid="badge-notification-count"
                    >
                      {pendingOrderCount > 99 ? "99+" : pendingOrderCount}
                    </span>
                  )}
                </div>
              </Link>
            )}

            {currentUser ? (
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Avatar
                    className="h-9 w-9 cursor-pointer border-2 border-white/20"
                    data-testid="avatar-user"
                  >
                    {currentUser.photoURL && (
                      <AvatarImage src={currentUser.photoURL} />
                    )}
                    <AvatarFallback className="bg-white/20 text-white text-xs">
                      {currentUser.displayName ? (
                        currentUser.displayName.charAt(0).toUpperCase()
                      ) : (
                        <User className="h-4 w-4" />
                      )}
                    </AvatarFallback>
                  </Avatar>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
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
                  {isAdmin ? (
                    <DropdownMenuItem asChild>
                      <Link href="/admin" data-testid="link-admin-dashboard">
                        <LayoutDashboard className="mr-2 h-4 w-4" />
                        Dashboard
                      </Link>
                    </DropdownMenuItem>
                  ) : (
                    <DropdownMenuItem asChild>
                      <Link href="/orders" data-testid="link-my-orders">
                        <Package className="mr-2 h-4 w-4" />
                        My Orders
                      </Link>
                    </DropdownMenuItem>
                  )}
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
              <div className="flex items-center gap-1 md:gap-2">
                <Link href="/signin">
                  <Button
                    variant="ghost"
                    size="sm"
                    className="text-white/90 rounded-full px-2 md:px-4"
                    data-testid="button-signin"
                  >
                    <span className="hidden sm:inline">Sign In</span>
                    <User className="h-4 w-4 sm:hidden" />
                  </Button>
                </Link>
                <Link href="/signup">
                  <Button
                    size="sm"
                    className="rounded-full px-3 md:px-5"
                    data-testid="button-signup"
                  >
                    <span className="hidden sm:inline">Sign Up</span>
                    <span className="sm:hidden text-xs">Join</span>
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
