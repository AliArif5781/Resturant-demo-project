import { ShoppingCart, ChefHat } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

interface StickyCartProps {
  mode?: "cart" | "order";
  cartData?: {
    itemCount: number;
    total: string;
  };
  orderData?: {
    orderNumber: string;
    status: string;
    timeLeft: string;
  };
  onOpenCart?: () => void;
  onTrackOrder?: () => void;
}

export default function StickyCart({
  mode = "cart",
  cartData,
  orderData,
  onOpenCart,
  onTrackOrder,
}: StickyCartProps) {
  if (mode === "cart" && cartData) {
    return (
      <div className="fixed bottom-0 left-0 right-0 z-40 bg-background border-t shadow-lg p-4" data-testid="sticky-cart">
        <div className="container mx-auto">
          <Button
            className="w-full justify-between text-base h-12"
            onClick={onOpenCart}
            data-testid="button-open-cart"
          >
            <span className="flex items-center gap-2">
              <ShoppingCart className="h-5 w-5" />
              <span data-testid="text-cart-items">{cartData.itemCount} items</span>
            </span>
            <span className="flex items-center gap-3">
              <span data-testid="text-cart-total">{cartData.total}</span>
              <span className="text-sm">Review & checkout →</span>
            </span>
          </Button>
        </div>
      </div>
    );
  }

  if (mode === "order" && orderData) {
    return (
      <div className="fixed bottom-0 left-0 right-0 z-40 bg-background border-t shadow-lg p-4" data-testid="sticky-order">
        <div className="container mx-auto">
          <Button
            variant="outline"
            className="w-full justify-between text-base h-12"
            onClick={onTrackOrder}
            data-testid="button-track-order"
          >
            <span className="flex items-center gap-2">
              <ChefHat className="h-5 w-5 text-primary" />
              <span>
                Order <span className="font-bold" data-testid="text-order-number">#{orderData.orderNumber}</span>
              </span>
              <Badge variant="secondary" data-testid="badge-order-status">{orderData.status}</Badge>
            </span>
            <span className="text-muted-foreground" data-testid="text-order-time">~{orderData.timeLeft}</span>
          </Button>
        </div>
      </div>
    );
  }

  return null;
}
