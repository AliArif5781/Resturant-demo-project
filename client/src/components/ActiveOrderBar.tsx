import { useEffect, useState } from "react";
import { useLocation } from "wouter";
import { useQuery } from "@tanstack/react-query";
import { ChefHat, ArrowRight, Package, Clock } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { useAuth } from "@/contexts/AuthContext";

type Order = {
  id: string;
  status: string;
  subtotal: number;
  tax: number;
  total: number;
  createdAt: string;
  items: any[];
  userEmail: string;
  userName?: string;
};

export default function ActiveOrderBar() {
  const { currentUser } = useAuth();
  const [, setLocation] = useLocation();
  const [showBar, setShowBar] = useState(false);

  const { data: ordersData } = useQuery<{ orders: Order[] }>({
    queryKey: ["/api/orders/user", currentUser?.uid],
    queryFn: currentUser 
      ? () => fetch(`/api/orders/user/${currentUser.uid}`, {
          headers: {
            "x-firebase-uid": currentUser.uid,
          },
        }).then(res => res.json())
      : undefined,
    enabled: !!currentUser,
    refetchInterval: 3000, // Poll every 3 seconds for status updates
  });

  const orders = ordersData?.orders || [];
  
  // Find the most recent active order (not completed, cancelled, or rejected)
  // Sort by creation date descending to get the newest first
  const activeOrder = [...orders]
    .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
    .find(
      (order) => 
        order.status === "pending" || 
        order.status === "preparing" || 
        order.status === "ready"
    );

  // Get display text for items - show first item name + count of additional items
  const getItemsDisplayText = (order: Order) => {
    if (!Array.isArray(order.items) || order.items.length === 0) {
      return "Order items";
    }

    // Sort items by quantity (descending) to show the most ordered item first
    const sortedItems = [...order.items].sort((a, b) => (b.quantity || 0) - (a.quantity || 0));
    const firstName = sortedItems[0]?.name || "Item";
    
    // Truncate long names
    const truncatedName = firstName.length > 20 ? firstName.substring(0, 20) + "..." : firstName;
    
    if (order.items.length === 1) {
      return truncatedName;
    }
    
    const additionalCount = order.items.length - 1;
    return `${truncatedName} +${additionalCount} more`;
  };

  useEffect(() => {
    // Show bar if there's an active order
    setShowBar(!!activeOrder);
  }, [activeOrder]);

  const handleClick = async () => {
    if (activeOrder && currentUser) {
      try {
        // Fetch full order details from the API to ensure accuracy
        const response = await fetch(`/api/orders/${activeOrder.id}`, {
          headers: {
            "x-firebase-uid": currentUser.uid,
          },
        });
        
        if (response.ok) {
          const { order } = await response.json();
          
          // Save complete order data to sessionStorage for the OrderConfirmation page
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
        }
      } catch (error) {
        console.error("Failed to fetch order details:", error);
        // Fallback: navigate anyway
        setLocation("/order-confirmation");
      }
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "pending":
        return <Clock className="h-3.5 w-3.5" />;
      case "preparing":
        return <ChefHat className="h-3.5 w-3.5" />;
      case "ready":
        return <Package className="h-3.5 w-3.5" />;
      default:
        return <Clock className="h-3.5 w-3.5" />;
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case "pending":
        return "Order Received";
      case "preparing":
        return "Being Prepared";
      case "ready":
        return "Ready for Pickup";
      default:
        return "Processing";
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "pending":
        return "bg-orange-500";
      case "preparing":
        return "bg-blue-500";
      case "ready":
        return "bg-green-500";
      default:
        return "bg-gray-500";
    }
  };

  return (
    <AnimatePresence>
      {showBar && activeOrder && (
        <motion.div
          initial={{ y: 100, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          exit={{ y: 100, opacity: 0 }}
          transition={{ type: "spring", stiffness: 100, damping: 15 }}
          className="fixed bottom-0 left-0 right-0 z-50 p-4"
          data-testid="active-order-bar"
        >
          <div
            onClick={handleClick}
            className="container mx-auto max-w-3xl bg-gradient-to-r from-orange-500 to-orange-600 rounded-lg shadow-lg cursor-pointer hover-elevate active-elevate-2 overflow-hidden min-h-[44px]"
            data-testid="button-view-active-order"
          >
            <div className="flex items-center justify-between gap-2 px-3 py-1.5 text-white">
              <div className="flex items-center gap-2 flex-1 min-w-0">
                <div className={`p-1 ${getStatusColor(activeOrder.status)} rounded`}>
                  {getStatusIcon(activeOrder.status)}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="font-semibold text-xs truncate">
                    {getStatusText(activeOrder.status)}
                  </div>
                  <div className="text-xs text-white/90 truncate">
                    {getItemsDisplayText(activeOrder)}
                  </div>
                </div>
              </div>
              <div className="flex items-center gap-1.5 flex-shrink-0">
                <div className="text-right">
                  <div className="font-bold text-sm">
                    ${Number(activeOrder.total).toFixed(2)}
                  </div>
                  <div className="text-[10px] text-white/70 hidden sm:block">Tap to track</div>
                </div>
                <ArrowRight className="h-4 w-4" />
              </div>
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
