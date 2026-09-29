"use client";

import { useState } from "react";
import { chaptersForGrade } from "@/content/curriculum";
import { ChapterScene } from "@/components/ChapterScene";
import { ChatPanel } from "@/components/ChatPanel";
import { FormulaLab } from "@/components/FormulaLab";
import { benchFor } from "@/lib/calculators";
import { extraSums } from "@/lib/extra-sums";
import { useStudent } from "@/components/StudentProvider";

export default function NumericalsPage() {
  const { grade } = useStudent();
  const young = grade <= 5;
  const chapters = chaptersForGrade(grade);
  const bench = benchFor(grade);
  const [chapterId, setChapterId] = useState(chapters[0]?.id ?? "");
  const chapter = chapters.find((item) => item.id === chapterId) ?? chapters[0];
  const problems = chapter
    ? [
        ...chapter.topics.flatMap((topic) => topic.practice.map((item) => ({ ...item, topic: topic.title }))),
        ...extraSums(chapter.id),
      ]
    : [];
  const [problemId, setProblemId] = useState(problems[0]?.id ?? "");
  const [answerOpen, setAnswerOpen] = useState(false);
  const problem = problems.find((item) => item.id === problemId) ?? problems[0];

  function chooseChapter(id: string) {
    setChapterId(id);
    const next = chapters.find((item) => item.id === id);
    const first = next ? [...next.topics.flatMap((topic) => topic.practice), ...extraSums(next.id)][0] : undefined;
    setProblemId(first?.id ?? "");
    setAnswerOpen(false);
  }

  return (
    <main className="page-sums">
      <header className="page-banner sums">
        <p>Class {grade}</p>
        <h1>{young ? "Try a sum" : "Numerical Solver"}</h1>
        <p>{young ? "Pick a question. Read the hint. Show the answer when you have tried." : "Pick a chapter, open a problem, then read the steps. A typed sum is checked only when the numbers can be verified."}</p>
      </header>
      <div className="solver-board">
        <aside className="solver-list">
          <label>
            Chapter
            <select value={chapter?.id ?? ""} onChange={(event) => chooseChapter(event.target.value)} aria-label="Chapter">
              {chapters.map((item, index) => (
                <option key={item.id} value={item.id}>
                  {index + 1}. {item.title}
                </option>
              ))}
            </select>
          </label>
          <h2>Problems</h2>
          <ol>
            {problems.map((item, index) => (
              <li key={item.id}>
                <button type="button" className={item.id === problem?.id ? "on" : undefined} onClick={() => { setProblemId(item.id); setAnswerOpen(false); }}>
                  <span>{index + 1}</span>
                  {item.topic}
                </button>
              </li>
            ))}
          </ol>
        </aside>
        <section className="solver-sheet">
        <div className="flow-copy">
          {problem && chapters.findIndex((item) => item.id === chapter?.id) % 3 !== 2 ? (
            <div className={`text-fig side-${problems.findIndex((item) => item.id === problem.id) % 2 === 0 ? "left" : "right"}`}>
              <ChapterScene
                chapterId={chapter?.id ?? ""}
                title={problem.topic}
                kind={problems.findIndex((item) => item.id === problem.id) % 2 === 0 ? "anime" : "photo"}
              />
            </div>
          ) : null}
          {problem ? (
            <>
              <p className="lesson-kicker">{problem.topic}</p>
              <h2>Problem</h2>
              <p>{problem.question}</p>
              <h3>Solution</h3>
              <p>
                <strong>Hint. </strong>
                {problem.hint}
              </p>
              {young && !answerOpen ? (
                <button className="primary" type="button" onClick={() => setAnswerOpen(true)}>
                  Show the answer
                </button>
              ) : (
                <p>
                  <strong>Answer. </strong>
                  {problem.answer}
                </p>
              )}
            </>
          ) : (
            <p>This chapter has no stored sums. Type one below.</p>
          )}
        </div>
          <ChatPanel
            mode="numerical"
            placeholder={young ? "Or say the question in a few words" : "Type your own sum with the numbers"}
            suggestions={problem ? [problem.question] : []}
          />
          {bench ? <FormulaLab grade={grade} /> : null}
        </section>
      </div>
    </main>
  );
}
