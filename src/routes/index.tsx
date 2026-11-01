import { createFileRoute, Link } from "@tanstack/react-router";
import { AnimatePresence, motion } from "framer-motion";
import { useEffect, useState } from "react";
import { ArrowRight, Flame, TrendingUp, Trophy, Users, Quote, Sparkles, Shuffle } from "lucide-react";
import { lists, categories, polls, posts, comments, categoryName } from "@/data/mock";
import { ListCard, Reveal, SectionTitle, Stars, VoteControl } from "@/components/site/bits";
import { PollCard } from "@/components/site/PollCard";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "TopTenth — The Internet's Most Beautiful Top 10 Lists" },
      { name: "description", content: "Ranked lists of the greatest films, albums, games and history — vote, rate and argue with thousands of readers." },
      { property: "og:title", content: "TopTenth — Top 10 Lists, Ranked by You" },
      { property: "og:description", content: "Vote, rate and debate the greatest films, music, games and history." },
    ],
  }),
  component: Home,
});

function HeroSlider() {
  const [i, setI] = useState(0);
  useEffect(() => {
    const t = setInterval(() => setI((n) => (n + 1) % lists.length), 6000);
    return () => clearInterval(t);
  }, []);
  const s = lists[i]!;

  return (
    <section className="grain relative isolate h-[88vh] min-h-[600px] max-h-[860px] overflow-hidden bg-ink text-ink-foreground">
      <AnimatePresence mode="sync">
        <motion.img
          key={s.slug}
          src={s.image}
          alt=""
          initial={{ opacity: 0, scale: 1.15 }}
          animate={{ opacity: 0.6, scale: 1 }}
          exit={{ opacity: 0 }}
          transition={{ opacity: { duration: 1.2 }, scale: { duration: 7, ease: "linear" } }}
          className="absolute inset-0 -z-10 h-full w-full object-cover"
        />
      </AnimatePresence>
      <div className="absolute inset-0 -z-10 bg-gradient-to-r from-ink via-ink/70 to-transparent" />
      <div className="hero-fade absolute inset-x-0 bottom-0 -z-10 h-40 sm:h-56 md:h-80" />

      <div className="mx-auto flex h-full max-w-7xl flex-col justify-center px-5">
        <p className="text-xs uppercase tracking-[0.4em] text-gold">Ranked · Reviewed · Voted</p>
        <h1 className="mt-5 max-w-4xl text-5xl leading-[1.02] md:text-7xl">
          The world, ranked <em className="text-gold-gradient">beautifully</em>.
        </h1>
        <AnimatePresence mode="wait">
          <motion.div key={s.slug} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }} transition={{ duration: 0.6 }} className="mt-8 max-w-xl">
            <span className="rounded-full border border-gold/40 px-3 py-1 text-[10px] uppercase tracking-[0.25em] text-gold">Now featuring · {categoryName(s.category)}</span>
            <h2 className="mt-4 text-2xl md:text-3xl">{s.title}</h2>
            <p className="mt-2 opacity-75">{s.excerpt}</p>
          </motion.div>
        </AnimatePresence>
        <div className="mt-8 flex flex-wrap gap-4">
          <Link to="/lists/$slug" params={{ slug: s.slug }} className="inline-flex items-center gap-2 rounded-full bg-primary px-7 py-3 font-medium text-primary-foreground transition hover:gap-4">
            Read this list <ArrowRight className="h-4 w-4" />
          </Link>
          <Link to="/polls" className="inline-flex items-center rounded-full border border-ink-foreground/30 px-7 py-3 backdrop-blur transition hover:border-gold hover:text-gold">
            Cast your vote
          </Link>
        </div>
        <div className="mt-12 flex gap-2">
          {lists.map((l, n) => (
            <button key={l.slug} aria-label={`Show ${l.title}`} onClick={() => setI(n)} className="h-1 w-10 overflow-hidden rounded-full bg-ink-foreground/20">
              {n === i && <motion.span key={i} initial={{ width: 0 }} animate={{ width: "100%" }} transition={{ duration: 6, ease: "linear" }} className="block h-full bg-gold" />}
            </button>
          ))}
        </div>
      </div>
    </section>
  );
}

