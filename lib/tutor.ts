import type { TutorReply } from "@/lib/blocks";
import { answerOutsideNotes } from "@/lib/gemini";
import { replyToDoubt } from "@/lib/lesson";
import { retrieve } from "@/lib/rag";
import { solve, type SolveRequest } from "@/lib/solver";
import { applyChange, parseWordProblem, solveWordProblem } from "@/lib/word-problem";

export type TutorMode = "doubt" | "numerical" | "learn";

export type AnswerInput = {
  grade: number;
  message: string;
  mode: TutorMode;
  topicId?: string;
  previousSolve?: SolveRequest;
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

function fromSolve(result: ReturnType<typeof solve>, grade: number): Answer {
  if (result.status === "verified") {
    const lead =
      grade <= 5
        ? "Here is the checked number, said as simply as I can. The calculator did the arithmetic."
        : "The calculator checked this. I am not estimating the number.";
    return {
      blocks: [
        { type: "heading", text: "Checked solution" },
        { type: "text", text: lead },
        { type: "steps", title: "Steps", steps: result.steps },
        ...(result.assumptions.length
          ? [{ type: "callout" as const, tone: "remember" as const, title: "Assumption", text: result.assumptions.join(" ") }]
          : []),
        { type: "text", text: result.message },
        { type: "confidence", level: "verified", note: "Verified by direct calculation." },
      ],
      solveRequest: undefined,
    };
  }
  if (result.status === "needs_info") {
    return {
      blocks: [
        { type: "heading", text: "I need one more fact" },
        { type: "text", text: result.message },
        ...(result.steps.length ? [{ type: "steps" as const, title: "What I already have", steps: result.steps }] : []),
        { type: "confidence", level: "needs_info", note: "I will not fill the gap with a guess." },
      ],
    };
  }
  return {
    blocks: [
      { type: "heading", text: "I cannot check this yet" },
      { type: "text", text: result.message },
      { type: "confidence", level: "cannot_answer", note: "The checker refused this one." },
    ],
  };
}

export async function answerQuestion(input: AnswerInput): Promise<Answer> {
  const message = input.message.trim();
  if (!message) return cannot("Type a question and I will use your class notes.");

  if (input.previousSolve) {
    const changed = applyChange(input.previousSolve, message);
    if (changed) {
      const result = solve(changed);
      const reply = fromSolve(result, input.grade);
      if (result.status === "verified") reply.solveRequest = changed;
      return reply;
    }
  }

  const word = solveWordProblem(message);
  const looksNumerical = word.status !== "not_calculation";
  if (input.mode === "numerical" || looksNumerical) {
    if (word.status === "not_calculation" && input.mode === "numerical") {
      // A concept question can still be answered from the notes.
    } else if (word.status !== "not_calculation") {
      const reply = fromSolve(word, input.grade);
      if (word.status === "verified") reply.solveRequest = parseWordProblem(message) ?? undefined;
      return reply;
    }
  }

  const found = retrieve(message, input.grade, input.topicId);
  if (!found || found.confidence === "low") {
    const outside = await answerOutsideNotes(message, input.grade);
    if (outside) return outside;
    return cannot(
      `This is not in your Class ${input.grade} notes, and I could not look it up. I will not invent an explanation.`,
    );
  }

  return replyToDoubt(found.topic, input.grade);
}
