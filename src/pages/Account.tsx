import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { toast } from "sonner";
import SiteLayout from "@/components/SiteLayout";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";

export default function Account() {
  const { user, isPro, subscription, signOut } = useAuth();
  const navigate = useNavigate();
  const [fullName, setFullName] = useState("");
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (!user) return;
    supabase
      .from("profiles")
      .select("full_name")
      .eq("id", user.id)
      .maybeSingle()
      .then(({ data }) => setFullName(data?.full_name ?? ""));
  }, [user]);

  const handleSave = async () => {
    if (!user) return;
    setSaving(true);
    const { error } = await supabase
      .from("profiles")
      .upsert({ id: user.id, email: user.email, full_name: fullName });
    setSaving(false);
    if (error) toast.error("Could not save", { description: error.message });
    else toast.success("Profile updated");
  };

  return (
    <SiteLayout>
      <section className="w-full max-w-2xl mx-auto px-5 sm:px-8 md:px-12 py-14 font-['Rubik']">
        <h1 className="text-3xl font-bold tracking-tight uppercase">Account</h1>

        <div className="mt-10 space-y-3">
          <label className="block">
            <span className="text-xs uppercase tracking-widest text-foreground/55">Email</span>
            <input
              value={user?.email ?? ""}
              readOnly
              className="mt-2 w-full rounded-lg border border-foreground/15 bg-foreground/[0.03] px-4 py-3 text-sm text-foreground/70"
            />
          </label>
          <label className="block">
            <span className="text-xs uppercase tracking-widest text-foreground/55">Full name</span>
            <input
              value={fullName}
              onChange={(e) => setFullName(e.target.value)}
              className="mt-2 w-full rounded-lg border border-foreground/20 bg-transparent px-4 py-3 text-sm outline-none focus:border-foreground/60"
            />
          </label>
          <button
            onClick={handleSave}
            disabled={saving}
            className="rounded-full bg-foreground text-background px-5 py-2.5 text-sm font-medium hover:bg-foreground/90 transition-colors disabled:opacity-70"
          >
            {saving ? "Saving…" : "Save changes"}
          </button>
        </div>

        <div className="mt-12 rounded-xl border border-foreground/15 p-6">
          <h2 className="text-lg font-medium">Plan</h2>
          <p className="mt-2 text-sm text-foreground/70">
            You are on the <span className="font-medium text-foreground">{isPro ? "Pro" : "Free"}</span> plan.
            {subscription.currentPeriodEnd &&
              ` Renews ${new Date(subscription.currentPeriodEnd).toLocaleDateString()}.`}
          </p>
          <Link
            to="/pricing"
            className="mt-4 inline-flex rounded-full border border-foreground/20 px-5 py-2.5 text-sm font-medium hover:border-foreground/50 transition-colors"
          >
            {isPro ? "Manage plan" : "See Pro features"}
          </Link>
        </div>

        <button
          onClick={async () => {
            await signOut();
            navigate("/");
          }}
          className="mt-10 text-sm text-foreground/55 underline hover:text-foreground"
        >
          Sign out
        </button>
      </section>
    </SiteLayout>
  );
}
