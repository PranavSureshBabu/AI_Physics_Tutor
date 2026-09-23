import { getFormula } from "@/content/formulas";
import type { KnownValue } from "@/content/types";
import { formatNumber, nearlyEqual } from "@/lib/number";
import { siUnit, toSI, type Dimension } from "@/lib/units";

export type SolveStatus = "verified" | "needs_info" | "cannot_verify" | "not_calculation";

export type SolveStep = { text: string; latex?: string };

export type SolveResult = {
  status: SolveStatus;
  value?: number;
  unit?: string;
  display?: string;
  steps: SolveStep[];
  message: string;
  formulaId?: string;
  assumptions: string[];
};

export type SolveRequest = {
  formulaId: string;
  known: Record<string, KnownValue>;
  find: string;
};

export type SolverVariable = {
  key: string;
  label: string;
  dimension: Dimension;
};

type DefaultValue = { si: number; assumption: string };

type FormulaSpec = {
  id: string;
  variables: SolverVariable[];
  finds: string[];
  defaults?: Record<string, DefaultValue>;
  compute: (find: string, values: Record<string, number>) => number | "impossible" | "ambiguous";
};

const G = 9.8;
const K_COULOMB = 9e9;
const PLANCK = 6.626e-34;
const LIGHT = 3e8;

function product(
  find: string,
  values: Record<string, number>,
  output: string,
  factors: string[],
): number | "impossible" {
  if (find === output) {
    return factors.reduce((total, key) => total * values[key], 1);
  }
  const knownFactors = factors.filter((key) => key !== find);
  const divisor = knownFactors.reduce((total, key) => total * values[key], 1);
  if (divisor === 0) return "impossible";
  return values[output] / divisor;
}

function ratio(
  find: string,
  values: Record<string, number>,
  out: string,
  top: string,
  bottom: string,
): number | "impossible" {
  if (find === out) {
    if (values[bottom] === 0) return "impossible";
    return values[top] / values[bottom];
  }
  if (find === top) return values[out] * values[bottom];
  if (values[out] === 0) return "impossible";
  return values[top] / values[out];
}

const speedCompute: FormulaSpec["compute"] = (find, values) => ratio(find, values, "v", "s", "t");

const uatCompute: FormulaSpec["compute"] = (find, n) => {
  if (find === "v") return n.u + n.a * n.t;
  if (find === "u") return n.v - n.a * n.t;
  if (find === "a") {
    if (n.t === 0) return "impossible";
    return (n.v - n.u) / n.t;
  }
  if (n.a === 0) return "impossible";
  return (n.v - n.u) / n.a;
};

