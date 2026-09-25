import type { KnownValue } from "@/content/types";
import { formatNumber } from "@/lib/number";
import { solve, type SolveRequest, type SolveResult } from "@/lib/solver";

const EMPTY: SolveResult = {
  status: "not_calculation",
  message: "",
  steps: [],
  assumptions: [],
};

function normalize(text: string): string {
  return text
    .replace(/m\/s\^2/gi, "m/s²")
    .replace(/m\/s2/gi, "m/s²")
    .replace(/Ω/g, "ohm")
    .replace(/μ/g, "u");
}

function notMatched(message: string): SolveResult {
  return { status: "cannot_verify", message, steps: [], assumptions: [] };
}

type Measurement = { value: number; unit: string };

function measurement(value: string, unit: string): Measurement {
  return { value: Number(value), unit };
}

function knownOf(item: Measurement): KnownValue {
  return { value: item.value, unit: item.unit };
}

function distanceOf(text: string): Measurement | undefined {
  const match = text.match(
    /(\d+(?:\.\d+)?)\s*(kilometres|kilometers|km|centimetres|centimeters|cm|millimetres|millimeters|mm|metres|meters|metre|meter|m)(?!\/)/i,
  );
  if (!match) return undefined;
  const unit = match[2].toLowerCase();
  const compact = unit.startsWith("k") ? "km" : unit.startsWith("c") ? "cm" : unit.startsWith("mm") ? "mm" : "m";
  return measurement(match[1], compact);
}

function timeOf(text: string): Measurement | undefined {
  const match = text.match(
    /(?:\bfor\b|\bin\b|\bafter\b|\btakes\b|\btime(?:\s+of|\s+is)?\b)\s+(\d+(?:\.\d+)?)\s*(hours|hour|hrs|hr|minutes|minute|mins|min|seconds|second|secs|sec|h|s)\b/i,
  );
  if (!match) return undefined;
  const unit = match[2].toLowerCase();
  const compact = unit.startsWith("h") ? "h" : unit.startsWith("min") ? "min" : "s";
  return measurement(match[1], compact);
}

function massOf(text: string): Measurement | undefined {
  const match = text.match(/(\d+(?:\.\d+)?)\s*(kg|g)(?!\/)/i);
  if (!match) return undefined;
  return measurement(match[1], match[2].toLowerCase());
}

function accelerationOf(text: string): Measurement | undefined {
  const withoutGravity = text.replace(/\bg\s*=\s*\d+(?:\.\d+)?\s*m\/s²/gi, "");
  const match = withoutGravity.match(/(\d+(?:\.\d+)?)\s*m\/s²/i);
  if (!match) return undefined;
  return measurement(match[1], "m/s²");
}

function speedOf(text: string): Measurement | undefined {
  const match = text.match(/(\d+(?:\.\d+)?)\s*(km\/h|km\/hr|cm\/s|m\/s)(?!²|\^?2)/i);
  if (!match) return undefined;
  return measurement(match[1], match[2].toLowerCase().replace("km/hr", "km/h"));
}

function heightOf(text: string): Measurement | undefined {
  const match = text.match(
    /(?:height|raised|lifted|climbs|climbed|hoisted)(?:\s+[a-z]+){0,3}\s+(\d+(?:\.\d+)?)\s*(km|cm|m)\b/i,
  );
  if (!match) return undefined;
  return measurement(match[1], match[2].toLowerCase());
}

function gravityOf(text: string): Measurement | undefined {
  const match = text.match(/\bg\s*=\s*(\d+(?:\.\d+)?)/i);
  if (!match) return undefined;
  return measurement(match[1], "m/s²");
}

function finish(request: SolveRequest, text: string): SolveResult {
  const result = solve(request);
  if (result.status !== "verified") return result;
  const direction = text.match(/\b(north|south|east|west|upwards|up|downwards|down)\b/i);
  if (request.find === "v" && /velocity/i.test(text)) {
    if (direction) {
      const way = direction[1].toLowerCase();
      result.message = `${result.display} ${way}. The direction is ${way}.`;
    } else {
      result.message = `${result.display}. Velocity also needs a direction, and this question did not give one.`;
    }
  }
  result.request = request;
  return result;
}

