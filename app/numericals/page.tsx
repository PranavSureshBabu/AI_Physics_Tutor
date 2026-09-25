"use client";

import { ChatPanel } from "@/components/ChatPanel";
import { PageGuide } from "@/components/PageGuide";
import { FormulaLab } from "@/components/FormulaLab";
import { benchFor, promptsFor } from "@/lib/calculators";
import { useStudent } from "@/components/StudentProvider";

export default function NumericalsPage() {
  const { grade } = useStudent();
  const bench = benchFor(grade);

  return (
    <main>
      <PageGuide href="/numericals" />
      <div className={bench ? "numerical-layout" : undefined}>
        <div>
          <ChatPanel
            mode="numerical"
            placeholder={grade <= 5 ? "Ask about something you saw, or paste a problem" : "Paste a problem, even if it is not from these notes"}
            suggestions={promptsFor(grade)}
          />
        </div>
        {bench ? <FormulaLab grade={grade} /> : null}
      </div>
    </main>
  );
}
