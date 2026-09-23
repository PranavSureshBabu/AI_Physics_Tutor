"use client";

import { ChatPanel } from "@/components/ChatPanel";
import { useStudent } from "@/components/StudentProvider";

export default function DoubtsPage() {
  const { grade } = useStudent();
  const suggestions =
    grade <= 5
      ? ["What is a push?", "Why do we see a shadow?", "What is velocity?"]
      : grade <= 8
        ? ["What is speed?", "Why do magnets repel?", "What is pressure?"]
        : grade <= 10
          ? ["What is velocity?", "Explain Ohm's law", "What is an echo?"]
          : ["What is capacitance?", "Explain the photoelectric effect", "What is half-life?"];

  return (
    <main>
      <h1 className="page-title">Ask a doubt</h1>
      <p className="muted">Ask in your own words. The answer is written for your class.</p>
      <ChatPanel mode="doubt" placeholder="Ask a physics doubt" suggestions={suggestions} />
    </main>
  );
}
