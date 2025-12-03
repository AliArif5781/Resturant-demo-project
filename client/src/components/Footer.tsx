import { Separator } from "@/components/ui/separator";
import { Button } from "@/components/ui/button";
import { Link } from "wouter";
import { 
  Phone, MapPin, Clock, Mail, 
  Facebook, Instagram, Twitter,
  ChefHat, Heart
} from "lucide-react";

export default function Footer() {
  return (
    <footer className="bg-card border-t" data-testid="footer-main">
      <div className="container mx-auto px-6 md:px-12 lg:px-20 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 lg:gap-12">
          <div className="space-y-4">
            <div className="flex items-center gap-2">
              <ChefHat className="h-6 w-6 text-primary" />
              <span className="font-bold text-xl">Karahi Point</span>
            </div>
            <p className="text-muted-foreground text-sm leading-relaxed">
              Authentic Pakistani cuisine crafted with love and tradition. 
              Experience the finest flavors in every bite.
            </p>
            <div className="flex gap-2">
              <Button size="icon" variant="outline" className="rounded-full" data-testid="link-facebook">
                <Facebook className="h-4 w-4" />
              </Button>
              <Button size="icon" variant="outline" className="rounded-full" data-testid="link-instagram">
                <Instagram className="h-4 w-4" />
              </Button>
              <Button size="icon" variant="outline" className="rounded-full" data-testid="link-twitter">
                <Twitter className="h-4 w-4" />
              </Button>
            </div>
          </div>

          <div className="space-y-4">
            <h3 className="font-semibold text-lg">Quick Links</h3>
            <div className="space-y-2">
              <Link href="/menu">
                <Button variant="link" className="h-auto p-0 text-muted-foreground hover:text-foreground" data-testid="link-footer-menu">
                  Our Menu
                </Button>
              </Link>
              <Link href="/cart">
                <Button variant="link" className="h-auto p-0 text-muted-foreground hover:text-foreground block" data-testid="link-footer-cart">
                  Your Cart
                </Button>
              </Link>
              <Link href="/orders">
                <Button variant="link" className="h-auto p-0 text-muted-foreground hover:text-foreground block" data-testid="link-footer-orders">
                  Track Order
                </Button>
              </Link>
            </div>
          </div>

          <div className="space-y-4">
            <h3 className="font-semibold text-lg">Contact Us</h3>
            <div className="space-y-3">
              <div className="flex items-start gap-3 text-sm text-muted-foreground">
                <MapPin className="h-4 w-4 mt-0.5 shrink-0 text-primary" />
                <span>123 Flavor Street, Downtown District</span>
              </div>
              <div className="flex items-center gap-3 text-sm text-muted-foreground">
                <Phone className="h-4 w-4 shrink-0 text-primary" />
                <a href="tel:+15551234567" className="hover:text-foreground transition-colors">
                  (555) 123-4567
                </a>
              </div>
              <div className="flex items-center gap-3 text-sm text-muted-foreground">
                <Mail className="h-4 w-4 shrink-0 text-primary" />
                <a href="mailto:hello@karahipoint.com" className="hover:text-foreground transition-colors">
                  hello@karahipoint.com
                </a>
              </div>
            </div>
          </div>

          <div className="space-y-4">
            <h3 className="font-semibold text-lg">Hours</h3>
            <div className="space-y-2 text-sm text-muted-foreground">
              <div className="flex items-center gap-3">
                <Clock className="h-4 w-4 shrink-0 text-primary" />
                <div>
                  <p className="font-medium text-foreground">Mon - Thu</p>
                  <p>11:00 AM - 10:00 PM</p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <Clock className="h-4 w-4 shrink-0 text-primary" />
                <div>
                  <p className="font-medium text-foreground">Fri - Sun</p>
                  <p>11:00 AM - 11:00 PM</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        <Separator className="my-8" />

        <div className="flex flex-col md:flex-row items-center justify-between gap-4 text-sm text-muted-foreground">
          <p className="flex items-center gap-1" data-testid="text-footer-copyright">
            Made with <Heart className="h-3.5 w-3.5 text-red-500 fill-red-500" /> by Karahi Point
          </p>
          <div className="flex flex-wrap justify-center gap-4">
            <a href="#" className="hover:text-foreground transition-colors" data-testid="link-allergy-info">
              Allergy & Dietary Info
            </a>
            <a href="#" className="hover:text-foreground transition-colors" data-testid="link-terms">
              Terms & Privacy
            </a>
            <a href="#" className="hover:text-foreground transition-colors" data-testid="link-accessibility">
              Accessibility
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
}
