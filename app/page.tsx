"use client";

import Link from "next/link";
import { useState } from "react";
import { ClassArt } from "@/components/ClassArt";
import { TOOLS } from "@/components/nav";
import { useStudent } from "@/components/StudentProvider";
import { bands, grades } from "@/content/grades";

const groups = ["Study", "Practice", "Review"] as const;

export default function HomePage() {
  const { grade, username, classOpen, confirmClass, reopenClass, signOut } = useStudent();
  const info = grades.find((item) => item.grade === grade);
  const [picked, setPicked] = useState("");

  if (!classOpen) {
    return (
      <main className="class-stage">
        <div className="class-photos" aria-hidden="true">
          <img src="/photos/children-young.jpg" alt="" />
          <img src="/photos/children-class.jpg" alt="" />
          <img src="/photos/children-lab.jpg" alt="" />
        </div>
        <section className="class-panel">
          <p className="eyebrow">Hello, {username}</p>
          <h1 className="page-title">Select your class</h1>
          <p className="class-lead">
            Choose the class you study. The next page opens only that class.
          </p>
          <label className="class-select tall">
            Your class
            <select
              value={picked}
              onChange={(event) => {
                const next = event.target.value;
                setPicked(next);
                if (next) confirmClass(Number(next));
              }}
              aria-label="Select your class"
            >
              <option value="">Select your class</option>
              {bands.map((band) => (
                <optgroup key={band.id} label={band.name}>
                  {band.grades.map((item) => (
                    <option key={item} value={item}>
                      Class {item}
                    </option>
                  ))}
                </optgroup>
              ))}
            </select>
          </label>
          <button className="text-button" type="button" onClick={signOut}>
            Sign out
          </button>
        </section>
      </main>
    );
  }

  return (
    <main className="home">
      <section className="class-ready">
        <div className={`class-portrait band-${info?.band ?? "primary"}`}>
          <ClassArt grade={grade} />
        </div>
        <div>
          <p className="eyebrow">{info?.label}</p>
          <h1>{info?.subject}</h1>
          <p>{info?.summary}</p>
        </div>
        <button className="ghost" type="button" onClick={reopenClass}>
          Change class
        </button>
      </section>
      {groups.map((group) => (
        <section key={group} className="room-group">
          <h2>{group}</h2>
          <div className="room-grid">
            {TOOLS.filter((tool) => tool.group === group).map((tool) => (
              <Link key={tool.href} href={tool.href} className={`room-card shape-${tool.href.slice(1)} room-${group.toLowerCase()}`}>
                <h3>{tool.label}</h3>
                <p>{tool.note}</p>
              </Link>
            ))}
          </div>
        </section>
      ))}
    </main>
  );
}
