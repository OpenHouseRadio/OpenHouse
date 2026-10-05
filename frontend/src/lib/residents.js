// The residents roster. To add/remove/edit a resident, change this list.
// `match` lists lowercase strings used to find each resident's past shows
// in the Mixcloud archive (matched against cloudcast titles).
export const RESIDENTS = [
  {
    id: "david",
    name: "David",
    show: "Weekly Open House Show",
    role: "Station founder",
    cadence: "Every week",
    bio: "The one who opened the door. David started Open House and still turns up every week with a bag that swings from jazz to drum and bass – sometimes in the same hour.",
    portrait: "cap",
    match: ["david", "weekly openhouse", "weekly open house"],
  },
  {
    id: "painters-podcast",
    name: "Jake & Felix",
    show: "Painters Podcast",
    role: "",
    cadence: "Every week",
    bio: "Two painters, one microphone. Jake and Felix talk shop every week – the work, the references, the long studio days and whatever's been playing while the paint dries.",
    portrait: "duo-specs",
    match: ["painters"],
  },
  {
    id: "mc-sessions",
    name: "Maddie & Chiara",
    show: "MC Sessions",
    role: "",
    cadence: "Every other Thursday",
    bio: "Talking Amsterdam and whatever they've been listening to, every other Thursday. No agenda, very good taste.",
    portrait: "duo-bob",
    match: ["mc sessions", "maddie", "chiara"],
  },
];

const API = "https://api.mixcloud.com/OpenHouseWorld/cloudcasts/";
const CACHE_KEY = "oh_residents_v1";

// First page of cloudcasts (newest 20) is plenty for resident profiles.
export async function fetchCloudcasts() {
  try {
    const cached = JSON.parse(sessionStorage.getItem(CACHE_KEY) || "null");
    if (cached?.items) return cached.items;
  } catch {}
  try {
    const r = await fetch(API);
    if (!r.ok) return [];
    const d = await r.json();
    const items = Array.isArray(d.data) ? d.data : [];
    try {
      sessionStorage.setItem(CACHE_KEY, JSON.stringify({ items }));
    } catch {}
    return items;
  } catch {
    return [];
  }
}

export function showsForResident(resident, cloudcasts) {
  return cloudcasts
    .filter((c) => {
      const hay = (c.name || "").toLowerCase();
      return resident.match.some((m) => hay.includes(m));
    })
    .sort((a, b) => new Date(b.created_time) - new Date(a.created_time));
}
