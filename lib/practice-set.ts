import { chaptersForGrade } from "@/content/curriculum";
import { furtherFor } from "@/content/curriculum/further";
import type { PracticeItem, Topic } from "@/content/types";

export type PracticeCard = PracticeItem & { topic: string; chapterId: string; chapter: string };

export function practiceForGrade(grade: number): PracticeCard[] {
  const cards: PracticeCard[] = [];
  const seen = new Set<string>();

  for (const chapter of chaptersForGrade(grade)) {
    for (const topic of chapter.topics) {
      for (const item of topic.practice) {
        push(cards, seen, { ...item, topic: topic.title, chapterId: chapter.id, chapter: chapter.title });
      }
      for (const item of extras(topic, grade)) {
        push(cards, seen, { ...item, topic: topic.title, chapterId: chapter.id, chapter: chapter.title });
      }
    }
  }

  return cards;
}

function extras(topic: Topic, grade: number): PracticeItem[] {
  const voice = grade <= 5 ? topic.younger : topic.idea;
  const items: PracticeItem[] = [
    {
      id: `${topic.id}-explain`,
      question: `Explain “${topic.title}” in the words of this class.`,
      hint: "Use the main idea from the chapter, in a short paragraph.",
      answer: voice,
    },
    {
      id: `${topic.id}-case`,
      question: `Give one real case of “${topic.title}”.`,
      hint: opening(topic.example),
      answer: topic.example,
    },
    {
      id: `${topic.id}-check`,
      question: topic.check.question,
      hint: "Try it before you open the answer. It is the check from this topic.",
      answer: topic.check.answer,
    },
    {
      id: `${topic.id}-fix`,
      question: `A student says, “${topic.mistake.wrong}” What should you say instead?`,
      hint: "This is a common mistake for the topic.",
      answer: topic.mistake.right,
    },
  ];

  if (grade >= 11 && topic.senior) {
    items.push({
      id: `${topic.id}-senior`,
      question: `What extra condition belongs with “${topic.title}” in this class?`,
      hint: "Classes 11 and 12 keep one more limit on the idea.",
      answer: topic.senior,
    });
  }

  topic.keyPoints.forEach((point, index) => {
    items.push({
      id: `${topic.id}-point-${index + 1}`,
      question: `State point ${index + 1} to remember about “${topic.title}”.`,
      hint: opening(point),
      answer: point,
    });
  });

  furtherFor(topic.id).forEach((paragraph, index) => {
    items.push({
      id: `${topic.id}-more-${index + 1}`,
      question: `What else should you remember about “${topic.title}”? Part ${index + 1}.`,
      hint: opening(paragraph),
      answer: paragraph,
    });
  });

  return items;
}

function push(cards: PracticeCard[], seen: Set<string>, card: PracticeCard) {
  const key = card.question.trim().toLowerCase().replace(/\s+/g, " ");
  if (!key || seen.has(key) || !card.answer.trim()) return;
  seen.add(key);
  cards.push(card);
}

function opening(text: string): string {
  const words = text.trim().split(/\s+/);
  if (words.length <= 7) return "Look at the note for this topic in Learn.";
  return `${words.slice(0, 7).join(" ")}…`;
}
