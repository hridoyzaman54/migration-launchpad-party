import { createFileRoute, Link } from "@tanstack/react-router";
import { useState } from "react";
import { Area, AreaChart, CartesianGrid, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";
import {
  Crown, LayoutDashboard, ListOrdered, FolderTree, MessageSquare, Users, BarChart3, FileText, Plus,
  Eye, ThumbsUp, Star, TrendingUp, Check, X, Flag, Link2, Image as ImageIcon, Video, Moon, Sun, ArrowLeft,
} from "lucide-react";
import { toast } from "sonner";
import { lists, categories, comments as seedComments, visitors, polls, posts, trafficWeek, categoryName } from "@/data/mock";
import { useTheme } from "@/lib/theme";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Label } from "@/components/ui/label";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/admin")({
  head: () => ({
    meta: [
      { title: "Admin Dashboard | TopTenth" },
      { name: "description", content: "Manage lists, categories, reviews, polls and visitors." },
      { property: "og:title", content: "TopTenth Admin" },
      { property: "og:description", content: "Content and community management for TopTenth." },
      { name: "robots", content: "noindex" },
    ],
  }),
  component: Admin,
});

const tabs = [
  { id: "overview", label: "Overview", icon: LayoutDashboard },
  { id: "lists", label: "Lists & Reviews", icon: ListOrdered },
  { id: "categories", label: "Categories", icon: FolderTree },
  { id: "comments", label: "Comments", icon: MessageSquare },
  { id: "polls", label: "Polls & Votes", icon: BarChart3 },
  { id: "visitors", label: "Visitors", icon: Users },
  { id: "blog", label: "Blog", icon: FileText },
] as const;
type Tab = (typeof tabs)[number]["id"];

function Admin() {
  const [tab, setTab] = useState<Tab>("overview");
  const { theme, toggle } = useTheme();

  return (
    <div className="flex min-h-screen bg-background">
      <aside className="sticky top-0 hidden h-screen w-64 shrink-0 flex-col border-r border-sidebar-border bg-sidebar p-5 md:flex">
        <div className="flex items-center gap-2 font-display text-2xl">
          <Crown className="h-5 w-5 text-gold" /> Top<span className="text-gold">Tenth</span>
        </div>
        <p className="mt-1 text-xs uppercase tracking-[0.25em] text-muted-foreground">Admin</p>
        <nav className="mt-8 flex flex-1 flex-col gap-1">
          {tabs.map((t) => (
            <button
              key={t.id}
              onClick={() => setTab(t.id)}
              className={cn(
                "flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm transition",
                tab === t.id ? "bg-sidebar-accent text-gold" : "text-muted-foreground hover:bg-sidebar-accent/60 hover:text-foreground",
              )}
            >
              <t.icon className="h-4 w-4" /> {t.label}
            </button>
          ))}
        </nav>
        <Link to="/" className="flex items-center gap-2 text-sm text-muted-foreground hover:text-gold">
          <ArrowLeft className="h-4 w-4" /> Back to site
        </Link>
      </aside>

      <div className="flex-1 overflow-x-hidden">
        <header className="sticky top-0 z-20 flex h-16 items-center justify-between border-b border-border bg-background/80 px-6 backdrop-blur">
          <select value={tab} onChange={(e) => setTab(e.target.value as Tab)} className="rounded-md border border-input bg-background px-2 py-1 text-sm md:hidden">
            {tabs.map((t) => <option key={t.id} value={t.id}>{t.label}</option>)}
          </select>
          <h1 className="hidden text-2xl md:block">{tabs.find((t) => t.id === tab)?.label}</h1>
          <div className="flex items-center gap-3">
            <Button variant="ghost" size="icon" onClick={toggle} aria-label="Toggle theme">
              {theme === "dark" ? <Sun className="h-4 w-4" /> : <Moon className="h-4 w-4" />}
            </Button>
            <span className="grid h-9 w-9 place-items-center rounded-full bg-gold-soft text-sm font-semibold text-gold">AD</span>
          </div>
        </header>
        <main className="p-6">
          {tab === "overview" && <Overview />}
          {tab === "lists" && <ListsTab />}
          {tab === "categories" && <CategoriesTab />}
          {tab === "comments" && <CommentsTab />}
          {tab === "polls" && <PollsTab />}
          {tab === "visitors" && <VisitorsTab />}
          {tab === "blog" && <BlogTab />}
        </main>
      </div>
    </div>
  );
}

