import type { Chapter, Topic } from "../types";
import { middleChapters } from "./middle";
import { primaryChapters } from "./primary";
import { schoolChapters } from "./school";
import { secondaryChapters } from "./secondary";
import { seniorChapters } from "./senior";

export const chapters: Chapter[] = [
  ...primaryChapters,
  ...middleChapters,
  ...secondaryChapters,
  ...seniorChapters,
  ...schoolChapters,
];

export function chaptersForGrade(grade: number): Chapter[] {
  return chapters.filter((chapter) => chapter.grade === grade);
}

export function findTopic(id: string): { chapter: Chapter; topic: Topic } | undefined {
  for (const chapter of chapters) {
    const topic = chapter.topics.find((item) => item.id === id);
    if (topic) return { chapter, topic };
  }
  return undefined;
}

export function allTopics(): { chapter: Chapter; topic: Topic }[] {
  return chapters.flatMap((chapter) => chapter.topics.map((topic) => ({ chapter, topic })));
}