const specs: FormulaSpec[] = [
  {
    id: "speed",
    finds: ["v", "s", "t"],
    variables: [
      { key: "s", label: "Distance", dimension: "length" },
      { key: "t", label: "Time", dimension: "time" },
      { key: "v", label: "Speed", dimension: "speed" },
    ],
    compute: speedCompute,
  },
  {
    id: "velocity",
    finds: ["v", "s", "t"],
    variables: [
      { key: "s", label: "Displacement", dimension: "length" },
      { key: "t", label: "Time", dimension: "time" },
      { key: "v", label: "Velocity magnitude", dimension: "speed" },
    ],
    compute: speedCompute,
  },
  {
    id: "average-speed",
    finds: ["v", "s", "t"],
    variables: [
      { key: "s", label: "Total distance", dimension: "length" },
      { key: "t", label: "Total time", dimension: "time" },
      { key: "v", label: "Average speed", dimension: "speed" },
    ],
    compute: speedCompute,
  },
  {
    id: "acceleration",
    finds: ["a", "v", "u", "t"],
    variables: [
      { key: "u", label: "Initial velocity", dimension: "speed" },
      { key: "v", label: "Final velocity", dimension: "speed" },
      { key: "a", label: "Acceleration", dimension: "accel" },
      { key: "t", label: "Time", dimension: "time" },
    ],
    compute: uatCompute,
  },
  {
    id: "v-uat",
    finds: ["v", "u", "a", "t"],
    variables: [
      { key: "u", label: "Initial velocity", dimension: "speed" },
      { key: "v", label: "Final velocity", dimension: "speed" },
      { key: "a", label: "Acceleration", dimension: "accel" },
      { key: "t", label: "Time", dimension: "time" },
    ],
    compute: uatCompute,
  },
  {
    id: "s-uat",
    finds: ["s", "u", "a", "t"],
    variables: [
      { key: "s", label: "Displacement", dimension: "length" },
      { key: "u", label: "Initial velocity", dimension: "speed" },
      { key: "a", label: "Acceleration", dimension: "accel" },
      { key: "t", label: "Time", dimension: "time" },
    ],
    compute: (find, n) => {
      if (find === "s") return n.u * n.t + 0.5 * n.a * n.t * n.t;
      if (find === "u") {
        if (n.t === 0) return "impossible";
        return (n.s - 0.5 * n.a * n.t * n.t) / n.t;
      }
      if (find === "a") {
        if (n.t === 0) return "impossible";
        return (2 * (n.s - n.u * n.t)) / (n.t * n.t);
      }
      const A = 0.5 * n.a;
      const B = n.u;
      const C = -n.s;
      if (Math.abs(A) < 1e-12) {
        if (B === 0) return "impossible";
        return C === 0 ? 0 : -C / B;
      }
      const disc = B * B - 4 * A * C;
      if (disc < -1e-9) return "impossible";
      const root = Math.sqrt(Math.max(0, disc));
      const times = [(-B + root) / (2 * A), (-B - root) / (2 * A)].filter((time) => time > 1e-9);
      if (times.length === 1) return times[0];
      return "ambiguous";
    },
  },
  {
    id: "v2-uas",
    finds: ["v", "u", "a", "s"],
    variables: [
      { key: "u", label: "Initial velocity", dimension: "speed" },
      { key: "v", label: "Final speed", dimension: "speed" },
      { key: "a", label: "Acceleration", dimension: "accel" },
      { key: "s", label: "Displacement", dimension: "length" },
    ],
    compute: (find, n) => {
      if (find === "v") {
        const square = n.u * n.u + 2 * n.a * n.s;
        if (square < -1e-9) return "impossible";
        return Math.sqrt(Math.max(0, square));
      }
      if (find === "u") {
        const square = n.v * n.v - 2 * n.a * n.s;
        if (square < -1e-9) return "impossible";
        return Math.sqrt(Math.max(0, square));
      }
      if (find === "a") {
        if (n.s === 0) return "impossible";
        return (n.v * n.v - n.u * n.u) / (2 * n.s);
      }
      if (n.a === 0) return "impossible";
      return (n.v * n.v - n.u * n.u) / (2 * n.a);
    },
  },
  {
    id: "newton-second",
    finds: ["F", "m", "a"],
    variables: [
      { key: "F", label: "Net force", dimension: "force" },
      { key: "m", label: "Mass", dimension: "mass" },
      { key: "a", label: "Acceleration", dimension: "accel" },
    ],
    compute: (find, n) => product(find, n, "F", ["m", "a"]),
  },
  {
    id: "momentum",
    finds: ["p", "m", "v"],
    variables: [
      { key: "p", label: "Momentum", dimension: "momentum" },
      { key: "m", label: "Mass", dimension: "mass" },
      { key: "v", label: "Velocity", dimension: "speed" },
    ],
    compute: (find, n) => product(find, n, "p", ["m", "v"]),
  },
  {
    id: "weight",
    finds: ["W", "m", "g"],
    defaults: { g: { si: G, assumption: "I used g = 9.8 m/s² because the question did not give another value." } },
    variables: [
      { key: "W", label: "Weight", dimension: "force" },
      { key: "m", label: "Mass", dimension: "mass" },
      { key: "g", label: "Gravitational acceleration", dimension: "accel" },
    ],
    compute: (find, n) => product(find, n, "W", ["m", "g"]),
  },
  {
    id: "work",
    finds: ["W", "F", "s", "theta"],
    defaults: {
      theta: { si: 0, assumption: "I assumed the force and displacement point the same way, so the angle is 0°." },
    },
    variables: [
      { key: "W", label: "Work", dimension: "energy" },
      { key: "F", label: "Force", dimension: "force" },
      { key: "s", label: "Displacement", dimension: "length" },
      { key: "theta", label: "Angle between force and displacement", dimension: "angle" },
    ],
    compute: (find, n) => {
      const cos = Math.cos((n.theta * Math.PI) / 180);
      if (find === "W") return n.F * n.s * cos;
      if (find === "F") {
        if (n.s * cos === 0) return "impossible";
        return n.W / (n.s * cos);
      }
      if (find === "s") {
        if (n.F * cos === 0) return "impossible";
        return n.W / (n.F * cos);
      }
      const raw = n.F * n.s === 0 ? NaN : n.W / (n.F * n.s);
      if (!Number.isFinite(raw) || raw < -1 || raw > 1) return "impossible";
      return (Math.acos(raw) * 180) / Math.PI;
    },
  },
  {
    id: "kinetic-energy",
    finds: ["K", "m", "v"],
    variables: [
      { key: "K", label: "Kinetic energy", dimension: "energy" },
      { key: "m", label: "Mass", dimension: "mass" },
      { key: "v", label: "Speed", dimension: "speed" },
    ],
    compute: (find, n) => {
      if (find === "K") return 0.5 * n.m * n.v * n.v;
      if (find === "m") {
        if (n.v === 0) return "impossible";
        return (2 * n.K) / (n.v * n.v);
      }
      if (n.m === 0 || n.K < 0) return "impossible";
      return Math.sqrt((2 * n.K) / n.m);
    },
  },
  {
    id: "potential-energy",
    finds: ["U", "m", "g", "h"],
    defaults: { g: { si: G, assumption: "I used g = 9.8 m/s² because the question did not give another value." } },
    variables: [
      { key: "U", label: "Potential energy", dimension: "energy" },
      { key: "m", label: "Mass", dimension: "mass" },
      { key: "g", label: "Gravitational acceleration", dimension: "accel" },
      { key: "h", label: "Height", dimension: "length" },
    ],
    compute: (find, n) => product(find, n, "U", ["m", "g", "h"]),
  },
  {
    id: "power",
    finds: ["P", "W", "t"],
    variables: [
      { key: "P", label: "Power", dimension: "power" },
      { key: "W", label: "Work", dimension: "energy" },
      { key: "t", label: "Time", dimension: "time" },
    ],
    compute: (find, n) => ratio(find, n, "P", "W", "t"),
  },
  {
    id: "pressure",
    finds: ["P", "F", "A"],
    variables: [
      { key: "P", label: "Pressure", dimension: "pressure" },
      { key: "F", label: "Force", dimension: "force" },
      { key: "A", label: "Area", dimension: "area" },
    ],
    compute: (find, n) => ratio(find, n, "P", "F", "A"),
  },
  {
    id: "density",
    finds: ["rho", "m", "V"],
    variables: [
      { key: "rho", label: "Density", dimension: "density" },
      { key: "m", label: "Mass", dimension: "mass" },
      { key: "V", label: "Volume", dimension: "volume" },
    ],
    compute: (find, n) => ratio(find, n, "rho", "m", "V"),
  },
  {
    id: "liquid-pressure",
    finds: ["P", "h", "rho", "g"],
    defaults: { g: { si: G, assumption: "I used g = 9.8 m/s² because the question did not give another value." } },
    variables: [
      { key: "P", label: "Pressure", dimension: "pressure" },
      { key: "h", label: "Depth", dimension: "length" },
      { key: "rho", label: "Density", dimension: "density" },
      { key: "g", label: "Gravitational acceleration", dimension: "accel" },
    ],
    compute: (find, n) => product(find, n, "P", ["h", "rho", "g"]),
  },
  {
    id: "wave-speed",
    finds: ["v", "f", "lambda"],
    variables: [
      { key: "v", label: "Wave speed", dimension: "speed" },
      { key: "f", label: "Frequency", dimension: "frequency" },
      { key: "lambda", label: "Wavelength", dimension: "wavelength" },
    ],
    compute: (find, n) => product(find, n, "v", ["f", "lambda"]),
  },
  {
    id: "echo-distance",
    finds: ["d", "v", "t"],
    variables: [
      { key: "d", label: "Distance to the reflector", dimension: "length" },
      { key: "v", label: "Speed of sound", dimension: "speed" },
      { key: "t", label: "Echo time", dimension: "time" },
    ],
    compute: (find, n) => {
      if (find === "d") return (n.v * n.t) / 2;
      if (find === "v") {
        if (n.t === 0) return "impossible";
        return (2 * n.d) / n.t;
      }
      if (n.v === 0) return "impossible";
      return (2 * n.d) / n.v;
    },
  },
  {
    id: "ohms-law",
    finds: ["V", "I", "R"],
    variables: [
      { key: "V", label: "Potential difference", dimension: "voltage" },
      { key: "I", label: "Current", dimension: "current" },
      { key: "R", label: "Resistance", dimension: "resistance" },
    ],
    compute: (find, n) => product(find, n, "V", ["I", "R"]),
  },
  {
    id: "series-resistance",
    finds: ["R"],
    variables: [
      { key: "R1", label: "First resistance", dimension: "resistance" },
      { key: "R2", label: "Second resistance", dimension: "resistance" },
      { key: "R3", label: "Third resistance", dimension: "resistance" },
      { key: "R4", label: "Fourth resistance", dimension: "resistance" },
      { key: "R", label: "Equivalent resistance", dimension: "resistance" },
    ],
    compute: (_find, n) => ["R1", "R2", "R3", "R4"].reduce((sum, key) => sum + (n[key] ?? 0), 0),
  },
  {
    id: "parallel-resistance",
    finds: ["R"],
    variables: [
      { key: "R1", label: "First resistance", dimension: "resistance" },
      { key: "R2", label: "Second resistance", dimension: "resistance" },
      { key: "R3", label: "Third resistance", dimension: "resistance" },
      { key: "R4", label: "Fourth resistance", dimension: "resistance" },
      { key: "R", label: "Equivalent resistance", dimension: "resistance" },
    ],
    compute: (_find, n) => {
      const parts = ["R1", "R2", "R3", "R4"].map((key) => n[key]).filter((value) => value !== undefined);
      if (parts.some((value) => value === 0)) return "impossible";
      const reciprocal = parts.reduce((sum, value) => sum + 1 / value, 0);
      if (reciprocal === 0) return "impossible";
      return 1 / reciprocal;
    },
  },
  {
    id: "electric-power",
    finds: ["P", "V", "I", "R"],
    variables: [
      { key: "P", label: "Power", dimension: "power" },
      { key: "V", label: "Potential difference", dimension: "voltage" },
      { key: "I", label: "Current", dimension: "current" },
      { key: "R", label: "Resistance", dimension: "resistance" },
    ],
    compute: (find, n) => {
      const has = (key: string) => Number.isFinite(n[key]);
      if (has("V") && has("I") && has("R") && !nearlyEqual(n.V, n.I * n.R, 1e-3)) return "impossible";
      if (find === "P") {
        if (has("V") && has("I")) return n.V * n.I;
        if (has("I") && has("R")) return n.I * n.I * n.R;
        if (has("V") && has("R")) return n.R === 0 ? "impossible" : (n.V * n.V) / n.R;
      }
      if (find === "I") {
        if (has("V") && has("R")) return n.R === 0 ? "impossible" : n.V / n.R;
        if (has("P") && has("V")) return n.V === 0 ? "impossible" : n.P / n.V;
        if (has("P") && has("R")) return n.R === 0 || n.P < 0 ? "impossible" : Math.sqrt(n.P / n.R);
      }
      if (find === "V") {
        if (has("I") && has("R")) return n.I * n.R;
        if (has("P") && has("I")) return n.I === 0 ? "impossible" : n.P / n.I;
        if (has("P") && has("R")) return n.P < 0 || n.R < 0 ? "impossible" : Math.sqrt(n.P * n.R);
      }
      if (find === "R") {
        if (has("V") && has("I")) return n.I === 0 ? "impossible" : n.V / n.I;
        if (has("P") && has("I")) return n.I === 0 ? "impossible" : n.P / (n.I * n.I);
        if (has("V") && has("P")) return n.P === 0 ? "impossible" : (n.V * n.V) / n.P;
      }
      return "impossible";
    },
  },
  {
    id: "joule-heat",
    finds: ["H", "I", "R", "t"],
    variables: [
      { key: "H", label: "Heat", dimension: "energy" },
      { key: "I", label: "Current", dimension: "current" },
      { key: "R", label: "Resistance", dimension: "resistance" },
      { key: "t", label: "Time", dimension: "time" },
    ],
    compute: (find, n) => {
      if (find === "H") return n.I * n.I * n.R * n.t;
      if (find === "R") {
        if (n.I === 0 || n.t === 0) return "impossible";
        return n.H / (n.I * n.I * n.t);
      }
      if (find === "t") {
        if (n.I === 0 || n.R === 0) return "impossible";
        return n.H / (n.I * n.I * n.R);
      }
      if (n.R * n.t === 0 || n.H < 0) return "impossible";
      return Math.sqrt(n.H / (n.R * n.t));
    },
  },
  {
    id: "friction",
    finds: ["f", "mu", "N"],
    variables: [
      { key: "f", label: "Friction", dimension: "force" },
      { key: "mu", label: "Coefficient of friction", dimension: "dimensionless" },
      { key: "N", label: "Normal force", dimension: "force" },
    ],
    compute: (find, n) => product(find, n, "f", ["mu", "N"]),
  },
  {
    id: "centripetal",
    finds: ["a", "v", "r"],
    variables: [
      { key: "a", label: "Centripetal acceleration", dimension: "accel" },
      { key: "v", label: "Speed", dimension: "speed" },
      { key: "r", label: "Radius", dimension: "length" },
    ],
    compute: (find, n) => {
      if (find === "a") return n.r === 0 ? "impossible" : (n.v * n.v) / n.r;
      if (find === "r") return n.a === 0 ? "impossible" : (n.v * n.v) / n.a;
      if (n.r < 0 || n.a < 0) return "impossible";
      return Math.sqrt(n.a * n.r);
    },
  },
  {
    id: "centripetal-force",
    finds: ["F", "m", "v", "r"],
    variables: [
      { key: "F", label: "Centripetal force", dimension: "force" },
      { key: "m", label: "Mass", dimension: "mass" },
      { key: "v", label: "Speed", dimension: "speed" },
      { key: "r", label: "Radius", dimension: "length" },
    ],
    compute: (find, n) => {
      if (find === "F") return n.r === 0 ? "impossible" : (n.m * n.v * n.v) / n.r;
      if (find === "m") return n.v === 0 ? "impossible" : (n.F * n.r) / (n.v * n.v);
      if (find === "r") return n.F === 0 ? "impossible" : (n.m * n.v * n.v) / n.F;
      if (n.m === 0 || n.r < 0) return "impossible";
      return Math.sqrt((n.F * n.r) / n.m);
    },
  },
  {
    id: "heat-capacity",
    finds: ["Q", "m", "c", "dT"],
    variables: [
      { key: "Q", label: "Heat", dimension: "energy" },
      { key: "m", label: "Mass", dimension: "mass" },
      { key: "c", label: "Specific heat capacity", dimension: "specificheat" },
      { key: "dT", label: "Temperature change", dimension: "tempchange" },
    ],
    compute: (find, n) => product(find, n, "Q", ["m", "c", "dT"]),
  },
  {
    id: "pendulum-period",
    finds: ["T", "L", "g"],
    defaults: { g: { si: G, assumption: "I used g = 9.8 m/s² because the question did not give another value." } },
    variables: [
      { key: "T", label: "Time period", dimension: "time" },
      { key: "L", label: "Length", dimension: "length" },
      { key: "g", label: "Gravitational acceleration", dimension: "accel" },
    ],
    compute: (find, n) => {
      if (n.g < 0 || n.L < 0) return "impossible";
      if (find === "T") return n.g === 0 ? "impossible" : 2 * Math.PI * Math.sqrt(n.L / n.g);
      if (find === "L") return n.g * (n.T / (2 * Math.PI)) ** 2;
      if (n.T === 0) return "impossible";
      return n.L / (n.T / (2 * Math.PI)) ** 2;
    },
  },
  {
    id: "spring-period",
    finds: ["T", "m", "k"],
    variables: [
      { key: "T", label: "Time period", dimension: "time" },
      { key: "m", label: "Mass", dimension: "mass" },
      { key: "k", label: "Spring constant", dimension: "spring" },
    ],
    compute: (find, n) => {
      if (n.m < 0 || n.k < 0) return "impossible";
      if (find === "T") return n.k === 0 ? "impossible" : 2 * Math.PI * Math.sqrt(n.m / n.k);
      if (find === "m") return n.k * (n.T / (2 * Math.PI)) ** 2;
      if (n.T === 0) return "impossible";
      return n.m / (n.T / (2 * Math.PI)) ** 2;
    },
  },
  {
    id: "coulomb",
    finds: ["F", "r"],
    defaults: { k: { si: K_COULOMB, assumption: "I used k = 9 × 10^9 N m²/C² for air or vacuum." } },
    variables: [
      { key: "F", label: "Force magnitude", dimension: "force" },
      { key: "q1", label: "First charge", dimension: "charge" },
      { key: "q2", label: "Second charge", dimension: "charge" },
      { key: "r", label: "Separation", dimension: "length" },
      { key: "k", label: "Coulomb constant", dimension: "dimensionless" },
    ],
    compute: (find, n) => {
      const productCharges = Math.abs(n.q1 * n.q2);
      if (find === "F") return n.r === 0 ? "impossible" : (n.k * productCharges) / (n.r * n.r);
      if (n.F === 0 || productCharges === 0 || n.k === 0) return "impossible";
      return Math.sqrt((n.k * productCharges) / n.F);
    },
  },
  {
    id: "mirror-formula",
    finds: ["v", "u", "f"],
    variables: [
      { key: "v", label: "Image distance", dimension: "length" },
      { key: "u", label: "Object distance", dimension: "length" },
      { key: "f", label: "Focal length", dimension: "length" },
    ],
    compute: (find, n) => optics(find, n, "mirror"),
  },
  {
    id: "lens-formula",
    finds: ["v", "u", "f"],
    variables: [
      { key: "v", label: "Image distance", dimension: "length" },
      { key: "u", label: "Object distance", dimension: "length" },
      { key: "f", label: "Focal length", dimension: "length" },
    ],
    compute: (find, n) => optics(find, n, "lens"),
  },
  {
    id: "lens-power",
    finds: ["P", "f"],
    variables: [
      { key: "P", label: "Power", dimension: "dioptre" },
      { key: "f", label: "Focal length", dimension: "length" },
    ],
    compute: (find, n) => {
      if (find === "P") return n.f === 0 ? "impossible" : 1 / n.f;
      return n.P === 0 ? "impossible" : 1 / n.P;
    },
  },
  {
    id: "transformer",
    finds: ["Vs", "Vp", "Ns", "Np"],
    variables: [
      { key: "Vs", label: "Secondary voltage", dimension: "voltage" },
      { key: "Vp", label: "Primary voltage", dimension: "voltage" },
      { key: "Ns", label: "Secondary turns", dimension: "count" },
      { key: "Np", label: "Primary turns", dimension: "count" },
    ],
    compute: (find, n) => {
      if (find === "Vs") return n.Np === 0 ? "impossible" : (n.Vp * n.Ns) / n.Np;
      if (find === "Vp") return n.Ns === 0 ? "impossible" : (n.Vs * n.Np) / n.Ns;
      if (find === "Ns") return n.Vp === 0 ? "impossible" : (n.Vs * n.Np) / n.Vp;
      return n.Vs === 0 ? "impossible" : (n.Vp * n.Ns) / n.Vs;
    },
  },
  {
    id: "half-life",
    finds: ["N", "N0", "t", "T"],
    variables: [
      { key: "N", label: "Remaining amount", dimension: "count" },
      { key: "N0", label: "Initial amount", dimension: "count" },
      { key: "t", label: "Time", dimension: "time" },
      { key: "T", label: "Half-life", dimension: "time" },
    ],
    compute: (find, n) => {
      if (n.T <= 0 || n.N0 < 0 || n.t < 0) return "impossible";
      if (find === "N") return n.N0 * 0.5 ** (n.t / n.T);
      if (find === "N0") return n.N / 0.5 ** (n.t / n.T);
      const ratioAmount = n.N0 === 0 ? NaN : n.N / n.N0;
      if (!Number.isFinite(ratioAmount) || ratioAmount <= 0) return "impossible";
      const halves = Math.log(ratioAmount) / Math.log(0.5);
      if (find === "t") return halves * n.T;
      return halves === 0 ? "impossible" : n.t / halves;
    },
  },
  {
    id: "refractive-index",
    finds: ["n", "v", "c", "r"],
    defaults: { c: { si: LIGHT, assumption: "I used c = 3.00 × 10^8 m/s for the speed of light in vacuum." } },
    variables: [
      { key: "n", label: "Refractive index", dimension: "dimensionless" },
      { key: "c", label: "Speed of light in vacuum", dimension: "speed" },
      { key: "v", label: "Speed in the medium", dimension: "speed" },
      { key: "i", label: "Angle of incidence", dimension: "angle" },
      { key: "r", label: "Angle of refraction", dimension: "angle" },
    ],
    compute: (find, n) => {
      const hasSpeed = Number.isFinite(n.c) && Number.isFinite(n.v);
      const hasAngles = Number.isFinite(n.i) && Number.isFinite(n.r);
      if (hasSpeed && hasAngles && Number.isFinite(n.n) === false && find === "n") {
        if (n.v === 0 || Math.sin((n.r * Math.PI) / 180) === 0) return "impossible";
        const fromSpeed = n.c / n.v;
        const fromAngles = Math.sin((n.i * Math.PI) / 180) / Math.sin((n.r * Math.PI) / 180);
        if (!nearlyEqual(fromSpeed, fromAngles, 1e-2)) return "impossible";
        return fromSpeed;
      }
      if (find === "n" && hasAngles && !Number.isFinite(n.v)) {
        const sinR = Math.sin((n.r * Math.PI) / 180);
        if (sinR === 0) return "impossible";
        return Math.sin((n.i * Math.PI) / 180) / sinR;
      }
      if (find === "n" && Number.isFinite(n.v)) return n.v === 0 ? "impossible" : n.c / n.v;
      if (find === "v") return n.n === 0 ? "impossible" : n.c / n.n;
      if (find === "c") return n.n * n.v;
      const sinI = Math.sin((n.i * Math.PI) / 180);
      if (n.n === 0 || Math.abs(sinI / n.n) > 1) return "impossible";
      return (Math.asin(sinI / n.n) * 180) / Math.PI;
    },
  },
  {
    id: "young-fringe",
    finds: ["beta", "lambda", "D", "d"],
    variables: [
      { key: "beta", label: "Fringe width", dimension: "length" },
      { key: "lambda", label: "Wavelength", dimension: "wavelength" },
      { key: "D", label: "Distance to the screen", dimension: "length" },
      { key: "d", label: "Slit separation", dimension: "length" },
    ],
    compute: (find, n) => {
      if (find === "beta") return n.d === 0 ? "impossible" : (n.lambda * n.D) / n.d;
      if (find === "lambda") return n.D === 0 ? "impossible" : (n.beta * n.d) / n.D;
      if (find === "D") return n.lambda === 0 ? "impossible" : (n.beta * n.d) / n.lambda;
      return n.beta === 0 ? "impossible" : (n.lambda * n.D) / n.beta;
    },
  },
  {
    id: "de-broglie",
    finds: ["lambda", "p"],
    defaults: { h: { si: PLANCK, assumption: "I used h = 6.626 × 10^−34 J s." } },
    variables: [
      { key: "lambda", label: "Wavelength", dimension: "wavelength" },
      { key: "p", label: "Momentum", dimension: "momentum" },
      { key: "h", label: "Planck constant", dimension: "dimensionless" },
    ],
    compute: (find, n) => {
      if (find === "lambda") return n.p === 0 ? "impossible" : n.h / n.p;
      return n.lambda === 0 ? "impossible" : n.h / n.lambda;
    },
  },
  {
    id: "einstein-photo",
    finds: ["K", "f", "phi"],
    defaults: { h: { si: PLANCK, assumption: "I used h = 6.626 × 10^−34 J s." } },
    variables: [
      { key: "K", label: "Maximum kinetic energy", dimension: "energy" },
      { key: "f", label: "Frequency", dimension: "frequency" },
      { key: "phi", label: "Work function", dimension: "energy" },
      { key: "h", label: "Planck constant", dimension: "dimensionless" },
    ],
    compute: (find, n) => {
      if (find === "K") {
        const energy = n.h * n.f - n.phi;
        return energy < -1e-12 ? "impossible" : energy;
      }
      if (find === "phi") return n.h * n.f - n.K;
      if (n.h === 0) return "impossible";
      return (n.K + n.phi) / n.h;
    },
  },
];

