import { Link } from "@tanstack/react-router";
import { Crown } from "lucide-react";
import { categories } from "@/data/mock";

export function SiteFooter() {
  return (
    <footer className="mt-32 border-t border-border bg-card/40">
      <div className="mx-auto grid max-w-7xl gap-10 px-5 py-16 md:grid-cols-4">
        <div className="md:col-span-2">
          <div className="flex items-center gap-2 font-display text-3xl">
            <Crown className="h-5 w-5 text-gold" /> Top<span className="text-gold">Tenth</span>
          </div>
          <p className="mt-4 max-w-sm text-sm text-muted-foreground">
            Curated rankings of the films, music, games and history worth your time — voted on by thousands of readers every day.
          </p>
          <form className="mt-6 flex max-w-sm gap-2" onSubmit={(e) => e.preventDefault()}>
            <input
              placeholder="Your email"
              className="flex-1 rounded-full border border-input bg-background px-4 py-2 text-sm outline-none focus:border-gold"
            />
            <button className="rounded-full bg-primary px-5 py-2 text-sm font-medium text-primary-foreground">Subscribe</button>
          </form>
        </div>
        <div>
          <h4 className="text-lg">Categories</h4>
          <ul className="mt-4 space-y-2 text-sm text-muted-foreground">
            {categories.slice(0, 5).map((c) => (
              <li key={c.slug}>
                <Link to="/categories/$slug" params={{ slug: c.slug }} className="hover:text-gold">{c.name}</Link>
              </li>
            ))}
          </ul>
        </div>
        <div>
          <h4 className="text-lg">Explore</h4>
          <ul className="mt-4 space-y-2 text-sm text-muted-foreground">
            <li><Link to="/polls" className="hover:text-gold">Polls</Link></li>
            <li><Link to="/blog" className="hover:text-gold">Blog</Link></li>
            <li><Link to="/admin" className="hover:text-gold">Admin panel</Link></li>
          </ul>
        </div>
      </div>
      <div className="border-t border-border py-6 text-center text-xs text-muted-foreground">
        © 2026 TopTenth. Design prototype.
      </div>
    </footer>
  );
}
