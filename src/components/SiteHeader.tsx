import { Link, NavLink, useNavigate } from "react-router-dom";
import { useState } from "react";
import { Menu, X } from "lucide-react";
import { useAuth } from "@/hooks/useAuth";
import { product } from "@/lib/plans";

const links = [
  { to: "/#templates", label: "Templates" },
  { to: "/pricing", label: "Pricing" },
  { to: "/example", label: "Example" },
];

export default function SiteHeader() {
  const { user, signOut } = useAuth();
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
              {l.label}
            </a>
          ))}
          {user ? (
            <>
              <NavLink to="/app" className="text-foreground/70 hover:text-mint transition-colors">
                My resumes
              </NavLink>
              <button onClick={handleSignOut} className="text-foreground/60 hover:text-mint transition-colors">
                Sign out
              </button>
            </>
          ) : (
            <>
              <Link to="/auth" className="text-foreground/70 hover:text-mint transition-colors">
                Sign in
              </Link>
              <Link
                to="/auth?mode=signup"
                className="rounded-full bg-mint text-foreground px-6 py-2.5 text-sm font-bold hover:opacity-90 transition-opacity"
              >
                Start free
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
              {l.label}
            </a>
          ))}
          {user ? (
            <>
              <Link to="/app" onClick={() => setOpen(false)} className="text-foreground/75">
                My resumes
              </Link>
              <Link to="/account" onClick={() => setOpen(false)} className="text-foreground/75">
                Account
              </Link>
              <button onClick={handleSignOut} className="text-left text-foreground/60">
                Sign out
              </button>
            </>
          ) : (
            <>
              <Link to="/auth" onClick={() => setOpen(false)} className="text-foreground/75">
                Sign in
              </Link>
              <Link
                to="/auth?mode=signup"
                onClick={() => setOpen(false)}
                className="rounded-full bg-mint text-foreground px-4 py-2.5 text-center font-bold"
              >
                Start free
              </Link>
            </>
          )}
        </div>
      )}
    </header>
  );
}
