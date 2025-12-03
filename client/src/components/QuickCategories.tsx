import { useState } from "react";
import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import { Link } from "wouter";
import { motion } from "framer-motion";
import { 
  ChefHat, Flame, UtensilsCrossed, Salad, Wheat, 
  GlassWater, ArrowRight, Sparkles
} from "lucide-react";
import bbqImage from "@assets/generated_images/BBQ_mixed_grill_platter_6ba4d702.png";
import karahiImage from "@assets/generated_images/Chicken_Karahi_dish_closeup_1ee23ad4.png";
import biryaniImage from "@assets/generated_images/Chicken_Biryani_overhead_shot_73a10a24.png";
import tikkaStock from "@assets/stock_images/aromatic_chicken_tik_1a7c825e.jpg";
import naanStock from "@assets/stock_images/fresh_indian_naan_br_ea41efb4.jpg";
import biryaniStock from "@assets/stock_images/delicious_indian_bir_d707b251.jpg";

const categories = [
  { id: "starters", name: "Starters", icon: ChefHat },
  { id: "bbq", name: "Sizzling BBQ", icon: Flame },
  { id: "karahi", name: "Karahi & Curries", icon: UtensilsCrossed },
  { id: "vegetarian", name: "Vegetarian", icon: Salad },
  { id: "rice", name: "Rice & Biryani", icon: Sparkles },
  { id: "breads", name: "Naans & Breads", icon: Wheat },
  { id: "drinks", name: "Drinks", icon: GlassWater },
];

const categoryTiles = [
  { id: "bbq", name: "Sizzling BBQ", image: tikkaStock, count: 12, description: "Grilled to perfection" },
  { id: "karahi", name: "Karahi & Curries", image: karahiImage, count: 8, description: "Traditional flavors" },
  { id: "rice", name: "Rice & Biryani", image: biryaniStock, count: 10, description: "Aromatic and flavorful" },
  { id: "breads", name: "Naans & Breads", image: naanStock, count: 6, description: "Fresh from the tandoor" },
];

export default function QuickCategories() {
  const [activeCategory, setActiveCategory] = useState("bbq");

  return (
    <motion.div 
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-100px" }}
      transition={{ duration: 0.6 }}
      className="space-y-6"
    >
      <div className="flex items-center justify-between gap-4">
        <h2 className="text-2xl md:text-3xl font-bold" data-testid="text-categories-title">Browse by Craving</h2>
        <Link href="/menu">
          <Badge variant="outline" className="gap-1.5 cursor-pointer" data-testid="link-view-all-menu">
            View Full Menu
            <ArrowRight className="h-3.5 w-3.5" />
          </Badge>
        </Link>
      </div>

      <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-hide -mx-4 px-4 md:mx-0 md:px-0">
        {categories.map((category) => {
          const Icon = category.icon;
          return (
            <Badge
              key={category.id}
              variant={activeCategory === category.id ? "default" : "secondary"}
              className="cursor-pointer whitespace-nowrap px-4 py-2 gap-2"
              onClick={() => setActiveCategory(category.id)}
              data-testid={`badge-category-${category.id}`}
            >
              <Icon className="h-4 w-4" />
              {category.name}
            </Badge>
          );
        })}
      </div>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6">
        {categoryTiles.map((tile, idx) => (
          <motion.div
            key={tile.id}
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: idx * 0.1, duration: 0.4 }}
          >
            <Link href={`/menu?category=${tile.id}`}>
              <Card
                className="relative overflow-hidden group cursor-pointer border-0 h-full"
                data-testid={`card-category-${tile.id}`}
              >
                <div className="relative h-40 md:h-48">
                  <img
                    src={tile.image}
                    alt={tile.name}
                    className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                    data-testid={`img-category-${tile.id}`}
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/40 to-transparent" />
                  <div className="absolute inset-0 flex flex-col justify-end p-4 md:p-6">
                    <h3 className="text-lg md:text-xl font-bold text-white mb-1" data-testid={`text-category-name-${tile.id}`}>
                      {tile.name}
                    </h3>
                    <p className="text-sm text-white/80 hidden md:block">{tile.description}</p>
                    <p className="text-sm text-white/70 mt-1" data-testid={`text-category-count-${tile.id}`}>
                      {tile.count} dishes
                    </p>
                  </div>
                  <div className="absolute top-3 right-3 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                    <div className="bg-white/90 dark:bg-black/70 backdrop-blur-sm rounded-full p-2">
                      <ArrowRight className="h-4 w-4 text-foreground" />
                    </div>
                  </div>
                </div>
              </Card>
            </Link>
          </motion.div>
        ))}
      </div>
    </motion.div>
  );
}
