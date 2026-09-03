import { Link } from "react-router-dom";
import { product } from "@/lib/plans";
import { useI18n } from "@/lib/i18n";

export default function SiteFooter() {
  const { t } = useI18n();
  return (
    <footer className="border-t border-border">
      <div className="w-full max-w-7xl mx-auto px-5 sm:px-8 py-12 flex flex-col md:flex-row md:items-center md:justify-between gap-8 text-sm text-foreground/60">
        <span className="font-display text-xl font-bold tracking-tight text-foreground">{product.name}</span>
        <nav className="flex flex-wrap items-center gap-8 text-xs font-medium">
          <Link to="/pricing" className="hover:text-foreground transition-colors">
            {t("nav.pricing")}
          </Link>
          <Link to="/example" className="hover:text-foreground transition-colors">
            {t("footer.example")}
          </Link>
          <Link to="/terms" className="hover:text-foreground transition-colors">
            {t("footer.terms")}
          </Link>
          <Link to="/privacy" className="hover:text-foreground transition-colors">
            {t("footer.privacy")}
          </Link>
        </nav>
      </div>
    </footer>
  );
}
