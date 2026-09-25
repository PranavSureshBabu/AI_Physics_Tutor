export type Tool = {
  href: string;
  label: string;
  group: "Study" | "Practice" | "Review";
  note: string;
};

export const TOOLS: Tool[] = [
  {
    href: "/learn",
    label: "Learn",
    group: "Study",
    note: "The chapter book. Open one chapter and turn the pages.",
  },
  {
    href: "/doubts",
    label: "Doubts",
    group: "Study",
    note: "Ask in your own words. The answer is written for this class.",
  },
  {
    href: "/numericals",
    label: "Numericals",
    group: "Practice",
    note: "Type a sum with its numbers. A result appears only when it can be checked.",
  },
  {
    href: "/practice",
    label: "Practice",
    group: "Practice",
    note: "A long set from your class chapters. Try a question, then open the hint.",
  },
  {
    href: "/quiz",
    label: "Quiz",
    group: "Practice",
    note: "Fifty questions from this class. Your score shows at the end.",
  },
  {
    href: "/revision",
    label: "Revision",
    group: "Review",
    note: "A full recap of one chapter: formulas, facts, cases, checks, and mistakes.",
  },
  {
    href: "/progress",
    label: "Progress",
    group: "Review",
    note: "Topics you opened, questions you asked, and your scores.",
  },
];

export const NAV = [{ href: "/", label: "Home" }, ...TOOLS.map(({ href, label }) => ({ href, label }))];

export function toolByHref(href: string) {
  return TOOLS.find((item) => item.href === href);
}
