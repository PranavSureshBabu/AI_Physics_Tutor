import { furtherFor } from "@/content/curriculum/further";
import { figureFor } from "@/content/figure-match";
import { getFormula } from "@/content/formulas";
import type { Chapter, Topic } from "@/content/types";
import type { TutorReply } from "@/lib/blocks";
import { solve } from "@/lib/solver";

export function replyToDoubt(topic: Topic, grade: number): TutorReply {
  const blocks: TutorReply["blocks"] = [{ type: "heading", text: topic.title }];
  const formulas = topic.formulaIds
    .map((id) => getFormula(id))
    .filter((formula) => formula !== undefined);

  if (grade <= 2) {
    blocks.push({ type: "text", text: topic.younger });
    blocks.push({ type: "text", text: topic.example });
  } else if (grade <= 5) {
    blocks.push({ type: "text", text: topic.younger });
    blocks.push({ type: "text", text: topic.example });
    blocks.push({ type: "text", text: topic.mistake.right });
  } else if (grade <= 8) {
    blocks.push({ type: "text", text: topic.idea });
    blocks.push({ type: "text", text: topic.example });
    if (formulas.length > 0) {
      blocks.push({
        type: "text",
        text: formulas.map((formula) => `${formula.plain}. ${formula.meaning}`).join(" "),
      });
    }
  } else if (grade <= 10) {
    blocks.push({ type: "text", text: topic.idea });
    for (const formula of formulas) blocks.push({ type: "formula", formulaId: formula.id });
    blocks.push({ type: "text", text: topic.example });
    blocks.push({ type: "text", text: topic.mistake.right });
  } else {
    blocks.push({ type: "text", text: [topic.idea, topic.senior].filter(Boolean).join(" ") });
    for (const formula of formulas) blocks.push({ type: "formula", formulaId: formula.id });
    blocks.push({ type: "text", text: topic.example });
    blocks.push({ type: "text", text: topic.mistake.right });
  }

  return { blocks, topicId: topic.id };
}

function clip(text: string, max = 64): string {
  const clean = text.replace(/\s+/g, " ").trim().replace(/[.?!]+$/, "");
  if (clean.length <= max) return clean;
  const cut = clean.slice(0, max);
  const last = cut.lastIndexOf(" ");
  return (last > 24 ? cut.slice(0, last) : cut).replace(/[,:;]+$/, "");
}

