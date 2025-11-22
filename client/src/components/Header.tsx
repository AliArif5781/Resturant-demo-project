import { User, ShoppingCart, LogOut, Package } from "lucide-react";
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
