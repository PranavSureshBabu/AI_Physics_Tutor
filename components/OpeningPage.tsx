import { PhysixMark } from "@/components/PhysixMark";

const features = [
  {
    title: "Chapter-wise Learning",
    text: "Forces, light, sound, heat, and motion, each in its own chapter with a picture beside the idea.",
    icon: "book",
  },
  {
    title: "Numerical Solver",
    text: "Sums from the chapter, with the working shown so the number can be checked.",
    icon: "calc",
  },
  {
    title: "AI Doubt Tutor",
    text: "A physics question, answered in the language of the class you are in.",
    icon: "chat",
  },
  {
    title: "Quizzes",
    text: "Short choices that test the idea you just met, one question at a time.",
    icon: "quiz",
  },
  {
    title: "Revision",
    text: "The laws, formulas, and examples of a chapter, gathered for a second look.",
    icon: "revise",
  },
  {
    title: "Progress Dashboard",
    text: "Chapters opened, quiz score, and sums checked, kept in one clear view.",
    icon: "chart",
  },
];

const steps = [
  { n: "01", title: "Open a chapter", text: "Begin with light, motion, sound, or force." },
  { n: "02", title: "See the idea", text: "A picture and a real scene sit with the reading." },
  { n: "03", title: "Work a sum", text: "Try the numbers that belong to that chapter." },
  { n: "04", title: "Ask a doubt", text: "Bring the question you are still holding." },
  { n: "05", title: "Take the quiz", text: "Choose the answer that fits the idea." },
  { n: "06", title: "Revise and track", text: "Look back, then see what you have finished." },
];

function FeatureIcon({ name }: { name: string }) {
  const common = { fill: "none", stroke: "currentColor", strokeWidth: 1.7, strokeLinecap: "round" as const, strokeLinejoin: "round" as const };
  return (
    <svg className="feature-ico" viewBox="0 0 32 32" aria-hidden="true">
      {name === "book" ? (
        <>
          <path {...common} d="M6 8.5h8.2A3.8 3.8 0 0 1 18 12.3V25H9.2A3.2 3.2 0 0 0 6 28.2Z" />
          <path {...common} d="M26 8.5h-8.2A3.8 3.8 0 0 0 14 12.3V25h8.8A3.2 3.2 0 0 1 26 28.2Z" />
        </>
      ) : null}
      {name === "calc" ? (
        <>
          <rect {...common} x="8" y="5" width="16" height="22" rx="3" />
          <path {...common} d="M12 10h8M12 16h.01M16 16h.01M20 16h.01M12 20h.01M16 20h.01M20 20h.01" />
        </>
      ) : null}
      {name === "chat" ? (
        <path {...common} d="M8 8h16a2 2 0 0 1 2 2v8a2 2 0 0 1-2 2h-7l-5 4v-4H8a2 2 0 0 1-2-2v-8a2 2 0 0 1 2-2Z" />
      ) : null}
      {name === "quiz" ? (
        <>
          <circle {...common} cx="16" cy="16" r="9" />
          <path {...common} d="M13 13.2a3 3 0 1 1 3.6 2.9c-.8.3-1.1.8-1.1 1.6M16 21.2h.01" />
        </>
      ) : null}
      {name === "revise" ? (
        <>
          <path {...common} d="M8 9h12M8 14h12M8 19h8" />
          <path {...common} d="M22 18.5 24.5 21 29 15" />
        </>
      ) : null}
      {name === "chart" ? <path {...common} d="M7 25V17M13 25V12M19 25V15M25 25V8" /> : null}
    </svg>
  );
}

export function OpeningPage({ onEnter }: { onEnter: () => void }) {
  function go(id: string) {
    document.getElementById(id)?.scrollIntoView({ behavior: "smooth", block: "start" });
  }

  return (
    <div className="universe">
      <header className="universe-hero" id="home">
        <div className="universe-nav">
          <div className="brand">
            <PhysixMark />
            <div>
              <strong>PHYSICA</strong>
              <span>AI Physics Tutor</span>
            </div>
          </div>
          <nav aria-label="Introduction">
            <button type="button" onClick={() => go("home")}>
              Home
            </button>
            <button type="button" onClick={() => go("features")}>
              Features
            </button>
            <button type="button" onClick={() => go("how")}>
              How it Works
            </button>
            <button className="universe-login" type="button" onClick={onEnter}>
              Login
            </button>
          </nav>
        </div>
        <div className="universe-copy">
          <h1>Explore the Universe of Physics</h1>
          <p className="universe-caption">A falling apple. A ringing bell. A shadow stretching across the wall.</p>
          <p className="universe-caption">From a push on a swing to the quiet pull of gravity, physics is how the world moves, shines, and holds together.</p>
          <button className="universe-start" type="button" onClick={onEnter}>
            Start Learning
          </button>
        </div>
      </header>
      <section className="universe-body" id="features">
        <div className="universe-how">
          <p className="universe-kicker">Features</p>
          <h2>What you will find here</h2>
          <p>Six parts of PHYSICA, each one a different way into physics.</p>
        </div>
        <ul className="feature-grid">
          {features.map((item) => (
            <li key={item.title}>
              <FeatureIcon name={item.icon} />
              <strong>{item.title}</strong>
              <span>{item.text}</span>
            </li>
          ))}
        </ul>
        <div className="universe-how how-block" id="how">
          <p className="universe-kicker">How it Works</p>
          <h2>From the first picture to the last question</h2>
          <p>Light finds the eye. Motion finds a path. A chapter follows the same quiet order.</p>
        </div>
        <ol className="how-steps">
          {steps.map((step) => (
            <li key={step.n}>
              <span>{step.n}</span>
              <strong>{step.title}</strong>
              <p>{step.text}</p>
            </li>
          ))}
        </ol>
        <div className="universe-banner">
          <span className="bulb" aria-hidden="true">
            <svg viewBox="0 0 32 32">
              <path d="M16 5a8 8 0 0 0-4 14.8V23h8v-3.2A8 8 0 0 0 16 5Z" />
              <path d="M13 26h6M14 28.5h4" />
            </svg>
          </span>
          <div>
            <strong>Curious minds build a brighter future!</strong>
            <p>Let&apos;s make physics simple, together.</p>
          </div>
          <button className="universe-next" type="button" aria-label="Go to login" onClick={onEnter}>
            <svg viewBox="0 0 24 24" aria-hidden="true">
              <path d="M9 6l6 6-6 6" />
            </svg>
          </button>
        </div>
      </section>
    </div>
  );
}
