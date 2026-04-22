# Dutch Meshcore — SF7 Settings site

Static one-page site built with [Eleventy](https://www.11ty.dev/) + Markdown.

## Edit content

**Day-to-day edits live in one file: `src/index.md`**

The page is structured with custom Markdown containers:

| Syntax | Purpose |
|--------|---------|
| `::: settings` | At-a-glance settings table (edit the table rows) |
| `::: steps-prep` | Wrapper for the 3-column preparation grid |
| `::: step N "Title" "Summary"` | Numbered step card |
| `::: more "Label"` | Hover/tap popover inside a step |
| `::: cli "Label"` | Monospace command block with copy button |

All containers are closed with `:::`.

The site header and footer are in `src/_includes/base.njk` — edit that for nav links, footer text.

## Local preview

```bash
npm install        # once
npm start          # serves at http://localhost:8080
```

## Build

```bash
npm run build      # outputs to _site/
```

## Deploy (Cloudflare Pages)

1. Push this repository to GitHub.
2. In the Cloudflare Pages dashboard, connect your GitHub repository.
3. Use these build settings:
   - **Framework preset**: Eleventy
   - **Build command**: `npm run build`
   - **Output directory**: `_site`
   - **Node version**: set env var `NODE_VERSION=20` (or leave — Cloudflare reads `.nvmrc`)
4. Every push to `main` triggers a new deployment automatically.

## File layout

```
src/index.md          ← edit this for content
src/_includes/base.njk ← edit this for header/footer/nav
src/assets/main.css   ← Swiss Grid stylesheet
src/assets/main.js    ← copy-to-clipboard + popover behaviour
.eleventy.js          ← build config (add new container types here)
```
