export type ReadingBand = "primary" | "middle" | "secondary" | "senior";

export type WorkedStep = {
  text: string;
  latex?: string;
};

export type Formula = {
  id: string;
  name: string;
  latex: string;
  plain: string;
  meaning: string;
  variables: { symbol: string; meaning: string; unit: string }[];
};

export type KnownValue = {
  value: number;
  unit: string;
};

export type WorkedInput = {
  formulaId: string;
  known: Record<string, KnownValue>;
  find: string;
};

export type PracticeItem = {
  id: string;
  question: string;
  hint: string;
  answer: string;
  worked?: WorkedInput;
};

export type QuizItem = {
  id: string;
  question: string;
  choices: string[];
  answerIndex: number;
  explanation: string;
};

export type SketchName =
  | "push"
  | "pull"
  | "shadow"
  | "motion"
  | "circuit"
  | "magnet"
  | "mirror"
  | "wave"
  | "pendulum"
  | "heat"
  | "gravity"
  | "float"
  | "lever"
  | "slope"
  | "reflection"
  | "refraction"
  | "lens"
  | "eye"
  | "prism"
  | "pressure"
  | "friction"
  | "sound"
  | "echo"
  | "projectile"
  | "circular"
  | "satellite"
  | "spring"
  | "capacitor"
  | "field"
  | "transformer"
  | "atom"
  | "nucleus"
  | "diode"
  | "solar"
  | "daynight"
  | "measure"
  | "graph"
  | "storm"
  | "charge"
  | "fuse"
  | "rainbow"
  | "pulley"
  | "gas"
  | "solid"
  | "emwave"
  | "slits"
  | "photo"
  | "vector"
  | "freefall"
  | "work"
  | "collision"
  | "ac";

export type DataTable = {
  caption?: string;
  headers: string[];
  rows: string[][];
};

export type Topic = {
  id: string;
  title: string;
  aliases?: string[];
  idea: string;
  younger: string;
  senior?: string;
  example: string;
  formulaIds: string[];
  mistake: { wrong: string; right: string };
  check: { question: string; answer: string };
  keyPoints: string[];
  practice: PracticeItem[];
  quiz: QuizItem[];
  sketch?: SketchName;
  sketchCaption?: string;
  table?: DataTable;
  worked?: WorkedInput & { prompt: string; after?: string };
};

export type Chapter = {
  id: string;
  grade: number;
  title: string;
  promise: string;
  topics: Topic[];
  scopeNote: string;
};

export type GradeInfo = {
  grade: number;
  band: ReadingBand;
  label: string;
  subject: string;
  summary: string;
};

export type BandInfo = {
  id: ReadingBand;
  name: string;
  blurb: string;
  grades: number[];
};
