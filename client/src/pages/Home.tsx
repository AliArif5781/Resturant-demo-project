import { useState } from "react";
import Header from "@/components/Header";
import Hero from "@/components/Hero";
import DealsCarousel from "@/components/DealsCarousel";
import RecommendedForYou from "@/components/RecommendedForYou";
import QuickCategories from "@/components/QuickCategories";
import PopularNow from "@/components/PopularNow";
import StickyCart from "@/components/StickyCart";
import OrderStatusPanel from "@/components/OrderStatusPanel";
import Footer from "@/components/Footer";

export default function Home() {
  const [orderPanelOpen, setOrderPanelOpen] = useState(false);
  const [cartMode] = useState<"cart" | "order">("cart");

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-orange-900">
      <Header mode="dine-in" tableNumber="T12" />

      <Hero
        onStartOrdering={() => console.log("Start ordering")}
        onSurprise={() => console.log("Surprise me")}
        onViewFavorites={() => console.log("View favorites")}
        onOrderLater={() => console.log("Order later")}
      />

      <main className="container mx-auto px-4 space-y-16 py-12 text-white">
        <DealsCarousel />

        <RecommendedForYou />

        <QuickCategories />

        <PopularNow />
      </main>

      <Footer />

      <OrderStatusPanel
        open={orderPanelOpen}
        onOpenChange={setOrderPanelOpen}
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
