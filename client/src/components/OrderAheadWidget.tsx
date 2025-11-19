import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Clock } from "lucide-react";
import { useState } from "react";

const timeSlots = [
  { value: "asap", label: "ASAP (≈ 25 min)" },
  { value: "18:30", label: "6:30 PM" },
  { value: "19:00", label: "7:00 PM" },
  { value: "19:30", label: "7:30 PM" },
  { value: "20:00", label: "8:00 PM" },
  { value: "20:30", label: "8:30 PM" },
];

interface OrderAheadWidgetProps {
  onPlanOrder?: (time: string) => void;
}

export default function OrderAheadWidget({ onPlanOrder }: OrderAheadWidgetProps) {
  const [selectedTime, setSelectedTime] = useState("asap");

  return (
    <Card className="overflow-hidden border-0" data-testid="card-order-ahead">
      <CardContent className="p-6">
        <div className="grid md:grid-cols-2 gap-6 items-center">
          <div className="space-y-4">
            <div className="flex items-center gap-2 text-primary">
              <Clock className="h-5 w-5" />
              <span className="font-semibold">Order Ahead</span>
            </div>
            <h3 className="text-2xl font-bold" data-testid="text-order-ahead-title">
              Skip the wait. Order ahead.
            </h3>
            <p className="text-muted-foreground" data-testid="text-order-ahead-desc">
              Choose a time and we'll prep your order just in time for your arrival.
            </p>
          </div>

          <div className="space-y-4">
            <div>
              <label className="text-sm font-medium mb-2 block">Pickup Time</label>
              <Select value={selectedTime} onValueChange={setSelectedTime}>
                <SelectTrigger data-testid="select-pickup-time">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {timeSlots.map((slot) => (
                    <SelectItem key={slot.value} value={slot.value} data-testid={`option-time-${slot.value}`}>
                      {slot.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <Button
              className="w-full"
              onClick={() => onPlanOrder?.(selectedTime)}
              data-testid="button-plan-order"
            >
              Plan my order
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
