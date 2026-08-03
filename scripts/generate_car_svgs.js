#!/usr/bin/env node
// 生成 95 张课程步骤插画（SVG）— 以真实车型（紧凑型电动轿车）轮廓为底稿的速写
// 覆盖 20 课：比例/透视/视角/设计语言/渲染/创作/作品集
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
function dashLine(x1, y1, x2, y2, w = 1.2, color = INK_SOFT) {
  return `<line x1="${x1}" y1="${y1}" x2="${x2}" y2="${y2}" ${stroke(w, color)} stroke-dasharray="7 6"/>`;
}
function circle(cx, cy, r, w = 1.5, fill = "none", extra = "") {
  return `<circle cx="${cx}" cy="${cy}" r="${r}" ${stroke(w)} fill="${fill}" ${extra}/>`;
}
function ellipse(cx, cy, rx, ry, w = 1.5, fill = "none", extra = "") {
  return `<ellipse cx="${cx}" cy="${cy}" rx="${rx}" ry="${ry}" ${stroke(w)} fill="${fill}" ${extra}/>`;
}
function label(text, x, y, size = 20) {
  return `<text x="${x}" y="${y}" text-anchor="middle" font-size="${size}" font-family="'Microsoft YaHei', sans-serif" font-weight="600" fill="${INK}">${text}</text>`;
}
function dim(x1, y1, x2, y2, text, dy = 0) {
  return (
    `<line x1="${x1}" y1="${y1}" x2="${x2}" y2="${y2}" ${stroke(1.1, INK_SOFT)}/>` +
    `<line x1="${x1}" y1="${y1 - 5}" x2="${x1}" y2="${y1 + 5}" ${stroke(1.1, INK_SOFT)}/>` +
    `<line x1="${x2}" y1="${y2 - 5}" x2="${x2}" y2="${y2 + 5}" ${stroke(1.1, INK_SOFT)}/>` +
    `<text x="${((x1 + x2) / 2).toFixed(0)}" y="${((y1 + y2) / 2 + 4 + dy).toFixed(0)}" text-anchor="middle" font-size="13" font-family="'Microsoft YaHei', sans-serif" fill="${INK_SOFT}">${text}</text>`
  );
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

// ============ 真实车型底稿（紧凑型电动轿车，坐标已换算到 500x360） ============
const WHEEL_R = 29;
const WHEEL_CY = 300;
const GROUND_Y = 329;
const REAR_CX = 109;
const FRONT_CX = 412;
const BODY_D =
  "M37.2 292.3 C37.2 292.3 58.8 203.0 109.2 188.6 C138.0 180.0 195.6 174.2 253.2 171.3 C310.8 174.2 354.0 180.0 382.8 194.4 C411.6 208.7 433.2 231.8 447.6 256.3 L462.0 277.9 L469.2 285.1 L469.2 299.5 L454.8 299.5 C454.8 275.0 434.6 256.3 411.6 256.3 C388.6 256.3 368.4 275.0 368.4 299.5 L152.4 299.5 C152.4 275.0 132.2 256.3 109.2 256.3 C86.2 256.3 66.0 275.0 66.0 299.5 L30.0 299.5 L30.0 292.3 Z";
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
    "\n" + hatch(230, 292, 6, 12, 8, 45),
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
  fullCar: () =>
    BASE.groundShadow() +
    "\n" + BASE.wheels() +
    "\n" + BASE.bodyFill() +
    "\n" + BASE.bodyRough() +
    "\n" + BASE.glass() +
    "\n" + BASE.fenders() +
    "\n" + BASE.rocker() +
    "\n" + BASE.shoulder() +
    "\n" + BASE.headlight() +
    "\n" + BASE.taillight() +
    "\n" + BASE.doorCut() +
    "\n" + BASE.handle() +
    "\n" + BASE.mirror(),
};

