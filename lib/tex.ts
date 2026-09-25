/** Turn a stored symbol such as v_av or Δt into KaTeX. */
export function texSymbol(symbol: string): string {
  return symbol
    .replace(/Δ/g, "\\Delta ")
    .replace(/π/g, "\\pi ")
    .replace(/θ/g, "\\theta ")
    .replace(/ω/g, "\\omega ")
    .replace(/λ/g, "\\lambda ")
    .replace(/μ/g, "\\mu ")
    .replace(/ρ/g, "\\rho ")
    .replace(/α/g, "\\alpha ")
    .replace(/β/g, "\\beta ")
    .replace(/φ/g, "\\phi ")
    .replace(/ε/g, "\\varepsilon ")
    .replace(/²/g, "^{2}")
    .replace(/³/g, "^{3}")
    .replace(/_([A-Za-z0-9]+)/g, "_{$1}")
    .replace(/\^([A-Za-z0-9]+)/g, "^{$1}");
}
