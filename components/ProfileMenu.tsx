"use client";

import Link from "next/link";
import { useEffect, useId, useRef, useState, type ReactNode } from "react";
import { useRouter } from "next/navigation";
import { useStudent } from "@/components/StudentProvider";
import type { ProgressRecord } from "@/lib/progress";

function displayName(username: string) {
  const name = username
    .trim()
    .split(/\s+/)
    .filter(Boolean)
    .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
    .join(" ");
  return name || "Student";
}

function Icon({ children }: { children: ReactNode }) {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true">
      {children}
    </svg>
  );
}

const items = [
  {
    href: "/account#profile",
    label: "My Profile",
    icon: (
      <>
        <circle cx="12" cy="8" r="3.2" />
        <path d="M6 19.2c1.2-2.8 3.4-4 6-4s4.8 1.2 6 4" />
      </>
    ),
  },
  {
    href: "/account#class",
    label: "My Class",
    icon: (
      <>
        <path d="M3.5 10 12 5.5 20.5 10 12 14.5z" />
        <path d="M7 12.2V16c1.4 1.2 3 1.8 5 1.8s3.6-.6 5-1.8v-3.8" />
      </>
    ),
  },
  {
    href: "/account#notes",
    label: "Notifications",
    icon: (
      <>
        <path d="M6.5 16.2h11l-1.4-2V10a4.1 4.1 0 0 0-8.2 0v4.2z" />
        <path d="M10 16.2a2 2 0 0 0 4 0" />
      </>
    ),
  },
  {
    href: "/account#help",
    label: "Help & Support",
    icon: (
      <>
        <circle cx="12" cy="12" r="7.2" />
        <path d="M9.6 9.6a2.4 2.4 0 1 1 3.2 2.2c-.6.3-.8.7-.8 1.3" />
        <path d="M12 16.4h.1" />
      </>
    ),
  },
];

export function ProfileMenu() {
  const { username, grade, studentId, ready, signOut } = useStudent();
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const [active, setActive] = useState(false);
  const rootRef = useRef<HTMLDivElement>(null);
  const menuId = useId();
  const name = displayName(username);

  useEffect(() => {
    if (!ready || !studentId) return;
    void fetch(`/api/progress?studentId=${encodeURIComponent(studentId)}&grade=${grade}`)
      .then((response) => response.json())
      .then((data: ProgressRecord) => {
        setActive(data.topics.length > 0 || data.quizzes.length > 0 || data.numericals > 0 || data.doubts > 0);
      })
      .catch(() => setActive(false));
  }, [ready, studentId, grade]);

  useEffect(() => {
    if (!open) return;
    function onPointer(event: MouseEvent) {
      if (!rootRef.current?.contains(event.target as Node)) setOpen(false);
    }
    function onKey(event: KeyboardEvent) {
      if (event.key === "Escape") setOpen(false);
    }
    document.addEventListener("mousedown", onPointer);
    document.addEventListener("keydown", onKey);
    return () => {
      document.removeEventListener("mousedown", onPointer);
      document.removeEventListener("keydown", onKey);
    };
  }, [open]);

  function leave() {
    setOpen(false);
    if (window.confirm("Sign out? You will go back to the login page.")) {
      signOut();
      router.replace("/");
    }
  }

  return (
    <div className="profile-menu" ref={rootRef}>
      <button
        className="profile-trigger"
        type="button"
        aria-haspopup="menu"
        aria-expanded={open}
        aria-controls={menuId}
        onClick={() => setOpen((value) => !value)}
      >
        <span className="avatar" aria-hidden="true">
          {name.slice(0, 1)}
        </span>
        {name}
      </button>
      {open ? (
        <div className="profile-pop" id={menuId} role="menu">
          <div className="profile-head">
            <span className="avatar lg" aria-hidden="true">
              {name.slice(0, 1)}
            </span>
            <div>
              <strong className="word-blue">{name}</strong>
              <p className="who-user">Username {username}</p>
              <p className="who-class">Class {grade} · Student</p>
              <span className={active ? "learner-chip on" : "learner-chip"}>{active ? "Active learner" : "Ready to start"}</span>
            </div>
          </div>
          {items.map((item) => (
            <Link key={item.href} href={item.href} role="menuitem" onClick={() => setOpen(false)}>
              <Icon>{item.icon}</Icon>
              {item.href === "/account#class" ? `My Class: Class ${grade}` : item.label}
            </Link>
          ))}
          <button className="sign-out-row" type="button" role="menuitem" onClick={leave}>
            <Icon>
              <path d="M10 7V5.8A1.8 1.8 0 0 1 11.8 4h6.4A1.8 1.8 0 0 1 20 5.8v12.4a1.8 1.8 0 0 1-1.8 1.8h-6.4A1.8 1.8 0 0 1 10 18.2V17" />
              <path d="M4 12h10" />
              <path d="M11 9.2 13.8 12 11 14.8" />
            </Icon>
            Sign out
          </button>
        </div>
      ) : null}
    </div>
  );
}
