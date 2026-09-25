"use client";

import katex from "katex";

function html(tex: string, display: boolean) {
  return katex.renderToString(tex.trim(), { throwOnError: false, displayMode: display });
}

export function MathLine({ tex }: { tex: string }) {
  return <span className="math-display" dangerouslySetInnerHTML={{ __html: html(tex, true) }} />;
}

export function MathText({ text }: { text: string }) {
  const pieces: { math: boolean; display: boolean; value: string }[] = [];
  const pattern = /\$\$([\s\S]+?)\$\$|\\\[([\s\S]+?)\\\]|\$([^$\n]+?)\$|\\\(([^)]+?)\\\)/g;
  let last = 0;
  for (const match of text.matchAll(pattern)) {
    const index = match.index ?? 0;
    if (index > last) pieces.push({ math: false, display: false, value: text.slice(last, index) });
    const display = match[1] != null || match[2] != null;
    pieces.push({ math: true, display, value: match[1] ?? match[2] ?? match[3] ?? match[4] ?? "" });
    last = index + match[0].length;
  }
  if (last < text.length) pieces.push({ math: false, display: false, value: text.slice(last) });

  return (
    <>
      {pieces.map((piece, index) =>
        piece.math ? (
          piece.display ? (
            <span className="math-display" key={index} dangerouslySetInnerHTML={{ __html: html(piece.value, true) }} />
          ) : (
            <span key={index} dangerouslySetInnerHTML={{ __html: html(piece.value, false) }} />
          )
        ) : (
          <span key={index}>{piece.value}</span>
        ),
      )}
    </>
  );
}
