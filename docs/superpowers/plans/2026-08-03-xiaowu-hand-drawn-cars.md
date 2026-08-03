# 小吴手绘汽车网站 Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** 构建并上线"小吴手绘汽车"静态教程网站，以 12 节分步课程指导 8 岁孩子画出更好的新能源汽车设计图。

**Architecture:** 纯静态三页面网站（首页 / 课程列表 / 课程详情）。课程内容由 `js/data.js` 数据文件驱动，课程详情页用单个 `lesson.html` 模板按 `?id=` 渲染；52 张步骤插画由 `scripts/generate_car_svgs.js` 程序化生成（每课逐步累加元素，符合"跟着画"的教学逻辑）；完成进度存于浏览器 localStorage。全程零依赖、无构建工具，最终托管到 GitHub Pages。

**Tech Stack:** HTML5、CSS3、原生 JavaScript（ES6 模块）、Node.js 26（`node:test` 测试，零 npm 依赖）、GitHub Pages 部署。

## Global Constraints

（每项要求隐含适用于所有任务，来自设计文档 `docs/superpowers/specs/2026-08-03-xiaowu-hand-drawn-cars-design.md`）

- 站点名称必须是"小吴手绘汽车"；全部文案为简体中文，面向 8 岁儿童，正文 ≥18px。
- 纯静态：HTML5 + CSS3 + 原生 JS，**禁止**引入框架、构建工具、外部 CDN。
- 课程结构：3 个单元、每单元 4 课、共 12 课；每课步骤数为 `[4,4,4,5,4,4,5,4,4,4,5,5]`，合计 52 步、52 张 SVG。
- 每课数据字段：`id`（1~12 全局唯一）、`title`、`goal`、`steps[]`（`caption` + `art`）、`tips[]`。
- 插画路径格式：`assets/illustrations/lesson-XX-step-YY.svg`（XX=课号、YY=步骤号，两位数补零）。
- 进度存储 key 固定为 `xiaowu.completedLessons`，值为 JSON 数组（已完成课程 id）。
- 配色规范：背景 `#FFF8EC`、主色 `#4A90D9`、柠檬黄 `#FFD23F`、点缀 `#FF7A59`。
- 响应式：≥900px 课程卡片两列，<900px 单列；按钮触控目标 ≥48×48px。
- 测试命令：`npm test`（= `node --test tests/`），Node 26 已装于 PATH。
- 本环境 `.git` 目录在沙箱中只读：`git add` / `git commit` 必须使用 `sandbox_permissions: require_escalated` 执行（`git commit` 前缀已获批）。
- 每个任务结束必须 git 提交一次，提交信息见各任务。

---

## File Structure

```
index.html                      首页（hero + 单元课程地图 #unit-map）
lessons.html                    课程列表页（单元分组卡片 #lesson-list）
lesson.html                     课程详情页（单模板，#lesson-page 按 ?id= 渲染）
css/styles.css                  全部样式（设计规范配色 + 响应式）
js/data.js                      课程数据：导出 SITE_DATA（siteName + units）
js/progress.js                  进度逻辑：导出 createProgressStore(storage)
js/app.js                       渲染与交互：导出 lessonCardHTML / unitSectionHTML /
                                lessonPageHTML / initApp
assets/illustrations/           52 张步骤插画（由生成脚本产出）
scripts/serve.js                零依赖静态服务器（本地预览用）
scripts/generate_car_svgs.js    插画生成脚本
tests/scaffold.test.js          骨架与样式测试
tests/data.test.js              课程数据结构测试
tests/progress.test.js          进度逻辑测试
tests/render.test.js            渲染 HTML 测试
package.json                    type: module；scripts.test = node --test tests/
.gitignore                      node_modules/ 等
README.md                       本地运行 / 测试 / 部署说明
```

模块接口约定（后续任务按此名字/签名使用）：

- `js/data.js`：`export const SITE_DATA = { siteName, units: [{ id, title, lessons: [{ id, title, goal, steps: [{ caption, art }], tips: [] }] }] }`
- `js/progress.js`：`export function createProgressStore(storage)`，返回 `{ isComplete(id) -> boolean, markComplete(id) -> void, getCompleted() -> number[], getUnitProgress(unit) -> {done,total,complete}, getOverallProgress(units) -> {done,total,complete} }`
- `js/app.js`：`export function lessonCardHTML(lesson, isComplete) -> string`、`export function unitSectionHTML(unit, progress) -> string`、`export function lessonPageHTML(lesson, prev, next, isComplete) -> string`、`export function initApp() -> void`

---

## Task 1: 站点骨架与全局样式

**Files:**
- Create: `package.json`
- Create: `.gitignore`
- Create: `scripts/serve.js`
- Create: `index.html`
- Create: `lessons.html`
- Create: `lesson.html`
- Create: `css/styles.css`
- Create: `README.md`
- Test: `tests/scaffold.test.js`

**Interfaces:**
- Consumes: 无（全新项目）。
- Produces: 三个 HTML 页面的 `data-page` 属性（`home` / `lessons` / `lesson`）与渲染容器（`#unit-map` / `#lesson-list` / `#lesson-page`），供 Task 5 的 `initApp()` 使用；`package.json` 的 `npm test` 供所有后续任务使用。

- [ ] **Step 1: 写失败测试**

创建 `tests/scaffold.test.js`：

```js
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
```

- [ ] **Step 2: 运行测试，确认失败**

Run: `npm test`
Expected: FAIL —— `缺少 package.json` 等（文件尚不存在）。

- [ ] **Step 3: 创建 `package.json`**

```json
{
  "name": "xiaowu-hand-drawn-cars",
  "version": "1.0.0",
  "private": true,
  "type": "module",
  "scripts": {
    "test": "node --test tests/",
    "start": "node scripts/serve.js"
  }
}
```

- [ ] **Step 4: 创建 `.gitignore`**

```
node_modules/
.DS_Store
Thumbs.db
output/
.worktrees/
```

- [ ] **Step 5: 创建 `scripts/serve.js`（零依赖静态服务器）**

```js
import http from "node:http";
import { readFile } from "node:fs/promises";
import { extname, join, normalize, resolve } from "node:path";

const root = resolve(process.cwd());
const port = Number(process.env.PORT || 8000);
const types = {
  ".html": "text/html; charset=utf-8",
  ".css": "text/css; charset=utf-8",
  ".js": "text/javascript; charset=utf-8",
  ".svg": "image/svg+xml; charset=utf-8",
  ".json": "application/json; charset=utf-8",
  ".png": "image/png",
  ".ico": "image/x-icon",
};

const server = http.createServer(async (req, res) => {
  try {
    const url = new URL(req.url, "http://localhost");
    let pathname = decodeURIComponent(url.pathname);
    if (pathname === "/") pathname = "/index.html";
    const filePath = normalize(join(root, pathname));
    if (!filePath.startsWith(root)) {
      res.writeHead(403);
      res.end("Forbidden");
      return;
    }
    const data = await readFile(filePath);
    res.writeHead(200, { "Content-Type": types[extname(filePath)] || "application/octet-stream" });
    res.end(data);
  } catch {
    res.writeHead(404);
    res.end("Not Found");
  }
});

server.listen(port, () => console.log(`小吴手绘汽车本地预览: http://localhost:${port}`));
```

- [ ] **Step 6: 创建 `index.html`**

```html
<!DOCTYPE html>
<html lang="zh-CN">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <title>小吴手绘汽车</title>
  <link rel="stylesheet" href="css/styles.css">
</head>
<body data-page="home">
  <header class="site-header">
    <a class="brand" href="index.html">小吴手绘汽车</a>
    <nav class="main-nav">
      <a href="index.html">首页</a>
      <a href="lessons.html">课程</a>
    </nav>
  </header>
  <main class="container" id="app">
    <section class="hero">
      <h1>小吴手绘汽车</h1>
      <p>跟着步骤，画出一辆又酷又帅的新能源汽车！</p>
      <a class="btn btn-primary" href="lessons.html">开始学画</a>
    </section>
    <section class="unit-map" id="unit-map" aria-label="课程地图"></section>
  </main>
  <footer class="site-footer">小吴手绘汽车 · 画得开心，画得更好</footer>
  <script type="module" src="js/app.js"></script>
</body>
</html>
```

- [ ] **Step 7: 创建 `lessons.html`**

```html
<!DOCTYPE html>
<html lang="zh-CN">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <title>课程 · 小吴手绘汽车</title>
  <link rel="stylesheet" href="css/styles.css">
