import { useServerFn } from "@tanstack/react-start";
import { useRouterState } from "@tanstack/react-router";
import { AnimatePresence, motion } from "framer-motion";
import { Loader2, MessageSquareHeart, Sparkles, X } from "lucide-react";
import { useEffect, useState } from "react";
import { getDesignRecommendations } from "@/lib/design-ai.functions";
import { cn } from "@/lib/utils";

const PAGE_OPTIONS = [
  { value: "Home page (hero slider and featured lists)", label: "Home" },
  { value: "Category pages (e.g. /categories/sci-fi hero and list grid)", label: "Category page" },
  { value: "List detail pages (e.g. a Top 10 list with ranked items)", label: "List page" },
  { value: "Reader polls page", label: "Polls" },
  { value: "The Journal blog pages", label: "Blog" },
  { value: "Admin dashboard", label: "Admin" },
  { value: "Site-wide (header, footer, general look)", label: "Site-wide" },
];

type Result = Awaited<ReturnType<typeof getDesignRecommendations>>;

function severityClass(severity: string) {
  if (severity === "high") return "bg-destructive/10 text-destructive border-destructive/30";
  if (severity === "medium") return "bg-gold-soft text-gold border-gold/30";
  return "bg-muted text-muted-foreground border-border";
}

export function DesignFeedbackWidget() {
  const [open, setOpen] = useState(false);
  const [page, setPage] = useState(PAGE_OPTIONS[0]!.value);
  const [issue, setIssue] = useState("");
  const [busy, setBusy] = useState(false);
  const [result, setResult] = useState<Result | null>(null);
  const send = useServerFn(getDesignRecommendations);
  const pathname = useRouterState({ select: (s) => s.location.pathname });

  useEffect(() => {
    if (!open) return;
    if (pathname.startsWith("/categories")) setPage(PAGE_OPTIONS[1]!.value);
    else if (pathname.startsWith("/lists")) setPage(PAGE_OPTIONS[2]!.value);
    else if (pathname.startsWith("/polls")) setPage(PAGE_OPTIONS[3]!.value);
    else if (pathname.startsWith("/blog")) setPage(PAGE_OPTIONS[4]!.value);
    else if (pathname.startsWith("/admin")) setPage(PAGE_OPTIONS[5]!.value);
    else setPage(PAGE_OPTIONS[0]!.value);
  }, [open, pathname]);

  const submit = async () => {
    setBusy(true);
    setResult(null);
    try {
      const res = await send({ data: { page, issue } });
      setResult(res);
    } catch {
      setResult({ ok: false, error: "Something went wrong while getting recommendations. Please try again." });
    } finally {
      setBusy(false);
    }
  };

  return (
    <>
      <button
        onClick={() => setOpen(true)}
        className="fixed bottom-6 right-6 z-50 flex items-center gap-2 rounded-full bg-primary px-5 py-3 text-sm font-medium text-primary-foreground shadow-xl transition hover:gap-3"
        aria-label="Suggest a design improvement"
      >
        <Sparkles className="h-4 w-4" /> Design feedback
      </button>

      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 grid place-items-center bg-ink/60 p-4 backdrop-blur-sm"
            onClick={() => !busy && setOpen(false)}
          >
            <motion.div
              initial={{ opacity: 0, y: 24, scale: 0.97 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 16, scale: 0.98 }}
              transition={{ duration: 0.25 }}
              onClick={(e) => e.stopPropagation()}
              className="max-h-[86vh] w-full max-w-2xl overflow-y-auto rounded-3xl border border-border bg-card p-6 shadow-2xl md:p-8"
            >
              <div className="flex items-start justify-between gap-4">
                <div>
                  <p className="flex items-center gap-2 text-xs uppercase tracking-[0.3em] text-gold">
                    <Sparkles className="h-3.5 w-3.5" /> AI-powered
                  </p>
                  <h2 className="mt-2 text-2xl">Help us look better</h2>
                  <p className="mt-1 text-sm text-muted-foreground">
                    Describe a page or something that looks off — our design assistant suggests specific improvements.
                  </p>
                </div>
                <button onClick={() => setOpen(false)} disabled={busy} className="rounded-full p-2 text-muted-foreground transition hover:text-gold" aria-label="Close">
                  <X className="h-4 w-4" />
                </button>
              </div>

              <div className="mt-6 space-y-4">
                <label className="block">
                  <span className="text-xs font-medium uppercase tracking-[0.2em] text-muted-foreground">Which part of the site?</span>
                  <select
                    value={page}
                    onChange={(e) => setPage(e.target.value)}
                    disabled={busy}
                    className="mt-2 w-full rounded-xl border border-input bg-background px-4 py-2.5 text-sm outline-none focus:border-gold"
                  >
                    {PAGE_OPTIONS.map((o) => (
                      <option key={o.label} value={o.value}>{o.label}</option>
                    ))}
                  </select>
                </label>
                <label className="block">
                  <span className="text-xs font-medium uppercase tracking-[0.2em] text-muted-foreground">What did you notice?</span>
                  <textarea
                    value={issue}
                    onChange={(e) => setIssue(e.target.value)}
                    rows={4}
                    maxLength={2000}
                    disabled={busy}
                    placeholder="e.g. On my phone the hero photo looks cramped and the headline is hard to read…"
                    className="mt-2 w-full resize-none rounded-xl border border-input bg-background px-4 py-3 text-sm outline-none focus:border-gold"
                  />
                </label>
                <button
                  onClick={submit}
                  disabled={busy}
                  className="inline-flex w-full items-center justify-center gap-2 rounded-full bg-primary px-6 py-3 text-sm font-medium text-primary-foreground transition hover:gap-3 disabled:opacity-60"
                >
                  {busy ? <Loader2 className="h-4 w-4 animate-spin" /> : <MessageSquareHeart className="h-4 w-4" />}
                  {busy ? "Analyzing the design…" : "Get recommendations"}
                </button>
              </div>

              {result && !result.ok && (
                <p className="mt-5 rounded-xl border border-destructive/30 bg-destructive/10 p-4 text-sm text-destructive">{result.error}</p>
              )}

              {result && result.ok && (
                <div className="mt-6 space-y-4 border-t border-border pt-6">
                  <p className="text-sm text-muted-foreground">{result.summary}</p>
                  <ul className="space-y-3">
                    {result.recommendations.map((r, i) => (
                      <li key={i} className="rounded-2xl border border-border bg-background p-4">
                        <div className="flex flex-wrap items-center gap-2">
                          <span className={cn("rounded-full border px-2.5 py-0.5 text-[10px] font-semibold uppercase tracking-[0.15em]", severityClass(r.severity))}>
                            {r.severity}
                          </span>
                          <span className="text-xs font-semibold uppercase tracking-[0.15em] text-gold">{r.area}</span>
                        </div>
                        <p className="mt-2 text-sm font-medium">{r.issue}</p>
                        <p className="mt-1 text-sm">{r.recommendation}</p>
                        <p className="mt-2 rounded-lg bg-muted/60 px-3 py-2 text-xs text-muted-foreground">{r.designNote}</p>
                      </li>
                    ))}
                  </ul>
                  {result.followUps.length > 0 && (
                    <div>
                      <p className="text-xs font-semibold uppercase tracking-[0.2em] text-muted-foreground">Worth exploring next</p>
                      <ul className="mt-2 list-inside list-disc space-y-1 text-sm text-muted-foreground">
                        {result.followUps.map((f, i) => (
                          <li key={i}>{f}</li>
                        ))}
                      </ul>
                    </div>
                  )}
                </div>
              )}
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
