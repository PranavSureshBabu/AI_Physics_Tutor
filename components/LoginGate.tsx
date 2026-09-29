"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { bands } from "@/content/grades";
import { OpeningPage } from "@/components/OpeningPage";
import { PhysixMark } from "@/components/PhysixMark";
import { useStudent } from "@/components/StudentProvider";

export function LoginGate() {
  const { signIn, signUp, resetPassword } = useStudent();
  const router = useRouter();
  const [mode, setMode] = useState<"in" | "up" | "forgot">("in");
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [again, setAgain] = useState("");
  const [grade, setGrade] = useState("");
  const [error, setError] = useState("");
  const [notice, setNotice] = useState("");
  const [busy, setBusy] = useState(false);
  const [showForm, setShowForm] = useState(false);

  function switchMode(next: "in" | "up" | "forgot") {
    setMode(next);
    setError("");
    setNotice("");
    setPassword("");
    setAgain("");
  }

  async function submit(event: React.FormEvent) {
    event.preventDefault();
    setBusy(true);
    setError("");
    setNotice("");
    if (mode === "forgot") {
      if (password !== again) {
        setError("Type the new password the same way twice.");
        setBusy(false);
        return;
      }
      const message = await resetPassword(username, password);
      if (message) setError(message);
      else {
        setPassword("");
        setAgain("");
        setMode("in");
        setNotice("Password saved. Sign in with the new password.");
      }
      setBusy(false);
      return;
    }
    const chosen = Number(grade);
    const message = mode === "up" ? await signUp(username, password, chosen) : await signIn(username, password, chosen);
    if (!message) router.replace("/");
    setError(message);
    setBusy(false);
  }

  if (!showForm) return <OpeningPage onEnter={() => setShowForm(true)} />;

  const title = mode === "up" ? "Create an account" : mode === "forgot" ? "Forgot password" : "Login";
  const action = mode === "up" ? "Create account" : mode === "forgot" ? "Save password" : "Login";

  return (
    <div className="credito">
      <section className="credito-card">
        <aside className="credito-night">
          <div className="brand">
            <PhysixMark />
            <div>
              <strong>PHYSICA</strong>
              <span>AI Physics Tutor</span>
            </div>
          </div>
          <h2>Learn physics smarter, brighter, easier</h2>
          <p>Read one chapter. Try a sum. Ask a doubt. Then take the quiz.</p>
          <img src="/scenes/login-night.jpg" alt="A child studying at a desk at night" />
          <p className="credito-foot">Small steps every day.</p>
        </aside>
        <form className="credito-form" onSubmit={submit}>
          <h1>{title}</h1>
          {mode === "forgot" ? <p className="credito-lead">Type your username and a new password. Your class stays the same.</p> : null}
          <label>
            Username
            <input autoComplete="username" value={username} onChange={(event) => setUsername(event.target.value)} required />
          </label>
          <label>
            {mode === "forgot" ? "New password" : "Password"}
            <input
              type="password"
              autoComplete={mode === "in" ? "current-password" : "new-password"}
              value={password}
              onChange={(event) => setPassword(event.target.value)}
              required
            />
          </label>
          {mode === "forgot" ? (
            <label>
              New password again
              <input type="password" autoComplete="new-password" value={again} onChange={(event) => setAgain(event.target.value)} required />
            </label>
          ) : (
            <label>
              Select your class
              <select value={grade} onChange={(event) => setGrade(event.target.value)} required aria-label="Select your class">
                <option value="">Select your class</option>
                {bands.map((band) => (
                  <optgroup key={band.id} label={band.name}>
                    {band.grades.map((item) => (
                      <option key={item} value={item}>
                        Class {item}
                      </option>
                    ))}
                  </optgroup>
                ))}
              </select>
            </label>
          )}
          {notice ? <p className="credito-lead">{notice}</p> : null}
          {error ? <p className="form-error">{error}</p> : null}
          <button className="primary" type="submit" disabled={busy || (mode !== "forgot" && !grade)}>
            {busy ? "Opening…" : action}
          </button>
          {mode === "in" ? (
            <div className="login-links">
              <button className="text-button" type="button" onClick={() => switchMode("up")}>
                New user? Create an account
              </button>
              <button className="text-button" type="button" onClick={() => switchMode("forgot")}>
                Forgot password?
              </button>
            </div>
          ) : (
            <button className="text-button" type="button" onClick={() => switchMode("in")}>
              {mode === "up" ? "Already have an account? Sign in" : "Back to login"}
            </button>
          )}
        </form>
      </section>
    </div>
  );
}
