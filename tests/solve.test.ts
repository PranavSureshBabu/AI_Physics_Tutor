import assert from "node:assert/strict";
import { applyChange, followUp, solveWordProblem } from "../lib/word-problem";
import { solve } from "../lib/solver";

function close(actual: number | undefined, expected: number) {
  assert.equal(typeof actual, "number");
  assert.ok(Math.abs((actual ?? 0) - expected) < 1e-6, `${actual} !== ${expected}`);
}

const speed = solveWordProblem("A car travels 100 m in 20 s. Find its speed.");
assert.equal(speed.status, "verified");
close(speed.value, 5);
assert.match(speed.display ?? "", /5 m\/s/);

const bus = solveWordProblem("A bus covers 120 km in 2 hours. What is its speed?");
assert.equal(bus.status, "verified");
close(bus.value, 120000 / 7200);
assert.match(bus.display ?? "", /60 km\/h/);

const motion = solveWordProblem(
  "A body starts from rest and accelerates at 2 m/s² for 5 s. Find the final velocity.",
);
assert.equal(motion.status, "verified");
close(motion.value, 10);

const force = solveWordProblem("A 3 kg box accelerates at 4 m/s². Find the force.");
assert.equal(force.status, "verified");
close(force.value, 12);

const energy = solveWordProblem("Find the kinetic energy of a 2 kg ball moving at 3 m/s.");
assert.equal(energy.status, "verified");
close(energy.value, 9);

const potential = solveWordProblem(
  "A 2 kg book is raised by 5 m. Find its potential energy. Take g = 10 m/s².",
);
assert.equal(potential.status, "verified");
close(potential.value, 100);
assert.equal(potential.assumptions.length, 0);

const voltage = solveWordProblem(
  "A current of 2 A flows through a 5 ohm resistor. Find the potential difference.",
);
assert.equal(voltage.status, "verified");
close(voltage.value, 10);

const missing = solveWordProblem("A car travels 100 m. Find its speed.");
assert.equal(missing.status, "needs_info");
assert.equal(missing.value, undefined);

const impossible = solve({
  formulaId: "v2-uas",
  known: {
    u: { value: 0, unit: "m/s" },
    a: { value: -2, unit: "m/s²" },
    s: { value: 10, unit: "m" },
  },
  find: "v",
});
assert.equal(impossible.status, "cannot_verify");
assert.equal(impossible.value, undefined);

const mirror = solve({
  formulaId: "mirror-formula",
  known: {
    u: { value: -30, unit: "cm" },
    f: { value: -15, unit: "cm" },
  },
  find: "v",
});
assert.equal(mirror.status, "verified");
close(mirror.value, -0.3);
assert.match(mirror.display ?? "", /-30 cm/);

const badSign = solve({
  formulaId: "mirror-formula",
  known: {
    u: { value: 30, unit: "cm" },
    f: { value: -15, unit: "cm" },
  },
  find: "v",
});
assert.equal(badSign.status, "cannot_verify");

const series = solveWordProblem("Two resistors of 2 ohm and 3 ohm are connected in series. Find the equivalent resistance.");
assert.equal(series.status, "verified");
close(series.value, 5);

const concept = solveWordProblem("What is velocity?");
assert.equal(concept.status, "not_calculation");

const journey = solveWordProblem("A car travels at 30 km/h for 2 hours and 60 km/h for 1 hour. Find the average speed.");
assert.equal(journey.status, "verified");
close(journey.value, (30 * 5 / 18 * 7200 + 60 * 5 / 18 * 3600) / (7200 + 3600));

const parsed = {
  formulaId: "speed",
  known: {
    s: { value: 100, unit: "m" },
    t: { value: 20, unit: "s" },
  },
  find: "v",
};
const changed = applyChange(parsed, "What if the time is 10 s instead?");
assert.ok(changed);
const revised = solve(changed!);
assert.equal(revised.status, "verified");
close(revised.value, 10);

const badUnit = solve({
  formulaId: "newton-second",
  known: {
    m: { value: 3, unit: "m" },
    a: { value: 4, unit: "m/s²" },
  },
  find: "F",
});
assert.equal(badUnit.status, "cannot_verify");

const circle = solveWordProblem("The radius of a circle is 3.12 m. Calculate the area of the circle");
assert.equal(circle.status, "verified");
close(circle.value, Math.PI * 3.12 * 3.12);
assert.match(circle.display ?? "", /30\.58 m²/);
assert.equal(circle.steps.some((step) => step.latex === "A = \\pi r^{2}"), true);

const racing = solveWordProblem(
  "A racing car starts from rest and accelerates uniformly at a rate of 4 m/s². What will be its velocity after 10 seconds? How much distance will it cover in this time?",
);
assert.equal(racing.status, "verified");
close(racing.value, 40);
assert.equal(racing.extras?.length, 1);
close(racing.extras?.[0].value, 200);
assert.ok(racing.steps.some((step) => step.latex?.includes("0 + 4")));

const distanceOnly = followUp(racing.request!, "How much distance will it cover in this time?");
assert.ok(distanceOnly);
assert.equal(distanceOnly?.find, "s");
const distance = solve(distanceOnly!);
assert.equal(distance.status, "verified");
close(distance.value, 200);

const fresh = followUp(racing.request!, "A bus covers 120 km in 2 hours. What is its speed?");
assert.equal(fresh, null);

console.log("solver tests passed");
