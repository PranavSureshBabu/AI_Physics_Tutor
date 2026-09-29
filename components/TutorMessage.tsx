import { Fragment, type ReactNode } from "react";
import type { TutorReply } from "@/lib/blocks";
import { FormulaView } from "@/components/FormulaView";
import { MathLine, MathText } from "@/components/MathText";
import { Sketch } from "@/components/Sketch";

const badgeClass = {
  verified: "badge",
  grounded: "badge",
  needs_info: "badge warn",
  cannot_answer: "badge stop",
  external: "badge outside",
};

export function TutorMessage({
  reply,
  visual,
  side = "left",
}: {
  reply: TutorReply;
  visual?: ReactNode;
  side?: "left" | "right";
}) {
  let placed = !visual;
  return (
    <article className="lesson">
      {reply.blocks.map((block, index) => {
        const figure =
          !placed && (block.type === "heading" || index === reply.blocks.length - 1) ? (
            <div className={`text-fig side-${side}`} key="visual">
              {visual}
            </div>
          ) : null;
        if (figure) placed = true;
        if (block.type === "heading") {
          return (
            <Fragment key={index}>
              <h2 className="page-title" id={block.id}>
                {block.text}
              </h2>
              {figure}
            </Fragment>
          );
        }
        if (block.type === "subheading") {
          return (
            <h3 className={block.depth === "part" ? "section-title part" : "section-title"} id={block.id} key={index}>
              {block.text}
            </h3>
          );
        }
        if (block.type === "text") {
          return (
            <p key={index}>
              <MathText text={block.text} />
            </p>
          );
        }
        if (block.type === "formula") return <FormulaView key={index} formulaId={block.formulaId} />;
        if (block.type === "sketch") return <Sketch key={index} name={block.name} caption={block.caption} />;
        if (block.type === "list") {
          return (
            <div key={index}>
              <strong>{block.title}</strong>
              <ul>
                {block.items.map((item) => (
                  <li key={item}>{item}</li>
                ))}
              </ul>
            </div>
          );
        }
        if (block.type === "links") {
          return (
            <div key={index}>
              <strong>{block.title}</strong>
              <ul className="source-list">
                {block.items.map((item) => (
                  <li key={item.href}>
                    <a href={item.href} target="_blank" rel="noreferrer">
                      {item.label}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          );
        }
        if (block.type === "steps") {
          return (
            <div key={index}>
              <strong>{block.title}</strong>
              <ol className="step-list">
                {block.steps.map((step, stepIndex) => (
                  <li key={step.text}>
                    <span className="step-index">{stepIndex + 1}</span>
                    <div>
                      <p style={{ margin: 0 }}>
                        <MathText text={step.text} />
                      </p>
                      {step.latex ? <MathLine tex={step.latex} /> : null}
                    </div>
                  </li>
                ))}
              </ol>
            </div>
          );
        }
        if (block.type === "table") {
          return (
            <table className="data-table" key={index}>
              {block.caption ? <caption>{block.caption}</caption> : null}
              <thead>
                <tr>
                  {block.headers.map((header) => (
                    <th key={header}>{header}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {block.rows.map((row) => (
                  <tr key={row.join("|")}>
                    {row.map((cell) => (
                      <td key={cell}>{cell}</td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          );
        }
        if (block.type === "callout") {
          return (
            <div className={`callout ${block.tone}`} key={index}>
              <strong>{block.title}</strong>
              <p style={{ margin: "6px 0 0" }}>
                <MathText text={block.text} />
              </p>
            </div>
          );
        }
        return (
          <p className={badgeClass[block.level]} key={index}>
            {block.note}
            {reply.modelUsed && block.level !== "external"
              ? " Phrasing assisted by the language model; the facts stay in the notes."
              : ""}
          </p>
        );
      })}
    </article>
  );
}
