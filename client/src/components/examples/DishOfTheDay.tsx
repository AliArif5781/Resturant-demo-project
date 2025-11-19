import DishOfTheDay from "../DishOfTheDay";

export default function DishOfTheDayExample() {
  return (
    <div className="p-6">
      <DishOfTheDay
        onAddToOrder={() => console.log("Added to order")}
        onSeeSimilar={() => console.log("See similar clicked")}
      />
    </div>
  );
}
