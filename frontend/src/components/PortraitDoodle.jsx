const INK = "#1C1C1A";
const CLAY = "#C67656";

function Face({ cx, cy, r, children }) {
  return (
    <>
      <path
        d={`M${cx - r} ${cy} C${cx - r - 2} ${cy - r * 0.9} ${cx - r * 0.55} ${cy - r} ${cx} ${cy - r} C${cx + r * 0.6} ${cy - r} ${cx + r + 2} ${cy - r * 0.85} ${cx + r} ${cy} C${cx + r} ${cy + r * 0.75} ${cx + r * 0.5} ${cy + r} ${cx} ${cy + r} C${cx - r * 0.55} ${cy + r} ${cx - r} ${cy + r * 0.7} ${cx - r} ${cy} Z`}
        stroke={INK}
        strokeWidth="5"
        strokeLinecap="round"
        fill="none"
      />
      {children}
    </>
  );
}

const Eyes = ({ cx, cy, gap = 16 }) => (
  <path
    d={`M${cx - gap - 4} ${cy} L${cx - gap + 4} ${cy} M${cx + gap - 4} ${cy} L${cx + gap + 4} ${cy}`}
    stroke={INK}
    strokeWidth="5"
    strokeLinecap="round"
  />
);

const Smile = ({ cx, cy, w = 18 }) => (
  <path
    d={`M${cx - w} ${cy} C${cx - w / 2} ${cy + 9} ${cx + w / 2} ${cy + 9} ${cx + w} ${cy}`}
    stroke={INK}
    strokeWidth="5"
    strokeLinecap="round"
    fill="none"
  />
);

// David – single face, clay beanie
function CapPortrait() {
  return (
    <>
      <Face cx={100} cy={118} r={56}>
        <Eyes cx={100} cy={118} />
        <Smile cx={100} cy={146} />
      </Face>
      <path
        d="M50 96 C54 52 78 34 102 34 C130 34 150 56 152 96"
        stroke={CLAY}
        strokeWidth="6"
        strokeLinecap="round"
        fill="none"
      />
      <path d="M48 98 L154 96" stroke={CLAY} strokeWidth="6" strokeLinecap="round" />
      <circle cx="102" cy="30" r="6" stroke={CLAY} strokeWidth="5" fill="none" />
    </>
  );
}

// Jake & Felix – two faces, clay glasses on one
function DuoSpecsPortrait() {
  return (
    <>
      <Face cx={128} cy={112} r={42}>
        <Eyes cx={128} cy={112} gap={13} />
        <Smile cx={128} cy={136} w={14} />
      </Face>
      <path
        d="M92 88 C100 62 118 54 134 56 M112 66 C124 52 144 52 156 64"
        stroke={INK}
        strokeWidth="5"
        strokeLinecap="round"
        fill="none"
      />
      <Face cx={70} cy={108} r={40}>
        <Smile cx={70} cy={132} w={13} />
      </Face>
      <circle cx={58} cy={104} r={10} stroke={CLAY} strokeWidth="5" fill="none" />
      <circle cx={84} cy={104} r={10} stroke={CLAY} strokeWidth="5" fill="none" />
      <path d="M68 104 L74 104" stroke={CLAY} strokeWidth="5" strokeLinecap="round" />
    </>
  );
}

// Maddie & Chiara – two faces, bob hair + clay bun and earrings
function DuoBobPortrait() {
  return (
    <>
      <Face cx={128} cy={114} r={42}>
        <Eyes cx={128} cy={114} gap={13} />
        <Smile cx={128} cy={138} w={14} />
      </Face>
      <path
        d="M90 108 C86 66 106 48 130 48 C156 48 172 70 168 108"
        stroke={INK}
        strokeWidth="5"
        strokeLinecap="round"
        fill="none"
      />
      <circle cx="130" cy="42" r="10" stroke={CLAY} strokeWidth="5" fill="none" />
      <Face cx={68} cy={110} r={40}>
        <Eyes cx={68} cy={108} gap={12} />
        <Smile cx={68} cy={134} w={13} />
      </Face>
      <path
        d="M30 104 C28 66 46 46 70 46 C94 46 110 68 108 104 L104 140 M34 140 L32 106"
        stroke={INK}
        strokeWidth="5"
        strokeLinecap="round"
        fill="none"
      />
      <circle cx="36" cy="146" r="5" stroke={CLAY} strokeWidth="4" fill="none" />
      <circle cx="104" cy="146" r="5" stroke={CLAY} strokeWidth="4" fill="none" />
    </>
  );
}

const VARIANTS = {
  cap: CapPortrait,
  "duo-specs": DuoSpecsPortrait,
  "duo-bob": DuoBobPortrait,
};

export default function PortraitDoodle({ variant = "cap", className = "", label = "Hand-drawn resident portrait" }) {
  const Inner = VARIANTS[variant] || CapPortrait;
  return (
    <svg viewBox="0 0 200 200" fill="none" className={className} role="img" aria-label={label}>
      <Inner />
    </svg>
  );
}
