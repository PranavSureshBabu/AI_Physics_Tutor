import { getProgress, recordProgress, resetProgress, type ProgressEvent } from "@/lib/progress";

export const runtime = "nodejs";

function validId(value: unknown): value is string {
  return typeof value === "string" && /^[a-zA-Z0-9-]{8,80}$/.test(value);
}

export async function GET(request: Request) {
  const url = new URL(request.url);
  const studentId = url.searchParams.get("studentId");
  const grade = Number(url.searchParams.get("grade"));
  if (!validId(studentId) || !Number.isInteger(grade) || grade < 1 || grade > 12) {
    return Response.json({ error: "Missing student." }, { status: 400 });
  }
  return Response.json(await getProgress(studentId, grade));
}

export async function DELETE(request: Request) {
  const url = new URL(request.url);
  const studentId = url.searchParams.get("studentId");
  const grade = Number(url.searchParams.get("grade"));
  if (!validId(studentId) || !Number.isInteger(grade) || grade < 1 || grade > 12) {
    return Response.json({ error: "Missing student." }, { status: 400 });
  }
  return Response.json(await resetProgress(studentId, grade));
}

export async function POST(request: Request) {
  const body = (await request.json()) as { studentId?: string; event?: ProgressEvent };
  if (!validId(body.studentId) || !body.event) {
    return Response.json({ error: "Missing progress event." }, { status: 400 });
  }
  return Response.json(await recordProgress(body.studentId, body.event));
}
