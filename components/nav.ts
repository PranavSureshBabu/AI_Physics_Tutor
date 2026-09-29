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
    label: "Doubt Tutor",
    group: "Study",
    note: "Ask in your own words. The answer stays in this class.",
  },
  {
    href: "/numericals",
    label: "Numerical Solver",
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
    label: "My Progress",
    group: "Review",
    note: "Topics you opened, questions you asked, and your scores.",
  },
];

export const NAV = [{ href: "/", label: "Home" }, ...TOOLS.map(({ href, label }) => ({ href, label }))];

export function stepsFor(_grade: number): { href: string; label: string; note: string; step: number }[] {
  const order = ["/learn", "/numericals", "/doubts", "/quiz", "/revision", "/progress", "/practice"];
  return order.map((href, index) => {
    const tool = TOOLS.find((item) => item.href === href)!;
    return { href, label: tool.label, note: tool.note, step: index + 1 };
  });
}

export function toolByHref(href: string) {
  return TOOLS.find((item) => item.href === href);
}
