"use client";

import { ChatPanel } from "@/components/ChatPanel";
import { FormulaLab } from "@/components/FormulaLab";
import { useStudent } from "@/components/StudentProvider";

export default function NumericalsPage() {
  const { grade } = useStudent();
  const suggestions =
    grade <= 8
      ? ["A car travels 100 m in 20 s. Find its speed.", "A bus covers 120 km in 2 hours. What is its speed?"]
      : [
          "A body starts from rest and accelerates at 2 m/s² for 5 s. Find the final velocity.",
          "A 3 kg box accelerates at 4 m/s². Find the force.",
          "A current of 2 A flows through a 5 ohm resistor. Find the potential difference.",
        ];

  return (
    <main className="split">
      <div>
        <h1 className="page-title">Solve a numerical</h1>
        <ChatPanel mode="numerical" placeholder="Type a physics problem" suggestions={suggestions} />
      </div>
      <FormulaLab />
    </main>
  );
}
