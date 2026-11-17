import { useEffect, useRef, useState } from "react";
import { MessageCircle, X } from "lucide-react";
import { usePlayer } from "../lib/player";

const CHATANGO_SRC = "https://st.chatango.com/js/gz/emb.js";
// Chatango embed config for openhouseworld, kept exactly as provided.
const CHATANGO_CONFIG =
  '{"handle":"openhouseworld","arch":"js","styles":{"a":"CC0000","b":100,"c":"FFFFFF","d":"FFFFFF","k":"CC0000","l":"CC0000","m":"CC0000","n":"FFFFFF","p":"10","q":"CC0000","r":100,"fwtickm":1}}';

export default function Chatroom() {
  const { on } = usePlayer();
  const [open, setOpen] = useState(false);
  const [everOpened, setEverOpened] = useState(false);
  const boxRef = useRef(null);

  useEffect(() => {
    if (!everOpened || window.__chatangoLoaded || !boxRef.current) return;
    window.__chatangoLoaded = true;
    const s = document.createElement("script");
    s.id = "cid0020000455928172058";
    s.setAttribute("data-cfasync", "false");
    s.async = true;
    s.src = CHATANGO_SRC;
    s.style.width = "250px";
    s.style.height = "350px";
    s.text = CHATANGO_CONFIG;
    boxRef.current.appendChild(s);
  }, [everOpened]);

  const openChat = () => {
    setEverOpened(true);
    setOpen(true);
  };

  // Bottom-left corner, lifted clear of the player bar whenever it is open.
  const bottom = on ? "bottom-[104px]" : "bottom-4";

  return (
    <div className={`fixed left-4 z-[60] transition-[bottom] duration-300 ${bottom}`} data-testid="chatroom">
      {everOpened && (
        <div
          className={`${open ? "" : "hidden"} mb-2 w-[250px] border border-line bg-paper`}
          data-testid="chatroom-panel"
        >
          <div className="flex items-center justify-between bg-ink px-3 py-2.5 text-paper">
            <p className="flex items-center gap-2 text-[10px] uppercase tracking-[0.25em]">
              <MessageCircle className="h-3.5 w-3.5" strokeWidth={1.5} />
              Chatroom
            </p>
            <button
              onClick={() => setOpen(false)}
              aria-label="Close chat"
              data-testid="chatroom-close-btn"
              className="p-1 text-paper/70 transition-colors duration-300 hover:text-paper"
            >
              <X className="h-4 w-4" strokeWidth={1.5} />
            </button>
          </div>
          <div ref={boxRef} className="h-[350px] w-[250px] overflow-hidden" data-testid="chatroom-embed" />
        </div>
      )}
      {!open && (
        <button
          onClick={openChat}
          data-testid="chatroom-open-btn"
          aria-label="Open chatroom"
          className="flex items-center gap-2 bg-ink px-4 py-3 text-xs uppercase tracking-[0.15em] text-paper transition-colors duration-300 hover:bg-sagedeep hover:text-ink"
        >
          <MessageCircle className="h-3.5 w-3.5" strokeWidth={1.5} />
          Chat
        </button>
      )}
    </div>
  );
}
