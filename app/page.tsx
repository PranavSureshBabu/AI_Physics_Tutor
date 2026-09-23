"use client";

import Link from "next/link";
import { Sketch } from "@/components/Sketch";
import { grades } from "@/content/grades";
import { useStudent } from "@/components/StudentProvider";

const actions = [
  { href: "/learn", title: "Learn a Concept", text: "Chapter, topic, example, and a quick check.", accent: "#2f6bff" },
  { href: "/doubts", title: "Ask a Doubt", text: "Ask in your own words. I stay inside the class notes.", accent: "#6d5ef5" },
  { href: "/numericals", title: "Solve a Numerical", text: "Word problems and a calculator that checks the arithmetic.", accent: "#ff6a45" },
  { href: "/practice", title: "Practice", text: "Try a question, then reveal the checked answer.", accent: "#0e9b78" },
  { href: "/quiz", title: "Quiz", text: "Five short questions from your class.", accent: "#e7a61a" },
  { href: "/revision", title: "Revision", text: "Formulas, key points, and common mistakes.", accent: "#152033" },
];

export default function HomePage() {
  const { grade } = useStudent();
  const info = grades.find((item) => item.grade === grade);

  return (
    <main>
      <section className="hero-layout">
        <div className="hero-copy">
          <p className="hero-kicker">
            {info?.label} · {info?.subject}
          </p>
          <h1 className="page-title">Hi! I&apos;m your Physics Tutor</h1>
          <p style={{ maxWidth: 640, fontSize: "1.12rem" }}>
            Open a chapter, read the figure the way you would in a textbook, and ask me to check the arithmetic before
            you trust a number.
          </p>
        </div>
        <Sketch name="lens" caption="A convex lens brings parallel rays to the focus." />
      </section>
      <section className="action-grid">
        {actions.map((action) => (
          <Link key={action.href} href={action.href} className="action" style={{ ["--accent" as string]: action.accent }}>
            <b>{action.title}</b>
            <span className="muted">{action.text}</span>
          </Link>
        ))}
      </section>
    </main>
  );
}
