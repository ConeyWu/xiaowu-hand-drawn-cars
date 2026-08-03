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
  for (const f of ["package.json", "scripts/serve.js", "index.html", "lessons.html", "lesson.html", "css/styles.css"]) {
    assert.ok(await exists(f), `缺少 ${f}`);
  }
});

test("三个页面有 data-page 与渲染容器", async () => {
  const home = await read("index.html");
  assert.ok(home.includes('data-page="home"'));
  assert.ok(home.includes('id="unit-map"'));
  assert.ok(home.includes('src="js/app.js"'));
  const lessons = await read("lessons.html");
  assert.ok(lessons.includes('data-page="lessons"'));
  assert.ok(lessons.includes('id="lesson-list"'));
  const lesson = await read("lesson.html");
  assert.ok(lesson.includes('data-page="lesson"'));
  assert.ok(lesson.includes('id="lesson-page"'));
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
