"use client";

import { useEffect, useState } from "react";
import { chaptersForGrade } from "@/content/curriculum";
import type { QuizItem } from "@/content/types";
import { useStudent } from "@/components/StudentProvider";

function shuffle(items: QuizItem[]): QuizItem[] {
  const copy = [...items];
  for (let index = copy.length - 1; index > 0; index -= 1) {
    const swap = Math.floor(Math.random() * (index + 1));
    [copy[index], copy[swap]] = [copy[swap], copy[index]];
  }
  return copy.slice(0, 5);
}

export default function QuizPage() {
  const { grade, studentId, ready } = useStudent();
  const [questions, setQuestions] = useState<QuizItem[]>([]);
  const [index, setIndex] = useState(0);
  const [picked, setPicked] = useState<number | null>(null);
  const [score, setScore] = useState(0);
  const [done, setDone] = useState(false);

  useEffect(() => {
    const pool = chaptersForGrade(grade).flatMap((chapter) => chapter.topics.flatMap((topic) => topic.quiz));
    setQuestions(shuffle(pool));
    setIndex(0);
    setPicked(null);
    setScore(0);
    setDone(false);
  }, [grade]);

  const question = questions[index];

  async function choose(choice: number) {
    if (!question || picked !== null) return;
    const correct = choice === question.answerIndex;
    const nextScore = score + (correct ? 1 : 0);
    setPicked(choice);
    setScore(nextScore);
    const last = index === questions.length - 1;
    if (last && ready) {
      await fetch("/api/progress", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({
          studentId,
          event: { type: "quiz", grade, score: nextScore, total: questions.length },
        }),
      });
    }
  }

  if (!question && !done) return <p>Gathering questions…</p>;

  return (
    <main className="panel">
      <h1 className="page-title">Quiz</h1>
      {done ? (
        <p>
          You scored {score} out of {questions.length}.
        </p>
      ) : question ? (
        <div>
          <p className="muted">
            Question {index + 1} of {questions.length}
          </p>
          <h2>{question.question}</h2>
          <div className="choice-grid">
            {question.choices.map((choice, choiceIndex) => {
              const revealed = picked !== null;
              const good = revealed && choiceIndex === question.answerIndex;
              const bad = revealed && choiceIndex === picked && picked !== question.answerIndex;
              return (
                <button
                  key={choice}
                  className={`choice${good ? " good" : ""}${bad ? " bad" : ""}`}
                  type="button"
                  onClick={() => choose(choiceIndex)}
                >
                  {choice}
                </button>
              );
            })}
          </div>
          {picked !== null ? <p>{question.explanation}</p> : null}
          {picked !== null ? (
            <button
              className="primary"
              type="button"
              onClick={() => {
                if (index === questions.length - 1) setDone(true);
                else {
                  setIndex(index + 1);
                  setPicked(null);
                }
              }}
            >
              {index === questions.length - 1 ? "See score" : "Next"}
            </button>
          ) : null}
        </div>
      ) : null}
    </main>
  );
}
