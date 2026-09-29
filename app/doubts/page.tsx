"use client";

import { useEffect, useState } from "react";
import { ChapterScene } from "@/components/ChapterScene";
import { chaptersForGrade } from "@/content/curriculum";
import { ChatPanel } from "@/components/ChatPanel";
import { useStudent } from "@/components/StudentProvider";
import { forgetDoubt, readDoubts, type DoubtNote } from "@/lib/study";

export default function DoubtsPage() {
  const { grade, studentId, ready } = useStudent();
  const scenes = chaptersForGrade(grade).slice(0, 2);
  const [history, setHistory] = useState<DoubtNote[]>([]);
  const [seed, setSeed] = useState("");
  const suggestions =
    grade <= 2
      ? ["What is a push?", "Why do we see a shadow?", "How is a sound made?"]
      : grade <= 5
        ? ["What is a magnet?", "Why does something float?", "What makes a shadow?"]
        : grade <= 8
        ? ["What is speed?", "Why do magnets repel?", "What is pressure?"]
        : grade <= 10
          ? ["What is velocity?", "Explain Ohm's law", "What is an echo?"]
          : ["What is capacitance?", "Explain the photoelectric effect", "What is half-life?"];

  useEffect(() => {
    if (!ready) return;
    setHistory(readDoubts(studentId).filter((item) => item.grade === grade));
  }, [ready, studentId, grade]);

  return (
    <main className="page-doubts">
      <header className="page-banner doubts">
        <p>Class {grade}</p>
        <h1>{grade <= 5 ? "Ask a doubt" : "Doubt Tutor"}</h1>
        <p>{grade <= 5 ? "Tap Speak, or type a short question. The answer stays in your class." : "Ask in your own words. The answer stays inside Class " + grade + ", in language meant for that class."}</p>
      </header>
      <div className="doubt-board">
        <ChatPanel key={seed} mode="doubt" placeholder={grade <= 5 ? "A short question" : "Type your question here"} suggestions={seed ? [seed, ...suggestions] : suggestions} />
        <aside className="doubt-cheer">
          {grade <= 5 && scenes[0] ? (
            <ChapterScene chapterId={scenes[0].id} title={scenes[0].title} kind="anime" className="chapter-scene" />
          ) : (
            <img src="/scenes/doubt-ask.jpg" alt="A student ready to ask a question" />
          )}
          {grade > 5 && scenes[0] ? <ChapterScene chapterId={scenes[0].id} title={scenes[0].title} kind="anime" className="chapter-scene" /> : null}
          <h2>No doubt is too small</h2>
          <p>{grade <= 5 ? "Ask about something from your chapter." : `Ask anything from Class ${grade}. The tutor stays in that class.`}</p>
          <h3>Questions you asked</h3>
          {history.length === 0 ? <p className="muted">Nothing is saved yet.</p> : null}
          <ul>
            {history.map((item) => (
              <li key={item.at}>
                <button type="button" onClick={() => setSeed(item.text)}>
                  {item.text}
                </button>
                <button type="button" onClick={() => setHistory(forgetDoubt(studentId, item.at).filter((note) => note.grade === grade))}>
                  Delete
                </button>
              </li>
            ))}
          </ul>
        </aside>
      </div>
    </main>
  );
}
