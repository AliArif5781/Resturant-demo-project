import { Sheet, SheetContent, SheetHeader, SheetTitle } from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Check, Clock, ChefHat, Package } from "lucide-react";

interface OrderStatusPanelProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  order?: {
    orderNumber: string;
    items: Array<{ name: string; quantity: number; price: string }>;
    total: string;
    status: "pending" | "preparing" | "ready" | "completed" | "cancelled";
  };
  onArrived?: () => void;
}

const statusSteps = [
  { id: "pending", label: "Order Placed", icon: Check },
  { id: "preparing", label: "Preparing", icon: ChefHat },
  { id: "ready", label: "Ready for Pickup", icon: Package },
  { id: "completed", label: "Completed", icon: Check },
];

export default function OrderStatusPanel({
  open,
  onOpenChange,
  order,
  onArrived,
}: OrderStatusPanelProps) {
  if (!order) return null;

  const currentStepIndex = statusSteps.findIndex((step) => step.id === order.status);

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent side="bottom" className="h-[90vh]" data-testid="sheet-order-status">
        <SheetHeader>
          <SheetTitle data-testid="text-order-panel-title">Order #{order.orderNumber}</SheetTitle>
        </SheetHeader>

        <div className="mt-6 space-y-6">
          <div className="relative">
            <div className="flex justify-between items-start">
              {statusSteps.map((step, idx) => {
                const Icon = step.icon;
                const isActive = idx <= currentStepIndex;
                const isCurrent = idx === currentStepIndex;
                const isPreparing = step.id === "preparing" && isActive;

                return (
                  <div key={step.id} className="flex-1 flex flex-col items-center relative">
                    <div
                      className={`w-12 h-12 rounded-full flex items-center justify-center border-2 transition-all ${
                        isActive
                          ? isPreparing
                            ? "bg-green-600 dark:bg-green-500 border-green-600 dark:border-green-500 text-white"
                            : "bg-primary border-primary text-primary-foreground"
                          : "bg-background border-muted text-muted-foreground"
                      } ${isCurrent ? "scale-110 shadow-lg" : ""}`}
                      data-testid={`status-step-${step.id}`}
                    >
                      <Icon className="h-5 w-5" />
                    </div>
                    <p className={`text-xs mt-2 text-center ${isActive ? isPreparing ? "font-medium text-green-600 dark:text-green-400" : "font-medium" : "text-muted-foreground"}`}>
                      {step.label}
                    </p>
                    {idx < statusSteps.length - 1 && (
                      <div
                        className={`absolute top-6 left-[calc(50%+24px)] right-[calc(-50%+24px)] h-0.5 transition-all ${
                          idx < currentStepIndex 
                            ? statusSteps[idx + 1].id === "preparing"
                              ? "bg-green-600 dark:bg-green-500"
                              : "bg-primary"
                            : "bg-muted"
                        }`}
                      />
                    )}
                  </div>
                );
              })}
            </div>
          </div>

          <Separator />

          <div className="space-y-3">
            <h3 className="font-semibold">Order Items</h3>
            {order.items.map((item, idx) => (
              <div key={idx} className="flex justify-between" data-testid={`order-item-${idx}`}>
                <span className="text-muted-foreground">
                  {item.quantity}x {item.name}
                </span>
                <span className="font-medium">{item.price}</span>
              </div>
            ))}
            <Separator />
            <div className="flex justify-between text-lg font-bold">
              <span>Total</span>
              <span data-testid="text-order-panel-total">{order.total}</span>
            </div>
          </div>

          {order.status !== "ready" && (
            <Button className="w-full" onClick={onArrived} data-testid="button-arrived">
              I've arrived
            </Button>
          )}

          {order.status === "ready" && (
            <div className="text-center space-y-2">
              <Badge className="text-base px-4 py-2">🎉 Your order is ready!</Badge>
              <p className="text-sm text-muted-foreground">Please pick up from the counter</p>
            </div>
          )}
        </div>
      </SheetContent>
    </Sheet>
  );
}