function topicSections(topic: Topic, grade: number): TutorReply["blocks"] {
  const blocks: TutorReply["blocks"] = [
    { type: "subheading", text: topic.title, id: `topic-${topic.id}` },
  ];
  const formulas = topic.formulaIds
    .map((id) => getFormula(id))
    .filter((formula) => formula !== undefined);
  const figure = figureFor(topic);
  const showSymbols = grade >= 6;

  if (grade <= 5) {
    blocks.push({ type: "text", text: topic.younger });
  } else if (grade >= 11) {
    blocks.push({ type: "text", text: topic.idea });
    if (topic.senior) blocks.push({ type: "text", text: topic.senior });
  } else {
    blocks.push({ type: "text", text: topic.idea });
    if (grade >= 9 && topic.senior) blocks.push({ type: "text", text: topic.senior });
    else if (topic.younger && topic.younger !== topic.idea) blocks.push({ type: "text", text: topic.younger });
  }

  blocks.push({ type: "sketch", name: figure.name, caption: figure.caption });

  blocks.push({ type: "subheading", text: clip(topic.example), depth: "part" });
  blocks.push({ type: "text", text: topic.example });

  if (topic.keyPoints.length > 0) {
    blocks.push({ type: "subheading", text: clip(topic.keyPoints[0]), depth: "part" });
    for (const point of topic.keyPoints) blocks.push({ type: "text", text: point });
  }

  if (topic.table) {
    blocks.push({
      type: "subheading",
      text: topic.table.caption ? clip(topic.table.caption) : clip(topic.table.headers.join(", ")),
      depth: "part",
    });
    blocks.push({ type: "table", ...topic.table });
  }

  for (const formula of formulas) {
    blocks.push({ type: "subheading", text: formula.name, depth: "part" });
    if (showSymbols) {
      blocks.push({ type: "formula", formulaId: formula.id });
    } else {
      blocks.push({ type: "text", text: `${formula.plain}. ${formula.meaning}` });
    }
  }

  if (topic.worked && showSymbols) {
    blocks.push({ type: "subheading", text: clip(topic.worked.prompt), depth: "part" });
    const result = solve(topic.worked);
    if (result.status === "verified") {
      blocks.push({ type: "steps", title: topic.worked.prompt, steps: result.steps });
      if (topic.worked.after) blocks.push({ type: "text", text: topic.worked.after });
      if (result.assumptions.length) {
        blocks.push({ type: "text", text: result.assumptions.join(" ") });
      }
    } else {
      blocks.push({ type: "text", text: result.message });
    }
  }

  blocks.push({ type: "subheading", text: clip(topic.mistake.wrong), depth: "part" });
  blocks.push({ type: "text", text: topic.mistake.wrong });
  blocks.push({ type: "text", text: topic.mistake.right });

  for (const item of topic.practice) {
    blocks.push({ type: "subheading", text: clip(item.question), depth: "part" });
    blocks.push({ type: "text", text: item.hint });
    blocks.push({ type: "text", text: item.answer });
  }

  for (const item of topic.quiz) {
    const choice = item.choices[item.answerIndex] ?? "";
    blocks.push({ type: "subheading", text: clip(item.question), depth: "part" });
    blocks.push({ type: "text", text: item.choices.join(" · ") });
    blocks.push({ type: "text", text: `${choice}. ${item.explanation}` });
  }

  blocks.push({ type: "subheading", text: clip(topic.check.question), depth: "part" });
  blocks.push({ type: "text", text: topic.check.answer });

  return blocks;
}

export type LessonPage = {
  id: string;
  topicId?: string;
  title: string;
  blocks: TutorReply["blocks"];
};

function page(id: string, title: string, blocks: TutorReply["blocks"], topicId?: string): LessonPage {
  return {
    id,
    topicId,
    title,
    blocks: [{ type: "heading", text: title, id }, ...blocks],
  };
}

function voiceLines(topic: Topic, grade: number): string[] {
  if (grade <= 2) return [topic.younger];
  if (grade <= 5) {
    return topic.idea !== topic.younger ? [topic.younger, topic.idea] : [topic.younger];
  }
  const lines = [topic.idea];
  if (grade <= 8 && topic.younger && topic.younger !== topic.idea) lines.push(topic.younger);
  if (grade >= 9 && topic.senior) lines.push(topic.senior);
  return lines;
}

function readingBlocks(topic: Topic, grade: number): TutorReply["blocks"] {
  const figure = figureFor(topic);
  const blocks: TutorReply["blocks"] = voiceLines(topic, grade).map((text) => ({ type: "text" as const, text }));
  blocks.push({ type: "sketch", name: figure.name, caption: figure.caption });
  blocks.push({ type: "subheading", text: clip(topic.example), depth: "part" });
  blocks.push({ type: "text", text: topic.example });
  for (const point of topic.keyPoints) {
    blocks.push({ type: "text", text: point });
  }
  for (const paragraph of furtherFor(topic.id)) {
    blocks.push({ type: "text", text: paragraph });
  }
  if (topic.table) {
    blocks.push({
      type: "subheading",
      text: topic.table.caption ? clip(topic.table.caption) : clip(topic.table.headers.join(", ")),
      depth: "part",
    });
    if (topic.table.caption) blocks.push({ type: "text", text: topic.table.caption });
    blocks.push({ type: "table", ...topic.table });
    blocks.push({
      type: "text",
      text:
        grade <= 5
          ? "Read across one row at a time and say what is different."
          : "Compare the columns before you mix the words. A quantity in one column is not a substitute for the quantity in the other.",
    });
  }
  return blocks;
}

