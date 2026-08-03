import test from "node:test";
import assert from "node:assert/strict";
import { SITE_DATA } from "../js/data.js";
import { lessonCardHTML, unitSectionHTML, lessonPageHTML } from "../js/app.js";

const progressStub = {
  isComplete: (id) => id === 1,
  getUnitProgress: (unit) => {
    const done = unit.lessons.filter((l) => l.id === 1).length;
    return { done, total: unit.lessons.length, complete: done === unit.lessons.length };
  },
};

test("课程卡片包含课名、链接与完成状态", () => {
  const lesson = SITE_DATA.units[0].lessons[0];
  const html = lessonCardHTML(lesson, true);
  assert.ok(html.includes("第 1 课"));
  assert.ok(html.includes("lesson.html?id=1"));
  assert.ok(html.includes("已完成"));
});

test("单元区块包含单元名、课程卡片与进度", () => {
  const unit = SITE_DATA.units[0];
  const html = unitSectionHTML(unit, progressStub);
  assert.ok(html.includes("单元一"));
  assert.ok(html.includes("汽车比例系统"));
  assert.ok(html.includes("1/4"));
});

test("课程页包含目标、全部步骤插图与口诀", () => {
  const lesson = SITE_DATA.units[0].lessons[0];
  const next = SITE_DATA.units[0].lessons[1];
  const html = lessonPageHTML(lesson, null, next, false);
  assert.ok(html.includes("reference-drawing.jpg"), "课程页应展示手绘范例");
  assert.ok(html.includes(lesson.goal));
  for (const s of lesson.steps) {
    assert.ok(html.includes(s.caption), `缺少步骤：${s.caption}`);
    assert.ok(html.includes(s.art), `缺少插图：${s.art}`);
  }
  assert.ok(html.includes("完成本节"));
  assert.ok(html.includes("lesson.html?id=2"));
});

test("已完成课程显示完成态按钮", () => {
  const lesson = SITE_DATA.units[0].lessons[0];
  const html = lessonPageHTML(lesson, null, null, true);
  assert.ok(html.includes("disabled"));
  assert.ok(html.includes("已完成"));
});
