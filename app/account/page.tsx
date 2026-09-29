"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { chaptersForGrade } from "@/content/curriculum";
import { useStudent } from "@/components/StudentProvider";
import type { ProgressRecord } from "@/lib/progress";
import { readResume } from "@/lib/study";

function displayName(username: string) {
  return (
    username
      .trim()
      .split(/\s+/)
      .filter(Boolean)
      .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
      .join(" ") || "Student"
  );
}

export default function AccountPage() {
  const { username, grade, studentId, ready } = useStudent();
  const [record, setRecord] = useState<ProgressRecord | null>(null);
  const name = displayName(username);
  const chapters = chaptersForGrade(grade);
  const resume = ready ? readResume(studentId) : null;
  const stopped = resume && resume.grade === grade ? resume.title : "";

  useEffect(() => {
    if (!ready || !studentId) return;
    void fetch(`/api/progress?studentId=${encodeURIComponent(studentId)}&grade=${grade}`)
      .then((response) => response.json())
      .then((data: ProgressRecord) => setRecord(data))
      .catch(() => setRecord(null));
  }, [ready, studentId, grade]);

  useEffect(() => {
    const id = window.location.hash.replace("#", "");
    if (!id) return;
    document.getElementById(id)?.scrollIntoView({ block: "start" });
  }, []);

  return (
    <main className="page-account">
      <header className="rev-head">
        <div>
          <p>Class {grade}</p>
          <h1>{name}</h1>
          <p>Username: {username}. This login stays in Class {grade}.</p>
        </div>
        <span className="avatar lg" aria-hidden="true">
          {name.slice(0, 1)}
        </span>
      </header>

      <section className="panel account-card" id="profile">
        <h2>My Profile</h2>
        <ul className="account-facts">
          <li>
            <span>Name</span>
            <strong>{name}</strong>
          </li>
          <li>
            <span>Username</span>
            <strong>{username}</strong>
          </li>
          <li>
            <span>Class</span>
            <strong>Class {grade}</strong>
          </li>
          <li>
            <span>Chapters finished</span>
            <strong>
              {chapters.filter((chapter) => chapter.topics.length > 0 && chapter.topics.every((topic) => record?.topics.includes(topic.title))).length} / {chapters.length}
            </strong>
          </li>
        </ul>
        <Link href="/progress">See My Progress</Link>
      </section>

      <section className="panel account-card" id="class">
        <h2>My Class: Class {grade}</h2>
        <p>This name is locked to Class {grade}. Another class does not open from this login.</p>
        <p>Sign out only when you want the login page. A different student needs a different username.</p>
      </section>

      <section className="panel account-card" id="notes">
        <h2>Notifications</h2>
        {stopped ? (
          <p>
            You stopped on <span className="word-blue">{stopped}</span>. Open Learn to continue.
          </p>
        ) : (
          <p>No new notes.</p>
        )}
      </section>

      <section className="panel account-card" id="help">
        <h2>Help & Support</h2>
        <ol>
          <li>
            <Link href="/learn">Learn</Link> — open one chapter and turn the pages.
          </li>
          <li>
            <Link href="/numericals">Numerical Solver</Link> — try a sum.
          </li>
          <li>
            <Link href="/doubts">Doubt Tutor</Link> — ask in your own words.
          </li>
          <li>
            <Link href="/quiz">Quiz</Link> — use the arrows to go back and forward.
          </li>
          <li>
            <Link href="/revision">Revision</Link> — look over one chapter.
          </li>
          <li>
            <Link href="/progress">My Progress</Link> — tap a chapter to open it.
          </li>
        </ol>
        <p>If you are stuck, ask the Doubt Tutor or a teacher. Your class stays Class {grade}.</p>
      </section>
    </main>
  );
}
