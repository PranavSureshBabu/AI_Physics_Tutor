import { chaptersForGrade } from "@/content/curriculum";
import type { QuizItem, Topic } from "@/content/types";

export const QUIZ_LENGTH = 50;

type Row = { chapterId: string; topic: Topic };

export function questionsForGrade(grade: number): QuizItem[] {
  const rows = chaptersForGrade(grade).flatMap((chapter) =>
    chapter.topics.map((topic) => ({ chapterId: chapter.id, topic })),
  );
  const seen = new Set<string>();
  const items: QuizItem[] = [];

  function add(item: QuizItem | null) {
    if (!item) return;
    const key = item.question.trim().toLowerCase();
    if (seen.has(key)) return;
    if (new Set(item.choices.map(norm)).size !== item.choices.length) return;
    seen.add(key);
    items.push(item);
  }

  for (const row of rows) {
    for (const item of row.topic.quiz) add(item);
  }
  for (const row of rows) {
    const shift = rows.findIndex((item) => item.topic.id === row.topic.id);
    add(mistakeQuestion(row, rows, shift));
    add(trapQuestion(row));
    add(exampleQuestion(row, rows, grade, shift));
    row.topic.keyPoints.forEach((point, index) => add(factQuestion(row, rows, point, index, grade, shift)));
  }

  return items;
}

export function buildQuiz(grade: number): QuizItem[] {
  return shuffle(questionsForGrade(grade))
    .slice(0, QUIZ_LENGTH)
    .map(scramble);
}

function factQuestion(row: Row, rows: Row[], point: string, index: number, grade: number, shift: number): QuizItem | null {
  const wrongs = wrongsFrom(point, otherRows(row, rows).flatMap((item) => item.topic.keyPoints), shift + index * 3);
  if (!wrongs) return null;
  const stems = [
    `Which statement belongs with “${row.topic.title}”?`,
    `Which other statement belongs with “${row.topic.title}”?`,
    `Which further statement belongs with “${row.topic.title}”?`,
  ];
  return {
    id: `${row.topic.id}-fact-${index + 1}`,
    question: stems[index] ?? `Which added statement belongs with “${row.topic.title}”?`,
    choices: [point, ...wrongs],
    answerIndex: 0,
    explanation: explain(point, row.topic, grade),
  };
}

function exampleQuestion(row: Row, rows: Row[], grade: number, shift: number): QuizItem | null {
  const wrongs = wrongsFrom(row.topic.example, otherRows(row, rows).map((item) => item.topic.example), shift);
  if (!wrongs) return null;
  return {
    id: `${row.topic.id}-example`,
    question: `Which situation fits “${row.topic.title}”?`,
    choices: [row.topic.example, ...wrongs],
    answerIndex: 0,
    explanation: explain(row.topic.example, row.topic, grade),
  };
}

function mistakeQuestion(row: Row, rows: Row[], shift: number): QuizItem | null {
  const correct = row.topic.mistake.right;
  const wrongs = wrongsFrom(
    correct,
    [row.topic.mistake.wrong, ...otherRows(row, rows).map((item) => item.topic.mistake.wrong)],
    shift,
  );
  if (!wrongs) return null;
  return {
    id: `${row.topic.id}-mistake`,
    question: `A student says, “${row.topic.mistake.wrong}” Which reply is the right one?`,
    choices: [correct, ...wrongs],
    answerIndex: 0,
    explanation: correct,
  };
}

function trapQuestion(row: Row): QuizItem | null {
  const correct = row.topic.mistake.wrong;
  const wrongs = wrongsFrom(correct, [...row.topic.keyPoints, row.topic.mistake.right, row.topic.example]);
  if (!wrongs) return null;
  return {
    id: `${row.topic.id}-trap`,
    question: `Which of these is a mistake about “${row.topic.title}”?`,
    choices: [correct, ...wrongs],
    answerIndex: 0,
    explanation: row.topic.mistake.right,
  };
}

function explain(fact: string, topic: Topic, grade: number): string {
  const support = (grade <= 5 ? topic.younger : topic.idea).split(/(?<=[.!?])\s/)[0] ?? fact;
  if (norm(support) === norm(fact) || support.includes(fact)) return fact;
  return `${fact} ${support}`;
}

function otherRows(row: Row, rows: Row[]): Row[] {
  const far = rows.filter((item) => item.topic.id !== row.topic.id && item.chapterId !== row.chapterId);
  const near = rows.filter((item) => item.topic.id !== row.topic.id);
  return far.length >= 3 ? far : near;
}

function wrongsFrom(correct: string, candidates: string[], shift = 0): [string, string, string] | null {
  const seen = new Set([norm(correct)]);
  const wrongs: string[] = [];
  const start = candidates.length === 0 ? 0 : Math.abs(shift) % candidates.length;
  const ordered = [...candidates.slice(start), ...candidates.slice(0, start)];
  for (const candidate of ordered) {
    const key = norm(candidate);
    if (!key || seen.has(key)) continue;
    if (key.length > 12 && (key.includes(norm(correct)) || norm(correct).includes(key))) continue;
    seen.add(key);
    wrongs.push(candidate.trim());
    if (wrongs.length === 3) return [wrongs[0], wrongs[1], wrongs[2]];
  }
  return null;
}

function scramble(item: QuizItem): QuizItem {
  const order = item.choices.map((_, index) => index);
  for (let index = order.length - 1; index > 0; index -= 1) {
    const swap = Math.floor(Math.random() * (index + 1));
    [order[index], order[swap]] = [order[swap], order[index]];
  }
  return {
    ...item,
    choices: order.map((index) => item.choices[index]),
    answerIndex: order.indexOf(item.answerIndex),
  };
}

function shuffle<T>(items: T[]): T[] {
  const copy = [...items];
  for (let index = copy.length - 1; index > 0; index -= 1) {
    const swap = Math.floor(Math.random() * (index + 1));
    [copy[index], copy[swap]] = [copy[swap], copy[index]];
  }
  return copy;
}

function norm(value: string): string {
  return value.trim().toLowerCase().replace(/\s+/g, " ");
}
