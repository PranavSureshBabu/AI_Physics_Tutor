"use client";

import { useState } from "react";
import { practiceForGrade } from "@/lib/practice-set";
import { useStudent } from "@/components/StudentProvider";

export default function PracticePage() {
  const { grade, studentId, ready } = useStudent();
  const items = practiceForGrade(grade);
  const young = grade <= 5;
  const [index, setIndex] = useState(0);
  const [hintOpen, setHintOpen] = useState(false);
  const [answerOpen, setAnswerOpen] = useState(false);
  const item = items[index];

  function move(step: number) {
    setIndex((value) => Math.min(items.length - 1, Math.max(0, value + step)));
    setHintOpen(false);
    setAnswerOpen(false);
  }

  async function mark(correct: boolean) {
    if (!ready || !item) return;
    await fetch("/api/progress", {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify({ studentId, event: { type: "practice", grade, label: item.question, correct } }),
    });
  }

  return (
    <main className="page-practice">
      <header className="page-banner">
        <p>Class {grade}</p>
        <h1>Practice</h1>
        <p>
          {young
            ? "One question at a time. Hint opens a nudge. Show the answer opens the full line."
            : "One question at a time. Use the arrows. Hint opens a nudge. Show the answer opens the full line."}
        </p>
      </header>
      {item ? (
        <section className="panel practice-card">
          <p className="muted">
            Question {index + 1} of {items.length}
            {item.topic ? ` · ${item.topic}` : ""}
          </p>
          <h2>{item.question}</h2>
          <div className="practice-actions">
            <button className="ghost" type="button" onClick={() => setHintOpen((open) => !open)}>
              {hintOpen ? "Hide hint" : "Show hint"}
            </button>
            <button className="ghost" type="button" onClick={() => setAnswerOpen((open) => !open)}>
              {answerOpen ? "Hide answer" : "Show the answer"}
            </button>
          </div>
          <p className="practice-note">Show hint gives a short nudge. Show the answer writes the full line under the question.</p>
          {hintOpen ? (
            <div className="reveal hint-box">
              <strong>Hint</strong>
              <p>{item.hint || "There is no extra hint for this question. Try it from the words above."}</p>
            </div>
          ) : null}
          {answerOpen ? (
            <div className="reveal answer-box">
              <strong>Answer</strong>
              <p>{item.answer || "This question has no stored answer line."}</p>
              <div className="practice-actions">
                <button className="primary" type="button" onClick={() => void mark(true)}>
                  I got it
                </button>
                <button className="ghost" type="button" onClick={() => void mark(false)}>
                  Not yet
                </button>
              </div>
            </div>
          ) : null}
          <div className="quiz-nav">
            <button className="quiz-arrow" type="button" aria-label="Previous question" disabled={index === 0} onClick={() => move(-1)}>
              <svg viewBox="0 0 24 24" aria-hidden="true">
                <path d="M14.5 5.5 8 12l6.5 6.5" />
              </svg>
            </button>
            <button className="quiz-arrow" type="button" aria-label="Next question" disabled={index >= items.length - 1} onClick={() => move(1)}>
              <svg viewBox="0 0 24 24" aria-hidden="true">
                <path d="M9.5 5.5 16 12l-6.5 6.5" />
              </svg>
            </button>
          </div>
        </section>
      ) : (
        <p>This class has no practice questions yet.</p>
      )}
    </main>
  );
}