function cautionBlocks(topic: Topic, grade: number): TutorReply["blocks"] {
  const blocks: TutorReply["blocks"] = [];
  if (grade <= 2) {
    blocks.push({ type: "text", text: topic.mistake.wrong });
    blocks.push({ type: "text", text: topic.mistake.right });
    blocks.push({ type: "text", text: `Look back at this: ${topic.example}` });
  } else if (grade <= 5) {
    blocks.push({ type: "text", text: `This sentence sounds simple, and it is wrong: ${topic.mistake.wrong}` });
    blocks.push({ type: "text", text: `Say this instead, and be ready to point at an example. ${topic.mistake.right}` });
    blocks.push({ type: "text", text: topic.example });
    blocks.push({
      type: "text",
      text: `The facts that protect you from that slip are these. ${topic.keyPoints.join(" ")}`,
    });
  } else {
    blocks.push({
      type: "text",
      text: `Students lose marks on a sentence that sounds scientific: ${topic.mistake.wrong}`,
    });
    blocks.push({
      type: "text",
      text: `The correction is precise. ${topic.mistake.right} Apply it to the case you already have: ${topic.example}`,
    });
    if (grade >= 9 && topic.senior) {
      blocks.push({ type: "text", text: `The extra condition for this class is part of the correction. ${topic.senior}` });
    }
    blocks.push({
      type: "text",
      text: `Before you leave the idea, you should be able to state every one of these without looking. ${topic.keyPoints.join(" ")}`,
    });
  }
  blocks.push({ type: "subheading", text: clip(topic.check.question), depth: "part" });
  blocks.push({ type: "text", text: topic.check.question });
  blocks.push({
    type: "text",
    text: grade <= 2 ? topic.check.answer : `Answer: ${topic.check.answer}`,
  });
  return blocks;
}

function formulaBlocks(topic: Topic, grade: number, formulas: NonNullable<ReturnType<typeof getFormula>>[]): TutorReply["blocks"] {
  const showSymbols = grade >= 6;
  const blocks: TutorReply["blocks"] = [];
  for (const formula of formulas) {
    blocks.push({ type: "subheading", text: formula.name, depth: "part" });
    if (showSymbols) {
      blocks.push({ type: "formula", formulaId: formula.id });
      blocks.push({
        type: "text",
        text: `${formula.meaning} In words, ${formula.plain}. A case from this topic: ${topic.example} Convert every quantity into the unit named below before you substitute.`,
      });
      for (const variable of formula.variables) {
        blocks.push({
          type: "text",
          text: `${variable.symbol} is ${variable.meaning}, measured in ${variable.unit}.`,
        });
      }
    } else {
      blocks.push({ type: "text", text: `${formula.name}. ${formula.plain}. ${formula.meaning}` });
      blocks.push({ type: "text", text: topic.example });
    }
  }
  if (topic.worked && showSymbols) {
    blocks.push({ type: "subheading", text: clip(topic.worked.prompt), depth: "part" });
    blocks.push({
      type: "text",
      text: `Work this before you trust a remembered number. ${topic.worked.prompt}`,
    });
    const result = solve(topic.worked);
    if (result.status === "verified") {
      blocks.push({ type: "steps", title: topic.worked.prompt, steps: result.steps });
      if (topic.worked.after) blocks.push({ type: "text", text: topic.worked.after });
      if (result.assumptions.length) blocks.push({ type: "text", text: result.assumptions.join(" ") });
      blocks.push({
        type: "text",
        text: "The steps above are checked. If a later problem is missing a value or a unit, leave it unsolved until that information is given.",
      });
    } else {
      blocks.push({ type: "text", text: result.message });
    }
  }
  return blocks;
}

