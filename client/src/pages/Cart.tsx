import { useCart } from "@/contexts/CartContext";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Minus, Plus, Trash2, ArrowLeft, ShoppingBag } from "lucide-react";
import { Link } from "wouter";
import RecommendedForYou from "@/components/RecommendedForYou";

export default function Cart() {
  const { items, removeFromCart, updateQuantity, clearCart, totalPrice, totalItems } = useCart();

  if (items.length === 0) {
    return (
      <div className="min-h-screen bg-background">
        <div className="container mx-auto px-4 py-8">
          <div className="mb-6">
            <Link href="/">
              <Button variant="ghost" className="gap-2" data-testid="button-back">
                <ArrowLeft className="h-4 w-4" />
                Back to Menu
              </Button>
            </Link>
          </div>
          
          <div className="flex flex-col items-center justify-center py-16 text-center">
            <ShoppingBag className="h-24 w-24 text-muted-foreground mb-4" />
            <h2 className="text-2xl font-bold mb-2" data-testid="text-empty-title">Your cart is empty</h2>
            <p className="text-muted-foreground mb-6" data-testid="text-empty-subtitle">
              Add some delicious items to get started!
            </p>
            <Link href="/">
              <Button data-testid="button-browse-menu">Browse Menu</Button>
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-8">
        <div className="mb-6 flex items-center justify-between gap-4">
          <Link href="/">
            <Button variant="ghost" className="gap-2" data-testid="button-back">
              <ArrowLeft className="h-4 w-4" />
              Back to Menu
            </Button>
          </Link>
          
          <Button
            variant="outline"
            onClick={clearCart}
            className="gap-2"
            data-testid="button-clear-cart"
          >
            <Trash2 className="h-4 w-4" />
            Clear Cart
          </Button>
        </div>

        <div className="grid lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 space-y-4">
            <div>
              <h1 className="text-3xl font-bold mb-2" data-testid="text-cart-title">Your Order</h1>
              <p className="text-muted-foreground" data-testid="text-cart-subtitle">
                {totalItems} {totalItems === 1 ? "item" : "items"} in your cart
              </p>
            </div>

            <div className="space-y-4">
              {items.map((item) => (
                <Card key={item.id} className="overflow-hidden border-0" data-testid={`card-cart-item-${item.id}`}>
                  <CardContent className="p-0">
                    <div className="flex gap-4">
                      <div className="relative w-32 h-32 flex-shrink-0">
                        <img
                          src={item.image}
                          alt={item.name}
                          className="w-full h-full object-cover"
                          data-testid={`img-cart-item-${item.id}`}
                        />
                      </div>
                      
                      <div className="flex-1 p-4 flex flex-col justify-between">
                        <div>
                          <h3 className="font-bold text-lg mb-1" data-testid={`text-cart-item-name-${item.id}`}>
                            {item.name}
                          </h3>
                          {item.calories && item.protein && (
                            <div className="flex gap-3 text-xs text-muted-foreground mb-2">
                              <span data-testid={`text-cart-item-calories-${item.id}`}>🔥 {item.calories} cal</span>
                              <span data-testid={`text-cart-item-protein-${item.id}`}>💪 {item.protein}g protein</span>
                            </div>
                          )}
                          <p className="text-lg font-bold text-primary" data-testid={`text-cart-item-price-${item.id}`}>
                            {item.price}
                          </p>
                        </div>

                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-2">
                            <Button
                              size="icon"
                              variant="outline"
                              onClick={() => updateQuantity(item.id, item.quantity - 1)}
                              data-testid={`button-decrease-${item.id}`}
                            >
                              <Minus className="h-4 w-4" />
                            </Button>
                            <span className="w-12 text-center font-semibold" data-testid={`text-quantity-${item.id}`}>
                              {item.quantity}
                            </span>
                            <Button
                              size="icon"
                              variant="outline"
                              onClick={() => updateQuantity(item.id, item.quantity + 1)}
                              data-testid={`button-increase-${item.id}`}
                            >
                              <Plus className="h-4 w-4" />
                            </Button>
                          </div>

                          <Button
                            size="icon"
                            variant="ghost"
                            onClick={() => removeFromCart(item.id)}
                            data-testid={`button-remove-${item.id}`}
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>

          <div className="lg:col-span-1">
            <Card className="sticky top-4 border-0" data-testid="card-order-summary">
              <CardContent className="p-6 space-y-4">
                <h2 className="text-xl font-bold" data-testid="text-summary-title">Order Summary</h2>
                
                <div className="space-y-2">
                  {items.map((item) => (
                    <div
                      key={item.id}
                      className="flex justify-between text-sm"
                      data-testid={`row-summary-item-${item.id}`}
                    >
                      <span className="text-muted-foreground">
                        {item.name} x {item.quantity}
                      </span>
                      <span className="font-medium">
                        ${(parseFloat(item.price.replace("$", "")) * item.quantity).toFixed(2)}
                      </span>
                    </div>
                  ))}
                </div>

                <div className="border-t pt-4">
                  <div className="flex justify-between items-center mb-1">
                    <span className="text-muted-foreground">Subtotal</span>
                    <span className="font-semibold" data-testid="text-subtotal">
                      ${totalPrice.toFixed(2)}
                    </span>
                  </div>
                  <div className="flex justify-between items-center mb-1">
                    <span className="text-muted-foreground">Tax (8%)</span>
                    <span className="font-semibold" data-testid="text-tax">
                      ${(totalPrice * 0.08).toFixed(2)}
                    </span>
                  </div>
                  <div className="flex justify-between items-center text-lg font-bold pt-2 border-t">
                    <span>Total</span>
                    <span className="text-primary" data-testid="text-total">
                      ${(totalPrice * 1.08).toFixed(2)}
                    </span>
                  </div>
                </div>

                <div className="space-y-2 pt-4">
                  <Button className="w-full" size="lg" data-testid="button-checkout">
                    Continue
                  </Button>
                  <Link href="/">
                    <Button variant="outline" className="w-full" data-testid="button-continue-shopping">
                      Continue Shopping
                    </Button>
                  </Link>
                </div>

                <div className="pt-4 border-t">
                  <Badge variant="secondary" className="w-full justify-center py-2" data-testid="badge-table-info">
                    Dine-in · Table T12
                  </Badge>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>

        <div className="mt-12">
          <RecommendedForYou />
        </div>
      </div>
    </div>
  );
}
