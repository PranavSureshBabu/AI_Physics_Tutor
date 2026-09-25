export function SchoolArt() {
  return (
    <div className="school-art" aria-hidden="true">
      <svg className="school-scene" viewBox="0 0 640 420">
        <defs>
          <linearGradient id="sky" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#9ec9f5" />
            <stop offset="100%" stopColor="#f7d7c4" />
          </linearGradient>
        </defs>
        <rect width="640" height="420" rx="28" fill="url(#sky)" />
        <circle cx="520" cy="78" r="36" fill="#ffe08a" />
        <ellipse cx="150" cy="360" rx="210" ry="28" fill="#8fbf7a" opacity="0.55" />
        <ellipse cx="470" cy="368" rx="150" ry="22" fill="#7eb56a" opacity="0.4" />

        <g transform="translate(70 250)">
          <rect x="18" y="40" width="8" height="70" fill="#8d6b4a" />
          <circle cx="22" cy="36" r="28" fill="#f4a7b8" />
          <circle cx="8" cy="28" r="8" fill="#fff" opacity="0.85" />
          <circle cx="30" cy="22" r="6" fill="#fff" opacity="0.7" />
        </g>

        <g>
          <rect x="168" y="150" width="250" height="170" rx="8" fill="#f4efe6" stroke="#2a3138" strokeWidth="3" />
          <polygon points="150,158 293,78 436,158" fill="#e07a5f" stroke="#2a3138" strokeWidth="3" />
          <rect x="196" y="178" width="54" height="42" rx="4" fill="#cfe6fb" stroke="#2a3138" strokeWidth="3" />
          <rect x="336" y="178" width="54" height="42" rx="4" fill="#cfe6fb" stroke="#2a3138" strokeWidth="3" />
          <path d="M223 178 v42 M363 178 v42 M196 199 h54 M336 199 h54" stroke="#2a3138" strokeWidth="2" />
          <rect x="268" y="230" width="48" height="90" rx="4" fill="#6f8f71" stroke="#2a3138" strokeWidth="3" />
          <circle cx="306" cy="276" r="3" fill="#ffe08a" />
          <rect x="188" y="118" width="16" height="40" fill="#d9d3c7" stroke="#2a3138" strokeWidth="2" />
          <polygon points="184,118 196,104 208,118" fill="#e07a5f" />
        </g>

        <g transform="translate(448 176)">
          <path d="M18 118 Q8 150 16 188 L36 188 L40 150 Z" fill="#3d6f9a" />
          <path d="M78 118 Q92 150 84 188 L64 188 L60 150 Z" fill="#3d6f9a" />
          <path d="M22 96 Q55 78 88 100 L82 150 Q55 162 28 148 Z" fill="#4f86b5" stroke="#2a3138" strokeWidth="3" />
          <rect x="34" y="112" width="42" height="8" rx="2" fill="#efe6d2" />
          <circle cx="55" cy="58" r="30" fill="#f6d3b4" stroke="#2a3138" strokeWidth="3" />
          <path d="M28 52 C30 24 80 22 84 54 C74 36 36 34 28 52" fill="#2c2428" />
          <path d="M26 58 C18 78 22 96 34 92" fill="#2c2428" />
          <path d="M86 56 C96 74 92 94 78 90" fill="#2c2428" />
          <ellipse cx="44" cy="62" rx="4" ry="5" fill="#2a3138" />
          <ellipse cx="68" cy="62" rx="4" ry="5" fill="#2a3138" />
          <path d="M48 74 Q55 80 64 74" fill="none" stroke="#c47b74" strokeWidth="2" strokeLinecap="round" />
          <rect x="6" y="128" width="22" height="16" rx="3" fill="#e07a5f" stroke="#2a3138" strokeWidth="2" />
          <path d="M8 128 Q17 118 28 128" fill="none" stroke="#2a3138" strokeWidth="2" />
        </g>

        <g transform="translate(78 300)">
          <rect x="0" y="18" width="46" height="58" rx="4" fill="#2f6bff" stroke="#2a3138" strokeWidth="3" />
          <rect x="8" y="8" width="46" height="58" rx="4" fill="#efe6d2" stroke="#2a3138" strokeWidth="3" />
          <rect x="16" y="0" width="46" height="58" rx="4" fill="#ff8d72" stroke="#2a3138" strokeWidth="3" />
        </g>
      </svg>
      <svg className="school-note" viewBox="0 0 220 160">
        <rect width="220" height="160" rx="18" fill="#243044" />
        <text x="20" y="42" fill="#efe6d2" fontSize="18" fontFamily="Georgia, serif">
          Today
        </text>
        <text x="20" y="78" fill="#9ec9f5" fontSize="15" fontFamily="Nunito, Segoe UI, sans-serif">
          Read one chapter
        </text>
        <text x="20" y="104" fill="#f4a7b8" fontSize="15" fontFamily="Nunito, Segoe UI, sans-serif">
          Ask one doubt
        </text>
        <text x="20" y="130" fill="#ffe08a" fontSize="15" fontFamily="Nunito, Segoe UI, sans-serif">
          Try one question
        </text>
      </svg>
    </div>
  );
}
