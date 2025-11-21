import { useEffect, useState } from "react";
import { useLocation, Link } from "wouter";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { CheckCircle, Home, ShoppingBag } from "lucide-react";
import { motion } from "framer-motion";

interface OrderItem {
  id: number;
  name: string;
  price: string;
  quantity: number;
  image?: string;
  description?: string;
  calories?: number;
  protein?: number;
}

interface OrderData {
  orderNumber: string;
  items: OrderItem[];
  subtotal: string;
  tax: string;
  total: string;
  userEmail: string;
  userName: string;
  orderDate: string;
}

export default function OrderConfirmation() {
  const [, setLocation] = useLocation();
  const [orderData, setOrderData] = useState<OrderData | null>(null);

  useEffect(() => {
    window.scrollTo(0, 0);
    
    // Get order data from sessionStorage
    const savedOrder = sessionStorage.getItem("lastOrder");
    if (savedOrder) {
      setOrderData(JSON.parse(savedOrder));
    } else {
      // If no order data, redirect to home
      setLocation("/");
    }
  }, [setLocation]);

  if (!orderData) {
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
      <header className="border-b sticky top-0 bg-background z-50" data-testid="header-order-confirmation">
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
        {/* Success Message */}
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ type: "spring", stiffness: 100 }}
          className="text-center mb-8"
        >
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ type: "spring", delay: 0.2, stiffness: 200 }}
            className="inline-flex items-center justify-center w-20 h-20 bg-green-100 dark:bg-green-900/30 rounded-full mb-4"
          >
            <CheckCircle className="h-12 w-12 text-green-600 dark:text-green-400" />
          </motion.div>
          <h1 className="text-4xl font-bold mb-2" data-testid="text-order-success-title">
            Order Placed Successfully!
          </h1>
          <p className="text-lg text-muted-foreground mb-4" data-testid="text-order-success-subtitle">
            Thank you for your order. We've received it and will start preparing it shortly.
          </p>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.4 }}
          >
            <Badge className="text-lg px-4 py-2" data-testid="badge-order-number">
              Order #{orderData.orderNumber}
            </Badge>
          </motion.div>
        </motion.div>

        {/* Order Items */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="max-w-5xl mx-auto"
        >
          <Card className="border-0" data-testid="card-order-items">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-2xl">
                <div className="p-2 bg-primary/10 rounded-full">
                  <ShoppingBag className="h-6 w-6 text-primary" />
                </div>
                Your Order ({orderData.items.reduce((sum, item) => sum + item.quantity, 0)} {orderData.items.reduce((sum, item) => sum + item.quantity, 0) === 1 ? "item" : "items"})
              </CardTitle>
            </CardHeader>
            <CardContent>
              <motion.div
                variants={containerVariants}
                initial="hidden"
                animate="visible"
                className="space-y-6"
              >
                {orderData.items.map((item, index) => (
                  <motion.div
                    key={item.id}
                    variants={itemVariants}
                    className="flex flex-col md:flex-row gap-6 p-6 bg-muted/30 rounded-lg hover-elevate"
                    data-testid={`order-item-${item.id}`}
                  >
                    {item.image && (
                      <div className="relative w-full md:w-80 h-80 rounded-lg overflow-hidden flex-shrink-0">
                        <img
                          src={item.image}
                          alt={item.name}
                          className="w-full h-full object-cover"
                          data-testid={`img-order-item-${item.id}`}
                        />
                      </div>
                    )}

                    <div className="flex-1 space-y-4">
                      <div>
                        <h3 className="text-2xl font-bold mb-2" data-testid={`text-order-item-name-${item.id}`}>
                          {item.name}
                        </h3>
                        {item.description && (
                          <p className="text-base text-muted-foreground" data-testid={`text-order-item-description-${item.id}`}>
                            {item.description}
                          </p>
                        )}
                      </div>

                      {item.calories && item.protein && (
                        <div className="flex gap-3 flex-wrap">
                          <Badge variant="outline" className="bg-orange-50 dark:bg-orange-950 text-orange-700 dark:text-orange-300 border-orange-200 dark:border-orange-800 text-sm px-3 py-1">
                            🔥 {item.calories} calories
                          </Badge>
                          <Badge variant="outline" className="bg-green-50 dark:bg-green-950 text-green-700 dark:text-green-300 border-green-200 dark:border-green-800 text-sm px-3 py-1">
                            💪 {item.protein}g protein
                          </Badge>
                        </div>
                      )}

                      <div className="flex flex-col gap-3 pt-2">
                        <div className="flex items-center gap-2">
                          <span className="text-lg text-muted-foreground">Quantity:</span>
                          <span className="text-xl font-semibold" data-testid={`text-order-quantity-${item.id}`}>
                            {item.quantity}
                          </span>
                        </div>
                        <div className="flex items-center gap-2">
                          <span className="text-lg text-muted-foreground">Price:</span>
                          <span className="text-2xl font-bold text-primary" data-testid={`text-order-item-price-${item.id}`}>
                            ${(parseFloat(item.price.replace("$", "")) * item.quantity).toFixed(2)}
                          </span>
                        </div>
                      </div>
                    </div>
                  </motion.div>
                ))}
              </motion.div>

              <div className="mt-8 pt-6 border-t flex justify-center">
                <Link href="/">
                  <Button size="lg" className="gap-2" data-testid="button-continue-shopping">
                    <Home className="h-5 w-5" />
                    Continue Shopping
                  </Button>
                </Link>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </div>
    </div>
  );
}
