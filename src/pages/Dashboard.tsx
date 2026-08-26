import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Copy, FileText, Loader2, Plus, Trash2 } from "lucide-react";
import { toast } from "sonner";
import SiteLayout from "@/components/SiteLayout";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";
import { canCreateResume, FREE_RESUME_LIMIT } from "@/lib/plans";
import { starterResume } from "@/data/sample-resume";
import { normalizeResume } from "@/lib/resume-schema";

interface ResumeRow {
  id: string;
  title: string;
  template: string;
  updated_at: string;
}

export default function Dashboard() {
  const { user, isPro } = useAuth();
  const navigate = useNavigate();
  const [rows, setRows] = useState<ResumeRow[]>([]);
  const [loading, setLoading] = useState(true);
  const [creating, setCreating] = useState(false);

  const load = async () => {
    const { data, error } = await supabase
      .from("resumes")
      .select("id, title, template, updated_at")
      .order("updated_at", { ascending: false });
    if (error) toast.error("Could not load resumes", { description: error.message });
    setRows(data ?? []);
    setLoading(false);
  };

  useEffect(() => {
    void load();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user?.id]);

  const handleCreate = async () => {
    if (!user) return;
    if (!canCreateResume(isPro, rows.length)) {
      toast.info("Free plan includes one resume", {
        description: "Upgrade to Pro to save unlimited versions.",
      });
      navigate("/pricing");
      return;
    }
    setCreating(true);
    const { data, error } = await supabase
      .from("resumes")
      .insert({
        user_id: user.id,
        title: "Untitled resume",
        document: starterResume() as unknown as never,
      })
      .select("id")
      .single();
    setCreating(false);
    if (error || !data) {
      toast.error("Could not create resume", { description: error?.message });
      return;
    }
    navigate(`/app/resume/${data.id}`);
  };

  const handleDuplicate = async (id: string) => {
    if (!user) return;
    if (!canCreateResume(isPro, rows.length)) {
      navigate("/pricing");
      return;
    }
    const { data, error } = await supabase.from("resumes").select("*").eq("id", id).single();
    if (error || !data) {
      toast.error("Could not duplicate", { description: error?.message });
      return;
    }
    const { error: insertError } = await supabase.from("resumes").insert({
      user_id: user.id,
      title: `${data.title} (copy)`,
      document: normalizeResume(data.document) as unknown as never,
      template: data.template,
      page_format: data.page_format,
      margin_x: data.margin_x,
      margin_y: data.margin_y,
    });
    if (insertError) toast.error("Could not duplicate", { description: insertError.message });
    else {
      toast.success("Resume duplicated");
      void load();
    }
  };

  const handleDelete = async (id: string) => {
    const { error } = await supabase.from("resumes").delete().eq("id", id);
    if (error) toast.error("Could not delete", { description: error.message });
    else {
      setRows((prev) => prev.filter((r) => r.id !== id));
      toast.success("Resume deleted");
    }
  };

  return (
    <SiteLayout>
      <section className="w-full max-w-4xl mx-auto px-5 sm:px-8 md:px-12 py-14 font-['Rubik']">
        <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-4">
          <div>
            <h1 className="text-3xl font-bold tracking-tight uppercase">My resumes</h1>
            <p className="mt-2 text-sm text-foreground/60">
              {isPro ? "Pro plan — unlimited resumes." : `Free plan — ${rows.length}/${FREE_RESUME_LIMIT} resume used.`}
            </p>
          </div>
          <button
            onClick={handleCreate}
            disabled={creating}
            className="inline-flex items-center justify-center gap-2 rounded-full bg-foreground text-background px-5 py-3 text-sm font-medium hover:bg-foreground/90 transition-colors disabled:opacity-70"
          >
            {creating ? <Loader2 size={16} className="animate-spin" /> : <Plus size={16} />} New resume
          </button>
        </div>

        <div className="mt-10">
          {loading ? (
            <div className="py-16 grid place-items-center">
              <Loader2 className="animate-spin text-foreground/40" />
            </div>
          ) : rows.length === 0 ? (
            <div className="rounded-xl border border-dashed border-foreground/25 px-6 py-14 text-center">
              <FileText className="mx-auto text-foreground/35" />
              <h2 className="mt-4 text-lg font-medium">No resumes yet</h2>
              <p className="mt-2 text-sm text-foreground/60">
                Start from a prefilled draft and edit every section in the wizard.
              </p>
              <button
                onClick={handleCreate}
                className="mt-6 inline-flex items-center gap-2 rounded-full bg-foreground text-background px-5 py-3 text-sm font-medium"
              >
                <Plus size={16} /> Create my first resume
              </button>
            </div>
          ) : (
            <ul className="divide-y divide-foreground/10 border-y border-foreground/10">
              {rows.map((row) => (
                <li key={row.id} className="py-4 flex items-center justify-between gap-4">
                  <Link to={`/app/resume/${row.id}`} className="min-w-0 group">
                    <p className="truncate font-medium group-hover:underline">{row.title}</p>
                    <p className="mt-1 text-xs text-foreground/55">
                      {row.template} · updated {new Date(row.updated_at).toLocaleDateString()}
                    </p>
                  </Link>
                  <div className="flex items-center gap-2 shrink-0">
                    <button
                      onClick={() => handleDuplicate(row.id)}
                      aria-label="Duplicate resume"
                      className="inline-flex items-center justify-center w-9 h-9 rounded-full border border-foreground/15 text-foreground/60 hover:text-foreground hover:border-foreground/40 transition-colors"
                    >
                      <Copy size={15} />
                    </button>
                    <button
                      onClick={() => handleDelete(row.id)}
                      aria-label="Delete resume"
                      className="inline-flex items-center justify-center w-9 h-9 rounded-full border border-foreground/15 text-foreground/60 hover:text-foreground hover:border-foreground/40 transition-colors"
                    >
                      <Trash2 size={15} />
                    </button>
                  </div>
                </li>
              ))}
            </ul>
          )}
        </div>
      </section>
    </SiteLayout>
  );
}
