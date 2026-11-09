const nextJest = require("next/jest");

const createJestConfig = nextJest({
  dir: "./",
});

const customJestConfig = {
  testEnvironment: "jsdom",
  setupFilesAfterEnv: ["<rootDir>/jest.setup.ts"],
  moduleNameMapper: {
    "^@/(.*)$": "<rootDir>/src/$1",
    "\\.(css|less|scss|sass)$": "<rootDir>/test/styleMock.js",
    "\\.(gif|ttf|eot|svg|png|jpg|jpeg|webp|avif)$":
      "<rootDir>/test/fileMock.js",
  },
  collectCoverageFrom: [
    "src/**/*.{ts,tsx}",
    "!src/**/*.d.ts",
    "!src/**/*.test.{ts,tsx}",
    "!src/components/ui/**", // shadcn/Radix wrappers, not our logic
    "!src/locales/**",
  ],
  // Ratchet: floors sit just under the measured baseline (2026-11-09) so coverage cannot regress.
  // Raise them as tests are added (auth/casl/axios are the Phase 4/6 targets). Jest excludes files
  // matched by a path entry from the global numbers.
  coverageThreshold: {
    global: { statements: 14, branches: 11, functions: 10, lines: 14 },
    "./src/lib/utils/": { lines: 55, branches: 55 },
    "./src/features/auth/": { lines: 40, branches: 35 },
    "./src/features/chatbot/": { lines: 60, branches: 60 },
  },
  testPathIgnorePatterns: ["<rootDir>/.next/", "<rootDir>/node_modules/"],
  watchman: false,
};

const buildConfig = createJestConfig(customJestConfig);

// sanitize-html pulls in ESM-only htmlparser2 (and friends); let Jest transform just those.
// The lookahead targets the *last* node_modules segment so nested installs are covered too.
const ESM_PACKAGES = [
  "htmlparser2",
  "domhandler",
  "domutils",
  "domelementtype",
  "dom-serializer",
  "entities",
];

module.exports = async () => {
  const config = await buildConfig();
  config.transformIgnorePatterns = [
    `/node_modules/(?!.*/node_modules/)(?!(?:${ESM_PACKAGES.join("|")})/)`,
    "^.+\\.module\\.(css|sass|scss)$",
  ];
  return config;
};