// ============ 20 课插画 ============
const DRAWINGS = [
  {
    id: 1,
    elements: [
      { firstStep: 1, svg: BASE.ground() + "\n" + BASE.wheelCircle(REAR_CX) + "\n" + BASE.wheelCircle(FRONT_CX) },
      { firstStep: 2, svg: BASE.ground() + "\n" + BASE.wheelCircle(REAR_CX) + "\n" + BASE.wheelCircle(FRONT_CX) + "\n" + BASE.bodyFill() + "\n" + BASE.bodyRough() },
      { firstStep: 3, svg: BASE.ground() + "\n" + BASE.wheelCircle(REAR_CX) + "\n" + BASE.wheelCircle(FRONT_CX) + "\n" + BASE.bodyFill() + "\n" + BASE.bodyRough() + "\n" + dim(82, 344, 447, 344, "车长 ≈ 7D") + "\n" + dim(18, 212, 18, 300, "车高 ≈ 2.2D") },
      { firstStep: 4, svg: BASE.ground() + "\n" + BASE.wheelCircle(REAR_CX) + "\n" + BASE.wheelCircle(FRONT_CX) + "\n" + BASE.bodyFill() + "\n" + BASE.bodyRough() + "\n" + dim(82, 344, 447, 344, "车长 ≈ 7D") + "\n" + dim(18, 212, 18, 300, "车高 ≈ 2.2D") + "\n" + BASE.fenders() + "\n" + BASE.rocker() },
      { firstStep: 5, svg: BASE.ground() + "\n" + BASE.wheelCircle(REAR_CX) + "\n" + BASE.wheelCircle(FRONT_CX) + "\n" + BASE.bodyFill() + "\n" + BASE.bodyRough() + "\n" + dim(82, 344, 447, 344, "车长 ≈ 7D") + "\n" + dim(18, 212, 18, 300, "车高 ≈ 2.2D") + "\n" + BASE.fenders() + "\n" + BASE.rocker() + "\n" + dim(REAR_CX, 352, FRONT_CX, 352, "轴距 ≈ 4.3D") + "\n" + dim(82, 338, REAR_CX, 338, "后悬 ≈ 1.46D") + "\n" + dim(FRONT_CX, 338, 447, 338, "前悬 ≈ 1.27D") + "\n" + label("比例基准：轮径 D", 250, 60) },
    ],
  },
  {
    id: 2,
    elements: [
      { firstStep: 1, svg: BASE.wheelCircle(REAR_CX) + "\n" + line(40, GROUND_Y, 264, GROUND_Y, 1.1) },
      { firstStep: 2, svg: BASE.wheelCircle(REAR_CX) + "\n" + BASE.wheelCircle(FRONT_CX) + "\n" + line(40, GROUND_Y, 460, GROUND_Y, 1.1) },
      { firstStep: 3, svg: BASE.wheelCircle(REAR_CX) + "\n" + BASE.wheelCircle(FRONT_CX) + "\n" + circle(REAR_CX, WHEEL_CY, 18, 1.2, "url(#gRim)") + "\n" + circle(FRONT_CX, WHEEL_CY, 18, 1.2, "url(#gRim)") + "\n" + circle(REAR_CX, WHEEL_CY, 3.4, 1.0, INK) + "\n" + circle(FRONT_CX, WHEEL_CY, 3.4, 1.0, INK) + "\n" + line(40, GROUND_Y, 460, GROUND_Y, 1.1) },
      { firstStep: 4, svg: BASE.wheel(REAR_CX) + "\n" + BASE.wheel(FRONT_CX) + "\n" + BASE.ground() },
      { firstStep: 5, svg: BASE.wheel(REAR_CX) + "\n" + BASE.wheel(FRONT_CX) + "\n" + BASE.ground() + "\n" + dashLine(REAR_CX, WHEEL_CY, 140, 225) + "\n" + dashLine(FRONT_CX, WHEEL_CY, 360, 215) + "\n" + label("消失线汇于一点", 250, 60) },
    ],
  },
  {
    id: 3,
    elements: [
      { firstStep: 1, svg: path("M58 250 L450 250 L450 292 L58 299 Z", 1.4) + "\n" + path("M130 200 L250 176 L250 250 L130 250 Z", 1.4) },
      { firstStep: 2, svg: BASE.bodyFill() + "\n" + BASE.bodyRough() },
      { firstStep: 3, svg: BASE.bodyFill() + "\n" + BASE.bodyRough() + "\n" + BASE.ground() + "\n" + BASE.wheelCircle(REAR_CX) + "\n" + BASE.wheelCircle(FRONT_CX) },
      { firstStep: 4, svg: BASE.bodyFill() + "\n" + BASE.bodyRough() + "\n" + BASE.ground() + "\n" + BASE.wheelCircle(REAR_CX) + "\n" + BASE.wheelCircle(FRONT_CX) + "\n" + BASE.fenders() + "\n" + BASE.rocker() },
      { firstStep: 5, svg: BASE.bodyFill() + "\n" + BASE.bodyRough() + "\n" + BASE.ground() + "\n" + BASE.wheelCircle(REAR_CX) + "\n" + BASE.wheelCircle(FRONT_CX) + "\n" + BASE.fenders() + "\n" + BASE.rocker() + "\n" + BASE.shoulder() + "\n" + label("姿态定稿", 250, 60) },
    ],
  },
  {
    id: 4,
    elements: [
      { firstStep: 1, svg: BASE.ground() + "\n" + BASE.wheelCircle(REAR_CX) + "\n" + BASE.wheelCircle(FRONT_CX) },
      { firstStep: 2, svg: BASE.ground() + "\n" + BASE.wheelCircle(REAR_CX) + "\n" + BASE.wheelCircle(FRONT_CX) + "\n" + BASE.bodyFill() + "\n" + BASE.bodyRough() },
      { firstStep: 3, svg: BASE.ground() + "\n" + BASE.wheel(REAR_CX) + "\n" + BASE.wheel(FRONT_CX) + "\n" + BASE.bodyFill() + "\n" + BASE.bodyRough() + "\n" + BASE.glass() },
      { firstStep: 4, svg: BASE.ground() + "\n" + BASE.wheel(REAR_CX) + "\n" + BASE.wheel(FRONT_CX) + "\n" + BASE.bodyFill() + "\n" + BASE.bodyRough() + "\n" + BASE.glass() + "\n" + BASE.headlight() + "\n" + BASE.doorCut() + "\n" + BASE.handle() + "\n" + BASE.mirror() },
      { firstStep: 5, svg: BASE.fullCar() + "\n" + BASE.gesture() + "\n" + label("干净侧视线稿", 250, 60) },
    ],
  },
  {
    id: 5,
    elements: [
      { firstStep: 1, svg: line(40, 190, 460, 190, 1.3) + "\n" + circle(250, 190, 4, 1.3, INK) + "\n" + line(40, 310, 460, 310, 1.5) + "\n" + label("视平线", 70, 180, 14) + "\n" + label("消失点", 250, 176, 14) },
      { firstStep: 2, svg: line(40, 190, 460, 190, 1.3) + "\n" + circle(250, 190, 4, 1.3, INK) + "\n" + line(40, 310, 460, 310, 1.5) + "\n" + path("M330 150 L410 150 L410 310 L330 310 Z", 1.6) + "\n" + path("M150 186 L190 186 L190 258 L150 258 Z", 1.4) },
      { firstStep: 3, svg: line(40, 190, 460, 190, 1.3) + "\n" + circle(250, 190, 4, 1.3, INK) + "\n" + line(40, 310, 460, 310, 1.5) + "\n" + path("M330 150 L410 150 L410 310 L330 310 Z", 1.6) + "\n" + path("M150 186 L190 186 L190 258 L150 258 Z", 1.4) + "\n" + dashLine(330, 150, 150, 186) + "\n" + dashLine(410, 150, 190, 186) + "\n" + dashLine(330, 310, 150, 258) + "\n" + dashLine(410, 310, 190, 258) + "\n" + label("纵深线收向消失点", 250, 60) },
      { firstStep: 4, svg: line(40, 190, 460, 190, 1.3) + "\n" + circle(250, 190, 4, 1.3, INK) + "\n" + line(40, 310, 460, 310, 1.5) + "\n" + path("M330 150 L410 150 L410 310 L330 310 Z", 1.6) + "\n" + path("M150 186 L190 186 L190 258 L150 258 Z", 1.4) + "\n" + dashLine(330, 150, 150, 186) + "\n" + dashLine(410, 150, 190, 186) + "\n" + dashLine(330, 310, 150, 258) + "\n" + dashLine(410, 310, 190, 258) + "\n" + path("M170 205 L240 185 L300 200 L300 252 L170 252 Z", 1.5) + "\n" + circle(200, 252, 18, 1.4) + "\n" + circle(280, 252, 16, 1.4) + "\n" + label("车身放进透视盒", 250, 60) },
    ],
  },
  {
    id: 6,
    elements: [
      { firstStep: 1, svg: ellipse(360, 292, 50, 20, 1.5) + "\n" + line(310, 292, 410, 292, 0.9, "#8B909B") + "\n" + line(360, 272, 360, 312, 0.9, "#8B909B") },
      { firstStep: 2, svg: ellipse(360, 292, 50, 20, 1.5) + "\n" + line(310, 292, 410, 292, 0.9, "#8B909B") + "\n" + line(360, 272, 360, 312, 0.9, "#8B909B") + "\n" + ellipse(150, 296, 42, 17, 1.5) + "\n" + line(108, 296, 192, 296, 0.9, "#8B909B") + "\n" + line(150, 279, 150, 313, 0.9, "#8B909B") + "\n" + line(40, 318, 460, 318, 1.3) },
      { firstStep: 3, svg: ellipse(360, 292, 50, 20, 1.5) + "\n" + ellipse(150, 296, 42, 17, 1.5) + "\n" + dashLine(150, 296, 360, 292) + "\n" + circle(360, 292, 3, 1.1, INK) + "\n" + circle(150, 296, 3, 1.1, INK) + "\n" + line(40, 318, 460, 318, 1.3) },
      { firstStep: 4, svg: ellipse(360, 292, 50, 20, 1.5) + "\n" + ellipse(150, 296, 42, 17, 1.5) + "\n" + dashLine(150, 296, 360, 292) + "\n" + circle(360, 292, 3, 1.1, INK) + "\n" + circle(150, 296, 3, 1.1, INK) + "\n" + line(40, 318, 460, 318, 1.3) + "\n" + path("M108 300 Q150 272 192 300", 1.5) + "\n" + path("M310 296 Q360 266 410 296", 1.5) },
      { firstStep: 5, svg: ellipse(360, 292, 50, 20, 1.5) + "\n" + ellipse(150, 296, 42, 17, 1.5) + "\n" + dashLine(150, 296, 360, 292) + "\n" + circle(360, 292, 3, 1.1, INK) + "\n" + circle(150, 296, 3, 1.1, INK) + "\n" + line(40, 318, 460, 318, 1.3) + "\n" + path("M108 300 Q150 272 192 300", 1.5) + "\n" + path("M310 296 Q360 266 410 296", 1.5) + "\n" + ellipse(150, 318, 44, 8, 0, "#8A8478", `fill-opacity="0.35"`) + "\n" + ellipse(360, 314, 52, 9, 0, "#8A8478", `fill-opacity="0.35"`) + "\n" + label("椭圆长轴保持水平", 250, 60) },
    ],
  },
  {
    id: 7,
    elements: [
      { firstStep: 1, svg: line(40, 300, 460, 300, 1.5) + "\n" + path("M170 170 L330 170 Q350 170 350 186 L350 280 L150 280 L150 186 Q150 170 170 170 Z", 1.5) },
      { firstStep: 2, svg: line(40, 300, 460, 300, 1.5) + "\n" + path("M170 170 L330 170 Q350 170 350 186 L350 280 L150 280 L150 186 Q150 170 170 170 Z", 1.5) + "\n" + path("M330 170 L420 200 L420 292 L350 280 Z", 1.4) },
      { firstStep: 3, svg: line(40, 300, 460, 300, 1.5) + "\n" + path("M170 170 L330 170 Q350 170 350 186 L350 280 L150 280 L150 186 Q150 170 170 170 Z", 1.5) + "\n" + path("M330 170 L420 200 L420 292 L350 280 Z", 1.4) + "\n" + ellipse(260, 292, 30, 12, 1.4) + "\n" + ellipse(120, 296, 26, 11, 1.4) + "\n" + path("M230 296 Q260 276 290 296", 1.3) + "\n" + path("M94 300 Q120 282 146 300", 1.3) },
      { firstStep: 4, svg: line(40, 300, 460, 300, 1.5) + "\n" + path("M170 170 L330 170 Q350 170 350 186 L350 280 L150 280 L150 186 Q150 170 170 170 Z", 1.5) + "\n" + path("M330 170 L420 200 L420 292 L350 280 Z", 1.4) + "\n" + ellipse(260, 292, 30, 12, 1.4) + "\n" + ellipse(120, 296, 26, 11, 1.4) + "\n" + path("M230 296 Q260 276 290 296", 1.3) + "\n" + path("M94 300 Q120 282 146 300", 1.3) + "\n" + circle(200, 210, 13, 1.3, "#E8EAF0") + "\n" + circle(300, 210, 13, 1.3, "#E8EAF0") + "\n" + line(185, 228, 315, 228, 1.6) },
      { firstStep: 5, svg: line(40, 300, 460, 300, 1.5) + "\n" + path("M170 170 L330 170 Q350 170 350 186 L350 280 L150 280 L150 186 Q150 170 170 170 Z", 1.5) + "\n" + path("M330 170 L420 200 L420 292 L350 280 Z", 1.4) + "\n" + ellipse(260, 292, 30, 12, 1.4) + "\n" + ellipse(120, 296, 26, 11, 1.4) + "\n" + path("M230 296 Q260 276 290 296", 1.3) + "\n" + path("M94 300 Q120 282 146 300", 1.3) + "\n" + circle(200, 210, 13, 1.3, "#E8EAF0") + "\n" + circle(300, 210, 13, 1.3, "#E8EAF0") + "\n" + line(185, 228, 315, 228, 1.6) + "\n" + path("M170 170 L330 170 L350 186 L150 186 Z", 0, "#C9C2B2", `fill-opacity="0.45"`) + "\n" + label("3/4 前视角完成", 250, 60) },
    ],
  },
  {
    id: 8,
    elements: [
      { firstStep: 1, svg: line(40, 300, 460, 300, 1.5) + "\n" + path("M160 170 L340 170 Q360 170 360 186 L360 280 L140 280 L140 186 Q140 170 160 170 Z", 1.5) },
      { firstStep: 2, svg: line(40, 300, 460, 300, 1.5) + "\n" + path("M160 170 L340 170 Q360 170 360 186 L360 280 L140 280 L140 186 Q140 170 160 170 Z", 1.5) + "\n" + path("M340 170 L250 196 L250 292 L360 280 Z", 1.4) + "\n" + path("M185 180 L315 180 L300 210 L200 210 Z", 1.3, "#E8EAF0") },
      { firstStep: 3, svg: line(40, 300, 460, 300, 1.5) + "\n" + path("M160 170 L340 170 Q360 170 360 186 L360 280 L140 280 L140 186 Q140 170 160 170 Z", 1.5) + "\n" + path("M340 170 L250 196 L250 292 L360 280 Z", 1.4) + "\n" + path("M185 180 L315 180 L300 210 L200 210 Z", 1.3, "#E8EAF0") + "\n" + line(170, 200, 330, 200, 1.8) + "\n" + path("M225 224 L275 224 L275 244 L225 244 Z", 1.2) },
      { firstStep: 4, svg: line(40, 300, 460, 300, 1.5) + "\n" + path("M160 170 L340 170 Q360 170 360 186 L360 280 L140 280 L140 186 Q140 170 160 170 Z", 1.5) + "\n" + path("M340 170 L250 196 L250 292 L360 280 Z", 1.4) + "\n" + path("M185 180 L315 180 L300 210 L200 210 Z", 1.3, "#E8EAF0") + "\n" + line(170, 200, 330, 200, 1.8) + "\n" + path("M225 224 L275 224 L275 244 L225 244 Z", 1.2) + "\n" + path("M150 260 L360 252 L360 280 L150 280 Z", 1.2) },
      { firstStep: 5, svg: line(40, 300, 460, 300, 1.5) + "\n" + path("M160 170 L340 170 Q360 170 360 186 L360 280 L140 280 L140 186 Q140 170 160 170 Z", 1.5) + "\n" + path("M340 170 L250 196 L250 292 L360 280 Z", 1.4) + "\n" + path("M185 180 L315 180 L300 210 L200 210 Z", 1.3, "#E8EAF0") + "\n" + line(170, 200, 330, 200, 1.8) + "\n" + path("M225 224 L275 224 L275 244 L225 244 Z", 1.2) + "\n" + path("M150 260 L360 252 L360 280 L150 280 Z", 1.2) + "\n" + label("3/4 后视角完成", 250, 60) },
    ],
  },
  {
    id: 9,
    elements: [
      { firstStep: 1, svg: BASE.ground() + "\n" + BASE.bodyFill() + "\n" + BASE.bodyRough() },
      { firstStep: 2, svg: BASE.ground() + "\n" + BASE.bodyFill() + "\n" + BASE.bodyRough() + "\n" + BASE.bumper() },
      { firstStep: 3, svg: BASE.ground() + "\n" + BASE.bodyFill() + "\n" + BASE.bodyRough() + "\n" + BASE.bumper() + "\n" + BASE.headlight() },
      { firstStep: 4, svg: BASE.ground() + "\n" + BASE.bodyFill() + "\n" + BASE.bodyRough() + "\n" + BASE.bumper() + "\n" + BASE.headlight() + "\n" + label("封闭前脸 · 没有大格栅", 250, 60) },
      { firstStep: 5, svg: BASE.ground() + "\n" + BASE.bodyFill() + "\n" + BASE.bodyRough() + "\n" + BASE.bumper() + "\n" + BASE.headlight() + "\n" + dashLine(70, 282, 430, 282) + "\n" + label("分件线顺着曲面走", 250, 60) },
    ],
  },
  {
    id: 10,
    elements: [
      { firstStep: 1, svg: BASE.ground() + "\n" + BASE.bodyFill() + "\n" + BASE.bodyRough() + "\n" + line(438, 268, 464, 266, 1.8) },
      { firstStep: 2, svg: BASE.ground() + "\n" + BASE.bodyFill() + "\n" + BASE.bodyRough() + "\n" + path("M438 268 L430 260 M464 266 L472 258", 1.8) },
      { firstStep: 3, svg: BASE.ground() + "\n" + BASE.bodyFill() + "\n" + BASE.bodyRough() + "\n" + path("M438 268 L430 260 M464 266 L472 258", 1.8) + "\n" + circle(448, 264, 1.8, 0.8, "#FBF9F3") + "\n" + circle(456, 264, 1.8, 0.8, "#FBF9F3") },
      { firstStep: 4, svg: BASE.ground() + "\n" + BASE.bodyFill() + "\n" + BASE.bodyRough() + "\n" + path("M438 268 L430 260 M464 266 L472 258", 1.8) + "\n" + circle(448, 264, 1.8, 0.8, "#FBF9F3") + "\n" + circle(456, 264, 1.8, 0.8, "#FBF9F3") + "\n" + label("贯穿式大灯", 250, 60) },
      { firstStep: 5, svg: BASE.ground() + "\n" + BASE.bodyFill() + "\n" + BASE.bodyRough() + "\n" + path("M438 268 L430 260 M464 266 L472 258", 1.8) + "\n" + circle(448, 264, 1.8, 0.8, "#FBF9F3") + "\n" + circle(456, 264, 1.8, 0.8, "#FBF9F3") + "\n" + ellipse(70, 200, 20, 7, 1.2) + "\n" + ellipse(180, 200, 20, 7, 1.2) + "\n" + ellipse(290, 200, 20, 7, 1.2) + "\n" + label("灯形对比 · 品牌识别", 250, 60) },
    ],
  },
  {
    id: 11,
    elements: [
      { firstStep: 1, svg: BASE.ground() + "\n" + BASE.bodyFill() + "\n" + BASE.bodyRough() + "\n" + BASE.wheels() + "\n" + BASE.fenders() },
      { firstStep: 2, svg: BASE.ground() + "\n" + BASE.bodyFill() + "\n" + BASE.bodyRough() + "\n" + BASE.wheels() + "\n" + BASE.fenders() + "\n" + BASE.rim(REAR_CX) + "\n" + BASE.rim(FRONT_CX) },
      { firstStep: 3, svg: BASE.ground() + "\n" + BASE.bodyFill() + "\n" + BASE.bodyRough() + "\n" + BASE.wheels() + "\n" + BASE.fenders() + "\n" + BASE.rim(REAR_CX) + "\n" + BASE.rim(FRONT_CX) + "\n" + spokes(REAR_CX, WHEEL_CY) + "\n" + spokes(FRONT_CX, WHEEL_CY) },
      { firstStep: 4, svg: BASE.ground() + "\n" + BASE.bodyFill() + "\n" + BASE.bodyRough() + "\n" + BASE.wheels() + "\n" + BASE.fenders() + "\n" + BASE.rim(REAR_CX) + "\n" + BASE.rim(FRONT_CX) + "\n" + spokes(REAR_CX, WHEEL_CY) + "\n" + spokes(FRONT_CX, WHEEL_CY) + "\n" + BASE.doorCut() + "\n" + BASE.mirror() },
      { firstStep: 5, svg: BASE.ground() + "\n" + BASE.groundShadow() + "\n" + BASE.bodyFill() + "\n" + BASE.bodyRough() + "\n" + BASE.wheels() + "\n" + BASE.fenders() + "\n" + BASE.rim(REAR_CX) + "\n" + BASE.rim(FRONT_CX) + "\n" + spokes(REAR_CX, WHEEL_CY) + "\n" + spokes(FRONT_CX, WHEEL_CY) + "\n" + BASE.doorCut() + "\n" + BASE.handle() + "\n" + BASE.mirror() + "\n" + BASE.rocker() + "\n" + circle(330, 240, 2.4, 1.0, INK) + "\n" + BASE.wheelStudy() + "\n" + label("细节让车更精致", 250, 60) },
    ],
  },
  {
    id: 12,
    elements: [
      { firstStep: 1, svg: line(30, 330, 470, 330, 1.5) + "\n" + BASE.wheelCircle(110) + "\n" + BASE.wheelCircle(190) + "\n" + BASE.wheelCircle(320) + "\n" + BASE.wheelCircle(420) },
      { firstStep: 2, svg: line(30, 330, 470, 330, 1.5) + "\n" + path("M60 300 L60 262 Q60 238 90 235 L150 235 Q175 235 185 248 L230 252 L230 300 Z", 1.4) + "\n" + circle(118, 300, 17, 1.3) + "\n" + circle(196, 300, 17, 1.3) + "\n" + path("M300 300 L300 268 Q300 246 330 244 L390 244 Q420 244 432 262 L432 300 Z", 1.4) + "\n" + circle(350, 300, 16, 1.3) + "\n" + circle(414, 300, 16, 1.3) },
      { firstStep: 3, svg: line(30, 330, 470, 330, 1.5) + "\n" + path("M60 300 L60 262 Q60 238 90 235 L150 235 Q175 235 185 248 L230 252 L230 300 Z", 1.4) + "\n" + circle(118, 300, 17, 1.3) + "\n" + circle(196, 300, 17, 1.3) + "\n" + path("M300 300 L300 268 Q300 246 330 244 L390 244 Q420 244 432 262 L432 300 Z", 1.4) + "\n" + circle(350, 300, 16, 1.3) + "\n" + circle(414, 300, 16, 1.3) + "\n" + ellipse(230, 168, 60, 26, 1.3) + "\n" + path("M80 250 L110 245 L140 250 L140 258 L80 258 Z", 1.0, "#E8EAF0") + "\n" + line(110, 260, 128, 260, 1.0) },
      { firstStep: 4, svg: line(30, 330, 470, 330, 1.5) + "\n" + path("M60 300 L60 262 Q60 238 90 235 L150 235 Q175 235 185 248 L230 252 L230 300 Z", 1.4) + "\n" + circle(118, 300, 17, 1.3) + "\n" + circle(196, 300, 17, 1.3) + "\n" + path("M300 300 L300 268 Q300 246 330 244 L390 244 Q420 244 432 262 L432 300 Z", 1.4) + "\n" + circle(350, 300, 16, 1.3) + "\n" + circle(414, 300, 16, 1.3) + "\n" + ellipse(230, 168, 60, 26, 1.3) + "\n" + path("M80 250 L110 245 L140 250 L140 258 L80 258 Z", 1.0, "#E8EAF0") + "\n" + line(110, 260, 128, 260, 1.0) + "\n" + label("5 分钟快稿 · 方案对比", 250, 60) },
    ],
  },
  {
    id: 13,
    elements: [
      { firstStep: 1, svg: BASE.ground() + "\n" + BASE.wheels() + "\n" + `<path d="${BODY_D}" fill="#D4CEC0" stroke="#6E6A61" stroke-width="1.2"/>` },
      { firstStep: 2, svg: BASE.ground() + "\n" + BASE.wheels() + "\n" + BASE.bodyFill() + "\n" + BASE.bodyRough() },
      { firstStep: 3, svg: BASE.ground() + "\n" + BASE.wheels() + "\n" + BASE.bodyFill() + "\n" + BASE.bodyRough() + "\n" + BASE.shoulder() },
      { firstStep: 4, svg: BASE.ground() + "\n" + BASE.groundShadow() + "\n" + BASE.wheels() + "\n" + BASE.bodyFill() + "\n" + BASE.bodyRough() + "\n" + BASE.shoulder() + "\n" + BASE.rocker() + "\n" + hatch(150, 240, 7, 14, 8, 40) },
      { firstStep: 5, svg: BASE.ground() + "\n" + BASE.groundShadow() + "\n" + BASE.wheels() + "\n" + BASE.bodyFill() + "\n" + BASE.bodyRough() + "\n" + BASE.shoulder() + "\n" + BASE.rocker() + "\n" + hatch(150, 240, 7, 14, 8, 40) + "\n" + strokePath("M110 160 Q250 146 420 160", 2.0, "#FBF9F3") + "\n" + label("先浅后深 · 叠色有度", 250, 60) },
    ],
  },
  {
    id: 14,
    elements: [
      { firstStep: 1, svg: BASE.ground() + "\n" + BASE.wheels() + "\n" + `<path d="${BODY_D}" fill="#D4CEC0" stroke="#6E6A61" stroke-width="1.2"/>` },
      { firstStep: 2, svg: BASE.ground() + "\n" + BASE.wheels() + "\n" + BASE.bodyFill() + "\n" + BASE.bodyRough() },
      { firstStep: 3, svg: BASE.ground() + "\n" + BASE.wheels() + "\n" + BASE.bodyFill() + "\n" + BASE.bodyRough() + "\n" + BASE.shoulder() },
      { firstStep: 4, svg: BASE.ground() + "\n" + BASE.groundShadow() + "\n" + BASE.wheels() + "\n" + BASE.bodyFill() + "\n" + BASE.bodyRough() + "\n" + BASE.shoulder() + "\n" + BASE.rocker() + "\n" + hatch(150, 240, 7, 14, 8, 40) },
      { firstStep: 5, svg: BASE.ground() + "\n" + BASE.groundShadow() + "\n" + BASE.wheels() + "\n" + BASE.bodyFill() + "\n" + BASE.bodyRough() + "\n" + BASE.shoulder() + "\n" + BASE.rocker() + "\n" + hatch(150, 240, 7, 14, 8, 40) + "\n" + line(240, 90, 310, 90, 1.5, "#8B909B") + "\n" + label("光源方向统一", 250, 60) },
    ],
  },
  {
    id: 15,
    elements: [
      { firstStep: 1, svg: path("M30 40 L470 40 L470 165 L30 165 Z", 0, "#D9DDE4", `fill-opacity="0.5"`) + "\n" + line(30, 165, 470, 165, 2.0, "#8B909B") + "\n" + label("天空", 60, 80, 14) },
      { firstStep: 2, svg: path("M30 40 L470 40 L470 165 L30 165 Z", 0, "#D9DDE4", `fill-opacity="0.5"`) + "\n" + line(30, 165, 470, 165, 2.0, "#8B909B") + "\n" + BASE.bodyFill() + "\n" + BASE.bodyRough() + "\n" + BASE.wheels() },
      { firstStep: 3, svg: path("M30 40 L470 40 L470 165 L30 165 Z", 0, "#D9DDE4", `fill-opacity="0.5"`) + "\n" + line(30, 165, 470, 165, 2.0, "#8B909B") + "\n" + BASE.bodyFill() + "\n" + BASE.bodyRough() + "\n" + BASE.wheels() + "\n" + path("M70 330 L440 330 L440 350 L70 350 Z", 0, "#D9DDE4", `fill-opacity="0.45"`) + "\n" + `<ellipse cx="${REAR_CX}" cy="332" rx="34" ry="6" fill="#6E6A61" opacity="0.45"/>` + "\n" + `<ellipse cx="${FRONT_CX}" cy="332" rx="34" ry="6" fill="#6E6A61" opacity="0.45"/>` },
      { firstStep: 4, svg: path("M30 40 L470 40 L470 165 L30 165 Z", 0, "#D9DDE4", `fill-opacity="0.5"`) + "\n" + line(30, 165, 470, 165, 2.0, "#8B909B") + "\n" + BASE.bodyFill() + "\n" + BASE.bodyRough() + "\n" + BASE.wheels() + "\n" + path("M70 330 L440 330 L440 350 L70 350 Z", 0, "#D9DDE4", `fill-opacity="0.45"`) + "\n" + `<ellipse cx="${REAR_CX}" cy="332" rx="34" ry="6" fill="#6E6A61" opacity="0.45"/>` + "\n" + `<ellipse cx="${FRONT_CX}" cy="332" rx="34" ry="6" fill="#6E6A61" opacity="0.45"/>` + "\n" + line(34, 250, 68, 250, 1.8, "#8B909B") + "\n" + line(28, 268, 62, 268, 1.8, "#8B909B") + "\n" + line(34, 286, 68, 286, 1.8, "#8B909B") + "\n" + strokePath("M96 200 Q250 186 430 200", 2.2, "#FBF9F3") + "\n" + label("快速表现图", 250, 60) },
    ],
  },
  {
    id: 16,
    elements: [
      { firstStep: 1, svg: BASE.groundShadow() + "\n" + BASE.wheels() + "\n" + BASE.bodyFill() + "\n" + BASE.bodyRough() + "\n" + BASE.glass() + "\n" + BASE.fenders() },
      { firstStep: 2, svg: BASE.groundShadow() + "\n" + BASE.wheels() + "\n" + BASE.bodyFill() + "\n" + BASE.bodyRough() + "\n" + BASE.glass() + "\n" + BASE.fenders() + "\n" + BASE.wheelStudy() },
      { firstStep: 3, svg: BASE.groundShadow() + "\n" + BASE.wheels() + "\n" + BASE.bodyFill() + "\n" + BASE.bodyRough() + "\n" + BASE.glass() + "\n" + BASE.fenders() + "\n" + BASE.wheelStudy() + "\n" + `<g transform="translate(36 44) scale(0.42)">` + path("M170 170 L330 170 Q350 170 350 186 L350 280 L150 280 L150 186 Q150 170 170 170 Z", 1.5) + circle(200, 210, 13, 1.3, "#E8EAF0") + circle(300, 210, 13, 1.3, "#E8EAF0") + line(185, 228, 315, 228, 1.6) + `</g>` },
      { firstStep: 4, svg: BASE.groundShadow() + "\n" + BASE.wheels() + "\n" + BASE.bodyFill() + "\n" + BASE.bodyRough() + "\n" + BASE.glass() + "\n" + BASE.fenders() + "\n" + BASE.wheelStudy() + "\n" + `<g transform="translate(36 44) scale(0.42)">` + path("M170 170 L330 170 Q350 170 350 186 L350 280 L150 280 L150 186 Q150 170 170 170 Z", 1.5) + circle(200, 210, 13, 1.3, "#E8EAF0") + circle(300, 210, 13, 1.3, "#E8EAF0") + line(185, 228, 315, 228, 1.6) + `</g>` + "\n" + `<g transform="translate(392 296)">` + path("M0 0 L96 0 L96 44 L0 44 Z", 1.2) + line(10, 16, 86, 16, 1.2) + line(10, 28, 60, 28, 1.0) + `</g>` },
      { firstStep: 5, svg: BASE.groundShadow() + "\n" + BASE.wheels() + "\n" + BASE.bodyFill() + "\n" + BASE.bodyRough() + "\n" + BASE.glass() + "\n" + BASE.fenders() + "\n" + BASE.rocker() + "\n" + BASE.shoulder() + "\n" + BASE.headlight() + "\n" + BASE.taillight() + "\n" + BASE.doorCut() + "\n" + BASE.handle() + "\n" + BASE.mirror() + "\n" + BASE.wheelStudy() + "\n" + `<g transform="translate(36 44) scale(0.42)">` + path("M170 170 L330 170 Q350 170 350 186 L350 280 L150 280 L150 186 Q150 170 170 170 Z", 1.5) + circle(200, 210, 13, 1.3, "#E8EAF0") + circle(300, 210, 13, 1.3, "#E8EAF0") + line(185, 228, 315, 228, 1.6) + `</g>` + "\n" + `<g transform="translate(392 296)">` + path("M0 0 L96 0 L96 44 L0 44 Z", 1.2) + line(10, 16, 86, 16, 1.2) + line(10, 28, 60, 28, 1.0) + `</g>` + "\n" + label("完整效果图", 250, 60) },
    ],
  },
  {
    id: 17,
    elements: [
      { firstStep: 1, svg: rough(BODY_D, 1.5) + "\n" + line(40, 330, 460, 330, 1.8) },
      { firstStep: 2, svg: rough(BODY_D, 1.5) + "\n" + line(40, 330, 460, 330, 1.8) + "\n" + `<path d="M176 200 L330 196 L356 240 L176 240 Z" fill="url(#gGlass)" stroke="#4A4D55" stroke-width="1.0"/>` },
      { firstStep: 3, svg: rough(BODY_D, 1.5) + "\n" + line(40, 330, 460, 330, 1.8) + "\n" + `<path d="M176 200 L330 196 L356 240 L176 240 Z" fill="url(#gGlass)" stroke="#4A4D55" stroke-width="1.0"/>` + "\n" + BASE.wheel(REAR_CX) + "\n" + BASE.wheel(FRONT_CX) + "\n" + BASE.fender(REAR_CX) + "\n" + BASE.fender(FRONT_CX) },
      { firstStep: 4, svg: rough(BODY_D, 1.5) + "\n" + line(40, 330, 460, 330, 1.8) + "\n" + `<path d="M176 200 L330 196 L356 240 L176 240 Z" fill="url(#gGlass)" stroke="#4A4D55" stroke-width="1.0"/>` + "\n" + BASE.wheel(REAR_CX) + "\n" + BASE.wheel(FRONT_CX) + "\n" + BASE.fender(REAR_CX) + "\n" + BASE.fender(FRONT_CX) + "\n" + line(60, 250, 460, 248, 1.8) + "\n" + `<path d="M380 196 L446 168 L460 190 L394 218 Z" fill="#D4CEC0" stroke="#565A63" stroke-width="1.2"/>` },
      { firstStep: 5, svg: BASE.ghost() + "\n" + `<path d="${BODY_D}" fill="url(#gBody)"/>` + "\n" + rough(BODY_D, 1.5) + "\n" + line(40, 330, 460, 330, 1.8) + "\n" + `<ellipse cx="250" cy="332" rx="230" ry="12" fill="url(#gGround)"/>` + "\n" + `<path d="M176 200 L330 196 L356 240 L176 240 Z" fill="url(#gGlass)" stroke="#4A4D55" stroke-width="1.0"/>` + "\n" + BASE.wheel(REAR_CX) + "\n" + BASE.wheel(FRONT_CX) + "\n" + BASE.fender(REAR_CX) + "\n" + BASE.fender(FRONT_CX) + "\n" + BASE.rocker() + "\n" + line(60, 250, 460, 248, 1.8) + "\n" + `<path d="M380 196 L446 168 L460 190 L394 218 Z" fill="#D4CEC0" stroke="#565A63" stroke-width="1.2"/>` + "\n" + BASE.gesture() + "\n" + BASE.wheelStudy() + "\n" + label("我的概念车", 250, 60) },
    ],
  },
  {
    id: 18,
    elements: [
      { firstStep: 1, svg: line(30, 330, 470, 330, 1.5) + "\n" + BASE.wheelCircle(110) + "\n" + BASE.wheelCircle(190) + "\n" + BASE.wheelCircle(320) + "\n" + BASE.wheelCircle(420) },
      { firstStep: 2, svg: line(30, 330, 470, 330, 1.5) + "\n" + `<g transform="translate(45 144) scale(0.5)">` + `<path d="${BODY_D}" fill="url(#gBody)"/>` + rough(BODY_D, 1.5) + BASE.wheel(REAR_CX) + BASE.wheel(FRONT_CX) + `</g>` },
      { firstStep: 3, svg: line(30, 330, 470, 330, 1.5) + "\n" + `<g transform="translate(45 144) scale(0.5)">` + `<path d="${BODY_D}" fill="url(#gBody)"/>` + rough(BODY_D, 1.5) + BASE.wheel(REAR_CX) + BASE.wheel(FRONT_CX) + `</g>` + "\n" + `<g transform="translate(238 100) scale(0.52)">` + `<path d="${BODY_D}" fill="url(#gBody)"/>` + rough(BODY_D, 1.5) + BASE.wheel(REAR_CX) + BASE.wheel(FRONT_CX) + `</g>` },
      { firstStep: 4, svg: line(30, 330, 470, 330, 1.5) + "\n" + `<g transform="translate(45 144) scale(0.5)">` + `<path d="${BODY_D}" fill="url(#gBody)"/>` + rough(BODY_D, 1.5) + BASE.wheel(REAR_CX) + BASE.wheel(FRONT_CX) + line(60, 250, 460, 248, 1.6) + `</g>` + "\n" + `<g transform="translate(238 100) scale(0.52)">` + `<path d="${BODY_D}" fill="url(#gBody)"/>` + rough(BODY_D, 1.5) + BASE.wheel(REAR_CX) + BASE.wheel(FRONT_CX) + line(60, 250, 460, 248, 1.6) + `</g>` + "\n" + label("轿车", 120, 320, 14) + "\n" + label("SUV", 380, 320, 14) + "\n" + label("同一张脸，不同的身", 250, 60) },
    ],
  },
  {
    id: 19,
    elements: [
      { firstStep: 1, svg: path("M30 40 L470 40 L470 320 L30 320 Z", 1.2) + "\n" + line(45, 70, 455, 70, 1.4) },
      { firstStep: 2, svg: path("M30 40 L470 40 L470 320 L30 320 Z", 1.2) + "\n" + line(45, 70, 455, 70, 1.4) + "\n" + `<g transform="translate(70 110) scale(0.62)">` + `<path d="${BODY_D}" fill="url(#gBody)"/>` + rough(BODY_D, 1.5) + BASE.wheel(REAR_CX) + BASE.wheel(FRONT_CX) + `</g>` },
      { firstStep: 3, svg: path("M30 40 L470 40 L470 320 L30 320 Z", 1.2) + "\n" + line(45, 70, 455, 70, 1.4) + "\n" + `<g transform="translate(70 110) scale(0.62)">` + `<path d="${BODY_D}" fill="url(#gBody)"/>` + rough(BODY_D, 1.5) + BASE.wheel(REAR_CX) + BASE.wheel(FRONT_CX) + `</g>` + "\n" + `<g transform="translate(392 120) scale(0.3)">` + path("M170 170 L330 170 Q350 170 350 186 L350 280 L150 280 L150 186 Q150 170 170 170 Z", 1.5) + circle(200, 210, 13, 1.3, "#E8EAF0") + circle(300, 210, 13, 1.3, "#E8EAF0") + line(185, 228, 315, 228, 1.6) + `</g>` + "\n" + dashLine(392, 150, 340, 150) },
      { firstStep: 4, svg: path("M30 40 L470 40 L470 320 L30 320 Z", 1.2) + "\n" + line(45, 70, 455, 70, 1.4) + "\n" + `<g transform="translate(70 110) scale(0.62)">` + `<path d="${BODY_D}" fill="url(#gBody)"/>` + rough(BODY_D, 1.5) + BASE.wheel(REAR_CX) + BASE.wheel(FRONT_CX) + `</g>` + "\n" + `<g transform="translate(392 120) scale(0.3)">` + path("M170 170 L330 170 Q350 170 350 186 L350 280 L150 280 L150 186 Q150 170 170 170 Z", 1.5) + circle(200, 210, 13, 1.3, "#E8EAF0") + circle(300, 210, 13, 1.3, "#E8EAF0") + line(185, 228, 315, 228, 1.6) + `</g>` + "\n" + dashLine(392, 150, 340, 150) + "\n" + line(60, 200, 200, 200, 1.2, "#8B909B") + "\n" + line(60, 216, 170, 216, 1.2, "#8B909B") + "\n" + line(60, 232, 185, 232, 1.2, "#8B909B") + "\n" + label("作品集排版", 250, 60) },
    ],
  },
  {
    id: 20,
    elements: [
      { firstStep: 1, svg: path("M90 120 L114 120 L114 144 L90 144 Z", 1.4) + "\n" + path("M250 120 L274 120 L274 144 L250 144 Z", 1.4) + "\n" + path("M410 120 L434 120 L434 144 L410 144 Z", 1.4) + "\n" + label("比例", 102, 166, 14) + "\n" + label("透视", 262, 166, 14) + "\n" + label("渲染", 422, 166, 14) },
      { firstStep: 2, svg: path("M90 120 L114 120 L114 144 L90 144 Z", 1.4) + "\n" + path("M250 120 L274 120 L274 144 L250 144 Z", 1.4) + "\n" + path("M410 120 L434 120 L434 144 L410 144 Z", 1.4) + "\n" + label("比例", 102, 166, 14) + "\n" + label("透视", 262, 166, 14) + "\n" + label("渲染", 422, 166, 14) + "\n" + path("M95 134 L101 140 L109 128", 1.6) + "\n" + path("M255 134 L261 140 L269 128", 1.6) + "\n" + path("M415 134 L421 140 L429 128", 1.6) },
      { firstStep: 3, svg: path("M90 120 L114 120 L114 144 L90 144 Z", 1.4) + "\n" + path("M250 120 L274 120 L274 144 L250 144 Z", 1.4) + "\n" + path("M410 120 L434 120 L434 144 L410 144 Z", 1.4) + "\n" + label("比例", 102, 166, 14) + "\n" + label("透视", 262, 166, 14) + "\n" + label("渲染", 422, 166, 14) + "\n" + path("M95 134 L101 140 L109 128", 1.6) + "\n" + path("M255 134 L261 140 L269 128", 1.6) + "\n" + path("M415 134 L421 140 L429 128", 1.6) + "\n" + `<g transform="translate(70 190) scale(0.48)">` + `<path d="${BODY_D}" fill="url(#gBody)"/>` + rough(BODY_D, 1.5) + `</g>` },
      { firstStep: 4, svg: path("M90 120 L114 120 L114 144 L90 144 Z", 1.4) + "\n" + path("M250 120 L274 120 L274 144 L250 144 Z", 1.4) + "\n" + path("M410 120 L434 120 L434 144 L410 144 Z", 1.4) + "\n" + label("比例", 102, 166, 14) + "\n" + label("透视", 262, 166, 14) + "\n" + label("渲染", 422, 166, 14) + "\n" + path("M95 134 L101 140 L109 128", 1.6) + "\n" + path("M255 134 L261 140 L269 128", 1.6) + "\n" + path("M415 134 L421 140 L429 128", 1.6) + "\n" + `<g transform="translate(70 190) scale(0.48)">` + `<path d="${BODY_D}" fill="url(#gBody)"/>` + rough(BODY_D, 1.5) + `</g>` + "\n" + line(200, 210, 420, 210, 1.2, "#8B909B") + "\n" + line(200, 228, 420, 228, 1.2, "#8B909B") + "\n" + line(200, 246, 420, 246, 1.2, "#8B909B") },
      { firstStep: 5, svg: path("M90 120 L114 120 L114 144 L90 144 Z", 1.4) + "\n" + path("M250 120 L274 120 L274 144 L250 144 Z", 1.4) + "\n" + path("M410 120 L434 120 L434 144 L410 144 Z", 1.4) + "\n" + label("比例", 102, 166, 14) + "\n" + label("透视", 262, 166, 14) + "\n" + label("渲染", 422, 166, 14) + "\n" + path("M95 134 L101 140 L109 128", 1.6) + "\n" + path("M255 134 L261 140 L269 128", 1.6) + "\n" + path("M415 134 L421 140 L429 128", 1.6) + "\n" + `<g transform="translate(70 190) scale(0.48)">` + `<path d="${BODY_D}" fill="url(#gBody)"/>` + rough(BODY_D, 1.5) + `</g>` + "\n" + line(200, 210, 420, 210, 1.2, "#8B909B") + "\n" + line(200, 228, 420, 228, 1.2, "#8B909B") + "\n" + line(200, 246, 420, 246, 1.2, "#8B909B") + "\n" + label("写下三条最该练的", 250, 60) },
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
