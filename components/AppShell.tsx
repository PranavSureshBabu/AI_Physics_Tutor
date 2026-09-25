"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useEffect } from "react";
import { LoginGate } from "@/components/LoginGate";
import { NavIcon } from "@/components/NavIcon";
import { TOOLS } from "@/components/nav";
import { useStudent } from "@/components/StudentProvider";
import { grades } from "@/content/grades";

const groups = ["Study", "Practice", "Review"] as const;

export function AppShell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const router = useRouter();
  const { grade, username, signOut, ready, classOpen } = useStudent();
  const info = grades.find((item) => item.grade === grade);

  useEffect(() => {
    if (ready && username && !classOpen && pathname !== "/") router.replace("/");
  }, [ready, username, classOpen, pathname, router]);

  if (!ready) return <div className="boot" />;
  if (!username) return <LoginGate />;

  function linkClass(href: string) {
    const active = href === "/" ? pathname === "/" : pathname.startsWith(href);
    return active ? "nav-link active" : "nav-link";
  }

  return (
    <div className={classOpen ? "shell" : "shell picking"}>
      {classOpen ? (
        <aside className="sidebar">
          <div className="brand">
            <div>
              <strong>Physics Tutor</strong>
              <span>{username}</span>
            </div>
          </div>
          <nav>
            <Link href="/" className={linkClass("/")}>
              <NavIcon name="home" />
              Home
            </Link>
            {groups.map((group) => (
              <div key={group}>
                <p className="nav-group">
                  <NavIcon name={group.toLowerCase()} />
                  {group}
                </p>
                {TOOLS.filter((item) => item.group === group).map((item) => (
                  <Link key={item.href} href={item.href} className={linkClass(item.href)}>
                    <NavIcon name={item.href.slice(1)} />
                    {item.label}
                  </Link>
                ))}
              </div>
            ))}
          </nav>
          <button className="text-button" type="button" onClick={signOut}>
            Sign out
          </button>
        </aside>
      ) : null}
      <div className={classOpen ? "workspace" : "workspace picking"}>
        {classOpen ? (
          <header className="topbar">
            <div>
              <p className="eyebrow" style={{ marginBottom: 6 }}>
                {info?.label} · {info?.subject}
              </p>
              <strong>{info?.summary}</strong>
            </div>
          </header>
        ) : null}
        {children}
      </div>
      {classOpen ? (
        <nav className="mobile-nav" aria-label="Pages">
          <Link href="/" className={pathname === "/" ? "active" : undefined}>
            <NavIcon name="home" />
            Home
          </Link>
          {TOOLS.map((item) => (
            <Link key={item.href} href={item.href} className={pathname.startsWith(item.href) ? "active" : undefined}>
              <NavIcon name={item.href.slice(1)} />
              {item.label}
            </Link>
          ))}
        </nav>
      ) : null}
    </div>
  );
}
