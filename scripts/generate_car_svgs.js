#!/usr/bin/env node
// 生成 155 张课程步骤插画（SVG）— 以真实车型（紧凑型电动轿车）轮廓为底稿的速写
// 覆盖 32 课：比例/透视/视角/设计语言/渲染/创作/作品集/写生/材质/专业技法/CAS
import { mkdirSync, writeFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const ROOT = join(dirname(fileURLToPath(import.meta.url)), "..");
const OUT_DIR = join(ROOT, "assets", "illustrations");

const INK = "#3A3C42";
const INK_SOFT = "#6C707A";
const PAPER = "#F1E9DB";
const GRID_MINOR = "#B9C8DC";
const GRID_MAJOR = "#9FB2CC";
const CONSTRUCTION = "#6B8FC2";

const DEFS = `<defs>
<linearGradient id="gBody" x1="0" y1="0" x2="0" y2="1"><stop offset="0%" stop-color="#FBF9F3"/><stop offset="18%" stop-color="#E9E4D8"/><stop offset="55%" stop-color="#C9C2B2"/><stop offset="100%" stop-color="#9C9484"/></linearGradient>
<linearGradient id="gGlass" x1="0" y1="0" x2="0" y2="1"><stop offset="0%" stop-color="#55585F"/><stop offset="100%" stop-color="#7B7F88"/></linearGradient>
<radialGradient id="gTire" cx="0.5" cy="0.5" r="0.5"><stop offset="0%" stop-color="#4A4E55"/><stop offset="75%" stop-color="#2D3036"/><stop offset="100%" stop-color="#202227"/></radialGradient>
<radialGradient id="gRim" cx="0.5" cy="0.5" r="0.5"><stop offset="0%" stop-color="#F3F2EC"/><stop offset="70%" stop-color="#C6C1B4"/><stop offset="100%" stop-color="#A39C8D"/></radialGradient>
<radialGradient id="gGround" cx="0.5" cy="0.5" r="0.5"><stop offset="0%" stop-color="#8A8478" stop-opacity="0.34"/><stop offset="100%" stop-color="#8A8478" stop-opacity="0"/></radialGradient>
<radialGradient id="gMetal" cx="0.5" cy="0.36" r="0.66"><stop offset="0%" stop-color="#FDFCF8"/><stop offset="24%" stop-color="#D4CFC2"/><stop offset="48%" stop-color="#8B8478"/><stop offset="66%" stop-color="#3A3C42"/><stop offset="82%" stop-color="#B9B3A6"/><stop offset="100%" stop-color="#6E6A61"/></radialGradient>
<radialGradient id="gMatte" cx="0.5" cy="0.42" r="0.62"><stop offset="0%" stop-color="#EFEDE6"/><stop offset="55%" stop-color="#B9B4A8"/><stop offset="100%" stop-color="#7D786E"/></radialGradient>
<radialGradient id="gGlassBall" cx="0.36" cy="0.32" r="0.7"><stop offset="0%" stop-color="#FBF9F3" stop-opacity="0.2"/><stop offset="55%" stop-color="#7B7F88" stop-opacity="0.1"/><stop offset="100%" stop-color="#3A3C42" stop-opacity="0.38"/></radialGradient>
<linearGradient id="gTonePaper" x1="0" y1="0" x2="0" y2="1"><stop offset="0%" stop-color="#D6D0C2"/><stop offset="100%" stop-color="#BCB5A5"/></linearGradient>
<linearGradient id="gScreen" x1="0" y1="0" x2="0" y2="1"><stop offset="0%" stop-color="#41444C"/><stop offset="100%" stop-color="#22242A"/></linearGradient>
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
function gridPaper() {
  const minor = [];
  const major = [];
  for (let x = 25; x < 500; x += 25) {
    minor.push(`<line x1="${x}" y1="0" x2="${x}" y2="360" stroke="${GRID_MINOR}" stroke-width="0.5" opacity="0.5"/>`);
  }
  for (let y = 25; y < 360; y += 25) {
    minor.push(`<line x1="0" y1="${y}" x2="500" y2="${y}" stroke="${GRID_MINOR}" stroke-width="0.5" opacity="0.5"/>`);
  }
  for (let x = 125; x < 500; x += 125) {
    major.push(`<line x1="${x}" y1="0" x2="${x}" y2="360" stroke="${GRID_MAJOR}" stroke-width="0.9" opacity="0.65"/>`);
  }
  for (let y = 125; y < 360; y += 125) {
    major.push(`<line x1="0" y1="${y}" x2="500" y2="${y}" stroke="${GRID_MAJOR}" stroke-width="0.9" opacity="0.65"/>`);
  }
  return (
    `<rect x="0" y="0" width="500" height="360" fill="${PAPER}"/>` +
    "\n" + minor.join("\n") +
    "\n" + major.join("\n")
  );
}
function proUnderlay(id) {
  const guides = [];
  guides.push(`<line x1="24" y1="329" x2="476" y2="329" stroke="${CONSTRUCTION}" stroke-width="1.0" stroke-dasharray="10 7" opacity="0.7"/>`);
  const wheelGuideLessons = new Set([1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 21, 22, 26, 27, 28]);
  if (wheelGuideLessons.has(id)) {
    for (const cx of [REAR_CX, FRONT_CX]) {
      guides.push(`<circle cx="${cx}" cy="${WHEEL_CY}" r="29" stroke="${CONSTRUCTION}" stroke-width="0.9" fill="none" opacity="0.6"/>`);
      guides.push(`<line x1="${cx - 33}" y1="${WHEEL_CY}" x2="${cx + 33}" y2="${WHEEL_CY}" stroke="${CONSTRUCTION}" stroke-width="0.8" opacity="0.5"/>`);
      guides.push(`<line x1="${cx}" y1="${WHEEL_CY - 33}" x2="${cx}" y2="${WHEEL_CY + 33}" stroke="${CONSTRUCTION}" stroke-width="0.8" opacity="0.5"/>`);
    }
    guides.push(`<line x1="${REAR_CX}" y1="${WHEEL_CY}" x2="${FRONT_CX}" y2="${WHEEL_CY}" stroke="${CONSTRUCTION}" stroke-width="0.8" stroke-dasharray="6 5" opacity="0.45"/>`);
  }
  if (id === 29) {
    guides.push(`<line x1="60" y1="212" x2="440" y2="212" stroke="${CONSTRUCTION}" stroke-width="1.0" stroke-dasharray="10 7" opacity="0.7"/>`);
  }
  return gridPaper() + "\n" + guides.join("\n");
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
    out.push(`<line x1="${(jx).toFixed(1)}" y1="${(jy).toFixed(1)}" x2="${(jx + dx * len).toFixed(1)}" y2="${(jy + dy * len).toFixed(1)}" ${stroke(1.3, "#555B66")} opacity="0.95"/>`);
  }
  return out.join("\n");
}
function crossHatch(x, y, n, len, gap, angleDeg = 45) {
  return hatch(x, y, n, len, gap, angleDeg) + "\n" + hatch(x + gap * 0.5, y + gap * 0.5, n, len, gap, -angleDeg);
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

function spokes(cx, cy, r = 17, w = 1.5) {
  const arms = [0, 45, 90, 135, 180, 225, 270, 315];
  return arms
    .map((a) => {
      const rad = (a * Math.PI) / 180;
      return `<line x1="${cx}" y1="${cy}" x2="${(cx + r * Math.cos(rad)).toFixed(1)}" y2="${(cy + r * Math.sin(rad)).toFixed(1)}" stroke="#4A4E56" stroke-width="${w + 0.3}" stroke-linecap="round"/>`;
    })
    .join("");
}

const BASE = {
  ground: () => line(24, GROUND_Y, 476, GROUND_Y, 1.7),
  groundShadow: () => `<ellipse cx="250" cy="${GROUND_Y + 7}" rx="230" ry="13" fill="url(#gGround)"/>` + "\n" + `<ellipse cx="250" cy="${GROUND_Y + 9}" rx="210" ry="9" fill="#6E6A61" opacity="0.22"/>`,
  wheelCircle: (cx) =>
    `<circle cx="${cx}" cy="${WHEEL_CY}" r="${WHEEL_R}" stroke="#5F646E" stroke-width="1.5" fill="none"/>` +
    "\n" + line(cx - WHEEL_R, WHEEL_CY, cx + WHEEL_R, WHEEL_CY, 0.9, "#8B909B") +
    "\n" + line(cx, WHEEL_CY - WHEEL_R, cx, WHEEL_CY + WHEEL_R, 0.9, "#8B909B") +
    "\n" + `<circle cx="${cx}" cy="${WHEEL_CY}" r="2.2" fill="#5F646E"/>`,
  tire: (cx) => {
    const ticks = [];
    for (let a = 0; a < 360; a += 30) {
      const rad = (a * Math.PI) / 180;
      const r1 = WHEEL_R - 5;
      const r2 = WHEEL_R - 1;
      ticks.push(`<line x1="${(cx + r1 * Math.cos(rad)).toFixed(1)}" y1="${(WHEEL_CY + r1 * Math.sin(rad)).toFixed(1)}" x2="${(cx + r2 * Math.cos(rad)).toFixed(1)}" y2="${(WHEEL_CY + r2 * Math.sin(rad)).toFixed(1)}" stroke="#8B8F98" stroke-width="1.2" opacity="0.7"/>`);
    }
    return (
      `<circle cx="${cx}" cy="${WHEEL_CY}" r="${WHEEL_R}" fill="url(#gTire)"/>` +
      "\n" + ticks.join("\n") +
      "\n" + `<path d="M${cx - 27} ${WHEEL_CY - 11} Q${cx} ${WHEEL_CY - 28} ${cx + 27} ${WHEEL_CY - 11}" stroke="#8B8F98" stroke-width="2.0" fill="none" stroke-linecap="round" opacity="0.8"/>`
    );
  },
  rim: (cx) => `<circle cx="${cx}" cy="${WHEEL_CY}" r="18" fill="url(#gRim)" stroke="#4A4E56" stroke-width="1.5"/>`,
  disc: (cx) => `<circle cx="${cx}" cy="${WHEEL_CY}" r="8.5" fill="#DDD8CB"/>`,
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
    "\n" + line(253, 181, 253, 241, 1.0, "#3E4148") +
    "\n" + strokePath("M168 204 L206 196", 1.3, "#FBF9F3") +
    "\n" + strokePath("M176 218 L220 208", 1.0, "#FBF9F3"),
  rocker: () =>
    `<path d="M152 299 L368 299 L368 292 Q260 288 152 292 Z" fill="#8A8478" opacity="0.34"/>` +
    "\n" + hatch(230, 292, 6, 12, 8, 45),
  shoulder: () =>
    strokePath("M66 256 Q250 240 434 256", 2.0, "#6E6A61") +
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
  contour: () =>
    strokePath(BODY_D, 2.6) +
    "\n" + strokePath(BODY_D, 1.7, "#5B5E66") +
    "\n" + strokePath(BODY_D, 1.1, INK) +
    "\n" + strokePath("M66 256 Q250 240 434 256", 1.5, INK),
  outlineLight: () =>
    strokePath(BODY_D, 1.9, INK) +
    "\n" + strokePath(BODY_D, 1.2, "#5B5E66"),
};

// ============ 专业技法辅助 ============
function softEllipse(cx, cy, rx, ry, color, opacity) {
  return `<ellipse cx="${cx}" cy="${cy}" rx="${rx}" ry="${ry}" fill="${color}" opacity="${opacity}"/>`;
}
function markerSwipe(d, color = "#8B8478", w = 14, opacity = 0.16) {
  return `<path d="${d}" stroke="${color}" stroke-width="${w}" stroke-linecap="round" stroke-linejoin="round" fill="none" opacity="${opacity}"/>`;
}
function lightArrow(x1, y1, x2, y2) {
  const dx = x2 - x1;
  const dy = y2 - y1;
  const len = Math.hypot(dx, dy);
  const ux = dx / len;
  const uy = dy / len;
  const px = -uy;
  const py = ux;
  const hx = x2 - ux * 14;
  const hy = y2 - uy * 14;
  return (
    `<line x1="${x1}" y1="${y1}" x2="${x2}" y2="${y2}" ${stroke(1.6, "#8B8478")}/>` +
    `<line x1="${(hx + px * 7).toFixed(1)}" y1="${(hy + py * 7).toFixed(1)}" x2="${x2}" y2="${y2}" ${stroke(1.6, "#8B8478")}/>` +
    `<line x1="${(hx - px * 7).toFixed(1)}" y1="${(hy - py * 7).toFixed(1)}" x2="${x2}" y2="${y2}" ${stroke(1.6, "#8B8478")}/>`
  );
}
function checkMark(x, y, s = 9) {
  return `<path d="M${x - s} ${y} L${x - s * 0.3} ${y + s * 0.75} L${x + s} ${y - s * 0.7}" ${stroke(2.2, "#4A4E56")} fill="none"/>`;
}
function panel(x, y, w, h, labelText = "") {
  const out = `<rect x="${x}" y="${y}" width="${w}" height="${h}" fill="#FFFFFF" opacity="0.45" stroke="#9A9488" stroke-width="1.1"/>`;
  return labelText
    ? out + `\n<text x="${x + w / 2}" y="${y + h - 6}" text-anchor="middle" font-size="12" font-family="'Microsoft YaHei', sans-serif" fill="${INK_SOFT}">${labelText}</text>`
    : out;
}
function miniCar(x, y, s = 0.5) {
  return `<g transform="translate(${x} ${y}) scale(${s})">` + `<path d="${BODY_D}" fill="url(#gBody)"/>` + rough(BODY_D, 1.5) + BASE.wheel(REAR_CX) + BASE.wheel(FRONT_CX) + `</g>`;
}
function screenCanvas(x, y, w, h) {
  return `<rect x="${x}" y="${y}" width="${w}" height="${h}" rx="8" fill="url(#gScreen)" stroke="#3A3C42" stroke-width="1.4"/>`;
}

// 内饰速写元素（一点透视内饰）
const INT_BASE = {
  windshield: () =>
    path("M96 172 Q250 152 404 172 L380 132 Q250 118 120 132 Z", 1.2) +
    "\n" + strokePath("M118 140 Q250 126 382 140", 0.9, "#8B909B") +
    "\n" + strokePath("M108 160 Q250 146 392 160", 0.8, "#8B909B"),
  dash: () => path("M74 212 L426 212 L404 172 Q250 152 96 172 Z", 1.6),
  screen: () =>
    path("M190 190 L310 190 L314 210 L186 210 Z", 1.2, "url(#gScreen)") +
    "\n" + strokePath("M194 194 L304 194 L306 204 L192 204 Z", 0.8, "#8B909B") +
    "\n" + strokePath("M202 196 L238 192", 1.0, "#FBF9F3"),
  wheel: () =>
    `<ellipse cx="250" cy="244" rx="40" ry="13" stroke="${INK}" stroke-width="2.2" fill="none"/>` +
    "\n" + `<ellipse cx="250" cy="244" rx="38" ry="11.5" stroke="#8B909B" stroke-width="0.8" fill="none"/>` +
    "\n" + line(220, 241, 280, 247, 2.0, INK) +
    "\n" + line(250, 231, 250, 257, 1.6, INK) +
    "\n" + `<circle cx="250" cy="244" r="4" fill="#4A4E56"/>` +
    "\n" + strokePath("M216 238 Q250 226 284 236", 1.0, "#FBF9F3"),
  column: () => line(250, 257, 250, 216, 2.2),
  vent: (x) =>
    line(x, 226, x + 46, 224, 1.4) +
    "\n" + line(x, 232, x + 46, 230, 1.1) +
    "\n" + line(x + 15, 225, x + 15, 231, 0.9) +
    "\n" + line(x + 30, 225, x + 30, 231, 0.9),
  seat: (x) =>
    `<path d="M${x} 300 L${x + 46} 300 L${x + 46} 268 Q${x + 46} 252 ${x + 30} 252 L${x + 16} 252 Q${x} 252 ${x} 268 Z" stroke="${INK}" stroke-width="1.6" fill="none"/>` +
    "\n" + `<path d="M${x + 2} 254 L${x + 10} 238 L${x + 28} 238 L${x + 28} 254 Z" stroke="${INK}" stroke-width="1.2" fill="none"/>` +
    "\n" + line(x + 8, 300, x + 8, 264, 1.2) +
    "\n" + line(x + 20, 300, x + 20, 258, 1.2) +
    "\n" + line(x + 32, 300, x + 32, 260, 1.2) +
    "\n" + dashLine(x + 14, 262, x + 14, 292, 0.8) +
    "\n" + dashLine(x + 26, 260, x + 26, 292, 0.8),
  dial: (cx, cy, r) =>
    `<circle cx="${cx}" cy="${cy}" r="${r}" stroke="${INK}" stroke-width="1.3" fill="none"/>` +
    "\n" + `<circle cx="${cx}" cy="${cy}" r="${(r * 0.6).toFixed(1)}" stroke="#8B909B" stroke-width="0.8" fill="none"/>` +
    "\n" + line(cx - r * 0.7, cy, cx + r * 0.7, cy, 0.9, "#8B909B") +
    "\n" + line(cx, cy - r * 0.7, cx, cy + r * 0.7, 0.9, "#8B909B") +
    "\n" + line(cx, cy, cx + r * 0.55, cy - r * 0.45, 1.4, "#B3483A"),
};

// ============ 31 课插画 ============
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
  {
    id: 21,
    elements: [
      { firstStep: 1, svg: panel(24, 22, 118, 72, "参考照片") + "\n" + miniCar(38, 36, 0.15) + "\n" + line(60, 322, 480, 322, 1.5) + "\n" + path("M60 160 L470 160 L470 306 L60 306 Z", 1.0, "none", 'stroke-dasharray="8 6"') + "\n" + BASE.wheelCircle(REAR_CX) + "\n" + BASE.wheelCircle(FRONT_CX) + "\n" + label("先框比例：轮距 · 车高 · 轴距", 295, 60) },
      { firstStep: 2, svg: panel(24, 22, 118, 72, "参考照片") + "\n" + miniCar(38, 36, 0.15) + "\n" + line(60, 322, 480, 322, 1.5) + "\n" + path("M60 160 L470 160 L470 306 L60 306 Z", 1.0, "none", 'stroke-dasharray="8 6"') + "\n" + rough(BODY_D, 1.5) + "\n" + `<path d="${GLASS_D}" fill="url(#gGlass)" stroke="#4A4D55" stroke-width="1.0"/>` + "\n" + BASE.wheel(REAR_CX) + "\n" + BASE.wheel(FRONT_CX) + "\n" + label("轮子与地面线锁定姿态", 295, 60) },
      { firstStep: 3, svg: panel(24, 22, 118, 72, "参考照片") + "\n" + miniCar(38, 36, 0.15) + "\n" + line(60, 322, 480, 322, 1.5) + "\n" + rough(BODY_D, 1.5) + "\n" + `<path d="${GLASS_D}" fill="url(#gGlass)" stroke="#4A4D55" stroke-width="1.0"/>` + "\n" + BASE.wheel(REAR_CX) + "\n" + BASE.wheel(FRONT_CX) + "\n" + BASE.fenders() + "\n" + BASE.rocker() + "\n" + BASE.shoulder() + "\n" + label("大面轮廓一笔带过", 295, 60) },
      { firstStep: 4, svg: panel(24, 22, 118, 72, "参考照片") + "\n" + miniCar(38, 36, 0.15) + "\n" + line(60, 322, 480, 322, 1.5) + "\n" + rough(BODY_D, 1.5) + "\n" + `<path d="${GLASS_D}" fill="url(#gGlass)" stroke="#4A4D55" stroke-width="1.0"/>` + "\n" + BASE.wheel(REAR_CX) + "\n" + BASE.wheel(FRONT_CX) + "\n" + BASE.fenders() + "\n" + BASE.rocker() + "\n" + BASE.shoulder() + "\n" + BASE.doorCut() + "\n" + BASE.handle() + "\n" + BASE.mirror() + "\n" + BASE.headlight() + "\n" + BASE.taillight() + "\n" + label("刻画分件：窗线 · 腰线 · 门缝", 295, 60) },
      { firstStep: 5, svg: panel(24, 22, 118, 72, "参考照片") + "\n" + miniCar(38, 36, 0.15) + "\n" + line(60, 322, 480, 322, 1.5) + "\n" + `<ellipse cx="250" cy="330" rx="220" ry="12" fill="url(#gGround)"/>` + "\n" + `<path d="${BODY_D}" fill="url(#gBody)"/>` + "\n" + rough(BODY_D, 1.5) + "\n" + `<path d="${GLASS_D}" fill="url(#gGlass)" stroke="#4A4D55" stroke-width="1.0"/>` + "\n" + BASE.wheel(REAR_CX) + "\n" + BASE.wheel(FRONT_CX) + "\n" + BASE.fenders() + "\n" + BASE.rocker() + "\n" + BASE.shoulder() + "\n" + BASE.doorCut() + "\n" + BASE.handle() + "\n" + BASE.mirror() + "\n" + BASE.headlight() + "\n" + BASE.taillight() + "\n" + crossHatch(120, 272, 8, 16, 8, 35) + "\n" + crossHatch(300, 268, 8, 16, 8, 35) + "\n" + label("收线定型，擦淡辅助线", 295, 60) },
    ],
  },
  {
    id: 22,
    elements: [
      { firstStep: 1, svg: rough(BODY_D, 1.5) + "\n" + `<path d="${GLASS_D}" fill="url(#gGlass)" stroke="#4A4D55" stroke-width="1.0"/>` + "\n" + BASE.wheel(REAR_CX) + "\n" + BASE.wheel(FRONT_CX) + "\n" + line(60, 322, 480, 322, 1.5) + "\n" + lightArrow(96, 88, 178, 124) + "\n" + label("光源", 86, 82, 14) },
      { firstStep: 2, svg: rough(BODY_D, 1.5) + "\n" + `<path d="${GLASS_D}" fill="url(#gGlass)" stroke="#4A4D55" stroke-width="1.0"/>` + "\n" + BASE.wheel(REAR_CX) + "\n" + BASE.wheel(FRONT_CX) + "\n" + line(60, 322, 480, 322, 1.5) + "\n" + lightArrow(96, 88, 178, 124) + "\n" + label("光源", 86, 82, 14) + "\n" + `<ellipse cx="250" cy="330" rx="220" ry="12" fill="url(#gGround)"/>` + "\n" + softEllipse(250, 284, 214, 30, "#6E6A61", 0.24) + "\n" + hatch(120, 272, 8, 16, 9, 35) + "\n" + hatch(300, 268, 8, 16, 9, 35) + "\n" + label("先铺暗部大调子", 250, 60) },
      { firstStep: 3, svg: rough(BODY_D, 1.5) + "\n" + `<path d="${GLASS_D}" fill="url(#gGlass)" stroke="#4A4D55" stroke-width="1.0"/>` + "\n" + BASE.wheel(REAR_CX) + "\n" + BASE.wheel(FRONT_CX) + "\n" + line(60, 322, 480, 322, 1.5) + "\n" + lightArrow(96, 88, 178, 124) + "\n" + label("光源", 86, 82, 14) + "\n" + `<ellipse cx="250" cy="330" rx="220" ry="12" fill="url(#gGround)"/>` + "\n" + softEllipse(250, 284, 214, 30, "#6E6A61", 0.24) + "\n" + hatch(120, 272, 8, 16, 9, 35) + "\n" + hatch(300, 268, 8, 16, 9, 35) + "\n" + path("M66 250 Q250 234 434 250", 2.6, "none", 'opacity="0.55"') + "\n" + BASE.fenders() + "\n" + label("加重转折与明暗交界线", 250, 60) },
      { firstStep: 4, svg: rough(BODY_D, 1.5) + "\n" + `<path d="${GLASS_D}" fill="url(#gGlass)" stroke="#4A4D55" stroke-width="1.0"/>` + "\n" + BASE.wheel(REAR_CX) + "\n" + BASE.wheel(FRONT_CX) + "\n" + line(60, 322, 480, 322, 1.5) + "\n" + lightArrow(96, 88, 178, 124) + "\n" + label("光源", 86, 82, 14) + "\n" + `<ellipse cx="250" cy="330" rx="220" ry="12" fill="url(#gGround)"/>` + "\n" + softEllipse(250, 284, 214, 30, "#6E6A61", 0.24) + "\n" + hatch(120, 272, 8, 16, 9, 35) + "\n" + hatch(300, 268, 8, 16, 9, 35) + "\n" + path("M66 250 Q250 234 434 250", 2.6, "none", 'opacity="0.55"') + "\n" + BASE.fenders() + "\n" + strokePath("M70 296 Q250 286 430 296", 1.4, "#FBF9F3") + "\n" + label("反光", 432, 290, 13) + "\n" + label("加反光与投影", 250, 60) },
      { firstStep: 5, svg: rough(BODY_D, 1.5) + "\n" + `<path d="${GLASS_D}" fill="url(#gGlass)" stroke="#4A4D55" stroke-width="1.0"/>` + "\n" + BASE.wheel(REAR_CX) + "\n" + BASE.wheel(FRONT_CX) + "\n" + line(60, 322, 480, 322, 1.5) + "\n" + lightArrow(96, 88, 178, 124) + "\n" + label("光源", 86, 82, 14) + "\n" + `<ellipse cx="250" cy="330" rx="220" ry="12" fill="url(#gGround)"/>` + "\n" + softEllipse(250, 284, 214, 30, "#6E6A61", 0.24) + "\n" + hatch(120, 272, 8, 16, 9, 35) + "\n" + hatch(300, 268, 8, 16, 9, 35) + "\n" + path("M66 250 Q250 234 434 250", 2.6, "none", 'opacity="0.55"') + "\n" + BASE.fenders() + "\n" + strokePath("M70 296 Q250 286 430 296", 1.4, "#FBF9F3") + "\n" + label("反光", 432, 290, 13) + "\n" + strokePath("M96 198 Q250 182 430 196", 2.0, "#FBF9F3") + "\n" + crossHatch(120, 272, 8, 16, 8, 35) + "\n" + crossHatch(300, 268, 8, 16, 8, 35) + "\n" + label("黑白灰层次，完成写生", 250, 60) },
    ],
  },
  {
    id: 23,
    elements: [
      { firstStep: 1, svg: line(166, 40, 166, 320, 1.0, "#9A9488") + "\n" + line(333, 40, 333, 320, 1.0, "#9A9488") + "\n" + line(40, 120, 460, 120, 1.0, "#9A9488") + "\n" + line(40, 240, 460, 240, 1.0, "#9A9488") + "\n" + miniCar(120, 150, 0.5) + "\n" + label("九宫格：主体放在交叉点附近", 250, 60) },
      { firstStep: 2, svg: line(166, 40, 166, 320, 1.0, "#9A9488") + "\n" + line(333, 40, 333, 320, 1.0, "#9A9488") + "\n" + line(40, 120, 460, 120, 1.0, "#9A9488") + "\n" + line(40, 240, 460, 240, 1.0, "#9A9488") + "\n" + miniCar(120, 150, 0.5) + "\n" + lightArrow(360, 232, 448, 124) + "\n" + circle(422, 88, 32, 1.0, "none", 'stroke-dasharray="5 5"') + "\n" + label("视线方向留白", 250, 60) },
      { firstStep: 3, svg: panel(40, 90, 290, 220, "主图") + "\n" + miniCar(52, 160, 0.45) + "\n" + panel(350, 90, 130, 95, "轮毂放大") + "\n" + `<g transform="translate(362 98)">` + `<circle cx="46" cy="46" r="30" fill="url(#gTire)"/>` + `<path d="M20 38 Q46 27 72 38" stroke="#8B8F98" stroke-width="1.8" fill="none" stroke-linecap="round" opacity="0.85"/>` + `<circle cx="46" cy="46" r="18" fill="url(#gRim)" stroke="#5B5E66" stroke-width="1.1"/>` + `<circle cx="46" cy="46" r="11" fill="#DDD8CB"/>` + spokes(46, 46, 14, 1.5) + `<circle cx="46" cy="46" r="3.4" fill="#4A4E56"/>` + `</g>` + "\n" + panel(350, 205, 130, 95, "前脸放大") + "\n" + path("M372 226 L404 222 L404 240 L376 242 Z", 1.5, "url(#gGlass)") + "\n" + strokePath("M376 230 L392 228", 1.1, "#FBF9F3") + "\n" + line(338, 190, 346, 190, 1.2, "#8B909B") + "\n" + label("主图 + 细节图组合", 250, 60) },
      { firstStep: 4, svg: panel(40, 90, 290, 220, "主图") + "\n" + miniCar(52, 160, 0.45) + "\n" + panel(350, 90, 130, 95, "轮毂放大") + "\n" + `<g transform="translate(362 98)">` + `<circle cx="46" cy="46" r="30" fill="url(#gTire)"/>` + `<path d="M20 38 Q46 27 72 38" stroke="#8B8F98" stroke-width="1.8" fill="none" stroke-linecap="round" opacity="0.85"/>` + `<circle cx="46" cy="46" r="18" fill="url(#gRim)" stroke="#5B5E66" stroke-width="1.1"/>` + `<circle cx="46" cy="46" r="11" fill="#DDD8CB"/>` + spokes(46, 46, 14, 1.5) + `<circle cx="46" cy="46" r="3.4" fill="#4A4E56"/>` + `</g>` + "\n" + panel(350, 205, 130, 95, "前脸放大") + "\n" + path("M372 226 L404 222 L404 240 L376 242 Z", 1.5, "url(#gGlass)") + "\n" + strokePath("M376 230 L392 228", 1.1, "#FBF9F3") + "\n" + line(338, 190, 346, 190, 1.2, "#8B909B") + "\n" + line(60, 330, 150, 330, 1.2, "#8B909B") + "\n" + line(60, 324, 60, 336, 1.2, "#8B909B") + "\n" + line(150, 324, 150, 336, 1.2, "#8B909B") + "\n" + label("1:10", 105, 320, 11) + "\n" + line(360, 330, 450, 330, 1.2, "#8B909B") + "\n" + label("签名", 405, 320, 11) + "\n" + label("标注 · 比例尺 · 签名栏", 250, 60) },
      { firstStep: 5, svg: panel(40, 90, 290, 220, "主图") + "\n" + miniCar(52, 160, 0.45) + "\n" + panel(350, 90, 130, 95, "轮毂放大") + "\n" + `<g transform="translate(362 98)">` + `<circle cx="46" cy="46" r="30" fill="url(#gTire)"/>` + `<path d="M20 38 Q46 27 72 38" stroke="#8B8F98" stroke-width="1.8" fill="none" stroke-linecap="round" opacity="0.85"/>` + `<circle cx="46" cy="46" r="18" fill="url(#gRim)" stroke="#5B5E66" stroke-width="1.1"/>` + `<circle cx="46" cy="46" r="11" fill="#DDD8CB"/>` + spokes(46, 46, 14, 1.5) + `<circle cx="46" cy="46" r="3.4" fill="#4A4E56"/>` + `</g>` + "\n" + panel(350, 205, 130, 95, "前脸放大") + "\n" + path("M372 226 L404 222 L404 240 L376 242 Z", 1.5, "url(#gGlass)") + "\n" + strokePath("M376 230 L392 228", 1.1, "#FBF9F3") + "\n" + line(338, 190, 346, 190, 1.2, "#8B909B") + "\n" + line(60, 330, 150, 330, 1.2, "#8B909B") + "\n" + line(60, 324, 60, 336, 1.2, "#8B909B") + "\n" + line(150, 324, 150, 336, 1.2, "#8B909B") + "\n" + label("1:10", 105, 320, 11) + "\n" + line(360, 330, 450, 330, 1.2, "#8B909B") + "\n" + label("签名", 405, 320, 11) + "\n" + checkMark(24, 80, 8) + "\n" + label("构图与版面 · 完成", 250, 60) },
    ],
  },
  {
    id: 24,
    elements: [
      { firstStep: 1, svg: line(60, 292, 440, 292, 1.5) + "\n" + circle(180, 180, 74, 1.6) + "\n" + lightArrow(88, 88, 146, 146) + "\n" + label("光源", 78, 82, 14) + "\n" + label("金属球写生：球体 + 光源", 250, 60) },
      { firstStep: 2, svg: line(60, 292, 440, 292, 1.5) + "\n" + `<circle cx="180" cy="180" r="74" fill="url(#gMetal)"/>` + "\n" + `<ellipse cx="180" cy="296" rx="64" ry="9" fill="url(#gGround)"/>` + "\n" + label("高反差明暗：暗部深、反光强", 250, 60) },
      { firstStep: 3, svg: line(60, 292, 440, 292, 1.5) + "\n" + `<circle cx="180" cy="180" r="74" fill="url(#gMetal)"/>` + "\n" + `<ellipse cx="180" cy="296" rx="64" ry="9" fill="url(#gGround)"/>` + "\n" + softEllipse(180, 226, 50, 18, "#8B8478", 0.3) + "\n" + strokePath("M126 220 Q180 250 234 220", 7, "#B9B3A6", "none") + "\n" + label("环境反光带 + 落地投影", 250, 60) },
      { firstStep: 4, svg: line(60, 292, 440, 292, 1.5) + "\n" + `<circle cx="180" cy="180" r="74" fill="url(#gMetal)"/>` + "\n" + `<ellipse cx="180" cy="296" rx="64" ry="9" fill="url(#gGround)"/>` + "\n" + softEllipse(180, 226, 50, 18, "#8B8478", 0.3) + "\n" + strokePath("M126 220 Q180 250 234 220", 7, "#B9B3A6", "none") + "\n" + path("M116 217 A74 74 0 0 0 236 132", 5, "none", 'opacity="0.32"') + "\n" + softEllipse(180, 180, 38, 24, "#3A3C42", 0.16) + "\n" + label("压深暗部，强化交界线", 250, 60) },
      { firstStep: 5, svg: line(60, 292, 440, 292, 1.5) + "\n" + `<circle cx="180" cy="180" r="74" fill="url(#gMetal)"/>` + "\n" + `<ellipse cx="180" cy="296" rx="64" ry="9" fill="url(#gGround)"/>` + "\n" + softEllipse(180, 226, 50, 18, "#8B8478", 0.3) + "\n" + strokePath("M126 220 Q180 250 234 220", 7, "#B9B3A6", "none") + "\n" + path("M116 217 A74 74 0 0 0 236 132", 5, "none", 'opacity="0.32"') + "\n" + softEllipse(180, 180, 38, 24, "#3A3C42", 0.16) + "\n" + circle(146, 140, 8, 0, "#FBF9F3") + "\n" + strokePath("M130 106 Q150 96 174 102", 3, "#FBF9F3", "none") + "\n" + label("点高光、留反光：金属质感完成", 250, 60) },
    ],
  },
  {
    id: 25,
    elements: [
      { firstStep: 1, svg: line(60, 292, 440, 292, 1.5) + "\n" + circle(120, 180, 58, 1.5) + "\n" + hatch(104, 142, 6, 16, 9, 35) + "\n" + label("玻璃球：高光留白，画的是环境", 250, 60) },
      { firstStep: 2, svg: line(60, 292, 440, 292, 1.5) + "\n" + `<circle cx="120" cy="180" r="58" fill="url(#gGlassBall)"/>` + "\n" + hatch(104, 142, 6, 16, 9, 35) + "\n" + strokePath("M84 152 Q120 138 156 152", 3.2, "#FBF9F3", "none") + "\n" + strokePath("M88 210 Q120 226 152 210", 2.2, "#8B8478", "none") + "\n" + `<ellipse cx="120" cy="246" rx="50" ry="7" fill="url(#gGround)"/>` + "\n" + label("玻璃：透射 + 折射线", 250, 60) },
      { firstStep: 3, svg: line(60, 292, 440, 292, 1.5) + "\n" + `<circle cx="120" cy="180" r="58" fill="url(#gGlassBall)"/>` + "\n" + hatch(104, 142, 6, 16, 9, 35) + "\n" + strokePath("M84 152 Q120 138 156 152", 3.2, "#FBF9F3", "none") + "\n" + strokePath("M88 210 Q120 226 152 210", 2.2, "#8B8478", "none") + "\n" + `<ellipse cx="120" cy="246" rx="50" ry="7" fill="url(#gGround)"/>` + "\n" + `<circle cx="330" cy="180" r="58" fill="url(#gMatte)"/>` + "\n" + hatch(306, 158, 6, 14, 9, 35) + "\n" + hatch(312, 170, 5, 12, 9, -35) + "\n" + `<ellipse cx="330" cy="246" rx="50" ry="7" fill="url(#gGround)"/>` + "\n" + label("塑料：哑光排线，反光柔和", 250, 60) },
      { firstStep: 4, svg: line(60, 292, 440, 292, 1.5) + "\n" + `<circle cx="120" cy="180" r="58" fill="url(#gGlassBall)"/>` + "\n" + hatch(104, 142, 6, 16, 9, 35) + "\n" + strokePath("M84 152 Q120 138 156 152", 3.2, "#FBF9F3", "none") + "\n" + strokePath("M88 210 Q120 226 152 210", 2.2, "#8B8478", "none") + "\n" + `<ellipse cx="120" cy="246" rx="50" ry="7" fill="url(#gGround)"/>` + "\n" + `<circle cx="330" cy="180" r="58" fill="url(#gMatte)"/>` + "\n" + hatch(306, 158, 6, 14, 9, 35) + "\n" + hatch(312, 170, 5, 12, 9, -35) + "\n" + `<ellipse cx="330" cy="246" rx="50" ry="7" fill="url(#gGround)"/>` + "\n" + `<rect x="216" y="262" width="76" height="26" rx="4" fill="url(#gBody)" stroke="#6E6A61" stroke-width="1.0"/>` + "\n" + label("金属车漆", 254, 302, 12) + "\n" + `<rect x="306" y="262" width="76" height="26" rx="4" fill="#B9B4A8" stroke="#6E6A61" stroke-width="1.0"/>` + "\n" + label("哑光塑料", 344, 302, 12) + "\n" + label("车漆 vs 哑光：高反差 vs 柔过渡", 250, 60) },
      { firstStep: 5, svg: line(60, 292, 440, 292, 1.5) + "\n" + `<circle cx="120" cy="180" r="58" fill="url(#gGlassBall)"/>` + "\n" + hatch(104, 142, 6, 16, 9, 35) + "\n" + strokePath("M84 152 Q120 138 156 152", 3.2, "#FBF9F3", "none") + "\n" + strokePath("M88 210 Q120 226 152 210", 2.2, "#8B8478", "none") + "\n" + `<ellipse cx="120" cy="246" rx="50" ry="7" fill="url(#gGround)"/>` + "\n" + `<circle cx="330" cy="180" r="58" fill="url(#gMatte)"/>` + "\n" + hatch(306, 158, 6, 14, 9, 35) + "\n" + hatch(312, 170, 5, 12, 9, -35) + "\n" + `<ellipse cx="330" cy="246" rx="50" ry="7" fill="url(#gGround)"/>` + "\n" + `<rect x="216" y="262" width="76" height="26" rx="4" fill="url(#gBody)" stroke="#6E6A61" stroke-width="1.0"/>` + "\n" + label("金属车漆", 254, 302, 12) + "\n" + `<rect x="306" y="262" width="76" height="26" rx="4" fill="#B9B4A8" stroke="#6E6A61" stroke-width="1.0"/>` + "\n" + label("哑光塑料", 344, 302, 12) + "\n" + label("材质小样：玻璃 / 金属漆 / 塑料", 250, 60) },
    ],
  },
  {
    id: 26,
    elements: [
      { firstStep: 1, svg: `<rect x="70" y="60" width="14" height="84" rx="4" fill="#C9A98F" stroke="#6E6A61" stroke-width="1.0"/>` + "\n" + `<rect x="98" y="54" width="14" height="90" rx="4" fill="#8B8478" stroke="#6E6A61" stroke-width="1.0"/>` + "\n" + `<rect x="126" y="60" width="14" height="84" rx="4" fill="#EFE6D8" stroke="#6E6A61" stroke-width="1.0"/>` + "\n" + path("M210 150 L256 58 L266 58 L220 150 Z", 1.2) + "\n" + `<rect x="330" y="64" width="30" height="78" rx="6" fill="#B9B4A8" stroke="#6E6A61" stroke-width="1.0"/>` + "\n" + `<rect x="326" y="52" width="38" height="18" rx="3" fill="#8B8478" stroke="#6E6A61" stroke-width="1.0"/>` + "\n" + label("工具：色粉棒 · 擦笔 · 定画液", 250, 60) },
      { firstStep: 2, svg: `<rect x="70" y="60" width="14" height="84" rx="4" fill="#C9A98F" stroke="#6E6A61" stroke-width="1.0"/>` + "\n" + `<rect x="98" y="54" width="14" height="90" rx="4" fill="#8B8478" stroke="#6E6A61" stroke-width="1.0"/>` + "\n" + `<rect x="126" y="60" width="14" height="84" rx="4" fill="#EFE6D8" stroke="#6E6A61" stroke-width="1.0"/>` + "\n" + path("M210 150 L256 58 L266 58 L220 150 Z", 1.2) + "\n" + `<rect x="330" y="64" width="30" height="78" rx="6" fill="#B9B4A8" stroke="#6E6A61" stroke-width="1.0"/>` + "\n" + `<rect x="326" y="52" width="38" height="18" rx="3" fill="#8B8478" stroke="#6E6A61" stroke-width="1.0"/>` + "\n" + softEllipse(250, 262, 210, 88, "#C9A98F", 0.45) + "\n" + softEllipse(250, 205, 180, 55, "#B3AA98", 0.35) + "\n" + rough(BODY_D, 1.5) + "\n" + BASE.wheel(REAR_CX) + "\n" + BASE.wheel(FRONT_CX) + "\n" + label("大面积铺色粉底色", 250, 60) },
      { firstStep: 3, svg: `<rect x="70" y="60" width="14" height="84" rx="4" fill="#C9A98F" stroke="#6E6A61" stroke-width="1.0"/>` + "\n" + `<rect x="98" y="54" width="14" height="90" rx="4" fill="#8B8478" stroke="#6E6A61" stroke-width="1.0"/>` + "\n" + `<rect x="126" y="60" width="14" height="84" rx="4" fill="#EFE6D8" stroke="#6E6A61" stroke-width="1.0"/>` + "\n" + path("M210 150 L256 58 L266 58 L220 150 Z", 1.2) + "\n" + `<rect x="330" y="64" width="30" height="78" rx="6" fill="#B9B4A8" stroke="#6E6A61" stroke-width="1.0"/>` + "\n" + `<rect x="326" y="52" width="38" height="18" rx="3" fill="#8B8478" stroke="#6E6A61" stroke-width="1.0"/>` + "\n" + softEllipse(250, 262, 210, 88, "#C9A98F", 0.45) + "\n" + softEllipse(250, 205, 180, 55, "#B3AA98", 0.35) + "\n" + softEllipse(250, 238, 150, 48, "#A58F76", 0.32) + "\n" + softEllipse(250, 192, 130, 38, "#D8CFC0", 0.5) + "\n" + rough(BODY_D, 1.5) + "\n" + BASE.wheel(REAR_CX) + "\n" + BASE.wheel(FRONT_CX) + "\n" + lightArrow(340, 250, 430, 250) + "\n" + label("揉擦：过渡顺着曲面", 250, 60) },
      { firstStep: 4, svg: `<rect x="70" y="60" width="14" height="84" rx="4" fill="#C9A98F" stroke="#6E6A61" stroke-width="1.0"/>` + "\n" + `<rect x="98" y="54" width="14" height="90" rx="4" fill="#8B8478" stroke="#6E6A61" stroke-width="1.0"/>` + "\n" + `<rect x="126" y="60" width="14" height="84" rx="4" fill="#EFE6D8" stroke="#6E6A61" stroke-width="1.0"/>` + "\n" + path("M210 150 L256 58 L266 58 L220 150 Z", 1.2) + "\n" + `<rect x="330" y="64" width="30" height="78" rx="6" fill="#B9B4A8" stroke="#6E6A61" stroke-width="1.0"/>` + "\n" + `<rect x="326" y="52" width="38" height="18" rx="3" fill="#8B8478" stroke="#6E6A61" stroke-width="1.0"/>` + "\n" + softEllipse(250, 262, 210, 88, "#C9A98F", 0.45) + "\n" + softEllipse(250, 205, 180, 55, "#B3AA98", 0.35) + "\n" + softEllipse(250, 238, 150, 48, "#A58F76", 0.32) + "\n" + softEllipse(250, 192, 130, 38, "#D8CFC0", 0.5) + "\n" + softEllipse(250, 286, 180, 38, "#6E6A61", 0.38) + "\n" + softEllipse(250, 176, 140, 28, "#EFE6D8", 0.55) + "\n" + rough(BODY_D, 1.5) + "\n" + BASE.wheel(REAR_CX) + "\n" + BASE.wheel(FRONT_CX) + "\n" + label("深色压暗部，浅色提亮部", 250, 60) },
      { firstStep: 5, svg: `<rect x="70" y="60" width="14" height="84" rx="4" fill="#C9A98F" stroke="#6E6A61" stroke-width="1.0"/>` + "\n" + `<rect x="98" y="54" width="14" height="90" rx="4" fill="#8B8478" stroke="#6E6A61" stroke-width="1.0"/>` + "\n" + `<rect x="126" y="60" width="14" height="84" rx="4" fill="#EFE6D8" stroke="#6E6A61" stroke-width="1.0"/>` + "\n" + path("M210 150 L256 58 L266 58 L220 150 Z", 1.2) + "\n" + `<rect x="330" y="64" width="30" height="78" rx="6" fill="#B9B4A8" stroke="#6E6A61" stroke-width="1.0"/>` + "\n" + `<rect x="326" y="52" width="38" height="18" rx="3" fill="#8B8478" stroke="#6E6A61" stroke-width="1.0"/>` + "\n" + softEllipse(250, 262, 210, 88, "#C9A98F", 0.45) + "\n" + softEllipse(250, 205, 180, 55, "#B3AA98", 0.35) + "\n" + softEllipse(250, 238, 150, 48, "#A58F76", 0.32) + "\n" + softEllipse(250, 192, 130, 38, "#D8CFC0", 0.5) + "\n" + softEllipse(250, 286, 180, 38, "#6E6A61", 0.38) + "\n" + softEllipse(250, 176, 140, 28, "#EFE6D8", 0.55) + "\n" + `<path d="${BODY_D}" fill="none"/>` + "\n" + rough(BODY_D, 1.5) + "\n" + BASE.wheel(REAR_CX) + "\n" + BASE.wheel(FRONT_CX) + "\n" + BASE.fenders() + "\n" + strokePath("M96 198 Q250 182 430 196", 1.8, "#FBF9F3") + "\n" + label("线稿收形，喷定画液", 250, 60) },
    ],
  },
  {
    id: 27,
    elements: [
      { firstStep: 1, svg: path("M0 0 L500 0 L500 360 L0 360 Z", 0, "url(#gTonePaper)") + "\n" + rough(BODY_D, 1.5) + "\n" + `<path d="${GLASS_D}" fill="none" stroke="#3A3C42" stroke-width="1.2"/>` + "\n" + BASE.wheel(REAR_CX) + "\n" + BASE.wheel(FRONT_CX) + "\n" + line(60, 322, 480, 322, 1.5, INK) + "\n" + label("底色纸 + 线稿", 250, 60) },
      { firstStep: 2, svg: path("M0 0 L500 0 L500 360 L0 360 Z", 0, "url(#gTonePaper)") + "\n" + rough(BODY_D, 1.5) + "\n" + `<path d="${GLASS_D}" fill="none" stroke="#3A3C42" stroke-width="1.2"/>` + "\n" + BASE.wheel(REAR_CX) + "\n" + BASE.wheel(FRONT_CX) + "\n" + line(60, 322, 480, 322, 1.5, INK) + "\n" + `<path d="${BODY_D}" fill="#6E6A61" opacity="0.4"/>` + "\n" + `<ellipse cx="250" cy="330" rx="220" ry="12" fill="#3A3C42" opacity="0.32"/>` + "\n" + label("深色铺暗部与投影", 250, 60) },
      { firstStep: 3, svg: path("M0 0 L500 0 L500 360 L0 360 Z", 0, "url(#gTonePaper)") + "\n" + rough(BODY_D, 1.5) + "\n" + `<path d="${GLASS_D}" fill="none" stroke="#3A3C42" stroke-width="1.2"/>` + "\n" + BASE.wheel(REAR_CX) + "\n" + BASE.wheel(FRONT_CX) + "\n" + line(60, 322, 480, 322, 1.5, INK) + "\n" + `<path d="${BODY_D}" fill="#6E6A61" opacity="0.4"/>` + "\n" + `<ellipse cx="250" cy="330" rx="220" ry="12" fill="#3A3C42" opacity="0.32"/>` + "\n" + softEllipse(250, 218, 190, 42, "#D6D0C2", 0.5) + "\n" + label("保留底色 = 中间调", 250, 60) },
      { firstStep: 4, svg: path("M0 0 L500 0 L500 360 L0 360 Z", 0, "url(#gTonePaper)") + "\n" + rough(BODY_D, 1.5) + "\n" + `<path d="${GLASS_D}" fill="none" stroke="#3A3C42" stroke-width="1.2"/>` + "\n" + BASE.wheel(REAR_CX) + "\n" + BASE.wheel(FRONT_CX) + "\n" + line(60, 322, 480, 322, 1.5, INK) + "\n" + `<path d="${BODY_D}" fill="#6E6A61" opacity="0.4"/>` + "\n" + `<ellipse cx="250" cy="330" rx="220" ry="12" fill="#3A3C42" opacity="0.32"/>` + "\n" + softEllipse(250, 218, 190, 42, "#D6D0C2", 0.5) + "\n" + strokePath("M96 198 Q250 182 430 196", 3.4, "#FBF9F3") + "\n" + strokePath("M66 248 Q250 232 434 248", 2.2, "#FBF9F3") + "\n" + strokePath("M120 285 Q250 276 420 285", 2.0, "#FBF9F3") + "\n" + label("白笔提亮高光与受光面", 250, 60) },
      { firstStep: 5, svg: path("M0 0 L500 0 L500 360 L0 360 Z", 0, "url(#gTonePaper)") + "\n" + rough(BODY_D, 1.5) + "\n" + `<path d="${GLASS_D}" fill="none" stroke="#3A3C42" stroke-width="1.2"/>` + "\n" + BASE.wheel(REAR_CX) + "\n" + BASE.wheel(FRONT_CX) + "\n" + line(60, 322, 480, 322, 1.5, INK) + "\n" + `<path d="${BODY_D}" fill="#6E6A61" opacity="0.4"/>` + "\n" + `<ellipse cx="250" cy="330" rx="220" ry="12" fill="#3A3C42" opacity="0.32"/>` + "\n" + softEllipse(250, 218, 190, 42, "#D6D0C2", 0.5) + "\n" + strokePath("M96 198 Q250 182 430 196", 3.4, "#FBF9F3") + "\n" + strokePath("M66 248 Q250 232 434 248", 2.2, "#FBF9F3") + "\n" + strokePath("M120 285 Q250 276 420 285", 2.0, "#FBF9F3") + "\n" + markerSwipe("M66 270 Q250 252 434 270", "#3A3C42", 10, 0.35) + "\n" + line(300, 250, 316, 249, 1.2, INK) + "\n" + label("马克笔补细节：底色高光完成", 250, 60) },
    ],
  },
  {
    id: 28,
    elements: [
      { firstStep: 1, svg: strokePath(BODY_D, 1.3) + "\n" + `<circle cx="${REAR_CX}" cy="${WHEEL_CY}" r="29" stroke="${INK}" stroke-width="1.3" fill="none"/>` + "\n" + `<circle cx="${FRONT_CX}" cy="${WHEEL_CY}" r="29" stroke="${INK}" stroke-width="1.3" fill="none"/>` + "\n" + `<circle cx="${REAR_CX}" cy="${WHEEL_CY}" r="17" stroke="${INK_SOFT}" stroke-width="1.0" fill="none"/>` + "\n" + `<circle cx="${FRONT_CX}" cy="${WHEEL_CY}" r="17" stroke="${INK_SOFT}" stroke-width="1.0" fill="none"/>` + "\n" + strokePath(GLASS_D, 1.1) + "\n" + line(60, 322, 480, 322, 1.3) + "\n" + label("精确线稿：比例 · 透视 · 分件", 250, 60) },
      { firstStep: 2, svg: strokePath(BODY_D, 1.3) + "\n" + `<circle cx="${REAR_CX}" cy="${WHEEL_CY}" r="29" stroke="${INK}" stroke-width="1.3" fill="none"/>` + "\n" + `<circle cx="${FRONT_CX}" cy="${WHEEL_CY}" r="29" stroke="${INK}" stroke-width="1.3" fill="none"/>` + "\n" + `<circle cx="${REAR_CX}" cy="${WHEEL_CY}" r="17" stroke="${INK_SOFT}" stroke-width="1.0" fill="none"/>` + "\n" + `<circle cx="${FRONT_CX}" cy="${WHEEL_CY}" r="17" stroke="${INK_SOFT}" stroke-width="1.0" fill="none"/>` + "\n" + strokePath(GLASS_D, 1.1) + "\n" + line(60, 322, 480, 322, 1.3) + "\n" + softEllipse(250, 222, 140, 26, "#C9C2B2", 0.5) + "\n" + softEllipse(250, 278, 210, 24, "#9C9484", 0.35) + "\n" + softEllipse(250, 198, 120, 16, "#D9D4C8", 0.55) + "\n" + label("按面铺明暗：先浅后深", 250, 60) },
      { firstStep: 3, svg: strokePath(BODY_D, 1.3) + "\n" + `<circle cx="${REAR_CX}" cy="${WHEEL_CY}" r="29" stroke="${INK}" stroke-width="1.3" fill="none"/>` + "\n" + `<circle cx="${FRONT_CX}" cy="${WHEEL_CY}" r="29" stroke="${INK}" stroke-width="1.3" fill="none"/>` + "\n" + `<circle cx="${REAR_CX}" cy="${WHEEL_CY}" r="17" stroke="${INK_SOFT}" stroke-width="1.0" fill="none"/>` + "\n" + `<circle cx="${FRONT_CX}" cy="${WHEEL_CY}" r="17" stroke="${INK_SOFT}" stroke-width="1.0" fill="none"/>` + "\n" + strokePath(GLASS_D, 1.1) + "\n" + line(60, 322, 480, 322, 1.3) + "\n" + `<path d="${BODY_D}" fill="url(#gBody)"/>` + "\n" + strokePath("M70 296 Q250 286 430 296", 1.6, "#FBF9F3") + "\n" + label("车漆渐变与倒影", 250, 60) },
      { firstStep: 4, svg: strokePath(BODY_D, 1.3) + "\n" + `<circle cx="${REAR_CX}" cy="${WHEEL_CY}" r="29" stroke="${INK}" stroke-width="1.3" fill="none"/>` + "\n" + `<circle cx="${FRONT_CX}" cy="${WHEEL_CY}" r="29" stroke="${INK}" stroke-width="1.3" fill="none"/>` + "\n" + `<circle cx="${REAR_CX}" cy="${WHEEL_CY}" r="17" stroke="${INK_SOFT}" stroke-width="1.0" fill="none"/>` + "\n" + `<circle cx="${FRONT_CX}" cy="${WHEEL_CY}" r="17" stroke="${INK_SOFT}" stroke-width="1.0" fill="none"/>` + "\n" + `<path d="${BODY_D}" fill="url(#gBody)"/>` + "\n" + strokePath("M70 296 Q250 286 430 296", 1.6, "#FBF9F3") + "\n" + `<path d="${GLASS_D}" fill="url(#gGlass)" stroke="#4A4D55" stroke-width="1.0"/>` + "\n" + BASE.headlight() + "\n" + BASE.taillight() + "\n" + hatch(66, 286, 5, 10, 6, 90) + "\n" + label("玻璃 · 灯组 · 分件精细刻画", 250, 60) },
      { firstStep: 5, svg: strokePath(BODY_D, 1.3) + "\n" + `<circle cx="${REAR_CX}" cy="${WHEEL_CY}" r="29" stroke="${INK}" stroke-width="1.3" fill="none"/>` + "\n" + `<circle cx="${FRONT_CX}" cy="${WHEEL_CY}" r="29" stroke="${INK}" stroke-width="1.3" fill="none"/>` + "\n" + `<circle cx="${REAR_CX}" cy="${WHEEL_CY}" r="17" stroke="${INK_SOFT}" stroke-width="1.0" fill="none"/>` + "\n" + `<circle cx="${FRONT_CX}" cy="${WHEEL_CY}" r="17" stroke="${INK_SOFT}" stroke-width="1.0" fill="none"/>` + "\n" + `<path d="${BODY_D}" fill="url(#gBody)"/>` + "\n" + strokePath("M70 296 Q250 286 430 296", 1.6, "#FBF9F3") + "\n" + `<path d="${GLASS_D}" fill="url(#gGlass)" stroke="#4A4D55" stroke-width="1.0"/>` + "\n" + BASE.headlight() + "\n" + BASE.taillight() + "\n" + hatch(66, 286, 5, 10, 6, 90) + "\n" + BASE.wheelStudy() + "\n" + BASE.fenders() + "\n" + crossHatch(150, 286, 7, 12, 7, 40) + "\n" + crossHatch(320, 284, 7, 12, 7, 40) + "\n" + label("精细效果图 · 外饰", 250, 60) },
    ],
  },
  {
    id: 29,
    elements: [
      { firstStep: 1, svg: line(60, 212, 440, 212, 1.2, "#9A9488") + "\n" + INT_BASE.dash() + "\n" + INT_BASE.windshield() + "\n" + line(74, 224, 74, 320, 1.2) + "\n" + line(426, 222, 426, 318, 1.2) + "\n" + label("内饰透视：先定仪表台与视平线", 250, 60) },
      { firstStep: 2, svg: line(60, 212, 440, 212, 1.2, "#9A9488") + "\n" + INT_BASE.dash() + "\n" + INT_BASE.windshield() + "\n" + line(74, 224, 74, 320, 1.2) + "\n" + line(426, 222, 426, 318, 1.2) + "\n" + INT_BASE.screen() + "\n" + INT_BASE.column() + "\n" + INT_BASE.wheel() + "\n" + label("方向盘 + 中控屏", 250, 60) },
      { firstStep: 3, svg: line(60, 212, 440, 212, 1.2, "#9A9488") + "\n" + INT_BASE.dash() + "\n" + INT_BASE.windshield() + "\n" + line(74, 224, 74, 320, 1.2) + "\n" + line(426, 222, 426, 318, 1.2) + "\n" + INT_BASE.screen() + "\n" + INT_BASE.column() + "\n" + INT_BASE.wheel() + "\n" + INT_BASE.dial(140, 196, 11) + "\n" + INT_BASE.dial(178, 196, 8) + "\n" + INT_BASE.vent(88) + "\n" + INT_BASE.vent(376) + "\n" + label("仪表盘 · 出风口 · 方向盘细节", 250, 60) },
      { firstStep: 4, svg: line(60, 212, 440, 212, 1.2, "#9A9488") + "\n" + INT_BASE.dash() + "\n" + INT_BASE.windshield() + "\n" + line(74, 224, 74, 320, 1.2) + "\n" + line(426, 222, 426, 318, 1.2) + "\n" + INT_BASE.screen() + "\n" + INT_BASE.column() + "\n" + INT_BASE.wheel() + "\n" + line(230, 236, 270, 236, 1.1) + "\n" + line(250, 222, 250, 266, 1.1) + "\n" + circle(140, 196, 10, 1.2) + "\n" + circle(176, 196, 7, 1.0) + "\n" + INT_BASE.vent(88) + "\n" + INT_BASE.vent(376) + "\n" + INT_BASE.seat(150) + "\n" + INT_BASE.seat(330) + "\n" + line(250, 216, 250, 320, 1.3) + "\n" + label("座椅 · 门板 · 中控台", 250, 60) },
      { firstStep: 5, svg: line(60, 212, 440, 212, 1.2, "#9A9488") + "\n" + INT_BASE.dash() + "\n" + INT_BASE.windshield() + "\n" + line(74, 224, 74, 320, 1.2) + "\n" + line(426, 222, 426, 318, 1.2) + "\n" + INT_BASE.screen() + "\n" + INT_BASE.column() + "\n" + INT_BASE.wheel() + "\n" + INT_BASE.dial(140, 196, 11) + "\n" + INT_BASE.dial(178, 196, 8) + "\n" + INT_BASE.vent(88) + "\n" + INT_BASE.vent(376) + "\n" + INT_BASE.seat(150) + "\n" + INT_BASE.seat(330) + "\n" + line(250, 216, 250, 320, 1.3) + "\n" + softEllipse(196, 280, 26, 30, "#8A8478", 0.22) + "\n" + softEllipse(376, 280, 26, 30, "#8A8478", 0.22) + "\n" + softEllipse(250, 200, 58, 12, "#FBF9F3", 0.25) + "\n" + crossHatch(178, 278, 5, 14, 7, 35) + "\n" + crossHatch(358, 278, 5, 14, 7, 35) + "\n" + crossHatch(90, 236, 4, 12, 7, 60) + "\n" + crossHatch(408, 234, 4, 12, 7, 60) + "\n" + label("光影统一：内饰效果图", 250, 60) },
    ],
  },
  {
    id: 30,
    elements: [
      { firstStep: 1, svg: screenCanvas(70, 70, 300, 220) + "\n" + `<g transform="translate(150 120) scale(0.42)" opacity="0.4">` + rough(BODY_D, 1.5) + BASE.wheel(REAR_CX) + BASE.wheel(FRONT_CX) + `</g>` + "\n" + label("① 扫描稿导入软件", 215, 94, 13) + "\n" + label("CAS：手绘是起点", 250, 60) },
      { firstStep: 2, svg: screenCanvas(70, 70, 300, 220) + "\n" + `<g transform="translate(150 120) scale(0.42)">` + `<path d="${BODY_D}" fill="none" stroke="#FBF9F3" stroke-width="1.0" opacity="0.35"/>` + rough(BODY_D, 1.5) + BASE.wheel(REAR_CX) + BASE.wheel(FRONT_CX) + `</g>` + "\n" + `<g transform="translate(150 120) scale(0.42)">` + strokePath(BODY_D, 1.2, "#FBF9F3") + `</g>` + "\n" + path("M380 80 L480 80 L480 230 L380 230 Z", 1.0) + "\n" + `<rect x="390" y="92" width="80" height="20" rx="3" fill="#6E6A61" opacity="0.55"/>` + "\n" + `<rect x="390" y="120" width="80" height="20" rx="3" fill="#8B8478" opacity="0.45"/>` + "\n" + `<rect x="390" y="148" width="80" height="20" rx="3" fill="#A59C8B" opacity="0.35"/>` + "\n" + label("线稿", 430, 106, 12) + "\n" + label("底色", 430, 134, 12) + "\n" + label("细节", 430, 162, 12) + "\n" + label("② 降透明度，分层描形", 215, 94, 13) + "\n" + label("图层管理", 430, 60) },
      { firstStep: 3, svg: screenCanvas(70, 70, 300, 220) + "\n" + `<g transform="translate(150 120) scale(0.42)">` + `<path d="${BODY_D}" fill="none" stroke="#FBF9F3" stroke-width="1.0" opacity="0.35"/>` + rough(BODY_D, 1.5) + BASE.wheel(REAR_CX) + BASE.wheel(FRONT_CX) + `</g>` + "\n" + `<g transform="translate(150 120) scale(0.42)">` + strokePath(BODY_D, 1.2, "#FBF9F3") + `<circle cx="${REAR_CX}" cy="${WHEEL_CY}" r="29" stroke="#FBF9F3" stroke-width="1.2" fill="none"/>` + `<circle cx="${FRONT_CX}" cy="${WHEEL_CY}" r="29" stroke="#FBF9F3" stroke-width="1.2" fill="none"/>` + `</g>` + "\n" + path("M380 80 L480 80 L480 230 L380 230 Z", 1.0) + "\n" + `<rect x="390" y="92" width="80" height="20" rx="3" fill="#6E6A61" opacity="0.55"/>` + "\n" + `<rect x="390" y="120" width="80" height="20" rx="3" fill="#8B8478" opacity="0.45"/>` + "\n" + `<rect x="390" y="148" width="80" height="20" rx="3" fill="#A59C8B" opacity="0.35"/>` + "\n" + line(430, 250, 468, 240, 2.2, "#8B8478") + "\n" + `<path d="M468 240 L474 238 L470 244 Z" fill="#8B8478"/>` + "\n" + label("③ 数位板勾线 · 调整比例", 215, 94, 13) + "\n" + label("图层管理", 430, 60) },
      { firstStep: 4, svg: screenCanvas(70, 70, 300, 220) + "\n" + `<g transform="translate(150 120) scale(0.42)">` + `<path d="${BODY_D}" fill="url(#gBody)"/>` + BASE.wheel(REAR_CX) + BASE.wheel(FRONT_CX) + strokePath(BODY_D, 1.2, "#3A3C42") + `</g>` + "\n" + `<g transform="translate(150 120) scale(0.42)">` + `<ellipse cx="250" cy="334" rx="220" ry="12" fill="#3A3C42" opacity="0.25"/>` + `</g>` + "\n" + path("M380 80 L480 80 L480 230 L380 230 Z", 1.0) + "\n" + `<rect x="390" y="92" width="80" height="20" rx="3" fill="#6E6A61" opacity="0.55"/>` + "\n" + `<rect x="390" y="120" width="80" height="20" rx="3" fill="#8B8478" opacity="0.45"/>` + "\n" + `<rect x="390" y="148" width="80" height="20" rx="3" fill="#A59C8B" opacity="0.35"/>` + "\n" + label("④ 铺底色 · 上材质 · 数字渲染", 215, 94, 13) + "\n" + label("图层管理", 430, 60) },
      { firstStep: 5, svg: screenCanvas(70, 70, 300, 220) + "\n" + `<g transform="translate(150 120) scale(0.42)">` + `<path d="${BODY_D}" fill="url(#gBody)"/>` + BASE.wheel(REAR_CX) + BASE.wheel(FRONT_CX) + strokePath(BODY_D, 1.2, "#3A3C42") + `</g>` + "\n" + `<g transform="translate(150 120) scale(0.42)">` + `<ellipse cx="250" cy="334" rx="220" ry="12" fill="#3A3C42" opacity="0.25"/>` + `</g>` + "\n" + path("M380 80 L480 80 L480 230 L380 230 Z", 1.0) + "\n" + `<rect x="390" y="92" width="80" height="20" rx="3" fill="#6E6A61" opacity="0.55"/>` + "\n" + `<rect x="390" y="120" width="80" height="20" rx="3" fill="#8B8478" opacity="0.45"/>` + "\n" + `<rect x="390" y="148" width="80" height="20" rx="3" fill="#A59C8B" opacity="0.35"/>` + "\n" + miniCar(22, 290, 0.2) + "\n" + lightArrow(130, 330, 78, 296) + "\n" + label("手绘 → 数字：对照输出", 250, 60) + "\n" + label("草稿", 62, 282, 12) + "\n" + label("CAS 成稿", 215, 94, 13) },
    ],
  },
  {
    id: 31,
    elements: [
      { firstStep: 1, svg: label("目标院校考察重点", 250, 60) + "\n" + path("M120 110 L138 110 L138 128 L120 128 Z", 1.3) + "\n" + line(152, 124, 430, 124, 1.0, "#9A9488") + "\n" + label("比例与透视基础", 290, 121, 13) + "\n" + path("M120 148 L138 148 L138 166 L120 166 Z", 1.3) + "\n" + line(152, 162, 430, 162, 1.0, "#9A9488") + "\n" + label("设计思维与过程", 290, 159, 13) + "\n" + path("M120 186 L138 186 L138 204 L120 204 Z", 1.3) + "\n" + line(152, 200, 430, 200, 1.0, "#9A9488") + "\n" + label("手绘与渲染功底", 290, 197, 13) + "\n" + path("M120 224 L138 224 L138 242 L120 242 Z", 1.3) + "\n" + line(152, 238, 430, 238, 1.0, "#9A9488") + "\n" + label("作品完整度与排版", 290, 235, 13) },
      { firstStep: 2, svg: miniCar(55, 150, 0.26) + "\n" + miniCar(275, 150, 0.26) + "\n" + miniCar(55, 246, 0.26) + "\n" + miniCar(275, 246, 0.26) + "\n" + checkMark(210, 188) + "\n" + checkMark(430, 188) + "\n" + label("精选 10-15 张：宁缺毋滥", 250, 60) + "\n" + label("删", 250, 296, 13) + "\n" + label("留", 70, 296, 13) },
      { firstStep: 3, svg: panel(40, 100, 130, 170, "草图") + "\n" + `<g transform="translate(56 160) scale(0.22)">` + rough(BODY_D, 1.5) + `</g>` + "\n" + panel(185, 100, 130, 170, "精稿") + "\n" + `<g transform="translate(201 160) scale(0.22)">` + strokePath(BODY_D, 1.6) + `<circle cx="${REAR_CX}" cy="${WHEEL_CY}" r="29" stroke="${INK}" stroke-width="1.2" fill="none"/>` + `<circle cx="${FRONT_CX}" cy="${WHEEL_CY}" r="29" stroke="${INK}" stroke-width="1.2" fill="none"/>` + `</g>` + "\n" + panel(330, 100, 130, 170, "渲染") + "\n" + `<g transform="translate(346 160) scale(0.22)">` + `<path d="${BODY_D}" fill="url(#gBody)"/>` + rough(BODY_D, 1.5) + BASE.wheel(REAR_CX) + BASE.wheel(FRONT_CX) + `</g>` + "\n" + lightArrow(176, 190, 182, 190) + "\n" + lightArrow(321, 190, 327, 190) + "\n" + label("每个项目展示过程", 250, 60) },
      { firstStep: 4, svg: path("M30 40 L470 40 L470 320 L30 320 Z", 1.2) + "\n" + `<rect x="40" y="52" width="420" height="30" fill="#D4CEC0" opacity="0.6"/>` + "\n" + label("项目 04 · 新能源概念车", 250, 72, 14) + "\n" + miniCar(120, 140, 0.32) + "\n" + line(120, 300, 380, 300, 1.0, "#9A9488") + "\n" + line(140, 312, 360, 312, 1.0, "#9A9488") + "\n" + label("统一版面：标题 · 主图 · 说明", 250, 60) },
      { firstStep: 5, svg: label("提交前自查清单", 250, 60) + "\n" + path("M120 110 L138 110 L138 128 L120 128 Z", 1.3) + "\n" + checkMark(129, 119, 7) + "\n" + line(152, 124, 430, 124, 1.0, "#9A9488") + "\n" + label("比例 · 透视无硬伤", 290, 121, 13) + "\n" + path("M120 148 L138 148 L138 166 L120 166 Z", 1.3) + "\n" + checkMark(129, 157, 7) + "\n" + line(152, 162, 430, 162, 1.0, "#9A9488") + "\n" + label("过程完整：草图 → 成稿", 290, 159, 13) + "\n" + path("M120 186 L138 186 L138 204 L120 204 Z", 1.3) + "\n" + checkMark(129, 195, 7) + "\n" + line(152, 200, 430, 200, 1.0, "#9A9488") + "\n" + label("版面统一 · 文字简洁", 290, 197, 13) + "\n" + path("M120 224 L138 224 L138 242 L120 242 Z", 1.3) + "\n" + checkMark(129, 233, 7) + "\n" + line(152, 238, 430, 238, 1.0, "#9A9488") + "\n" + label("说明：中文 + 英文注释", 290, 235, 13) + "\n" + path("M120 262 L138 262 L138 280 L120 280 Z", 1.3) + "\n" + checkMark(129, 271, 7) + "\n" + line(152, 276, 430, 276, 1.0, "#9A9488") + "\n" + label("10-15 张，宁缺毋滥", 290, 273, 13) },
    ],
  },
  {
    id: 32,
    elements: [
      { firstStep: 1, svg: line(60, 329, 480, 329, 1.7) + "\n" + rough(BODY_D, 1.5) + "\n" + BASE.wheel(FRONT_CX) + "\n" + `<circle cx="${REAR_CX}" cy="314" r="29" fill="url(#gTire)"/>` + "\n" + `<circle cx="${REAR_CX}" cy="314" r="18" fill="url(#gRim)" stroke="#5B5E66" stroke-width="1.2"/>` + "\n" + `<circle cx="${REAR_CX}" cy="314" r="11.5" fill="#DDD8CB"/>` + "\n" + spokes(REAR_CX, 314) + "\n" + `<circle cx="${REAR_CX}" cy="314" r="3.4" fill="#4A4E56"/>` + "\n" + strokePath("M82 342 L136 286", 3.0, "#B3483A") + "\n" + strokePath("M136 342 L82 286", 3.0, "#B3483A") + "\n" + lightArrow(109, 282, 109, 262) + "\n" + label("✗ 后轮掉到地面线以下", 250, 60) + "\n" + label("轮心要在同一水平线", 109, 270, 13) },
      { firstStep: 2, svg: path("M72 122 L150 118 L156 158 L78 164 Z", 1.4) + "\n" + line(72, 122, 130, 86, 1.2) + "\n" + line(150, 118, 200, 92, 1.2) + "\n" + circle(130, 86, 2.4, 0, INK) + "\n" + circle(200, 92, 2.4, 0, INK) + "\n" + label("消失点", 130, 74, 12) + "\n" + label("2cm 小盒", 130, 178, 13) + "\n" + dashLine(200, 92, 320, 120) + "\n" + path("M300 150 L470 150 L470 306 L300 306 Z", 1.0, "none", 'stroke-dasharray="8 6"') + "\n" + miniCar(322, 190, 0.34) + "\n" + lightArrow(245, 140, 295, 160) + "\n" + label("小盒验证透视，再放大起草", 250, 60) },
      { firstStep: 3, svg: line(60, 329, 480, 329, 1.7) + "\n" + rough(BODY_D, 1.5) + "\n" + BASE.wheel(REAR_CX) + "\n" + BASE.wheel(FRONT_CX) + "\n" + strokePath("M66 250 Q250 234 434 250", 1.8) + "\n" + strokePath("M120 190 Q250 178 380 188", 1.6, INK_SOFT) + "\n" + strokePath("M180 236 Q190 226 200 234", 1.2, INK_SOFT) + "\n" + strokePath("M250 232 Q260 220 272 230", 1.2, INK_SOFT) + "\n" + strokePath("M330 234 Q340 222 350 232", 1.2, INK_SOFT) + "\n" + label("一条线 ≠ 一个特征：加转折面才有体积", 250, 60) },
      { firstStep: 4, svg: panel(30, 70, 210, 220, "原作 / 照片") + "\n" + miniCar(46, 150, 0.42) + "\n" + panel(260, 70, 210, 220, "我的临摹") + "\n" + `<g transform="translate(276 150) scale(0.42)">` + rough(BODY_D, 1.5) + BASE.wheel(REAR_CX) + BASE.wheel(FRONT_CX) + `</g>` + "\n" + dashLine(250, 100, 250, 270) + "\n" + lightArrow(300, 250, 280, 250) + "\n" + lightArrow(360, 300, 340, 300) + "\n" + label("逐点对比：轮廓 → 比例 → 特征", 250, 60) },
      { firstStep: 5, svg: label("透视自检清单", 250, 60) + "\n" + path("M120 110 L138 110 L138 128 L120 128 Z", 1.3) + "\n" + checkMark(129, 119, 7) + "\n" + line(152, 124, 430, 124, 1.0, "#9A9488") + "\n" + label("前后轮心在同一地面线上", 290, 121, 13) + "\n" + path("M120 148 L138 148 L138 166 L120 166 Z", 1.3) + "\n" + checkMark(129, 157, 7) + "\n" + line(152, 162, 430, 162, 1.0, "#9A9488") + "\n" + label("透视盒角度与消失点一致", 290, 159, 13) + "\n" + path("M120 186 L138 186 L138 204 L120 204 Z", 1.3) + "\n" + line(152, 200, 430, 200, 1.0, "#9A9488") + "\n" + label("特征线画出体积与转折", 290, 197, 13) + "\n" + path("M120 224 L138 224 L138 242 L120 242 Z", 1.3) + "\n" + line(152, 238, 430, 238, 1.0, "#9A9488") + "\n" + label("与原图对比过三处以上", 290, 235, 13) + "\n" + path("M120 262 L138 262 L138 280 L120 280 Z", 1.3) + "\n" + line(152, 276, 430, 276, 1.0, "#9A9488") + "\n" + label("本周临摹 ≥ 2 张透视图", 290, 273, 13) },
    ],
  },
];

mkdirSync(OUT_DIR, { recursive: true });
let count = 0;
for (const drawing of DRAWINGS) {
  const maxStep = Math.max(...drawing.elements.map((e) => e.firstStep));
  for (let step = 1; step <= maxStep; step++) {
    let body = drawing.elements.filter((e) => e.firstStep <= step).map((e) => e.svg).join("\n");
    const DETAIL_AUTO = new Set([1, 2, 3, 4, 5, 6, 13, 14, 15, 22]);
    const HATCH_AUTO = new Set([1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17]);
    const OUTLINE_AUTO = new Set([1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 13, 14, 15, 16, 17, 21, 22, 28]);
    const FINAL_CONTOUR = new Set([1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 21, 22, 26, 27, 28]);
    if (step === maxStep && DETAIL_AUTO.has(drawing.id)) {
      body += "\n" + BASE.doorCut() + "\n" + BASE.handle() + "\n" + BASE.mirror() + "\n" + BASE.headlight() + "\n" + BASE.taillight();
    }
    if (step === maxStep && HATCH_AUTO.has(drawing.id)) {
      body += "\n" + crossHatch(120, 284, 8, 16, 8, 35) + "\n" + crossHatch(310, 282, 8, 16, 8, 35);
    }
    if (step === maxStep - 1 && OUTLINE_AUTO.has(drawing.id) && maxStep > 1) {
      body += "\n" + BASE.outlineLight();
    }
    if (step === maxStep && FINAL_CONTOUR.has(drawing.id)) {
      body += "\n" + BASE.contour();
    }
    const name = `lesson-${String(drawing.id).padStart(2, "0")}-step-${String(step).padStart(2, "0")}.svg`;
    writeFileSync(join(OUT_DIR, name), svgDoc(proUnderlay(drawing.id) + "\n" + body), "utf8");
    count++;
  }
}
console.log(`已生成 ${count} 张插画到 ${OUT_DIR}`);
