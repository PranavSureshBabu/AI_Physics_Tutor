import type { SketchName } from "@/content/types";

export type ConfidenceLevel = "verified" | "grounded" | "needs_info" | "cannot_answer" | "external";

export type TutorBlock =
  | { type: "heading"; text: string; id?: string }
  | { type: "subheading"; text: string; id?: string; depth?: "topic" | "part" }
  | { type: "text"; text: string }
  | { type: "formula"; formulaId: string }
  | { type: "steps"; title: string; steps: { text: string; latex?: string }[] }
  | { type: "callout"; tone: "example" | "mistake" | "remember" | "check"; title: string; text: string }
  | { type: "list"; title: string; items: string[] }
  | { type: "links"; title: string; items: { label: string; href: string }[] }
  | { type: "table"; caption?: string; headers: string[]; rows: string[][] }
  | { type: "sketch"; name: SketchName; caption?: string }
  | { type: "confidence"; level: ConfidenceLevel; note: string };

export type TutorReply = {
  blocks: TutorBlock[];
  topicId?: string;
  chapterId?: string;
  modelUsed?: boolean;
};
