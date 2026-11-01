import { Link } from "@tanstack/react-router";
import { Moon, Sun, Search, Menu, X, Crown } from "lucide-react";
import { useState } from "react";
import { useTheme } from "@/lib/theme";
import { Button } from "@/components/ui/button";

const nav = [
  { to: "/", label: "Home" },
  { to: "/categories", label: "Categories" },
  { to: "/polls", label: "Polls" },
  { to: "/blog", label: "Blog" },
] as const;

export function SiteHeader() {
  const { theme, toggle } = useTheme();
  const [open, setOpen] = useState(false);

  return (
    <header className="sticky top-0 z-50 border-b border-border/60 bg-background/75 backdrop-blur-xl">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-5">
        <Link to="/" className="flex items-center gap-2">
          <span className="grid h-9 w-9 place-items-center rounded-full border border-gold/50 bg-gold-soft">
            <Crown className="h-4 w-4 text-gold" />
          </span>
          <span className="font-display text-2xl">
            Top<span className="text-gold">Tenth</span>
          </span>
        </Link>

        <nav className="hidden items-center gap-8 md:flex">
          {nav.map((n) => (
            <Link
              key={n.to}
              to={n.to}
              activeOptions={{ exact: n.to === "/" }}
              className="relative text-sm tracking-wide text-muted-foreground transition-colors hover:text-foreground data-[status=active]:text-gold"
            >
              {n.label}
            </Link>
          ))}
        </nav>

        <div className="flex items-center gap-1">
          <Button variant="ghost" size="icon" aria-label="Search">
            <Search className="h-4 w-4" />
          </Button>
          <Button variant="ghost" size="icon" onClick={toggle} aria-label="Toggle light or dark mode">
            {theme === "dark" ? <Sun className="h-4 w-4" /> : <Moon className="h-4 w-4" />}
          </Button>
          <Button asChild size="sm" variant="outline" className="ml-2 hidden border-gold/50 sm:inline-flex">
            <Link to="/admin">Admin</Link>
          </Button>
          <Button variant="ghost" size="icon" className="md:hidden" onClick={() => setOpen(!open)} aria-label="Menu">
            {open ? <X className="h-4 w-4" /> : <Menu className="h-4 w-4" />}
          </Button>
        </div>
      </div>
      {open && (
        <nav className="flex flex-col gap-1 border-t border-border px-5 py-3 md:hidden">
          {[...nav, { to: "/admin", label: "Admin" } as const].map((n) => (
            <Link key={n.to} to={n.to} onClick={() => setOpen(false)} className="py-2 text-sm">
              {n.label}
            </Link>
          ))}
        </nav>
      )}
    </header>
  );
}
