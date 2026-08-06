import test from "node:test";
import assert from "node:assert/strict";
import { SITE_DATA } from "../js/data.js";

test("站点名正确", () => {
  assert.equal(SITE_DATA.siteName, "小吴手绘汽车");
});

test("五个视角课程，id 唯一", () => {
  assert.equal(SITE_DATA.courses.length, 5);
  const ids = SITE_DATA.courses.map((c) => c.id);
  assert.deepEqual(ids, ["front", "side", "rear", "oblique", "interior"]);
  assert.equal(new Set(ids).size, 5);
});

test("每门课程字段完整且最后一步为成品图", () => {
  for (const c of SITE_DATA.courses) {
    assert.ok(c.id && c.title && c.goal);
    assert.ok(Array.isArray(c.steps) && c.steps.length > 1);
    for (const s of c.steps) {
      assert.ok(s.caption);
      assert.ok(s.art);
    }
    assert.match(c.steps[c.steps.length - 1].art, /final\.png$/, `${c.id} 最后一步应为成品图`);
    assert.ok(Array.isArray(c.tips) && c.tips.length > 0);
  }
  const front = SITE_DATA.courses.find((c) => c.id === "front");
  assert.equal(front.steps[2].caption, "第 3 步 · 线条整理");
  assert.equal(front.steps[3].caption, "第 4 步 · 格栅、车灯与细节");
});

test("流行车辆：尊界、问界各三视图", () => {
  assert.equal(SITE_DATA.popular.length, 2);
  const names = SITE_DATA.popular.map((p) => p.name);
  assert.ok(names.includes("尊界"));
  assert.ok(names.includes("问界"));
  for (const p of SITE_DATA.popular) {
    assert.equal(p.views.length, 3);
    assert.deepEqual(p.views.map((v) => v.name), ["正视图", "后视图", "侧视图"]);
    for (const v of p.views) {
      assert.ok(v.art.startsWith("assets/new/popular/"));
    }
  }
});