import assert from "node:assert/strict";
import { chapters, chaptersForGrade } from "../content/curriculum";
import { formulas } from "../content/formulas";
import { retrieve } from "../lib/rag";
import { solve } from "../lib/solver";

const ids = new Set(formulas.map((formula) => formula.id));
const grades = new Set<number>();

for (const chapter of chapters) {
  grades.add(chapter.grade);
  assert.ok(chapter.topics.length > 0, chapter.id);
  for (const topic of chapter.topics) {
    for (const formulaId of topic.formulaIds) {
      assert.ok(ids.has(formulaId), `${topic.id} uses unknown formula ${formulaId}`);
    }
    for (const item of topic.quiz) {
      assert.ok(item.answerIndex >= 0 && item.answerIndex < item.choices.length, item.id);
    }
    if (topic.worked) {
      const result = solve(topic.worked);
      assert.equal(result.status, "verified", `${topic.id}: ${result.message}`);
    }
    for (const item of topic.practice) {
      if (!item.worked) continue;
      const result = solve(item.worked);
      assert.equal(result.status, "verified", `${item.id}: ${result.message}`);
    }
  }
}

for (let grade = 1; grade <= 12; grade += 1) {
  assert.ok(grades.has(grade), `missing class ${grade}`);
  assert.ok(chaptersForGrade(grade).length >= 3, `class ${grade} needs chapters`);
}

const velocity = retrieve("What is velocity?", 9);
assert.equal(velocity?.topic.id, "c9-velocity");
assert.equal(velocity?.confidence, "high");

const young = retrieve("What is velocity?", 1);
assert.equal(young?.confidence, "high");
assert.notEqual(young?.topic.id, "c9-velocity");

const outside = retrieve("What is photosynthesis?", 5);
assert.ok(!outside || outside.confidence === "low");

const ohm = retrieve("Explain Ohm's law", 10);
assert.equal(ohm?.topic.id, "c10-ohm");

const projectile = retrieve("What is projectile motion?", 11);
assert.equal(projectile?.topic.id, "c11-projectile");
assert.equal(projectile?.confidence, "high");

assert.ok(chaptersForGrade(9).some((chapter) => chapter.id === "c9-float"));
assert.ok(chaptersForGrade(12).some((chapter) => chapter.id === "c12-chips"));
assert.ok(chaptersForGrade(1).some((chapter) => chapter.id === "c1-sky"));

console.log("curriculum and retrieval tests passed");
