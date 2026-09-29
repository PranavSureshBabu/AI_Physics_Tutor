export type BoardId = "app" | "cbse" | "icse" | "state";
export type GoalId = "learn" | "practice" | "revision" | "exam";

export const BOARDS: { id: BoardId; label: string; loaded: boolean }[] = [
  { id: "app", label: "School physics in this app", loaded: true },
  { id: "cbse", label: "CBSE", loaded: false },
  { id: "icse", label: "ICSE", loaded: false },
  { id: "state", label: "State board", loaded: false },
];

export const GOALS: { id: GoalId; label: string }[] = [
  { id: "learn", label: "Understand the ideas" },
  { id: "practice", label: "Practice questions" },
  { id: "revision", label: "Revise" },
  { id: "exam", label: "Prepare for a test" },
];

export function boardInfo(id: BoardId | undefined) {
  return BOARDS.find((item) => item.id === id) ?? BOARDS[0];
}

export type Bookmark = { grade: number; topicId: string; title: string; chapterTitle: string };
export type DoubtNote = { grade: number; text: string; at: string };
export type ResumeMark = { grade: number; chapterId: string; topicId: string; title: string };

function readList<T>(key: string): T[] {
  try {
    const parsed = JSON.parse(localStorage.getItem(key) ?? "[]") as T[];
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
}

export function readBookmarks(studentId: string): Bookmark[] {
  return readList<Bookmark>(`apt-bookmarks:${studentId}`);
}

export function toggleBookmark(studentId: string, mark: Bookmark): Bookmark[] {
  const current = readBookmarks(studentId);
  const exists = current.some((item) => item.topicId === mark.topicId && item.grade === mark.grade);
  const next = exists ? current.filter((item) => !(item.topicId === mark.topicId && item.grade === mark.grade)) : [mark, ...current].slice(0, 30);
  localStorage.setItem(`apt-bookmarks:${studentId}`, JSON.stringify(next));
  return next;
}

export function readDoubts(studentId: string): DoubtNote[] {
  return readList<DoubtNote>(`apt-doubts:${studentId}`);
}

export function rememberDoubt(studentId: string, note: DoubtNote): DoubtNote[] {
  const next = [note, ...readDoubts(studentId).filter((item) => item.text !== note.text)].slice(0, 20);
  localStorage.setItem(`apt-doubts:${studentId}`, JSON.stringify(next));
  return next;
}

export function forgetDoubt(studentId: string, at: string): DoubtNote[] {
  const next = readDoubts(studentId).filter((item) => item.at !== at);
  localStorage.setItem(`apt-doubts:${studentId}`, JSON.stringify(next));
  return next;
}

export function readResume(studentId: string): ResumeMark | null {
  try {
    const parsed = JSON.parse(localStorage.getItem(`apt-resume:${studentId}`) ?? "null") as ResumeMark | null;
    if (!parsed || typeof parsed.chapterId !== "string") return null;
    return parsed;
  } catch {
    return null;
  }
}

export function writeResume(studentId: string, mark: ResumeMark) {
  localStorage.setItem(`apt-resume:${studentId}`, JSON.stringify(mark));
}

export function clearResume(studentId: string) {
  localStorage.removeItem(`apt-resume:${studentId}`);
}

export function clearStudentNotes(studentId: string) {
  localStorage.removeItem(`apt-bookmarks:${studentId}`);
  localStorage.removeItem(`apt-doubts:${studentId}`);
  localStorage.removeItem(`apt-resume:${studentId}`);
}
