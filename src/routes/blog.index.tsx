import { createFileRoute, Link } from "@tanstack/react-router";
import { posts } from "@/data/mock";
import { Reveal } from "@/components/site/bits";

export const Route = createFileRoute("/blog/")({
  head: () => ({
    meta: [
      { title: "The Journal — Essays & Interviews | TopTenth" },
      { name: "description", content: "Long reads on film craft, music culture, game design and history from the TopTenth editors." },
      { property: "og:title", content: "The TopTenth Journal" },
      { property: "og:description", content: "Essays, interviews and stories beyond the list." },
    ],
  }),
  component: Blog,
});

function Blog() {
  const lead = posts[0]!;
  const rest = posts.slice(1);
  return (
    <div className="mx-auto max-w-7xl px-5 pt-20">
      <p className="text-xs uppercase tracking-[0.35em] text-gold">The Journal</p>
      <h1 className="mt-3 text-5xl md:text-7xl">Stories beyond the list.</h1>

      <Reveal>
        <Link to="/blog/$slug" params={{ slug: lead.slug }} className="group mt-14 grid items-center gap-10 md:grid-cols-2">
          <div className="overflow-hidden rounded-3xl">
            <img src={lead.image} alt={lead.title} className="aspect-[4/3] w-full object-cover transition duration-700 group-hover:scale-105" />
          </div>
          <div>
            <p className="text-xs uppercase tracking-[0.25em] text-gold">{lead.tag} · {lead.readTime}</p>
            <h2 className="mt-4 text-4xl leading-tight group-hover:text-gold md:text-5xl">{lead.title}</h2>
            <p className="mt-4 text-lg text-muted-foreground">{lead.excerpt}</p>
            <p className="mt-6 text-sm">{lead.author} · {lead.date}</p>
          </div>
        </Link>
      </Reveal>

      <div className="mt-20 grid gap-10 md:grid-cols-3">
        {rest.map((p, i) => (
          <Reveal key={p.slug} delay={i * 0.08}>
            <Link to="/blog/$slug" params={{ slug: p.slug }} className="group block">
              <div className="overflow-hidden rounded-2xl">
                <img src={p.image} alt={p.title} loading="lazy" className="aspect-[16/10] w-full object-cover transition duration-700 group-hover:scale-105" />
              </div>
              <p className="mt-4 text-xs uppercase tracking-[0.2em] text-gold">{p.tag}</p>
              <h3 className="mt-2 text-2xl group-hover:text-gold">{p.title}</h3>
              <p className="mt-2 text-sm text-muted-foreground">{p.excerpt}</p>
            </Link>
          </Reveal>
        ))}
      </div>
    </div>
  );
}
