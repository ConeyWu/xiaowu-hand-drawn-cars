#!/usr/bin/env node
// 生成 52 张课程步骤插画（SVG）— 以真实车型（紧凑型电动轿车/掀背车）轮廓为底稿的速写
// 底稿来自真实车型侧视几何（车长≈7 轮径、车高≈2.2 轮径、轮拱与车窗按实车比例）
import { mkdirSync, writeFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const ROOT = join(dirname(fileURLToPath(import.meta.url)), "..");
const OUT_DIR = join(ROOT, "assets", "illustrations");

const INK = "#3A3C42";
const INK_SOFT = "#6C707A";
const PAPER = "#F1E9DB";

const DEFS = `<defs>
<linearGradient id="gBody" x1="0" y1="0" x2="0" y2="1"><stop offset="0%" stop-color="#FBF9F3"/><stop offset="18%" stop-color="#E9E4D8"/><stop offset="55%" stop-color="#C9C2B2"/><stop offset="100%" stop-color="#9C9484"/></linearGradient>
<linearGradient id="gGlass" x1="0" y1="0" x2="0" y2="1"><stop offset="0%" stop-color="#55585F"/><stop offset="100%" stop-color="#7B7F88"/></linearGradient>
<radialGradient id="gTire" cx="0.5" cy="0.5" r="0.5"><stop offset="0%" stop-color="#4A4E55"/><stop offset="75%" stop-color="#2D3036"/><stop offset="100%" stop-color="#202227"/></radialGradient>
<radialGradient id="gRim" cx="0.5" cy="0.5" r="0.5"><stop offset="0%" stop-color="#F3F2EC"/><stop offset="70%" stop-color="#C6C1B4"/><stop offset="100%" stop-color="#A39C8D"/></radialGradient>
<radialGradient id="gGround" cx="0.5" cy="0.5" r="0.5"><stop offset="0%" stop-color="#8A8478" stop-opacity="0.34"/><stop offset="100%" stop-color="#8A8478" stop-opacity="0"/></radialGradient>
</defs>`;

function stroke(w, color = INK) {
  return `stroke="${color}" stroke-width="${w}" stroke-linecap="round" stroke-linejoin="round"`;
}
function path(d, w = 2, fill = "none", extra = "") {
  return `<path d="${d}" ${stroke(w)} fill="${fill}" ${extra}/>`;
}
function strokePath(d, w, color, fill = "none") {
  return `<path d="${d}" stroke="${color}" stroke-width="${w}" stroke-linecap="round" stroke-linejoin="round" fill="${fill}"/>`;
}
function rough(d, w = 1.7) {
  return (
    `<path d="${d}" ${stroke(w, INK)} fill="none" opacity="0.9"/>` +
    "\n" + `<path d="${d}" ${stroke(Math.max(1.0, w - 0.5), INK)} fill="none" opacity="0.45" transform="translate(1.2 0.9)"/>` +
    "\n" + `<path d="${d}" ${stroke(Math.max(0.8, w - 0.8), INK)} fill="none" stroke-dasharray="26 16 48 20 18 10" opacity="0.5"/>`
  );
}
function line(x1, y1, x2, y2, w = 1.5, color = INK_SOFT) {
  return `<line x1="${x1}" y1="${y1}" x2="${x2}" y2="${y2}" ${stroke(w, color)}/>`;
}
function circle(cx, cy, r, w = 1.5, fill = "none", extra = "") {
  return `<circle cx="${cx}" cy="${cy}" r="${r}" ${stroke(w)} fill="${fill}" ${extra}/>`;
}
function label(text, x, y, size = 20) {
  return `<text x="${x}" y="${y}" text-anchor="middle" font-size="${size}" font-family="'Microsoft YaHei', sans-serif" font-weight="600" fill="${INK}">${text}</text>`;
}
function paper() {
  return `<rect x="0" y="0" width="500" height="360" fill="${PAPER}"/>`;
}
function svgDoc(body) {
  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 500 360" role="img">\n${DEFS}\n${body}\n</svg>\n`;
}
function rnd(i) {
  const x = Math.sin(i * 127.1 + 311.7) * 43758.5453;
  return x - Math.floor(x);
}
function hatch(x, y, n, len, gap, angleDeg = 45) {
  const rad = (angleDeg * Math.PI) / 180;
  const dx = Math.cos(rad);
  const dy = Math.sin(rad);
  const px = -Math.sin(rad);
  const py = Math.cos(rad);
  const out = [];
  for (let i = 0; i < n; i++) {
    const jx = x + px * i * gap + (rnd(i) - 0.5) * 1.6;
    const jy = y + py * i * gap + (rnd(i + 50) - 0.5) * 1.6;
    out.push(`<line x1="${(jx).toFixed(1)}" y1="${(jy).toFixed(1)}" x2="${(jx + dx * len).toFixed(1)}" y2="${(jy + dy * len).toFixed(1)}" ${stroke(1.1, INK_SOFT)}/>`);
  }
  return out.join("\n");
}

// ============ 真实车型底稿（紧凑型电动轿车侧视，坐标已换算到 500x360 画布） ============
const WHEEL_R = 29;
const WHEEL_CY = 300;
const GROUND_Y = 329;
const REAR_CX = 109;
const FRONT_CX = 412;
// 车身轮廓（含前后轮拱），源自真实车型侧视几何
const BODY_D =
  "M37.2 292.3 C37.2 292.3 58.8 203.0 109.2 188.6 C138.0 180.0 195.6 174.2 253.2 171.3 C310.8 174.2 354.0 180.0 382.8 194.4 C411.6 208.7 433.2 231.8 447.6 256.3 L462.0 277.9 L469.2 285.1 L469.2 299.5 L454.8 299.5 C454.8 275.0 434.6 256.3 411.6 256.3 C388.6 256.3 368.4 275.0 368.4 299.5 L152.4 299.5 C152.4 275.0 132.2 256.3 109.2 256.3 C86.2 256.3 66.0 275.0 66.0 299.5 L30.0 299.5 L30.0 292.3 Z";
// 车窗（真实车型玻璃比例）
const GLASS_D =
  "M130.8 198.7 C159.6 188.6 210.0 181.4 267.6 180.0 C318.0 181.4 346.8 188.6 368.4 198.7 L356.9 241.9 L120.7 241.9 Z";

function spokes(cx, cy, r = 15, w = 1.5) {
  const arms = [0, 72, 144, 216, 288];
  return arms
    .map((a) => {
      const rad = (a * Math.PI) / 180;
      return `<line x1="${cx}" y1="${cy}" x2="${(cx + r * Math.cos(rad)).toFixed(1)}" y2="${(cy + r * Math.sin(rad)).toFixed(1)}" stroke="#5B5E66" stroke-width="${w}" stroke-linecap="round"/>`;
    })
    .join("");
}

const BASE = {
  ground: () => line(24, GROUND_Y, 476, GROUND_Y, 1.7),
  groundShadow: () => `<ellipse cx="250" cy="${GROUND_Y + 7}" rx="230" ry="13" fill="url(#gGround)"/>`,
  wheelCircle: (cx) =>
    `<circle cx="${cx}" cy="${WHEEL_CY}" r="${WHEEL_R}" stroke="#5F646E" stroke-width="1.5" fill="none"/>` +
    "\n" + line(cx - WHEEL_R, WHEEL_CY, cx + WHEEL_R, WHEEL_CY, 0.9, "#8B909B") +
    "\n" + line(cx, WHEEL_CY - WHEEL_R, cx, WHEEL_CY + WHEEL_R, 0.9, "#8B909B") +
    "\n" + `<circle cx="${cx}" cy="${WHEEL_CY}" r="2.2" fill="#5F646E"/>`,
  tire: (cx) =>
    `<circle cx="${cx}" cy="${WHEEL_CY}" r="${WHEEL_R}" fill="url(#gTire)"/>` +
    "\n" + `<path d="M${cx - 27} ${WHEEL_CY - 11} Q${cx} ${WHEEL_CY - 28} ${cx + 27} ${WHEEL_CY - 11}" stroke="#8B8F98" stroke-width="2.0" fill="none" stroke-linecap="round" opacity="0.8"/>`,
  rim: (cx) => `<circle cx="${cx}" cy="${WHEEL_CY}" r="18" fill="url(#gRim)" stroke="#5B5E66" stroke-width="1.2"/>`,
  disc: (cx) => `<circle cx="${cx}" cy="${WHEEL_CY}" r="11.5" fill="#DDD8CB"/>`,
  hub: (cx) => `<circle cx="${cx}" cy="${WHEEL_CY}" r="3.4" fill="#4A4E56"/>`,
  contactShadow: (cx) => `<ellipse cx="${cx}" cy="${GROUND_Y - 7}" rx="26" ry="4.5" fill="#6E6A61" opacity="0.5"/>`,
  wheel: (cx) =>
    BASE.tire(cx) +
    "\n" + BASE.rim(cx) +
    "\n" + BASE.disc(cx) +
    "\n" + spokes(cx, WHEEL_CY) +
    "\n" + BASE.hub(cx) +
    "\n" + BASE.contactShadow(cx),
  wheels: () => BASE.wheel(REAR_CX) + "\n" + BASE.wheel(FRONT_CX),
  bodyFill: () => `<path d="${BODY_D}" fill="url(#gBody)"/>`,
  bodyRough: () => rough(BODY_D, 1.6),
  glass: () =>
    `<path d="${GLASS_D}" fill="url(#gGlass)" stroke="#4A4D55" stroke-width="1.0"/>` +
    "\n" + `<path d="M150 200 L240 190 L252 236 L138 236 Z" fill="#FBF9F3" opacity="0.2"/>` +
    "\n" + line(253, 181, 253, 241, 1.0, "#3E4148"),
  rocker: () =>
    `<path d="M152 299 L368 299 L368 292 Q260 288 152 292 Z" fill="#8A8478" opacity="0.34"/>` +
    "\n" + hatch(220, 292, 8, 12, 8, 45),
  shoulder: () =>
    strokePath("M66 256 Q250 240 434 256", 1.7, "#6E6A61") +
    "\n" + strokePath("M66 248 Q250 232 434 248", 1.2, "#FBF9F3"),
  doorCut: () => path("M310 246 Q316 270 312 292", 1.0),
  handle: () => line(286, 252, 304, 251, 1.5, "#4A4E56"),
  mirror: () =>
    `<path d="M340 204 Q336 198 344 194 L352 194 Q356 199 352 203 Z" fill="url(#gGlass)" stroke="#4A4D55" stroke-width="1.0"/>`,
  headlight: () =>
    `<path d="M440 266 L466 264 L466 276 L444 278 Z" fill="url(#gGlass)" stroke="#4A4D55" stroke-width="1.0"/>` +
    "\n" + strokePath("M444 270 L460 268", 1.1, "#FBF9F3"),
  taillight: () =>
    `<path d="M34 258 L44 256 L44 268 L32 270 Z" fill="url(#gGlass)" stroke="#4A4D55" stroke-width="1.0"/>`,
  fender: (cx) =>
    `<path d="M${cx - 36} 302 Q${cx} 280 ${cx + 36} 302" stroke="#8B8478" stroke-width="8" fill="none" stroke-linecap="round" opacity="0.26"/>` +
    "\n" + `<path d="M${cx - 36} 302 Q${cx} 280 ${cx + 36} 302" ${stroke(1.4, INK)} fill="none"/>` +
    "\n" + hatch(cx - 30, 296, 6, 10, 7, 60),
  fenders: () => BASE.fender(REAR_CX) + "\n" + BASE.fender(FRONT_CX),
  bumper: () => rough("M30 299 L30 284 Q30 276 42 274 L60 272 L66 282 L66 299 Z", 1.2),
  gesture: () =>
    strokePath("M60 236 Q250 222 460 238", 1.0, "#9A9488") +
    "\n" + strokePath("M458 210 Q470 202 478 196", 0.9, "#9A9488"),
  ghost: () =>
    `<g transform="translate(30 -4) scale(0.88)" opacity="0.2">` +
    `<path d="${BODY_D}" stroke="#6E6A61" stroke-width="1.2" fill="none"/>` +
    `<circle cx="${REAR_CX}" cy="${WHEEL_CY}" r="${WHEEL_R}" stroke="#6E6A61" stroke-width="1.0" fill="none"/>` +
    `<circle cx="${FRONT_CX}" cy="${WHEEL_CY}" r="${WHEEL_R}" stroke="#6E6A61" stroke-width="1.0" fill="none"/>` +
    `</g>`,
  wheelStudy: () =>
    `<g transform="translate(392 24)">` +
    `<circle cx="46" cy="46" r="30" fill="url(#gTire)"/>` +
    `<path d="M20 38 Q46 27 72 38" stroke="#8B8F98" stroke-width="1.8" fill="none" stroke-linecap="round" opacity="0.85"/>` +
    `<circle cx="46" cy="46" r="18" fill="url(#gRim)" stroke="#5B5E66" stroke-width="1.1"/>` +
    `<circle cx="46" cy="46" r="11" fill="#DDD8CB"/>` +
    spokes(46, 46, 14, 1.5) +
    `<circle cx="46" cy="46" r="3.4" fill="#4A4E56"/>` +
    `<path d="M18 62 Q46 70 74 62" stroke="#8A8478" stroke-width="6" fill="none" stroke-linecap="round" opacity="0.3"/>` +
    `</g>`,
};

// 每课：elements 中 firstStep 表示该元素从第几步开始出现
const DRAWINGS = [
  {
    id: 1,
    elements: [
      { firstStep: 1, svg: BASE.ground() + "\n" + BASE.wheelCircle(REAR_CX) + "\n" + BASE.wheelCircle(FRONT_CX) },
      { firstStep: 2, svg: BASE.ground() + "\n" + BASE.wheelCircle(REAR_CX) + "\n" + BASE.wheelCircle(FRONT_CX) + "\n" + BASE.bodyFill() + "\n" + BASE.bodyRough() },
      { firstStep: 3, svg: BASE.ground() + "\n" + BASE.wheel(REAR_CX) + "\n" + BASE.wheel(FRONT_CX) + "\n" + BASE.bodyFill() + "\n" + BASE.bodyRough() + "\n" + BASE.glass() },
      { firstStep: 4, svg: BASE.ground() + "\n" + BASE.groundShadow() + "\n" + BASE.wheel(REAR_CX) + "\n" + BASE.wheel(FRONT_CX) + "\n" + BASE.bodyFill() + "\n" + BASE.bodyRough() + "\n" + BASE.glass() + "\n" + BASE.fenders() + "\n" + BASE.rocker() + "\n" + BASE.shoulder() + "\n" + BASE.headlight() + "\n" + BASE.taillight() + "\n" + BASE.doorCut() + "\n" + BASE.mirror() + "\n" + BASE.gesture() + "\n" + BASE.wheelStudy() },
    ],
  },
  {
    id: 2,
    elements: [
      { firstStep: 1, svg: BASE.wheelCircle(REAR_CX) + "\n" + line(40, GROUND_Y, 264, GROUND_Y, 1.1) },
      { firstStep: 2, svg: BASE.wheelCircle(REAR_CX) + "\n" + BASE.wheelCircle(FRONT_CX) + "\n" + line(40, GROUND_Y, 460, GROUND_Y, 1.1) },
      { firstStep: 3, svg: BASE.wheelCircle(REAR_CX) + "\n" + BASE.wheelCircle(FRONT_CX) + "\n" + circle(REAR_CX, WHEEL_CY, 18, 1.2, "url(#gRim)") + "\n" + circle(FRONT_CX, WHEEL_CY, 18, 1.2, "url(#gRim)") + "\n" + circle(REAR_CX, WHEEL_CY, 3.4, 1.0, INK) + "\n" + circle(FRONT_CX, WHEEL_CY, 3.4, 1.0, INK) + "\n" + line(40, GROUND_Y, 460, GROUND_Y, 1.1) },
      { firstStep: 4, svg: BASE.wheel(REAR_CX) + "\n" + BASE.wheel(FRONT_CX) + "\n" + BASE.ground() + "\n" + label("两个轮子一样大", 250, 60) },
    ],
  },
  {
    id: 3,
    elements: [
      { firstStep: 1, svg: path("M58 250 L450 250 L450 292 L58 299 Z", 1.4) + "\n" + path("M130 200 L250 176 L250 250 L130 250 Z", 1.4) },
      { firstStep: 2, svg: BASE.bodyFill() + "\n" + BASE.bodyRough() },
      { firstStep: 3, svg: BASE.bodyFill() + "\n" + BASE.bodyRough() + "\n" + BASE.ground() + "\n" + BASE.wheelCircle(REAR_CX) + "\n" + BASE.wheelCircle(FRONT_CX) },
      { firstStep: 4, svg: BASE.bodyFill() + "\n" + BASE.bodyRough() + "\n" + BASE.ground() + "\n" + BASE.wheelCircle(REAR_CX) + "\n" + BASE.wheelCircle(FRONT_CX) + "\n" + BASE.fenders() + "\n" + BASE.rocker() + "\n" + label("圆润的车身角", 250, 60) },
    ],
  },
  {
    id: 4,
    elements: [
      { firstStep: 1, svg: BASE.ground() + "\n" + BASE.wheelCircle(REAR_CX) + "\n" + BASE.wheelCircle(FRONT_CX) },
      { firstStep: 2, svg: BASE.ground() + "\n" + BASE.wheelCircle(REAR_CX) + "\n" + BASE.wheelCircle(FRONT_CX) + "\n" + BASE.bodyFill() + "\n" + BASE.bodyRough() },
      { firstStep: 3, svg: BASE.ground() + "\n" + BASE.wheel(REAR_CX) + "\n" + BASE.wheel(FRONT_CX) + "\n" + BASE.bodyFill() + "\n" + BASE.bodyRough() + "\n" + BASE.glass() },
      { firstStep: 4, svg: BASE.ground() + "\n" + BASE.wheel(REAR_CX) + "\n" + BASE.wheel(FRONT_CX) + "\n" + BASE.bodyFill() + "\n" + BASE.bodyRough() + "\n" + BASE.glass() + "\n" + BASE.headlight() + "\n" + BASE.doorCut() + "\n" + BASE.handle() + "\n" + BASE.mirror() },
      { firstStep: 5, svg: BASE.ground() + "\n" + BASE.groundShadow() + "\n" + BASE.ghost() + "\n" + BASE.wheel(REAR_CX) + "\n" + BASE.wheel(FRONT_CX) + "\n" + BASE.bodyFill() + "\n" + BASE.bodyRough() + "\n" + BASE.glass() + "\n" + BASE.fenders() + "\n" + BASE.rocker() + "\n" + BASE.shoulder() + "\n" + BASE.headlight() + "\n" + BASE.taillight() + "\n" + BASE.doorCut() + "\n" + BASE.handle() + "\n" + BASE.mirror() + "\n" + BASE.gesture() + "\n" + BASE.wheelStudy() + "\n" + label("第一辆小车完成！", 250, 60) },
    ],
  },
  {
    id: 5,
    elements: [
      { firstStep: 1, svg: BASE.ground() + "\n" + BASE.bodyFill() + "\n" + BASE.bodyRough() },
      { firstStep: 2, svg: BASE.ground() + "\n" + BASE.bodyFill() + "\n" + BASE.bodyRough() + "\n" + BASE.bumper() },
      { firstStep: 3, svg: BASE.ground() + "\n" + BASE.bodyFill() + "\n" + BASE.bodyRough() + "\n" + BASE.bumper() + "\n" + BASE.headlight() },
      { firstStep: 4, svg: BASE.ground() + "\n" + BASE.bodyFill() + "\n" + BASE.bodyRough() + "\n" + BASE.bumper() + "\n" + BASE.headlight() + "\n" + label("封闭前脸 · 没有大格栅", 250, 60) },
    ],
  },
  {
    id: 6,
    elements: [
      { firstStep: 1, svg: BASE.ground() + "\n" + BASE.bodyFill() + "\n" + BASE.bodyRough() + "\n" + line(438, 268, 464, 266, 1.8) },
      { firstStep: 2, svg: BASE.ground() + "\n" + BASE.bodyFill() + "\n" + BASE.bodyRough() + "\n" + path("M438 268 L430 260 M464 266 L472 258", 1.8) },
      { firstStep: 3, svg: BASE.ground() + "\n" + BASE.bodyFill() + "\n" + BASE.bodyRough() + "\n" + path("M438 268 L430 260 M464 266 L472 258", 1.8) + "\n" + circle(448, 264, 1.8, 0.8, "#FBF9F3") + "\n" + circle(456, 264, 1.8, 0.8, "#FBF9F3") },
      { firstStep: 4, svg: BASE.ground() + "\n" + BASE.bodyFill() + "\n" + BASE.bodyRough() + "\n" + path("M438 268 L430 260 M464 266 L472 258", 1.8) + "\n" + circle(448, 264, 1.8, 0.8, "#FBF9F3") + "\n" + circle(456, 264, 1.8, 0.8, "#FBF9F3") + "\n" + label("贯穿式大灯", 250, 60) },
    ],
  },
  {
    id: 7,
    elements: [
      { firstStep: 1, svg: BASE.ground() + "\n" + BASE.bodyFill() + "\n" + BASE.bodyRough() + "\n" + BASE.wheels() + "\n" + BASE.fenders() },
      { firstStep: 2, svg: BASE.ground() + "\n" + BASE.bodyFill() + "\n" + BASE.bodyRough() + "\n" + BASE.wheels() + "\n" + BASE.fenders() + "\n" + BASE.rim(REAR_CX) + "\n" + BASE.rim(FRONT_CX) },
      { firstStep: 3, svg: BASE.ground() + "\n" + BASE.bodyFill() + "\n" + BASE.bodyRough() + "\n" + BASE.wheels() + "\n" + BASE.fenders() + "\n" + BASE.rim(REAR_CX) + "\n" + BASE.rim(FRONT_CX) + "\n" + spokes(REAR_CX, WHEEL_CY) + "\n" + spokes(FRONT_CX, WHEEL_CY) },
      { firstStep: 4, svg: BASE.ground() + "\n" + BASE.bodyFill() + "\n" + BASE.bodyRough() + "\n" + BASE.wheels() + "\n" + BASE.fenders() + "\n" + BASE.rim(REAR_CX) + "\n" + BASE.rim(FRONT_CX) + "\n" + spokes(REAR_CX, WHEEL_CY) + "\n" + spokes(FRONT_CX, WHEEL_CY) + "\n" + BASE.doorCut() + "\n" + BASE.mirror() },
      { firstStep: 5, svg: BASE.ground() + "\n" + BASE.groundShadow() + "\n" + BASE.bodyFill() + "\n" + BASE.bodyRough() + "\n" + BASE.wheels() + "\n" + BASE.fenders() + "\n" + BASE.rim(REAR_CX) + "\n" + BASE.rim(FRONT_CX) + "\n" + spokes(REAR_CX, WHEEL_CY) + "\n" + spokes(FRONT_CX, WHEEL_CY) + "\n" + BASE.doorCut() + "\n" + BASE.handle() + "\n" + BASE.mirror() + "\n" + BASE.rocker() + "\n" + circle(330, 240, 2.4, 1.0, INK) + "\n" + BASE.wheelStudy() + "\n" + label("细节让车更精致", 250, 60) },
    ],
  },
  {
    id: 8,
    elements: [
      { firstStep: 1, svg: BASE.ground() + "\n" + BASE.bodyFill() + "\n" + BASE.bodyRough() + "\n" + BASE.wheels() + "\n" + path("M196 218 L226 216 L226 236 L196 238 Z", 1.1) + "\n" + path("M204 234 L212 222 L216 222 L208 234 Z", 0.8, INK) },
      { firstStep: 2, svg: BASE.ground() + "\n" + BASE.bodyFill() + "\n" + BASE.bodyRough() + "\n" + BASE.wheels() + "\n" + path("M196 218 L226 216 L226 236 L196 238 Z", 1.1) + "\n" + path("M204 234 L212 222 L216 222 L208 234 Z", 0.8, INK) + "\n" + path("M196 218 Q211 208 226 216", 1.0) },
      { firstStep: 3, svg: BASE.ground() + "\n" + BASE.bodyFill() + "\n" + BASE.bodyRough() + "\n" + BASE.wheels() + "\n" + path("M196 218 L226 216 L226 236 L196 238 Z", 1.1) + "\n" + path("M204 234 L212 222 L216 222 L208 234 Z", 0.8, INK) + "\n" + path("M196 218 Q211 208 226 216", 1.0) + "\n" + line(286, 252, 304, 251, 1.3) },
      { firstStep: 4, svg: BASE.ground() + "\n" + BASE.bodyFill() + "\n" + BASE.bodyRough() + "\n" + BASE.wheels() + "\n" + path("M196 218 L226 216 L226 236 L196 238 Z", 1.1) + "\n" + path("M204 234 L212 222 L216 222 L208 234 Z", 0.8, INK) + "\n" + path("M196 218 Q211 208 226 216", 1.0) + "\n" + line(286, 252, 304, 251, 1.3) + "\n" + circle(332, 240, 2.4, 1.0, INK) + "\n" + label("充电口", 211, 258) },
    ],
  },
  {
    id: 9,
    elements: [
      { firstStep: 1, svg: line(24, 334, 476, 334, 3.0, "#3A3D44") + "\n" + BASE.wheels() },
      { firstStep: 2, svg: line(24, 334, 476, 334, 3.0, "#3A3D44") + "\n" + BASE.wheels() + "\n" + `<ellipse cx="${REAR_CX}" cy="332" rx="34" ry="6" fill="#6E6A61" opacity="0.5"/>` + "\n" + `<ellipse cx="${FRONT_CX}" cy="332" rx="34" ry="6" fill="#6E6A61" opacity="0.5"/>` },
      { firstStep: 3, svg: line(24, 334, 476, 334, 3.0, "#3A3D44") + "\n" + BASE.wheels() + "\n" + `<ellipse cx="${REAR_CX}" cy="332" rx="34" ry="6" fill="#6E6A61" opacity="0.5"/>` + "\n" + `<ellipse cx="${FRONT_CX}" cy="332" rx="34" ry="6" fill="#6E6A61" opacity="0.5"/>` + "\n" + line(36, 250, 70, 250, 1.4, "#8B909B") + "\n" + line(32, 268, 66, 268, 1.4, "#8B909B") + "\n" + line(36, 286, 70, 286, 1.4, "#8B909B") },
      { firstStep: 4, svg: line(24, 334, 476, 334, 3.0, "#3A3D44") + "\n" + BASE.wheels() + "\n" + `<ellipse cx="${REAR_CX}" cy="332" rx="34" ry="6" fill="#6E6A61" opacity="0.5"/>` + "\n" + `<ellipse cx="${FRONT_CX}" cy="332" rx="34" ry="6" fill="#6E6A61" opacity="0.5"/>` + "\n" + line(36, 250, 70, 250, 1.4, "#8B909B") + "\n" + line(32, 268, 66, 268, 1.4, "#8B909B") + "\n" + line(36, 286, 70, 286, 1.4, "#8B909B") + "\n" + BASE.bodyFill() + "\n" + BASE.bodyRough() + "\n" + BASE.fenders() + "\n" + BASE.gesture() + "\n" + label("有速度感了吗？", 250, 60) },
    ],
  },
  {
    id: 10,
    elements: [
      { firstStep: 1, svg: BASE.ground() + "\n" + BASE.wheels() + "\n" + `<path d="${BODY_D}" fill="#D4CEC0" stroke="#6E6A61" stroke-width="1.2"/>` },
      { firstStep: 2, svg: BASE.ground() + "\n" + BASE.wheels() + "\n" + BASE.bodyFill() + "\n" + BASE.bodyRough() },
      { firstStep: 3, svg: BASE.ground() + "\n" + BASE.wheels() + "\n" + BASE.bodyFill() + "\n" + BASE.bodyRough() + "\n" + BASE.shoulder() },
      { firstStep: 4, svg: BASE.ground() + "\n" + BASE.groundShadow() + "\n" + BASE.wheels() + "\n" + BASE.bodyFill() + "\n" + BASE.bodyRough() + "\n" + BASE.shoulder() + "\n" + BASE.rocker() + "\n" + hatch(150, 240, 7, 14, 8, 40) + "\n" + label("渐变 + 高光 + 阴影", 250, 60) },
    ],
  },
  {
    id: 11,
    elements: [
      { firstStep: 1, svg: `<path d="M156 150 L344 150 Q372 150 372 172 L372 252 L128 252 L128 172 Q128 150 156 150 Z" fill="url(#gBody)" stroke="#565A63" stroke-width="1.4"/>` + "\n" + line(50, 300, 450, 300, 1.8) },
      { firstStep: 2, svg: `<path d="M156 150 L344 150 Q372 150 372 172 L372 252 L128 252 L128 172 Q128 150 156 150 Z" fill="url(#gBody)" stroke="#565A63" stroke-width="1.4"/>` + "\n" + line(50, 300, 450, 300, 1.8) + "\n" + `<circle cx="178" cy="196" r="13" fill="url(#gGlass)" stroke="#4A4D55" stroke-width="1.0"/>` + "\n" + `<circle cx="322" cy="196" r="13" fill="url(#gGlass)" stroke="#4A4D55" stroke-width="1.0"/>` },
      { firstStep: 3, svg: `<path d="M156 150 L344 150 Q372 150 372 172 L372 252 L128 252 L128 172 Q128 150 156 150 Z" fill="url(#gBody)" stroke="#565A63" stroke-width="1.4"/>` + "\n" + line(50, 300, 450, 300, 1.8) + "\n" + `<circle cx="178" cy="196" r="13" fill="url(#gGlass)" stroke="#4A4D55" stroke-width="1.0"/>` + "\n" + `<circle cx="322" cy="196" r="13" fill="url(#gGlass)" stroke="#4A4D55" stroke-width="1.0"/>` + "\n" + line(156, 214, 344, 214, 1.7) + "\n" + `<path d="M156 222 L344 222 L344 252 L156 252 Z" fill="#8B8478" opacity="0.5" stroke="#565A63" stroke-width="1.0"/>` },
      { firstStep: 4, svg: `<path d="M174 118 L326 118 Q352 118 352 140 L352 208 L148 208 L148 140 Q148 118 174 118 Z" fill="url(#gBody)" stroke="#565A63" stroke-width="1.4"/>` + "\n" + line(50, 238, 450, 238, 1.8) + "\n" + line(162, 164, 338, 164, 1.7) },
      { firstStep: 5, svg: `<path d="M174 118 L326 118 Q352 118 352 140 L352 208 L148 208 L148 140 Q148 118 174 118 Z" fill="url(#gBody)" stroke="#565A63" stroke-width="1.4"/>` + "\n" + line(50, 238, 450, 238, 1.8) + "\n" + line(162, 164, 338, 164, 1.7) + "\n" + `<rect x="206" y="180" width="88" height="22" rx="3" fill="#DDD8CB" stroke="#565A63" stroke-width="1.0"/>` + "\n" + label("前后都要会画", 250, 60) },
    ],
  },
  {
    id: 12,
    elements: [
      { firstStep: 1, svg: rough(BODY_D, 1.5) + "\n" + line(40, 330, 460, 330, 1.8) },
      { firstStep: 2, svg: rough(BODY_D, 1.5) + "\n" + line(40, 330, 460, 330, 1.8) + "\n" + `<path d="M176 200 L330 196 L356 240 L176 240 Z" fill="url(#gGlass)" stroke="#4A4D55" stroke-width="1.0"/>` },
      { firstStep: 3, svg: rough(BODY_D, 1.5) + "\n" + line(40, 330, 460, 330, 1.8) + "\n" + `<path d="M176 200 L330 196 L356 240 L176 240 Z" fill="url(#gGlass)" stroke="#4A4D55" stroke-width="1.0"/>` + "\n" + BASE.wheel(REAR_CX) + "\n" + BASE.wheel(FRONT_CX) + "\n" + BASE.fender(REAR_CX) + "\n" + BASE.fender(FRONT_CX) },
      { firstStep: 4, svg: rough(BODY_D, 1.5) + "\n" + line(40, 330, 460, 330, 1.8) + "\n" + `<path d="M176 200 L330 196 L356 240 L176 240 Z" fill="url(#gGlass)" stroke="#4A4D55" stroke-width="1.0"/>` + "\n" + BASE.wheel(REAR_CX) + "\n" + BASE.wheel(FRONT_CX) + "\n" + BASE.fender(REAR_CX) + "\n" + BASE.fender(FRONT_CX) + "\n" + line(60, 250, 460, 248, 1.8) + "\n" + `<path d="M380 196 L446 168 L460 190 L394 218 Z" fill="#D4CEC0" stroke="#565A63" stroke-width="1.2"/>` },
      { firstStep: 5, svg: BASE.ghost() + "\n" + `<path d="${BODY_D}" fill="url(#gBody)"/>` + "\n" + rough(BODY_D, 1.5) + "\n" + line(40, 330, 460, 330, 1.8) + "\n" + `<ellipse cx="250" cy="332" rx="230" ry="12" fill="url(#gGround)"/>` + "\n" + `<path d="M176 200 L330 196 L356 240 L176 240 Z" fill="url(#gGlass)" stroke="#4A4D55" stroke-width="1.0"/>` + "\n" + BASE.wheel(REAR_CX) + "\n" + BASE.wheel(FRONT_CX) + "\n" + BASE.fender(REAR_CX) + "\n" + BASE.fender(FRONT_CX) + "\n" + BASE.rocker() + "\n" + line(60, 250, 460, 248, 1.8) + "\n" + `<path d="M380 196 L446 168 L460 190 L394 218 Z" fill="#D4CEC0" stroke="#565A63" stroke-width="1.2"/>` + "\n" + BASE.gesture() + "\n" + BASE.wheelStudy() + "\n" + label("我的概念车", 250, 60) },
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
    writeFileSync(join(OUT_DIR, name), svgDoc(paper() + "\n" + body), "utf8");
    count++;
  }
}
console.log(`已生成 ${count} 张插画到 ${OUT_DIR}`);
