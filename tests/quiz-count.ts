import assert from "node:assert/strict";
import { QUIZ_LENGTH, buildQuiz, questionsForGrade } from "../lib/quiz-set";

for (let grade = 1; grade <= 12; grade += 1) {
  const pool = questionsForGrade(grade);
  const quiz = buildQuiz(grade);
  console.log(`class ${grade}: pool ${pool.length}, quiz ${quiz.length}`);
  assert.ok(pool.length >= QUIZ_LENGTH, `class ${grade} has ${pool.length} questions`);
  assert.equal(quiz.length, QUIZ_LENGTH);
  for (const item of quiz) {
    assert.equal(item.choices.length, 4, item.id);
    assert.ok(item.answerIndex >= 0 && item.answerIndex < item.choices.length, item.id);
    assert.ok(item.explanation.length > 0, item.id);
  }
}