</head>
<body data-page="lessons">
  <header class="site-header">
    <a class="brand" href="index.html">小吴手绘汽车</a>
    <nav class="main-nav">
      <a href="index.html">首页</a>
      <a href="lessons.html">课程</a>
    </nav>
  </header>
  <main class="container" id="app">
    <h1 class="page-title">全部课程</h1>
    <div id="lesson-list" aria-live="polite"></div>
  </main>
  <footer class="site-footer">小吴手绘汽车 · 画得开心，画得更好</footer>
  <script type="module" src="js/app.js"></script>
</body>
</html>
```

- [ ] **Step 8: 创建 `lesson.html`**

```html
<!DOCTYPE html>
<html lang="zh-CN">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <title>课程 · 小吴手绘汽车</title>
  <link rel="stylesheet" href="css/styles.css">
</head>
<body data-page="lesson">
  <header class="site-header">
    <a class="brand" href="index.html">小吴手绘汽车</a>
    <nav class="main-nav">
      <a href="index.html">首页</a>
      <a href="lessons.html">课程</a>
    </nav>
  </header>
  <main class="container" id="app">
    <div id="lesson-page" aria-live="polite">加载中…</div>
  </main>
  <footer class="site-footer">小吴手绘汽车 · 画得开心，画得更好</footer>
  <script type="module" src="js/app.js"></script>
</body>
</html>
```

- [ ] **Step 9: 创建 `css/styles.css`**

```css
:root {
  --cream: #FFF8EC;
  --sky: #4A90D9;
  --sky-dark: #2F6FB0;
  --yellow: #FFD23F;
  --orange: #FF7A59;
  --ink: #2F3542;
  --gray: #8A94A6;
  --radius: 24px;
  --shadow: 0 6px 18px rgba(47, 53, 66, 0.10);
}

* { box-sizing: border-box; margin: 0; padding: 0; }

body {
  font-family: "Microsoft YaHei", "PingFang SC", "Noto Sans CJK SC", sans-serif;
  background: var(--cream);
  color: var(--ink);
  font-size: 18px;
  line-height: 1.6;
}

a { color: inherit; text-decoration: none; }
img { display: block; max-width: 100%; }

.site-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 14px 24px;
  background: var(--sky);
  color: #fff;
  position: sticky;
  top: 0;
  z-index: 10;
}
.brand { font-size: 22px; font-weight: 800; letter-spacing: 1px; }
.main-nav a { margin-left: 16px; padding: 8px 14px; border-radius: 999px; font-weight: 600; }
.main-nav a:hover { background: rgba(255, 255, 255, 0.2); }

.container { max-width: 1040px; margin: 0 auto; padding: 24px 20px 64px; }
.page-title { font-size: 32px; color: var(--sky-dark); margin-bottom: 8px; }

