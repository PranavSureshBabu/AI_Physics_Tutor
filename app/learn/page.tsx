"use client";

import { useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import { chaptersForGrade } from "@/content/curriculum";
import { ChapterPlay } from "@/components/ChapterPlay";
import { ChapterScene, chapterGallery } from "@/components/ChapterScene";
import { Sketch } from "@/components/Sketch";
import { HearThis, spokenFrom } from "@/components/HearThis";
import { TutorMessage } from "@/components/TutorMessage";
import { useStudent } from "@/components/StudentProvider";
import { chapterPages } from "@/lib/lesson";
import { readResume, writeResume } from "@/lib/study";

const olderTips = [
  "Read one page, then turn to the next.",
  "Look at the diagram before the formula.",
  "Try a numerical after the reading.",
  "Ask the Doubt Tutor if a line is unclear.",
];

const youngerTips = [
  "Look at the picture.",
  "Read one page, or tap Hear this.",
  "Then try one short question.",
  "Ask a doubt if a word is hard.",
];

export default function LearnPage() {
  const { grade, studentId, ready } = useStudent();
  const requested = useSearchParams().get("chapter");
  const chapters = chaptersForGrade(grade);
  const [openId, setOpenId] = useState<string | null>(requested);
  const [pageIndex, setPageIndex] = useState(0);
  const chapter = chapters.find((item) => item.id === openId);
  const pages = chapter ? chapterPages(chapter, grade) : [];
  const current = pages[pageIndex];
  const young = grade <= 5;
  const tips = young ? youngerTips : olderTips;

  useEffect(() => {
    if (!requested) return;
    if (chaptersForGrade(grade).some((item) => item.id === requested)) {
      setOpenId(requested);
      setPageIndex(0);
    }
  }, [requested, grade]);

  useEffect(() => {
    if (!ready || !studentId || !chapter || !current?.topicId) return;
    const topic = chapter.topics.find((item) => item.id === current.topicId);
    if (!topic) return;
    writeResume(studentId, { grade, chapterId: chapter.id, topicId: topic.id, title: topic.title });
    void fetch("/api/progress", {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify({ studentId, event: { type: "topic", grade, label: topic.title } }),
    });
  }, [ready, studentId, grade, chapter, current?.topicId]);

  function openChapter(id: string) {
    setOpenId(id);
    setPageIndex(0);
    window.scrollTo({ top: 0, behavior: "smooth" });
  }

  if (!chapter || !current) {
    const resume = ready ? readResume(studentId) : null;
    return (
      <main className="page-learn learn-list">
        <header className="learn-list-head">
          <div>
            <h1>Learn</h1>
            <p>Class {grade} chapters. Pick one, then turn the pages.</p>
          </div>
        </header>
        <div className="learn-list-grid">
          <section className="chapter-list">
            <h2>Physics chapters</h2>
            <ol>
              {chapters.map((item, index) => (
                <li key={item.id}>
                  <span>{index + 1}</span>
                  <ChapterScene
                    chapterId={item.id}
                    title={item.title}
                    kind={index % 2 === 0 ? "anime" : "photo"}
                    className="chapter-thumb"
                  />
                  <div>
                    <strong>{item.title}</strong>
                    <p>{item.promise}</p>
                  </div>
                  <button className="primary" type="button" onClick={() => openChapter(item.id)}>
                    {resume?.chapterId === item.id ? "Continue" : "Start"}
                  </button>
                </li>
              ))}
            </ol>
          </section>
          <aside className="quick-tips">
            <h2>Quick tips</h2>
            <ul>
              {tips.map((tip) => (
                <li key={tip}>{tip}</li>
              ))}
            </ul>
            <p>Every chapter you open stays inside Class {grade}.</p>
          </aside>
        </div>
      </main>
    );
  }

  const topic = current.topicId ? chapter.topics.find((item) => item.id === current.topicId) : undefined;
  const hasSketch = current.blocks.some((block) => block.type === "sketch");
  const mix = pageIndex % 7;
  const side = mix === 2 || mix === 5 ? "right" : "left";
  const showVisual = !(mix === 1 || mix === 4 || mix === 6);
  let shownBefore = 0;
  for (let index = 0; index < pageIndex; index += 1) {
    const earlier = index % 7;
    if (!(earlier === 1 || earlier === 4 || earlier === 6)) shownBefore += 1;
  }
  const gallery = chapterGallery(chapter.id);
  const useDiagram = !young && !!topic?.sketch && !hasSketch && (mix === 3 || mix === 5);
  const visual = !showVisual ? null : young && mix === 0 ? (
    <ChapterPlay chapterId={chapter.id} title={chapter.title} />
  ) : useDiagram && topic?.sketch ? (
    <Sketch name={topic.sketch} caption="" />
  ) : (
    <img className="chapter-scene" src={gallery[shownBefore % gallery.length]} alt="" />
  );

  return (
    <main className={young ? "page-learn px-lesson young-read" : "page-learn px-lesson"}>
      <header className="px-lesson-bar">
        <button className="ghost" type="button" onClick={() => setOpenId(null)}>
          All chapters
        </button>
        <strong>{chapter.title}</strong>
        <span>
          Page {pageIndex + 1} of {pages.length}
        </span>
      </header>
      {young ? <HearThis text={spokenFrom(current.blocks)} /> : null}
      <TutorMessage
        reply={{ blocks: current.blocks, topicId: current.topicId, chapterId: chapter.id }}
        visual={visual}
        side={side}
      />
      <nav className="page-turn">
        <button type="button" disabled={pageIndex <= 0} onClick={() => setPageIndex((index) => index - 1)}>
          Previous page
        </button>
        <span>
          {pageIndex + 1} / {pages.length}
        </span>
        <button type="button" disabled={pageIndex >= pages.length - 1} onClick={() => setPageIndex((index) => index + 1)}>
          Next page
        </button>
      </nav>
    </main>
  );
}
