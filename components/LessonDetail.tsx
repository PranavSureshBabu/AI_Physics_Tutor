"use client";

import { useState } from "react";
import Link from "next/link";
import { ScenePhoto } from "@/components/ScenePhoto";
import { Sketch } from "@/components/Sketch";
import { figureFor } from "@/content/figure-match";
import type { Topic } from "@/content/types";

export function LessonDetail({ topic, grade, chapterTitle }: { topic: Topic; grade: number; chapterTitle: string }) {
  const figure = figureFor(topic);
  const lead = grade <= 5 ? topic.younger : topic.idea;
  const more = grade <= 5 ? (topic.idea !== topic.younger ? topic.idea : "") : topic.senior ?? "";
  const objectives = topic.keyPoints.slice(0, 3);
  const quick = topic.quiz[0];
  const [picked, setPicked] = useState<number | null>(null);
  const [showCheck, setShowCheck] = useState(false);

  return (
    <article className="lesson-detail">
      <p className="lesson-kicker">{chapterTitle}</p>
      <h1>{topic.title}</h1>
      <p className="lesson-lead">{lead}</p>

      <section>
        <h2>Learning objectives</h2>
        <div className="objective-row">
          {objectives.map((point) => (
            <article key={point}>
              <strong>{point}</strong>
            </article>
          ))}
        </div>
      </section>

      <div className="concept-pair">
        <section className="concept-block">
          <ScenePhoto name={figure.name} alt={figure.caption} />
          <h2>The idea</h2>
          {more ? <p>{more}</p> : <p>{lead}</p>}
          <Sketch name={figure.name} caption={figure.caption} />
        </section>
        <section className="example-block">
          {figure.name === "push" ? <ScenePhoto name="pull" alt="A pull brings a bag closer." /> : null}
          <h2>An everyday example</h2>
          <p>{topic.example}</p>
          <p className="check-note">
            <strong>A common mix-up. </strong>
            {topic.mistake.right}
          </p>
        </section>
      </div>

      <section className="points-block">
        <h2>Key points to remember</h2>
        <ul>
          {topic.keyPoints.map((point) => (
            <li key={point}>{point}</li>
          ))}
        </ul>
      </section>

      <section className="check-block">
        <h2>Quick check</h2>
        {quick ? (
          <>
            <p>{quick.question}</p>
            <div className="choice-grid">
              {quick.choices.map((choice, index) => {
                const state = picked === null ? "" : index === quick.answerIndex ? "is-right" : index === picked ? "is-wrong" : "";
                return (
                  <button key={choice} type="button" className={state} onClick={() => setPicked(index)}>
                    {choice}
                  </button>
                );
              })}
            </div>
            {picked !== null ? <p className="check-note">{quick.explanation}</p> : null}
          </>
        ) : (
          <>
            <p>{topic.check.question}</p>
            <button className="ghost" type="button" onClick={() => setShowCheck(true)}>
              {showCheck ? topic.check.answer : "Show the answer"}
            </button>
          </>
        )}
      </section>

      <p className="lesson-next">
        When this page makes sense, go to <Link href="/practice">Practice</Link> or <Link href="/doubts">Doubts</Link>.
      </p>
    </article>
  );
}
