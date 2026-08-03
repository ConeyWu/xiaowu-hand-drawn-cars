import test from "node:test";
import assert from "node:assert/strict";
import { createProgressStore } from "../js/progress.js";

function memoryStorage() {
  const m = new Map();
  return {
    getItem: (k) => (m.has(k) ? m.get(k) : null),
    setItem: (k, v) => { m.set(k, String(v)); },
    removeItem: (k) => { m.delete(k); },
  };
}

const unit = { lessons: [{ id: 1 }, { id: 2 }, { id: 3 }, { id: 4 }] };
const units = [
  unit,
  { lessons: [{ id: 5 }, { id: 6 }, { id: 7 }, { id: 8 }] },
  { lessons: [{ id: 9 }, { id: 10 }, { id: 11 }, { id: 12 }] },
];

test("初始状态为空", () => {
  const s = createProgressStore(memoryStorage());
  assert.equal(s.isComplete(1), false);
  assert.deepEqual(s.getCompleted(), []);
});

test("打卡后持久化，重新创建 store 仍保留", () => {
  const storage = memoryStorage();
  const s1 = createProgressStore(storage);
  s1.markComplete(1);
  const s2 = createProgressStore(storage);
  assert.equal(s2.isComplete(1), true);
  assert.deepEqual(s2.getCompleted(), [1]);
});

test("重复打卡不产生重复记录", () => {
  const s = createProgressStore(memoryStorage());
  s.markComplete(2);
  s.markComplete(2);
  assert.deepEqual(s.getCompleted(), [2]);
});

test("单元进度计算正确", () => {
  const s = createProgressStore(memoryStorage());
  s.markComplete(1);
  s.markComplete(2);
  assert.deepEqual(s.getUnitProgress(unit), { done: 2, total: 4, complete: false });
  s.markComplete(3);
  s.markComplete(4);
  assert.deepEqual(s.getUnitProgress(unit), { done: 4, total: 4, complete: true });
});

test("总进度计算正确", () => {
  const s = createProgressStore(memoryStorage());
  s.markComplete(1);
  assert.deepEqual(s.getOverallProgress(units), { done: 1, total: 12, complete: false });
});

test("损坏的存储数据按空进度处理", () => {
  const storage = memoryStorage();
  storage.setItem("xiaowu.completedLessons", "{bad json");
  const s = createProgressStore(storage);
  assert.deepEqual(s.getCompleted(), []);
  assert.equal(s.isComplete(5), false);
});
