import test from "node:test";
import assert from "node:assert/strict";
import { readFile, access } from "node:fs/promises";

async function read(p) {
  return readFile(new URL(`../${p}`, import.meta.url), "utf8");
}
async function exists(p) {
  try { await access(new URL(`../${p}`, import.meta.url)); return true; }
  catch { return false; }
}

test("核心文件都存在", async () => {
  for (const f of ["package.json", "scripts/serve.js", "index.html", "lessons.html", "course.html", "popular.html", "master.html", "css/styles.css", "js/data.js", "js/app.js"]) {
    assert.ok(await exists(f), `缺少 ${f}`);
  }
});

test("页面有 data-page 与渲染容器", async () => {
  const home = await read("index.html");
  assert.ok(home.includes('data-page="home"'));
  assert.ok(home.includes('id="course-grid"'));
  assert.ok(home.includes('id="popular-grid"'));
  const lessons = await read("lessons.html");
  assert.ok(lessons.includes('data-page="lessons"'));
  assert.ok(lessons.includes('id="course-list"'));
  const course = await read("course.html");
  assert.ok(course.includes('data-page="course"'));
  assert.ok(course.includes('id="course-page"'));
  const popular = await read("popular.html");
  assert.ok(popular.includes('data-page="popular"'));
  assert.ok(popular.includes('id="popular-list"'));
});

test("样式包含设计规范配色", async () => {
  const css = await read("css/styles.css");
  assert.ok(css.includes("#FFF8EC"));
  assert.ok(css.includes("#4A90D9"));
  assert.ok(css.includes("#FFD23F"));
  assert.ok(css.includes("#FF7A59"));
});

test("响应式断点样式存在", async () => {
  const css = await read("css/styles.css");
  assert.ok(css.includes("@media (max-width: 900px)"));
  assert.ok(css.includes("grid-template-columns: 1fr"));
});