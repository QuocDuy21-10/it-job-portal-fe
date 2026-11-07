# Docs Website Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Publish the existing VitePress docs as a branded site on GitHub Pages and refresh the GitHub README to point at it.

**Architecture:** The site already exists (`docs/.vitepress/config.mts`). We add a Pages workflow and `base`, a light theme override (CSS variables only), a few assets under `docs/public/`, presentation polish on key pages, and README additions. No app code (`src/`) is touched.

**Tech Stack:** VitePress 1.6.4, vitepress-plugin-mermaid 2.0.17, GitHub Actions (Pages), Node 20.19.5.

**Spec:** `docs/superpowers/specs/2026-11-07-docs-website-design.md`

## Global Constraints

- Site URL: `https://quocduy21-10.github.io/it-job-portal-fe/`; `base: '/it-job-portal-fe/'`.
- Site language stays Vietnamese (`vi-VN`); no English i18n for docs.
- Brand color `#2563eb` (the app's `--primary`); reuse the app's logo and favicon, create no new artwork.
- Do not change `src/`, do not rewrite page content, no PR previews, no analytics.
- `.gitignore` ignores `/docs/*` except listed paths; every new tracked docs path must be whitelisted, and `docs/superpowers/**` files are committed with `git add -f`.
- Already configured, do not redo: local search with Vietnamese translations, `outline` [2,3], `docFooter`, `socialLinks`, `footer`, `lastUpdated: true`.
- Commit messages end with `Co-Authored-By: Claude Sonnet 5.5 <noreply@anthropic.com>`.

## File Structure

- Create `.github/workflows/docs.yml`: build and deploy to Pages.
- Create `docs/public/logo.png`, `docs/public/favicon.png`, `docs/public/hero.png`, `docs/public/icons/*.svg`: static assets.
- Create `docs/.vitepress/theme/index.ts`, `docs/.vitepress/theme/custom.css`: brand override.
- Modify `docs/.vitepress/config.mts`: `base`, `sitemap`, `head`, `logo`, `editLink`, `lastUpdated` text.
- Modify `docs/index.md`: hero image, SVG icons.
- Modify `.gitignore`: whitelist `docs/public/` and `docs/superpowers/`.
- Modify three pages for presentation, and `README.md`.

---

### Task 1: Deploy to GitHub Pages

**Files:**
- Modify: `.gitignore`, `docs/.vitepress/config.mts`
- Create: `.github/workflows/docs.yml`, `docs/public/favicon.png`

**Interfaces:**
- Produces: `docs/public/` is tracked (Tasks 2, 3 add assets there); config has `base`, `head`, `sitemap`.

- [ ] **Step 1: Whitelist new paths in .gitignore**

Add after the line `!/docs/assets/`:

```
!/docs/public/
!/docs/superpowers/
```

Run: `git check-ignore -v docs/public/x.png docs/superpowers/plans/x.md`
Expected: no output (neither is ignored).

- [ ] **Step 2: Add favicon asset**

Run: `mkdir -p docs/public && cp src/app/favicon.ico docs/public/favicon.png`
(The file is a 128x128 PNG despite the `.ico` name, so it is copied as `.png`.)

- [ ] **Step 3: Edit config.mts**

Inside `defineConfig({`, after `ignoreDeadLinks: true,` add:

```ts
    base: '/it-job-portal-fe/',
    sitemap: { hostname: 'https://quocduy21-10.github.io/it-job-portal-fe/' },
    head: [
      ['link', { rel: 'icon', type: 'image/png', href: '/it-job-portal-fe/favicon.png' }],
      ['meta', { property: 'og:type', content: 'website' }],
      ['meta', { property: 'og:title', content: 'DevLink Docs' }],
      ['meta', { property: 'og:description', content: 'Tài liệu Kỹ thuật & Kiến trúc Hệ thống DevLink Frontend' }],
      ['meta', { property: 'og:image', content: 'https://quocduy21-10.github.io/it-job-portal-fe/hero.png' }],
    ],
```

(`head` hrefs are not auto-prefixed with `base`, hence the explicit prefix.)

- [ ] **Step 4: Create the workflow**

```yaml
name: Deploy docs

on:
  push:
    branches: [main]
    paths: ['docs/**', 'package.json', 'package-lock.json', '.github/workflows/docs.yml']
  workflow_dispatch:

permissions:
  contents: read
  pages: write
  id-token: write

concurrency:
  group: pages
  cancel-in-progress: false

jobs:
  build:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
        with:
          fetch-depth: 0
      - uses: actions/setup-node@v4
        with:
          node-version: 20
          cache: npm
      - run: npm ci
      - run: npm run docs:build
      - uses: actions/upload-pages-artifact@v3
        with:
          path: docs/.vitepress/dist
  deploy:
    needs: build
    runs-on: ubuntu-latest
    environment:
      name: github-pages
      url: ${{ steps.deployment.outputs.page_url }}
    steps:
      - id: deployment
        uses: actions/deploy-pages@v4
```

- [ ] **Step 5: Build and check base**

Run: `npm run docs:build && grep -c "/it-job-portal-fe/" docs/.vitepress/dist/index.html`
Expected: build succeeds; count is greater than 0.

- [ ] **Step 6: Preview under the sub-path**

Run: `npx vitepress preview docs --port 4173` (background), then `curl -s -o /dev/null -w "%{http_code}\n" http://localhost:4173/it-job-portal-fe/00-start-here/introduction` and `curl -s -o /dev/null -w "%{http_code}\n" http://localhost:4173/it-job-portal-fe/favicon.png`
Expected: `200` for both. Stop the server afterwards.

- [ ] **Step 7: Commit**

```bash
git add .gitignore docs/.vitepress/config.mts docs/public/favicon.png .github/workflows/docs.yml
git add -f docs/superpowers/plans/2026-11-07-docs-website.md
git commit -m "docs: deploy the documentation site to GitHub Pages"
```

Then tell the repo owner: Settings → Pages → Source = "GitHub Actions" (manual, cannot be scripted). The workflow only goes green after that and after the commits are pushed to `main`.

---

### Task 2: Brand theme, logo and homepage

**Files:**
- Create: `docs/.vitepress/theme/index.ts`, `docs/.vitepress/theme/custom.css`, `docs/public/logo.png`, `docs/public/hero.png`, `docs/public/icons/layers.svg`, `shield.svg`, `book.svg`, `bulb.svg`
- Modify: `docs/.vitepress/config.mts`, `docs/index.md`

**Interfaces:**
- Consumes: `docs/public/` tracked (Task 1).
- Produces: `/logo.png` and `/hero.png` public paths (the README in Task 4 reuses `public/images/...` instead, not these).

- [ ] **Step 1: Make a cropped logo**

The source `public/images/logo.png` is 1024x576 with large margins; the nav needs a tight crop. No ImageMagick or PIL is installed, so use macOS `sips`:

Run: `sips -c 190 940 --cropOffset 190 40 public/images/logo.png --out docs/public/logo.png`
Then Read `docs/public/logo.png` and confirm the "DevLink" mark and text are fully visible with little margin. If clipped, adjust the numbers (`-c height width --cropOffset top left`) and repeat.

- [ ] **Step 2: Add hero image**

Run: `cp public/images/screenshots/home_1_page.png docs/public/hero.png`

- [ ] **Step 3: Create the theme entry**

`docs/.vitepress/theme/index.ts`:

```ts
import DefaultTheme from 'vitepress/theme'
import './custom.css'

export default DefaultTheme
```

- [ ] **Step 4: Create custom.css**

```css
:root {
  --vp-font-family-base: 'Inter', ui-sans-serif, system-ui, -apple-system, 'Segoe UI', sans-serif;
  --vp-c-brand-1: #2563eb;
  --vp-c-brand-2: #3b82f6;
  --vp-c-brand-3: #1d4ed8;
  --vp-c-brand-soft: rgba(37, 99, 235, 0.14);
  --vp-button-brand-bg: #2563eb;
  --vp-button-brand-hover-bg: #1d4ed8;
  --vp-home-hero-name-color: transparent;
  --vp-home-hero-name-background: linear-gradient(120deg, #2563eb 30%, #00bfa5);
}

.dark {
  --vp-c-brand-1: #60a5fa;
  --vp-c-brand-2: #3b82f6;
  --vp-c-brand-3: #2563eb;
}

.VPNavBarTitle .logo {
  height: 28px;
  width: auto;
}

.VPHero .image-src {
  max-width: 460px;
  border-radius: 12px;
  box-shadow: 0 12px 40px rgba(37, 99, 235, 0.25);
}
```

Inter is loaded by adding to `head` in config (Step 6); the fallback stack keeps the site fine if the font request fails.

- [ ] **Step 5: Create the four feature icons**

Each is 24x24, stroke `#2563eb`. `docs/public/icons/layers.svg`:

```svg
<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#2563eb" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="m12.83 2.18a2 2 0 0 0-1.66 0L2.6 6.08a1 1 0 0 0 0 1.83l8.58 3.91a2 2 0 0 0 1.66 0l8.58-3.9a1 1 0 0 0 0-1.83Z"/><path d="m22 17.65-9.17 4.16a2 2 0 0 1-1.66 0L2 17.65"/><path d="m22 12.65-9.17 4.16a2 2 0 0 1-1.66 0L2 12.65"/></svg>
```

`shield.svg` (same wrapper), inner:
`<path d="M20 13c0 5-3.5 7.5-7.66 8.95a1 1 0 0 1-.67-.01C7.5 20.5 4 18 4 13V6a1 1 0 0 1 1-1c2 0 4.5-1.2 6.24-2.72a1.17 1.17 0 0 1 1.52 0C14.51 3.81 17 5 19 5a1 1 0 0 1 1 1z"/><path d="m9 12 2 2 4-4"/>`

`book.svg` (same wrapper), inner:
`<path d="M12 7v14"/><path d="M3 18a1 1 0 0 1-1-1V4a1 1 0 0 1 1-1h5a4 4 0 0 1 4 4 4 4 0 0 1 4-4h5a1 1 0 0 1 1 1v13a1 1 0 0 1-1 1h-6a3 3 0 0 0-3 3 3 3 0 0 0-3-3z"/>`

`bulb.svg` (same wrapper), inner:
`<path d="M15 14c.2-1 .7-1.7 1.5-2.5 1-.9 1.5-2.2 1.5-3.5A6 6 0 0 0 6 8c0 1 .2 2.2 1.5 3.5.7.7 1.3 1.5 1.5 2.5"/><path d="M9 18h6"/><path d="M10 22h4"/>`

- [ ] **Step 6: Edit config.mts**

Add to the `head` array: `['link', { rel: 'stylesheet', href: 'https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap' }],`

Inside `themeConfig`, replace `logo: undefined,` with `logo: '/logo.png',` and add next to `outline`:

```ts
      editLink: {
        pattern: 'https://github.com/QuocDuy21-10/it-job-portal-fe/edit/main/docs/:path',
        text: 'Sửa trang này trên GitHub',
      },
      lastUpdated: { text: 'Cập nhật lần cuối' },
```

- [ ] **Step 7: Update docs/index.md**

In the `hero:` block add (indented two spaces, after `tagline`):

```yaml
  image:
    src: /hero.png
    alt: Trang chủ DevLink
```

In `features:` remove the leading emoji from each `title` and add an `icon` line to each item:

```yaml
  - icon: { src: /icons/layers.svg }
    title: Kiến trúc Next.js 15 & Feature-First
  - icon: { src: /icons/shield.svg }
    title: Xác thực & Phân quyền bảo mật
  - icon: { src: /icons/book.svg }
    title: Hai lớp hiển thị tài liệu
  - icon: { src: /icons/bulb.svg }
    title: Giải thích trước — Kỹ thuật sau
```

Keep each `details:` text unchanged.

- [ ] **Step 8: Build and look at it**

Run: `npm run docs:build` then `npx vitepress preview docs --port 4173` (background). With the Playwright MCP tools, open `http://localhost:4173/it-job-portal-fe/`, take screenshots at 1280 width light, 1280 dark (toggle the appearance switch), and 390 width. Check: logo visible in nav, gradient hero name, hero image shown, four SVG icons shown, no horizontal scroll at 390, search box opens and `đăng nhập` returns results.
Expected: all true. Fix CSS and re-check if not. Stop the server.

- [ ] **Step 9: Commit**

```bash
git add docs/.vitepress docs/public docs/index.md
git commit -m "docs: add DevLink brand theme, logo and homepage hero"
```

---

### Task 3: Visual content

**Files:**
- Modify: `docs/00-start-here/introduction.md`, `docs/00-start-here/features-overview.md`, `docs/04-features/README.md`, possibly `docs/.vitepress/config.mts`

**Interfaces:**
- Consumes: working site build (Tasks 1, 2).

- [ ] **Step 1: Check that screenshots render on the site**

Pages reference images as `../../public/images/screenshots/...` (40 references in 15 pages), outside `docs/`.

Run: `npm run docs:build && ls docs/.vitepress/dist/assets | grep -c "home_1_page\|job_list_page\|create_cv_page"`
Expected: 3 or more. Then preview and open `/it-job-portal-fe/00-start-here/screenshots` with Playwright; use `browser_evaluate` with `[...document.images].filter(i => !i.naturalWidth).length`.
Expected: `0`. If 0, the existing paths work on both GitHub and the site: change nothing. If images are broken: `mkdir -p docs/public/screenshots && cp -R public/images/screenshots/* docs/public/screenshots/`, then rewrite every `](../../public/images/screenshots/` to `](../public/screenshots/` in `docs/0[0-6]*/**/*.md` with `sed -i '' 's#\.\./\.\./public/images/screenshots/#../public/screenshots/#g'` (check nested pages for different depth with `grep -rn "public/images" docs/0[0-6]*`), rebuild, re-run the check, and confirm the same relative path still renders on GitHub (it resolves to `docs/public/screenshots/`).

- [ ] **Step 2: Polish three pages**

For each of `introduction.md`, `features-overview.md`, `04-features/README.md`: Read it fully, then apply only presentation changes, never rewrite meaning:
  - Convert any list of parallel items with 2+ attributes into a Markdown table.
  - Wrap the one or two most important caveats in `::: warning` ... `:::` and the key pointers in `::: tip` ... `:::` (example: `::: tip Gợi ý` newline text newline `:::`).
  - Add one existing screenshot (`../../public/images/screenshots/<file>.png` or the working path from Step 1) with an italic caption where a screenshot already matches the topic.
Acceptance: page text content unchanged apart from the above; headings unchanged.

- [ ] **Step 3: Check Mermaid in dark mode**

Preview the site; open `/it-job-portal-fe/02-architecture/overview` and one page from `05-business-flows` in dark mode via Playwright. Screenshot and check labels are readable against the background.
If a diagram is unreadable, add to `config.mts` `mermaid: { theme: 'dark' }` is NOT enough (the plugin switches theme with the appearance toggle by itself); first confirm the problem is real and note which diagram, then fix with a `themeVariables` entry inside the `mermaid:` block. If all are readable, change nothing.

- [ ] **Step 4: Audit dead links**

Temporarily set `ignoreDeadLinks: false` in `config.mts`, run `npm run docs:build 2>&1 | grep -i "dead link"`. Fix each real broken link in its Markdown source. Restore `ignoreDeadLinks: true` before committing, because some intentional links target repo files that are not part of the site.
Expected after fixes: the grep prints nothing with the strict setting.

- [ ] **Step 5: Final build, then commit**

Run: `npm run docs:build`
Expected: succeeds.

```bash
git add docs
git commit -m "docs: polish presentation of key pages and fix broken links"
```

---

### Task 4: README for GitHub

**Files:**
- Modify: `README.md`

**Interfaces:**
- Consumes: the site URL (live only after the Pages setting and push; the link is valid by construction).

The README already has badges, features, screenshots, tech stack, architecture and install sections. Add a docs entry point, do not rewrite what works.

- [ ] **Step 1: Add docs badge and call-to-action**

Directly under the badges `</p>` block (before the "DevLink is a modern" paragraph), insert:

```markdown
<p align="center">
  <a href="https://quocduy21-10.github.io/it-job-portal-fe/"><img src="https://img.shields.io/badge/Docs-Read_the_documentation-2563eb?style=for-the-badge&logo=readthedocs&logoColor=white" alt="Documentation" /></a>
  <a href="https://github.com/QuocDuy21-10/it-job-portal-fe/actions/workflows/docs.yml"><img src="https://github.com/QuocDuy21-10/it-job-portal-fe/actions/workflows/docs.yml/badge.svg" alt="Docs deploy status" /></a>
</p>
```

- [ ] **Step 2: Replace the documentation note**

Replace the blockquote line starting `> 📚 **Documentation**` with:

```markdown
> 📚 **Documentation website**: **https://quocduy21-10.github.io/it-job-portal-fe/** (search, dark mode, diagrams). The same Markdown is readable on GitHub from [`docs/`](docs/README.md).

| Start here | Go deeper |
| :-- | :-- |
| [Introduction](docs/00-start-here/introduction.md) | [Architecture](docs/02-architecture/overview.md) |
| [Run locally](docs/01-getting-started/run-locally.md) | [Features](docs/04-features/README.md) |
| [Environment variables](docs/01-getting-started/environment-variables.md) | [Business flows](docs/05-business-flows/README.md) |
```

- [ ] **Step 3: Check links and Mermaid**

Run: `for f in $(grep -o '](docs/[^)]*)' README.md | sed 's/](//;s/)//'); do [ -e "$f" ] || echo "MISSING $f"; done`
Expected: no `MISSING` lines.
The README's architecture section already holds a diagram; confirm with `grep -n '```mermaid' README.md`. If none, add nothing and report it (the spec's overview diagram is satisfied only if one exists; do not invent a new one without the user).

- [ ] **Step 4: Commit**

```bash
git add README.md
git commit -m "docs: link the documentation website from the README"
```

- [ ] **Step 5: Final verification before claiming done**

Run: `npm run docs:build && npx tsc --noEmit` and report both results. Tell the user what was not verified: the GitHub Actions run, the live URL, and README rendering on github.com, none of which can be checked until the branch is pushed and Pages is enabled.
