import { useState, useEffect } from "react";
import { Globe, User } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";

interface HeaderProps {
  mode?: "dine-in" | "pickup";
  tableNumber?: string;
}

export default function Header({ mode = "dine-in", tableNumber = "T12" }: HeaderProps) {
  const [isScrolled, setIsScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <header
      className={`sticky top-0 z-50 transition-all duration-300 ${
        isScrolled
          ? "bg-background/95 backdrop-blur-md border-b shadow-sm"
          : "bg-transparent"
      }`}
      data-testid="header-main"
    >
      <div className="container mx-auto px-4 py-3">
        <div className="flex items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-primary flex items-center justify-center text-primary-foreground font-bold text-lg">
              K
            </div>
            <span className="font-bold text-lg hidden sm:inline">Karahi Point</span>
          </div>

          <Badge variant="secondary" className="text-xs" data-testid="badge-context">
            {mode === "dine-in" ? `Dine-in · Table ${tableNumber}` : "Pickup · Choose time"}
          </Badge>

          <div className="flex items-center gap-2">
            <Button size="icon" variant="ghost" data-testid="button-language">
              <Globe className="h-4 w-4" />
            </Button>
            <Avatar className="h-8 w-8" data-testid="avatar-user">
              <AvatarFallback className="bg-accent text-xs">
                <User className="h-4 w-4" />
              </AvatarFallback>
            </Avatar>
          </div>
        </div>
      </div>
    </header>
  );
}