function averageJourney(text: string): SolveResult | null {
  if (!/average/i.test(text)) return null;
  const legs = [
    ...text.matchAll(
      /(\d+(?:\.\d+)?)\s*(km\/h|km\/hr|m\/s)\s+for\s+(\d+(?:\.\d+)?)\s*(hours|hour|hrs|hr|minutes|minute|mins|min|h|s)\b/gi,
    ),
  ];
  if (legs.length < 2) return null;
  let distance = 0;
  let time = 0;
  for (const leg of legs) {
    const speed = Number(leg[1]);
    const speedUnit = leg[2].toLowerCase();
    const duration = Number(leg[3]);
    const timeUnit = leg[4].toLowerCase();
    const metresPerSecond = speedUnit.startsWith("km") ? speed * (5 / 18) : speed;
    const seconds = timeUnit.startsWith("h") ? duration * 3600 : timeUnit.startsWith("min") ? duration * 60 : duration;
    distance += metresPerSecond * seconds;
    time += seconds;
  }
  const result = solve({
    formulaId: "average-speed",
    known: {
      s: { value: distance, unit: "m" },
      t: { value: time, unit: "s" },
    },
    find: "v",
  });
  if (result.status === "verified") {
    result.steps.unshift({
      text: "Average speed uses the whole journey: add the distances, add the times, then divide.",
    });
  }
  return result;
}

export function parseWordProblem(text: string): SolveRequest | null {
  const clean = normalize(text);
  const gravity = gravityOf(clean);
  const fromRest = /from rest|starts at rest|initially at rest/i.test(clean);

  if (/kinetic energy|\bke\b/i.test(clean)) {
    const mass = massOf(clean);
    const speed = speedOf(clean);
    if (!mass || !speed) return null;
    return { formulaId: "kinetic-energy", known: { m: knownOf(mass), v: knownOf(speed) }, find: "K" };
  }

  if (/potential energy|raised|lifted/i.test(clean)) {
    const mass = massOf(clean);
    const height = heightOf(clean) ?? distanceOf(clean);
    if (!mass || !height) return null;
    const known: Record<string, KnownValue> = { m: knownOf(mass), h: knownOf(height) };
    if (gravity) known.g = knownOf(gravity);
    return { formulaId: "potential-energy", known, find: "U" };
  }

  if (/echo/i.test(clean)) {
    const speed = speedOf(clean);
    const time = timeOf(clean);
    if (!speed || !time) return null;
    return { formulaId: "echo-distance", known: { v: knownOf(speed), t: knownOf(time) }, find: "d" };
  }

  const resistors = [...clean.matchAll(/(\d+(?:\.\d+)?)\s*(ohms|ohm)/gi)].map((match) =>
    measurement(match[1], "ohm"),
  );
  if (/parallel/i.test(clean) && resistors.length >= 2) {
    const known: Record<string, KnownValue> = {};
    resistors.slice(0, 4).forEach((resistor, index) => {
      known[`R${index + 1}`] = knownOf(resistor);
    });
    return { formulaId: "parallel-resistance", known, find: "R" };
  }
  if (/series/i.test(clean) && resistors.length >= 2) {
    const known: Record<string, KnownValue> = {};
    resistors.slice(0, 4).forEach((resistor, index) => {
      known[`R${index + 1}`] = knownOf(resistor);
    });
    return { formulaId: "series-resistance", known, find: "R" };
  }

  if (/potential difference|voltage|current|resistor|ohm/i.test(clean) && resistors.length === 1) {
    const current = clean.match(/(\d+(?:\.\d+)?)\s*(mA|A)\b/i);
    const voltage = clean.match(/(\d+(?:\.\d+)?)\s*V\b/);
    const known: Record<string, KnownValue> = { R: knownOf(resistors[0]) };
    if (current) known.I = { value: Number(current[1]), unit: current[2] };
    if (voltage) known.V = { value: Number(voltage[1]), unit: "V" };
    const find = /current/i.test(clean) && !current ? "I" : /resistance/i.test(clean) && false ? "R" : "V";
    if (/find the current|what is the current|calculate the current/i.test(clean)) {
      return { formulaId: "ohms-law", known, find: "I" };
    }
    if (known.I && /potential difference|voltage|\bp\.?d\.?\b/i.test(clean)) {
      return { formulaId: "ohms-law", known, find: "V" };
    }
    if (known.I && known.R && !known.V) return { formulaId: "ohms-law", known, find: "V" };
    if (known.V && known.R && !known.I) return { formulaId: "ohms-law", known, find: "I" };
    return { formulaId: "ohms-law", known, find };
  }

  const asksForce = /find the force|what is the force|calculate the force|net force/i.test(clean);
  const acceleration = accelerationOf(clean);
  const mass = massOf(clean);
  if (asksForce && mass && acceleration) {
    return {
      formulaId: "newton-second",
      known: { m: knownOf(mass), a: knownOf(acceleration) },
      find: "F",
    };
  }

  const asksMotion = /velocity|speed|how fast|acceleration|displacement|how far|distance/i.test(clean);
  if ((fromRest || acceleration) && asksMotion) {
    const time = timeOf(clean);
    const distance = distanceOf(clean);
    const known: Record<string, KnownValue> = {};
    if (fromRest) known.u = { value: 0, unit: "m/s" };
    if (acceleration) known.a = knownOf(acceleration);
    if (time) known.t = knownOf(time);
    if (distance && !/m\/s/i.test(clean.slice(Math.max(0, clean.indexOf(String(distance.value))) - 4))) known.s = knownOf(distance);
    const wantsSpeed = /velocity|speed|how fast/i.test(clean);
    const wantsDistance = /how far|how much distance|distance will|displacement|cover/i.test(clean);
    if (wantsSpeed && known.a && known.t && known.u) {
      return { formulaId: "v-uat", known, find: "v" };
    }
    if (wantsSpeed && known.a && known.s && known.u && !known.t) {
      return { formulaId: "v2-uas", known, find: "v" };
    }
    if (wantsDistance && known.u && known.a && known.t) {
    const distanceKnown = { ...known };
    delete distanceKnown.s;
    return { formulaId: "s-uat", known: distanceKnown, find: "s" };
    }
  }

  if (/speed|velocity|how fast/i.test(clean)) {
    const distance = distanceOf(clean);
    const time = timeOf(clean);
    if (!distance && !time) return null;
    const known: Record<string, KnownValue> = {};
    if (distance) known.s = knownOf(distance);
    if (time) known.t = knownOf(time);
    return {
      formulaId: /velocity/i.test(clean) ? "velocity" : "speed",
      known,
      find: "v",
    };
  }

  return null;
}

