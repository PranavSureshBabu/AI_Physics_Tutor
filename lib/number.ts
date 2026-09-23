export function formatNumber(value: number): string {
  if (!Number.isFinite(value)) return "—";
  const abs = Math.abs(value);
  if (abs === 0) return "0";
  if (abs >= 100000 || abs < 0.001) {
    const exp = value.toExponential(3);
    const [mantissa, power] = exp.split("e");
    const cleaned = mantissa.replace(/\.?0+$/, "");
    return `${cleaned} × 10^${Number(power)}`;
  }
  const digits = abs >= 100 ? 1 : abs >= 10 ? 2 : 3;
  return value.toFixed(digits).replace(/\.?0+$/, "");
}

export function nearlyEqual(a: number, b: number, tolerance = 1e-6): boolean {
  const scale = Math.max(1, Math.abs(a), Math.abs(b));
  return Math.abs(a - b) <= tolerance * scale;
}
