export type Dimension =
  | "length"
  | "time"
  | "mass"
  | "speed"
  | "accel"
  | "force"
  | "energy"
  | "power"
  | "pressure"
  | "current"
  | "voltage"
  | "resistance"
  | "frequency"
  | "area"
  | "volume"
  | "density"
  | "charge"
  | "angle"
  | "temp"
  | "tempchange"
  | "specificheat"
  | "spring"
  | "dioptre"
  | "dimensionless"
  | "count"
  | "momentum"
  | "wavelength";

type UnitSpec = {
  dim: Dimension;
  factor: number;
  si: string;
};

const UNITS: Record<string, UnitSpec> = {
  m: { dim: "length", factor: 1, si: "m" },
  km: { dim: "length", factor: 1000, si: "m" },
  cm: { dim: "length", factor: 0.01, si: "m" },
  mm: { dim: "length", factor: 0.001, si: "m" },
  nm: { dim: "length", factor: 1e-9, si: "m" },
  s: { dim: "time", factor: 1, si: "s" },
  sec: { dim: "time", factor: 1, si: "s" },
  second: { dim: "time", factor: 1, si: "s" },
  seconds: { dim: "time", factor: 1, si: "s" },
  min: { dim: "time", factor: 60, si: "s" },
  minute: { dim: "time", factor: 60, si: "s" },
  minutes: { dim: "time", factor: 60, si: "s" },
  h: { dim: "time", factor: 3600, si: "s" },
  day: { dim: "time", factor: 86400, si: "s" },
  days: { dim: "time", factor: 86400, si: "s" },
  hr: { dim: "time", factor: 3600, si: "s" },
  hour: { dim: "time", factor: 3600, si: "s" },
  hours: { dim: "time", factor: 3600, si: "s" },
  "m/s": { dim: "speed", factor: 1, si: "m/s" },
  "km/h": { dim: "speed", factor: 5 / 18, si: "m/s" },
  "km/hr": { dim: "speed", factor: 5 / 18, si: "m/s" },
  "cm/s": { dim: "speed", factor: 0.01, si: "m/s" },
  "m/s2": { dim: "accel", factor: 1, si: "m/s²" },
  "m/s²": { dim: "accel", factor: 1, si: "m/s²" },
  "m/s^2": { dim: "accel", factor: 1, si: "m/s²" },
  kg: { dim: "mass", factor: 1, si: "kg" },
  g: { dim: "mass", factor: 0.001, si: "kg" },
  n: { dim: "force", factor: 1, si: "N" },
  j: { dim: "energy", factor: 1, si: "J" },
  kj: { dim: "energy", factor: 1000, si: "J" },
  w: { dim: "power", factor: 1, si: "W" },
  kw: { dim: "power", factor: 1000, si: "W" },
  pa: { dim: "pressure", factor: 1, si: "Pa" },
  v: { dim: "voltage", factor: 1, si: "V" },
  a: { dim: "current", factor: 1, si: "A" },
  ma: { dim: "current", factor: 0.001, si: "A" },
  ohm: { dim: "resistance", factor: 1, si: "Ω" },
  ohms: { dim: "resistance", factor: 1, si: "Ω" },
  "ω": { dim: "resistance", factor: 1, si: "Ω" },
  hz: { dim: "frequency", factor: 1, si: "Hz" },
  m2: { dim: "area", factor: 1, si: "m²" },
  "m²": { dim: "area", factor: 1, si: "m²" },
  cm2: { dim: "area", factor: 0.0001, si: "m²" },
  "cm²": { dim: "area", factor: 0.0001, si: "m²" },
  m3: { dim: "volume", factor: 1, si: "m³" },
  "m³": { dim: "volume", factor: 1, si: "m³" },
  "kg/m3": { dim: "density", factor: 1, si: "kg/m³" },
  "kg/m³": { dim: "density", factor: 1, si: "kg/m³" },
  c: { dim: "charge", factor: 1, si: "C" },
  uc: { dim: "charge", factor: 1e-6, si: "C" },
  "μc": { dim: "charge", factor: 1e-6, si: "C" },
  degree: { dim: "angle", factor: 1, si: "degree" },
  deg: { dim: "angle", factor: 1, si: "degree" },
  "°": { dim: "angle", factor: 1, si: "degree" },
  k: { dim: "temp", factor: 1, si: "K" },
  "°c": { dim: "tempchange", factor: 1, si: "°C" },
  celsius: { dim: "tempchange", factor: 1, si: "°C" },
  "j/kg°c": { dim: "specificheat", factor: 1, si: "J/kg°C" },
  "j/kgc": { dim: "specificheat", factor: 1, si: "J/kg°C" },
  "n/m": { dim: "spring", factor: 1, si: "N/m" },
  d: { dim: "dioptre", factor: 1, si: "D" },
  dioptre: { dim: "dioptre", factor: 1, si: "D" },
  dioptres: { dim: "dioptre", factor: 1, si: "D" },
  "kg m/s": { dim: "momentum", factor: 1, si: "kg m/s" },
  "kgm/s": { dim: "momentum", factor: 1, si: "kg m/s" },
  "": { dim: "dimensionless", factor: 1, si: "" },
  "1": { dim: "dimensionless", factor: 1, si: "" },
  none: { dim: "dimensionless", factor: 1, si: "" },
};

