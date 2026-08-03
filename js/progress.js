// 本地进度：完成课程 id 存于 localStorage（key: xiaowu.completedLessons）
const KEY = "xiaowu.completedLessons";

export function createProgressStore(storage) {
  function load() {
    try {
      const raw = storage.getItem(KEY);
      const arr = raw ? JSON.parse(raw) : [];
      return new Set(arr.map(String));
    } catch {
      return new Set();
    }
  }
  function save(set) {
    storage.setItem(KEY, JSON.stringify([...set].map(Number)));
  }
  return {
    isComplete(id) {
      return load().has(String(id));
    },
    markComplete(id) {
      const set = load();
      set.add(String(id));
      save(set);
    },
    getCompleted() {
      return [...load()].map(Number);
    },
    getUnitProgress(unit) {
      const ids = unit.lessons.map((l) => l.id);
      const done = ids.filter((id) => load().has(String(id))).length;
      return { done, total: ids.length, complete: done === ids.length };
    },
    getOverallProgress(units) {
      const all = units.flatMap((u) => u.lessons.map((l) => l.id));
      const done = all.filter((id) => load().has(String(id))).length;
      return { done, total: all.length, complete: done === all.length };
    },
  };
}
