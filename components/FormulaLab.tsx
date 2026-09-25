"use client";

import { useMemo, useState } from "react";
import { formulas } from "@/content/formulas";
import { TutorMessage } from "@/components/TutorMessage";
import { benchFor } from "@/lib/calculators";
import { UNIT_CHOICES } from "@/lib/units";
import { listSolvers, solve } from "@/lib/solver";
import type { TutorReply } from "@/lib/blocks";

export function FormulaLab({ grade }: { grade: number }) {
  const bench = benchFor(grade);
  const solvers = useMemo(() => {
    if (!bench) return [];
    const all = listSolvers();
    return bench.ids.flatMap((id) => all.filter((item) => item.id === id));
  }, [bench]);
  const [formulaId, setFormulaId] = useState(solvers[0]?.id ?? "");
  const spec = solvers.find((item) => item.id === formulaId) ?? solvers[0];
  const [find, setFind] = useState(spec?.finds[0] ?? "");
  const [values, setValues] = useState<Record<string, string>>({});
  const [units, setUnits] = useState<Record<string, string>>({});
  const [reply, setReply] = useState<TutorReply | null>(null);

  function chooseFormula(nextId: string) {
    const next = solvers.find((item) => item.id === nextId);
    setFormulaId(nextId);
    setFind(next?.finds[0] ?? "");
    setValues({});
    setUnits({});
    setReply(null);
  }

  function check() {
    if (!spec || !find) return;
    const known: Record<string, { value: number; unit: string }> = {};
    for (const variable of spec.variables) {
      if (variable.key === find) continue;
      const raw = values[variable.key];
      if (!raw) continue;
      known[variable.key] = {
        value: Number(raw),
        unit: units[variable.key] ?? UNIT_CHOICES[variable.dimension][0],
      };
    }
    const result = solve({ formulaId: spec.id, known, find });
    setReply({
      blocks: [
        { type: "heading", text: result.status === "verified" ? "Checked" : "Not checked" },
        { type: "text", text: result.message },
        ...(result.steps.length ? [{ type: "steps" as const, title: "Steps", steps: result.steps }] : []),
        ...(result.assumptions.length
          ? [{ type: "callout" as const, tone: "remember" as const, title: "Assumption", text: result.assumptions.join(" ") }]
          : []),
        {
          type: "confidence",
          level: result.status === "verified" ? "verified" : result.status === "needs_info" ? "needs_info" : "cannot_answer",
          note: result.status === "verified" ? "Verified by direct calculation." : "No guessed number was added.",
        },
      ],
    });
  }

  if (!bench || !spec) return null;
  const formulaName = (id: string) => formulas.find((item) => item.id === id)?.name ?? id.replaceAll("-", " ");

  return (
    <section className="panel calculator-panel">
      <h2 style={{ marginTop: 0 }}>{bench.title}</h2>
      <p className="muted">{bench.note}</p>
      <label className="field">
        Formula
        <select className="line" value={spec.id} onChange={(event) => chooseFormula(event.target.value)}>
          {solvers.map((item) => (
            <option key={item.id} value={item.id}>
              {formulaName(item.id)}
            </option>
          ))}
        </select>
      </label>
      <label className="field">
        Find
        <select className="line" value={find} onChange={(event) => setFind(event.target.value)}>
          {spec.finds.map((item) => (
            <option key={item} value={item}>
              {spec.variables.find((variable) => variable.key === item)?.label ?? item}
            </option>
          ))}
        </select>
      </label>
      <div className="calc-fields">
        {spec.variables
          .filter((variable) => variable.key !== find)
          .map((variable) => (
            <label key={variable.key} className="field">
              {variable.label}
              <span style={{ display: "flex", gap: 8 }}>
                <input
                  inputMode="decimal"
                  value={values[variable.key] ?? ""}
                  onChange={(event) => setValues((current) => ({ ...current, [variable.key]: event.target.value }))}
                  aria-label={variable.label}
                />
                <select
                  value={units[variable.key] ?? UNIT_CHOICES[variable.dimension][0]}
                  onChange={(event) => setUnits((current) => ({ ...current, [variable.key]: event.target.value }))}
                  aria-label={`${variable.label} unit`}
                >
                  {UNIT_CHOICES[variable.dimension].map((unit) => (
                    <option key={unit} value={unit}>
                      {unit}
                    </option>
                  ))}
                </select>
              </span>
            </label>
          ))}
      </div>
      <button className="primary" type="button" style={{ marginTop: 14 }} onClick={check}>
        Check with calculator
      </button>
      {reply ? (
        <div style={{ marginTop: 16 }}>
          <TutorMessage reply={reply} />
        </div>
      ) : null}
    </section>
  );
}
