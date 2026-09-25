import type { ReactNode } from "react";

export function ClassArt({ grade }: { grade: number }) {
  const scene = scenes[grade] ?? scenes[1];
  return (
    <svg className="class-art" viewBox="0 0 200 200" role="img" aria-label={scene.label}>
      <rect width="200" height="200" fill={scene.sky} />
      {scene.draw}
    </svg>
  );
}

const scenes: Record<number, { label: string; sky: string; draw: ReactNode }> = {
  1: {
    label: "A push, a shadow, and a warm sun for Class 1",
    sky: "#d9ecff",
    draw: (
      <>
        <circle cx="156" cy="42" r="18" fill="#ffe08a" />
        <rect x="28" y="118" width="52" height="36" rx="6" fill="#ffb199" stroke="#2a3138" strokeWidth="3" />
        <path d="M18 136h22" stroke="#2f6bff" strokeWidth="4" />
        <circle cx="148" cy="150" r="22" fill="#2a3138" opacity="0.18" />
        <circle cx="132" cy="108" r="16" fill="#f6d3b4" stroke="#2a3138" strokeWidth="3" />
      </>
    ),
  },
  2: {
    label: "A floating boat and a lamp for Class 2",
    sky: "#d7f3fb",
    draw: (
      <>
        <path d="M20 130 Q100 108 180 130 L160 150 Q100 138 40 150 Z" fill="#7eb6d6" />
        <path d="M70 128 L100 78 L130 128 Z" fill="#efe6d2" stroke="#2a3138" strokeWidth="3" />
        <rect x="148" y="48" width="18" height="28" rx="4" fill="#ffe08a" stroke="#2a3138" strokeWidth="3" />
        <path d="M157 76 v18" stroke="#2a3138" strokeWidth="3" />
      </>
    ),
  },
  3: {
    label: "A curved path and a drum for Class 3",
    sky: "#e7f3ea",
    draw: (
      <>
        <path d="M24 150 Q70 70 150 120" fill="none" stroke="#3d6f9a" strokeWidth="6" strokeLinecap="round" />
        <ellipse cx="150" cy="78" rx="28" ry="12" fill="#e07a5f" stroke="#2a3138" strokeWidth="3" />
        <rect x="122" y="78" width="56" height="28" fill="#ffd0c4" stroke="#2a3138" strokeWidth="3" />
        <ellipse cx="150" cy="106" rx="28" ry="10" fill="#c45b48" stroke="#2a3138" strokeWidth="3" />
      </>
    ),
  },
  4: {
    label: "A rough path and a straight light beam for Class 4",
    sky: "#fff1d6",
    draw: (
      <>
        <path d="M20 150 h160" stroke="#8d6b4a" strokeWidth="8" strokeLinecap="round" />
        <path d="M28 150 l8 -10 M52 150 l8 -10 M80 150 l8 -10 M110 150 l8 -10" stroke="#8d6b4a" strokeWidth="3" />
        <circle cx="46" cy="58" r="16" fill="#ffe08a" />
        <path d="M64 64 L150 120" stroke="#e7a61a" strokeWidth="4" />
      </>
    ),
  },
  5: {
    label: "A seesaw and a mirror for Class 5",
    sky: "#e7eefc",
    draw: (
      <>
        <polygon points="100,150 88,168 112,168" fill="#8d6b4a" />
        <rect x="36" y="132" width="128" height="12" rx="4" fill="#6f8f71" stroke="#2a3138" strokeWidth="3" transform="rotate(-8 100 138)" />
        <rect x="150" y="48" width="28" height="70" rx="4" fill="#d7e6f5" stroke="#2a3138" strokeWidth="3" />
        <circle cx="52" cy="112" r="12" fill="#f6d3b4" stroke="#2a3138" strokeWidth="3" />
      </>
    ),
  },
  6: {
    label: "A ruler, a magnet, and a bulb for Class 6",
    sky: "#e4eef8",
    draw: (
      <>
        <rect x="28" y="48" width="120" height="18" rx="4" fill="#efe6d2" stroke="#2a3138" strokeWidth="3" />
        <path d="M36 48 v10 M56 48 v6 M76 48 v10 M96 48 v6 M116 48 v10" stroke="#2a3138" strokeWidth="2" />
        <rect x="36" y="110" width="36" height="48" rx="6" fill="#e07a5f" stroke="#2a3138" strokeWidth="3" />
        <rect x="78" y="110" width="36" height="48" rx="6" fill="#3d6f9a" stroke="#2a3138" strokeWidth="3" />
        <circle cx="156" cy="86" r="22" fill="#ffe08a" stroke="#2a3138" strokeWidth="3" />
      </>
    ),
  },
  7: {
    label: "A speed mark, heat, and a mirror ray for Class 7",
    sky: "#ffe8df",
    draw: (
      <>
        <circle cx="58" cy="70" r="28" fill="#fff" stroke="#2a3138" strokeWidth="3" />
        <path d="M58 70 L58 52 M58 70 L72 78" stroke="#2a3138" strokeWidth="3" strokeLinecap="round" />
        <path d="M120 48 q16 20 0 36 q-16 16 0 28" fill="none" stroke="#e07a5f" strokeWidth="4" />
        <path d="M40 150 L100 110 L160 150" fill="none" stroke="#3d6f9a" strokeWidth="3" />
      </>
    ),
  },
  8: {
    label: "Water pressure, sound, and planets for Class 8",
    sky: "#d7f3fb",
    draw: (
      <>
        <path d="M30 90 h70 v60 h-70 z" fill="#9ec9f5" stroke="#2a3138" strokeWidth="3" />
        <path d="M36 130 h58 M36 112 h58" stroke="#2a3138" strokeWidth="2" opacity="0.45" />
        <circle cx="150" cy="64" r="22" fill="#ffe08a" stroke="#2a3138" strokeWidth="3" />
        <circle cx="168" cy="108" r="10" fill="#c9c2b6" stroke="#2a3138" strokeWidth="2" />
        <path d="M48 160 q20 -16 40 0 t40 0" fill="none" stroke="#6d5ef5" strokeWidth="3" />
      </>
    ),
  },
  9: {
    label: "A moving car and a sound wave for Class 9",
    sky: "#e7eefc",
    draw: (
      <>
        <rect x="36" y="96" width="92" height="32" rx="8" fill="#3d6f9a" stroke="#2a3138" strokeWidth="3" />
        <circle cx="58" cy="132" r="12" fill="#2a3138" />
        <circle cx="108" cy="132" r="12" fill="#2a3138" />
        <path d="M140 70 q18 16 0 32 t0 32" fill="none" stroke="#e07a5f" strokeWidth="4" />
        <path d="M24 160 h150" stroke="#8d6b4a" strokeWidth="4" />
      </>
    ),
  },
  10: {
    label: "A lens, an eye, and a circuit for Class 10",
    sky: "#f8efe2",
    draw: (
      <>
        <path d="M40 100 Q70 60 100 100 Q70 140 40 100" fill="#d7e6f5" stroke="#2a3138" strokeWidth="3" />
        <path d="M100 100 Q130 60 160 100 Q130 140 100 100" fill="#d7e6f5" stroke="#2a3138" strokeWidth="3" />
        <circle cx="100" cy="100" r="8" fill="#2a3138" />
        <rect x="48" y="150" width="28" height="16" rx="3" fill="#e07a5f" stroke="#2a3138" strokeWidth="2" />
        <path d="M76 158 h30" stroke="#2a3138" strokeWidth="2" />
        <circle cx="118" cy="158" r="10" fill="#ffe08a" stroke="#2a3138" strokeWidth="2" />
      </>
    ),
  },
  11: {
    label: "A pendulum and a spring for Class 11",
    sky: "#ece7f6",
    draw: (
      <>
        <path d="M40 36 h80" stroke="#2a3138" strokeWidth="4" />
        <path d="M90 36 L130 110" stroke="#2a3138" strokeWidth="3" />
        <circle cx="136" cy="122" r="14" fill="#6d5ef5" stroke="#2a3138" strokeWidth="3" />
        <path d="M48 70 v12 q0 10 10 10 t10 -10 v-8 q0 -10 10 -10 t10 10 v14" fill="none" stroke="#3d6f9a" strokeWidth="3" />
      </>
    ),
  },
  12: {
    label: "An atom and a light wave for Class 12",
    sky: "#e7eef8",
    draw: (
      <>
        <ellipse cx="90" cy="100" rx="58" ry="22" fill="none" stroke="#3d6f9a" strokeWidth="3" />
        <ellipse cx="90" cy="100" rx="22" ry="58" fill="none" stroke="#e07a5f" strokeWidth="3" />
        <circle cx="90" cy="100" r="10" fill="#ffe08a" stroke="#2a3138" strokeWidth="3" />
        <path d="M24 160 q20 -18 40 0 t40 0 t40 0" fill="none" stroke="#6d5ef5" strokeWidth="3" />
      </>
    ),
  },
};
