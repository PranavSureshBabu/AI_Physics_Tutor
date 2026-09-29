"use client";

import { useState } from "react";
import { chaptersForGrade } from "@/content/curriculum";
import { ChapterScene } from "@/components/ChapterScene";
import { FormulaView } from "@/components/FormulaView";
import { revisionTopics } from "@/lib/revision-sheet";
import { useStudent } from "@/components/StudentProvider";

export default function RevisionPage() {
  const { grade } = useStudent();
  const young = grade <= 5;
  const chapters = chaptersForGrade(grade);
  const [chapterId, setChapterId] = useState(chapters[0]?.id ?? "");
  const chapter = chapters.find((item) => item.id === chapterId) ?? chapters[0];
  const formulaIds = [...new Set(chapter?.topics.flatMap((topic) => topic.formulaIds) ?? [])];
  const topics = chapter ? revisionTopics(chapter, grade) : [];

  if (!chapter) return null;

  return (
    <main className="page-revision">
      <header className="rev-head">
        <div>
          <p>Class {grade}</p>
          <h1>Revision</h1>
          <p>{young ? "A few lines to remember from one chapter." : "The idea, the points, and the formulas for one chapter."}</p>
        </div>
        <label>
          Chapter
          <select value={chapter.id} onChange={(event) => setChapterId(event.target.value)} aria-label="Chapter">
            {chapters.map((item, index) => (
              <option key={item.id} value={item.id}>
                {index + 1}. {item.title}
              </option>
            ))}
          </select>
        </label>
      </header>
      <section className="rev-hero panel">
        <ChapterScene chapterId={chapter.id} title={chapter.title} kind={grade <= 8 ? "anime" : "photo"} className="rev-hero-art" />
        <div>
          <p className="muted">Chapter</p>
          <h2>{chapter.title}</h2>
          <p>{chapter.promise}</p>
        </div>
      </section>
      <div className="rev-cards">
        {topics.map((topic) => (
          <article className="panel rev-topic" key={topic.id}>
            <h3>{topic.title}</h3>
            <p className="rev-keep">{topic.keep}</p>
            <ul>
              {(young ? topic.points.slice(0, 3) : topic.points).map((point) => (
                <li key={point}>{point}</li>
              ))}
            </ul>
            <p>
              <strong>{young ? "Try this. " : "Example. "}</strong>
              {topic.example}
            </p>
            {grade >= 6 ? (
              <p className="rev-care">
                <strong>Watch this. </strong>
                {topic.mistake.right}
              </p>
            ) : null}
            {topic.senior ? <p>{topic.senior}</p> : null}
          </article>
        ))}
      </div>
      {grade >= 6 ? (
        <section className="panel">
          <h2>Formulas</h2>
          {formulaIds.length === 0 ? (
            <p>This chapter is carried by words and examples.</p>
          ) : (
            formulaIds.map((id) => <FormulaView key={id} formulaId={id} />)
          )}
        </section>
      ) : (
        <p className="muted">This class keeps the ideas in words and pictures.</p>
      )}
    </main>
  );
}
