import Hero from "../Hero";

export default function HeroExample() {
  return (
    <Hero
      onStartOrdering={() => console.log("Start ordering clicked")}
      onSurprise={() => console.log("Surprise me clicked")}
      onViewFavorites={() => console.log("View favorites clicked")}
      onOrderLater={() => console.log("Order later clicked")}
      activeOrder={{
        orderNumber: "A124",
        status: "In the kitchen",
        timeLeft: "7 min",
      }}
    />
  );
}
