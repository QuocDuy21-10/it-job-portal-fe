import fs from "node:fs";
import path from "node:path";
import { en } from "@/locales/en";
import { PRIVATE_NAMESPACES, pickPublicMessages } from "./client-messages";

const SRC = path.join(process.cwd(), "src");
const APP_LOCALE = path.join(SRC, "app", "[locale]");
const PUBLIC_GROUPS = ["(main)", "(auth)", "account"];
const ROUTE_FILE = /[\\/](layout|page|loading|error|not-found|template)\.tsx$/;
const IMPORT =
  /(?:import|export)\s[^'"]*?from\s*["']([^"']+)["']|import\s*\(\s*["']([^"']+)["']\s*\)|import\s*["']([^"']+)["']/g;

const walk = (dir: string): string[] =>
  fs.readdirSync(dir, { withFileTypes: true }).flatMap((entry) => {
    const full = path.join(dir, entry.name);
    return entry.isDirectory() ? walk(full) : [full];
  });

const isTest = (file: string) => /\.test\.tsx?$/.test(file);

const resolveImport = (from: string, specifier: string): string | null => {
  let base: string;
  if (specifier.startsWith("@/")) base = path.join(SRC, specifier.slice(2));
  else if (specifier.startsWith(".")) {
    base = path.resolve(path.dirname(from), specifier);
  } else return null;

  for (const suffix of ["", ".ts", ".tsx", "/index.ts", "/index.tsx"]) {
    const candidate = base + suffix;
    if (
      /\.tsx?$/.test(candidate) &&
      fs.existsSync(candidate) &&
      fs.statSync(candidate).isFile()
    ) {
      return candidate;
    }
  }
  return null;
};

const importsOf = (file: string): string[] =>
  [...fs.readFileSync(file, "utf8").matchAll(IMPORT)]
    .map((m) => resolveImport(file, m[1] ?? m[2] ?? m[3]))
    .filter((resolved): resolved is string => resolved !== null);

const publicEntries = [
  path.join(SRC, "app", "layout.tsx"),
  path.join(APP_LOCALE, "layout.tsx"),
  ...PUBLIC_GROUPS.flatMap((group) =>
    walk(path.join(APP_LOCALE, group)).filter(
      (file) => ROUTE_FILE.test(file) && !isTest(file)
    )
  ),
];

const reachableFrom = (entries: string[]): Set<string> => {
  const seen = new Set<string>();
  const stack = [...entries];
  while (stack.length > 0) {
    const file = stack.pop()!;
    if (seen.has(file)) continue;
    seen.add(file);
    stack.push(...importsOf(file));
  }
  return seen;
};

describe("public client messages", () => {
  it("drops exactly the private namespaces", () => {
    const picked = pickPublicMessages(en);

    for (const ns of PRIVATE_NAMESPACES) {
      expect(en).toHaveProperty(ns);
      expect(picked).not.toHaveProperty(ns);
    }
    const privateSet = new Set<string>(PRIVATE_NAMESPACES);
    for (const ns of Object.keys(en).filter((key) => !privateSet.has(key))) {
      expect(picked[ns]).toBe(en[ns as keyof typeof en]);
    }
  });

  it("no file reachable from a public route uses a private namespace", () => {
    const files = reachableFrom(publicEntries);
    const keyPattern = new RegExp(
      `["'\`](?:${PRIVATE_NAMESPACES.join("|")})\\.[\\w.$\\{]*`,
      "g"
    );
    const leaks = [...files].flatMap((file) =>
      (fs.readFileSync(file, "utf8").match(keyPattern) ?? []).map(
        (key) => `${path.relative(SRC, file)}: ${key}`
      )
    );

    expect(files.size).toBeGreaterThan(100);
    expect(leaks).toEqual([]);
  });

  it("only the request config imports the full en/vi messages", () => {
    const fullLocales = new Set(
      ["en.ts", "vi.ts"].map((name) => path.join(SRC, "locales", name))
    );
    const importers = walk(SRC)
      .filter((file) => /\.tsx?$/.test(file) && !isTest(file))
      .filter((file) => importsOf(file).some((dep) => fullLocales.has(dep)))
      .map((file) => path.relative(SRC, file));

    expect(importers).toEqual([path.join("i18n", "request.ts")]);
  });
});
