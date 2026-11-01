import { createFileRoute, Link, notFound } from "@tanstack/react-router";
import { ArrowLeft } from "lucide-react";
import { posts } from "@/data/mock";

export const Route = createFileRoute("/blog/$slug")({
  loader: ({ params }) => {
    const post = posts.find((p) => p.slug === params.slug);
    if (!post) throw notFound();
    return { post };
  },
  head: ({ loaderData }) => ({
    meta: loaderData
      ? [
          { title: `${loaderData.post.title} | TopTenth Journal` },
          { name: "description", content: loaderData.post.excerpt },
          { property: "og:title", content: loaderData.post.title },
          { property: "og:description", content: loaderData.post.excerpt },
          { property: "og:type", content: "article" },
        ]
      : [{ title: "Story not found | TopTenth" }, { name: "robots", content: "noindex" }],
  }),
  component: PostPage,
});

function PostPage() {
  const { post } = Route.useLoaderData();
  return (
    <article className="mx-auto max-w-3xl px-5 pt-16">
      <Link to="/blog" className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-gold">
        <ArrowLeft className="h-4 w-4" /> The Journal
      </Link>
      <p className="mt-10 text-xs uppercase tracking-[0.3em] text-gold">{post.tag} · {post.readTime}</p>
      <h1 className="mt-4 text-5xl leading-tight md:text-6xl">{post.title}</h1>
      <p className="mt-6 text-sm text-muted-foreground">{post.author} · {post.date}</p>
      <img src={post.image} alt={post.title} className="mt-10 aspect-video w-full rounded-3xl object-cover" />
      <div className="mt-12 space-y-6 text-lg leading-relaxed text-muted-foreground">
        <p className="text-2xl leading-snug text-foreground">{post.excerpt}</p>
        <p>There's a reason we can't resist a ranking. Lists promise order in a chaotic world — a finite, digestible path through the overwhelming. But the best lists do more than sort; they argue, provoke, and invite you to argue back.</p>
        <blockquote className="border-l-2 border-gold pl-6 font-display text-3xl text-foreground">"A great list isn't a verdict. It's an opening statement."</blockquote>
        <p>Every list on TopTenth is a starting point. The votes, ratings and reviews you leave reshape the order over time, turning a single editor's opinion into a living consensus.</p>
      </div>
    </article>
  );
}