.hero { text-align: center; padding: 36px 0 28px; }
.hero h1 { font-size: clamp(40px, 7vw, 64px); color: var(--sky-dark); letter-spacing: 4px; }
.hero p { margin-top: 10px; font-size: 20px; color: #555; }
.hero-car { margin: 24px auto 0; max-width: 460px; width: 100%; }
.hero .btn { margin-top: 24px; }

.btn {
  display: inline-block;
  min-height: 48px;
  padding: 12px 28px;
  border-radius: 999px;
  border: none;
  cursor: pointer;
  font-size: 19px;
  font-weight: 700;
  font-family: inherit;
  background: var(--yellow);
  color: var(--ink);
  box-shadow: var(--shadow);
}
.btn-primary { background: var(--sky); color: #fff; }
.btn-done { background: #B8E6C2; color: #1F6B33; }
.btn:hover { filter: brightness(1.05); }
.btn[disabled] { opacity: 0.9; cursor: default; }

.unit { margin: 34px 0; }
.unit-head {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 14px;
}
.unit-head h2 { font-size: 26px; color: var(--sky-dark); }
.badge {
  display: inline-block;
  padding: 6px 14px;
  border-radius: 999px;
  font-size: 15px;
  font-weight: 700;
}
.badge-todo { background: #EDE3D2; color: #8A6B3F; }
.badge-done { background: #B8E6C2; color: #1F6B33; }

.lesson-grid { display: grid; grid-template-columns: repeat(2, 1fr); gap: 18px; }
.lesson-card {
  display: block;
  background: #fff;
  border-radius: var(--radius);
  padding: 18px 20px;
  box-shadow: var(--shadow);
  transition: transform 0.15s ease;
}
.lesson-card:hover { transform: translateY(-3px); }
.lesson-card-head { display: flex; justify-content: space-between; align-items: center; }
.lesson-num { font-size: 15px; color: var(--gray); font-weight: 700; }
.lesson-card h3 { margin-top: 8px; font-size: 22px; color: var(--sky-dark); }
.lesson-card p { margin-top: 6px; font-size: 16px; color: #666; }

.lesson-header { text-align: center; margin-bottom: 26px; }
.lesson-header h1 { font-size: 32px; color: var(--sky-dark); }
.goal { margin-top: 10px; font-size: 20px; font-weight: 700; color: var(--orange); }

.steps { list-style: none; }
.step {
  background: #fff;
  border-radius: var(--radius);
  box-shadow: var(--shadow);
  margin-bottom: 22px;
  padding: 20px;
}
.step-num {
  display: inline-block;
  background: var(--yellow);
  color: var(--ink);
  font-weight: 800;
  padding: 4px 16px;
  border-radius: 999px;
  font-size: 16px;
}
.step-figure { margin-top: 14px; text-align: center; }
.step-figure img { margin: 0 auto; max-width: 480px; width: 100%; }
.step-figure figcaption { margin-top: 10px; font-size: 20px; font-weight: 700; }

.tips {
  background: #EAF4FF;
  border-radius: var(--radius);
  padding: 18px 24px;
  list-style-position: inside;
  margin: 8px 0 24px;
}
.tips li { margin: 6px 0; }

.lesson-actions { text-align: center; margin: 26px 0; }
.lesson-nav { display: flex; justify-content: space-between; gap: 12px; margin-top: 18px; }

.site-footer { text-align: center; padding: 22px; color: var(--gray); font-size: 15px; }

@media (max-width: 900px) {
  .lesson-grid { grid-template-columns: 1fr; }
  .lesson-nav { flex-direction: column; align-items: center; }
  .lesson-nav .btn { width: 100%; text-align: center; }
}
```

- [ ] **Step 10: 创建 `README.md`**

```markdown
# 小吴手绘汽车

指导 8 岁孩子画出更好的新能源汽车设计图的分步教程网站。

## 本地运行

    npm start
    # 打开 http://localhost:8000

## 测试

    npm test

## 重新生成步骤插画

    node scripts/generate_car_svgs.js

## 部署

推送到 GitHub 仓库后，在仓库 Settings → Pages 选择分支 `master`、目录 `/` 即可。访问地址为 `https://<用户名>.github.io/<仓库名>/`。

## 目录

- `index.html` / `lessons.html` / `lesson.html`：三个页面
- `js/data.js`：课程数据
- `js/progress.js`：本地进度
- `js/app.js`：渲染与交互
- `assets/illustrations/`：步骤插画
```

- [ ] **Step 11: 运行测试，确认通过**

Run: `npm test`
Expected: PASS（3 个测试组全部通过）。

- [ ] **Step 12: 浏览器冒烟检查**

Run: `npm start`（后台运行）
用浏览器工具打开 `http://localhost:8000/`、`/lessons.html`、`/lesson.html?id=1`，确认：
- 三个页面均正常渲染，导航可点击跳转；
- 首页 hero 显示站名和按钮；桌面宽度下卡片区域留白正常。

- [ ] **Step 13: 提交**

```bash
git add package.json .gitignore scripts/serve.js index.html lessons.html lesson.html css/styles.css README.md tests/scaffold.test.js
git commit -m "feat: 站点骨架与全局样式"
```

---

## Task 2: 课程数据 data.js

**Files:**
- Create: `js/data.js`
- Test: `tests/data.test.js`

**Interfaces:**
- Consumes: 无。
- Produces: `export const SITE_DATA`（结构见 File Structure 一节）；供 Task 3 进度测试、Task 4 插画测试、Task 5 渲染测试与 `app.js` 使用。

- [ ] **Step 1: 写失败测试**

创建 `tests/data.test.js`：

```js
import test from "node:test";
import assert from "node:assert/strict";
import { SITE_DATA } from "../js/data.js";

const EXPECTED_STEP_COUNTS = [4, 4, 4, 5, 4, 4, 5, 4, 4, 4, 5, 5];

test("站点名正确", () => {
  assert.equal(SITE_DATA.siteName, "小吴手绘汽车");
});

test("3 个单元，每单元 4 课，共 12 课，id 唯一", () => {
  assert.equal(SITE_DATA.units.length, 3);
  for (const u of SITE_DATA.units) {
    assert.equal(u.lessons.length, 4);
  }
  const ids = SITE_DATA.units.flatMap((u) => u.lessons.map((l) => l.id));
  assert.equal(ids.length, 12);
  assert.equal(new Set(ids).size, 12);
});

test("每课字段完整", () => {
  for (const u of SITE_DATA.units) {
    assert.ok(u.id && u.title);
    for (const l of u.lessons) {
      assert.ok(Number.isInteger(l.id));
      assert.ok(l.title);
      assert.ok(l.goal);
      assert.ok(Array.isArray(l.steps) && l.steps.length > 0);
      for (const s of l.steps) {
        assert.ok(s.caption);
        assert.ok(s.art);
      }
      assert.ok(Array.isArray(l.tips) && l.tips.length > 0);
    }
  }
});

test("每课步骤数符合设计文档", () => {
  const counts = SITE_DATA.units.flatMap((u) => u.lessons.map((l) => l.steps.length));
  assert.deepEqual(counts, EXPECTED_STEP_COUNTS);
});

test("步骤插图路径格式正确", () => {
  for (const u of SITE_DATA.units) {
    for (const l of u.lessons) {
      const prefix = `assets/illustrations/lesson-${String(l.id).padStart(2, "0")}-step-`;
      for (const s of l.steps) {
        assert.match(s.art, new RegExp(`^${prefix}\\d{2}\\.svg$`));
      }
    }
  }
});
```

- [ ] **Step 2: 运行测试，确认失败**

Run: `npm test`
Expected: FAIL —— 找不到 `js/data.js`。

- [ ] **Step 3: 创建 `js/data.js`（完整课程内容，原样写入）**

```js
// 课程数据：小吴手绘汽车
export const SITE_DATA = {
  siteName: "小吴手绘汽车",
  units: [
    {
      id: "unit-1",
      title: "单元一 · 基础入门",
      lessons: [
        {
          id: 1,
          title: "认识汽车的结构",
          goal: "认识一辆车由车身、车轮、车窗、车灯组成。",
          steps: [
            { caption: "先画一条地平线", art: "assets/illustrations/lesson-01-step-01.svg" },
            { caption: "画车身：像一个大大的盒子", art: "assets/illustrations/lesson-01-step-02.svg" },
            { caption: "画两个车轮", art: "assets/illustrations/lesson-01-step-03.svg" },
            { caption: "加上车窗和车灯", art: "assets/illustrations/lesson-01-step-04.svg" },
          ],
          tips: ["先轻轻下笔，错了可以改", "一辆车 = 车身 + 车轮 + 车窗 + 车灯"],
        },
        {
          id: 2,
          title: "画圆与车轮",
          goal: "把轮子画圆，并安排好两个轮子的位置。",
          steps: [
            { caption: "画一个大大的圆", art: "assets/illustrations/lesson-02-step-01.svg" },
            { caption: "在右边再画一个一样大的圆", art: "assets/illustrations/lesson-02-step-02.svg" },
            { caption: "给每个轮子加上中心点", art: "assets/illustrations/lesson-02-step-03.svg" },
            { caption: "检查：两个圆一样大、在一条线上", art: "assets/illustrations/lesson-02-step-04.svg" },
          ],
          tips: ["圆画不好就多画几圈，别急着一次画成", "两个轮子之间留出大约两个轮子的距离"],
        },
        {
          id: 3,
          title: "车身轮廓",
          goal: "用长方形和梯形组合出车身轮廓。",
          steps: [
            { caption: "先画一个长方形", art: "assets/illustrations/lesson-03-step-01.svg" },
            { caption: "前面加一个梯形当车头", art: "assets/illustrations/lesson-03-step-02.svg" },
            { caption: "把尖角改成圆角", art: "assets/illustrations/lesson-03-step-03.svg" },
            { caption: "画出车底，留出车轮的位置", art: "assets/illustrations/lesson-03-step-04.svg" },
          ],
          tips: ["先想好车头朝左还是朝右", "新能源车的车身更圆润，角要圆圆的"],
        },
        {
          id: 4,
          title: "完成第一辆小车",
          goal: "组合车轮、车身、车窗，画出一辆完整的小车。",
          steps: [
            { caption: "先画两个一样大的车轮", art: "assets/illustrations/lesson-04-step-01.svg" },
            { caption: "用车身盖住车轮的上半部分", art: "assets/illustrations/lesson-04-step-02.svg" },
            { caption: "在车身上开一扇车窗", art: "assets/illustrations/lesson-04-step-03.svg" },
            { caption: "加上车灯和车门线", art: "assets/illustrations/lesson-04-step-04.svg" },
            { caption: "检查一下，第一辆小车完成！", art: "assets/illustrations/lesson-04-step-05.svg" },
          ],
          tips: ["车身要盖住车轮的上半部分", "画完退后一步看，哪里不像就改哪里"],
        },
      ],
    },
    {
      id: "unit-2",
      title: "单元二 · 新能源设计元素",
      lessons: [
        {
          id: 5,
          title: "封闭式前脸",
          goal: "了解电车为什么没有大格栅，画简洁的前脸。",
          steps: [
            { caption: "画圆润的车头轮廓", art: "assets/illustrations/lesson-05-step-01.svg" },
            { caption: "画一条下保险杠", art: "assets/illustrations/lesson-05-step-02.svg" },
            { caption: "前脸干干净净，不画格栅", art: "assets/illustrations/lesson-05-step-03.svg" },
            { caption: "记住：电车前脸没有大格栅", art: "assets/illustrations/lesson-05-step-04.svg" },
          ],
          tips: ["电车不需要大格栅散热，所以前脸更简洁", "越简洁，越显高级"],
        },
        {
          id: 6,
          title: "贯穿式大灯",
          goal: "画出又酷又亮的贯穿式大灯。",
          steps: [
            { caption: "在车头画一条横贯的灯带", art: "assets/illustrations/lesson-06-step-01.svg" },
            { caption: "灯带两端微微上扬", art: "assets/illustrations/lesson-06-step-02.svg" },
            { caption: "点几个小亮点当高光", art: "assets/illustrations/lesson-06-step-03.svg" },
            { caption: "用黄色点亮它", art: "assets/illustrations/lesson-06-step-04.svg" },
          ],
          tips: ["贯穿式大灯是新能源车的标志之一", "灯带两端微微上扬，更有精神"],
        },
        {
          id: 7,
          title: "轮毂与细节",
          goal: "画出好看的轮毂、车门线和后视镜。",
          steps: [
            { caption: "在轮子中间画一个大圆环", art: "assets/illustrations/lesson-07-step-01.svg" },
            { caption: "从中心画出轮毂辐条", art: "assets/illustrations/lesson-07-step-02.svg" },
            { caption: "画一条车门线", art: "assets/illustrations/lesson-07-step-03.svg" },
            { caption: "画一个小耳朵——后视镜", art: "assets/illustrations/lesson-07-step-04.svg" },
            { caption: "检查：细节都在该在的位置", art: "assets/illustrations/lesson-07-step-05.svg" },
          ],
          tips: ["细节越多车越精致，但线条要干净", "先画大结构，再加小细节"],
        },
        {
          id: 8,
          title: "充电口与隐藏门把手",
          goal: "画上充电口和隐藏式门把手。",
          steps: [
            { caption: "在车身侧面画一个充电口", art: "assets/illustrations/lesson-08-step-01.svg" },
            { caption: "画上充电盖的弧线", art: "assets/illustrations/lesson-08-step-02.svg" },
            { caption: "画一条细细的隐藏门把手", art: "assets/illustrations/lesson-08-step-03.svg" },
            { caption: "加一个小摄像头", art: "assets/illustrations/lesson-08-step-04.svg" },
          ],
          tips: ["充电口一般在车的侧面或车头", "隐藏门把手让车身更平滑"],
        },
      ],
    },
    {
      id: "unit-3",
      title: "单元三 · 创作进阶",
      lessons: [
        {
          id: 9,
          title: "让车动起来",
          goal: "用地面线、阴影和透视让车有速度感。",
          steps: [
            { caption: "画一条粗粗的地面线", art: "assets/illustrations/lesson-09-step-01.svg" },
            { caption: "轮子下面加椭圆阴影", art: "assets/illustrations/lesson-09-step-02.svg" },
            { caption: "车尾画几条速度线", art: "assets/illustrations/lesson-09-step-03.svg" },
            { caption: "把车身画低一点，更有速度感", art: "assets/illustrations/lesson-09-step-04.svg" },
          ],
          tips: ["阴影和速度线是'动起来'的秘诀", "车身越低，看起来越快"],
        },
        {
          id: 10,
          title: "上色技巧",
          goal: "学会平涂、渐变、高光三种上色方法。",
          steps: [
            { caption: "平涂：均匀地涂满车身", art: "assets/illustrations/lesson-10-step-01.svg" },
            { caption: "渐变：从下往上叠加深色", art: "assets/illustrations/lesson-10-step-02.svg" },
            { caption: "高光：车顶留一条白色弧线", art: "assets/illustrations/lesson-10-step-03.svg" },
            { caption: "车身底部加深色阴影边", art: "assets/illustrations/lesson-10-step-04.svg" },
          ],
          tips: ["涂色方向要一致，别乱涂", "高光让车有反光的高级感"],
        },
        {
          id: 11,
          title: "前后视角",
          goal: "画出车头正脸和车尾。",
          steps: [
            { caption: "画一个圆角梯形的车头", art: "assets/illustrations/lesson-11-step-01.svg" },
            { caption: "左右各画一只大灯", art: "assets/illustrations/lesson-11-step-02.svg" },
            { caption: "用灯带连接两只大灯", art: "assets/illustrations/lesson-11-step-03.svg" },
            { caption: "倒过来画车尾和贯穿式尾灯", art: "assets/illustrations/lesson-11-step-04.svg" },
            { caption: "车尾中间加一个车牌", art: "assets/illustrations/lesson-11-step-05.svg" },
          ],
          tips: ["正脸要左右对称", "两个大灯要一样高"],
        },
        {
          id: 12,
          title: "设计你自己的概念车",
          goal: "综合运用所有技巧，设计你自己的概念车。",
          steps: [
            { caption: "先想好：SUV、跑车还是未来车？", art: "assets/illustrations/lesson-12-step-01.svg" },
            { caption: "大胆画出与众不同的车身", art: "assets/illustrations/lesson-12-step-02.svg" },
            { caption: "加上大大的轮子", art: "assets/illustrations/lesson-12-step-03.svg" },
            { caption: "加上灯带和尾翼", art: "assets/illustrations/lesson-12-step-04.svg" },
            { caption: "上色并写下你的车名", art: "assets/illustrations/lesson-12-step-05.svg" },
          ],
          tips: ["没有'画错'，只有'下一次更好'", "这是你的原创设计，大胆画！"],
        },
      ],
    },
  ],
};
```

- [ ] **Step 4: 运行测试，确认通过**

Run: `npm test`
Expected: PASS（数据结构全部符合设计文档；注意此时插图文件还不存在，但路径格式测试已通过）。

- [ ] **Step 5: 提交**

```bash
git add js/data.js tests/data.test.js
git commit -m "feat: 12 节课程数据与结构测试"
```

---

## Task 3: 进度逻辑 progress.js

**Files:**
- Create: `js/progress.js`
- Test: `tests/progress.test.js`

**Interfaces:**
- Consumes: 无（storage 由调用方注入）。
- Produces: `createProgressStore(storage)`（签名见 File Structure），供 Task 5 的 `app.js` 与渲染测试使用。

- [ ] **Step 1: 写失败测试**

创建 `tests/progress.test.js`：

```js
import test from "node:test";
import assert from "node:assert/strict";
import { createProgressStore } from "../js/progress.js";

function memoryStorage() {
  const m = new Map();
  return {
    getItem: (k) => (m.has(k) ? m.get(k) : null),
    setItem: (k, v) => { m.set(k, String(v)); },
    removeItem: (k) => { m.delete(k); },
  };
}

const unit = { lessons: [{ id: 1 }, { id: 2 }, { id: 3 }, { id: 4 }] };
const units = [
  unit,
  { lessons: [{ id: 5 }, { id: 6 }, { id: 7 }, { id: 8 }] },
  { lessons: [{ id: 9 }, { id: 10 }, { id: 11 }, { id: 12 }] },
];

test("初始状态为空", () => {
  const s = createProgressStore(memoryStorage());
  assert.equal(s.isComplete(1), false);
  assert.deepEqual(s.getCompleted(), []);
});

test("打卡后持久化，重新创建 store 仍保留", () => {
  const storage = memoryStorage();
  const s1 = createProgressStore(storage);
  s1.markComplete(1);
  const s2 = createProgressStore(storage);
  assert.equal(s2.isComplete(1), true);
  assert.deepEqual(s2.getCompleted(), [1]);
});

test("重复打卡不产生重复记录", () => {
  const s = createProgressStore(memoryStorage());
  s.markComplete(2);
  s.markComplete(2);
  assert.deepEqual(s.getCompleted(), [2]);
});

test("单元进度计算正确", () => {
  const s = createProgressStore(memoryStorage());
  s.markComplete(1);
  s.markComplete(2);
  assert.deepEqual(s.getUnitProgress(unit), { done: 2, total: 4, complete: false });
  s.markComplete(3);
  s.markComplete(4);
  assert.deepEqual(s.getUnitProgress(unit), { done: 4, total: 4, complete: true });
});

test("总进度计算正确", () => {
  const s = createProgressStore(memoryStorage());
  s.markComplete(1);
  assert.deepEqual(s.getOverallProgress(units), { done: 1, total: 12, complete: false });
});

test("损坏的存储数据按空进度处理", () => {
  const storage = memoryStorage();
  storage.setItem("xiaowu.completedLessons", "{bad json");
  const s = createProgressStore(storage);
  assert.deepEqual(s.getCompleted(), []);
  assert.equal(s.isComplete(5), false);
});
```

- [ ] **Step 2: 运行测试，确认失败**

Run: `npm test`
Expected: FAIL —— 找不到 `js/progress.js`。

- [ ] **Step 3: 创建 `js/progress.js`**

```js
// 本地进度：完成课程 id 存于 localStorage（key: xiaowu.completedLessons）
const KEY = "xiaowu.completedLessons";

export function createProgressStore(storage) {
  function load() {
    try {
      const raw = storage.getItem(KEY);
      const arr = raw ? JSON.parse(raw) : [];
      return new Set(arr.map(String));
    } catch {
      return new Set();
    }
  }
  function save(set) {
    storage.setItem(KEY, JSON.stringify([...set].map(Number)));
  }
  return {
    isComplete(id) {
      return load().has(String(id));
    },
    markComplete(id) {
      const set = load();
      set.add(String(id));
      save(set);
    },
    getCompleted() {
      return [...load()].map(Number);
    },
    getUnitProgress(unit) {
      const ids = unit.lessons.map((l) => l.id);
      const done = ids.filter((id) => load().has(String(id))).length;
      return { done, total: ids.length, complete: done === ids.length };
    },
    getOverallProgress(units) {
      const all = units.flatMap((u) => u.lessons.map((l) => l.id));
      const done = all.filter((id) => load().has(String(id))).length;
      return { done, total: all.length, complete: done === all.length };
    },
  };
}
```

- [ ] **Step 4: 运行测试，确认通过**

Run: `npm test`
Expected: PASS。

- [ ] **Step 5: 提交**

```bash
git add js/progress.js tests/progress.test.js
git commit -m "feat: localStorage 进度逻辑"
```

---

## Task 4: 步骤插画生成脚本（52 张 SVG）

**Files:**
- Create: `scripts/generate_car_svgs.js`
- Modify: `index.html`（hero 增加汽车插画）
- Test: `tests/illustrations.test.js`

**Interfaces:**
- Consumes: 无（插画路径格式与 Task 2 的 `data.js` 一一对应）。
- Produces: `assets/illustrations/lesson-01-step-01.svg` ~ `lesson-12-step-05.svg` 共 52 个文件，供 Task 5 渲染测试与页面展示。

- [ ] **Step 1: 写失败测试**

创建 `tests/illustrations.test.js`：

```js
import test from "node:test";
import assert from "node:assert/strict";
import { execFileSync } from "node:child_process";
import { existsSync, readdirSync, readFileSync } from "node:fs";
import { join } from "node:path";

const EXPECTED_STEP_COUNTS = [4, 4, 4, 5, 4, 4, 5, 4, 4, 4, 5, 5];
const DIR = join("assets", "illustrations");

function duplicateAttrs(xml) {
  // XML 不允许同一元素出现重复属性；浏览器按 XML 解析 SVG 图片，重复属性会导致图片加载失败
  const bad = [];
  const tagRe = /<([a-z]+)([^>]*?)(\/?)>/g;
  for (const m of xml.matchAll(tagRe)) {
    const attrs = [...m[2].matchAll(/([\w-]+)="/g)].map((a) => a[1]);
    const dup = attrs.filter((a, i) => attrs.indexOf(a) !== i);
    if (dup.length) bad.push(`${m[0].slice(0, 70)}: ${[...new Set(dup)].join(",")}`);
  }
  return bad;
}

function runGenerator() {
  execFileSync(process.execPath, ["scripts/generate_car_svgs.js"], { cwd: process.cwd() });
}

test("生成 52 张步骤插画", () => {
  runGenerator();
  const files = readdirSync(DIR).filter((f) => f.endsWith(".svg"));
  assert.equal(files.length, 52);
});

test("每个步骤文件都存在、合法且非空", () => {
  runGenerator();
  EXPECTED_STEP_COUNTS.forEach((count, idx) => {
    const lessonNo = idx + 1;
    for (let step = 1; step <= count; step++) {
      const name = `lesson-${String(lessonNo).padStart(2, "0")}-step-${String(step).padStart(2, "0")}.svg`;
      const p = join(DIR, name);
      assert.ok(existsSync(p), `缺少 ${p}`);
      const xml = readFileSync(p, "utf8");
      assert.ok(xml.startsWith("<svg"), `${name} 不是合法 SVG`);
      assert.ok(xml.includes("</svg>"));
      const elements = (xml.match(/<(circle|path|rect|line|ellipse|polyline|polygon)/g) || []);
      assert.ok(elements.length >= 1, `${name} 缺少图形元素`);
      const dup = duplicateAttrs(xml);
      assert.deepEqual(dup, [], `${name} 含重复属性：${dup.join("；")}`);
    }
  });
});

test("重复运行不会产生额外文件", () => {
  runGenerator();
  runGenerator();
  const files = readdirSync(DIR).filter((f) => f.endsWith(".svg"));
  assert.equal(files.length, 52);
});
```

- [ ] **Step 2: 运行测试，确认失败**

Run: `npm test`
Expected: FAIL —— 目录 `assets/illustrations` 不存在或为空。

- [ ] **Step 3: 创建 `scripts/generate_car_svgs.js`（原样写入）**

```js
#!/usr/bin/env node
// 生成 52 张课程步骤插画（SVG）。运行：node scripts/generate_car_svgs.js
import { mkdirSync, writeFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const ROOT = join(dirname(fileURLToPath(import.meta.url)), "..");
const OUT_DIR = join(ROOT, "assets", "illustrations");

const INK = "#2F3542";
const CREAM = "#FFF8EC";
const SKY = "#4A90D9";
const GLASS = "#BFE3FF";
const YELLOW = "#FFD23F";
const ORANGE = "#FF7A59";
const DARK = "#37474F";
const GRAY = "#90A4AE";

// 生成 SVG 描边属性；overrides 覆盖默认值，绝不产生重复属性（XML 要求）
function strokeAttrs(overrides = {}) {
  const a = {
    stroke: INK,
    "stroke-width": 7,
    "stroke-linecap": "round",
    "stroke-linejoin": "round",
    ...overrides,
  };
  return Object.entries(a).map(([k, v]) => `${k}="${v}"`).join(" ");
}

function line(x1, y1, x2, y2, width = 7, color = "none") {
  return `<line x1="${x1}" y1="${y1}" x2="${x2}" y2="${y2}" ${strokeAttrs({ "stroke-width": width })} fill="${color}"/>`;
}
function circle(cx, cy, r, fill = "none", extra = {}) {
  return `<circle cx="${cx}" cy="${cy}" r="${r}" ${strokeAttrs(extra)} fill="${fill}"/>`;
}
function ellipse(cx, cy, rx, ry, fill = "none", extra = {}) {
  return `<ellipse cx="${cx}" cy="${cy}" rx="${rx}" ry="${ry}" ${strokeAttrs(extra)} fill="${fill}"/>`;
}
function path(d, fill = "none", extra = {}) {
  return `<path d="${d}" ${strokeAttrs(extra)} fill="${fill}"/>`;
}
function rect(x, y, w, h, fill = "none", rx = 0, extra = {}) {
  return `<rect x="${x}" y="${y}" width="${w}" height="${h}" rx="${rx}" ${strokeAttrs(extra)} fill="${fill}"/>`;
}
function label(text, x, y, size = 24) {
  return `<text x="${x}" y="${y}" text-anchor="middle" font-size="${size}" font-family="'Microsoft YaHei', sans-serif" font-weight="bold" fill="${INK}">${text}</text>`;
}
function svgDoc(body) {
  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 500 360" role="img">\n${body}\n</svg>\n`;
}

// 基础部件（侧面小轿车，地面 y=320，车轮 cy=278、r=42）
const BASE = {
  ground: () => line(30, 320, 470, 320),
  wheel: (cx) =>
    circle(cx, 278, 42, DARK) + "\n" + circle(cx, 278, 27, "#FFFFFF") + "\n" + circle(cx, 278, 8, DARK),
  wheels: () => BASE.wheel(150) + "\n" + BASE.wheel(350),
  body: (fill = CREAM) =>
    path("M80 244 L80 190 Q80 142 128 142 L236 142 L290 166 L378 166 Q420 166 420 208 L420 244 Z", fill),
  window: () =>
    path("M150 152 L222 152 L240 178 L150 178 Z", GLASS) +
    "\n" +
    path("M262 176 L340 176 L372 200 L262 200 Z", GLASS),
  headlight: () => path("M402 208 Q410 204 420 208 L420 226 Q410 222 402 226 Z", YELLOW),
  taillight: () => rect(84, 196, 14, 22, YELLOW, 7),
  doorLine: () => line(252, 246, 252, 182, 5),
  rim: () => circle(150, 278, 27, "#FFFFFF") + "\n" + circle(350, 278, 27, "#FFFFFF"),
  spokes: () => {
    const arms = [0, 45, 90, 135];
    const arm = (cx) =>
      arms
        .map((a) => {
          const rad = (a * Math.PI) / 180;
          return `<line x1="${cx}" y1="278" x2="${cx + 26 * Math.cos(rad)}" y2="${278 + 26 * Math.sin(rad)}" ${strokeAttrs({ "stroke-width": 4 })}/>`;
        })
        .join("\n");
    return arm(150) + "\n" + arm(350);
  },
  mirror: () => path("M262 176 Q252 168 260 158 L276 158 Q282 168 276 176 Z", SKY),
};

// 每课：elements 中 firstStep 表示该元素从第几步开始出现
const DRAWINGS = [
  {
    id: 1,
    elements: [
      { firstStep: 1, svg: BASE.ground() },
      { firstStep: 2, svg: BASE.body() },
      { firstStep: 3, svg: BASE.wheels() },
      { firstStep: 4, svg: BASE.window() + "\n" + BASE.headlight() + "\n" + BASE.taillight() },
    ],
  },
  {
    id: 2,
    elements: [
      { firstStep: 1, svg: BASE.wheel(150) },
      { firstStep: 2, svg: BASE.wheel(150) + "\n" + BASE.wheel(350) },
      { firstStep: 3, svg: BASE.wheel(150) + "\n" + BASE.wheel(350) + "\n" + circle(150, 278, 8, DARK) + "\n" + circle(350, 278, 8, DARK) },
      { firstStep: 4, svg: BASE.wheel(150) + "\n" + BASE.wheel(350) + "\n" + circle(150, 278, 8, DARK) + "\n" + circle(350, 278, 8, DARK) + "\n" + line(80, 320, 420, 320, 5, GRAY) + "\n" + label("两个轮子一样大", 250, 60) },
    ],
  },
  {
    id: 3,
    elements: [
      { firstStep: 1, svg: rect(90, 170, 320, 74, CREAM, 16) },
      { firstStep: 2, svg: rect(90, 170, 320, 74, CREAM, 16) + "\n" + path("M300 170 L410 170 Q420 170 420 186 L420 244 L300 244 Z", SKY) },
      { firstStep: 3, svg: BASE.body() + "\n" + line(80, 320, 420, 320, 5, GRAY) },
      { firstStep: 4, svg: BASE.body() + "\n" + line(80, 320, 420, 320, 5, GRAY) + "\n" + line(110, 244, 390, 244, 5) + "\n" + label("圆润的车身角", 250, 60) },
    ],
  },
  {
    id: 4,
    elements: [
      { firstStep: 1, svg: BASE.wheels() },
      { firstStep: 2, svg: BASE.wheels() + "\n" + BASE.body() },
      { firstStep: 3, svg: BASE.wheels() + "\n" + BASE.body() + "\n" + BASE.window() },
      { firstStep: 4, svg: BASE.wheels() + "\n" + BASE.body() + "\n" + BASE.window() + "\n" + BASE.headlight() + "\n" + BASE.doorLine() },
      { firstStep: 5, svg: BASE.wheels() + "\n" + BASE.body() + "\n" + BASE.window() + "\n" + BASE.headlight() + "\n" + BASE.doorLine() + "\n" + BASE.taillight() + "\n" + BASE.ground() + "\n" + label("第一辆小车完成！", 250, 60) },
    ],
  },
  {
    id: 5,
    elements: [
      { firstStep: 1, svg: BASE.ground() + "\n" + BASE.body() },
      { firstStep: 2, svg: BASE.ground() + "\n" + BASE.body() + "\n" + path("M420 244 L420 222 Q418 214 410 212 L392 212 Q384 218 388 228 L392 244 Z", CREAM) },
      { firstStep: 3, svg: BASE.ground() + "\n" + BASE.body() + "\n" + path("M420 244 L420 222 Q418 214 410 212 L392 212 Q384 218 388 228 L392 244 Z", CREAM) + "\n" + line(395, 168, 395, 206, 4) },
      { firstStep: 4, svg: BASE.ground() + "\n" + BASE.body() + "\n" + path("M420 244 L420 222 Q418 214 410 212 L392 212 Q384 218 388 228 L392 244 Z", CREAM) + "\n" + line(395, 168, 395, 206, 4) + "\n" + label("封闭前脸 · 没有大格栅", 250, 60) },
    ],
  },
  {
    id: 6,
    elements: [
      { firstStep: 1, svg: BASE.ground() + "\n" + BASE.body() + "\n" + line(368, 196, 412, 196, 6) },
      { firstStep: 2, svg: BASE.ground() + "\n" + BASE.body() + "\n" + path("M368 196 L360 186 M412 196 L420 188", "none", { "stroke-width": 6 }) },
      { firstStep: 3, svg: BASE.ground() + "\n" + BASE.body() + "\n" + path("M368 196 L360 186 M412 196 L420 188", "none", { "stroke-width": 6 }) + "\n" + circle(382, 190, 3, "#FFFFFF") + "\n" + circle(394, 190, 3, "#FFFFFF") + "\n" + circle(406, 190, 3, "#FFFFFF") },
      { firstStep: 4, svg: BASE.ground() + "\n" + BASE.body() + "\n" + path("M368 196 L360 186 M412 196 L420 188", "none", { "stroke-width": 6 }) + "\n" + circle(382, 190, 3, "#FFFFFF") + "\n" + circle(394, 190, 3, "#FFFFFF") + "\n" + circle(406, 190, 3, "#FFFFFF") + "\n" + label("贯穿式大灯", 250, 60) },
    ],
  },
  {
    id: 7,
    elements: [
      { firstStep: 1, svg: BASE.ground() + "\n" + BASE.body() + "\n" + BASE.wheels() },
      { firstStep: 2, svg: BASE.ground() + "\n" + BASE.body() + "\n" + BASE.wheels() + "\n" + BASE.rim() },
      { firstStep: 3, svg: BASE.ground() + "\n" + BASE.body() + "\n" + BASE.wheels() + "\n" + BASE.rim() + "\n" + BASE.spokes() },
      { firstStep: 4, svg: BASE.ground() + "\n" + BASE.body() + "\n" + BASE.wheels() + "\n" + BASE.rim() + "\n" + BASE.spokes() + "\n" + BASE.doorLine() },
      { firstStep: 5, svg: BASE.ground() + "\n" + BASE.body() + "\n" + BASE.wheels() + "\n" + BASE.rim() + "\n" + BASE.spokes() + "\n" + BASE.doorLine() + "\n" + BASE.mirror() + "\n" + circle(274, 186, 5, DARK) + "\n" + label("细节让车更精致", 250, 60) },
    ],
  },
  {
    id: 8,
    elements: [
      { firstStep: 1, svg: BASE.ground() + "\n" + BASE.body() + "\n" + BASE.wheels() + "\n" + rect(330, 214, 26, 20, "#FFFFFF", 4) + "\n" + path("M338 230 L344 220 L346 220 L340 230 Z", INK) },
      { firstStep: 2, svg: BASE.ground() + "\n" + BASE.body() + "\n" + BASE.wheels() + "\n" + rect(330, 214, 26, 20, "#FFFFFF", 4) + "\n" + path("M338 230 L344 220 L346 220 L340 230 Z", INK) + "\n" + path("M330 214 Q342 204 356 214", "none", { "stroke-width": 5 }) },
      { firstStep: 3, svg: BASE.ground() + "\n" + BASE.body() + "\n" + BASE.wheels() + "\n" + rect(330, 214, 26, 20, "#FFFFFF", 4) + "\n" + path("M338 230 L344 220 L346 220 L340 230 Z", INK) + "\n" + path("M330 214 Q342 204 356 214", "none", { "stroke-width": 5 }) + "\n" + line(210, 244, 234, 244, 4) },
      { firstStep: 4, svg: BASE.ground() + "\n" + BASE.body() + "\n" + BASE.wheels() + "\n" + rect(330, 214, 26, 20, "#FFFFFF", 4) + "\n" + path("M338 230 L344 220 L346 220 L340 230 Z", INK) + "\n" + path("M330 214 Q342 204 356 214", "none", { "stroke-width": 5 }) + "\n" + line(210, 244, 234, 244, 4) + "\n" + circle(258, 188, 5, DARK) + "\n" + label("充电口", 343, 260) },
    ],
  },
  {
    id: 9,
    elements: [
      { firstStep: 1, svg: line(30, 330, 470, 330, 10, DARK) + "\n" + BASE.wheels() },
      { firstStep: 2, svg: line(30, 330, 470, 330, 10, DARK) + "\n" + BASE.wheels() + "\n" + ellipse(150, 326, 52, 8) + "\n" + ellipse(350, 326, 52, 8) },
      { firstStep: 3, svg: line(30, 330, 470, 330, 10, DARK) + "\n" + BASE.wheels() + "\n" + ellipse(150, 326, 52, 8) + "\n" + ellipse(350, 326, 52, 8) + "\n" + line(40, 244, 74, 244, 5, GRAY) + "\n" + line(34, 262, 68, 262, 5, GRAY) + "\n" + line(40, 280, 74, 280, 5, GRAY) },
      { firstStep: 4, svg: line(30, 330, 470, 330, 10, DARK) + "\n" + BASE.wheels() + "\n" + ellipse(150, 326, 52, 8) + "\n" + ellipse(350, 326, 52, 8) + "\n" + line(40, 244, 74, 244, 5, GRAY) + "\n" + line(34, 262, 68, 262, 5, GRAY) + "\n" + line(40, 280, 74, 280, 5, GRAY) + "\n" + BASE.body() + "\n" + label("有速度感了吗？", 250, 60) },
    ],
  },
  {
    id: 10,
    elements: [
      { firstStep: 1, svg: BASE.ground() + "\n" + BASE.wheels() + "\n" + BASE.body(SKY) },
      { firstStep: 2, svg: BASE.ground() + "\n" + BASE.wheels() + "\n" + `<defs><linearGradient id="gradBody" x1="0" y1="0" x2="0" y2="1"><stop offset="0%" stop-color="#7FBCFF"/><stop offset="100%" stop-color="#2F6FB0"/></linearGradient></defs>` + "\n" + BASE.body("url(#gradBody)") },
      { firstStep: 3, svg: BASE.ground() + "\n" + BASE.wheels() + "\n" + `<defs><linearGradient id="gradBody" x1="0" y1="0" x2="0" y2="1"><stop offset="0%" stop-color="#7FBCFF"/><stop offset="100%" stop-color="#2F6FB0"/></linearGradient></defs>` + "\n" + BASE.body("url(#gradBody)") + "\n" + path("M118 158 Q200 138 330 162", "none", { stroke: "#FFFFFF", "stroke-width": 6 }) },
      { firstStep: 4, svg: BASE.ground() + "\n" + BASE.wheels() + "\n" + `<defs><linearGradient id="gradBody" x1="0" y1="0" x2="0" y2="1"><stop offset="0%" stop-color="#7FBCFF"/><stop offset="100%" stop-color="#2F6FB0"/></linearGradient></defs>` + "\n" + BASE.body("url(#gradBody)") + "\n" + path("M118 158 Q200 138 330 162", "none", { stroke: "#FFFFFF", "stroke-width": 6 }) + "\n" + rect(80, 244, 340, 16, "#2F6FB0", 8) + "\n" + label("渐变 + 高光 + 阴影", 250, 60) },
    ],
  },
  {
    id: 11,
    elements: [
      { firstStep: 1, svg: path("M130 180 L370 180 Q390 180 390 200 L390 280 L110 280 L110 200 Q110 180 130 180 Z", CREAM) + "\n" + line(60, 300, 440, 300, 8, DARK) },
      { firstStep: 2, svg: path("M130 180 L370 180 Q390 180 390 200 L390 280 L110 280 L110 200 Q110 180 130 180 Z", CREAM) + "\n" + line(60, 300, 440, 300, 8, DARK) + "\n" + circle(150, 215, 22, YELLOW) + "\n" + circle(350, 215, 22, YELLOW) },
      { firstStep: 3, svg: path("M130 180 L370 180 Q390 180 390 200 L390 280 L110 280 L110 200 Q110 180 130 180 Z", CREAM) + "\n" + line(60, 300, 440, 300, 8, DARK) + "\n" + circle(150, 215, 22, YELLOW) + "\n" + circle(350, 215, 22, YELLOW) + "\n" + line(130, 232, 370, 232, 8, YELLOW) + "\n" + rect(130, 246, 240, 26, DARK, 10) },
      { firstStep: 4, svg: path("M150 120 L350 120 Q380 120 380 145 L380 220 L120 220 L120 145 Q120 120 150 120 Z", CREAM) + "\n" + line(60, 240, 440, 240, 8, DARK) + "\n" + line(130, 172, 370, 172, 8, YELLOW) },
      { firstStep: 5, svg: path("M150 120 L350 120 Q380 120 380 145 L380 220 L120 220 L120 145 Q120 120 150 120 Z", CREAM) + "\n" + line(60, 240, 440, 240, 8, DARK) + "\n" + line(130, 172, 370, 172, 8, YELLOW) + "\n" + rect(210, 186, 80, 26, "#FFFFFF", 4) + "\n" + label("前后都要会画", 250, 60) },
    ],
  },
  {
    id: 12,
    elements: [
      { firstStep: 1, svg: path("M70 244 L110 150 L360 150 L430 244 Z", SKY) + "\n" + line(40, 320, 460, 320, 10, DARK) },
      { firstStep: 2, svg: path("M70 244 L110 150 L360 150 L430 244 Z", SKY) + "\n" + line(40, 320, 460, 320, 10, DARK) + "\n" + path("M180 160 L300 160 L330 200 L180 200 Z", GLASS) },
      { firstStep: 3, svg: path("M70 244 L110 150 L360 150 L430 244 Z", SKY) + "\n" + line(40, 320, 460, 320, 10, DARK) + "\n" + path("M180 160 L300 160 L330 200 L180 200 Z", GLASS) + "\n" + BASE.wheel(150) + "\n" + BASE.wheel(370) },
      { firstStep: 4, svg: path("M70 244 L110 150 L360 150 L430 244 Z", SKY) + "\n" + line(40, 320, 460, 320, 10, DARK) + "\n" + path("M180 160 L300 160 L330 200 L180 200 Z", GLASS) + "\n" + BASE.wheel(150) + "\n" + BASE.wheel(370) + "\n" + line(120, 186, 400, 186, 8, YELLOW) + "\n" + path("M360 150 L420 128 L430 244 L370 244 Z", ORANGE) },
      { firstStep: 5, svg: path("M70 244 L110 150 L360 150 L430 244 Z", SKY) + "\n" + line(40, 320, 460, 320, 10, DARK) + "\n" + path("M180 160 L300 160 L330 200 L180 200 Z", GLASS) + "\n" + BASE.wheel(150) + "\n" + BASE.wheel(370) + "\n" + line(120, 186, 400, 186, 8, YELLOW) + "\n" + path("M360 150 L420 128 L430 244 L370 244 Z", ORANGE) + "\n" + label("我的概念车", 250, 60) },
    ],
  },
];

mkdirSync(OUT_DIR, { recursive: true });
let count = 0;
for (const drawing of DRAWINGS) {
  const maxStep = Math.max(...drawing.elements.map((e) => e.firstStep));
  for (let step = 1; step <= maxStep; step++) {
    const body = drawing.elements.filter((e) => e.firstStep <= step).map((e) => e.svg).join("\n");
    const name = `lesson-${String(drawing.id).padStart(2, "0")}-step-${String(step).padStart(2, "0")}.svg`;
    writeFileSync(join(OUT_DIR, name), svgDoc(body), "utf8");
    count++;
  }
}
console.log(`已生成 ${count} 张插画到 ${OUT_DIR}`);
```

- [ ] **Step 4: 运行测试，确认通过**

Run: `npm test`
Expected: PASS（52 个文件全部生成、均为合法 SVG、重复运行幂等）。

- [ ] **Step 5: 首页 hero 增加汽车插画**

修改 `index.html`，在 `<p>跟着步骤…</p>` 之后、按钮之前插入：

```html
<img class="hero-car" src="assets/illustrations/lesson-04-step-05.svg" alt="一辆手绘小汽车">
```

（`.hero-car` 样式已在 Task 1 的 `styles.css` 中定义。）

- [ ] **Step 6: 浏览器抽查 3 张插画**

浏览器打开 `http://localhost:8000/assets/illustrations/lesson-04-step-05.svg`、`lesson-12-step-05.svg`、`lesson-11-step-01.svg`，确认图案可见、无报错。若某张形状明显走形（例如线条穿出画布），调整 `scripts/generate_car_svgs.js` 中的坐标后重新运行生成脚本并再次抽查。

- [ ] **Step 7: 提交**

```bash
git add scripts/generate_car_svgs.js tests/illustrations.test.js assets/illustrations index.html
git commit -m "feat: 生成 52 张步骤插画"
```

---

## Task 5: 页面渲染与打卡交互 app.js

**Files:**
- Create: `js/app.js`
- Test: `tests/render.test.js`

**Interfaces:**
- Consumes: `SITE_DATA`（Task 2）、`createProgressStore`（Task 3）、三个页面的容器 id（Task 1）。
- Produces: 四个导出函数（签名见 File Structure），页面加载时由 `initApp()` 自动渲染并绑定"我画好啦"按钮。

- [ ] **Step 1: 写失败测试**

创建 `tests/render.test.js`：

```js
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
  assert.ok(html.includes("认识汽车的结构"));
  assert.ok(html.includes("1/4"));
});

test("课程页包含目标、全部步骤插图与口诀", () => {
  const lesson = SITE_DATA.units[0].lessons[0];
  const next = SITE_DATA.units[0].lessons[1];
  const html = lessonPageHTML(lesson, null, next, false);
  assert.ok(html.includes(lesson.goal));
  for (const s of lesson.steps) {
    assert.ok(html.includes(s.caption), `缺少步骤：${s.caption}`);
    assert.ok(html.includes(s.art), `缺少插图：${s.art}`);
  }
  assert.ok(html.includes("我画好啦"));
  assert.ok(html.includes("lesson.html?id=2"));
});

test("已完成课程显示完成态按钮", () => {
  const lesson = SITE_DATA.units[0].lessons[0];
  const html = lessonPageHTML(lesson, null, null, true);
  assert.ok(html.includes("disabled"));
  assert.ok(html.includes("已完成"));
});
```

- [ ] **Step 2: 运行测试，确认失败**

Run: `npm test`
Expected: FAIL —— 找不到 `js/app.js`。

- [ ] **Step 3: 创建 `js/app.js`（原样写入）**

```js
// 页面渲染与交互：小吴手绘汽车
import { SITE_DATA } from "./data.js";
import { createProgressStore } from "./progress.js";

export function lessonCardHTML(lesson, isComplete) {
  const badge = isComplete
    ? '<span class="badge badge-done">✓ 已完成</span>'
    : '<span class="badge badge-todo">未完成</span>';
  return `
  <a class="lesson-card" href="lesson.html?id=${lesson.id}">
    <div class="lesson-card-head">
      <span class="lesson-num">第 ${lesson.id} 课</span>
      ${badge}
    </div>
    <h3>${lesson.title}</h3>
    <p>${lesson.goal}</p>
  </a>`;
}

export function unitSectionHTML(unit, progress) {
  const p = progress.getUnitProgress(unit);
  const badge = p.complete
    ? '<span class="badge badge-done">🏆 单元完成！</span>'
    : `<span class="badge badge-todo">${p.done}/${p.total}</span>`;
  const cards = unit.lessons.map((l) => lessonCardHTML(l, progress.isComplete(l.id))).join("");
  return `
  <section class="unit">
    <div class="unit-head">
      <h2>${unit.title}</h2>
      ${badge}
    </div>
    <div class="lesson-grid">${cards}</div>
  </section>`;
}

export function lessonPageHTML(lesson, prev, next, isComplete) {
  const stepsHTML = lesson.steps
    .map(
      (s, i) => `
    <li class="step">
      <span class="step-num">第 ${i + 1} 步</span>
      <figure class="step-figure">
        <img src="${s.art}" alt="第 ${i + 1} 步示范：${s.caption}" loading="lazy">
        <figcaption>${s.caption}</figcaption>
      </figure>
    </li>`
    )
    .join("");
  const tipsHTML = `<ul class="tips">${lesson.tips.map((t) => `<li>${t}</li>`).join("")}</ul>`;
  const navHTML = [
    prev ? `<a class="btn" href="lesson.html?id=${prev.id}">← 上一课</a>` : '<span></span>',
    `<a class="btn" href="lessons.html">课程列表</a>`,
    next ? `<a class="btn" href="lesson.html?id=${next.id}">下一课 →</a>` : '<span></span>',
  ].join("");
  const actionBtn = isComplete
    ? '<button class="btn btn-done" data-action="complete" disabled>✓ 我画好啦！</button>'
    : '<button class="btn btn-primary" data-action="complete">我画好啦！</button>';
  return `
  <article class="lesson-page">
    <header class="lesson-header">
      <h1>第 ${lesson.id} 课 · ${lesson.title}</h1>
      <p class="goal">🎯 ${lesson.goal}</p>
    </header>
    <ol class="steps">${stepsHTML}</ol>
    ${tipsHTML}
    <div class="lesson-actions">${actionBtn}</div>
    <nav class="lesson-nav">${navHTML}</nav>
  </article>`;
}

export function initApp() {
  if (typeof document === "undefined") return;
  const page = document.body.dataset.page;
  const progress = createProgressStore(window.localStorage);

  if (page === "home") {
    const map = document.getElementById("unit-map");
    if (map) map.innerHTML = SITE_DATA.units.map((u) => unitSectionHTML(u, progress)).join("");
  } else if (page === "lessons") {
    const list = document.getElementById("lesson-list");
    if (list) list.innerHTML = SITE_DATA.units.map((u) => unitSectionHTML(u, progress)).join("");
  } else if (page === "lesson") {
    const id = Number(new URLSearchParams(window.location.search).get("id")) || 1;
    const flat = SITE_DATA.units.flatMap((u) => u.lessons);
    const index = flat.findIndex((l) => l.id === id);
    if (index === -1) {
      window.location.href = "lessons.html";
      return;
    }
    const lesson = flat[index];
    const prev = index > 0 ? flat[index - 1] : null;
    const next = index < flat.length - 1 ? flat[index + 1] : null;
    const pageEl = document.getElementById("lesson-page");
    const render = (isComplete) => {
      pageEl.innerHTML = lessonPageHTML(lesson, prev, next, isComplete);
    };
    render(progress.isComplete(lesson.id));
    pageEl.querySelector('[data-action="complete"]')?.addEventListener("click", () => {
      progress.markComplete(lesson.id);
      render(true);
    });
  }
}

if (typeof document !== "undefined") {
  document.addEventListener("DOMContentLoaded", initApp);
}
```

- [ ] **Step 4: 运行测试，确认通过**

Run: `npm test`
Expected: PASS。

- [ ] **Step 5: 浏览器联调**

浏览器打开：
- `http://localhost:8000/` —— 首页出现 3 个单元区块、每区 4 张课程卡片，进度显示 0/4；
- `http://localhost:8000/lessons.html` —— 12 张卡片分组显示；
- `http://localhost:8000/lesson.html?id=1` —— 目标、4 步插图与口诀、贴士、上一课/下一课导航、打卡按钮齐全；
- 点击"我画好啦！"，按钮变为"✓ 我画好啦！"且禁用；刷新页面后状态保持；
- `lesson.html?id=99` 跳回课程列表页。

- [ ] **Step 6: 提交**

```bash
git add js/app.js tests/render.test.js
git commit -m "feat: 页面渲染与打卡交互"
```

---

## Task 6: 联调验收与细节打磨

**Files:**
- Modify: `css/styles.css`、`scripts/generate_car_svgs.js`、`js/app.js`（仅当验收发现问题时按需修改）

**Interfaces:**
- Consumes: 全部已有模块。
- Produces: 验收通过的完整网站。

- [ ] **Step 1: 全量测试**

Run: `npm test`
Expected: 全部 PASS。

- [ ] **Step 2: 完成进度与徽章链路验收（浏览器）**

浏览器（或浏览器自动化）依次：
1. 打开 `lesson.html?id=1` 至 `lesson.html?id=4`，逐个点击"我画好啦！"；
2. 返回首页，确认单元一显示"🏆 单元完成！"、总进度 4/12；
3. 刷新页面，确认进度仍在；
4. 清除浏览器 localStorage（DevTools → Application → Clear site data），刷新后确认进度归零（供家长重置用）。

- [ ] **Step 3: 响应式验收**

浏览器设备模拟分别用 375px（手机）与 1024px（平板）宽度打开首页与课程页，确认：单列/双列切换正常、按钮与卡片无重叠、图片自适应。

- [ ] **Step 4: 链接与错误验收**

逐一点击页面上所有链接（首页 CTA、导航、卡片、上一课/下一课），确认无 404；浏览器控制台无报错。

- [ ] **Step 5: 插画观感终检**

浏览全部 52 张插画（课程页翻页即可），确认无不完整/穿帮图形；如有问题，按 Task 4 Step 6 的方式修正后重新生成。

- [ ] **Step 6: 提交**

如有修改：

```bash
git add -A
git commit -m "fix: 联调验收修正"
```

如无修改，本步骤跳过（不产生空提交）。

---

## Task 7: 部署到 GitHub Pages

**Files:**
- Modify: `README.md`（记录最终线上地址）

**Interfaces:**
- Consumes: 验收通过的站点（Task 6 产出）。
- Produces: 线上可访问的网址，无需注册即可打开。

> 注意：本任务需要网络与 GitHub 授权，所有 `gh` / 网络命令需 `sandbox_permissions: require_escalated`。

- [ ] **Step 1: 检查 GitHub CLI 登录状态**

Run: `gh auth status`
如果显示已登录，继续；如果未登录，**暂停并请用户提供 GitHub 账号**：请用户执行 `gh auth login` 完成授权后再继续（此步需要用户配合，不属于可自行绕过的阻塞）。

- [ ] **Step 2: 创建公开仓库并推送**

Run: `gh repo create xiaowu-hand-drawn-cars --public --source=. --remote=origin --push`
Expected: 仓库创建成功、当前分支 `master` 推送完成。

- [ ] **Step 3: 启用 GitHub Pages**

Run: `gh api -X POST repos/{owner}/xiaowu-hand-drawn-cars/pages -f "source[branch]=master" -f "source[path]=/"`
（`{owner}` 替换为实际 GitHub 用户名；若提示已存在 Pages 配置，用 `gh api repos/{owner}/xiaowu-hand-drawn-cars/pages -X PUT -f "source[branch]=master" -f "source[path]=/"` 更新。）

- [ ] **Step 4: 等待发布并验证**

Run（等待 60~120 秒后）: `curl.exe -s -o NUL -w "%{http_code}" https://{owner}.github.io/xiaowu-hand-drawn-cars/`
Expected: `200`。

- [ ] **Step 5: 线上验收**

浏览器打开线上网址，执行 Task 6 的 Step 2~4 抽样验收（打卡、刷新、导航、响应式），确认线上与本地一致。

- [ ] **Step 6: 更新 README 并提交**

在 `README.md` 顶部"## 部署"节下添加：

```markdown
## 线上地址

https://{owner}.github.io/xiaowu-hand-drawn-cars/
```

```bash
git add README.md
git commit -m "docs: 记录线上地址"
git push
```

- [ ] **Step 7: 向用户交付**

最终交付信息：线上网址、本地运行方式（`npm start`）、测试方式（`npm test`）、课程内容概览（3 单元 12 课）、以及"如何重置进度"（浏览器清除站点数据）。

---

## Self-Review 记录

- **Spec coverage:** 设计文档 6 节页面结构 → Task 1（骨架）+ Task 5（渲染）；12 节课表 → Task 2（数据）+ Task 4（插画）；localStorage 进度与徽章 → Task 3 + Task 5；视觉规范 → Task 1 样式 + Task 4 插画配色；GitHub Pages 部署 → Task 7；测试与验证 → 每任务测试 + Task 6 验收。无遗漏。
- **Placeholder scan:** 无 TBD/TODO；所有代码块为可直接落地的完整内容；Task 7 的 `{owner}` 是部署时需用户提供的外部信息，非占位符。
- **Type consistency:** `SITE_DATA` / `createProgressStore` / `lessonCardHTML` / `unitSectionHTML` / `lessonPageHTML` / `initApp` 的签名在 File Structure、各任务 Interfaces 与测试代码中一致；localStorage key 在 progress.js 与测试中统一为 `xiaowu.completedLessons`；插画路径与生成脚本文件名规则一致（`lesson-XX-step-YY.svg`）。
