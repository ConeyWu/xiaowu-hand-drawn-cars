// 浏览器集成测试（无浏览器环境替代）：用 DOM 桩驱动 app.js 的真实渲染与打卡流程
import test from "node:test";
import assert from "node:assert/strict";

function memoryStorage() {
  const m = new Map();
  return {
    getItem: (k) => (m.has(k) ? m.get(k) : null),
    setItem: (k, v) => { m.set(k, String(v)); },
    removeItem: (k) => { m.delete(k); },
  };
}

function setupDom(page, search = "") {
  const listeners = {};
  const elements = {};
  const storage = memoryStorage();
  let clickHandler = null;
  globalThis.window = {
    localStorage: storage,
    location: { search, href: "" },
  };
  globalThis.document = {
    body: { dataset: { page } },
    getElementById: (id) => {
      if (!elements[id]) {
        elements[id] = {
          innerHTML: "",
          addEventListener: (evt, cb) => { (listeners[evt] = listeners[evt] || []).push(cb); },
          querySelector: (sel) => {
            if (sel === '[data-action="complete"]') {
              return { addEventListener: (evt, cb) => { clickHandler = cb; } };
            }
            return null;
          },
        };
      }
      return elements[id];
    },
    addEventListener: (evt, cb) => { listeners[evt] = cb; },
  };
  return { storage, elements, listeners, getClickHandler: () => clickHandler };
}

function count(html, marker) {
  return (html.match(new RegExp(marker, "g")) || []).length;
}

test("首页渲染三大栏目：5 门课程 + 2 辆流行车", async () => {
  const { elements } = setupDom("home");
  const { initApp } = await import("../js/app.js");
  initApp();
  const courses = elements["course-grid"].innerHTML;
  assert.equal(count(courses, 'class="lesson-card course-card"'), 5);
  assert.ok(courses.includes("正视图"));
  assert.ok(courses.includes("侧视图"));
  assert.ok(courses.includes("后视图"));
  assert.ok(courses.includes("斜视图"));
  assert.ok(courses.includes("舱内图"));
  const popular = elements["popular-grid"].innerHTML;
  assert.equal(count(popular, 'class="lesson-card popular-card"'), 2);
  assert.ok(popular.includes("尊界"));
  assert.ok(popular.includes("问界"));
});

test("课程列表页渲染 5 张课程卡片", async () => {
  const { elements } = setupDom("lessons");
  const { initApp } = await import("../js/app.js");
  initApp();
  const html = elements["course-list"].innerHTML;
  assert.equal(count(html, 'class="lesson-card course-card"'), 5);
});

test("课程页渲染步骤并支持打卡写入进度", async () => {
  const { storage, elements, getClickHandler } = setupDom("course", "?view=front");
  const { initApp } = await import("../js/app.js");
  initApp();
  const pageEl = elements["course-page"];
  assert.ok(pageEl.innerHTML.includes("正视图课程"));
  assert.ok(pageEl.innerHTML.includes("成品图"));
  assert.equal(count(pageEl.innerHTML, 'class="step"'), 5);
  assert.ok(pageEl.innerHTML.includes("完成本节"));
  assert.deepEqual(storage.getItem("xiaowu.completedLessons"), null);

  const click = getClickHandler();
  assert.ok(click, "打卡按钮应有事件监听");
  click();
  assert.deepEqual(JSON.parse(storage.getItem("xiaowu.completedLessons")), ["front"]);
  assert.ok(pageEl.innerHTML.includes("已完成"));
  assert.ok(pageEl.innerHTML.includes("disabled"));
});

test("不存在的课程 view 跳回课程列表", async () => {
  setupDom("course", "?view=nope");
  const { initApp } = await import("../js/app.js");
  initApp();
  assert.equal(globalThis.window.location.href, "lessons.html");
});

test("流行车辆页渲染尊界与问界三视图", async () => {
  const { elements } = setupDom("popular");
  const { initApp } = await import("../js/app.js");
  initApp();
  const html = elements["popular-list"].innerHTML;
  assert.equal(count(html, 'class="view-card"'), 6);
  assert.ok(html.includes("尊界"));
  assert.ok(html.includes("问界"));
  assert.ok(html.includes("正视图"));
  assert.ok(html.includes("后视图"));
  assert.ok(html.includes("侧视图"));
});

test("完成一门课程后首页显示已完成", async () => {
  const { storage, elements } = setupDom("home");
  const { initApp } = await import("../js/app.js");
  storage.setItem("xiaowu.completedLessons", JSON.stringify(["front"]));
  initApp();
  const html = elements["course-grid"].innerHTML;
  assert.ok(html.includes("✓ 已完成"));
});