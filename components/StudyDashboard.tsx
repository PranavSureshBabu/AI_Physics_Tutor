"use client";

import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import { chaptersForGrade } from "@/content/curriculum";
import { chapterPicture } from "@/components/ChapterScene";
import { NavIcon } from "@/components/NavIcon";
import { ProfileMenu } from "@/components/ProfileMenu";
import { useStudent } from "@/components/StudentProvider";
import type { ProgressRecord } from "@/lib/progress";
import { readResume } from "@/lib/study";

function studentName(username: string) {
  const name = username
    .trim()
    .split(/\s+/)
    .filter(Boolean)
    .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
    .join(" ");
  return name || "Student";
}

function Donut({ value }: { value: number }) {
  const radius = 42;
  const turn = 2 * Math.PI * radius;
  const gap = turn - (Math.min(100, Math.max(0, value)) / 100) * turn;
  return (
    <svg className="progress-donut" viewBox="0 0 120 120" aria-hidden="true">
      <circle cx="60" cy="60" r={radius} fill="none" stroke="#e8eef6" strokeWidth="12" />
      <circle
        cx="60"
        cy="60"
        r={radius}
        fill="none"
        stroke="#2563eb"
        strokeWidth="12"
        strokeDasharray={turn}
        strokeDashoffset={gap}
        strokeLinecap="round"
        transform="rotate(-90 60 60)"
      />
      <text x="60" y="58" textAnchor="middle" fontSize="22" fontWeight="800" fill="#0f172a">
        {value}%
      </text>
      <text x="60" y="76" textAnchor="middle" fontSize="9" fill="#64748b">
        Overall progress
      </text>
    </svg>
  );
}

function MiniRing({ value }: { value: number }) {
  const radius = 16;
  const turn = 2 * Math.PI * radius;
  const gap = turn - (Math.min(100, Math.max(0, value)) / 100) * turn;
  return (
    <svg className="mini-ring" viewBox="0 0 40 40" aria-hidden="true">
      <circle cx="20" cy="20" r={radius} fill="none" stroke="#e2e8f0" strokeWidth="4" />
      <circle
        cx="20"
        cy="20"
        r={radius}
        fill="none"
        stroke="#2563eb"
        strokeWidth="4"
        strokeDasharray={turn}
        strokeDashoffset={gap}
        strokeLinecap="round"
        transform="rotate(-90 20 20)"
      />
    </svg>
  );
}

const activityTone: Record<string, string> = {
  quiz: "violet",
  numerical: "green",
  practice: "green",
  doubt: "blue",
  topic: "amber",
  revision: "amber",
};

const activityName: Record<string, string> = {
  quiz: "Quiz",
  numerical: "Numerical",
  practice: "Practice",
  doubt: "Doubt",
  topic: "Learn",
  revision: "Revision",
};

