import { useEffect, useRef, useState } from "react";
import { Play, Pause } from "lucide-react";
import { fmtDay, fmtDate } from "@/lib/player";
import { MaskedLine, FadeIn, Reveal } from "@/components/Reveal";

// Edit these to override what Mixcloud gives us.
const OVERRIDES = {
  // "david-sonny-selectz-001": { title: "Sonny Selectz", host: "Sonny" },
};

const API = "https://api.mixcloud.com/OpenHouseWorld/cloudcasts/";
const CACHE_KEY = "oh_archive_v1";

const slugOf = (key) => key.split("/").filter(Boolean).pop();

function parseShow(name, key) {
  const override = OVERRIDES[slugOf(key)];
  if (override) return { title: override.title, host: override.host || "" };
  const match = name.match(/\s+w\/\s+|\s+with\s+|—/i);
  if (match) {
    const i = match.index;
    return { title: name.slice(0, i).trim(), host: name.slice(i + match[0].length).trim() };
  }
  return { title: name.trim(), host: "" };
}

const fmtDuration = (s) => `${Math.floor(s / 3600)}:${String(Math.floor((s % 3600) / 60)).padStart(2, "0")}`;

export default function Archive() {
  const [items, setItems] = useState([]);
  const [next, setNext] = useState(null);
  const [loading, setLoading] = useState(false);
  const [openKey, setOpenKey] = useState(null);
  const sentinelRef = useRef(null);
  const stateRef = useRef({ next: null, loading: false });
  stateRef.current = { next, loading };

  const loadMore = (url) => {
    if (stateRef.current.loading) return;
    setLoading(true);
    fetch(url)
      .then((r) => (r.ok ? r.json() : Promise.reject(new Error("mixcloud fetch failed"))))
      .then((d) => {
        const incoming = Array.isArray(d.data) ? d.data : [];
        setItems((prev) => {
          const seen = new Set(prev.map((c) => c.key));
          const merged = [...prev, ...incoming.filter((c) => !seen.has(c.key))];
          merged.sort((a, b) => new Date(b.created_time) - new Date(a.created_time));
          const nextUrl = d.paging?.next || null;
          setNext(nextUrl);
          try {
            sessionStorage.setItem(CACHE_KEY, JSON.stringify({ items: merged, next: nextUrl }));
          } catch {}
          return merged;
        });
      })
      .catch(() => {})
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    try {
      const cached = JSON.parse(sessionStorage.getItem(CACHE_KEY) || "null");
      if (cached?.items?.length) {
        setItems(cached.items);
        setNext(cached.next || null);
        return;
      }
    } catch {}
    loadMore(API);
  }, []);

  useEffect(() => {
    const el = sentinelRef.current;
    if (!el) return;
    const obs = new IntersectionObserver((entries) => {
      if (entries[0].isIntersecting && stateRef.current.next && !stateRef.current.loading) {
        loadMore(stateRef.current.next);
      }
    });
    obs.observe(el);
    return () => obs.disconnect();
  }, [items.length]);

  return (
    <div data-testid="archive-page" className="pb-20 md:pb-32">
      <div className="mx-auto max-w-[1600px] px-4 pt-32 sm:px-8 md:pt-44">
        <FadeIn delay={0.1}>
          <p className="mb-6 text-xs uppercase tracking-[0.25em] text-sagedeep">Listen back</p>
        </FadeIn>
        <h1 className="font-display text-6xl font-black uppercase leading-[0.9] tracking-tighter md:text-[9vw]">
          <MaskedLine delay={0.15}>Archive.</MaskedLine>
        </h1>
        <FadeIn delay={0.45}>
          <p className="mt-8 max-w-2xl text-base leading-relaxed text-inksoft md:text-lg">
            Shows that already happened. Still worth your time.
          </p>
        </FadeIn>
      </div>

      <div className="mx-auto mt-14 max-w-[1600px] px-4 sm:px-8 md:mt-20" data-testid="archive-list">
        {items.map((show, i) => {
          const { title, host } = parseShow(show.name, show.key);
          const open = openKey === show.key;
          return (
            <Reveal key={show.key} delay={Math.min(i * 0.05, 0.25)} y={16}>
              <div className="border-t border-ink/15">
                <button
                  onClick={() => setOpenKey(open ? null : show.key)}
                  aria-expanded={open}
                  data-testid={`archive-row-${i}`}
                  className="group block w-full py-6 text-left md:grid md:grid-cols-[120px_1fr_180px_150px_80px] md:items-center md:gap-x-8 md:py-8"
                >
                  <span className="flex items-center gap-4">
                    <span
                      className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-full border transition-colors duration-300 ${
                        open
                          ? "border-sagedeep text-sagedeep"
                          : "border-ink/25 text-ink group-hover:border-sagedeep group-hover:text-sagedeep"
                      }`}
                      data-testid={`archive-play-icon-${i}`}
                    >
                      {open ? (
                        <Pause className="h-3.5 w-3.5 fill-current" />
                      ) : (
                        <Play className="h-3.5 w-3.5 fill-current" />
                      )}
                    </span>
                    <span className="flex items-center gap-2 text-xs uppercase tracking-[0.3em] text-ink/60">
                      {String(i + 1).padStart(2, "0")}
                    </span>
                  </span>
                  <span
                    className={`mt-1 block font-display text-[26px] font-bold leading-tight tracking-tight transition-colors duration-300 group-hover:text-sagedeep md:mt-0 md:text-[32px] ${
                      open ? "text-sagedeep" : ""
                    }`}
                  >
                    {title}
                  </span>
                  <span className="mt-1 block text-base text-ink/70 md:mt-0">{host}</span>
                  <span className="mt-3 block text-xs uppercase tracking-[0.2em] text-inksoft md:mt-0">
                    {fmtDay(show.created_time)} {fmtDate(show.created_time)}
                  </span>
                  <span className="mt-1 block text-xs uppercase tracking-[0.2em] text-inksoft md:mt-0 md:text-right">
                    {fmtDuration(show.audio_length)}
                  </span>
                </button>
                {open && (
                  <div className="pb-6 md:pl-[120px]" data-testid="archive-player">
                    <div className="flex items-start gap-5">
                      {(show.pictures?.extra_large || show.pictures?.large) && (
                        <img
                          src={show.pictures.extra_large || show.pictures.large}
                          alt={title}
                          className="w-20 shrink-0 object-cover md:w-28"
                          data-testid={`archive-artwork-${i}`}
                        />
                      )}
                      <div className="flex-1">
                        <iframe
                          src={`https://www.mixcloud.com/widget/iframe/?hide_cover=1&light=1&feed=${encodeURIComponent(show.key)}`}
                          width="100%"
                          height="60"
                          title={`Play ${title}`}
                          allow="autoplay"
                          className="border-0"
                        />
                        <a
                          href={show.url}
                          target="_blank"
                          rel="noopener noreferrer"
                          data-testid={`archive-mixcloud-link-${i}`}
                          className="link-underline mt-3 inline-block text-[10px] uppercase tracking-[0.25em] text-inksoft transition-colors duration-300 hover:text-ink"
                        >
                          Trouble playing? Open in Mixcloud
                        </a>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </Reveal>
          );
        })}
        <div className="border-t border-ink/15" />

        {loading && (
          <p className="py-8 text-center text-xs uppercase tracking-[0.25em] text-inksoft" data-testid="archive-loading">
            Digging through the tapes…
          </p>
        )}
        {!loading && items.length === 0 && (
          <p className="py-16 text-center text-sm uppercase tracking-[0.2em] text-inksoft" data-testid="archive-empty">
            Nothing on the shelf yet — first shows are being recorded.
          </p>
        )}
        <div ref={sentinelRef} className="h-1" aria-hidden="true" />
      </div>
    </div>
  );
}
