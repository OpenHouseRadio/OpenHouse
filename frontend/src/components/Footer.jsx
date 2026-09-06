import { ArrowUpRight } from "lucide-react";
import { INSTAGRAM_URL, CONTACT_EMAIL, DISCORD_URL, WHATSAPP_URL } from "./Nav";

export default function Footer() {
  return (
    <footer data-testid="footer" className="border-t border-line bg-surface">
      <div className="mx-auto max-w-[1600px] px-4 py-16 sm:px-8 md:py-24">
        <div className="flex flex-col gap-12 md:flex-row md:items-end md:justify-between">
          <div>
            <img
              src="/open-house-wordmark.png"
              alt="Open House"
              className="h-16 w-auto md:h-20"
            />
            <p className="mt-4 max-w-sm text-sm leading-relaxed text-inksoft">
              Independent online radio — currently taking shape. Open House is open.
            </p>
          </div>

          <div>
            <p className="text-xs uppercase tracking-[0.2em] text-inksoft">Say hello</p>
            <ul className="mt-4 space-y-3 text-sm">
              <li>
                <a
                  href={`mailto:${CONTACT_EMAIL}`}
                  data-testid="footer-email"
                  className="group flex items-center gap-1 text-ink transition-colors duration-300 hover:text-sagedeep"
                >
                  {CONTACT_EMAIL}
                  <ArrowUpRight className="h-3.5 w-3.5 transition-transform duration-300 group-hover:-translate-y-0.5 group-hover:translate-x-0.5" />
                </a>
              </li>
              <li>
                <a
                  href={INSTAGRAM_URL}
                  target="_blank"
                  rel="noopener noreferrer"
                  data-testid="footer-instagram"
                  className="group flex items-center gap-1 text-ink transition-colors duration-300 hover:text-sagedeep"
                >
                  Instagram — @openhouse_world
                  <ArrowUpRight className="h-3.5 w-3.5 transition-transform duration-300 group-hover:-translate-y-0.5 group-hover:translate-x-0.5" />
                </a>
              </li>
              <li>
                <a
                  href={DISCORD_URL}
                  target="_blank"
                  rel="noopener noreferrer"
                  data-testid="footer-discord"
                  className="group flex items-center gap-1 text-ink transition-colors duration-300 hover:text-sagedeep"
                >
                  Discord — come chat
                  <ArrowUpRight className="h-3.5 w-3.5 transition-transform duration-300 group-hover:-translate-y-0.5 group-hover:translate-x-0.5" />
                </a>
              </li>
              <li>
                <a
                  href={WHATSAPP_URL}
                  target="_blank"
                  rel="noopener noreferrer"
                  data-testid="footer-whatsapp"
                  className="group flex items-center gap-1 text-ink transition-colors duration-300 hover:text-sagedeep"
                >
                  WhatsApp — the group chat
                  <ArrowUpRight className="h-3.5 w-3.5 transition-transform duration-300 group-hover:-translate-y-0.5 group-hover:translate-x-0.5" />
                </a>
              </li>
            </ul>
          </div>
        </div>

        <div className="mt-16 flex flex-col gap-2 border-t border-line pt-6 text-xs uppercase tracking-[0.15em] text-inksoft md:flex-row md:items-center md:justify-between">
          <p>© 2026 Open House. All frequencies reserved.</p>
          <p className="font-serifaccent normal-case italic tracking-normal">"The door is always open."</p>
        </div>
      </div>
    </footer>
  );
}
