import type { TutorReply } from "@/lib/blocks";
import { getFormula } from "@/content/formulas";
import { answerOutsideNotes } from "@/lib/gemini";
import { replyToDoubt } from "@/lib/lesson";
import { retrieve } from "@/lib/rag";
import { solve, type SolveRequest, type SolveResult } from "@/lib/solver";
import { applyChange, followUp, parseWordProblem, solveWordProblem } from "@/lib/word-problem";

export type TutorMode = "doubt" | "numerical" | "learn";

export type AnswerInput = {
  grade: number;
  message: string;
  mode: TutorMode;
  topicId?: string;
  previousSolve?: SolveRequest;
  history?: { role: "user" | "tutor"; text: string }[];
};

export type Answer = TutorReply & { solveRequest?: SolveRequest };

function cannot(message: string): Answer {
  return {
    blocks: [
      { type: "heading", text: "I need to stop here" },
      { type: "text", text: message },
      {
        type: "confidence",
        level: "cannot_answer",
        note: "No calculation or class note was strong enough to answer this.",
      },
    ],
  };
}

function usefulNote(result: SolveResult): string {
  if (!result.message || result.message.startsWith("Checked by direct calculation")) return "";
  return result.message;
}

function partBlocks(result: SolveResult, grade: number, titled: boolean): TutorReply["blocks"] {
  const steps = grade <= 5 ? result.steps.map((step) => ({ text: step.text })) : result.steps;
  const note = usefulNote(result);
  return [
    ...(titled
      ? [{ type: "subheading" as const, text: getFormula(result.formulaId ?? "")?.name ?? "Next part", depth: "part" as const }]
      : []),
    { type: "steps" as const, title: "Steps", steps },
    ...(result.assumptions.length
      ? [{ type: "callout" as const, tone: "remember" as const, title: "Assumption", text: result.assumptions.join(" ") }]
      : []),
    ...(note ? [{ type: "text" as const, text: note }] : []),
  ];
}

function fromSolve(result: SolveResult, grade: number): Answer {
  const parts = [result, ...(result.extras ?? [])];
  if (result.status === "verified") {
    const lead =
      grade <= 5
        ? "Here is the checked number, said as simply as I can."
        : parts.length > 1
          ? "Both parts are checked below. Each formula shows the given numbers in place."
          : "The steps put the given numbers into the formula.";
    return {
      blocks: [
        { type: "heading", text: "Checked solution" },
        { type: "text", text: lead },
        ...parts.flatMap((part) => partBlocks(part, grade, parts.length > 1)),
      ],
      solveRequest: result.request,
    };
  }
  if (result.status === "needs_info") {
    return {
      blocks: [
        { type: "heading", text: "I need one more fact" },
        { type: "text", text: result.message },
        ...(result.steps.length ? [{ type: "steps" as const, title: "What I already have", steps: result.steps }] : []),
      ],
    };
  }
  return {
    blocks: [
      { type: "heading", text: "I cannot check this yet" },
      { type: "text", text: result.message },
    ],
  };
}

export async function answerQuestion(input: AnswerInput): Promise<Answer> {
  const message = input.message.trim();
  if (!message) return cannot("Type a question and I will use your class notes.");

  if (input.previousSolve && /\b(what if|instead|rather)\b/i.test(message)) {
    const changed = applyChange(input.previousSolve, message);
    if (changed) {
      const result = solve(changed);
      if (result.status === "verified") {
        const reply = fromSolve(result, input.grade);
        reply.solveRequest = changed;
        return reply;
      }
    }
  }

  let word: ReturnType<typeof solveWordProblem>;
  try {
    word = solveWordProblem(message);
  } catch {
    word = { status: "not_calculation", message: "", steps: [], assumptions: [] };
  }
  if (word.status === "verified") {
    const reply = fromSolve(word, input.grade);
    reply.solveRequest = word.request ?? parseWordProblem(message) ?? undefined;
    return reply;
  }

  if (input.previousSolve) {
    const next = followUp(input.previousSolve, message);
    if (next) {
      const result = solve(next);
      if (result.status === "verified") {
        const reply = fromSolve(result, input.grade);
        reply.solveRequest = next;
        return reply;
      }
    }
  }

  const hasNumbers = /\d/.test(message);
  if (!hasNumbers && !input.previousSolve) {
    const found = retrieve(message, input.grade, input.topicId);
    if (found && found.confidence !== "low") return replyToDoubt(found.topic, input.grade);
  }

  const earlier = (input.history ?? [])
    .slice(-6)
    .map((turn) => `${turn.role === "user" ? "Student" : "Tutor"}: ${turn.text}`)
    .join("\n");
  const outside = await answerOutsideNotes(message, input.grade, earlier);
  if (outside) return outside;

  if (word.status === "needs_info" || word.status === "cannot_verify") return fromSolve(word, input.grade);

  const found = retrieve(message, input.grade, input.topicId);
  if (found && found.confidence !== "low") return replyToDoubt(found.topic, input.grade);
  return cannot(
    `This is not in your Class ${input.grade} notes, and I could not look it up. I will not invent an explanation.`,
  );
}
