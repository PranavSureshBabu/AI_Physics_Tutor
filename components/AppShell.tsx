"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { NAV } from "@/components/nav";
import { useStudent } from "@/components/StudentProvider";
import { grades } from "@/content/grades";

function AtomMark() {
  return (
    <svg width="42" height="42" viewBox="0 0 42 42" aria-hidden="true">
      <rect width="42" height="42" rx="14" fill="#2f6bff" />
      <circle cx="21" cy="21" r="4" fill="white" />
      <ellipse cx="21" cy="21" rx="14" ry="5.5" fill="none" stroke="white" strokeWidth="1.7" />
      <ellipse cx="21" cy="21" rx="5.5" ry="14" fill="none" stroke="#ffd9cf" strokeWidth="1.7" />
    </svg>
  );
}

export function AppShell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const { grade, setGrade } = useStudent();
  const info = grades.find((item) => item.grade === grade);

  return (
    <div className="shell">
      <aside className="sidebar">
        <div className="brand">
          <AtomMark />
          <div>
            <strong>Physics Tutor</strong>
            <span>Classes 1 to 12</span>
          </div>
        </div>
        <nav>
          {NAV.map((item) => {
            const active = item.href === "/" ? pathname === "/" : pathname.startsWith(item.href);
            return (
              <Link key={item.href} href={item.href} className={active ? "nav-link active" : "nav-link"}>
                {item.label}
              </Link>
            );
          })}
        </nav>
      </aside>
      <div className="workspace">
        <header className="topbar">
          <div>
            <p className="muted" style={{ margin: 0 }}>
              {info?.label} · {info?.subject}
            </p>
            <strong>{info?.summary}</strong>
          </div>
          <div className="class-row" aria-label="Choose your class">
            {grades.map((item) => (
              <button
                key={item.grade}
                className={item.grade === grade ? "class-pill on" : "class-pill"}
                onClick={() => setGrade(item.grade)}
                type="button"
              >
                {item.grade}
              </button>
            ))}
          </div>
        </header>
        {children}
      </div>
      <nav className="mobile-nav" aria-label="Mobile">
        {NAV.map((item) => {
          const active = item.href === "/" ? pathname === "/" : pathname.startsWith(item.href);
          return (
            <Link key={item.href} href={item.href} className={active ? "active" : undefined}>
              {item.label}
            </Link>
          );
        })}
      </nav>
    </div>
  );
}
