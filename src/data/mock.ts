import hero from "@/assets/hero-cinema.jpg";
import scifi from "@/assets/scifi.jpg";
import horror from "@/assets/horror.jpg";
import music from "@/assets/music.jpg";
import drama from "@/assets/drama.jpg";
import gaming from "@/assets/gaming.jpg";
import history from "@/assets/history.jpg";

export const images = { hero, scifi, horror, music, drama, gaming, history };

export type Category = { slug: string; name: string; image: string; count: number; blurb: string };
export const categories: Category[] = [
  { slug: "movies", name: "Movies", image: hero, count: 412, blurb: "Cinema's finest, ranked." },
  { slug: "sci-fi", name: "Sci-Fi", image: scifi, count: 128, blurb: "Futures worth imagining." },
  { slug: "horror", name: "Horror", image: horror, count: 96, blurb: "Lights off. Read on." },
  { slug: "music", name: "Music", image: music, count: 203, blurb: "Albums that shaped eras." },
  { slug: "crime", name: "Crime & Noir", image: drama, count: 87, blurb: "Shadows, rain, and secrets." },
  { slug: "gaming", name: "Gaming", image: gaming, count: 154, blurb: "Worlds you can play." },
  { slug: "history", name: "History", image: history, count: 231, blurb: "The past, stranger than fiction." },
];

export type ListItem = {
  rank: number;
  title: string;
  year: string;
  rating: number;
  votes: number;
  body: string;
  image: string;
  videoUrl?: string;
};

export type TopList = {
  slug: string;
  title: string;
  excerpt: string;
  category: string;
  image: string;
  author: string;
  date: string;
  readTime: string;
  views: string;
  items: ListItem[];
};

const pool: string[] = [hero, scifi, horror, music, drama, gaming, history];

function makeItems(names: [string, string][]): ListItem[] {
  return names.map(([title, year], i): ListItem => ({
    rank: 10 - i,
    title,
    year,
    rating: Math.round((9.8 - (9 - i) * 0.18) * 10) / 10,
    votes: 4820 - (9 - i) * 311,
    image: pool[i % pool.length]!,
    ...(i % 3 === 0 ? { videoUrl: "https://drive.google.com/file/d/example/preview" } : {}),
    body:
      "A masterclass in atmosphere and restraint, it rewards every rewatch with details you missed the first time. Critics adored it, audiences argued about it, and decades later it still sets the bar others chase.",
  }));
}