function Panel({ children, className }: { children: React.ReactNode; className?: string }) {
  return <div className={cn("rounded-2xl border border-border bg-card p-6", className)}>{children}</div>;
}

function Overview() {
  const stats = [
    { label: "Visitors (7d)", value: "126.6K", delta: "+18%", icon: Eye },
    { label: "Votes cast", value: "36.6K", delta: "+24%", icon: ThumbsUp },
    { label: "Reviews", value: "4,211", delta: "+9%", icon: Star },
    { label: "Lists live", value: String(lists.length * 218), delta: "+12", icon: ListOrdered },
  ];
  return (
    <div className="space-y-6">
      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {stats.map((s) => (
          <Panel key={s.label}>
            <div className="flex items-center justify-between text-muted-foreground">
              <span className="text-sm">{s.label}</span>
              <s.icon className="h-4 w-4 text-gold" />
            </div>
            <div className="mt-3 font-display text-4xl">{s.value}</div>
            <div className="mt-1 flex items-center gap-1 text-xs text-gold"><TrendingUp className="h-3 w-3" /> {s.delta} this week</div>
          </Panel>
        ))}
      </div>
      <div className="grid gap-6 xl:grid-cols-3">
        <Panel className="xl:col-span-2">
          <h2 className="text-xl">Traffic & votes</h2>
          <div className="mt-4 h-72">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={trafficWeek}>
                <defs>
                  <linearGradient id="g1" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="var(--gold)" stopOpacity={0.5} />
                    <stop offset="100%" stopColor="var(--gold)" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid stroke="var(--border)" vertical={false} />
                <XAxis dataKey="day" stroke="var(--muted-foreground)" fontSize={12} />
                <YAxis stroke="var(--muted-foreground)" fontSize={12} />
                <Tooltip contentStyle={{ background: "var(--popover)", border: "1px solid var(--border)", borderRadius: 12 }} />
                <Area type="monotone" dataKey="visits" stroke="var(--gold)" fill="url(#g1)" strokeWidth={2} />
                <Area type="monotone" dataKey="votes" stroke="var(--chart-2)" fill="transparent" strokeWidth={2} />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </Panel>
        <Panel>
          <h2 className="text-xl">Top lists</h2>
          <ul className="mt-4 space-y-4">
            {lists.slice(0, 5).map((l, i) => (
              <li key={l.slug} className="flex items-center gap-3">
                <span className="font-display text-2xl text-gold">{i + 1}</span>
                <img src={l.image} alt="" className="h-10 w-14 rounded-md object-cover" />
                <div className="min-w-0 flex-1">
                  <p className="truncate text-sm">{l.title}</p>
                  <p className="text-xs text-muted-foreground">{l.views} views</p>
                </div>
              </li>
            ))}
          </ul>
        </Panel>
      </div>
    </div>
  );
}

