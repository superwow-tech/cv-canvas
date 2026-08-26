import { useEffect, useState } from "react";
import { Link, useNavigate, useSearchParams } from "react-router-dom";
import { Loader2 } from "lucide-react";
import { toast } from "sonner";
import SiteLayout from "@/components/SiteLayout";
import { supabase } from "@/integrations/supabase/client";
import { lovable } from "@/integrations/lovable/index";
import { useAuth } from "@/hooks/useAuth";
import { product } from "@/lib/plans";

/** Only allow same-origin relative paths as a post-login destination. */
const safeNext = (value: string | null) =>
  value && value.startsWith("/") && !value.startsWith("//") ? value : "/app";

export default function Auth() {
  const [params] = useSearchParams();
  const navigate = useNavigate();
  const { user, loading } = useAuth();

  const next = safeNext(params.get("next"));
  const [mode, setMode] = useState<"signin" | "signup">(
    params.get("mode") === "signup" ? "signup" : "signin"
  );
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [busy, setBusy] = useState(false);

  useEffect(() => {
    if (!loading && user) navigate(next, { replace: true });
  }, [loading, user, next, navigate]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (busy) return;
    setBusy(true);
    try {
      if (mode === "signup") {
        const { error } = await supabase.auth.signUp({
          email,
          password,
          options: {
            emailRedirectTo: `${window.location.origin}${next}`,
            data: { full_name: fullName },
          },
        });
        if (error) throw error;
        toast.success("Account created", { description: "You're signed in and ready to build." });
      } else {
        const { error } = await supabase.auth.signInWithPassword({ email, password });
        if (error) throw error;
      }
      navigate(next, { replace: true });
    } catch (error) {
      const message = error instanceof Error ? error.message : "Something went wrong";
      toast.error(mode === "signup" ? "Could not sign up" : "Could not sign in", { description: message });
    } finally {
      setBusy(false);
    }
  };

  const handleGoogle = async () => {
    try {
      sessionStorage.setItem("applyo:next", next);
      const result = await lovable.auth.signInWithOAuth("google", {
        redirect_uri: window.location.origin,
      });
      if (result.error) {
        toast.error("Google sign-in failed", { description: result.error.message });
        return;
      }
      if (result.redirected) return;
      navigate(next, { replace: true });
    } catch (error) {
      toast.error("Google sign-in failed", {
        description: error instanceof Error ? error.message : "Please try again.",
      });
    }
  };

  return (
    <SiteLayout>
      <section className="w-full max-w-md mx-auto px-5 py-16 md:py-24 font-['Rubik']">
        <h1 className="text-3xl font-bold tracking-tight uppercase">
          {mode === "signup" ? `Join ${product.name}` : "Welcome back"}
        </h1>
        <p className="mt-3 text-sm text-foreground/65">
          {mode === "signup"
            ? "Create a free account to save your resume and export PDFs."
            : "Sign in to keep editing your saved resumes."}
        </p>

        <button
          onClick={handleGoogle}
          className="mt-8 inline-flex w-full items-center justify-center gap-2 rounded-full border border-foreground/20 px-5 py-3 text-sm font-medium hover:border-foreground/50 transition-colors"
        >
          Continue with Google
        </button>

        <div className="my-6 flex items-center gap-3 text-xs text-foreground/45">
          <span className="h-px flex-1 bg-foreground/15" /> or <span className="h-px flex-1 bg-foreground/15" />
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          {mode === "signup" && (
            <label className="block">
              <span className="text-xs uppercase tracking-widest text-foreground/55">Full name</span>
              <input
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
                autoComplete="name"
                className="mt-2 w-full rounded-lg border border-foreground/20 bg-transparent px-4 py-3 text-sm outline-none focus:border-foreground/60"
              />
            </label>
          )}
          <label className="block">
            <span className="text-xs uppercase tracking-widest text-foreground/55">Email</span>
            <input
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              autoComplete="email"
              className="mt-2 w-full rounded-lg border border-foreground/20 bg-transparent px-4 py-3 text-sm outline-none focus:border-foreground/60"
            />
          </label>
          <label className="block">
            <span className="text-xs uppercase tracking-widest text-foreground/55">Password</span>
            <input
              type="password"
              required
              minLength={6}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              autoComplete={mode === "signup" ? "new-password" : "current-password"}
              className="mt-2 w-full rounded-lg border border-foreground/20 bg-transparent px-4 py-3 text-sm outline-none focus:border-foreground/60"
            />
          </label>

          <button
            type="submit"
            disabled={busy}
            className="inline-flex w-full items-center justify-center gap-2 rounded-full bg-foreground text-background px-5 py-3 text-sm font-medium hover:bg-foreground/90 transition-colors disabled:opacity-70"
          >
            {busy && <Loader2 size={16} className="animate-spin" />}
            {mode === "signup" ? "Create account" : "Sign in"}
          </button>
        </form>

        <p className="mt-6 text-sm text-foreground/60">
          {mode === "signup" ? "Already have an account?" : "New here?"}{" "}
          <button
            onClick={() => setMode(mode === "signup" ? "signin" : "signup")}
            className="underline hover:text-foreground"
          >
            {mode === "signup" ? "Sign in" : "Create one free"}
          </button>
        </p>

        <p className="mt-8 text-xs text-foreground/45">
          By continuing you agree to our{" "}
          <Link to="/terms" className="underline">
            Terms
          </Link>{" "}
          and{" "}
          <Link to="/privacy" className="underline">
            Privacy Policy
          </Link>
          .
        </p>
      </section>
    </SiteLayout>
  );
}