export const lists: TopList[] = [
  {
    slug: "greatest-sci-fi-films",
    title: "10 Sci-Fi Films That Rewired Cinema Forever",
    excerpt: "From silent robots to cosmic odysseys — the films that taught us how to dream about tomorrow.",
    category: "sci-fi",
    image: scifi,
    author: "Mara Ellison",
    date: "Oct 28, 2026",
    readTime: "12 min",
    views: "248K",
    items: makeItems([
      ["Metropolis", "1927"], ["Solaris", "1972"], ["Alien", "1979"], ["The Thing", "1982"],
      ["Gattaca", "1997"], ["Children of Men", "2006"], ["Arrival", "2016"], ["Interstellar", "2014"],
      ["Blade Runner", "1982"], ["2001: A Space Odyssey", "1968"],
    ]).reverse(),
  },
  {
    slug: "scariest-haunted-house-movies",
    title: "10 Haunted House Movies That Will Ruin Your Sleep",
    excerpt: "Creaking floors, cold spots, and doors that shouldn't open. Enter at your own risk.",
    category: "horror",
    image: horror,
    author: "Dorian Vale",
    date: "Oct 26, 2026",
    readTime: "9 min",
    views: "192K",
    items: makeItems([
      ["The Haunting", "1963"], ["Poltergeist", "1982"], ["The Others", "2001"], ["Insidious", "2010"],
      ["Sinister", "2012"], ["The Conjuring", "2013"], ["Hereditary", "2018"], ["The Innocents", "1961"],
      ["The Shining", "1980"], ["The Changeling", "1980"],
    ]).reverse(),
  },
  {
    slug: "albums-that-defined-decades",
    title: "10 Albums That Defined Their Decade",
    excerpt: "The records that soundtracked revolutions, heartbreaks, and everything in between.",
    category: "music",
    image: music,
    author: "Jules Okafor",
    date: "Oct 22, 2026",
    readTime: "11 min",
    views: "131K",
    items: makeItems([
      ["Kind of Blue", "1959"], ["Revolver", "1966"], ["Rumours", "1977"], ["Thriller", "1982"],
      ["Nevermind", "1991"], ["OK Computer", "1997"], ["The Miseducation", "1998"], ["Kid A", "2000"],
      ["To Pimp a Butterfly", "2015"], ["Blonde", "2016"],
    ]).reverse(),
  },
  {
    slug: "neo-noir-masterpieces",
    title: "10 Neo-Noir Masterpieces Soaked in Rain and Regret",
    excerpt: "Detectives, double-crosses, and cities that never sleep.",
    category: "crime",
    image: drama,
    author: "Mara Ellison",
    date: "Oct 19, 2026",
    readTime: "10 min",
    views: "88K",
    items: makeItems([
      ["Chinatown", "1974"], ["Taxi Driver", "1976"], ["Blade Runner", "1982"], ["Blue Velvet", "1986"],
      ["L.A. Confidential", "1997"], ["Memento", "2000"], ["Mulholland Drive", "2001"], ["Zodiac", "2007"],
      ["Drive", "2011"], ["Nightcrawler", "2014"],
    ]).reverse(),
  },
  {
    slug: "games-with-best-worlds",
    title: "10 Video Games With Worlds You'll Never Want to Leave",
    excerpt: "Open horizons, hidden lore, and places that feel truly alive.",
    category: "gaming",
    image: gaming,
    author: "Kenji Moreau",
    date: "Oct 15, 2026",
    readTime: "8 min",
    views: "176K",
    items: makeItems([
      ["Hollow Knight", "2017"], ["Bloodborne", "2015"], ["Skyrim", "2011"], ["Outer Wilds", "2019"],
      ["Red Dead Redemption 2", "2018"], ["Elden Ring", "2022"], ["Breath of the Wild", "2017"], ["Disco Elysium", "2019"],
      ["The Witcher 3", "2015"], ["Mass Effect 2", "2010"],
    ]).reverse(),
  },
  {
    slug: "lost-wonders-ancient-world",
    title: "10 Lost Wonders of the Ancient World",
    excerpt: "Marvels that vanished — and the clues they left behind.",
    category: "history",
    image: history,
    author: "Dorian Vale",
    date: "Oct 10, 2026",
    readTime: "14 min",
    views: "301K",
    items: makeItems([
      ["Lighthouse of Alexandria", "280 BC"], ["Colossus of Rhodes", "280 BC"], ["Hanging Gardens", "600 BC"], ["Temple of Artemis", "550 BC"],
      ["Mausoleum at Halicarnassus", "351 BC"], ["Statue of Zeus", "435 BC"], ["Library of Alexandria", "283 BC"], ["Great Pyramid", "2560 BC"],
      ["Babylon's Walls", "575 BC"], ["Domus Aurea", "68 AD"],
    ]).reverse(),
  },
];

export type Poll = { id: string; question: string; category: string; total: number; ends: string; options: { label: string; votes: number }[] };
export const polls: Poll[] = [
  { id: "p1", question: "What's the greatest sci-fi film ever made?", category: "Sci-Fi", total: 18422, ends: "3 days left",
    options: [{ label: "2001: A Space Odyssey", votes: 6120 }, { label: "Blade Runner", votes: 5210 }, { label: "Interstellar", votes: 4380 }, { label: "Arrival", votes: 2712 }] },
  { id: "p2", question: "Scariest horror villain of all time?", category: "Horror", total: 12904, ends: "5 days left",
    options: [{ label: "Jack Torrance", votes: 4011 }, { label: "Pennywise", votes: 3620 }, { label: "The Xenomorph", votes: 3102 }, { label: "Hannibal Lecter", votes: 2171 }] },
  { id: "p3", question: "Best album of the 90s?", category: "Music", total: 9311, ends: "1 week left",
    options: [{ label: "OK Computer", votes: 3402 }, { label: "Nevermind", votes: 2900 }, { label: "The Miseducation", votes: 1980 }, { label: "Illmatic", votes: 1029 }] },
];