function questionBlocks(topic: Topic, grade: number): TutorReply["blocks"] {
  const blocks: TutorReply["blocks"] = [
    {
      type: "text",
      text:
        grade <= 2
          ? `Try these about ${topic.title.toLowerCase()}.`
          : `Answer from the chapter, then read the reason. The reason is the part that adds the next piece of the idea.`,
    },
  ];
  for (const item of topic.practice) {
    blocks.push({ type: "subheading", text: clip(item.question), depth: "part" });
    blocks.push({ type: "text", text: item.question });
    blocks.push({ type: "text", text: grade <= 2 ? item.hint : `How to start: ${item.hint}` });
    blocks.push({ type: "text", text: grade <= 2 ? item.answer : `A full answer: ${item.answer}` });
    if (grade >= 6 && topic.keyPoints[0]) {
      blocks.push({ type: "text", text: `The fact doing the work is: ${topic.keyPoints[0]}` });
    }
  }
  for (const item of topic.quiz) {
    const choice = item.choices[item.answerIndex] ?? "";
    blocks.push({ type: "subheading", text: clip(item.question), depth: "part" });
    blocks.push({ type: "text", text: item.question });
    blocks.push({
      type: "text",
      text: item.choices.map((option, index) => `${index + 1}. ${option}`).join("  "),
    });
    blocks.push({
      type: "text",
      text:
        grade <= 2
          ? `${choice}. ${item.explanation}`
          : `The answer is “${choice}”. ${item.explanation}`,
    });
  }
  if (topic.practice.length === 0 && topic.quiz.length === 0) {
    blocks.push({ type: "text", text: topic.check.question });
    blocks.push({ type: "text", text: topic.check.answer });
  }
  return blocks;
}

function topicPages(topic: Topic, grade: number): LessonPage[] {
  const formulas = topic.formulaIds
    .map((id) => getFormula(id))
    .filter((formula) => formula !== undefined);
  const pages: LessonPage[] = [
    page(topic.id, topic.title, readingBlocks(topic, grade), topic.id),
    page(`${topic.id}-careful`, clip(topic.mistake.wrong), cautionBlocks(topic, grade), topic.id),
  ];
  if (formulas.length > 0 || (topic.worked && grade >= 6)) {
    pages.push(
      page(
        `${topic.id}-relation`,
        formulas[0] ? formulas[0].name : clip(topic.worked?.prompt ?? topic.title),
        formulaBlocks(topic, grade, formulas),
        topic.id,
      ),
    );
  }
  if (topic.practice.length > 0 || topic.quiz.length > 0) {
    const titleSource = topic.practice[0]?.question ?? topic.quiz[0]?.question ?? topic.check.question;
    pages.push(page(`${topic.id}-questions`, clip(titleSource), questionBlocks(topic, grade), topic.id));
  }
  return pages;
}

export function chapterPages(chapter: Chapter, grade: number): LessonPage[] {
  const intro: TutorReply["blocks"] = [
    { type: "text", text: chapter.promise },
    { type: "text", text: chapter.scopeNote },
  ];
  for (const topic of chapter.topics) {
    intro.push({ type: "subheading", text: topic.title, depth: "part" });
    intro.push({ type: "text", text: grade <= 5 ? topic.younger : topic.idea });
    if (grade >= 11 && topic.senior) intro.push({ type: "text", text: topic.senior });
    intro.push({ type: "text", text: topic.example });
  }
  const pages: LessonPage[] = [page(chapter.id, chapter.title, intro)];
  for (const topic of chapter.topics) pages.push(...topicPages(topic, grade));
  return pages;
}

export function explainChapter(chapter: Chapter, grade: number): TutorReply {
  const blocks: TutorReply["blocks"] = [
    { type: "heading", text: chapter.title },
    { type: "text", text: chapter.promise },
    { type: "text", text: chapter.scopeNote },
  ];
  for (const topic of chapter.topics) {
    blocks.push(...topicSections(topic, grade));
  }
  return { blocks, chapterId: chapter.id, topicId: chapter.topics[0]?.id };
}

export function explainTopic(topic: Topic, chapter: Chapter, grade: number, sameGrade = true): TutorReply {
  return {
    blocks: [
      { type: "heading", text: chapter.title },
      { type: "text", text: chapter.promise },
      ...topicSections(topic, grade),
      {
        type: "confidence",
        level: "grounded",
        note: sameGrade
          ? `Class ${grade} · ${chapter.title}`
          : `Class ${grade} language · ${chapter.title}`,
      },
    ],
    topicId: topic.id,
    chapterId: chapter.id,
  };
}
