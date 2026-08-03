import test from "node:test";
import assert from "node:assert/strict";
import { execFileSync } from "node:child_process";
import { existsSync, readdirSync, readFileSync } from "node:fs";
import { join } from "node:path";

const EXPECTED_STEP_COUNTS = [5, 5, 5, 5, 4, 5, 5, 5, 5, 5, 5, 4, 5, 5, 4, 5, 5, 4, 4, 5];
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

test("生成 95 张步骤插画", () => {
  runGenerator();
  const files = readdirSync(DIR).filter((f) => f.endsWith(".svg"));
  assert.equal(files.length, 95);
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
  assert.equal(files.length, 95);
});
