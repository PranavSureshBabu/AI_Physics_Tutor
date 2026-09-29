"use client";

import { stepsFor } from "@/components/nav";
import { useStudent } from "@/components/StudentProvider";

export function PageGuide({ href }: { href: string }) {
  const { grade } = useStudent();
  const step = stepsFor(grade).find((item) => item.href === href);
  if (!step) return null;
  return (
    <header className="page-guide">
      <p className="eyebrow">
        Step {step.step}
        {step.step === 1 ? " · Start here" : ""}
      </p>
      <h1 className="page-title">{step.label}</h1>
      <p>{step.note}</p>
    </header>
  );
}
