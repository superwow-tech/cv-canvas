import { Link, useNavigate } from "react-router-dom";
import { Check, Loader2 } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";
import SiteLayout from "@/components/SiteLayout";
import { plans } from "@/lib/plans";
import { useAuth } from "@/hooks/useAuth";

export default function Pricing() {
  const { user, isPro, subscription } = useAuth();
  const navigate = useNavigate();
  const [busy, setBusy] = useState(false);

  const handleUpgrade = async () => {
    if (!user) {
      navigate("/auth?mode=signup&next=%2Fpricing");
      return;
    }
    setBusy(true);
    // Checkout is wired up once payments are connected to this project.
    setTimeout(() => {
      setBusy(false);
      toast.info("Checkout coming next", {
        description: "Connect a payment provider to activate Pro subscriptions.",
      });
    }, 400);
  };

  return (
    <SiteLayout>
      <section className="w-full max-w-5xl mx-auto px-5 sm:px-8 md:px-12 py-16 md:py-20 font-['Rubik']">
        <h1 className="text-3xl md:text-5xl font-bold tracking-tight uppercase">Simple pricing</h1>
        <p className="mt-4 max-w-xl text-sm md:text-base text-foreground/65">
          Start free with one resume. Upgrade when you are applying to several roles and want every template, paper size
          and margin control.
        </p>

        <div className="mt-12 grid grid-cols-1 md:grid-cols-2 gap-6">
          {plans.map((plan) => {
            const current = isPro ? plan.id === "pro" : plan.id === "free";
            return (
              <div
                key={plan.id}
                className={`rounded-xl border p-6 md:p-8 ${
                  plan.id === "pro" ? "border-mint bg-mint-light/25" : "border-foreground/15"
                }`}
              >
                <div className="flex items-center justify-between">
                  <h2 className="text-lg font-medium">{plan.name}</h2>
                  {current && (
                    <span className="rounded-full border border-foreground/20 px-3 py-1 text-xs text-foreground/60">
                      Current plan
                    </span>
                  )}
                </div>
                <p className="mt-4 flex items-baseline gap-2">
                  <span className="text-4xl font-bold">{plan.price}</span>
                  <span className="text-sm text-foreground/55">{plan.cadence}</span>
                </p>
                <p className="mt-3 text-sm text-foreground/65">{plan.summary}</p>
                <ul className="mt-6 space-y-2">
                  {plan.features.map((f) => (
                    <li key={f} className="flex gap-2 text-sm text-foreground/75">
                      <Check size={16} className="mt-0.5 shrink-0 text-foreground/50" /> {f}
                    </li>
                  ))}
                </ul>

                {plan.id === "pro" ? (
                  <button
                    onClick={handleUpgrade}
                    disabled={busy || isPro}
                    className="mt-8 inline-flex w-full items-center justify-center gap-2 rounded-full bg-foreground text-background px-5 py-3 text-sm font-medium hover:bg-foreground/90 transition-colors disabled:opacity-60"
                  >
                    {busy && <Loader2 size={16} className="animate-spin" />}
                    {isPro ? "You're on Pro" : plan.cta}
                  </button>
                ) : (
                  <Link
                    to={user ? "/app" : "/auth?mode=signup"}
                    className="mt-8 inline-flex w-full items-center justify-center rounded-full border border-foreground/20 px-5 py-3 text-sm font-medium hover:border-foreground/50 transition-colors"
                  >
                    {user ? "Go to my resumes" : plan.cta}
                  </Link>
                )}
              </div>
            );
          })}
        </div>

        {subscription.currentPeriodEnd && (
          <p className="mt-8 text-sm text-foreground/55">
            Your Pro access runs until {new Date(subscription.currentPeriodEnd).toLocaleDateString()}.
          </p>
        )}
      </section>
    </SiteLayout>
  );
}
