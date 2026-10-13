// Writes a static HTML file per tool page after `vite build`, so crawlers and link
// previews that do not run JavaScript see each tool's own title, description and
// canonical URL instead of the single generic head from index.html.
//
// The values are read from each page's usePageSeo({ title, description, canonical })
// call, so the page component stays the single source of truth.
//
// Output: dist/<slug>.html  (served by Cloudflare Pages as /tools/<slug>).
// The hub page (/tools) head is written into dist/index.html.

import { readFileSync, writeFileSync, readdirSync, existsSync } from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const distDir = process.env.PRERENDER_DIST || path.join(root, "dist");
const pagesDir = path.join(root, "src", "pages");
const indexPath = path.join(distDir, "index.html");

if (!existsSync(indexPath)) {
  console.error(`prerender: ${indexPath} not found. Run "vite build" first.`);
  process.exit(1);
}

const template = readFileSync(indexPath, "utf8");

const escapeAttr = (value) =>
  value.replace(/&/g, "&amp;").replace(/"/g, "&quot;").replace(/</g, "&lt;").replace(/>/g, "&gt;");

const escapeText = (value) => value.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");

// Read a string literal for `key:` inside the usePageSeo({ ... }) call.
function readSeoValue(block, key) {
  const match = block.match(new RegExp(`${key}:\\s*(["'\`])((?:\\\\.|(?!\\1)[\\s\\S])*)\\1`));
  return match ? match[2].replace(/\\(["'`])/g, "$1") : null;
}

function readPageSeo(file) {
  const source = readFileSync(path.join(pagesDir, file), "utf8");
  const start = source.indexOf("usePageSeo({");
  if (start === -1) return null;
  const block = source.slice(start, start + 1500);
  const title = readSeoValue(block, "title");
  const description = readSeoValue(block, "description");
  const canonical = readSeoValue(block, "canonical");
  if (!title || !description || !canonical) return null;
  return { title, description, canonical };
}

function withSeo(html, { title, description, canonical }) {
  const t = escapeAttr(title);
  const d = escapeAttr(description);
  const c = escapeAttr(canonical);
  let out = html;
  out = out.replace(/<title>[\s\S]*?<\/title>/, `<title>${escapeText(title)}</title>`);
  out = out.replace(/(<meta\s+name="description"\s+content=")[^"]*(")/, `$1${d}$2`);
  out = out.replace(/(<meta\s+property="og:title"\s+content=")[^"]*(")/, `$1${t}$2`);
  out = out.replace(/(<meta\s+property="og:description"\s+content=")[^"]*(")/, `$1${d}$2`);
  out = out.replace(/(<meta\s+property="og:url"\s+content=")[^"]*(")/, `$1${c}$2`);
  out = out.replace(/(<meta\s+name="twitter:title"\s+content=")[^"]*(")/, `$1${t}$2`);
  out = out.replace(/(<meta\s+name="twitter:description"\s+content=")[^"]*(")/, `$1${d}$2`);
  out = out.replace(/(<link\s+rel="canonical"\s+href=")[^"]*(")/, `$1${c}$2`);
  return out;
}

const written = [];
const skipped = [];

for (const file of readdirSync(pagesDir).filter((name) => name.endsWith(".jsx"))) {
  const seo = readPageSeo(file);
  if (!seo) {
    skipped.push(file);
    continue;
  }

  const pathname = new URL(seo.canonical).pathname.replace(/\/+$/, "");
  const slug = pathname.replace(/^\/tools\/?/, "");

  if (!slug) {
    // Hub page (/tools): the root index.html is what /tools serves.
    writeFileSync(indexPath, withSeo(template, seo));
    written.push("index.html (hub)");
    continue;
  }

  // index.html bakes in JSON-LD for the macro calculator (WebApplication and a macro FAQ).
  // That is wrong for every other tool, and each page adds its own JSON-LD at runtime via
  // usePageSeo, so drop all the baked-in blocks from the per-tool copies.
  const html = withSeo(template, seo).replace(/\s*<script type="application\/ld\+json">[\s\S]*?<\/script>/g, "");
  writeFileSync(path.join(distDir, `${slug}.html`), html);
  written.push(`${slug}.html`);
}

console.log(`prerender: wrote ${written.length} file(s): ${written.join(", ")}`);
if (skipped.length) {
  console.log(`prerender: no usePageSeo values found in: ${skipped.join(", ")}`);
}
