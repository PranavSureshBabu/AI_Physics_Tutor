export function NavIcon({ name }: { name: string }) {
  return (
    <svg className="nav-ico" viewBox="0 0 24 24" aria-hidden="true">
      {mark(name)}
    </svg>
  );
}

function mark(name: string) {
  switch (name) {
    case "home":
      return (
        <>
          <path d="M4 11.2 12 4.5l8 6.7V20a1 1 0 0 1-1 1h-5.2v-6.2H10.2V21H5a1 1 0 0 1-1-1z" />
        </>
      );
    case "study":
      return (
        <>
          <path d="M12 6.2c-2.2-1.5-6.2-.8-8 .2v12.2c2.4-1.1 5.4-.6 8 1.2 2.6-1.8 5.6-2.3 8-1.2V6.4c-1.8-1-5.8-1.7-8-.2z" />
          <path d="M12 6.2v13.6" />
        </>
      );
    case "learn":
      return (
        <>
          <path d="M6 4.5h9.2A2.8 2.8 0 0 1 18 7.3V20H8.2A2.2 2.2 0 0 1 6 17.8z" />
          <path d="M6 17.8A2.2 2.2 0 0 1 8.2 20" />
          <path d="M9 8.2h6M9 11.5h6" />
        </>
      );
    case "doubts":
      return (
        <>
          <path d="M5 6.2h12.2A2.3 2.3 0 0 1 19.5 8.5v6.2A2.3 2.3 0 0 1 17.2 17H12l-3.4 3v-3H5a2.3 2.3 0 0 1-2.3-2.3V8.5A2.3 2.3 0 0 1 5 6.2z" />
          <path d="M9.2 10.2a1.9 1.9 0 1 1 2.4 1.8c-.5.3-.7.6-.7 1.2" />
          <path d="M10.9 15.2h.1" />
        </>
      );
    case "numericals":
      return (
        <>
          <rect x="6" y="3.5" width="12" height="17" rx="2" />
          <path d="M8.6 7.2h6.8" />
          <circle className="nav-dot" cx="9.2" cy="11.1" r="0.9" />
          <circle className="nav-dot" cx="12" cy="11.1" r="0.9" />
          <circle className="nav-dot" cx="14.8" cy="11.1" r="0.9" />
          <circle className="nav-dot" cx="9.2" cy="14.2" r="0.9" />
          <circle className="nav-dot" cx="12" cy="14.2" r="0.9" />
          <circle className="nav-dot" cx="14.8" cy="14.2" r="0.9" />
          <circle className="nav-dot" cx="9.2" cy="17.3" r="0.9" />
          <circle className="nav-dot" cx="12" cy="17.3" r="0.9" />
          <circle className="nav-dot" cx="14.8" cy="17.3" r="0.9" />
        </>
      );
    case "practice":
      return (
        <>
          <path d="M14.2 4.4 19.6 9.8 8.8 20.6H3.4v-5.4z" />
          <path d="M12.2 6.4 17.6 11.8" />
        </>
      );
    case "quiz":
      return (
        <>
          <rect x="5" y="3.8" width="14" height="16.4" rx="2" />
          <path d="M8.2 9.2 10.2 11.2 15 6.6" />
          <path d="M8.2 15.4h7.6" />
        </>
      );
    case "review":
      return (
        <>
          <path d="M2.8 12S6.2 6.4 12 6.4 21.2 12 21.2 12 17.8 17.6 12 17.6 2.8 12 2.8 12z" />
          <circle cx="12" cy="12" r="2.4" />
        </>
      );
    case "revision":
      return (
        <>
          <path d="M19 8.2A7.2 7.2 0 0 0 6.4 6.6" />
          <path d="M5 4.8v3.4h3.4" />
          <path d="M5 15.8A7.2 7.2 0 0 0 17.6 17.4" />
          <path d="M19 19.2v-3.4h-3.4" />
        </>
      );
    case "progress":
      return (
        <>
          <path d="M4.5 19.5h15" />
          <path d="M7 19.5V12M12 19.5V7.5M17 19.5V10" />
        </>
      );
    default:
      return null;
  }
}
