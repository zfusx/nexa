import assert from "node:assert/strict";
import test from "node:test";

import { buildExperienceResult } from "../src/lib/experience.ts";
import { productEntry } from "../src/lib/site.ts";

test("关系与看清局面的组合生成完整结果", () => {
  const result = buildExperienceResult({
    topic: "relationship",
    need: "clarity",
    feeling: "我怕自己看错了",
  });

  assert.equal(result.title, "先分清事实与害怕失去的想象");
  assert.match(result.observation, /真实存在/);
  assert.match(result.tension, /证据的边界/);
  assert.match(result.action, /已经发生的事实/);
  assert.match(result.question, /我怕自己看错了/);
});

test("全部 27 个可达组合都返回非空、可执行的文本", () => {
  const topics = ["relationship", "career", "uncertainty"];
  const needs = ["clarity", "timing", "action"];
  const feelings = ["我怕自己看错了", "我不知道还要等多久", "我担心做了会后悔"];

  for (const topic of topics) {
    for (const need of needs) {
      for (const feeling of feelings) {
        const result = buildExperienceResult({
          topic,
          need,
          feeling,
        });
        for (const field of [
          "title",
          "observation",
          "tension",
          "action",
          "question",
        ]) {
          assert.ok(
            result[field].trim().length > 8,
            `${topic}/${need} 的 ${field} 过短`,
          );
        }
        assert.ok(result.question.includes(feeling));
      }
    }
  }
});

test("正式产品入口未确认时保留站内引导与明确提示", () => {
  assert.equal(productEntry.href, "/how-it-works");
  assert.match(productEntry.note, /不提供注册或付款/);
});

test("生成器保留用户选择的原句，不添加宿命断言", () => {
  const feeling = "我担心做了会后悔";
  const result = buildExperienceResult({
    topic: "career",
    need: "action",
    feeling,
  });
  const fullText = Object.values(result).join(" ");

  assert.match(result.question, new RegExp(feeling));
  assert.doesNotMatch(fullText, /注定|一定会|逃不过|命中注定/);
});
