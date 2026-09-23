"use client";

import { useState } from "react";
import type { TutorReply } from "@/lib/blocks";
import { TutorMessage } from "@/components/TutorMessage";
import { useStudent } from "@/components/StudentProvider";

type ChatMessage = { role: "user" | "tutor"; text: string; reply?: TutorReply };

export function ChatPanel({
  mode,
  placeholder,
  suggestions,
  topicId,
}: {
  mode: "doubt" | "numerical";
  placeholder: string;
  suggestions: string[];
  topicId?: string;
}) {
  const { grade, studentId, ready } = useStudent();
  const [conversationId, setConversationId] = useState<string>();
  const [draft, setDraft] = useState("");
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");

  async function send(text: string) {
    const message = text.trim();
    if (!message || !ready || busy) return;
    setDraft("");
    setBusy(true);
    setError("");
    setMessages((current) => [...current, { role: "user", text: message }]);
    try {
      const response = await fetch("/api/chat", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({ studentId, conversationId, grade, mode, message, topicId }),
      });
      const data = (await response.json()) as { conversationId?: string; reply?: TutorReply; error?: string };
      if (!response.ok || !data.reply) throw new Error(data.error ?? "The tutor could not answer.");
      setConversationId(data.conversationId);
      setMessages((current) => [...current, { role: "tutor", text: "", reply: data.reply }]);
    } catch (caught) {
      setError(caught instanceof Error ? caught.message : "Something went wrong.");
    } finally {
      setBusy(false);
    }
  }

  return (
    <section className="panel">
      <div className="chat-log">
        {messages.length === 0 ? <p className="muted">Ask in your own words. The answer matches your class.</p> : null}
        {messages.map((message, index) =>
          message.role === "user" ? (
            <p className="bubble user" key={index}>
              {message.text}
            </p>
          ) : message.reply ? (
            <TutorMessage key={index} reply={message.reply} />
          ) : null,
        )}
      </div>
      <div style={{ display: "flex", gap: 8, flexWrap: "wrap", marginTop: 12 }}>
        {suggestions.map((suggestion) => (
          <button className="ghost" key={suggestion} type="button" onClick={() => send(suggestion)}>
            {suggestion}
          </button>
        ))}
      </div>
      <form
        className="composer"
        onSubmit={(event) => {
          event.preventDefault();
          void send(draft);
        }}
      >
        <input
          value={draft}
          onChange={(event) => setDraft(event.target.value)}
          placeholder={placeholder}
          aria-label={placeholder}
          maxLength={2000}
        />
        <button className="primary" type="submit" disabled={busy || !ready}>
          {busy ? "Checking" : "Send"}
        </button>
      </form>
      {error ? <p className="badge stop">{error}</p> : null}
    </section>
  );
}
