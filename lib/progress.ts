import { mkdir, readFile, writeFile } from "node:fs/promises";
import path from "node:path";

export type ProgressRecord = {
  studentId: string;
  grade: number;
  topics: string[];
  doubts: number;
  numericals: number;
  practiceCorrect: number;
  practiceAttempts: number;
  quizzes: { score: number; total: number; at: string }[];
  recent: { at: string; label: string; kind: string }[];
};

type Store = Record<string, ProgressRecord>;

const filePath = path.join(process.cwd(), "data", "progress.json");

async function readStore(): Promise<Store> {
  try {
    return JSON.parse(await readFile(filePath, "utf8")) as Store;
  } catch {
    return {};
  }
}

async function writeStore(store: Store) {
  await mkdir(path.dirname(filePath), { recursive: true });
  await writeFile(filePath, JSON.stringify(store, null, 2));
}

function key(studentId: string, grade: number) {
  return `${studentId}:${grade}`;
}

function blank(studentId: string, grade: number): ProgressRecord {
  return {
    studentId,
    grade,
    topics: [],
    doubts: 0,
    numericals: 0,
    practiceCorrect: 0,
    practiceAttempts: 0,
    quizzes: [],
    recent: [],
  };
}

export type ProgressEvent =
  | { type: "topic"; grade: number; label: string }
  | { type: "doubt"; grade: number; label: string }
  | { type: "numerical"; grade: number; label: string }
  | { type: "practice"; grade: number; label: string; correct: boolean }
  | { type: "quiz"; grade: number; score: number; total: number };

export async function resetProgress(studentId: string, grade: number): Promise<ProgressRecord> {
  const store = await readStore();
  const record = blank(studentId, grade);
  store[key(studentId, grade)] = record;
  const legacy = store[studentId];
  if (legacy?.grade === grade) delete store[studentId];
  await writeStore(store);
  return record;
}

export async function getProgress(studentId: string, grade: number): Promise<ProgressRecord> {
  const store = await readStore();
  const saved = store[key(studentId, grade)];
  if (saved) return saved;
  const legacy = store[studentId];
  if (legacy?.grade === grade) return legacy;
  return blank(studentId, grade);
}

export async function recordProgress(studentId: string, event: ProgressEvent): Promise<ProgressRecord> {
  const store = await readStore();
  const id = key(studentId, event.grade);
  const legacy = store[studentId];
  const record = store[id] ?? (legacy?.grade === event.grade ? { ...legacy } : blank(studentId, event.grade));
  if (legacy?.grade === event.grade) delete store[studentId];
  record.grade = event.grade;
  const entry = { at: new Date().toISOString(), label: "label" in event ? event.label : "Quiz", kind: event.type };
  if (event.type === "topic" && !record.topics.includes(event.label)) record.topics.push(event.label);
  if (event.type === "doubt") record.doubts += 1;
  if (event.type === "numerical") record.numericals += 1;
  if (event.type === "practice") {
    record.practiceAttempts += 1;
    if (event.correct) record.practiceCorrect += 1;
  }
  if (event.type === "quiz") record.quizzes.push({ score: event.score, total: event.total, at: entry.at });
  record.recent = [entry, ...record.recent].slice(0, 12);
  store[id] = record;
  await writeStore(store);
  return record;
}