function CategoryTop10() {
  const withLists = categories.filter((c) => lists.some((l) => l.category === c.slug));
  const [cat, setCat] = useState(withLists[0]!.slug);
  const list = lists.find((l) => l.category === cat)!;

  return (
    <section className="mx-auto mt-32 max-w-7xl px-5">
      <SectionTitle kicker="Top 10 by category" title="The definitive rankings" />
      <div className="mb-8 flex flex-wrap gap-2">
        {withLists.map((c) => (
          <button key={c.slug} onClick={() => setCat(c.slug)} className={cn("rounded-full border px-5 py-2 text-sm transition", cat === c.slug ? "border-gold bg-gold text-primary-foreground" : "border-border hover:border-gold/60")}>
            {c.name}
          </button>
        ))}
      </div>
      <AnimatePresence mode="wait">
        <motion.div key={cat} initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} transition={{ duration: 0.4 }} className="grid gap-8 lg:grid-cols-5">
          <div className="lg:col-span-2"><ListCard list={list} large /></div>
          <ol className="grid gap-2 sm:grid-cols-2 lg:col-span-3">
            {list.items.map((it) => (
              <li key={it.rank} className="flex items-center gap-4 rounded-xl border border-border bg-card p-3 transition hover:border-gold/50">
                <span className="w-10 text-center font-display text-3xl text-gold">{it.rank}</span>
                <img src={it.image} alt="" loading="lazy" className="h-12 w-12 rounded-lg object-cover" />
                <div className="min-w-0 flex-1">
                  <p className="truncate font-medium">{it.title}</p>
                  <div className="flex items-center gap-2 text-xs text-muted-foreground">{it.year} <Stars value={Math.round(it.rating / 2)} size={10} /> {it.rating}</div>
                </div>
              </li>
            ))}
          </ol>
        </motion.div>
      </AnimatePresence>
    </section>
  );
}