export function StudyDashboard() {
  const { grade, username, studentId, ready } = useStudent();
  const [record, setRecord] = useState<ProgressRecord | null>(null);
  const [resumeTitle, setResumeTitle] = useState<string | null>(null);
  const [resumeChapter, setResumeChapter] = useState<string | null>(null);
  const [query, setQuery] = useState("");
  const [restarting, setRestarting] = useState(false);
  const [notice, setNotice] = useState("");
  const [slide, setSlide] = useState(0);

  useEffect(() => {
    if (!ready || !studentId) return;
    void fetch(`/api/progress?studentId=${encodeURIComponent(studentId)}&grade=${grade}`)
      .then((response) => response.json())
      .then((data: ProgressRecord) => setRecord(data))
      .catch(() => setRecord(null));
    const resume = readResume(studentId);
    setResumeTitle(resume && resume.grade === grade ? resume.title : null);
    setResumeChapter(resume && resume.grade === grade ? resume.chapterId : null);
  }, [ready, studentId, grade]);

  async function restartProgress() {
    if (!ready) return;
    const confirmed = window.confirm(`Reset Class ${grade} progress? The lessons stay. Only the scores on this page clear.`);
    if (!confirmed) return;
    setRestarting(true);
    const response = await fetch(`/api/progress?studentId=${encodeURIComponent(studentId)}&grade=${grade}`, { method: "DELETE" });
    if (response.ok) {
      setRecord((await response.json()) as ProgressRecord);
      setNotice("Progress reset for this class.");
    } else {
      setNotice("Progress could not be reset. Try again.");
    }
    setRestarting(false);
  }

  const chapters = chaptersForGrade(grade);
  const chapterRows = useMemo(() => {
    const opened = new Set(record?.topics ?? []);
    return chapters.map((chapter) => {
      const total = chapter.topics.length;
      const seen = chapter.topics.filter((topic) => opened.has(topic.title)).length;
      const sums = chapter.topics.reduce((count, topic) => count + topic.practice.length, 0);
      return { id: chapter.id, title: chapter.title, promise: chapter.promise, seen, total, sums };
    });
  }, [chapters, record?.topics]);
  const openedTopics = chapterRows.reduce((sum, row) => sum + row.seen, 0);
  const topicTotal = chapterRows.reduce((sum, row) => sum + row.total, 0);
  const sumTotal = chapterRows.reduce((sum, row) => sum + row.sums, 0);
  const finishedChapters = chapterRows.filter((row) => row.total > 0 && row.seen >= row.total).length;
  const resumeIndex = chapterRows.findIndex((row) => row.id === resumeChapter);
  const planIndex = resumeIndex >= 0 ? resumeIndex : Math.max(0, chapterRows.findIndex((row) => row.seen < row.total));
  const planRow = chapterRows[planIndex] ?? chapterRows[0] ?? null;
  const hero = chapterRows.length
    ? chapterRows[(((planIndex + slide) % chapterRows.length) + chapterRows.length) % chapterRows.length]
    : null;
  const name = studentName(username);
  const young = grade <= 5;
  const topicPercent = topicTotal > 0 ? Math.round((openedTopics / topicTotal) * 100) : 0;
  const chapterPercent = chapterRows.length ? Math.round((finishedChapters / chapterRows.length) * 100) : 0;
  const quizCount = record?.quizzes.length ?? 0;
  const quizAverage = quizCount
    ? Math.round(
        (record!.quizzes.reduce((sum, quiz) => sum + (quiz.total ? quiz.score / quiz.total : 0), 0) / quizCount) * 100,
      )
    : 0;
  const sumsChecked = record?.numericals ?? 0;
  const sumPercent = sumTotal > 0 ? Math.min(100, Math.round((sumsChecked / sumTotal) * 100)) : 0;
  const doubts = record?.doubts ?? 0;
  const today = new Date().toLocaleDateString("en-GB", {
    weekday: "short",
    day: "numeric",
    month: "short",
    year: "numeric",
  });
  const q = query.trim().toLowerCase();
  const matches = q
    ? chapters.flatMap((chapter) => {
        const rows: { id: string; label: string }[] = [];
        if (chapter.title.toLowerCase().includes(q)) rows.push({ id: chapter.id, label: chapter.title });
        chapter.topics.forEach((topic) => {
          if (topic.title.toLowerCase().includes(q)) rows.push({ id: chapter.id, label: `${chapter.title} · ${topic.title}` });
        });
        return rows;
      }).slice(0, 8)
    : [];

  const sumLabel = young ? "Try a sum" : "Numerical Solver";
  const doubtLabel = young ? "Ask a doubt" : "Doubt Tutor";
  const plan = [
    {
      n: "1",
      tone: "blue",
      href: planRow ? `/learn?chapter=${planRow.id}` : "/learn",
      title: planRow ? planRow.title : "Learn",
      line: young ? "Open the chapter and look at the picture." : "Continue this chapter.",
      action: "Continue",
    },
    {
      n: "2",
      tone: "green",
      href: "/numericals",
      title: young ? "Try a sum" : "Solve numerical problems",
      line: young ? "Read the hint, then show the answer." : "Work a sum from the chapter.",
      action: "Start",
    },
    {
      n: "3",
      tone: "violet",
      href: "/doubts",
      title: doubtLabel,
      line: young ? "Tap Speak, or type a short question." : "Ask in your own words.",
      action: "Start",
    },
    {
      n: "4",
      tone: "amber",
      href: "/quiz",
      title: "Quiz",
      line: young ? "Five short questions." : "Questions from this class.",
      action: "Start",
    },
  ];
  const access = [
    { href: "/learn", label: "Learn", tone: "blue", icon: "learn", line: young ? "Read the chapter and look at the pictures." : "Read chapters and view the ideas." },
    { href: "/numericals", label: sumLabel, tone: "green", icon: "numericals", line: young ? "A hint first, then the answer." : "Practice problems with the working checked." },
    { href: "/doubts", label: doubtLabel, tone: "violet", icon: "doubts", line: young ? "Ask a short question." : "Ask a question and get an answer." },
    { href: "/quiz", label: "Quiz", tone: "amber", icon: "quiz", line: young ? "Five short questions." : "Test what you have read." },
    { href: "/revision", label: "Revision", tone: "sky", icon: "revision", line: young ? "A few lines to remember." : "Notes and key formulas." },
  ];
  const tips = young
    ? ["Look at the picture.", "Read one page, or tap Hear this.", "Show the hint before the answer.", "Ask if a word is hard.", "Take a short quiz when the chapter feels familiar."]
    : ["Read the page beside the picture.", "Look at the diagram before the formula.", "Try a numerical problem yourself.", "Ask a doubt when a line is unclear.", "Take a short quiz to check the chapter."];
  const heroSeen = hero && hero.total > 0 ? Math.round((hero.seen / hero.total) * 100) : 0;
  const recent = record?.recent.slice(0, 4) ?? [];

  return (
    <div className="home-page">
      <div className="home-topbar">
        <form className="home-search" onSubmit={(event) => event.preventDefault()}>
          <span className="search-glyph" aria-hidden="true">
            <svg viewBox="0 0 24 24">
              <circle cx="11" cy="11" r="6.5" />
              <path d="M16 16.5 20 20.5" />
            </svg>
          </span>
          <input
            value={query}
            onChange={(event) => setQuery(event.target.value)}
            placeholder="Search chapters, topics, or ask a question..."
            aria-label="Search chapters and topics"
          />
          {q ? (
            <ul>
              {matches.length === 0 ? <li>No chapter or topic uses that name in Class {grade}.</li> : null}
              {matches.map((hit) => (
                <li key={`${hit.id}-${hit.label}`}>
                  <Link href={`/learn?chapter=${hit.id}`}>{hit.label}</Link>
                </li>
              ))}
            </ul>
          ) : null}
        </form>
        <ProfileMenu />
      </div>
    <div className="home-board">
      <div className="home-main">
        <section className="hello-banner">
          <div className="hello-copy">
            <h1>Hello, {name}!</h1>
            <p className="hello-lead">Let&apos;s make physics simple, fun and exciting!</p>
            <p className="hello-sub">
              {young ? "Look, learn, and try one small thing at a time." : "Explore, learn, practice and grow — one chapter at a time."}
            </p>
            <div className="hello-stats">
              <div className="stat-pill">
                <span className="stat-ico blue">
                  <NavIcon name="progress" />
                </span>
                <div>
                  <strong>Class {grade}</strong>
                  <span>Your class</span>
                </div>
              </div>
              <div className="stat-pill">
                <span className="stat-ico sky">
                  <NavIcon name="learn" />
                </span>
                <div>
                  <strong>{chapters.length}</strong>
                  <span>Chapters</span>
                </div>
              </div>
              <div className="stat-pill">
                <span className="stat-ico amber">
                  <NavIcon name="quiz" />
                </span>
                <div>
                  <strong>{quizCount}</strong>
                  <span>{quizCount === 1 ? "Quiz done" : "Quizzes done"}</span>
                </div>
              </div>
              <div className="stat-pill">
                <MiniRing value={topicPercent} />
                <div>
                  <strong>{topicPercent}%</strong>
                  <span>Overall progress</span>
                </div>
              </div>
            </div>
          </div>
          <img className="hello-art" src="/scenes/dash-hello.png" alt="" />
        </section>

        <section className="home-block">
          <div className="block-head">
            <h2>
              <span className="head-bolt" aria-hidden="true">
                ⚡
              </span>
              Quick Access
            </h2>
            <p>Jump directly to what you want to do.</p>
          </div>
          <div className="access-grid">
            {access.map((item) => (
              <Link className={`access-card tone-${item.tone}`} key={item.href} href={item.href}>
                <span className="access-ico">
                  <NavIcon name={item.icon} />
                </span>
                <strong>{item.label}</strong>
                <p>{item.line}</p>
                <span className="access-go" aria-hidden="true">
                  →
                </span>
              </Link>
            ))}
          </div>
        </section>

        {hero ? (
          <section className="continue-card">
            <button type="button" className="slide-btn" aria-label="Previous chapter" onClick={() => setSlide((value) => value - 1)}>
              ‹
            </button>
            <img src={chapterPicture(hero.id, "photo")} alt="" />
            <div>
              <p className="continue-kicker">Continue learning</p>
              <h2>{hero.title}</h2>
              <p>{hero.promise}</p>
              {resumeChapter === hero.id && resumeTitle ? <p className="last-page">Last page: {resumeTitle}</p> : null}
              <div className="meter-line" aria-hidden="true">
                <i style={{ width: `${heroSeen}%` }} />
              </div>
              <p className="meter-caption">
                {hero.seen} / {hero.total} topics opened
              </p>
            </div>
            <Link className="primary continue-btn" href={`/learn?chapter=${hero.id}`}>
              Continue Learning
            </Link>
            <button type="button" className="slide-btn" aria-label="Next chapter" onClick={() => setSlide((value) => value + 1)}>
              ›
            </button>
          </section>
        ) : null}

        <section className="home-block recent-block">
          <div className="block-head">
            <h2>Recent Activity</h2>
            <p>Your latest learning progress.</p>
          </div>
          {recent.length ? (
            <div className="activity-grid">
              {recent.map((item) => (
                <article key={`${item.at}-${item.label}`} className={`activity-card tone-${activityTone[item.kind] ?? "blue"}`}>
                  <strong>{activityName[item.kind] ?? item.kind}</strong>
                  <p>{item.label}</p>
                  <time dateTime={item.at}>
                    {new Date(item.at).toLocaleDateString("en-GB", { day: "numeric", month: "short", year: "numeric" })}
                  </time>
                </article>
              ))}
            </div>
          ) : (
            <p className="empty-activity">Nothing yet. Open a chapter and the list starts here.</p>
          )}
        </section>

        <p className="home-foot">Physics is not just a subject, it&apos;s the key to understanding the world around you.</p>
      </div>

      <aside className="home-side">
        <section className="side-card">
          <div className="block-head">
            <h2>Today&apos;s Learning Plan</h2>
            <p>{today}</p>
          </div>
          <p className="plan-order">Start at blue. Then green, purple, and orange.</p>
          <ol className="plan-list">
            {plan.map((step) => (
              <li key={step.n} className={`tone-${step.tone}`}>
                <span>{step.n}</span>
                <div>
                  <strong>{step.title}</strong>
                  <p>{step.line}</p>
                </div>
                <Link href={step.href}>{step.action}</Link>
              </li>
            ))}
          </ol>
        </section>

        <section className="side-card progress-card">
          <h2>Your Progress</h2>
          <Donut value={topicPercent} />
          <ul className="bar-list">
            <li>
              <div>
                <span>Chapters finished</span>
                <b>
                  {finishedChapters} / {chapterRows.length}
                </b>
              </div>
              <i className="bar blue">
                <em style={{ width: `${chapterPercent}%` }} />
              </i>
            </li>
            <li>
              <div>
                <span>Quiz average</span>
                <b>{quizCount ? `${quizAverage}%` : "—"}</b>
              </div>
              <i className="bar green">
                <em style={{ width: `${quizAverage}%` }} />
              </i>
            </li>
            <li>
              <div>
                <span>Sums checked</span>
                <b>
                  {sumsChecked} / {sumTotal}
                </b>
              </div>
              <i className="bar violet">
                <em style={{ width: `${sumPercent}%` }} />
              </i>
            </li>
            <li>
              <div>
                <span>Topics opened</span>
                <b>
                  {openedTopics} / {topicTotal}
                </b>
              </div>
              <i className="bar amber">
                <em style={{ width: `${topicPercent}%` }} />
              </i>
            </li>
          </ul>
          <p className="doubt-count">Doubts asked · {doubts}</p>
        </section>

        <section className="keep-card">
          <span aria-hidden="true">🏆</span>
          <div>
            <strong>Keep Going!</strong>
            <p>
              {young
                ? "You are doing well. Open the next picture and keep going."
                : finishedChapters
                  ? `${finishedChapters} ${finishedChapters === 1 ? "chapter is" : "chapters are"} finished. Keep the next one moving.`
                  : "You are doing well. Finish the open chapter, then try a sum."}
            </p>
          </div>
        </section>

        <section className="side-card">
          <h2>Quick Tips</h2>
          <ul className="tip-list">
            {tips.map((tip) => (
              <li key={tip}>{tip}</li>
            ))}
          </ul>
        </section>

        <button className="reset-card" type="button" onClick={() => void restartProgress()} disabled={!ready || restarting}>
          <span aria-hidden="true">↺</span>
          <div>
            <strong>{restarting ? "Resetting…" : "Reset Progress"}</strong>
            <p>Start fresh and practise again.</p>
          </div>
        </button>
        {notice ? <p className="reset-notice">{notice}</p> : null}
      </aside>
    </div>
    </div>
  );
}