function NewListDialog() {
  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button><Plus className="h-4 w-4" /> New list</Button>
      </DialogTrigger>
      <DialogContent className="max-h-[90vh] overflow-y-auto sm:max-w-xl">
        <DialogHeader><DialogTitle className="font-display text-2xl">Create a Top 10 list</DialogTitle></DialogHeader>
        <div className="space-y-4">
          <div className="space-y-2"><Label>Title</Label><Input placeholder="10 Films That…" /></div>
          <div className="space-y-2"><Label>Excerpt</Label><Textarea rows={2} placeholder="Short teaser" /></div>
          <div className="space-y-2">
            <Label>Category</Label>
            <Select>
              <SelectTrigger><SelectValue placeholder="Choose a category" /></SelectTrigger>
              <SelectContent>{categories.map((c) => <SelectItem key={c.slug} value={c.slug}>{c.name}</SelectItem>)}</SelectContent>
            </Select>
          </div>
          <div className="space-y-2">
            <Label className="flex items-center gap-2"><ImageIcon className="h-4 w-4 text-gold" /> Cover image (Google Drive link)</Label>
            <div className="relative"><Link2 className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" /><Input className="pl-9" placeholder="https://drive.google.com/file/d/…" /></div>
          </div>
          <div className="space-y-2">
            <Label className="flex items-center gap-2"><Video className="h-4 w-4 text-gold" /> Video (Google Drive link)</Label>
            <div className="relative"><Link2 className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" /><Input className="pl-9" placeholder="https://drive.google.com/file/d/…/preview" /></div>
          </div>
          <div className="rounded-xl border border-dashed border-border p-4">
            <p className="text-sm font-medium">Ranked entries</p>
            <p className="mt-1 text-xs text-muted-foreground">Each entry: rank, title, year, rating (0–10), review text, image & video links.</p>
            <div className="mt-3 grid grid-cols-[3rem_1fr_5rem] gap-2">
              <Input defaultValue="10" /><Input placeholder="Entry title" /><Input placeholder="9.2" />
            </div>
            <Button variant="outline" size="sm" className="mt-3"><Plus className="h-3 w-3" /> Add entry</Button>
          </div>
          <Button className="w-full" onClick={() => toast.success("List saved (prototype)")}>Publish list</Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}

