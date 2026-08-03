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
