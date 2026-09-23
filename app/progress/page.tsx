"use client";

import { useEffect, useState } from "react";
import { useStudent } from "@/components/StudentProvider";
import type { ProgressRecord } from "@/lib/progress";

export default function ProgressPage() {
  const { studentId, grade, ready } = useStudent();
  const [record, setRecord] = useState<ProgressRecord | null>(null);
  const [restarting, setRestarting] = useState(false);
  const [notice, setNotice] = useState("");

  useEffect(() => {
    if (!ready) return;
    void fetch(`/api/progress?studentId=${studentId}`)
      .then((response) => response.json())
      .then((data: ProgressRecord) => setRecord(data));
  }, [ready, studentId]);

  async function restartProgress() {
    if (!ready) return;
    const confirmed = window.confirm(
      "Restart progress? This clears topics, doubts, numericals, practice, and quizzes saved on this browser.",
    );
    if (!confirmed) return;
    setRestarting(true);
    setNotice("");
    const response = await fetch(`/api/progress?studentId=${encodeURIComponent(studentId)}&grade=${grade}`, {
      method: "DELETE",
    });
    if (response.ok) {
      setRecord((await response.json()) as ProgressRecord);
      setNotice("Progress restarted. Your lessons are still here.");
    } else {
      setNotice("Progress could not be restarted. Try again.");
    }
    setRestarting(false);
  }

  const accuracy =
    record && record.practiceAttempts > 0
      ? Math.round((record.practiceCorrect / record.practiceAttempts) * 100)
      : 0;

  return (
    <main>
      <h1 className="page-title">Progress</h1>
      <section className="action-grid">
        <article className="stat panel">
          <b>{record?.topics.length ?? 0}</b>
          <span className="muted">Topics opened</span>
        </article>
        <article className="stat panel">
          <b>{record?.doubts ?? 0}</b>
          <span className="muted">Doubts asked</span>
        </article>
        <article className="stat panel">
          <b>{record?.numericals ?? 0}</b>
          <span className="muted">Numericals tried</span>
        </article>
        <article className="stat panel">
          <b>{accuracy}%</b>
          <span className="muted">Practice marked correct</span>
        </article>
      </section>
      <section className="panel" style={{ marginTop: 16 }}>
        <div className="progress-head">
          <h2>Recent activity</h2>
          <button className="ghost" type="button" onClick={() => void restartProgress()} disabled={!ready || restarting}>
            {restarting ? "Restarting…" : "Restart progress"}
          </button>
        </div>
        {notice ? <p className="muted">{notice}</p> : null}
        {record?.recent.length ? (
          <ul>
            {record.recent.map((item) => (
              <li key={`${item.at}-${item.label}`}>
                {item.kind}: {item.label}
              </li>
            ))}
          </ul>
        ) : (
          <p className="muted">Open a lesson, ask a doubt, or finish a quiz to start your record.</p>
        )}
        {record?.quizzes.length ? (
          <p>
            Latest quiz: {record.quizzes.at(-1)?.score}/{record.quizzes.at(-1)?.total}
          </p>
        ) : null}
      </section>
    </main>
  );
}
