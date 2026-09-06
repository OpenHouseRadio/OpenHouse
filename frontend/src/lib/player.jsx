import { createContext, useContext, useEffect, useRef, useState } from "react";

export const STREAM_URL = "https://streams.radio.co/seb9792770/listen";
const RADIO_API = "https://public.radio.co/api/v2/seb9792770";

async function getJson(path, signal) {
  const res = await fetch(`${RADIO_API}${path}?_=${Date.now()}`, {
    signal,
    headers: { Accept: "application/json" },
    cache: "no-store",
  });
  if (!res.ok) throw new Error(`HTTP ${res.status}`);
  return res.json();
}

async function fetchNowPlaying(signal) {
  const [track, status, source] = await Promise.all([
    getJson("/track/current", signal).catch(() => null),
    getJson("/status", signal).catch(() => null),
    getJson("/source", signal).catch(() => null),
  ]);
  const t = track?.data ?? {};
  return {
    artist: t.track_artist?.trim() || "",
    title: t.track_title?.trim() || "",
    artwork: t.artwork_urls?.large || t.artwork_urls?.standard || "",
    onAir: status?.data?.status === "onair",
    dj: source?.data?.type === "dj" ? source.data.source?.name?.trim() || "" : "",
  };
}

export const fmtDay = (iso) => new Date(iso).toLocaleDateString("en-GB", { weekday: "short" }).toUpperCase();
export const fmtDate = (iso) => new Date(iso).toLocaleDateString("en-GB", { day: "2-digit", month: "short" }).toUpperCase();
export const fmtTime = (iso) => new Date(iso).toLocaleTimeString("en-GB", { hour: "2-digit", minute: "2-digit" });
export const isLiveEvent = (ev) => {
  const n = Date.now();
  return n >= new Date(ev.start).getTime() && n < new Date(ev.end).getTime();
};
export const upcomingEvents = (schedule) =>
  (schedule || []).filter((e) => new Date(e.end).getTime() > Date.now());
export const eventTitle = (ev) => {
  const raw = (ev?.playlist?.title || ev?.playlist?.name || "").trim();
  return !raw || raw.toLowerCase() === "default" ? "Open House Radio" : raw;
};
export const eventParts = (ev) => {
  const raw = (ev?.title || ev?.playlist?.title || ev?.playlist?.name || "").trim();
  const isDefault = !raw || raw.toLowerCase() === "default";
  let title = isDefault ? "Open House Radio" : raw;
  let host = ev?.dj?.name || ev?.dj_name || ev?.presenter || null;
  const artist = ev?.playlist?.artist?.trim();
  if (!host && artist && !["default", "open house"].includes(artist.toLowerCase()) && artist !== raw) {
    host = artist;
  }
  if (!host && raw.includes("—")) {
    const parts = raw.split("—").map((s) => s.trim()).filter(Boolean);
    if (parts.length > 1) {
      title = parts[0];
      host = parts.slice(1).join(" — ");
    }
  }
  return { title, host };
};

const PlayerCtx = createContext(null);

export function PlayerProvider({ children }) {
  const audioRef = useRef(null);
  const [on, setOn] = useState(false);
  const [playing, setPlaying] = useState(false);
  const [now, setNow] = useState(null);
  const [schedule, setSchedule] = useState([]);

  useEffect(() => {
    let alive = true;
    const load = () =>
      fetch(`https://public.radio.co/stations/seb9792770/embed/schedule?_=${Date.now()}`, { cache: "no-store" })
        .then((r) => (r.ok ? r.json() : Promise.reject(new Error("schedule fetch failed"))))
        .then((d) => alive && setSchedule(Array.isArray(d.data) ? d.data : []))
        .catch(() => alive && setSchedule([]));
    load();
    const t = setInterval(load, 300000);
    return () => {
      alive = false;
      clearInterval(t);
    };
  }, []);

  useEffect(() => {
    const controller = new AbortController();
    let timer;
    const load = async () => {
      try {
        setNow(await fetchNowPlaying(controller.signal));
      } catch {
      } finally {
        if (!controller.signal.aborted) timer = setTimeout(load, 30000);
      }
    };
    load();
    return () => {
      controller.abort();
      clearTimeout(timer);
    };
  }, []);

  const getAudio = () => {
    if (!audioRef.current) {
      audioRef.current = new Audio(STREAM_URL);
      audioRef.current.preload = "none";
    }
    return audioRef.current;
  };

  const open = () => {
    setOn(true);
    getAudio().play().catch(() => {});
    setPlaying(true);
  };

  const toggle = () => {
    setOn(true);
    const audio = getAudio();
    if (playing) {
      audio.pause();
      setPlaying(false);
    } else {
      audio.play().catch(() => {});
      setPlaying(true);
    }
  };

  const close = () => {
    getAudio().pause();
    setPlaying(false);
    setOn(false);
  };

  return (
    <PlayerCtx.Provider value={{ on, playing, toggle, open, close, now, schedule }}>
      {children}
    </PlayerCtx.Provider>
  );
}

export const usePlayer = () => useContext(PlayerCtx);
