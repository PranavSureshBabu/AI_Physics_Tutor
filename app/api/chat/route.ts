import { recordProgress, type ProgressEvent } from "@/lib/progress";
import { readConversation, saveConversation } from "@/lib/memory";
import { answerQuestion, type TutorMode } from "@/lib/tutor";

export const runtime = "nodejs";

function validId(value: unknown): value is string {
  return typeof value === "string" && /^[a-zA-Z0-9-]{8,80}$/.test(value);
}

export async function POST(request: Request) {
  const body = (await request.json()) as {
    studentId?: string;
    conversationId?: string;
    grade?: number;
    mode?: TutorMode;
    message?: string;
    topicId?: string;
  };
  const grade = body.grade;
  const message = body.message?.trim() ?? "";
  if (!validId(body.studentId) || !grade || grade < 1 || grade > 12 || message.length === 0 || message.length > 2000) {
    return Response.json({ error: "Please send a class and a shorter question." }, { status: 400 });
  }
  const mode = body.mode === "numerical" || body.mode === "learn" ? body.mode : "doubt";
  const conversationId = validId(body.conversationId) ? body.conversationId : crypto.randomUUID();
  const existing = await readConversation(conversationId);
  const previousSolve = [...(existing?.turns ?? [])].reverse().find((turn) => turn.solve)?.solve;
  const reply = await answerQuestion({
    grade,
    message,
    mode,
    topicId: body.topicId,
    previousSolve,
  });
  await saveConversation({
    id: conversationId,
    grade,
    turns: [
      ...(existing?.turns ?? []),
      { role: "user", text: message },
      { role: "tutor", text: reply.blocks.map((block) => ("text" in block ? block.text : "")).join(" "), topicId: reply.topicId, solve: reply.solveRequest },
    ],
  });
  const event: ProgressEvent =
    mode === "numerical"
      ? { type: "numerical", grade, label: message.slice(0, 80) }
      : { type: "doubt", grade, label: message.slice(0, 80) };
  await recordProgress(body.studentId, event);
  return Response.json({ conversationId, reply });
}
