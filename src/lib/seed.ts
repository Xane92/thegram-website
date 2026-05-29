import { supabase } from "./supabase";

const SEED_STORIES = [
  {
    title: "How a Lagos Startup is Revolutionizing Digital Payments Across West Africa",
    excerpt: "From a small office in Yaba to processing millions of transactions daily, this fintech story is rewriting the rules of African commerce.",
    body: "",
    category: "startups",
    author: "TheGram Editorial",
    published: true,
  },
  {
    title: "The Rise of Afrobeats: From Local Sound to Global Domination",
    excerpt: "How a generation of Nigerian and Ghanaian artists turned a regional genre into the world's most streamed music movement.",
    body: "",
    category: "music",
    author: "TheGram Editorial",
    published: true,
  },
  {
    title: "Inside Nollywood's $6 Billion Creative Economy",
    excerpt: "The numbers behind Africa's largest film industry and the new wave of filmmakers pushing it into global streaming platforms.",
    body: "",
    category: "film",
    author: "TheGram Editorial",
    published: true,
  },
  {
    title: "Africa's Fashion Renaissance: Designers Redefining Global Style",
    excerpt: "From Lagos Fashion Week to Paris runways, African designers are no longer waiting for permission to lead.",
    body: "",
    category: "fashion",
    author: "TheGram Editorial",
    published: true,
  },
  {
    title: "The Policy Shift Unlocking Africa's Tech Boom",
    excerpt: "How governments across the continent are finally creating regulatory frameworks that let startups scale.",
    body: "",
    category: "policies",
    author: "TheGram Editorial",
    published: true,
  },
  {
    title: "From Street Food to Fine Dining: Africa's Culinary Revolution",
    excerpt: "A new generation of chefs is taking indigenous African cuisine to Michelin-star territory.",
    body: "",
    category: "culture",
    author: "TheGram Editorial",
    published: true,
  },
  {
    title: "How African Venture Capital Hit $6 Billion in a Single Year",
    excerpt: "The investors, the deals, and the founders driving the biggest funding surge the continent has ever seen.",
    body: "",
    category: "finance",
    author: "TheGram Editorial",
    published: true,
  },
  {
    title: "AfroNation and the Rise of African Festival Culture",
    excerpt: "How massive live events became the heartbeat of a global cultural movement.",
    body: "",
    category: "events",
    author: "TheGram Editorial",
    published: true,
  },
  {
    title: "The Quiet Revolution: African Women Leading the Startup Wave",
    excerpt: "From fintech to healthtech, women founders are building some of the continent's most impactful companies.",
    body: "",
    category: "startups",
    author: "TheGram Editorial",
    published: true,
  },
];

const SEED_EVENTS = [
  {
    name: "AfroNation Lagos 2026",
    date: "2026-07-15T18:00:00",
    location: "Eko Atlantic, Lagos",
    description: "The biggest Afrobeats festival returns to Lagos with headliners from across the globe.",
    ticket_link: "https://gramtickets.com",
    published: true,
  },
  {
    name: "Lagos Fashion Week 2026",
    date: "2026-08-22T10:00:00",
    location: "Federal Palace Hotel, Lagos",
    description: "Four days of runway shows, exhibitions, and panels celebrating African design.",
    ticket_link: "https://gramtickets.com",
    published: true,
  },
  {
    name: "Nollywood Film Premiere Night",
    date: "2026-09-10T19:00:00",
    location: "Filmhouse IMAX, Lekki",
    description: "An exclusive premiere screening of the most anticipated Nollywood releases of the year.",
    ticket_link: "https://gramtickets.com",
    published: true,
  },
];

export async function seedDatabase(): Promise<{
  stories: number;
  events: number;
  skipped: boolean;
}> {
  const { count } = await supabase
    .from("stories")
    .select("*", { count: "exact", head: true });

  if (count && count > 0) {
    return { stories: 0, events: 0, skipped: true };
  }

  const { data: storiesData, error: storiesErr } = await supabase
    .from("stories")
    .insert(SEED_STORIES)
    .select("id");

  if (storiesErr) throw storiesErr;

  const { data: eventsData, error: eventsErr } = await supabase
    .from("events")
    .insert(SEED_EVENTS)
    .select("id");

  if (eventsErr) throw eventsErr;

  return {
    stories: storiesData?.length ?? 0,
    events: eventsData?.length ?? 0,
    skipped: false,
  };
}
