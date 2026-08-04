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
  const refHTML = `
  <figure class="lesson-ref">
    <img src="assets/reference/reference-drawing.jpg" alt="专业手绘汽车范例" loading="lazy">
    <figcaption>专业手绘范例 · 画之前先观察它的比例和线条</figcaption>
  </figure>`;
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
    ? '<button class="btn btn-done" data-action="complete" disabled>✓ 已完成！</button>'
    : '<button class="btn btn-primary" data-action="complete">完成本节</button>';
  return `
  <article class="lesson-page">
    ${refHTML}
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
