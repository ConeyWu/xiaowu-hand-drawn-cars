import test from "node:test";
import assert from "node:assert/strict";
import { SITE_DATA } from "../js/data.js";
import { courseCardHTML, courseSectionHTML, coursePageHTML, popularPageHTML, popularSectionHTML } from "../js/app.js";

const progressStub = {
  isComplete: () => false,
  getUnitProgress: () => ({ done: 0, total: 1, complete: false }),
};

test("课程卡片包含课名、链接与封面", () => {
  const course = SITE_DATA.courses[0];
  const html = courseCardHTML(course, false);
  assert.ok(html.includes("正视图"));
  assert.ok(html.includes("course.html?view=front"));
  assert.ok(html.includes("step-15.webp"));
});

test("课程区渲染 5 张课程卡片", () => {
  const html = courseSectionHTML(SITE_DATA.courses, progressStub);
  assert.equal((html.match(/class="lesson-card course-card"/g) || []).length, 5);
});

test("课程页包含目标、全部步骤与成品图", () => {
  const course = SITE_DATA.courses[1];
  const next = SITE_DATA.courses[2];
  const html = coursePageHTML(course, null, next, false);
  assert.ok(html.includes(course.goal));
  assert.ok(html.includes("成品图"));
  assert.ok(html.includes("course.html?view=rear"));
  assert.equal((html.match(/class="step"/g) || []).length, course.steps.length);
  assert.ok(html.includes("完成本节"));
});

test("流行车辆页渲染尊界与问界的三视图", () => {
  const html = popularPageHTML(SITE_DATA.popular);
  assert.ok(html.includes("尊界"));
  assert.ok(html.includes("问界"));
  assert.equal((html.match(/class="view-card"/g) || []).length, 6);
  assert.equal((html.match(/data-view="/g) || []).length, 6, "每张三视图应可点击看大图");
  assert.equal((html.match(/data-view="/g) || []).length, 6, "每张三视图应可点击看大图");
});

test("流行车辆卡片包含车名与封面", () => {
  const html = popularSectionHTML(SITE_DATA.popular);
  assert.ok(html.includes("尊界"));
  assert.ok(html.includes("问界"));
  assert.ok(html.includes("popular.html#zunjie"));
  assert.ok(html.includes("popular.html#wenjie"));
});