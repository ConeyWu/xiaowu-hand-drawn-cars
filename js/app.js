// 页面渲染与交互：小吴手绘汽车（重构版）
import { SITE_DATA } from "./data.js";
import { createProgressStore } from "./progress.js";

export function courseCardHTML(course, isComplete) {
  const last = course.steps[course.steps.length - 1];
  const badge = isComplete
    ? '<span class="badge badge-done">✓ 已完成</span>'
    : `<span class="badge badge-todo">${course.steps.length - 1} 步跟画</span>`;
  return `
  <a class="lesson-card course-card" href="course.html?view=${course.id}">
    <div class="lesson-card-head">
      <span class="lesson-num">${course.title}</span>
      ${badge}
    </div>
    <h3>${course.title}</h3>
    <p>${course.goal}</p>
    <img class="course-cover" src="${last.art}" alt="${course.title}成品图" loading="lazy">
  </a>`;
}

export function courseSectionHTML(courses, progress) {
  return courses.map((c) => courseCardHTML(c, progress.isComplete(c.id))).join("");
}

export function popularCardHTML(car) {
  const side = car.views.find((v) => v.name === "侧视图") || car.views[0];
  return `
  <a class="lesson-card popular-card" href="popular.html#${car.id}">
    <div class="lesson-card-head"><span class="lesson-num">流行车辆</span></div>
    <h3>${car.name}</h3>
    <p>${car.note}</p>
    <img class="course-cover" src="${side.art}" alt="${car.name}侧视图" loading="lazy">
  </a>`;
}

export function popularSectionHTML(popular) {
  return popular.map((c) => popularCardHTML(c)).join("");
}

export function coursePageHTML(course, prev, next, isComplete) {
  const stepsHTML = course.steps
    .map(
      (s, i) => `
    <li class="step">
      <span class="step-num">${i === course.steps.length - 1 ? "成品图" : `第 ${i + 1} 步`}</span>
      <figure class="step-figure">
        <img src="${s.art}" alt="${s.caption}" loading="lazy">
        <figcaption>${s.caption}</figcaption>
      </figure>
    </li>`
    )
    .join("");
  const tipsHTML = `<ul class="tips">${course.tips.map((t) => `<li>${t}</li>`).join("")}</ul>`;
  const navHTML = [
    prev ? `<a class="btn" href="course.html?view=${prev.id}">← 上一课</a>` : '<span></span>',
    `<a class="btn" href="lessons.html">课程列表</a>`,
    next ? `<a class="btn" href="course.html?view=${next.id}">下一课 →</a>` : '<span></span>',
  ].join("");
  const actionBtn = isComplete
    ? '<button class="btn btn-done" data-action="complete" disabled>✓ 已完成！</button>'
    : '<button class="btn btn-primary" data-action="complete">完成本节</button>';
  return `
  <article class="lesson-page">
    <header class="lesson-header">
      <h1>${course.title}课程</h1>
      <p class="goal">🎯 ${course.goal}</p>
    </header>
    <ol class="steps">${stepsHTML}</ol>
    ${tipsHTML}
    <div class="lesson-actions">${actionBtn}</div>
    <nav class="lesson-nav">${navHTML}</nav>
  </article>`;
}

export function popularPageHTML(popular) {
  return popular
    .map(
      (car) => `
    <section class="unit" id="${car.id}">
      <div class="unit-head"><h2>${car.name}</h2></div>
      <p class="section-note">${car.note}</p>
      <div class="view-grid">
        ${car.views
          .map(
            (v) => `
        <figure class="view-card" data-view="${v.art}" data-name="${car.name} · ${v.name}">
          <img src="${v.art}" alt="${car.name}${v.name}" loading="lazy">
          <figcaption>${v.name} · 点击看大图</figcaption>
        </figure>`
          )
          .join("")}
      </div>
    </section>`
    )
    .join("");
}

function openLightbox(src, name) {
  let lb = document.getElementById("xiaowu-lightbox");
  if (!lb) {
    lb = document.createElement("div");
    lb.id = "xiaowu-lightbox";
    lb.className = "lightbox";
    lb.innerHTML = '<img alt="大图预览"><span class="lightbox-close">×</span>';
    lb.addEventListener("click", () => { lb.classList.remove("open"); });
    document.body.appendChild(lb);
  }
  const img = lb.querySelector("img");
  img.src = src;
  img.alt = name || "大图";
  lb.classList.add("open");
}
export function initApp() {
  if (typeof document === "undefined") return;
  const page = document.body.dataset.page;
  const progress = createProgressStore(window.localStorage);

  if (page === "home") {
    const courses = document.getElementById("course-grid");
    if (courses) courses.innerHTML = courseSectionHTML(SITE_DATA.courses, progress);
    const popular = document.getElementById("popular-grid");
    if (popular) popular.innerHTML = popularSectionHTML(SITE_DATA.popular);
  } else if (page === "lessons") {
    const list = document.getElementById("course-list");
    if (list) list.innerHTML = courseSectionHTML(SITE_DATA.courses, progress);
  } else if (page === "course") {
    const view = new URLSearchParams(window.location.search).get("view") || "front";
    const index = SITE_DATA.courses.findIndex((c) => c.id === view);
    if (index === -1) {
      window.location.href = "lessons.html";
      return;
    }
    const course = SITE_DATA.courses[index];
    const prev = index > 0 ? SITE_DATA.courses[index - 1] : null;
    const next = index < SITE_DATA.courses.length - 1 ? SITE_DATA.courses[index + 1] : null;
    const pageEl = document.getElementById("course-page");
    const render = (isComplete) => {
      pageEl.innerHTML = coursePageHTML(course, prev, next, isComplete);
    };
    render(progress.isComplete(course.id));
    pageEl.querySelector('[data-action="complete"]')?.addEventListener("click", () => {
      progress.markComplete(course.id);
      render(true);
    });
  } else if (page === "popular") {
    const list = document.getElementById("popular-list");
    if (list) {
      list.innerHTML = popularPageHTML(SITE_DATA.popular);
      list.addEventListener("click", (e) => {
        const fig = e.target.closest("[data-view]");
        if (fig) openLightbox(fig.dataset.view, fig.dataset.name);
      });
    }
  }
}

if (typeof document !== "undefined") {
  document.addEventListener("DOMContentLoaded", initApp);
}