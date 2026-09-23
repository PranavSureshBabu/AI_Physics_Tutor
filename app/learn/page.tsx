"use client";

import { useEffect, useState } from "react";
import { chaptersForGrade } from "@/content/curriculum";
import { TutorMessage } from "@/components/TutorMessage";
import { useStudent } from "@/components/StudentProvider";
import { chapterPages } from "@/lib/lesson";

export default function LearnPage() {
  const { grade, studentId, ready } = useStudent();
  const chapters = chaptersForGrade(grade);
  const [chapterId, setChapterId] = useState(chapters[0]?.id ?? "");
  const chapter = chapters.find((item) => item.id === chapterId) ?? chapters[0];
  const pages = chapter ? chapterPages(chapter, grade) : [];
  const [pageIndex, setPageIndex] = useState(0);
  const safeIndex = Math.min(pageIndex, Math.max(pages.length - 1, 0));
  const page = pages[safeIndex];
  const topic = chapter?.topics.find((item) => item.id === page?.topicId);

  useEffect(() => {
    const nextChapters = chaptersForGrade(grade);
    setChapterId(nextChapters[0]?.id ?? "");
    setPageIndex(0);
  }, [grade]);

  useEffect(() => {
    if (!ready || !topic) return;
    void fetch("/api/progress", {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify({ studentId, event: { type: "topic", grade, label: topic.title } }),
    });
  }, [ready, studentId, grade, topic]);

  function openChapter(id: string) {
    setChapterId(id);
    setPageIndex(0);
    window.scrollTo({ top: 0, behavior: "smooth" });
  }

  function openTopic(id: string) {
    const index = pages.findIndex((item) => item.topicId === id);
    setPageIndex(index < 0 ? 0 : index);
    window.scrollTo({ top: 0, behavior: "smooth" });
  }

  function turn(next: number) {
    setPageIndex(next);
    window.scrollTo({ top: 0, behavior: "smooth" });
  }

  if (!chapter || !page) return <p>No notes for this class yet.</p>;

  return (
    <main className="layout-2">
      <aside className="panel">
        <p className="muted" style={{ marginTop: 0 }}>
          Subject · {grade <= 10 && grade >= 6 ? "Science" : grade >= 11 ? "Physics" : "First ideas"}
        </p>
        {chapters.map((item, index) => (
          <button
            key={item.id}
            className={item.id === chapter.id ? "chapter-button on" : "chapter-button"}
            type="button"
            onClick={() => openChapter(item.id)}
          >
            <span className="chapter-index">{index + 1}</span>
            <span>{item.title}</span>
          </button>
        ))}
        <hr />
        {chapter.topics.map((item) => (
          <button
            key={item.id}
            className={item.id === page.topicId ? "topic-button on" : "topic-button"}
            type="button"
            onClick={() => openTopic(item.id)}
          >
            {item.title}
          </button>
        ))}
      </aside>
      <div>
        <header className="book-banner">
          <p className="muted" style={{ margin: 0, fontWeight: 800 }}>
            Class {grade} · page {safeIndex + 1} of {pages.length}
          </p>
          <strong>{chapter.title}</strong>
        </header>
        <TutorMessage reply={{ blocks: page.blocks, chapterId: chapter.id, topicId: page.topicId }} />
        <nav className="page-turn">
          <button type="button" disabled={safeIndex === 0} onClick={() => turn(safeIndex - 1)}>
            Previous page
          </button>
          <span>
            {safeIndex + 1} / {pages.length}
          </span>
          <button type="button" disabled={safeIndex >= pages.length - 1} onClick={() => turn(safeIndex + 1)}>
            Next page
          </button>
        </nav>
      </div>
    </main>
  );
}