function companion(primary: SolveRequest, clean: string): SolveRequest | null {
  const wantsDistance = /how far|how much distance|distance will|displacement|\bcover\b/i.test(clean);
  const wantsSpeed = /velocity|speed|how fast/i.test(clean);
  const motion = primary.known.u && primary.known.a && primary.known.t
    ? { u: primary.known.u, a: primary.known.a, t: primary.known.t }
    : null;
  if (!motion) return null;
  if (primary.find !== "s" && wantsDistance) return { formulaId: "s-uat", known: motion, find: "s" };
  if (primary.find !== "v" && wantsSpeed) return { formulaId: "v-uat", known: motion, find: "v" };
  return null;
}

const FRESH = /\b(a|an)\s+[a-z]+(?:\s+[a-z]+){0,4}\s+(starts|travels|covers|moves|accelerates|is raised|weighs|has)\b/i;

export function followUp(previous: SolveRequest, message: string): SolveRequest | null {
  const clean = normalize(message);
  if (FRESH.test(clean) && /\d/.test(clean)) return null;
  const own = parseWordProblem(clean);
  if (own && /\d/.test(clean) && FRESH.test(clean)) return null;
  const wantsDistance = /how far|how much distance|distance|displacement|\bcover\b/i.test(clean);
  const wantsSpeed = /velocity|speed|how fast/i.test(clean);
  const wantsForce = /force/i.test(clean);
  const follow =
    wantsDistance ||
    wantsSpeed ||
    wantsForce ||
    /\b(what about|and the|also|now find|this time|that time|same)\b/i.test(clean);
  if (!follow) return null;
  const known = { ...previous.known };
  const acceleration = accelerationOf(clean);
  const time = timeOf(clean);
  if (acceleration) known.a = knownOf(acceleration);
  if (time) known.t = knownOf(time);
  if (fromRest(clean)) known.u = { value: 0, unit: "m/s" };
  if (wantsDistance && known.u && known.a && known.t) {
    return { formulaId: "s-uat", known: { u: known.u, a: known.a, t: known.t }, find: "s" };
  }
  if (wantsSpeed && known.u && known.a && known.t) {
    return { formulaId: "v-uat", known: { u: known.u, a: known.a, t: known.t }, find: "v" };
  }
  if (wantsForce && known.m && known.a) {
    return { formulaId: "newton-second", known: { m: known.m, a: known.a }, find: "F" };
  }
  return null;
}

