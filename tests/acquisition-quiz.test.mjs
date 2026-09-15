import assert from "node:assert/strict";
import test from "node:test";

import {
  buildQuizResult,
  quizDimensionLabels,
  quizQuestions,
} from "../src/lib/acquisitionQuiz.ts";

test("独立引流问卷包含 30 道原创题且五个维度均衡", () => {
  assert.equal(quizQuestions.length, 30);
  assert.equal(new Set(quizQuestions.map((question) => question.id)).size, 30);
  assert.ok(quizQuestions.every((question) => question.prompt.length >= 18));

  const counts = Object.fromEntries(
    Object.keys(quizDimensionLabels).map((dimension) => [
      dimension,
      quizQuestions.filter((question) => question.dimension === dimension)
        .length,
    ]),
  );
  assert.deepEqual(Object.values(counts), [6, 6, 6, 6, 6]);
});

test("完成问卷后返回完整且克制的免费结果", () => {
  const result = buildQuizResult(quizQuestions.map((_, index) => index % 3));
  const text = Object.values(result).join(" ");

  assert.ok(result.title.length > 12);
  assert.ok(result.action.length > 20);
  assert.deepEqual(
    Object.keys(result.scores),
    Object.keys(quizDimensionLabels),
  );
  assert.ok(
    Object.values(result.scores).every((score) => score >= 0 && score <= 100),
  );
  assert.doesNotMatch(text, /注定|人格诊断|一定会|命中注定|准确率/);
});

test("五个维度接近时不硬判强项和短板", () => {
  const result = buildQuizResult(Array(30).fill(1));

  assert.match(result.title, /五种力量之间寻找平衡/);
  assert.equal(result.strengthLabel, "多维平衡");
  assert.equal(result.focusLabel, "下一步不是补短板");
});

test("缺题或非法答案不能生成结果", () => {
  assert.throws(() => buildQuizResult(Array(29).fill(1)), /全部 30 道题/);
  assert.throws(
    () => buildQuizResult([...Array(29).fill(1), 3]),
    /第 30 题答案无效/,
  );
});
