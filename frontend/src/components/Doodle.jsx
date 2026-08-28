export function RadioDoodle({ className = "" }) {
  const cream = "#FDF8EF";
  const clay = "#C67656";
  return (
    <svg
      viewBox="0 0 400 320"
      fill="none"
      className={className}
      role="img"
      aria-label="Hand-drawn radio"
    >
      <path
        d="M62 118 C60 112 64 106 71 106 L330 104 C338 104 343 109 343 117 L341 252 C341 260 336 265 328 265 L72 267 C64 267 59 262 59 254 Z"
        stroke={cream}
        strokeWidth="6"
        strokeLinecap="round"
      />
      <circle cx="136" cy="186" r="46" stroke={cream} strokeWidth="6" strokeLinecap="round" />
      <circle cx="138" cy="188" r="17" stroke={cream} strokeWidth="5" strokeLinecap="round" />
      <rect x="212" y="142" width="104" height="20" rx="10" stroke={cream} strokeWidth="5" />
      <path d="M226 152 L226 152 M252 152 L252 152 M278 152 L278 152" stroke={cream} strokeWidth="5" strokeLinecap="round" />
      <circle cx="230" cy="206" r="10" stroke={cream} strokeWidth="5" />
      <circle cx="266" cy="206" r="10" stroke={cream} strokeWidth="5" />
      <path d="M300 196 C304 200 304 208 300 212" stroke={cream} strokeWidth="5" strokeLinecap="round" />
      <path d="M100 106 L152 34" stroke={cream} strokeWidth="6" strokeLinecap="round" />
      <circle cx="156" cy="28" r="7" stroke={cream} strokeWidth="5" />
      <path d="M88 267 L84 288 M314 265 L318 286" stroke={cream} strokeWidth="6" strokeLinecap="round" />
      <path d="M236 62 C252 50 274 50 290 62" stroke={clay} strokeWidth="6" strokeLinecap="round" />
      <path d="M222 40 C248 20 280 20 304 40" stroke={clay} strokeWidth="6" strokeLinecap="round" />
      <path d="M210 18 C244 -8 286 -8 318 18" stroke={clay} strokeWidth="6" strokeLinecap="round" />
    </svg>
  );
}

export function DoorDoodle({ className = "" }) {
  const cream = "#FDF8EF";
  const clay = "#C67656";
  return (
    <svg
      viewBox="0 0 320 300"
      fill="none"
      className={className}
      role="img"
      aria-label="Hand-drawn open door"
    >
      <path
        d="M96 270 L94 88 C94 82 98 78 104 78 L198 76 C204 76 208 80 208 86 L208 268"
        stroke={cream}
        strokeWidth="6"
        strokeLinecap="round"
      />
      <path
        d="M208 88 L262 64 C268 61 274 65 274 72 L276 240 C276 246 272 250 266 252 L208 268"
        stroke={cream}
        strokeWidth="6"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <circle cx="248" cy="164" r="6" fill={cream} />
      <path d="M62 272 L294 268" stroke={cream} strokeWidth="6" strokeLinecap="round" />
      <path d="M112 268 A40 40 0 0 1 192 268 Z" fill={clay} />
      <path d="M46 60 C60 48 80 48 94 58" stroke={clay} strokeWidth="6" strokeLinecap="round" />
      <path d="M34 36 C58 16 92 16 112 34" stroke={clay} strokeWidth="6" strokeLinecap="round" />
    </svg>
  );
}
