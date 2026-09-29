"use client";

import { useEffect, useState } from "react";

export function spokenFrom(blocks: { type: string; text?: string }[]) {
  return blocks
    .filter((block) => (block.type === "text" || block.type === "heading" || block.type === "subheading") && block.text)
    .map((block) => block.text)
    .join(" ");
}

export function HearThis({ text }: { text: string }) {
  const [on, setOn] = useState(false);

  useEffect(() => {
    return () => {
      if (typeof window !== "undefined" && window.speechSynthesis) window.speechSynthesis.cancel();
    };
  }, []);

  useEffect(() => {
    if (typeof window !== "undefined" && window.speechSynthesis) window.speechSynthesis.cancel();
    setOn(false);
  }, [text]);

  function toggle() {
    if (typeof window === "undefined" || !window.speechSynthesis || !text.trim()) return;
    if (on) {
      window.speechSynthesis.cancel();
      setOn(false);
      return;
    }
    const utter = new SpeechSynthesisUtterance(text);
    utter.rate = 0.92;
    utter.onend = () => setOn(false);
    utter.onerror = () => setOn(false);
    window.speechSynthesis.cancel();
    window.speechSynthesis.speak(utter);
    setOn(true);
  }

  if (!text.trim()) return null;
  return (
    <button className="hear" type="button" onClick={toggle} aria-pressed={on}>
      {on ? "Stop" : "Hear this"}
    </button>
  );
}