export type Post = { slug: string; title: string; excerpt: string; image: string; author: string; date: string; tag: string; readTime: string };
export const posts: Post[] = [
  { slug: "why-we-love-rankings", title: "Why Our Brains Are Addicted to Top 10 Lists", excerpt: "The psychology of order, surprise, and the irresistible urge to scroll to number one.", image: hero, author: "Mara Ellison", date: "Oct 30, 2026", tag: "Essay", readTime: "6 min" },
  { slug: "making-of-noir", title: "Inside the Light: How Noir Cinematographers Paint With Shadow", excerpt: "A look at the techniques that made a genre out of darkness.", image: drama, author: "Dorian Vale", date: "Oct 24, 2026", tag: "Craft", readTime: "8 min" },
  { slug: "vinyl-revival", title: "The Vinyl Revival Isn't Nostalgia — It's Ritual", excerpt: "Why a generation raised on streaming is buying records again.", image: music, author: "Jules Okafor", date: "Oct 18, 2026", tag: "Culture", readTime: "5 min" },
  { slug: "games-as-architecture", title: "Games as Architecture: Designing Worlds That Breathe", excerpt: "Level designers on building places players never want to leave.", image: gaming, author: "Kenji Moreau", date: "Oct 12, 2026", tag: "Interview", readTime: "9 min" },
];

export type Comment = { id: string; name: string; avatar: string; text: string; rating: number; time: string; likes: number; list: string; status: "approved" | "pending" | "flagged" };
export const comments: Comment[] = [
  { id: "c1", name: "Aisha R.", avatar: "AR", text: "Finally a list that puts 2001 where it belongs. Arrival at #4 is criminal though!", rating: 5, time: "2h ago", likes: 142, list: "10 Sci-Fi Films That Rewired Cinema", status: "approved" },
  { id: "c2", name: "Tomás L.", avatar: "TL", text: "The Thing deserves top 3. Practical effects that still hold up 40 years later.", rating: 4, time: "5h ago", likes: 87, list: "10 Sci-Fi Films That Rewired Cinema", status: "approved" },
  { id: "c3", name: "Priya N.", avatar: "PN", text: "Gorgeous write-up. The Solaris section made me rewatch it immediately.", rating: 5, time: "1d ago", likes: 54, list: "10 Sci-Fi Films That Rewired Cinema", status: "pending" },
  { id: "c4", name: "anon_8812", avatar: "A8", text: "Check out my site for free movies!!!", rating: 1, time: "1d ago", likes: 0, list: "10 Haunted House Movies", status: "flagged" },
];

export const visitors = [
  { id: "v1", name: "Aisha Rahman", email: "aisha@example.com", country: "UAE", votes: 48, comments: 12, joined: "Sep 2026", status: "Active" },
  { id: "v2", name: "Tomás López", email: "tomas@example.com", country: "Spain", votes: 31, comments: 7, joined: "Aug 2026", status: "Active" },
  { id: "v3", name: "Priya Nair", email: "priya@example.com", country: "India", votes: 22, comments: 4, joined: "Oct 2026", status: "Active" },
  { id: "v4", name: "anon_8812", email: "spam@bad.io", country: "Unknown", votes: 0, comments: 19, joined: "Oct 2026", status: "Banned" },
  { id: "v5", name: "Lena Fischer", email: "lena@example.com", country: "Germany", votes: 67, comments: 21, joined: "Jun 2026", status: "Active" },
];

export const trafficWeek = [
  { day: "Mon", visits: 12400, votes: 3100 },
  { day: "Tue", visits: 14800, votes: 3900 },
  { day: "Wed", visits: 13200, votes: 3500 },
  { day: "Thu", visits: 17900, votes: 5200 },
  { day: "Fri", visits: 21400, votes: 6400 },
  { day: "Sat", visits: 24800, votes: 7600 },
  { day: "Sun", visits: 22100, votes: 6900 },
];

export const getList = (slug: string) => lists.find((l) => l.slug === slug);
export const getCategory = (slug: string) => categories.find((c) => c.slug === slug);
export const categoryName = (slug: string) => getCategory(slug)?.name ?? slug;
