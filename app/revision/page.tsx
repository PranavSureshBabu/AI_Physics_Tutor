"use client";

import { useState } from "react";
import { chaptersForGrade } from "@/content/curriculum";
import { FormulaView } from "@/components/FormulaView";
import { useStudent } from "@/components/StudentProvider";

export default function RevisionPage() {
  const { grade } = useStudent();
  const chapters = chaptersForGrade(grade);
  const [chapterId, setChapterId] = useState(chapters[0]?.id ?? "");
  const chapter = chapters.find((item) => item.id === chapterId) ?? chapters[0];
  const formulaIds = [...new Set(chapter?.topics.flatMap((topic) => topic.formulaIds) ?? [])];

  if (!chapter) return null;

  return (
    <main>
      <h1 className="page-title">Revision</h1>
      <div className="class-row" style={{ marginBottom: 16 }}>
        {chapters.map((item) => (
          <button key={item.id} className={item.id === chapter.id ? "class-pill on" : "class-pill"} type="button" onClick={() => setChapterId(item.id)}>
            {item.title}
          </button>
        ))}
      </div>
      <section className="split">
        <article className="panel">
          <h2>Formulas</h2>
          {formulaIds.length === 0 ? <p>This chapter uses words more than formulas.</p> : formulaIds.map((id) => <FormulaView key={id} formulaId={id} />)}
        </article>
        <article className="panel">
          <h2>Key points and mistakes</h2>
          {chapter.topics.map((topic) => (
            <div key={topic.id}>
              <h3>{topic.title}</h3>
              <ul>
                {topic.keyPoints.map((point) => (
                  <li key={point}>{point}</li>
                ))}
              </ul>
              <div className="callout mistake">
                <strong>Common mistake</strong>
                <p>{topic.mistake.wrong}</p>
                <p>{topic.mistake.right}</p>
              </div>
            </div>
          ))}
        </article>
      </section>
    </main>
  );
}
