import { describe, expect, it } from "bun:test";

import type { getTodosQuery } from "./queries";
import { shuffleTodos } from "./helpers";

type Todo = Awaited<ReturnType<typeof getTodosQuery>>[number];

function makeTodos(count: number): Todo[] {
  return Array.from(
    { length: count },
    (_, i) =>
      ({
        id: `id-${i}`,
        text: `Todo ${i}`,
        completed: false,
      }) satisfies Todo,
  );
}

describe("shuffleTodos", () => {
  it("returns a new array with the same items", () => {
    const todos = makeTodos(5);
    const shuffled = shuffleTodos(todos);

    expect(shuffled).not.toBe(todos);
    expect(shuffled).toHaveLength(todos.length);

    // All original items are present
    const originalIds = todos.map((t) => t.id).sort();
    const shuffledIds = shuffled.map((t) => t.id).sort();
    expect(shuffledIds).toEqual(originalIds);
  });

  it("shuffles the array (order may change)", () => {
    const todos = makeTodos(10);
    let isDifferent = false;
    // Run multiple times to reduce flakiness
    for (let i = 0; i < 10; i++) {
      const shuffled = shuffleTodos(todos);
      if (!shuffled.every((t, idx) => t.id === todos[idx]!.id)) {
        isDifferent = true;
        break;
      }
    }
    expect(isDifferent).toBe(true);
  });

  it("handles empty array", () => {
    expect(shuffleTodos([])).toEqual([]);
  });

  it("handles single item array", () => {
    const single = makeTodos(1);
    expect(shuffleTodos(single)).toEqual(single);
  });
});
