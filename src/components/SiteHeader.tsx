import { Link, NavLink, useNavigate } from "react-router-dom";
import { useState } from "react";
import { Menu, X } from "lucide-react";
import { useAuth } from "@/hooks/useAuth";
import { product } from "@/lib/plans";
import { languages, useI18n } from "@/lib/i18n";

const links = [
  { to: "/#templates", key: "nav.templates" },
  { to: "/pricing", key: "nav.pricing" },
  { to: "/example", key: "nav.sample" },
];

/** Compact EN / LT switcher used in the main menu. */
function LanguageSwitcher({ className = "" }: { className?: string }) {
  const { lang, setLang } = useI18n();
  const { t } = useI18n();
  return (
    <div
      className={`inline-flex rounded-full border border-foreground/15 p-0.5 ${className}`}
      role="group"
      aria-label={t("nav.language")}
    >
      {languages.map((l) => {
        const active = lang === l.id;
        return (
          <button
            key={l.id}
            type="button"
            onClick={() => setLang(l.id)}
            aria-pressed={active}
            title={l.label}
            className={`rounded-full px-2.5 py-1 text-xs font-bold transition-colors ${
              active ? "bg-foreground text-background" : "text-foreground/60 hover:text-foreground"
            }`}
          >
            {l.short}
          </button>
        );
      })}
    </div>
  );
}

export default function SiteHeader() {
  const { user, signOut } = useAuth();
  const { t } = useI18n();
  const navigate = useNavigate();
  const [open, setOpen] = useState(false);

  const handleSignOut = async () => {
    await signOut();
    navigate("/");
  };

  return (
    <header className="sticky top-0 z-40 border-b border-foreground/10 bg-background/85 backdrop-blur">
      <div className="w-full max-w-6xl mx-auto px-5 sm:px-8 md:px-12 h-16 flex items-center justify-between">
        <Link to="/" className="font-display text-2xl font-bold tracking-tight">
          {product.name}
        </Link>

        <nav className="hidden md:flex items-center gap-7 text-sm font-medium">
          {links.map((l) => (
            <a key={l.to} href={l.to} className="text-foreground/70 hover:text-mint transition-colors">
              {t(l.key)}
            </a>
          ))}
          {user ? (
            <>
              <NavLink to="/app" className="text-foreground/70 hover:text-mint transition-colors">
                {t("nav.myResumes")}
              </NavLink>
              <button onClick={handleSignOut} className="text-foreground/60 hover:text-mint transition-colors">
                {t("nav.signOut")}
              </button>
              <LanguageSwitcher />
            </>
          ) : (
            <>
              <Link to="/auth" className="text-foreground/70 hover:text-mint transition-colors">
                {t("nav.signIn")}
              </Link>
              <LanguageSwitcher />
              <Link
                to="/auth?mode=signup"
                className="rounded-full bg-mint text-foreground px-6 py-2.5 text-sm font-bold hover:opacity-90 transition-opacity"
              >
                {t("nav.startFree")}
              </Link>
            </>
          )}
        </nav>

        <button
          className="md:hidden inline-flex items-center justify-center w-10 h-10 rounded-full border border-foreground/15"
          onClick={() => setOpen((v) => !v)}
          aria-label={open ? "Close menu" : "Open menu"}
        >
          {open ? <X size={18} /> : <Menu size={18} />}
        </button>
      </div>

      {open && (
        <div className="md:hidden border-t border-foreground/10 px-5 py-4 flex flex-col gap-4 text-sm bg-background">
          {links.map((l) => (
            <a key={l.to} href={l.to} onClick={() => setOpen(false)} className="text-foreground/75">
              {t(l.key)}
            </a>
          ))}
          {user ? (
            <>
              <Link to="/app" onClick={() => setOpen(false)} className="text-foreground/75">
                {t("nav.myResumes")}
              </Link>
              <Link to="/account" onClick={() => setOpen(false)} className="text-foreground/75">
                {t("nav.account")}
              </Link>
              <button onClick={handleSignOut} className="text-left text-foreground/60">
                {t("nav.signOut")}
              </button>
            </>
          ) : (
            <>
              <Link to="/auth" onClick={() => setOpen(false)} className="text-foreground/75">
                {t("nav.signIn")}
              </Link>
              <Link
                to="/auth?mode=signup"
                onClick={() => setOpen(false)}
                className="rounded-full bg-mint text-foreground px-4 py-2.5 text-center font-bold"
              >
                {t("nav.startFree")}
              </Link>
            </>
          )}
          <div className="pt-2 flex items-center justify-between border-t border-foreground/10">
            <span className="text-xs uppercase tracking-[0.2em] text-foreground/45">{t("nav.language")}</span>
            <LanguageSwitcher />
          </div>
        </div>
      )}
    </header>
  );
}
