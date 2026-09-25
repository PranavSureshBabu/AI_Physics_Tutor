"use client";

import { useState } from "react";
import { chaptersForGrade } from "@/content/curriculum";
import { FormulaView } from "@/components/FormulaView";
import { PageGuide } from "@/components/PageGuide";
import { revisionTopics } from "@/lib/revision-sheet";
import { useStudent } from "@/components/StudentProvider";

export default function RevisionPage() {
  const { grade } = useStudent();
  const chapters = chaptersForGrade(grade);
  const [chapterId, setChapterId] = useState(chapters[0]?.id ?? "");
  const chapter = chapters.find((item) => item.id === chapterId) ?? chapters[0];
  const formulaIds = [...new Set(chapter?.topics.flatMap((topic) => topic.formulaIds) ?? [])];
  const topics = chapter ? revisionTopics(chapter, grade) : [];

  if (!chapter) return null;

  return (
    <main>
      <PageGuide href="/revision" />
      <div className="class-row" style={{ marginBottom: 16 }}>
        {chapters.map((item) => (
          <button key={item.id} className={item.id === chapter.id ? "class-pill on" : "class-pill"} type="button" onClick={() => setChapterId(item.id)}>
            {item.title}
          </button>
        ))}
      </div>
      <section className="panel">
        <h2>Formulas</h2>
        {formulaIds.length === 0 ? <p>This chapter uses words more than formulas.</p> : formulaIds.map((id) => <FormulaView key={id} formulaId={id} />)}
      </section>
      <div className="revision-list">
        {topics.map((topic) => (
          <article className="panel revision-topic" key={topic.id}>
            <h3>{topic.title}</h3>
            <div className="callout remember">
              <strong>Keep this</strong>
              <p>{topic.keep}</p>
            </div>
            {topic.senior ? (
              <div className="callout check">
                <strong>Extra for this class</strong>
                <p>{topic.senior}</p>
              </div>
            ) : null}
            <h4>Points</h4>
            <ul>
              {topic.points.map((point) => (
                <li key={point}>{point}</li>
              ))}
            </ul>
            {topic.more.length > 0 ? (
              <>
                <h4>Also remember</h4>
                <ul>
                  {topic.more.map((line) => (
                    <li key={line}>{line}</li>
                  ))}
                </ul>
              </>
            ) : null}
            <div className="callout example">
              <strong>One case</strong>
              <p>{topic.example}</p>
            </div>
            <div className="callout check">
              <strong>Quick check</strong>
              <p>{topic.check.question}</p>
              <p>
                <strong>{topic.check.answer}</strong>
              </p>
            </div>
            <div className="callout mistake">
              <strong>Common mistake</strong>
              <p>{topic.mistake.wrong}</p>
              <p>{topic.mistake.right}</p>
            </div>
          </article>
        ))}
      </div>
    </main>
  );
}
