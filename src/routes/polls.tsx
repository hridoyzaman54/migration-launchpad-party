import { createFileRoute } from "@tanstack/react-router";
import { polls } from "@/data/mock";
import { PollCard } from "@/components/site/PollCard";
import { Reveal } from "@/components/site/bits";

export const Route = createFileRoute("/polls")({
  head: () => ({
    meta: [
      { title: "Reader Polls — Vote on the Greatest | TopTenth" },
      { name: "description", content: "Vote in live polls on the best films, villains, albums and more. See results instantly." },
      { property: "og:title", content: "Reader Polls | TopTenth" },
      { property: "og:description", content: "Your vote shapes the rankings. Join thousands of readers." },
    ],
  }),
  component: Polls,
});

function Polls() {
  return (
    <div className="mx-auto max-w-7xl px-5 pt-20">
      <p className="text-xs uppercase tracking-[0.35em] text-gold">The people decide</p>
      <h1 className="mt-3 max-w-3xl text-5xl md:text-7xl">Live polls. Your vote, the final word.</h1>
      <div className="mt-14 grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {polls.map((p, i) => (
          <Reveal key={p.id} delay={i * 0.08}><PollCard poll={p} /></Reveal>
        ))}
      </div>
    </div>
  );
}
