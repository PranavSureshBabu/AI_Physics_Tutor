"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { ChapterScene } from "@/components/ChapterScene";
import { chaptersForGrade } from "@/content/curriculum";
import { useStudent } from "@/components/StudentProvider";
import type { ProgressRecord } from "@/lib/progress";

function placeFor(kind: string, label: string, chapters: ReturnType<typeof chaptersForGrade>) {
  if (kind === "topic") {
    const chapter = chapters.find((item) => item.topics.some((topic) => topic.title === label));
    return chapter ? `/learn?chapter=${chapter.id}` : "/learn";
  }
  if (kind === "doubt") return "/doubts";
  if (kind === "numerical") return "/numericals";
  if (kind === "practice") return "/practice";
  if (kind === "quiz") return "/quiz";
  return "/learn";
}

export default function ProgressPage() {
  const { studentId, grade, ready } = useStudent();
  const [record, setRecord] = useState<ProgressRecord | null>(null);
  const [restarting, setRestarting] = useState(false);
  const [notice, setNotice] = useState("");

  useEffect(() => {
    if (!ready) return;
    void fetch(`/api/progress?studentId=${studentId}&grade=${grade}`)
      .then((response) => response.json())
      .then((data: ProgressRecord) => setRecord(data));
  }, [ready, studentId, grade]);

  async function restartProgress() {
    if (!ready) return;
    const confirmed = window.confirm(`Reset Class ${grade} progress? The lessons stay. Only the scores on this page clear.`);
    if (!confirmed) return;
    setRestarting(true);
    setNotice("");
    const response = await fetch(`/api/progress?studentId=${encodeURIComponent(studentId)}&grade=${grade}`, { method: "DELETE" });
    if (response.ok) {
      setRecord((await response.json()) as ProgressRecord);
      setNotice("Progress reset for this class.");
    } else {
      setNotice("Progress could not be reset. Try again.");
    }
    setRestarting(false);
  }

  const accuracy =
    record && record.practiceAttempts > 0 ? Math.round((record.practiceCorrect / record.practiceAttempts) * 100) : null;
  const chapters = chaptersForGrade(grade);
  const opened = new Set(record?.topics ?? []);
  const finished = chapters.filter((chapter) => chapter.topics.length > 0 && chapter.topics.every((topic) => opened.has(topic.title))).length;
  const latestQuiz = record?.quizzes.at(-1);
  const quizPercent = latestQuiz && latestQuiz.total > 0 ? Math.round((latestQuiz.score / latestQuiz.total) * 100) : null;

  return (
    <main className="page-progress">
      <header className="rev-head">
        <div>
          <p>Class {grade}</p>
          <h1>My Progress</h1>
          <p>What you have opened and answered in this class.</p>
        </div>
        {grade <= 5 ? (
          <ChapterScene chapterId={chapters[0]?.id ?? "c1-forces"} title="Your class" kind="anime" className="progress-trophy" />
        ) : (
          <img className="progress-trophy" src="/scenes/progress-trophy.jpg" alt="A gold trophy for steady practice" />
        )}
        <button className="ghost" type="button" onClick={() => void restartProgress()} disabled={!ready || restarting}>
          {restarting ? "Resetting…" : "Reset progress"}
        </button>
      </header>
      {notice ? <p className="muted">{notice}</p> : null}
      <section className="dash-stats">
        <Link className="tone-green stat-link" href="/learn">
          <span>Chapters finished</span>
          <strong>
            {finished}
            <small> / {chapters.length}</small>
          </strong>
        </Link>
        <Link className="tone-violet stat-link" href="/quiz">
          <span>Quiz score</span>
          <strong>{quizPercent === null ? "None yet" : `${quizPercent}%`}</strong>
        </Link>
        <Link className="tone-blue stat-link" href="/numericals">
          <span>Sums checked</span>
          <strong>{record?.numericals ?? 0}</strong>
        </Link>
        <Link className="tone-amber stat-link" href="/doubts">
          <span>Doubts asked</span>
          <strong>{record?.doubts ?? 0}</strong>
        </Link>
      </section>
      <section className="panel" style={{ marginTop: 16 }}>
        <h2>Chapter progress</h2>
        <ul className="chapter-meters">
          {chapters.map((chapter) => {
            const seen = chapter.topics.filter((topic) => opened.has(topic.title)).length;
            const width = chapter.topics.length ? (seen / chapter.topics.length) * 100 : 0;
            return (
              <li key={chapter.id}>
                <Link href={`/learn?chapter=${chapter.id}`}>
                  <ChapterScene chapterId={chapter.id} title={chapter.title} kind={chapters.indexOf(chapter) % 2 === 0 ? "anime" : "photo"} className="chapter-thumb" />
                  <span>{chapter.title}</span>
                  <span className="meter">
                    <i style={{ width: `${width}%` }} />
                  </span>
                  <span>
                    {seen}/{chapter.topics.length}
                  </span>
                </Link>
              </li>
            );
          })}
        </ul>
        <h3>What you have done</h3>
        {accuracy === null ? (
          <p className="muted">
            <Link href="/practice">Practice score appears after you mark a practice question.</Link>
          </p>
        ) : (
          <p>
            <Link href="/practice">Practice marked correct: {accuracy}%.</Link>
          </p>
        )}
        {record?.recent.length ? (
          <ul className="recent-links">
            {record.recent.map((item) => (
              <li key={`${item.at}-${item.label}`}>
                <Link href={placeFor(item.kind, item.label, chapters)}>{item.kind}: {item.label}</Link>
              </li>
            ))}
          </ul>
        ) : (
          <p className="muted">Open a lesson, ask a doubt, or finish a quiz to start this list.</p>
        )}
      </section>
    </main>
  );
}
