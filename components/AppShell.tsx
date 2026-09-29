"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useEffect } from "react";
import { LoginGate } from "@/components/LoginGate";
import { NavIcon } from "@/components/NavIcon";
import { PhysixMark } from "@/components/PhysixMark";
import { ProfileMenu } from "@/components/ProfileMenu";
import { useStudent } from "@/components/StudentProvider";
const menuFor = (grade: number) => [
  { href: "/", label: "Dashboard", icon: "home" },
  { href: "/learn", label: "Learn", icon: "learn" },
  { href: "/numericals", label: grade <= 5 ? "Try a sum" : "Numerical Solver", icon: "numericals" },
  { href: "/doubts", label: grade <= 5 ? "Ask a doubt" : "Doubt Tutor", icon: "doubts" },
  { href: "/quiz", label: "Quiz", icon: "quiz" },
  { href: "/practice", label: "Practice", icon: "practice" },
  { href: "/revision", label: "Revision", icon: "revision" },
  { href: "/progress", label: "My Progress", icon: "progress" },
];

export function AppShell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const router = useRouter();
  const { grade, username, signOut, ready, classOpen } = useStudent();

  useEffect(() => {
    if (ready && username && !classOpen && pathname !== "/") router.replace("/");
  }, [ready, username, classOpen, pathname, router]);

  if (!ready) return <div className="boot" />;
  if (!username) return <LoginGate />;

  const menu = menuFor(grade);

  function linkClass(href: string) {
    const active = href === "/" ? pathname === "/" : pathname.startsWith(href);
    return active ? "nav-link active" : "nav-link";
  }

  return (
    <div className={classOpen ? "shell" : "shell picking"}>
      {classOpen ? (
        <aside className="sidebar">
          <div className="brand">
            <PhysixMark />
            <div>
              <strong>PHYSICA</strong>
              <span>Class {grade}</span>
            </div>
          </div>
          <p className="nav-group">Menu</p>
          <nav>
            {menu.map((item) => (
              <Link key={item.href} href={item.href} className={linkClass(item.href)}>
                <NavIcon name={item.icon} />
                {item.label}
              </Link>
            ))}
          </nav>
          <div className="side-robot">
            <img src="/scenes/dash-robot.png" alt="" />
            <p>Small steps every day lead to big results!</p>
          </div>
          <div className="sidebar-foot">
            <span className="avatar" aria-hidden="true">
              {username.slice(0, 1).toUpperCase()}
            </span>
            <span>{username}</span>
          </div>
          <button
            className="text-button sign-out"
            type="button"
            onClick={() => {
              if (window.confirm("Sign out? You will go back to the login page.")) {
                signOut();
                router.replace("/");
              }
            }}
          >
            Sign out
          </button>
        </aside>
      ) : null}
      <div className={classOpen ? (pathname === "/" ? "workspace home-workspace" : "workspace") : "workspace picking"}>
        {classOpen && pathname !== "/" ? (
          <header className="workspace-top">
            <span className="px-class">
              Class {grade} <span className="cbse-chip">CBSE</span>
            </span>
            <ProfileMenu />
          </header>
        ) : null}
        {children}
      </div>
      {classOpen ? (
        <nav className="mobile-nav" aria-label="Pages">
          {menu.map((item) => (
            <Link key={item.href} href={item.href} className={pathname === item.href || (item.href !== "/" && pathname.startsWith(item.href)) ? "active" : undefined}>
              <NavIcon name={item.icon} />
              {item.label}
            </Link>
          ))}
        </nav>
      ) : null}
    </div>
  );
}
