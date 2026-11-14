import { dirname } from "path";
import { fileURLToPath } from "url";
import { FlatCompat } from "@eslint/eslintrc";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const compat = new FlatCompat({
  baseDirectory: __dirname,
});

const eslintConfig = [
  {
    ignores: [
      ".next/**",
      "node_modules/**",
      "out/**",
      "coverage/**",
      "docs/.vitepress/dist/**",
      "docs/.vitepress/cache/**",
    ],
  },
  ...compat.extends("next/core-web-vitals"),
  {
    // console.log must not ship; warn and error stay for real problems.
    files: ["src/**/*.{ts,tsx}"],
    rules: {
      "no-console": ["error", { allow: ["warn", "error"] }],
    },
  },
  {
    // Layer boundaries: shared -> (nothing above) ; features data/config/utils -> (no UI/app layers) ;
    // features components/hooks -> (no app) ; app is never imported.
    // lib/ is excluded on purpose: lib/redux/store.ts is the composition root that wires feature slices.
    files: ["src/**/*.{ts,tsx}"],
    ignores: ["**/*.test.{ts,tsx}"],
    rules: {
      "import/no-cycle": "error",
      "import/no-restricted-paths": [
        "error",
        {
          zones: [
            {
              target: "./src/shared",
              from: [
                "./src/features",
                "./src/components",
                "./src/hooks",
                "./src/contexts",
                "./src/app",
              ],
              message: "shared/ must not depend on higher layers.",
            },
            {
              // Data/config layers of a feature stay UI-free; feature UI lives in components/ and hooks/.
              target: [
                "./src/features/*/{redux,schemas,config,utils,lib}/**",
                "./src/features/*/*.{ts,tsx}",
              ],
              from: [
                "./src/components",
                "./src/hooks",
                "./src/contexts",
                "./src/app",
              ],
              message:
                "features/ data, config and utils must not depend on UI, hooks, contexts or app.",
            },
            {
              target: "./src/features/*/{components,hooks}/**",
              from: "./src/app",
              message: "Nothing outside app/ may import from app/.",
            },
            ...[
              "components",
              "contexts",
              "hooks",
              "i18n",
              "lib",
              "locales",
            ].map((dir) => ({
              target: `./src/${dir}`,
              from: "./src/app",
              message: "Nothing outside app/ may import from app/.",
            })),
          ],
        },
      ],
    },
  },
];

export default eslintConfig;