const byId = new Map(specs.map((spec) => [spec.id, spec]));

function optics(find: string, n: Record<string, number>, kind: "mirror" | "lens"): number | "impossible" {
  const inv = (value: number) => (value === 0 || !Number.isFinite(value) ? NaN : 1 / value);
  const finish = (inverse: number) =>
    !Number.isFinite(inverse) || inverse === 0 ? "impossible" : 1 / inverse;
  if (kind === "mirror") {
    if (find === "v") return finish(inv(n.f) - inv(n.u));
    if (find === "u") return finish(inv(n.f) - inv(n.v));
    return finish(inv(n.v) + inv(n.u));
  }
  if (find === "v") return finish(inv(n.f) + inv(n.u));
  if (find === "u") return finish(inv(n.v) - inv(n.f));
  return finish(inv(n.v) - inv(n.u));
}

function fail(status: SolveStatus, message: string, formulaId?: string, steps: SolveStep[] = []): SolveResult {
  return { status, message, formulaId, steps, assumptions: [] };
}

function humanList(labels: string[]): string {
  if (labels.length === 1) return labels[0];
  return `${labels.slice(0, -1).join(", ")} and ${labels[labels.length - 1]}`;
}

function friendlyDisplay(spec: FormulaSpec, find: string, siValue: number, known: Record<string, KnownValue>): string {
  const variable = spec.variables.find((item) => item.key === find);
  const dimension = variable?.dimension ?? "dimensionless";
  const unitOf = (key: string) => known[key]?.unit.toLowerCase();
  if (dimension === "speed" && /km/.test(unitOf("s") ?? "") && /h|hour/.test(unitOf("t") ?? "")) {
    return `${formatNumber(siValue * 3.6)} km/h (${formatNumber(siValue)} m/s)`;
  }
  if ((dimension === "length" || dimension === "wavelength") && unitOf("u") === "cm" && unitOf("f") === "cm") {
    return `${formatNumber(siValue * 100)} cm`;
  }
  if ((dimension === "length" || dimension === "wavelength") && unitOf("s") === "cm") {
    return `${formatNumber(siValue * 100)} cm`;
  }
  const unit = siUnit(dimension);
  return unit ? `${formatNumber(siValue)} ${unit}` : formatNumber(siValue);
}

