import { motion } from "framer-motion";
import { useState } from "react";
import { Check, BarChart3 } from "lucide-react";
import type { Poll } from "@/data/mock";
import { cn } from "@/lib/utils";

export function PollCard({ poll }: { poll: Poll }) {
  const [picked, setPicked] = useState<number | null>(null);
  const total = poll.total + (picked !== null ? 1 : 0);

  return (
    <div className="rounded-2xl border border-border bg-card p-6 shadow-sm">
      <div className="flex items-center justify-between text-xs uppercase tracking-[0.2em]">
        <span className="text-gold">{poll.category}</span>
        <span className="text-muted-foreground">{poll.ends}</span>
      </div>
      <h3 className="mt-3 text-2xl leading-snug">{poll.question}</h3>
      <div className="mt-6 space-y-3">
        {poll.options.map((o, i) => {
          const votes = o.votes + (picked === i ? 1 : 0);
          const pct = Math.round((votes / total) * 100);
          return (
            <button
              key={o.label}
              onClick={() => setPicked(i)}
              disabled={picked !== null}
              className={cn(
                "relative w-full overflow-hidden rounded-xl border px-4 py-3 text-left text-sm transition",
                picked === i ? "border-gold" : "border-border hover:border-gold/60",
              )}
            >
              {picked !== null && (
                <motion.span
                  initial={{ width: 0 }}
                  animate={{ width: `${pct}%` }}
                  transition={{ duration: 0.9, ease: "easeOut" }}
                  className="absolute inset-y-0 left-0 bg-gold-soft"
                />
              )}
              <span className="relative flex items-center justify-between">
                <span className="flex items-center gap-2">
                  {picked === i && <Check className="h-4 w-4 text-gold" />}
                  {o.label}
                </span>
                {picked !== null && <span className="font-semibold tabular-nums">{pct}%</span>}
              </span>
            </button>
          );
        })}
      </div>
      <p className="mt-4 flex items-center gap-2 text-xs text-muted-foreground">
        <BarChart3 className="h-3 w-3" /> {total.toLocaleString()} votes {picked === null && "· pick one to see results"}
      </p>
    </div>
  );
}
