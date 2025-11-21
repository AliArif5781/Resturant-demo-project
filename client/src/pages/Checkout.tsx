import { useEffect } from "react";
import { useCart } from "@/contexts/CartContext";
import { useAuth } from "@/contexts/AuthContext";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ArrowLeft, Check, ShoppingBag, User, Mail, CreditCard, Home } from "lucide-react";
import { Link, useLocation } from "wouter";
import { useMutation } from "@tanstack/react-query";
import { apiRequest, queryClient } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";
import { motion } from "framer-motion";

export default function Checkout() {
  const { items, clearCart, totalPrice, totalItems } = useCart();
  const { currentUser } = useAuth();
  const [, setLocation] = useLocation();
  const { toast } = useToast();

  // Scroll to top when component mounts
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  const createOrderMutation = useMutation({
    mutationFn: async (orderData: any) => {
      const response = await apiRequest("POST", "/api/orders", orderData);
      return await response.json();
    },
    onSuccess: (data) => {
      // Prepare order confirmation data
      const orderConfirmationData = {
        orderNumber: data.order.id.substring(0, 8).toUpperCase(),
        items: items,
        subtotal: totalPrice.toFixed(2),
        tax: (totalPrice * 0.08).toFixed(2),
        total: (totalPrice * 1.08).toFixed(2),
        userEmail: currentUser?.email || "",
        userName: currentUser?.displayName || "Guest User",
        orderDate: new Date().toLocaleString('en-US', { 
          dateStyle: 'medium', 
          timeStyle: 'short' 
        }),
      };

      // Save to sessionStorage for the confirmation page
      sessionStorage.setItem("lastOrder", JSON.stringify(orderConfirmationData));

      toast({
        title: "Order placed successfully!",
        description: "Redirecting to order confirmation...",
      });
      queryClient.invalidateQueries({ queryKey: ["/api/orders"] });
      clearCart();
      setLocation("/order-confirmation");
    },
    onError: (error: any) => {
      toast({
        title: "Error",
        description: error.message || "Failed to place order",
        variant: "destructive",
      });
    },
  });

  const handlePlaceOrder = () => {
    const orderData = {
      items: items,
      subtotal: totalPrice.toFixed(2),
      tax: (totalPrice * 0.08).toFixed(2),
      total: (totalPrice * 1.08).toFixed(2),
    };

    createOrderMutation.mutate(orderData);
  };

  if (items.length === 0) {
    setLocation("/cart");
    return null;
  }

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        type: "spring",
        stiffness: 100,
      },
    },
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b sticky top-0 bg-background z-50" data-testid="header-checkout">
        <div className="container mx-auto px-4 py-3">
          <div className="flex items-center justify-between gap-4">
            <Link href="/">
              <div className="flex items-center gap-3 cursor-pointer">
                <span className="font-bold text-lg" data-testid="text-brand-name">Karahi Point</span>
              </div>
            </Link>
            <Link href="/">
              <Button variant="ghost" className="gap-2" data-testid="button-home">
                <Home className="h-4 w-4" />
                Home
              </Button>
            </Link>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-4 py-8">
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          className="mb-6"
        >
          <Link href="/cart">
            <Button variant="ghost" className="gap-2" data-testid="button-back-to-cart">
              <ArrowLeft className="h-4 w-4" />
              Back to Cart
            </Button>
          </Link>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <h1 className="text-4xl font-bold mb-2" data-testid="text-checkout-title">
            Checkout
          </h1>
          <p className="text-muted-foreground" data-testid="text-checkout-subtitle">
            Review your order and complete your purchase
          </p>
        </motion.div>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Left Column - User Details & Payment */}
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.2 }}
            className="lg:col-span-2 space-y-6"
          >
            {/* User Information */}
            <Card className="overflow-hidden border-0" data-testid="card-user-info">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <motion.div
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={{ type: "spring", delay: 0.3 }}
                  >
                    <div className="p-2 bg-primary/10 rounded-full">
                      <User className="h-5 w-5 text-primary" />
                    </div>
                  </motion.div>
                  Contact Information
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <motion.div
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.4 }}
                  className="flex items-center gap-3 p-4 bg-muted/50 rounded-lg hover-elevate"
                  data-testid="row-user-name"
                >
                  <User className="h-5 w-5 text-muted-foreground" />
                  <div>
                    <p className="text-sm text-muted-foreground">Name</p>
                    <p className="font-medium">{currentUser?.displayName || "Guest User"}</p>
                  </div>
                </motion.div>

                <motion.div
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.5 }}
                  className="flex items-center gap-3 p-4 bg-muted/50 rounded-lg hover-elevate"
                  data-testid="row-user-email"
                >
                  <Mail className="h-5 w-5 text-muted-foreground" />
                  <div>
                    <p className="text-sm text-muted-foreground">Email</p>
                    <p className="font-medium">{currentUser?.email}</p>
                  </div>
                </motion.div>
              </CardContent>
            </Card>

            {/* Order Items */}
            <Card className="overflow-hidden border-0" data-testid="card-order-items">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <motion.div
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={{ type: "spring", delay: 0.7 }}
                  >
                    <div className="p-2 bg-primary/10 rounded-full">
                      <ShoppingBag className="h-5 w-5 text-primary" />
                    </div>
                  </motion.div>
                  Your Order ({totalItems} {totalItems === 1 ? "item" : "items"})
                </CardTitle>
              </CardHeader>
              <CardContent>
                <motion.div
                  variants={containerVariants}
                  initial="hidden"
                  animate="visible"
                  className="space-y-4"
                >
                  {items.map((item, index) => (
                    <motion.div
                      key={item.id}
                      variants={itemVariants}
                      whileHover={{ scale: 1.02 }}
                      className="flex gap-4 p-4 bg-muted/30 rounded-lg hover-elevate"
                      data-testid={`checkout-item-${item.id}`}
                    >
                      <motion.div
                        initial={{ opacity: 0, scale: 0.8 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ delay: 0.8 + index * 0.1 }}
                        className="relative w-20 h-20 rounded-lg overflow-hidden flex-shrink-0"
                      >
                        <img
                          src={item.image}
                          alt={item.name}
                          className="w-full h-full object-cover"
                          data-testid={`img-checkout-item-${item.id}`}
                        />
                      </motion.div>

                      <div className="flex-1">
                        <h3 className="font-semibold mb-1" data-testid={`text-checkout-item-name-${item.id}`}>
                          {item.name}
                        </h3>
                        {item.description && (
                          <p className="text-sm text-muted-foreground mb-2" data-testid={`text-checkout-item-description-${item.id}`}>
                            {item.description}
                          </p>
                        )}
                        {item.calories && item.protein && (
                          <div className="flex gap-2 mb-2 flex-wrap">
                            <Badge variant="outline" className="bg-orange-50 dark:bg-orange-950 text-orange-700 dark:text-orange-300 border-orange-200 dark:border-orange-800 text-xs">
                              🔥 {item.calories} cal
                            </Badge>
                            <Badge variant="outline" className="bg-green-50 dark:bg-green-950 text-green-700 dark:text-green-300 border-green-200 dark:border-green-800 text-xs">
                              💪 {item.protein}g protein
                            </Badge>
                          </div>
                        )}
                        <div className="flex items-center justify-between">
                          <span className="text-sm text-muted-foreground" data-testid={`text-checkout-quantity-${item.id}`}>
                            Quantity: {item.quantity}
                          </span>
                          <span className="font-bold text-primary" data-testid={`text-checkout-item-price-${item.id}`}>
                            ${(parseFloat(item.price.replace("$", "")) * item.quantity).toFixed(2)}
                          </span>
                        </div>
                      </div>
                    </motion.div>
                  ))}
                </motion.div>
              </CardContent>
            </Card>
          </motion.div>

          {/* Right Column - Order Summary */}
          <motion.div
            initial={{ opacity: 0, x: 30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.3 }}
            className="lg:col-span-1"
          >
            <Card className="sticky top-4 border-0" data-testid="card-checkout-summary">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <motion.div
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={{ type: "spring", delay: 0.4 }}
                  >
                    <div className="p-2 bg-primary/10 rounded-full">
                      <CreditCard className="h-5 w-5 text-primary" />
                    </div>
                  </motion.div>
                  Order Summary
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.5 }}
                  className="space-y-3"
                >
                  <div className="flex justify-between items-center">
                    <span className="text-muted-foreground">Subtotal</span>
                    <span className="font-semibold" data-testid="text-checkout-subtotal">
                      ${totalPrice.toFixed(2)}
                    </span>
                  </div>

                  <div className="flex justify-between items-center">
                    <span className="text-muted-foreground">Tax (8%)</span>
                    <span className="font-semibold" data-testid="text-checkout-tax">
                      ${(totalPrice * 0.08).toFixed(2)}
                    </span>
                  </div>

                  <motion.div
                    initial={{ scaleX: 0 }}
                    animate={{ scaleX: 1 }}
                    transition={{ delay: 0.6 }}
                    className="border-t pt-3"
                  >
                    <div className="flex justify-between items-center text-lg">
                      <span className="font-bold">Total</span>
                      <motion.span
                        initial={{ scale: 0 }}
                        animate={{ scale: 1 }}
                        transition={{ type: "spring", delay: 0.7 }}
                        className="font-bold text-primary text-2xl"
                        data-testid="text-checkout-total"
                      >
                        ${(totalPrice * 1.08).toFixed(2)}
                      </motion.span>
                    </div>
                  </motion.div>
                </motion.div>

                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.8 }}
                  className="pt-4"
                >
                  <Button
                    className="w-full gap-2"
                    size="lg"
                    onClick={handlePlaceOrder}
                    disabled={createOrderMutation.isPending}
                    data-testid="button-place-order"
                  >
                    {createOrderMutation.isPending ? (
                      <>
                        <motion.div
                          animate={{ rotate: 360 }}
                          transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                        >
                          <CreditCard className="h-5 w-5" />
                        </motion.div>
                        Processing...
                      </>
                    ) : (
                      <>
                        <Check className="h-5 w-5" />
                        Place Order
                      </>
                    )}
                  </Button>
                </motion.div>
              </CardContent>
            </Card>
          </motion.div>
        </div>
      </div>
    </div>
  );
}
