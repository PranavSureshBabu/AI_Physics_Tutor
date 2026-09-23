"use client";

import { useState } from "react";
import { chaptersForGrade } from "@/content/curriculum";
import { useStudent } from "@/components/StudentProvider";

export default function PracticePage() {
  const { grade, studentId, ready } = useStudent();
  const items = chaptersForGrade(grade).flatMap((chapter) =>
    chapter.topics.flatMap((topic) => topic.practice.map((item) => ({ ...item, topic: topic.title }))),
  );
  const [open, setOpen] = useState<string | null>(null);

  async function mark(label: string, correct: boolean) {
    if (!ready) return;
    await fetch("/api/progress", {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify({ studentId, event: { type: "practice", grade, label, correct } }),
    });
  }

  return (
    <main>
      <h1 className="page-title">Practice</h1>
      <div className="split">
        {items.map((item) => (
          <article className="panel" key={item.id}>
            <p className="muted">{item.topic}</p>
            <strong>{item.question}</strong>
            <div style={{ display: "flex", gap: 8, marginTop: 12 }}>
              <button className="ghost" type="button" onClick={() => setOpen(open === item.id ? null : item.id)}>
                {open === item.id ? "Hide" : "Hint and answer"}
              </button>
            </div>
            {open === item.id ? (
              <div>
                <p>Hint: {item.hint}</p>
                <p>
                  <strong>Answer: </strong>
                  {item.answer}
                </p>
                <button className="primary" type="button" onClick={() => mark(item.question, true)}>
                  I got it
                </button>
                <button className="ghost" type="button" onClick={() => mark(item.question, false)} style={{ marginLeft: 8 }}>
                  Not yet
                </button>
              </div>
            ) : null}
          </article>
        ))}
      </div>
    </main>
  );
}
