"use client";

import { useEffect, useState } from "react";
import { ChapterScene } from "@/components/ChapterScene";
import { HearThis } from "@/components/HearThis";
import { useStudent } from "@/components/StudentProvider";
import { chaptersForGrade } from "@/content/curriculum";
import { buildQuiz } from "@/lib/quiz-set";

export default function QuizPage() {
  const { grade, studentId, ready } = useStudent();
  const [questions, setQuestions] = useState<ReturnType<typeof buildQuiz>>([]);
  const [index, setIndex] = useState(0);
  const [answers, setAnswers] = useState<Array<number | null>>([]);
  const [done, setDone] = useState(false);
  const [posted, setPosted] = useState(false);

  useEffect(() => {
    setQuestions(buildQuiz(grade));
    setIndex(0);
    setAnswers([]);
    setDone(false);
    setPosted(false);
  }, [grade]);

  const question = questions[index];
  const picked = answers[index] ?? null;
  const score = questions.reduce((sum, item, itemIndex) => sum + (answers[itemIndex] === item.answerIndex ? 1 : 0), 0);
  const young = grade <= 5;

  useEffect(() => {
    if (!done || !ready || posted || questions.length === 0) return;
    setPosted(true);
    void fetch("/api/progress", {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify({
        studentId,
        event: { type: "quiz", grade, score, total: questions.length },
      }),
    });
  }, [done, ready, posted, questions, score, studentId, grade]);

  function choose(choice: number) {
    if (!question || picked !== null) return;
    setAnswers((current) => {
      const next = current.slice();
      while (next.length < questions.length) next.push(null);
      next[index] = choice;
      return next;
    });
  }

  function move(delta: number) {
    const nextIndex = index + delta;
    if (nextIndex < 0) return;
    if (nextIndex >= questions.length) {
      if (picked !== null) setDone(true);
      return;
    }
    setIndex(nextIndex);
  }

  if (!question && !done) return <p>Gathering questions…</p>;

  return (
    <main className="page-quiz quiz-board">
      <header className="page-banner">
        <p>Class {grade}</p>
        <h1>Quiz</h1>
        <p>{young ? "Five short questions. Tap the answer that fits." : "Test what you have learned. The score is saved when you finish."}</p>
      </header>
      {done ? (
        <section className="panel quiz-done">
          <h2>
            You scored {score} out of {questions.length}
          </h2>
          <button
            className="primary"
            type="button"
            onClick={() => {
              setQuestions(buildQuiz(grade));
              setIndex(0);
              setAnswers([]);
              setDone(false);
              setPosted(false);
            }}
          >
            Try another set
          </button>
        </section>
      ) : question ? (
        <div className="quiz-layout">
          <section className="panel quiz-card">
            <div className={index % 3 === 2 ? undefined : index % 2 === 0 ? "quiz-qhead" : "quiz-qhead art-left"}>
              <div>
                <p className="muted">
                  Question {index + 1} of {questions.length}
                  {picked !== null ? ` · Score ${score}` : ""}
                </p>
                <h2>{question.question}</h2>
                {young ? <HearThis text={`${question.question}. ${question.choices.join(". ")}`} /> : null}
              </div>
              {index % 3 === 2 ? null : (
                <ChapterScene
                  chapterId={question.chapterId ?? chaptersForGrade(grade)[0]?.id ?? "c1-forces"}
                  title={question.question}
                  kind={index % 2 === 0 ? "anime" : "photo"}
                  className="quiz-art"
                />
              )}
            </div>
            <div className="quiz-choices">
              {question.choices.map((choice, choiceIndex) => {
                const revealed = picked !== null;
                const good = revealed && choiceIndex === question.answerIndex;
                const bad = revealed && choiceIndex === picked && picked !== question.answerIndex;
                return (
                  <button key={choice} className={`choice${good ? " good" : ""}${bad ? " bad" : ""}`} type="button" onClick={() => choose(choiceIndex)}>
                    {choice}
                  </button>
                );
              })}
            </div>
            <div className="quiz-nav">
              <button className="quiz-arrow" type="button" aria-label="Previous question" disabled={index === 0} onClick={() => move(-1)}>
                <svg viewBox="0 0 24 24" aria-hidden="true">
                  <path d="M14.5 5.5 8 12l6.5 6.5" />
                </svg>
              </button>
              <button
                className="quiz-arrow"
                type="button"
                aria-label={index === questions.length - 1 ? "See score" : "Next question"}
                disabled={index === questions.length - 1 && picked === null}
                onClick={() => move(1)}
              >
                <svg viewBox="0 0 24 24" aria-hidden="true">
                  <path d="M9.5 5.5 16 12l-6.5 6.5" />
                </svg>
              </button>
            </div>
          </section>
          <aside className="quiz-tip">
            <h2>Quick tip</h2>
            <p>{picked === null ? "Pick one answer. The explanation shows after you choose." : question.explanation}</p>
          </aside>
        </div>
      ) : null}
    </main>
  );
}
