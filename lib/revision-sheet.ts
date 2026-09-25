import { furtherFor } from "@/content/curriculum/further";
import type { Chapter, Topic } from "@/content/types";

export type RevisionTopic = {
  id: string;
  title: string;
  keep: string;
  senior?: string;
  points: string[];
  more: string[];
  example: string;
  check: { question: string; answer: string };
  mistake: { wrong: string; right: string };
};

export function revisionTopics(chapter: Chapter, grade: number): RevisionTopic[] {
  return chapter.topics.map((topic) => sheet(topic, grade));
}

function sheet(topic: Topic, grade: number): RevisionTopic {
  const keep = grade <= 5 ? topic.younger : topic.idea;
  const more = sentences(topic, keep);
  if (grade <= 5 && norm(topic.idea) !== norm(keep)) more.unshift(topic.idea);
  if (grade > 5 && norm(topic.younger) !== norm(keep)) more.unshift(topic.younger);

  return {
    id: topic.id,
    title: topic.title,
    keep,
    senior: grade >= 11 ? topic.senior : undefined,
    points: topic.keyPoints,
    more: unique(more, topic.keyPoints),
    example: topic.example,
    check: topic.check,
    mistake: topic.mistake,
  };
}

function sentences(topic: Topic, keep: string): string[] {
  const blocked = new Set([norm(keep), norm(topic.example), ...topic.keyPoints.map(norm)]);
  const lines: string[] = [];
  for (const paragraph of furtherFor(topic.id)) {
    for (const line of paragraph.split(/(?<=[.!?])\s+/)) {
      const trimmed = line.trim();
      if (trimmed.length < 24 || blocked.has(norm(trimmed))) continue;
      lines.push(trimmed);
    }
  }
  return lines;
}

function unique(lines: string[], points: string[]): string[] {
  const seen = new Set(points.map(norm));
  const kept: string[] = [];
  for (const line of lines) {
    const key = norm(line);
    if (!key || seen.has(key)) continue;
    seen.add(key);
    kept.push(line);
  }
  return kept;
}

function norm(value: string): string {
  return value.trim().toLowerCase().replace(/\s+/g, " ");
}
