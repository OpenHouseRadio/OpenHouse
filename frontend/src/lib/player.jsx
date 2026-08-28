import { createContext, useContext, useRef, useState } from "react";

export const STREAM_URL = "https://streams.radio.co/seb9792770/listen";

const PlayerCtx = createContext(null);

export function PlayerProvider({ children }) {
  const audioRef = useRef(null);
  const [on, setOn] = useState(false);
  const [playing, setPlaying] = useState(false);

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
    <PlayerCtx.Provider value={{ on, playing, toggle, open, close }}>
      {children}
    </PlayerCtx.Provider>
  );
}

export const usePlayer = () => useContext(PlayerCtx);
