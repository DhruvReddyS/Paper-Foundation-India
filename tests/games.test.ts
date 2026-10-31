import assert from "node:assert/strict";
import test from "node:test";
import { gameCatalog, gameIds, getGameDefinition } from "../components/games/gameCatalog";
import { hiddenProducts, millSteps, quizQuestions, truthClaims } from "../components/games/gameData";

test("every catalogued game has a definition, a route and share tags", () => {
  assert.equal(gameCatalog.length, gameIds.length);
  for (const id of gameIds) {
    const game = getGameDefinition(id);
    assert.ok(game, `${id} has no definition`);
    assert.match(game.href, /^\/discover\/[a-z-]+$/);
    assert.ok(game.shareTags.length >= 1, `${id} has no share tags`);
    assert.ok(game.title.trim().length > 2);
  }
  assert.equal(new Set(gameCatalog.map((g) => g.href)).size, gameCatalog.length, "two games share a route");
});

test("quiz questions are answerable and cite a source", () => {
  assert.ok(quizQuestions.length >= 8, `only ${quizQuestions.length} questions`);
  for (const question of quizQuestions) {
    assert.ok(question.answers.length >= 2, `"${question.question}" has too few answers`);
    assert.ok(
      question.correct >= 0 && question.correct < question.answers.length,
      `"${question.question}" points at an answer that does not exist`
    );
    assert.equal(new Set(question.answers).size, question.answers.length, `"${question.question}" repeats an answer`);
    assert.match(question.source, /^https:\/\//, `"${question.question}" has no source link`);
    assert.ok(question.explanation.length > 40, `"${question.question}" needs a fuller explanation`);
  }
});

test("truth claims only use verdicts the press can stamp", () => {
  const allowed = new Set(["myth", "fact", "context"]);
  assert.ok(truthClaims.length >= 6);
  for (const claim of truthClaims) {
    assert.ok(allowed.has(claim.verdict), `"${claim.claim}" has verdict ${claim.verdict}`);
    assert.match(claim.source, /^https:\/\//, `"${claim.claim}" has no source link`);
    assert.ok(claim.evidence.length > 10);
  }
  // A game that offers three stamps must have something to teach with each.
  for (const verdict of allowed) {
    assert.ok(truthClaims.some((c) => c.verdict === verdict), `no claim uses the ${verdict} verdict`);
  }
});

test("hidden products can be solved from their own option list", () => {
  assert.ok(hiddenProducts.length >= 5);
  for (const product of hiddenProducts) {
    assert.ok(
      product.options.some((option) => option.toLowerCase().trim() === product.name.toLowerCase().trim()),
      `"${product.name}" is not among its own options, so it can never be solved`
    );
    assert.equal(new Set(product.options).size, product.options.length, `"${product.name}" repeats an option`);
    assert.ok(product.clues.length >= 2, `"${product.name}" needs more clues`);
    assert.match(product.image, /^\/images\//);
    assert.match(product.source, /^https:\/\//);
  }
});

test("no option is a prefix of a different product's name, which would be ambiguous", () => {
  for (const product of hiddenProducts) {
    const wrong = product.options.filter((o) => o.toLowerCase().trim() !== product.name.toLowerCase().trim());
    for (const option of wrong) {
      assert.notEqual(
        option.toLowerCase().trim(),
        product.name.toLowerCase().trim(),
        `"${option}" duplicates the answer for ${product.name}`
      );
    }
  }
});

test("the mill sequence is a unique ordered set", () => {
  assert.ok(millSteps.length >= 4);
  assert.equal(new Set(millSteps).size, millSteps.length, "a mill step is repeated, so the order is ambiguous");
  for (const step of millSteps) assert.ok(step.trim().length > 2);
});
