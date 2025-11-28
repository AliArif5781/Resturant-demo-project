import { Separator } from "@/components/ui/separator";

export default function Footer() {
  return (
    <footer className="bg-card border-t py-8" data-testid="footer-main">
      <div className="container mx-auto px-4">
        <div className="text-center space-y-4">
          <p className="text-sm text-muted-foreground" data-testid="text-footer-help">
            Need help? Ask our staff or call{" "}
            <a href="tel:+15551234567" className="text-primary hover:underline">
              (555) 123-4567
            </a>
          </p>
          <div className="flex flex-wrap justify-center gap-4 text-sm">
            <a href="#" className="text-muted-foreground hover:text-foreground" data-testid="link-allergy-info">
              Allergy & dietary info
            </a>
            <Separator orientation="vertical" className="h-4" />
            <a href="#" className="text-muted-foreground hover:text-foreground" data-testid="link-terms">
              Terms & privacy
            </a>
          </div>
          <p className="text-xs text-muted-foreground/70" data-testid="text-footer-powered">
            Powered by Smart Restaurant Platform
          </p>
        </div>
      </div>
    </footer>
  );
}