const ALIASES: Record<string, string> = {
  metre: "m",
  metres: "m",
  meter: "m",
  meters: "m",
  kilometre: "km",
  kilometres: "km",
  kilometer: "km",
  kilometers: "km",
  second: "s",
  seconds: "s",
  sec: "s",
  minute: "min",
  minutes: "min",
  hour: "h",
  day: "day",
  days: "day",
  hours: "h",
  hr: "h",
  hrs: "h",
  newton: "n",
  newtons: "n",
  joule: "j",
  joules: "j",
  watt: "w",
  watts: "w",
  volt: "v",
  volts: "v",
  amp: "a",
  ampere: "a",
  amperes: "a",
  amps: "a",
  ohm: "ohm",
  ohms: "ohm",
  "ω": "ohm",
  hertz: "hz",
  pascal: "pa",
  pascals: "pa",
  coulomb: "c",
  coulombs: "c",
  kelvin: "k",
  "m/s²": "m/s²",
  "m/s2": "m/s²",
  "m/s^2": "m/s²",
};

export function canonicalUnit(unit: string): string {
  const trimmed = unit.trim();
  const key = trimmed.toLowerCase();
  return ALIASES[key] ?? key;
}

export function lookupUnit(unit: string): UnitSpec | undefined {
  const key = canonicalUnit(unit);
  return UNITS[key];
}

export function toSI(
  value: number,
  unit: string,
  expected: Dimension,
): { si: number; siUnit: string } | { error: string } {
  const spec = lookupUnit(unit);
  if (!spec) {
    return { error: `I do not recognise the unit “${unit}”.` };
  }
  const compatible =
    spec.dim === expected ||
    (expected === "wavelength" && spec.dim === "length") ||
    (expected === "temp" && (spec.dim === "temp" || spec.dim === "tempchange")) ||
    (expected === "tempchange" && (spec.dim === "temp" || spec.dim === "tempchange")) ||
    (expected === "dimensionless" && spec.dim === "dimensionless") ||
    (expected === "count" && spec.dim === "dimensionless");
  if (!compatible) {
    return {
      error: `The unit “${unit}” does not match a ${expected} measurement.`,
    };
  }
  if (expected === "temp" && spec.dim === "tempchange") {
    return { si: value + 273.15, siUnit: "K" };
  }
  return { si: value * spec.factor, siUnit: spec.si };
}

export function siUnit(dimension: Dimension): string {
  switch (dimension) {
    case "length":
    case "wavelength":
      return "m";
    case "time":
      return "s";
    case "mass":
      return "kg";
    case "speed":
      return "m/s";
    case "accel":
      return "m/s²";
    case "force":
      return "N";
    case "energy":
      return "J";
    case "power":
      return "W";
    case "pressure":
      return "Pa";
    case "current":
      return "A";
    case "voltage":
      return "V";
    case "resistance":
      return "Ω";
    case "frequency":
      return "Hz";
    case "area":
      return "m²";
    case "volume":
      return "m³";
    case "density":
      return "kg/m³";
    case "charge":
      return "C";
    case "angle":
      return "degree";
    case "temp":
      return "K";
    case "tempchange":
      return "°C";
    case "specificheat":
      return "J/kg°C";
    case "spring":
      return "N/m";
    case "dioptre":
      return "D";
    case "momentum":
      return "kg m/s";
    case "count":
      return "";
    default:
      return "";
  }
}

export const UNIT_CHOICES: Record<Dimension, string[]> = {
  length: ["m", "cm", "mm", "km"],
  wavelength: ["m", "cm", "mm", "km"],
  time: ["s", "min", "h"],
  mass: ["kg", "g"],
  speed: ["m/s", "km/h", "cm/s"],
  accel: ["m/s²"],
  force: ["N"],
  energy: ["J", "kJ"],
  power: ["W", "kW"],
  pressure: ["Pa"],
  current: ["A", "mA"],
  voltage: ["V"],
  resistance: ["ohm"],
  frequency: ["Hz"],
  area: ["m²", "cm²"],
  volume: ["m³"],
  density: ["kg/m³"],
  charge: ["C", "μC"],
  angle: ["degree"],
  temp: ["K", "°C"],
  tempchange: ["°C", "K"],
  specificheat: ["J/kg°C"],
  spring: ["N/m"],
  dioptre: ["D"],
  dimensionless: ["1"],
  count: ["1"],
  momentum: ["kg m/s"],
};
