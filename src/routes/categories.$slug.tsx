import { createFileRoute, notFound } from "@tanstack/react-router";
import { getCategory, lists } from "@/data/mock";
import { ListCard, Reveal } from "@/components/site/bits";

export const Route = createFileRoute("/categories/$slug")({
  loader: ({ params }) => {
    const category = getCategory(params.slug);
    if (!category) throw notFound();
    return { category };
  },
  head: ({ loaderData }) => ({
    meta: loaderData
      ? [
          { title: `Top 10 ${loaderData.category.name} Lists | TopTenth` },
          { name: "description", content: `${loaderData.category.blurb} The best ${loaderData.category.name} rankings, voted by readers.` },
          { property: "og:title", content: `Top 10 ${loaderData.category.name} Lists` },
          { property: "og:description", content: loaderData.category.blurb },
        ]
      : [{ title: "Category not found | TopTenth" }, { name: "robots", content: "noindex" }],
  }),
  component: CategoryPage,
});

function CategoryPage() {
  const { category } = Route.useLoaderData();
  const matching = lists.filter((l) => l.category === category.slug);
  const shown = matching.length ? matching : lists;

  return (
    <>
      <section className="relative isolate overflow-hidden bg-ink text-ink-foreground">
        <img src={category.image} alt="" className="absolute inset-0 -z-10 h-full w-full object-cover opacity-50" />
        <div className="absolute inset-0 -z-10 bg-ink/55" />
        <div className="hero-fade absolute inset-x-0 bottom-0 -z-10 h-32 sm:h-44 md:h-56" />
        <div className="mx-auto max-w-7xl px-5 pb-20 pt-32">
          <p className="text-xs uppercase tracking-[0.35em] text-gold">{category.count} lists</p>
          <h1 className="mt-3 text-6xl md:text-8xl">{category.name}</h1>
          <p className="mt-4 text-lg opacity-80">{category.blurb}</p>
        </div>
      </section>
      <div className="mx-auto mt-12 grid max-w-7xl gap-6 px-5 md:grid-cols-3">
        {!matching.length && <p className="text-sm text-muted-foreground md:col-span-3">More {category.name} lists coming soon — here's what's popular meanwhile.</p>}
        {shown.map((l, i) => (
          <Reveal key={l.slug} delay={i * 0.06}><ListCard list={l} /></Reveal>
        ))}
      </div>
    </>
  );
}
