import { createFileRoute, Link } from "@tanstack/react-router";
import { categories } from "@/data/mock";
import { Reveal } from "@/components/site/bits";

export const Route = createFileRoute("/categories/")({
  head: () => ({
    meta: [
      { title: "All Categories | TopTenth" },
      { name: "description", content: "Browse Top 10 lists across movies, sci-fi, horror, music, crime, gaming and history." },
      { property: "og:title", content: "Browse Every Category | TopTenth" },
      { property: "og:description", content: "Movies, music, games, history and more — all ranked." },
    ],
  }),
  component: Categories,
});

function Categories() {
  return (
    <div className="mx-auto max-w-7xl px-5 pt-20">
      <p className="text-xs uppercase tracking-[0.35em] text-gold">Browse</p>
      <h1 className="mt-3 text-5xl md:text-7xl">Every obsession, ranked.</h1>
      <div className="mt-14 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
        {categories.map((c, i) => (
          <Reveal key={c.slug} delay={i * 0.06} className={i === 0 ? "sm:col-span-2 lg:row-span-2" : ""}>
            <Link to="/categories/$slug" params={{ slug: c.slug }} className="group relative block h-full min-h-72 overflow-hidden rounded-2xl bg-ink">
              <img src={c.image} alt={c.name} loading="lazy" className="absolute inset-0 h-full w-full object-cover opacity-70 transition duration-700 group-hover:scale-110 group-hover:opacity-100" />
              <div className="absolute inset-0 bg-gradient-to-t from-ink via-ink/30 to-transparent" />
              <div className="absolute bottom-0 p-6 text-ink-foreground">
                <h2 className={i === 0 ? "text-5xl" : "text-3xl"}>{c.name}</h2>
                <p className="mt-1 text-sm opacity-75">{c.blurb} · {c.count} lists</p>
              </div>
            </Link>
          </Reveal>
        ))}
      </div>
    </div>
  );
}
