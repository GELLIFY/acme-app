import { describe, expect, test } from "bun:test";
import {
  credentialsOf,
  messagesWith,
  pluginsOf,
  routersOf,
  slotsOf,
  tablesOf,
  tabsOf,
} from "./registry";

type IsNever<T> = [T] extends [never] ? true : false;

describe("messagesWith", () => {
  const base = {
    title: "Hello",
    account: {
      security: { password: { title: "Password" } },
      danger: "Danger",
    },
  } as const;
  const module = {
    id: "x",
    messages: {
      en: { account: { security: { passkey: { title: "Passkeys" } } } },
    },
  } as const;

  test("merges a module's messages at the path it declares, keeping the base", () => {
    const merged = messagesWith(base, [module], "en");
    expect(merged.account.security.passkey.title).toBe("Passkeys");
    expect(merged.account.security.password.title).toBe("Password");
    expect(merged.account.danger).toBe("Danger");
    expect(merged.title).toBe("Hello");
  });

  test("does not change the base", () => {
    messagesWith(base, [module], "en");
    expect(base.account.security).not.toHaveProperty("passkey");
  });

  test("is the base itself, as far as its values go, with no module", () => {
    expect(messagesWith(base, [], "en")).toEqual(base);
  });
});

describe("the registries' helpers", () => {
  test("pluginsOf flattens the plugins of every module, in order", () => {
    expect(
      pluginsOf([
        { id: "a", plugins: [1, 2] },
        { id: "b", plugins: [3] },
      ]),
    ).toEqual([1, 2, 3]);
    expect(pluginsOf([])).toEqual([]);
  });

  test("routersOf and tablesOf merge a record per module", () => {
    expect(
      routersOf([
        { id: "a", routers: { one: 1 } },
        { id: "b", routers: { two: 2 } },
      ]),
    ).toEqual({ one: 1, two: 2 });
    expect(tablesOf([{ id: "a", tables: { t: "x" } }])).toEqual({ t: "x" });
    expect(routersOf([])).toEqual({});
  });

  // A project without the modules of a slot has an empty registry, `[] as
  // const`: its elements must still be components, or the page does not
  // compile there (checked by tsc, not at run time).
  test("an empty registry of slots, tabs or credentials keeps its element type", () => {
    const empty = [] as const;
    const slots = slotsOf(empty);
    const tabs = tabsOf(empty);
    const credentials = credentialsOf(empty);
    const slot: IsNever<(typeof slots)[number]> = false;
    const tab: IsNever<(typeof tabs)[number]> = false;
    const credential: IsNever<(typeof credentials)[number]> = false;
    expect([slot, tab, credential]).toEqual([false, false, false]);
    expect([slots, tabs, credentials]).toEqual([[], [], []]);
  });
});
