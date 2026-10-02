import { describe, expect, test } from "bun:test";
import { existsSync, readdirSync, readFileSync } from "node:fs";
import { join } from "node:path";

/**
 * `gellify.template.json` is what create-gellify-app removes a declined module
 * with. These tests keep it and `src/modules/` saying the same thing: a module
 * folder the manifest does not know would be kept in every project, and an
 * entry for a folder that is gone would make the generator fail.
 */
const ROOT = join(import.meta.dir, "..", "..");
const MODULES = join(ROOT, "src", "modules");

type Manifest = {
  registries: string[];
  regenerate: string[];
  templateOnly: string[];
  modules: Record<
    string,
    {
      dir?: string;
      requires?: string[];
      files?: string[];
      dependencies?: string[];
    }
  >;
};
const manifest = JSON.parse(
  readFileSync(join(ROOT, "gellify.template.json"), "utf8"),
) as Manifest;

const folders = readdirSync(MODULES, { withFileTypes: true })
  .filter((entry) => entry.isDirectory())
  .map((entry) => entry.name)
  .sort();

describe("gellify.template.json", () => {
  test("every module folder of src/modules/ has an entry, and every entry a folder", () => {
    const owned = Object.values(manifest.modules)
      .flatMap((module) => (module.dir ? [module.dir] : []))
      .sort();
    expect(owned).toEqual(folders);
  });

  // `[locale]` and `(app)` in a path are literal, not glob syntax.
  test("every other file of a module exists", () => {
    for (const module of Object.values(manifest.modules)) {
      for (const file of module.files ?? []) {
        expect(existsSync(join(ROOT, file)), file).toBe(true);
      }
    }
  });

  // `example+rest`: what goes when either module is off, such as the REST
  // routes of the example domain.
  test("a combined entry requires modules the manifest has, by its own name", () => {
    for (const [key, module] of Object.entries(manifest.modules)) {
      if (!module.requires) continue;
      expect(module.requires.join("+")).toBe(key);
      expect(module.dir).toBeUndefined();
      for (const id of module.requires) {
        expect(manifest.modules[id], `${key} requires ${id}`).toBeDefined();
      }
    }
  });

  test("every registry it lists exists", () => {
    for (const registry of manifest.registries) {
      expect(existsSync(join(ROOT, registry))).toBe(true);
    }
  });

  test("every registry file of src/modules/ is listed", () => {
    const registries = readdirSync(MODULES, { withFileTypes: true })
      .filter((entry) => entry.isFile() && entry.name !== "registry.ts")
      .map((entry) => `src/modules/${entry.name}`)
      .filter((file) => !file.endsWith(".test.ts"))
      .sort();
    expect([...manifest.registries].sort()).toEqual(registries);
  });

  test("a registry only imports a module's own files, and exports one array", () => {
    const dirs = new Set(folders);
    for (const registry of manifest.registries) {
      const source = readFileSync(join(ROOT, registry), "utf8");
      for (const [, from] of source.matchAll(/from "([^"]+)"/g)) {
        const match = /^\.\/([^/]+)\//.exec(from as string);
        expect(match, `${registry} imports ${from}`).not.toBeNull();
        expect(dirs.has(match?.[1] as string)).toBe(true);
      }
      expect(source.match(/^export const /gm)).toHaveLength(1);
    }
  });

  // A shared file that imports a module's own package breaks every project
  // without the module, and with the module it registers it a second time.
  // The module's other files (`files`: a route, a UI primitive) go with it.
  test("only a module's own files import the packages the module owns", () => {
    const offenders: string[] = [];
    const visit = (dir: string) => {
      for (const entry of readdirSync(dir, { withFileTypes: true })) {
        const path = join(dir, entry.name);
        if (entry.isDirectory()) {
          if (path !== MODULES) visit(path);
        } else if (/\.tsx?$/.test(entry.name)) {
          const file = path.slice(ROOT.length + 1).replaceAll("\\", "/");
          const source = readFileSync(path, "utf8");
          for (const module of Object.values(manifest.modules)) {
            const own = (module.files ?? []).some(
              (owned) => file === owned || file.startsWith(`${owned}/`),
            );
            if (own) continue;
            for (const name of module.dependencies ?? []) {
              if (
                source.includes(`from "${name}"`) ||
                source.includes(`from "${name}/`)
              ) {
                offenders.push(`${file} imports ${name}`);
              }
            }
          }
        }
      }
    };
    visit(join(ROOT, "src"));
    expect(offenders).toEqual([]);
  });

  test("these tests never reach a project, where the manifest is not", () => {
    expect(manifest.templateOnly).toContain("src/modules/manifest.test.ts");
  });

  // A stale entry would leave the template's own file, renamed, in every
  // project: the template workflow, which needs a secret no project has.
  test("every template-only file exists", () => {
    for (const file of manifest.templateOnly) {
      expect(existsSync(join(ROOT, file)), file).toBe(true);
    }
  });

  test("the migrations are regenerated, not shipped", () => {
    expect(manifest.regenerate).toContain("src/server/db/migrations");
  });
});
