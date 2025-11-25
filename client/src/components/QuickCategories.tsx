import { useState } from "react";
import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import bbqImage from "@assets/generated_images/BBQ_mixed_grill_platter_6ba4d702.png";
import karahiImage from "@assets/generated_images/Chicken_Karahi_dish_closeup_1ee23ad4.png";
import biryaniImage from "@assets/generated_images/Chicken_Biryani_overhead_shot_73a10a24.png";

const categories = [
  { id: "starters", name: "Starters", icon: "🍗" },
  { id: "bbq", name: "Sizzling BBQ", icon: "🔥" },
  { id: "karahi", name: "Karahi & Curries", icon: "🍛" },
  { id: "vegetarian", name: "Vegetarian", icon: "🥦" },
  { id: "rice", name: "Rice & Biryani", icon: "🍚" },
  { id: "breads", name: "Naans & Breads", icon: "🫓" },
  { id: "desserts", name: "Desserts", icon: "🍰" },
  { id: "drinks", name: "Drinks", icon: "🥤" },
];

const categoryTiles = [
  { id: "bbq", name: "Sizzling BBQ", image: bbqImage, count: 12 },
  { id: "karahi", name: "Karahi & Curries", image: karahiImage, count: 8 },
  { id: "rice", name: "Rice & Biryani", image: biryaniImage, count: 10 },
];

export default function QuickCategories() {
  const [activeCategory, setActiveCategory] = useState("bbq");

  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold text-white" data-testid="text-categories-title">Browse by craving</h2>

      <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-hide">
        {categories.map((category) => (
          <Badge
            key={category.id}
            variant={activeCategory === category.id ? "default" : "secondary"}
            className="cursor-pointer whitespace-nowrap px-4 py-2 hover-elevate active-elevate-2"
            onClick={() => setActiveCategory(category.id)}
            data-testid={`badge-category-${category.id}`}
          >
            <span className="mr-2">{category.icon}</span>
            {category.name}
          </Badge>
        ))}
      </div>

      <div className="grid sm:grid-cols-3 gap-6">
        {categoryTiles.map((tile) => (
          <Card
            key={tile.id}
            className="relative overflow-hidden group cursor-pointer hover-elevate active-elevate-2 border-0"
            data-testid={`card-category-${tile.id}`}
          >
            <div className="relative h-48">
              <img
                src={tile.image}
                alt={tile.name}
                className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-110"
                data-testid={`img-category-${tile.id}`}
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-transparent" />
              <div className="absolute bottom-0 left-0 right-0 p-6 text-white">
                <h3 className="text-xl font-bold mb-1" data-testid={`text-category-name-${tile.id}`}>{tile.name}</h3>
                <p className="text-sm text-white/90" data-testid={`text-category-count-${tile.id}`}>See all {tile.count} dishes</p>
              </div>
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
}