function PeoplesChoice() {
  const entries = lists
    .flatMap((l) => l.items.slice(0, 2).map((it) => ({ ...it, list: l })))
    .sort((a, b) => b.votes - a.votes)
    .slice(0, 8);

  return (
    <section className="mt-32 border-y border-border bg-card/40 py-24">
      <div className="mx-auto max-w-7xl px-5">
        <SectionTitle kicker="People's choice" title="Ranked by reader votes" action={<span className="hidden items-center gap-2 text-sm text-muted-foreground md:flex"><Users className="h-4 w-4 text-gold" /> 36,612 votes this week</span>} />
        <div className="grid gap-4 md:grid-cols-2">
          {entries.map((e, n) => (
            <Reveal key={`${e.list.slug}-${e.rank}`} delay={n * 0.04}>
              <div className="flex items-center gap-4 rounded-2xl border border-border bg-background p-4">
                <span className={cn("grid h-12 w-12 shrink-0 place-items-center rounded-full font-display text-xl", n < 3 ? "bg-gold text-primary-foreground" : "bg-muted")}>
                  {n < 3 ? <Trophy className="h-5 w-5" /> : n + 1}
                </span>
                <img src={e.image} alt="" loading="lazy" className="h-16 w-20 rounded-lg object-cover" />
                <div className="min-w-0 flex-1">
                  <p className="truncate text-lg font-display">{e.title}</p>
                  <Link to="/lists/$slug" params={{ slug: e.list.slug }} className="block truncate text-xs text-muted-foreground hover:text-gold">from {e.list.title}</Link>
                  <div className="mt-1 flex items-center gap-2 text-xs"><Stars value={Math.round(e.rating / 2)} size={11} /> <span className="font-semibold">{e.rating}</span><span className="text-muted-foreground">· {(e.votes * 3).toLocaleString()} ratings</span></div>
                </div>
                <VoteControl initial={e.votes} />
              </div>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}

function Home() {
  const feature = lists[0]!;
  const rest = lists.slice(1);
  const trending = [...lists].sort((a, b) => parseFloat(b.views) - parseFloat(a.views)).slice(0, 5);
  const reviews = comments.filter((c) => c.status === "approved");
  const [rand, setRand] = useState(0);

  return (
    <>
      <HeroSlider />

      {/* Right after the hero */}
      <section className="relative z-10 mx-auto -mt-24 max-w-7xl px-5">
        <div className="grid gap-6 md:grid-cols-3">
          {rest.slice(2).map((l, i) => (
            <Reveal key={l.slug} delay={0.1 * i}><ListCard list={l} /></Reveal>
          ))}
        </div>
      </section>

      <div className="mt-20 overflow-hidden border-y border-border py-4">
        <div className="flex w-max animate-marquee gap-12 whitespace-nowrap font-display text-2xl text-muted-foreground">
          {[...categories, ...categories].map((c, i) => (
            <Link key={i} to="/categories/$slug" params={{ slug: c.slug }} className="flex items-center gap-12 hover:text-gold">{c.name}<span className="text-gold">✦</span></Link>
          ))}
        </div>
      </div>

      <section className="mx-auto mt-24 max-w-7xl px-5">
        <SectionTitle kicker="Editor's picks" title="This week's essential lists" />
        <div className="grid gap-6 lg:grid-cols-3">
          <Reveal className="lg:col-span-2 lg:row-span-2"><ListCard list={feature} large /></Reveal>
          {rest.slice(0, 2).map((l, i) => (
            <Reveal key={l.slug} delay={0.1 * (i + 1)}><ListCard list={l} /></Reveal>
          ))}
        </div>
      </section>

      <CategoryTop10 />

      {/* Browse categories */}
      <section className="mx-auto mt-32 max-w-7xl px-5">
        <SectionTitle kicker="Browse" title="Pick your obsession" action={<Link to="/categories" className="hidden items-center gap-2 text-sm text-gold md:flex">All categories <ArrowRight className="h-4 w-4" /></Link>} />
        <div className="grid grid-cols-2 gap-4 md:grid-cols-4 lg:grid-cols-7">
          {categories.map((c, i) => (
            <Reveal key={c.slug} delay={i * 0.05}>
              <Link to="/categories/$slug" params={{ slug: c.slug }} className="group relative block aspect-[3/4] overflow-hidden rounded-2xl bg-ink">
                <img src={c.image} alt={c.name} loading="lazy" className="h-full w-full object-cover opacity-75 transition duration-700 group-hover:scale-110 group-hover:opacity-100" />
                <div className="absolute inset-0 bg-gradient-to-t from-ink to-transparent" />
                <div className="absolute bottom-0 p-4 text-ink-foreground">
                  <h3 className="text-xl">{c.name}</h3>
                  <p className="text-xs opacity-70">{c.count} lists</p>
                </div>
              </Link>
            </Reveal>
          ))}
        </div>
      </section>

      <PeoplesChoice />

      {/* Polls */}
      <section className="mx-auto mt-32 max-w-7xl px-5">
        <SectionTitle kicker="Live polls" title="Readers pick their tops" action={<Link to="/polls" className="hidden items-center gap-2 text-sm text-gold md:flex">All polls <ArrowRight className="h-4 w-4" /></Link>} />
        <div className="grid gap-6 md:grid-cols-3">
          {polls.map((p, i) => <Reveal key={p.id} delay={i * 0.08}><PollCard poll={p} /></Reveal>)}
        </div>
      </section>

      {/* Trending + reviews */}
      <section className="mx-auto mt-32 grid max-w-7xl gap-12 px-5 lg:grid-cols-5">
        <div className="lg:col-span-3">
          <SectionTitle kicker="Most read" title="Trending now" />
          <ol className="divide-y divide-border">
            {trending.map((l, i) => (
              <li key={l.slug}>
                <Link to="/lists/$slug" params={{ slug: l.slug }} className="group flex items-center gap-6 py-5">
                  <span className="w-14 font-display text-5xl text-gold/70 transition group-hover:text-gold">0{i + 1}</span>
                  <div className="flex-1">
                    <h3 className="text-xl transition group-hover:translate-x-1">{l.title}</h3>
                    <p className="mt-1 flex items-center gap-3 text-xs text-muted-foreground"><TrendingUp className="h-3 w-3 text-gold" /> {l.views} reads · {l.author}</p>
                  </div>
                  <img src={l.image} alt="" loading="lazy" className="hidden h-16 w-24 rounded-lg object-cover sm:block" />
                </Link>
              </li>
            ))}
          </ol>
        </div>
        <div className="lg:col-span-2">
          <SectionTitle kicker="Reader reviews" title="What people say" />
          <div className="space-y-4">
            {reviews.map((c) => (
              <Reveal key={c.id}>
                <div className="rounded-2xl border border-border bg-card p-5">
                  <Quote className="h-5 w-5 text-gold" />
                  <p className="mt-2 text-sm">{c.text}</p>
                  <div className="mt-4 flex items-center gap-3">
                    <span className="grid h-9 w-9 place-items-center rounded-full bg-gold-soft text-xs font-semibold text-gold">{c.avatar}</span>
                    <div className="flex-1"><p className="text-sm font-medium">{c.name}</p><p className="truncate text-xs text-muted-foreground">on {c.list}</p></div>
                    <Stars value={c.rating} size={12} />
                  </div>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* Random list */}
      <section className="mx-auto mt-32 max-w-7xl px-5">
        <div className="relative overflow-hidden rounded-3xl bg-ink text-ink-foreground">
          <AnimatePresence mode="wait">
            <motion.img key={rand} src={lists[rand]!.image} alt="" initial={{ opacity: 0 }} animate={{ opacity: 0.4 }} exit={{ opacity: 0 }} className="absolute inset-0 h-full w-full object-cover" />
          </AnimatePresence>
          <div className="relative flex flex-col items-start gap-5 p-10 md:p-16">
            <p className="flex items-center gap-2 text-xs uppercase tracking-[0.3em] text-gold"><Sparkles className="h-4 w-4" /> Feeling lucky?</p>
            <h2 className="max-w-2xl text-4xl md:text-5xl">{lists[rand]!.title}</h2>
            <div className="flex flex-wrap gap-3">
              <Link to="/lists/$slug" params={{ slug: lists[rand]!.slug }} className="rounded-full bg-primary px-6 py-3 text-sm font-medium text-primary-foreground">Read it</Link>
              <button onClick={() => setRand((rand + 1 + Math.floor(Math.random() * (lists.length - 1))) % lists.length)} className="flex items-center gap-2 rounded-full border border-ink-foreground/30 px-6 py-3 text-sm hover:border-gold hover:text-gold"><Shuffle className="h-4 w-4" /> Random list</button>
            </div>
          </div>
        </div>
      </section>

      {/* Stats */}
      <section className="mx-auto mt-32 max-w-7xl px-5">
        <div className="grid gap-px overflow-hidden rounded-3xl border border-border bg-border md:grid-cols-4">
          {[["2.4M", "Monthly readers"], ["18K", "Votes today"], ["1,311", "Lists published"], ["4.8", "Avg reader rating"]].map(([n, l]) => (
            <div key={l} className="bg-card p-8 text-center">
              <div className="font-display text-5xl text-gold">{n}</div>
              <div className="mt-2 text-sm text-muted-foreground">{l}</div>
            </div>
          ))}
        </div>
      </section>

      {/* Blog */}
      <section className="mx-auto mt-32 max-w-7xl px-5">
        <SectionTitle kicker="The Journal" title="Stories beyond the list" action={<Link to="/blog" className="hidden items-center gap-2 text-sm text-gold md:flex">Read the blog <ArrowRight className="h-4 w-4" /></Link>} />
        <div className="grid gap-8 md:grid-cols-4">
          {posts.map((p, i) => (
            <Reveal key={p.slug} delay={i * 0.08}>
              <Link to="/blog/$slug" params={{ slug: p.slug }} className="group block">
                <div className="overflow-hidden rounded-2xl"><img src={p.image} alt={p.title} loading="lazy" className="aspect-[16/10] w-full object-cover transition duration-700 group-hover:scale-105" /></div>
                <p className="mt-4 flex items-center gap-2 text-xs uppercase tracking-[0.2em] text-gold"><Flame className="h-3 w-3" /> {p.tag}</p>
                <h3 className="mt-2 text-xl leading-snug group-hover:text-gold">{p.title}</h3>
              </Link>
            </Reveal>
          ))}
        </div>
      </section>
    </>
  );
}