function fromRest(text: string) {
  return /from rest|starts at rest|initially at rest/i.test(text);
}

function circleArea(text: string): SolveResult | null {
  if (!/\barea\b/i.test(text) || !/\bcircle\b/i.test(text)) return null;
  if (/\b(centripetal|angular|orbit|period)\b/i.test(text)) return null;
  const radius = text.match(/\bradius\b[^0-9]{0,48}(\d+(?:\.\d+)?)\s*(mm|cm|m|km)\b/i);
  const diameter = text.match(/\bdiameter\b[^0-9]{0,48}(\d+(?:\.\d+)?)\s*(mm|cm|m|km)\b/i);
  const found = radius ?? diameter;
  if (!found) return null;
  const given = Number(found[1]);
  const unit = found[2].toLowerCase();
  const length = radius ? given : given / 2;
  if (!Number.isFinite(length) || length <= 0) return null;
  const area = Math.PI * length * length;
  const squared = length * length;
  const display = `${formatNumber(area)} ${unit}²`;
  const unitTex = unit === "m" ? "m" : `\\mathrm{${unit}}`;
  return {
    status: "verified",
    value: area,
    unit: `${unit}²`,
    display,
    assumptions: [
      radius
        ? "The shape is a circle, and the given length is the radius."
        : "The shape is a circle. The radius is half the given diameter.",
    ],
    message: `Checked by direct calculation: ${display}.`,
    steps: [
      {
        text: radius
          ? `Given: radius r = ${formatNumber(given)} ${unit}.`
          : `Given: diameter = ${formatNumber(given)} ${unit}, so the radius is half of that, r = ${formatNumber(length)} ${unit}.`,
      },
      {
        text: "The area of a circle is found from its radius.",
        latex: "A = \\pi r^{2}",
      },
      {
        text: `Square the radius: r² = (${formatNumber(length)})² = ${formatNumber(squared)} ${unit}².`,
        latex: `r^{2} = (${formatNumber(length)})^{2} = ${formatNumber(squared)}\\,${unitTex}^{2}`,
      },
      {
        text: `Multiply by π: A = π × ${formatNumber(squared)} = ${display}.`,
        latex: `A = \\pi \\times ${formatNumber(squared)} = ${formatNumber(area)}\\,${unitTex}^{2}`,
      },
    ],
  };
}

export function solveWordProblem(text: string): SolveResult {
  const clean = normalize(text);
  if (!/\d/.test(clean) && !/from rest/i.test(clean)) return EMPTY;
  const circle = circleArea(clean);
  if (circle) return circle;
  const journey = averageJourney(clean);
  if (journey) return journey;
  const request = parseWordProblem(clean);
  if (!request) {
    return notMatched(
      "I can see numbers, but they do not match a formula I am allowed to calculate. Use the formula lab, or tell me the missing measurement. I will not guess.",
    );
  }
  const result = finish(request, clean);
  const extra = companion(request, clean);
  if (extra) {
    const second = finish(extra, clean);
    if (second.status === "verified") result.extras = [second];
  }
  return result;
}

const CHANGE: Record<string, string> = {
  time: "t",
  distance: "s",
  displacement: "s",
  speed: "v",
  velocity: "v",
  mass: "m",
  acceleration: "a",
  force: "F",
  height: "h",
  current: "I",
  resistance: "R",
  voltage: "V",
};

export function applyChange(previous: SolveRequest, message: string): SolveRequest | null {
  const match = normalize(message).match(
    /(time|distance|displacement|speed|velocity|mass|acceleration|force|height|current|resistance|voltage)\D{0,16}(\d+(?:\.\d+)?)(?:\s*(m\/s²|km\/h|km\/hr|m\/s|km|cm|mm|kg|g|seconds|second|minutes|minute|hours|hour|ohm|ohms|min|h|s|N|A|V|m))?/i,
  );
  if (!match) return null;
  const key = CHANGE[match[1].toLowerCase()];
  if (!previous.known[key]) return null;
  const unit = match[3] ?? previous.known[key].unit;
  return {
    ...previous,
    known: {
      ...previous.known,
      [key]: { value: Number(match[2]), unit },
    },
  };
}
