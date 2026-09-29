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
    return "The student is about 6 to 8 years old. Use 2 very short sentences, the way you would talk to a small child. Words they already use at home and at play. No school science words, no symbols, no formulas, and no units. One thing they can see, such as a ball, a door, or the Sun.";
  }
  if (grade <= 5) {
    return "The student is about 8 to 11 years old. Use 3 short sentences and words from play, home, or the classroom. If you use one school word, the very next sentence must say what it means with a toy, a game, or the kitchen. No formulas, no symbols, no lists, and no words such as therefore or quantity.";
  }
  if (grade <= 8) {
    return "The student is in middle school. Explain what it is, why it happens, and give one example. When a formula helps, write it as $v = s/t$ and also say it in words.";
  }
  if (grade <= 10) {
    return "The student is in Class 9 or 10. Give a school definition, the formula they are expected to use, what each quantity means, one example, and one common mistake. Write every formula between dollar signs, for example $F = ma$. Do not add university material.";
  }
  return "The student is in Class 11 or 12. Give a precise definition, the standard formula, the conditions when it applies, and a short example. Write every formula between dollar signs, for example $A = \\pi r^{2}$, so the symbols can be drawn.";
}

function paragraphs(text: string): string[] {
  const parts = text
    .split(/\n+/)
    .map((part) =>
      part
        .replace(/\*\*/g, "")
        .replace(/\*(\$)/g, "$1")
        .replace(/(\$)\*/g, "$1")
        .replace(/(^|\s)\*([^*$\n]+)\*(?=\s|$)/g, "$1$2")
        .replace(/^[-*]\s+/, "")
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

export async function answerOutsideNotes(question: string, grade: number, earlier = ""): Promise<TutorReply | null> {
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) return null;
  const ai = new GoogleGenAI({ apiKey });
  const model = process.env.GEMINI_MODEL || "gemini-3.8-flash";
  const numerical = /\d/.test(question) || /\d/.test(earlier);
  const prompt = [
    `Answer this for a Class ${grade} student.`,
    `This student signed in as Class ${grade}. Stay in that class. If the question belongs to another class, say it opens later and answer only with Class ${grade} ideas.`,
    voice(grade),
    earlier
      ? "Earlier messages are below. If this question continues that problem, keep those measurements and answer the new part. If this is a different problem, ignore the earlier messages."
      : "",
    earlier ? `Earlier messages:\n${earlier}` : "",
    numerical
      ? grade <= 5
        ? "If they want a number, say that number in the first sentence in plain words. Then one sentence about a toy or home. Do not show a formula. If a fact is missing, ask for it in easy words."
        : "This is a sum. The first sentence must be the final number with its unit. Then derive it in order: what is given, the formula, each substitution, and the arithmetic that produces the result. If a measurement needed for the sum is missing, name that missing fact and do not invent it. Do not stop after defining the idea."
      : grade <= 5
        ? "Use Google Search so the science is right, then answer as if you are sitting next to the child. Start with the answer. Then one picture from home or play. Stop there."
        : "Use Google Search so the science is current, then write only the answer. If there is no number to find, explain the idea.",
    grade >= 6
      ? "Write formulas only between dollar signs, for example $A = \\pi r^{2}$. Do not use asterisks or backslash-words outside those signs."
      : "Do not use dollar signs or algebraic symbols.",
    "Do not mention notes, websites, sources, search, or that anything was looked up.",
    "Do not add a heading such as Direct Answer.",
    "Do not help with weapons, crime, or harming someone.",
    `Question: ${question}`,
  ]
    .filter(Boolean)
    .join("\n");

  try {
    const response = await ai.models.generateContent({
      model,
      contents: prompt,
      config: {
        temperature: 0.2,
        maxOutputTokens: grade <= 5 ? 180 : numerical ? 1000 : 700,
        ...(numerical ? {} : { tools: [{ googleSearch: {} }] }),
      },
    });
    const text = response.text?.trim();
    const body = text ? paragraphs(text).slice(0, grade <= 2 ? 2 : grade <= 5 ? 3 : 6) : [];
    if (body.length === 0) return null;
    return {
      blocks: body.map((paragraph) => ({ type: "text", text: paragraph })),
    };
  } catch {
    return null;
  }
}
