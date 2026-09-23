import type { TutorReply } from "@/lib/blocks";
import { FormulaView } from "@/components/FormulaView";
import { Sketch } from "@/components/Sketch";

const badgeClass = {
  verified: "badge",
  grounded: "badge",
  needs_info: "badge warn",
  cannot_answer: "badge stop",
  external: "badge outside",
};

export function TutorMessage({ reply }: { reply: TutorReply }) {
  return (
    <article className="lesson">
      {reply.blocks.map((block, index) => {
        if (block.type === "heading") {
          return (
            <h2 className="page-title" id={block.id} style={{ fontSize: "2rem" }} key={index}>
              {block.text}
            </h2>
          );
        }
        if (block.type === "subheading") {
          return (
            <h3 className={block.depth === "part" ? "section-title part" : "section-title"} id={block.id} key={index}>
              {block.text}
            </h3>
          );
        }
        if (block.type === "text") return <p key={index}>{block.text}</p>;
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
                    <span>{stepIndex + 1}</span>
                    <p style={{ margin: 0 }}>{step.text}</p>
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
              <p style={{ margin: "6px 0 0" }}>{block.text}</p>
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
