import { Link } from "@tanstack/react-router";
import { motion } from "framer-motion";
import { Star, ChevronUp, ChevronDown, Eye, Clock } from "lucide-react";
import { useState, type ReactNode } from "react";
import { categoryName, type TopList } from "@/data/mock";
import { cn } from "@/lib/utils";

export function Reveal({ children, delay = 0, className }: { children: ReactNode; delay?: number; className?: string }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 28 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-60px" }}
      transition={{ duration: 0.7, delay, ease: [0.22, 1, 0.36, 1] }}
      className={className}
    >
      {children}
    </motion.div>
  );
}

export function SectionTitle({ kicker, title, action }: { kicker: string; title: string; action?: ReactNode }) {
  return (
    <div className="mb-10 flex items-end justify-between gap-6">
      <div>
        <p className="text-xs uppercase tracking-[0.3em] text-gold">{kicker}</p>
        <h2 className="mt-2 text-4xl md:text-5xl">{title}</h2>
      </div>
      {action}
    </div>
  );
}

export function Stars({ value, size = 14, onChange }: { value: number; size?: number; onChange?: (v: number) => void }) {
  const [hover, setHover] = useState(0);
  return (
    <div className="flex gap-0.5" onMouseLeave={() => setHover(0)}>
      {[1, 2, 3, 4, 5].map((i) => (
        <Star
          key={i}
          style={{ width: size, height: size }}
          onMouseEnter={() => onChange && setHover(i)}
          onClick={() => onChange?.(i)}
          className={cn(
            "transition-colors",
            onChange && "cursor-pointer",
            (hover || value) >= i ? "fill-gold text-gold" : "text-muted-foreground/40",
          )}
        />
      ))}
    </div>
  );
}

export function VoteControl({ initial }: { initial: number }) {
  const [vote, setVote] = useState<0 | 1 | -1>(0);
  return (
    <div className="flex flex-col items-center rounded-full border border-border bg-card/80 px-1 py-1 backdrop-blur">
      <button
        aria-label="Upvote"
        onClick={() => setVote(vote === 1 ? 0 : 1)}
        className={cn("rounded-full p-1 transition", vote === 1 ? "bg-gold text-primary-foreground" : "hover:text-gold")}
      >
        <ChevronUp className="h-4 w-4" />
      </button>
      <motion.span key={vote} initial={{ scale: 1.4 }} animate={{ scale: 1 }} className="py-1 text-xs font-semibold tabular-nums">
        {(initial + vote).toLocaleString()}
      </motion.span>
      <button
        aria-label="Downvote"
        onClick={() => setVote(vote === -1 ? 0 : -1)}
        className={cn("rounded-full p-1 transition", vote === -1 ? "bg-destructive text-destructive-foreground" : "hover:text-destructive")}
      >
        <ChevronDown className="h-4 w-4" />
      </button>
    </div>
  );
}

export function ListCard({ list, large = false }: { list: TopList; large?: boolean }) {
  return (
    <Link to="/lists/$slug" params={{ slug: list.slug }} className="group block">
      <div className={cn("relative overflow-hidden rounded-2xl bg-ink", large ? "aspect-[4/5] md:aspect-[16/11]" : "aspect-[4/3]")}>
        <img
          src={list.image}
          alt={list.title}
          loading="lazy"
          className="h-full w-full object-cover opacity-90 transition duration-[1.2s] ease-out group-hover:scale-110 group-hover:opacity-100"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-ink via-ink/40 to-transparent" />
        <span className="absolute left-4 top-4 rounded-full border border-gold/40 bg-ink/60 px-3 py-1 text-[10px] uppercase tracking-[0.2em] text-gold backdrop-blur">
          {categoryName(list.category)}
        </span>
        <span className="absolute right-4 top-2 font-display text-6xl text-gold/80 drop-shadow-lg">10</span>
        <div className="absolute inset-x-0 bottom-0 p-5 text-ink-foreground">
          <h3 className={cn("leading-tight transition group-hover:text-gold", large ? "text-3xl md:text-4xl" : "text-xl")}>{list.title}</h3>
          {large && <p className="mt-3 max-w-lg text-sm opacity-80">{list.excerpt}</p>}
          <div className="mt-3 flex items-center gap-4 text-xs opacity-70">
            <span className="flex items-center gap-1"><Clock className="h-3 w-3" /> {list.readTime}</span>
            <span className="flex items-center gap-1"><Eye className="h-3 w-3" /> {list.views}</span>
            <span>{list.author}</span>
          </div>
        </div>
      </div>
    </Link>
  );
}
