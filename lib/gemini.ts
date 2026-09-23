import { GoogleGenAI } from "@google/genai";
import type { TutorReply } from "@/lib/blocks";

function newDigits(text: string, allowed: string): boolean {
  const found = text.match(/\d+(?:\.\d+)?/g) ?? [];
  return found.some((digit) => !allowed.includes(digit));
}

export async function phraseIntro(question: string, facts: string, grade: number): Promise<string | null> {
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) return null;
  try {
    const ai = new GoogleGenAI({ apiKey });
    const response = await ai.models.generateContent({
      model: process.env.GEMINI_MODEL || "gemini-3.8-flash",
      contents: [
        "You are a physics teacher. Write at most two short sentences that invite the student into the lesson.",
        `The student is in Class ${grade}.`,
        "Use only the facts below. Do not add numbers, formulas, or claims that are not in the facts.",
        "If the facts are not enough, return an empty string.",
        `Question: ${question}`,
        `Facts: ${facts}`,
      ].join("\n"),
      config: { temperature: 0.2, maxOutputTokens: 120 },
    });
    const text = response.text?.trim();
    if (!text || text.length > 360 || newDigits(text, facts)) return null;
    return text;
  } catch {
    return null;
  }
}

function voice(grade: number): string {
  if (grade <= 2) {
    return "The student is 6 to 8 years old. Answer in 2 or 3 very short sentences, the way you would speak to a young child. Everyday words only. No symbols, no formulas, and no units such as m/s. Use one example from home or play.";
  }
  if (grade <= 5) {
    return "The student is in primary school. Use about five short sentences. Simple words, one familiar example, and no algebraic symbols.";
  }
  if (grade <= 8) {
    return "The student is in middle school. Explain what it is, why it happens, and give one example. If a formula helps, say it in words, not as a derivation.";
  }
  if (grade <= 10) {
    return "The student is in Class 9 or 10. Give a school definition, the formula they are expected to use, what each quantity means, one example, and one common mistake. Do not add university material.";
  }
  return "The student is in Class 11 or 12. Give a precise definition, the standard formula, the conditions when it applies, and a short example. Keep the mathematics.";
}

function paragraphs(text: string): string[] {
  const parts = text
    .split(/\n+/)
    .map((part) =>
      part
        .replace(/\*\*/g, "")
        .replace(/\[([^\]]*)\]\([^)]*\)/g, "$1")
        .replace(/\[[^\]]*\]/g, "")
        .replace(/^#+\s*/, "")
        .trim(),
    )
    .filter((part) => part.length > 1)
    .filter((part) => !/^(direct answer|explanation|example|definition|introduction|sources?)\s*:?$/i.test(part))
    .filter((part) => !/https?:\/\//i.test(part))
    .filter((part) => !/\b(class notes|looked up|web lookup|according to the (web|internet|article))\b/i.test(part));
  return parts.slice(0, 6);
}

export async function answerOutsideNotes(question: string, grade: number): Promise<TutorReply | null> {
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) return null;
  const ai = new GoogleGenAI({ apiKey });
  const model = process.env.GEMINI_MODEL || "gemini-3.8-flash";
  const prompt = [
    `Answer this for a Class ${grade} student.`,
    voice(grade),
    "Use Google Search so the science is current, then write only the answer.",
    "Do not mention notes, websites, sources, search, or that anything was looked up.",
    "Do not add a heading such as Direct Answer.",
    "Do not help with weapons, crime, or harming someone.",
    `Question: ${question}`,
  ].join("\n");

  try {
    const response = await ai.models.generateContent({
      model,
      contents: prompt,
      config: {
        temperature: 0.2,
        maxOutputTokens: grade <= 5 ? 280 : 700,
        tools: [{ googleSearch: {} }],
      },
    });
    const text = response.text?.trim();
    const body = text ? paragraphs(text) : [];
    if (body.length === 0) return null;
    return {
      blocks: body.map((paragraph) => ({ type: "text", text: paragraph })),
    };
  } catch {
    return null;
  }
}
