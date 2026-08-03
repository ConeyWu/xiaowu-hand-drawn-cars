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

test("首页渲染 7 个单元、31 张课程卡片", async () => {
  const { elements } = setupDom("home");
  const { initApp } = await import("../js/app.js");
  initApp();
  const html = elements["unit-map"].innerHTML;
  assert.ok(html.includes("单元一 · 比例与结构"));
  assert.ok(html.includes("单元二 · 透视与视角"));
  assert.ok(html.includes("单元三 · 新能源设计语言"));
  assert.ok(html.includes("单元四 · 渲染与表现"));
  assert.ok(html.includes("单元五 · 创作与作品集"));
  assert.ok(html.includes("单元六 · 写生与材质"));
  assert.ok(html.includes("单元七 · 专业技法与进阶"));
  assert.equal(count(html, 'class="lesson-card"'), 31);
  assert.equal(count(html, "0/4"), 5);
  assert.equal(count(html, "0/5"), 1);
  assert.equal(count(html, "0/6"), 1);
});

test("课程列表页渲染 31 张卡片", async () => {
  const { elements } = setupDom("lessons");
  const { initApp } = await import("../js/app.js");
  initApp();
  const html = elements["lesson-list"].innerHTML;
  assert.equal(count(html, 'class="lesson-card"'), 31);
  assert.ok(html.includes("概念车创作"));
  assert.ok(html.includes("实车写生·线稿"));
  assert.ok(html.includes("考前作品集标准"));
});

test("课程页渲染步骤并支持打卡写入进度", async () => {
  const { storage, elements, getClickHandler } = setupDom("lesson", "?id=1");
  const { initApp } = await import("../js/app.js");
  initApp();
  const pageEl = elements["lesson-page"];
  assert.ok(pageEl.innerHTML.includes("汽车比例系统"));
  assert.ok(pageEl.innerHTML.includes("画两个轮径圆，作为比例的基准尺"));
  assert.equal(count(pageEl.innerHTML, 'class="step"'), 5);
  assert.ok(pageEl.innerHTML.includes("完成本节"));
  assert.deepEqual(storage.getItem("xiaowu.completedLessons"), null);

  const click = getClickHandler();
  assert.ok(click, "打卡按钮应有事件监听");
  click();
  assert.deepEqual(JSON.parse(storage.getItem("xiaowu.completedLessons")), [1]);
  assert.ok(pageEl.innerHTML.includes("已完成"));
  assert.ok(pageEl.innerHTML.includes("disabled"));
});

test("不存在的课程 id 跳回课程列表", async () => {
  setupDom("lesson", "?id=99");
  const { initApp } = await import("../js/app.js");
  initApp();
  assert.equal(globalThis.window.location.href, "lessons.html");
});

test("完成一个单元后首页点亮徽章", async () => {
  const { storage, elements } = setupDom("home");
  const { initApp } = await import("../js/app.js");
  storage.setItem("xiaowu.completedLessons", JSON.stringify([1, 2, 3, 4]));
  initApp();
  const html = elements["unit-map"].innerHTML;
  assert.ok(html.includes("🏆 单元完成！"));
  assert.ok(!html.includes("4/4"), "完成单元不再显示数字进度");
  assert.equal(count(html, "0/4"), 4);
});

test("全部课程完成后总进度到位", async () => {
  const { storage, elements } = setupDom("home");
  const { initApp } = await import("../js/app.js");
  storage.setItem("xiaowu.completedLessons", JSON.stringify(Array.from({ length: 20 }, (_, i) => i + 1)));
  initApp();
  const html = elements["unit-map"].innerHTML;
  assert.equal(count(html, "🏆 单元完成！"), 5);
  assert.equal(count(html, "0/4"), 0);
});
