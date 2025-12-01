import { User, ShoppingCart, LogOut, Package, UtensilsCrossed } from "lucide-react";
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
  const { currentUser, signout } = useAuth();
  const [, setLocation] = useLocation();
  const { toast } = useToast();

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
    <header className="absolute top-0 left-0 right-0 z-50" data-testid="header-main">
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

          <div className="flex items-center gap-3">
            <Link href="/cart">
              <Button
                size="icon"
                variant="ghost"
                className="relative text-white/90 rounded-full"
                data-testid="button-cart"
              >
                <ShoppingCart className="h-5 w-5" />
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
                  <DropdownMenuItem asChild>
                    <Link href="/orders" data-testid="link-my-orders">
                      <Package className="mr-2 h-4 w-4" />
                      My Orders
                    </Link>
                  </DropdownMenuItem>
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
                  <Button
                    variant="ghost"
                    size="sm"
                    className="text-white/90 rounded-full px-4"
                    data-testid="button-signin"
                  >
                    Sign In
                  </Button>
                </Link>
                <Link href="/signup">
                  <Button
                    size="sm"
                    className="rounded-full px-5"
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
