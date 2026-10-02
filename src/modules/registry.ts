/**
 * The helpers every registry of `src/modules/` is read through.
 *
 * An optional module (`auth.passkey`, `example`, …) lives in its own folder,
 * `src/modules/<module>/`, and contributes to the app through one small file
 * per extension point: `auth.ts` (Better Auth server plugins),
 * `auth-client.ts` (client plugins), `trpc.ts` (tRPC routers), `rest.ts`
 * (REST routes), `schema.ts` (Drizzle tables), `sign-in.tsx` and
 * `account-security.tsx` (a component each, in a slot of the page) and
 * `locales.ts` (messages). Each extension point has its
 * own registry, `src/modules/<point>.ts`, which only imports those files and
 * lists them in one `as const` array. The shared files of the app iterate the
 * registry and never name a module.
 *
 * One registry per extension point, not one for the whole module, because
 * the extension points depend on each other's types: Better Auth's server is
 * part of the tRPC context, so a single registry importing both a plugin and
 * a router is a type cycle, and TypeScript breaks it with `any`.
 *
 * Removing a module is deleting its folder and its line in each registry.
 */

import type { ReactNode } from "react";

type UnionToIntersection<U> = (
  U extends unknown
    ? (union: U) => void
    : never
) extends (intersection: infer I) => void
  ? I
  : never;

type PluginsOfOne<M> = M extends { plugins: readonly (infer P)[] } ? P : never;

/**
 * The plugins of a registry, as an array of their union. An empty registry
 * is the empty tuple, not `never[]`: spreading a `never[]` into Better Auth's
 * `plugins` breaks the inference of the session's user.
 */
export type PluginsOf<M extends readonly unknown[]> = [
  PluginsOfOne<M[number]>,
] extends [never]
  ? []
  : PluginsOfOne<M[number]>[];

/** Every plugin of a registry of `auth.ts` or `auth-client.ts` files. */
export function pluginsOf<
  const M extends readonly { plugins: readonly unknown[] }[],
>(modules: M): PluginsOf<M> {
  return modules.flatMap((module) => module.plugins) as PluginsOf<M>;
}

type RecordOfOne<M, K extends string> =
  M extends Record<K, infer R> ? R : never;

/**
 * The intersection of one record field across a registry, keeping each key's
 * own type: a tRPC router stays typed in `AppRouter`, a table in the Drizzle
 * schema. An empty registry is an empty record.
 */
export type RecordsOf<M extends readonly unknown[], K extends string> = [
  RecordOfOne<M[number], K>,
] extends [never]
  ? Record<never, never>
  : UnionToIntersection<RecordOfOne<M[number], K>>;

/** The tRPC routers of a registry of `trpc.ts` files. */
export function routersOf<const M extends readonly { routers: object }[]>(
  modules: M,
): RecordsOf<M, "routers"> {
  return Object.assign(
    {},
    ...modules.map((module) => module.routers),
  ) as RecordsOf<M, "routers">;
}

/** The Drizzle tables (and relations) of a registry of `schema.ts` files. */
export function tablesOf<const M extends readonly { tables: object }[]>(
  modules: M,
): RecordsOf<M, "tables"> {
  return Object.assign(
    {},
    ...modules.map((module) => module.tables),
  ) as RecordsOf<M, "tables">;
}

/**
 * A component a module puts in a slot of a page. It may be async, a server
 * component that loads what it shows: the page knows nothing of the module.
 */
export type SlotContribution = {
  id: string;
  Component: () => ReactNode | Promise<ReactNode>;
};

/**
 * A registry of slot contributions, widened to a plain array: an empty
 * registry is the empty tuple, whose elements are `never` and cannot be
 * destructured.
 */
export function slotsOf(
  modules: readonly SlotContribution[],
): readonly SlotContribution[] {
  return modules;
}

type Messages = { [key: string]: string | Messages };

type DeepMerge<A, B> = A extends Messages
  ? B extends Messages
    ? {
        [K in keyof A | keyof B]: K extends keyof A
          ? K extends keyof B
            ? DeepMerge<A[K], B[K]>
            : A[K]
          : K extends keyof B
            ? B[K]
            : never;
      }
    : B
  : B;

type MessagesOfOne<M, L extends string> = M extends {
  messages: Record<L, infer R>;
}
  ? R
  : never;

/** The messages of the base, with those of every module of the registry. */
export type MessagesWith<
  Base,
  M extends readonly unknown[],
  L extends string,
> = [MessagesOfOne<M[number], L>] extends [never]
  ? Base
  : DeepMerge<Base, UnionToIntersection<MessagesOfOne<M[number], L>>>;

function isMessages(value: unknown): value is Messages {
  return typeof value === "object" && value !== null;
}

function mergeInto(target: Messages, source: Messages): Messages {
  for (const [key, value] of Object.entries(source)) {
    const current = target[key];
    target[key] =
      isMessages(current) && isMessages(value)
        ? mergeInto({ ...current }, value)
        : value;
  }
  return target;
}

/**
 * The app's messages for one language, with those of the modules merged in
 * at the paths they declare. The literal types of the messages are kept:
 * `next-international` reads the parameters of a message from its text.
 */
export function messagesWith<
  const Base extends Messages,
  const M extends readonly { messages: Record<L, Messages> }[],
  const L extends string,
>(base: Base, modules: M, language: L): MessagesWith<Base, M, L> {
  return modules.reduce(
    (messages, module) => mergeInto(messages, module.messages[language]),
    { ...base } as Messages,
  ) as MessagesWith<Base, M, L>;
}
