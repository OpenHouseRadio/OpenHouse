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

const PlayerCtx = createContext(null);

export function PlayerProvider({ children }) {
  const audioRef = useRef(null);
  const [on, setOn] = useState(false);
  const [playing, setPlaying] = useState(false);
  const [now, setNow] = useState(null);

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
    <PlayerCtx.Provider value={{ on, playing, toggle, open, close, now }}>
      {children}
    </PlayerCtx.Provider>
  );
}

export const usePlayer = () => useContext(PlayerCtx);
