import { solve, type SolveRequest } from "@/lib/solver";

export const runtime = "nodejs";

export async function POST(request: Request) {
  const body = (await request.json()) as SolveRequest;
  if (!body?.formulaId || !body.find || !body.known) {
    return Response.json({ status: "cannot_verify", message: "The checker needs a formula and values.", steps: [], assumptions: [] }, { status: 400 });
  }
  const local = solve(body);
  const solverUrl = process.env.SOLVER_URL;
  if (!solverUrl) return Response.json(local);
  try {
    const response = await fetch(`${solverUrl.replace(/\/$/, "")}/verify`, {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify(body),
      signal: AbortSignal.timeout(2500),
    });
    if (!response.ok) return Response.json(local);
    return Response.json(await response.json());
  } catch {
    return Response.json(local);
  }
}
