"use client";

import { useState } from "react";
import { useStudent } from "@/components/StudentProvider";

export function LoginGate() {
  const { signIn, signUp } = useStudent();
  const [mode, setMode] = useState<"in" | "up">("in");
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [busy, setBusy] = useState(false);

  async function submit(event: React.FormEvent) {
    event.preventDefault();
    setBusy(true);
    setError("");
    const message = mode === "in" ? await signIn(username, password) : await signUp(username, password);
    setError(message);
    setBusy(false);
  }

  return (
    <div className="gate">
      <section className="gate-copy">
        <p className="eyebrow">Classes 1 to 12</p>
        <h1>Physics Tutor</h1>
        <p>
          A physics class you open at home. It teaches one standard at a time, from the first years of school through Class 12.
        </p>
        <ul>
          <li>Sign in, then choose your class.</li>
          <li>The next page is the book, doubts, sums, practice, a quiz, and revision for that class.</li>
          <li>A number answer is shown only when the sum can be checked.</li>
        </ul>
      </section>
      <form className="gate-card" onSubmit={submit}>
        <h2>{mode === "in" ? "Sign in" : "Create an account"}</h2>
        <p className="muted">
          {mode === "in"
            ? "Use the username and password you created on this browser."
            : "Pick a username and password. They stay on this browser."}
        </p>
        <label>
          Username
          <input
            autoComplete="username"
            value={username}
            onChange={(event) => setUsername(event.target.value)}
            required
          />
        </label>
        <label>
          Password
          <input
            type="password"
            autoComplete={mode === "in" ? "current-password" : "new-password"}
            value={password}
            onChange={(event) => setPassword(event.target.value)}
            required
          />
        </label>
        {error ? <p className="form-error">{error}</p> : null}
        <button className="primary" type="submit" disabled={busy}>
          {mode === "in" ? "Sign in" : "Create account"}
        </button>
        <button
          className="text-button"
          type="button"
          onClick={() => {
            setMode(mode === "in" ? "up" : "in");
            setError("");
          }}
        >
          {mode === "in" ? "New here? Create an account" : "Already have an account? Sign in"}
        </button>
      </form>
    </div>
  );
}
