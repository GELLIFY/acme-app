/**
 * The helpers every registry of `src/modules/` is read through.
 *
 * An optional module (`auth.passkey`, `example`, …) lives in its own folder,
 * `src/modules/<module>/`, and contributes to the app through one small file
 * per extension point: `auth.ts` (Better Auth server plugins),
 * `auth-client.ts` (client plugins), `trpc.ts` (tRPC routers), `rest.ts`
 * (REST routes), `rest-auth.ts` (a credential of the REST API), `schema.ts`
 * (Drizzle tables), `sign-in.tsx` and `account-security.tsx` (a component
 * each, in a slot of the page), `account-tab.tsx` (a tab of the account page),
 * `nav.ts` (a link of the navigation bar), `permissions.ts` (access-control
 * resources), `seed.ts` (seed data) and `locales.ts` (messages). Each
 * extension point has its own registry, `src/modules/<point>.ts`, which only
 * imports those files and lists them in one `as const` array. The shared
 * files of the app iterate the registry and never name a module.
 *
 * One registry per extension point, not one for the whole module, because
 * the extension points depend on each other's types: Better Auth's server is
 * part of the tRPC context, so a single registry importing both a plugin and
 * a router is a type cycle, and TypeScript breaks it with `any`.
 *
 * Removing a module is deleting its folder and its line in each registry.
 */

import type { LucideIcon } from "lucide-react";
import type { ReactNode } from "react";
import type { Permissions } from "@/libs/better-auth/permissions";
import type { DBType } from "@/server/db";

type UnionToIntersection<U> = (
  U extends unknown
    ? (union: U) => void
    : never
) extends (intersection: infer I) => void
  ? I
  : never;

/**
 * The plugins of a registry, as a tuple in registry order. Not an array of
 * their union: Better Auth reads the fields a plugin adds to the user (and
 * its `$Infer`) by walking `plugins` as a tuple, head to tail, and a spread
 * array in the middle of it ends the walk, so every plugin from there on
 * (`twoFactorEnabled` of the two-factor plugin) is lost. An empty registry
 * is the empty tuple, not `never[]`, for the same reason.
 */
export type PluginsOf<M extends readonly unknown[]> = M extends readonly [
  infer Head,
  ...infer Tail,
]
  ? Head extends { plugins: readonly unknown[] }
    ? [...Head["plugins"], ...PluginsOf<Tail>]
    : PluginsOf<Tail>
  : [];

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

/** The access-control statements of a registry of `permissions.ts` files. */
export function statementsOf<const M extends readonly { statements: object }[]>(
  modules: M,
): RecordsOf<M, "statements"> {
  return Object.assign(
    {},
    ...modules.map((module) => module.statements),
  ) as RecordsOf<M, "statements">;
}

type GrantsOfOne<M, R extends string> = M extends {
  grants: { [K in R]: infer G };
}
  ? G
  : never;

/** What the modules of a registry grant to `R`, like `RecordsOf`. */
export type GrantsOf<M extends readonly unknown[], R extends string> = [
  GrantsOfOne<M[number], R>,
] extends [never]
  ? Record<never, never>
  : UnionToIntersection<GrantsOfOne<M[number], R>>;

/**
 * What a registry of `permissions.ts` files grants to a role (`user`,
 * `admin`) or to a new API key (`apiKey`): a module that grants it nothing
 * leaves it out.
 */
export function grantsOf<
  const M extends readonly { grants: Record<string, object> }[],
  const R extends string,
>(modules: M, to: R): GrantsOf<M, R> {
  return Object.assign(
    {},
    ...modules.map((module) => module.grants[to] ?? {}),
  ) as GrantsOf<M, R>;
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
 * A tab a module adds to the account page, after the app's own: `value` is
 * the tab's key, `Trigger` what its button shows, `Component` its content.
 */
export type TabContribution = SlotContribution & {
  value: string;
  Trigger: () => ReactNode | Promise<ReactNode>;
};

/**
 * A registry of slot contributions, widened to a plain array: an empty
 * registry is the empty tuple, whose elements are `never` and cannot be
 * destructured. Not generic on purpose: inferred from the empty tuple, the
 * element type would be `never` again.
 */
export function slotsOf(
  modules: readonly SlotContribution[],
): readonly SlotContribution[] {
  return modules;
}

/** A registry of `account-tab.tsx` files, widened like `slotsOf`. */
export function tabsOf(
  modules: readonly TabContribution[],
): readonly TabContribution[] {
  return modules;
}

/** A link a module adds to the navigation bar. */
export type NavContribution = {
  id: string;
  href: string;
  icon: LucideIcon;
  label: string;
};

/** A registry of `nav.ts` files, widened like `slotsOf`. */
export function navOf(
  modules: readonly NavContribution[],
): readonly NavContribution[] {
  return modules;
}

/** The seed data of a module, for the user `src/server/db/seed.ts` creates. */
export type SeedContribution = {
  id: string;
  seed: (db: DBType, user: { id: string }) => Promise<void>;
};

/** A registry of `seed.ts` files, widened like `slotsOf`. */
export function seedsOf(
  modules: readonly SeedContribution[],
): readonly SeedContribution[] {
  return modules;
}

/** A health check a module adds to the home page: a URL answering `{ status: "ok" }`. */
export type HealthContribution = { id: string; label: string; url: string };

/** A registry of `health.ts` files, widened like `slotsOf`. */
export function healthOf(
  modules: readonly HealthContribution[],
): readonly HealthContribution[] {
  return modules;
}

/** Who a REST request is made for, once a credential is verified. */
export type RestIdentity = { userId: string; permissions: Permissions };

/**
 * A credential a module adds to the REST API, next to the session cookie.
 * `authenticate` answers `null` when the request does not carry it, the
 * reason when it carries an invalid one, else the identity. It takes the
 * headers, not Hono's context, so a module knows nothing of the server.
 */
export type RestCredential = {
  id: string;
  /** The OpenAPI security schemes the credential is sent with, by name. */
  securitySchemes: Record<
    string,
    {
      type: "apiKey";
      in: "header" | "query" | "cookie";
      name: string;
      description?: string;
    }
  >;
  authenticate: (headers: Headers) => Promise<RestIdentity | string | null>;
};

/** A registry of `rest-auth.ts` files, widened like `slotsOf`. */
export function credentialsOf(
  modules: readonly RestCredential[],
): readonly RestCredential[] {
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
