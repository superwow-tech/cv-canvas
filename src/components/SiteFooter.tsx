import { Link } from "react-router-dom";
import { product } from "@/lib/plans";

export default function SiteFooter() {
  return (
    <footer className="border-t border-border">
      <div className="w-full max-w-7xl mx-auto px-5 sm:px-8 py-12 flex flex-col md:flex-row md:items-center md:justify-between gap-8 text-sm text-foreground/60">
        <span className="font-display text-xl font-bold tracking-tight text-foreground">{product.name}</span>
        <nav className="flex flex-wrap items-center gap-8 text-xs font-medium">
          <Link to="/pricing" className="hover:text-foreground transition-colors">
            Pricing
          </Link>
          <Link to="/example" className="hover:text-foreground transition-colors">
            Example
          </Link>
          <Link to="/terms" className="hover:text-foreground transition-colors">
            Terms
          </Link>
          <Link to="/privacy" className="hover:text-foreground transition-colors">
            Privacy
          </Link>
        </nav>
      </div>
    </footer>
  );
}