export function listSolvers(): FormulaSpec[] {
  return specs;
}

export function getSolver(formulaId: string): FormulaSpec | undefined {
  return byId.get(formulaId);
}

export function solve(request: SolveRequest): SolveResult {
  const spec = byId.get(request.formulaId);
  if (!spec) {
    return fail(
      "cannot_verify",
      "That formula is not in the checker, so I will not guess a number.",
      request.formulaId,
    );
  }
  const variableByKey = new Map(spec.variables.map((variable) => [variable.key, variable]));
  if (!variableByKey.has(request.find) || !spec.finds.includes(request.find)) {
    return fail(
      "cannot_verify",
      "I cannot check that unknown for this formula.",
      spec.id,
    );
  }

  const si: Record<string, number> = {};
  const steps: SolveStep[] = [];
  const assumptions: string[] = [];
  const given: string[] = [];

  for (const [key, measurement] of Object.entries(request.known)) {
    const variable = variableByKey.get(key);
    if (!variable) {
      return fail("cannot_verify", `“${key}” is not a value this formula accepts.`, spec.id);
    }
    if (!Number.isFinite(measurement.value)) {
      return fail("cannot_verify", `${variable.label} is not a usable number.`, spec.id);
    }
    const converted = toSI(measurement.value, measurement.unit, variable.dimension);
    if ("error" in converted) {
      return fail("cannot_verify", `${variable.label}: ${converted.error}`, spec.id);
    }
    si[key] = converted.si;
    given.push(`${variable.label} = ${formatNumber(measurement.value)} ${measurement.unit}`);
    if (!nearlyEqual(measurement.value, converted.si) || converted.siUnit !== measurement.unit) {
      steps.push({
        text: `Convert ${variable.label}: ${formatNumber(measurement.value)} ${measurement.unit} = ${formatNumber(converted.si)} ${converted.siUnit}.`,
      });
    }
  }

  if ((spec.id === "mirror-formula" || spec.id === "lens-formula") && (si.u ?? -1) > 0) {
    return fail(
      "cannot_verify",
      "Object distance u is positive. These formulas use the school sign convention, where the object distance is negative. I will not guess the sign.",
      spec.id,
      steps,
    );
  }

  for (const [key, fallback] of Object.entries(spec.defaults ?? {})) {
    if (key === request.find || si[key] !== undefined) continue;
    si[key] = fallback.si;
    assumptions.push(fallback.assumption);
  }

  const provided = new Set(Object.keys(si));
  const needed = spec.variables
    .map((variable) => variable.key)
    .filter((key) => key !== request.find && !provided.has(key) && spec.defaults?.[key] === undefined);

  const seriesCount = ["R1", "R2", "R3", "R4"].filter((key) => si[key] !== undefined).length;
  if ((spec.id === "series-resistance" || spec.id === "parallel-resistance") && seriesCount < 2) {
    return fail(
      "needs_info",
      "I need at least two resistances. I will not guess the missing one.",
      spec.id,
      given.length ? [{ text: `Given: ${given.join("; ")}.` }] : [],
    );
  }

  const blocking = needed.filter((key) => {
    if ((spec.id === "series-resistance" || spec.id === "parallel-resistance") && /R[1-4]/.test(key)) return false;
    if (spec.id === "refractive-index" && (key === "i" || key === "r" || key === "v" || key === "c")) return false;
    if (spec.id === "electric-power") return false;
    return true;
  });

  if (spec.id === "electric-power") {
    const keys = ["P", "V", "I", "R"].filter((key) => key !== request.find && si[key] !== undefined);
    if (keys.length < 2) {
      return fail(
        "needs_info",
        "Electric power needs two of voltage, current, and resistance. I will not guess the missing one.",
        spec.id,
      );
    }
  }

  if (spec.id === "refractive-index" && request.find === "n" && si.v === undefined && (si.i === undefined || si.r === undefined)) {
    return fail("needs_info", "I need either both speeds or both angles. I will not guess a refractive index.", spec.id);
  }

  if (blocking.length > 0) {
    const labels = blocking.map((key) => variableByKey.get(key)?.label ?? key);
    return {
      status: "needs_info",
      formulaId: spec.id,
      message: `I need the ${humanList(labels)} before I can check this. I will not guess a value.`,
      steps: given.length ? [{ text: `Given: ${given.join("; ")}.` }] : [],
      assumptions,
    };
  }

  const computed = spec.compute(request.find, si);
  if (computed === "impossible") {
    return {
      status: "cannot_verify",
      formulaId: spec.id,
      message: "These measurements do not give a real result for this formula. Check the signs and the units. I will not replace them with a made-up answer.",
      steps: [{ text: `Given: ${given.join("; ")}.` }, ...steps],
      assumptions,
    };
  }
  if (computed === "ambiguous") {
    return {
      status: "cannot_verify",
      formulaId: spec.id,
      message: "More than one time fits these values. Tell me which part of the motion you mean.",
      steps,
      assumptions,
    };
  }

  const display = friendlyDisplay(spec, request.find, computed, request.known);
  const formula = getFormula(spec.id);
  const findLabel = variableByKey.get(request.find)?.label ?? request.find;
  const answerSteps: SolveStep[] = [];
  if (given.length) answerSteps.push({ text: `Given: ${given.join("; ")}.` });
  answerSteps.push(...steps);
  if (formula) {
    answerSteps.push({ text: `Formula: ${formula.plain}.`, latex: formula.latex });
  }
  answerSteps.push({ text: `${findLabel} = ${display}.` });

  return {
    status: "verified",
    formulaId: spec.id,
    value: computed,
    unit: siUnit(variableByKey.get(request.find)?.dimension ?? "dimensionless"),
    display,
    steps: answerSteps,
    assumptions,
    message: `Checked by direct calculation: ${display}.`,
  };
}
