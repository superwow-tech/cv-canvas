import { Link } from "react-router-dom";
import { product } from "@/lib/plans";

export default function SiteFooter() {
  return (
    <footer className="border-t border-foreground/10 mt-20">
      <div className="w-full max-w-6xl mx-auto px-5 sm:px-8 md:px-12 py-10 flex flex-col md:flex-row md:items-center md:justify-between gap-6 text-sm font-['Rubik'] text-foreground/60">
        <p>
          <span className="font-medium text-foreground/80">{product.name}</span> — {product.tagline}
        </p>
        <nav className="flex flex-wrap items-center gap-5">
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
