"use client";

import katex from "katex";
import { getFormula } from "@/content/formulas";
import { texSymbol } from "@/lib/tex";

export function FormulaView({ formulaId }: { formulaId: string }) {
  const formula = getFormula(formulaId);
  if (!formula) return null;
  const html = katex.renderToString(formula.latex, { throwOnError: false, displayMode: true });
  return (
    <figure className="formula-card">
      <figcaption style={{ fontWeight: 800 }}>{formula.name}</figcaption>
      <div dangerouslySetInnerHTML={{ __html: html }} />
      <p className="muted" style={{ margin: "0 0 8px" }}>
        {formula.plain}. {formula.meaning}
      </p>
      <ul className="symbol-list">
        {formula.variables.map((variable) => (
          <li key={variable.symbol}>
            <b dangerouslySetInnerHTML={{ __html: katex.renderToString(texSymbol(variable.symbol), { throwOnError: false, displayMode: false }) }} />
            <span>
              {variable.meaning}. Unit: {variable.unit}.
            </span>
          </li>
        ))}
      </ul>
    </figure>
  );
}
