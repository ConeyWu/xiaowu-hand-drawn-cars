import test from "node:test";
import assert from "node:assert/strict";
import { SITE_DATA } from "../js/data.js";

const EXPECTED_STEP_COUNTS = [5, 5, 5, 5, 4, 5, 5, 5, 5, 5, 5, 4, 5, 5, 4, 5, 5, 4, 4, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5];

test("站点名正确", () => {
  assert.equal(SITE_DATA.siteName, "小吴手绘汽车");
});

test("7 个单元，共 32 课，id 唯一", () => {
  assert.equal(SITE_DATA.units.length, 7);
  const expectedUnitSizes = [4, 4, 4, 4, 4, 5, 7];
  SITE_DATA.units.forEach((u, i) => {
    assert.equal(u.lessons.length, expectedUnitSizes[i]);
  });
  const ids = SITE_DATA.units.flatMap((u) => u.lessons.map((l) => l.id));
  assert.equal(ids.length, 32);
  assert.equal(new Set(ids).size, 32);
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

test("步骤图路径正确：过程为 SVG，最后一步为成品 PNG", () => {
  for (const u of SITE_DATA.units) {
    for (const l of u.lessons) {
      const prefix = `assets/illustrations/lesson-${String(l.id).padStart(2, "0")}-step-`;
      const finalRe = new RegExp(`^assets/final/lesson-${String(l.id).padStart(2, "0")}-final\\.png$`);
      l.steps.forEach((s, i) => {
        if (i === l.steps.length - 1) {
          assert.match(s.art, finalRe, `最后一步应为成品图: ${l.id}`);
        } else {
          assert.match(s.art, new RegExp(`^${prefix}\\d{2}\\.svg$`));
        }
      });
    }
  }
});
