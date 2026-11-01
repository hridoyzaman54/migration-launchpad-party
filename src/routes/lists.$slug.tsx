import { createFileRoute, Link, notFound } from "@tanstack/react-router";
import { motion, useScroll, useSpring } from "framer-motion";
import { useState } from "react";
import { Clock, Eye, Play, Share2, Bookmark, Heart } from "lucide-react";
import { toast } from "sonner";
import { getList, categoryName, comments as seedComments, lists } from "@/data/mock";
import { ListCard, Reveal, Stars, VoteControl } from "@/components/site/bits";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";

export const Route = createFileRoute("/lists/$slug")({
  loader: ({ params }) => {
    const list = getList(params.slug);
    if (!list) throw notFound();
    return { list };
  },
  head: ({ loaderData }) => ({
    meta: loaderData
      ? [
          { title: `${loaderData.list.title} | TopTenth` },
          { name: "description", content: loaderData.list.excerpt },
          { property: "og:title", content: loaderData.list.title },
          { property: "og:description", content: loaderData.list.excerpt },
          { property: "og:type", content: "article" },
        ]
      : [{ title: "List not found | TopTenth" }, { name: "robots", content: "noindex" }],
  }),
  component: ListPage,
});

function ListPage() {
  const { list } = Route.useLoaderData();
  const { scrollYProgress } = useScroll();
  const progress = useSpring(scrollYProgress, { stiffness: 120, damping: 30 });
  const [rating, setRating] = useState(0);
  const [text, setText] = useState("");
  const [items, setItems] = useState(seedComments.filter((c) => c.status === "approved"));

  const submit = () => {
    if (!text.trim()) return;
    setItems([{ id: crypto.randomUUID(), name: "You", avatar: "YO", text, rating: rating || 5, time: "just now", likes: 0, list: list.title, status: "approved" }, ...items]);
    setText("");
    setRating(0);
    toast.success("Thanks! Your review was posted.");
  };

  return (
    <article>
      <motion.div style={{ scaleX: progress }} className="fixed inset-x-0 top-16 z-40 h-0.5 origin-left bg-gold" />

      <header className="relative isolate overflow-hidden bg-ink text-ink-foreground">
        <img src={list.image} alt="" className="absolute inset-0 -z-10 h-full w-full object-cover opacity-50" />
        <div className="absolute inset-0 -z-10 bg-ink/60" />
        <div className="hero-fade absolute inset-x-0 bottom-0 -z-10 h-64" />
        <div className="mx-auto max-w-4xl px-5 pb-24 pt-32 text-center">
          <Link to="/categories/$slug" params={{ slug: list.category }} className="text-xs uppercase tracking-[0.35em] text-gold">
            {categoryName(list.category)}
          </Link>
          <motion.h1 initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="mt-6 text-4xl leading-tight md:text-6xl">
            {list.title}
          </motion.h1>
          <p className="mx-auto mt-6 max-w-2xl text-lg opacity-80">{list.excerpt}</p>
          <div className="mt-8 flex flex-wrap items-center justify-center gap-6 text-sm opacity-80">
            <span>By {list.author}</span>
            <span>{list.date}</span>
            <span className="flex items-center gap-1"><Clock className="h-4 w-4" /> {list.readTime}</span>
            <span className="flex items-center gap-1"><Eye className="h-4 w-4" /> {list.views}</span>
          </div>
        </div>
      </header>

      <div className="mx-auto max-w-4xl px-5">
        <div className="sticky top-20 z-30 -mt-6 flex justify-center gap-2">
          {[Share2, Bookmark, Heart].map((Icon, i) => (
            <button key={i} onClick={() => toast("Saved for the prototype")} className="rounded-full border border-border bg-card p-3 shadow-lg transition hover:border-gold hover:text-gold" aria-label="Action">
              <Icon className="h-4 w-4" />
            </button>
          ))}
        </div>

        <div className="mt-16 space-y-28">
          {list.items.map((item) => (
            <Reveal key={item.rank}>
              <section className="relative">
                <div className="flex items-start gap-5">
                  <span className="font-display text-8xl leading-none text-gold md:text-9xl">{item.rank}</span>
                  <div className="flex-1 pt-3">
                    <h2 className="text-3xl md:text-4xl">{item.title}</h2>
                    <div className="mt-2 flex items-center gap-3 text-sm text-muted-foreground">
                      <span>{item.year}</span>
                      <Stars value={Math.round(item.rating / 2)} />
                      <span className="font-semibold text-foreground">{item.rating}</span>
                    </div>
                  </div>
                  <VoteControl initial={item.votes} />
                </div>
                <div className="group relative mt-8 overflow-hidden rounded-2xl">
                  <img src={item.image} alt={item.title} loading="lazy" className="aspect-video w-full object-cover transition duration-700 group-hover:scale-105" />
                  {item.videoUrl && (
                    <button onClick={() => toast("Video from Google Drive would play here")} className="absolute inset-0 grid place-items-center bg-ink/30 transition hover:bg-ink/10">
                      <span className="grid h-20 w-20 place-items-center rounded-full bg-gold text-primary-foreground shadow-2xl transition group-hover:scale-110">
                        <Play className="ml-1 h-8 w-8 fill-current" />
                      </span>
                    </button>
                  )}
                </div>
                <p className="mt-6 text-lg leading-relaxed text-muted-foreground first-letter:float-left first-letter:mr-2 first-letter:font-display first-letter:text-6xl first-letter:leading-none first-letter:text-gold">
                  {item.body}
                </p>
              </section>
            </Reveal>
          ))}
        </div>

        {/* Reviews */}
        <section className="mt-32 rounded-3xl border border-border bg-card p-8">
          <h2 className="text-3xl">Reader reviews</h2>
          <p className="mt-1 text-sm text-muted-foreground">Rate this list and tell us what we got wrong.</p>
          <div className="mt-6 space-y-3">
            <Stars value={rating} size={24} onChange={setRating} />
            <Textarea value={text} onChange={(e) => setText(e.target.value)} placeholder="Your take on the ranking…" rows={4} />
            <Button onClick={submit}>Post review</Button>
          </div>
          <ul className="mt-10 space-y-6">
            {items.map((c) => (
              <motion.li key={c.id} layout initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="flex gap-4 border-t border-border pt-6">
                <span className="grid h-11 w-11 shrink-0 place-items-center rounded-full bg-gold-soft text-sm font-semibold text-gold">{c.avatar}</span>
                <div>
                  <div className="flex items-center gap-3">
                    <span className="font-medium">{c.name}</span>
                    <Stars value={c.rating} size={12} />
                    <span className="text-xs text-muted-foreground">{c.time}</span>
                  </div>
                  <p className="mt-2 text-sm">{c.text}</p>
                  <button className="mt-2 flex items-center gap-1 text-xs text-muted-foreground hover:text-gold"><Heart className="h-3 w-3" /> {c.likes}</button>
                </div>
              </motion.li>
            ))}
          </ul>
        </section>
      </div>

      <section className="mx-auto mt-24 max-w-7xl px-5">
        <h2 className="mb-8 text-3xl">Keep ranking</h2>
        <div className="grid gap-6 md:grid-cols-3">
          {lists.filter((l) => l.slug !== list.slug).slice(0, 3).map((l) => <ListCard key={l.slug} list={l} />)}
        </div>
      </section>
    </article>
  );
}
