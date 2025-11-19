import { useState } from "react";
import OrderStatusPanel from "../OrderStatusPanel";
import { Button } from "@/components/ui/button";

export default function OrderStatusPanelExample() {
  const [open, setOpen] = useState(false);

  return (
    <div className="p-6">
      <Button onClick={() => setOpen(true)}>Open Order Status Panel</Button>
      <OrderStatusPanel
        open={open}
        onOpenChange={setOpen}
        order={{
          orderNumber: "A124",
          items: [
            { name: "Chicken Karahi", quantity: 1, price: "$24.99" },
            { name: "Garlic Naan", quantity: 2, price: "$7.98" },
          ],
          total: "$32.97",
          status: "cooking",
        }}
        onArrived={() => console.log("Customer arrived")}
      />
    </div>
  );
}
