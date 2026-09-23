import { allTopics } from "@/content/curriculum";
import type { Chapter, Topic } from "@/content/types";

type Chunk = {
  grade: number;
  chapter: Chapter;
  topic: Topic;
  text: string;
};

const STOP = new Set([
  "the", "and", "for", "what", "is", "how", "does", "why", "are", "was", "were", "a", "an", "of",
  "to", "in", "on", "my", "class", "explain", "please", "tell", "me", "about", "this", "that",
  "with", "from", "your", "can", "you", "its", "it", "do", "did", "define", "meaning", "mean",
]);

const chunks: Chunk[] = allTopics().map(({ chapter, topic }) => ({
  grade: chapter.grade,
  chapter,
  topic,
  text: [
    topic.title,
    ...(topic.aliases ?? []),
    topic.idea,
    topic.younger,
    topic.senior ?? "",
    topic.example,
    topic.mistake.wrong,
    topic.mistake.right,
    topic.check.question,
    ...topic.keyPoints,
  ].join(" "),
}));

function phrase(text: string): string {
  return ` ${text
    .toLowerCase()
    .replace(/'/g, "")
    .replace(/[^a-z0-9+.-]+/g, " ")
    .replace(/\s+/g, " ")
    .trim()} `;
}

function tokens(text: string): string[] {
  return text
    .toLowerCase()
    .replace(/[^a-z0-9+.-]+/g, " ")
    .split(/\s+/)
    .filter((word) => word.length > 2 && !STOP.has(word));
}

const documentFrequency = new Map<string, number>();
for (const chunk of chunks) {
  for (const token of new Set(tokens(chunk.text))) {
    documentFrequency.set(token, (documentFrequency.get(token) ?? 0) + 1);
  }
}

function idf(token: string): number {
  return Math.log((chunks.length + 1) / ((documentFrequency.get(token) ?? 0) + 1)) + 1;
}

export type Retrieval = {
  chapter: Chapter;
  topic: Topic;
  confidence: "high" | "low";
  score: number;
  sameGrade: boolean;
};

function scoreChunk(query: string, queryTokens: string[], chunk: Chunk, preferredTopicId?: string): number {
  const haystack = new Set(tokens(chunk.text));
  let score = 0;
  for (const token of queryTokens) {
    if (haystack.has(token)) score += idf(token);
  }
  const titleTokens = new Set(tokens(chunk.topic.title));
  for (const token of queryTokens) {
    if (titleTokens.has(token)) score += 3;
  }
  const padded = phrase(query);
  for (const alias of chunk.topic.aliases ?? []) {
    const needle = phrase(alias);
    if (needle.trim().length > 2 && padded.includes(needle)) score += 8;
  }
  if (preferredTopicId && preferredTopicId === chunk.topic.id) score += 5;
  return score;
}

export function retrieve(query: string, grade: number, preferredTopicId?: string): Retrieval | null {
  const queryTokens = tokens(query);
  const ranked = chunks
    .map((chunk) => ({
      chunk,
      score: scoreChunk(query, queryTokens, chunk, preferredTopicId),
    }))
    .filter((item) => item.score > 0)
    .sort((a, b) => b.score - a.score);

  const own = ranked.filter((item) => item.chunk.grade === grade);
  const bestOwn = own[0];
  const secondOwn = own[1];
  if (bestOwn && bestOwn.score >= 6 && (!secondOwn || bestOwn.score >= secondOwn.score + 0.5 || bestOwn.chunk.topic.id === secondOwn.chunk.topic.id)) {
    return {
      chapter: bestOwn.chunk.chapter,
      topic: bestOwn.chunk.topic,
      confidence: "high",
      score: bestOwn.score,
      sameGrade: true,
    };
  }
  if (bestOwn && bestOwn.score >= 4 && (!secondOwn || bestOwn.score > secondOwn.score + 1)) {
    return {
      chapter: bestOwn.chunk.chapter,
      topic: bestOwn.chunk.topic,
      confidence: "high",
      score: bestOwn.score,
      sameGrade: true,
    };
  }

  const aliasHits = ranked.filter((item) => item.score >= 8);
  if (aliasHits.length) {
    const closest = [...aliasHits].sort(
      (a, b) => Math.abs(a.chunk.grade - grade) - Math.abs(b.chunk.grade - grade),
    )[0];
    return {
      chapter: closest.chunk.chapter,
      topic: closest.chunk.topic,
      confidence: "high",
      score: closest.score,
      sameGrade: closest.chunk.grade === grade,
    };
  }

  if (bestOwn) {
    return {
      chapter: bestOwn.chunk.chapter,
      topic: bestOwn.chunk.topic,
      confidence: "low",
      score: bestOwn.score,
      sameGrade: true,
    };
  }
  return null;
}