function ListsTab() {
  return (
    <Panel>
      <div className="flex flex-wrap items-center justify-between gap-3">
        <Input placeholder="Search lists…" className="max-w-xs" />
        <NewListDialog />
      </div>
      <div className="mt-6 overflow-x-auto">
        <table className="w-full text-sm">
          <thead className="text-left text-xs uppercase tracking-wider text-muted-foreground">
            <tr><th className="pb-3">List</th><th>Category</th><th>Author</th><th>Views</th><th>Avg rating</th><th>Status</th><th /></tr>
          </thead>
          <tbody className="divide-y divide-border">
            {lists.map((l, i) => (
              <tr key={l.slug}>
                <td className="py-3"><div className="flex items-center gap-3"><img src={l.image} alt="" className="h-10 w-14 rounded object-cover" /><span className="max-w-xs truncate">{l.title}</span></div></td>
                <td>{categoryName(l.category)}</td>
                <td>{l.author}</td>
                <td>{l.views}</td>
                <td><span className="flex items-center gap-1"><Star className="h-3 w-3 fill-gold text-gold" /> {(4.9 - i * 0.1).toFixed(1)}</span></td>
                <td><Badge variant={i === 4 ? "secondary" : "default"}>{i === 4 ? "Draft" : "Live"}</Badge></td>
                <td className="text-right"><Button variant="ghost" size="sm">Edit</Button></td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </Panel>
  );
}

function CategoriesTab() {
  const [name, setName] = useState("");
  const [items, setItems] = useState(categories);
  return (
    <div className="space-y-6">
      <Panel>
        <h2 className="text-xl">Add category</h2>
        <div className="mt-4 flex flex-wrap gap-3">
          <Input value={name} onChange={(e) => setName(e.target.value)} placeholder="Category name" className="max-w-xs" />
          <Input placeholder="Cover image Drive link" className="max-w-sm" />
          <Button onClick={() => { if (!name) return; setItems([...items, { ...categories[0]!, slug: name.toLowerCase(), name, count: 0 }]); setName(""); toast.success("Category added"); }}>
            <Plus className="h-4 w-4" /> Add
          </Button>
        </div>
      </Panel>
      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {items.map((c) => (
          <div key={c.slug} className="group relative overflow-hidden rounded-2xl bg-ink text-ink-foreground">
            <img src={c.image} alt="" className="aspect-video w-full object-cover opacity-60" />
            <div className="absolute inset-0 flex flex-col justify-end p-4">
              <h3 className="text-2xl">{c.name}</h3>
              <p className="text-xs opacity-70">{c.count} lists</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

function CommentsTab() {
  const [items, setItems] = useState(seedComments);
  const set = (id: string, status: "approved" | "flagged") => setItems(items.map((c) => (c.id === id ? { ...c, status } : c)));
  return (
    <Panel>
      <ul className="divide-y divide-border">
        {items.map((c) => (
          <li key={c.id} className="flex flex-wrap items-start gap-4 py-4">
            <span className="grid h-10 w-10 place-items-center rounded-full bg-gold-soft text-xs font-semibold text-gold">{c.avatar}</span>
            <div className="min-w-0 flex-1">
              <div className="flex flex-wrap items-center gap-2 text-sm">
                <span className="font-medium">{c.name}</span>
                <span className="text-muted-foreground">on {c.list}</span>
                <Badge variant={c.status === "approved" ? "default" : c.status === "flagged" ? "destructive" : "secondary"}>{c.status}</Badge>
              </div>
              <p className="mt-1 text-sm text-muted-foreground">{c.text}</p>
            </div>
            <div className="flex gap-1">
              <Button size="icon" variant="ghost" aria-label="Approve" onClick={() => set(c.id, "approved")}><Check className="h-4 w-4 text-gold" /></Button>
              <Button size="icon" variant="ghost" aria-label="Flag" onClick={() => set(c.id, "flagged")}><Flag className="h-4 w-4" /></Button>
              <Button size="icon" variant="ghost" aria-label="Delete" onClick={() => setItems(items.filter((x) => x.id !== c.id))}><X className="h-4 w-4 text-destructive" /></Button>
            </div>
          </li>
        ))}
      </ul>
    </Panel>
  );
}

function PollsTab() {
  return (
    <div className="grid gap-6 lg:grid-cols-2">
      {polls.map((p) => (
        <Panel key={p.id}>
          <div className="flex items-center justify-between">
            <Badge variant="outline" className="border-gold/50 text-gold">{p.category}</Badge>
            <span className="text-xs text-muted-foreground">{p.total.toLocaleString()} votes · {p.ends}</span>
          </div>
          <h3 className="mt-3 text-xl">{p.question}</h3>
          <div className="mt-4 space-y-3">
            {p.options.map((o) => {
              const pct = Math.round((o.votes / p.total) * 100);
              return (
                <div key={o.label}>
                  <div className="flex justify-between text-sm"><span>{o.label}</span><span className="tabular-nums text-muted-foreground">{o.votes.toLocaleString()} · {pct}%</span></div>
                  <div className="mt-1 h-2 overflow-hidden rounded-full bg-muted"><div className="h-full rounded-full bg-gold" style={{ width: `${pct}%` }} /></div>
                </div>
              );
            })}
          </div>
          <div className="mt-4 flex gap-2"><Button size="sm" variant="outline">Edit</Button><Button size="sm" variant="ghost">Close poll</Button></div>
        </Panel>
      ))}
    </div>
  );
}

function VisitorsTab() {
  return (
    <Panel>
      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead className="text-left text-xs uppercase tracking-wider text-muted-foreground">
            <tr><th className="pb-3">Visitor</th><th>Country</th><th>Votes</th><th>Comments</th><th>Joined</th><th>Status</th><th /></tr>
          </thead>
          <tbody className="divide-y divide-border">
            {visitors.map((v) => (
              <tr key={v.id}>
                <td className="py-3"><p>{v.name}</p><p className="text-xs text-muted-foreground">{v.email}</p></td>
                <td>{v.country}</td><td>{v.votes}</td><td>{v.comments}</td><td>{v.joined}</td>
                <td><Badge variant={v.status === "Banned" ? "destructive" : "default"}>{v.status}</Badge></td>
                <td className="text-right"><Button variant="ghost" size="sm">{v.status === "Banned" ? "Unban" : "Ban"}</Button></td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </Panel>
  );
}

function BlogTab() {
  return (
    <div className="space-y-4">
      <div className="flex justify-end"><Button onClick={() => toast("Blog editor coming with the backend")}><Plus className="h-4 w-4" /> New post</Button></div>
      <div className="grid gap-4 md:grid-cols-2">
        {posts.map((p) => (
          <Panel key={p.slug} className="flex gap-4 p-4">
            <img src={p.image} alt="" className="h-20 w-28 rounded-lg object-cover" />
            <div className="min-w-0">
              <p className="text-xs uppercase tracking-wider text-gold">{p.tag}</p>
              <p className="truncate">{p.title}</p>
              <p className="text-xs text-muted-foreground">{p.author} · {p.date}</p>
            </div>
          </Panel>
        ))}
      </div>
    </div>
  );
}
