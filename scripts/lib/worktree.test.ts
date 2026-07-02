import { describe, expect, it } from "bun:test";
import {
  appName,
  databaseName,
  fallbackPort,
  resolveBranch,
} from "./worktree";

describe("databaseName", () => {
  it("maps main to main", () => {
    expect(databaseName("main")).toBe("main");
  });

  it("slugifies special characters", () => {
    expect(databaseName("feat/My-Thing!")).toBe("main_feat_my_thing");
  });

  it("truncates to 63 characters for very long branch names", () => {
    const longBranch = `feat/${"a".repeat(100)}`;
    expect(databaseName(longBranch).length).toBeLessThanOrEqual(63);
  });
});

describe("appName", () => {
  it("maps main to acme", () => {
    expect(appName("main")).toBe("acme");
  });

  it("slugifies special characters", () => {
    expect(appName("feat/My-Thing!")).toBe("acme-feat-my-thing");
  });
});

describe("fallbackPort", () => {
  it("maps main to 3000", () => {
    expect(fallbackPort("main")).toBe(3000);
  });

  it("maps other branches into [3001, 4000]", () => {
    const port = fallbackPort("feat/my-thing");
    expect(port).toBeGreaterThanOrEqual(3001);
    expect(port).toBeLessThanOrEqual(4000);
  });

  it("is deterministic for the same branch", () => {
    expect(fallbackPort("feat/my-thing")).toBe(fallbackPort("feat/my-thing"));
  });
});

describe("resolveBranch", () => {
  it("returns the git branch when not detached", () => {
    expect(resolveBranch("feat/x", "/any/dir")).toBe("feat/x");
  });

  it("falls back to the worktree dir name on detached HEAD", () => {
    expect(resolveBranch("HEAD", "/Users/x/worktrees/fix-login")).toBe(
      "fix-login",
    );
  });
});
