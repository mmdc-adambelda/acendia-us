import { describe, it, expect } from "vitest";
import { isRateLimited } from "@/lib/rateLimit";

describe("isRateLimited", () => {
  it("allows the first several requests for a fresh key and then blocks", () => {
    const key = `test-key-${Math.random()}`;
    const results = Array.from({ length: 7 }, () => isRateLimited(key));
    // MAX_REQUESTS is 5 — the 6th and 7th calls (index 5, 6) should be blocked.
    expect(results.slice(0, 5)).toEqual([false, false, false, false, false]);
    expect(results[5]).toBe(true);
    expect(results[6]).toBe(true);
  });

  it("tracks keys independently", () => {
    const keyA = `test-key-a-${Math.random()}`;
    const keyB = `test-key-b-${Math.random()}`;
    for (let i = 0; i < 5; i++) isRateLimited(keyA);
    // keyB has its own fresh window and should not be affected by keyA's usage.
    expect(isRateLimited(keyB)).toBe(false);
  });
});
