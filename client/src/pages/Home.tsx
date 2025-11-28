import { useState } from "react";
import Header from "@/components/Header";
import Hero from "@/components/Hero";
import DishOfTheDay from "@/components/DishOfTheDay";
import DealsCarousel from "@/components/DealsCarousel";
import RecommendedForYou from "@/components/RecommendedForYou";
import QuickCategories from "@/components/QuickCategories";
import PopularNow from "@/components/PopularNow";
import OrderStatusPanel from "@/components/OrderStatusPanel";
import Footer from "@/components/Footer";
import ActiveOrderBar from "@/components/ActiveOrderBar";

export default function Home() {
  const [orderPanelOpen, setOrderPanelOpen] = useState(false);

  return (
    <div className="min-h-screen bg-background">
      <Header />

      <Hero
        onStartOrdering={() => console.log("Start ordering")}
        onSurprise={() => console.log("Surprise me")}
        onViewFavorites={() => console.log("View favorites")}
        onOrderLater={() => console.log("Order later")}
      />

      <main className="bg-muted/30">
        <div className="container mx-auto px-6 md:px-12 lg:px-20 space-y-16 py-16">
          <DishOfTheDay
            onAddToOrder={() => console.log("Added dish of the day")}
          />

          <DealsCarousel />

          <RecommendedForYou />

          <QuickCategories />

          <PopularNow />
        </div>
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
          status: "preparing",
        }}
        onArrived={() => console.log("Customer arrived")}
      />

      <ActiveOrderBar />
    </div>
  );
}
