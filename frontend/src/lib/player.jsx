import { createContext, useContext, useState } from "react";

const PlayerCtx = createContext(null);

export function PlayerProvider({ children }) {
  const [on, setOn] = useState(false);
  const [playing, setPlaying] = useState(false);

  const toggle = () => {
    setOn(true);
    setPlaying((p) => !p);
  };
  const open = () => {
    setOn(true);
    setPlaying(true);
  };
  const close = () => {
    setOn(false);
    setPlaying(false);
  };

  return (
    <PlayerCtx.Provider value={{ on, playing, toggle, open, close }}>
      {children}
    </PlayerCtx.Provider>
  );
}

export const usePlayer = () => useContext(PlayerCtx);
