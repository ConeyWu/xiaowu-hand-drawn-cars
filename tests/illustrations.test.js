import test from "node:test";
import assert from "node:assert/strict";
import { existsSync, readFileSync } from "node:fs";
import { SITE_DATA } from "../js/data.js";

test("所有课程步骤图与成品图存在且非空", () => {
  const files = [];
  for (const c of SITE_DATA.courses) {
    for (const s of c.steps) files.push(s.art);
  }
  for (const p of SITE_DATA.popular) {
    for (const v of p.views) files.push(v.art);
  }
  assert.ok(files.length >= 40, `素材数量应不少于 40，实际 ${files.length}`);
  for (const f of files) {
    assert.ok(existsSync(f), `缺少 ${f}`);
    assert.ok(readFileSync(f).length > 20000, `${f} 过小`);
  }
});