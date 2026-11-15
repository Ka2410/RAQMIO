import assert from "node:assert/strict";
import { access, readdir, readFile } from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { services } from "../src/content.mjs";
import { site } from "../site.config.mjs";

const projectRoot = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const outputRoot = path.join(projectRoot, "dist");

async function htmlFiles(directory) {
  const entries = await readdir(directory, { withFileTypes: true });
  const files = await Promise.all(entries.map(async (entry) => {
    const absolutePath = path.join(directory, entry.name);
    if (entry.isDirectory()) return htmlFiles(absolutePath);
    return entry.isFile() && entry.name.endsWith(".html") ? [absolutePath] : [];
  }));
  return files.flat();
}

async function fileExists(filePath) {
  try {
    await access(filePath);
    return true;
  } catch {
    return false;
  }
}

const pages = await htmlFiles(outputRoot);
const expectedPageCount = 30;
assert.equal(pages.length, expectedPageCount, `Expected ${expectedPageCount} pages, found ${pages.length}`);

let internalLinks = 0;
let whatsappLinks = 0;
let telephoneLinks = 0;
const interactionScript = await readFile(path.join(projectRoot, "src", "site.js"), "utf8");
const assetPrefix = `${site.basePath}/assets`;

for (const pagePath of pages) {
  const html = await readFile(pagePath, "utf8");
  const relativePath = path.relative(outputRoot, pagePath).replaceAll(path.sep, "/");
  const localeMatch = relativePath.match(/^(en|ar)\//);

  assert.match(html, /<main\b[^>]*id="main"/, `${relativePath} needs a main landmark`);
  if (relativePath !== "index.html") {
    assert.ok(html.includes(`<script src="${assetPrefix}/site.js" defer></script>`), `${relativePath} needs the interaction script`);
    assert.ok(html.includes(`<link rel="stylesheet" href="${assetPrefix}/site.css">`), `${relativePath} needs the stylesheet`);
  }

  if (localeMatch) {
    const lang = localeMatch[1];
    assert.match(html, new RegExp(`<html lang="${lang}" dir="(ltr|rtl)">`), `${relativePath} has incorrect language metadata`);
    assert.match(html, /https:\/\/wa\.me\/201211659075/, `${relativePath} needs the verified WhatsApp contact URL`);
  }

  for (const anchorMatch of html.matchAll(/<a\b[^>]*>/g)) {
    const tag = anchorMatch[0];
    const hrefMatch = tag.match(/\bhref="([^"]*)"/);
    if (!hrefMatch) continue;
    const href = hrefMatch[1];

    if (href.startsWith("https://wa.me/")) {
      whatsappLinks += 1;
      assert.match(href, /^https:\/\/wa\.me\/201211659075(?:\?|$)/, `Unexpected WhatsApp destination in ${relativePath}`);
    } else if (href.startsWith("tel:")) {
      telephoneLinks += 1;
      assert.equal(href, "tel:01211659075", `Unexpected telephone destination in ${relativePath}`);
    } else if (href.startsWith(`${site.basePath}/`) || (!site.basePath && href.startsWith("/"))) {
      const publicPath = decodeURIComponent(href.split(/[?#]/, 1)[0]);
      const pathname = site.basePath ? publicPath.slice(site.basePath.length) : publicPath;
      const targetPath = path.resolve(outputRoot, `.${pathname}`);
      assert.ok(targetPath.startsWith(`${outputRoot}${path.sep}`), `Unsafe local link in ${relativePath}: ${href}`);
      const targetFile = pathname.endsWith(".html") ? targetPath : path.join(targetPath, "index.html");
      assert.ok(await fileExists(targetFile), `Broken local link in ${relativePath}: ${href}`);
      internalLinks += 1;
    }

    if (tag.includes('target="_blank"')) {
      assert.match(tag, /\brel="[^"]*(?:noopener)[^"]*"/, `New tab link in ${relativePath} must use noopener`);
    }
  }

  for (const buttonMatch of html.matchAll(/<button\b[^>]*>/g)) {
    const button = buttonMatch[0];
    const idMatch = button.match(/\bid="([^"]+)"/);
    const buttonId = idMatch?.[1];
    assert.ok(buttonId, `Button in ${relativePath} needs an id for behavior tracking`);
    assert.match(button, /\btype="(?:button|submit|reset)"/, `Button ${buttonId} in ${relativePath} needs an explicit type`);
    assert.ok(interactionScript.includes(`#${buttonId}`), `No interaction handler found for button #${buttonId}`);
  }
}

for (const lang of ["en", "ar"]) {
  const routePath = path.join(outputRoot, lang, "services");
  const directories = (await readdir(routePath, { withFileTypes: true })).filter((entry) => entry.isDirectory());
  assert.equal(directories.length, services.length, `Incorrect service route count for ${lang}`);
}

assert.ok(whatsappLinks >= 30, `Expected WhatsApp actions across routes, found ${whatsappLinks}`);
assert.ok(telephoneLinks >= 4, `Expected direct phone links, found ${telephoneLinks}`);
assert.ok(internalLinks > 100, `Expected a complete internal navigation graph, found ${internalLinks} links`);

console.log(`Verified ${pages.length} pages, ${internalLinks} local links, ${whatsappLinks} WhatsApp links, and ${telephoneLinks} phone links.`);

// ── Quality gates added for the production build ──
const titles = new Map();
for (const pagePath of pages) {
  const html = await readFile(pagePath, "utf8");
  const rel = path.relative(outputRoot, pagePath).replaceAll(path.sep, "/");
  if (rel === "index.html") continue;
  assert.equal((html.match(/<h1\b/g) || []).length, 1, `${rel} must have exactly one h1`);
  const title = html.match(/<title>([^<]+)<\/title>/)?.[1];
  assert.ok(title, `${rel} needs a title`);
  assert.match(html, /<meta name="description" content="[^"]{40,}/, `${rel} needs a meaningful meta description`);
  if (!rel.endsWith("404.html")) {
    assert.ok(!titles.has(title), `Duplicate title in ${rel} and ${titles.get(title)}`);
    titles.set(title, rel);
    assert.match(html, /hreflang="x-default"/, `${rel} needs hreflang alternates`);
  }
  for (const img of html.matchAll(/<img\b[^>]*>/g)) assert.match(img[0], /\balt=/, `Image without alt in ${rel}`);
  assert.ok(!/undefined|\[object Object\]|NaN/.test(html), `${rel} contains a rendering leak`);
}
for (const asset of ["assets/site.css", "assets/site.js", "assets/og-image.png", "assets/favicon-32.png", "assets/fonts/inter-var.woff2", "assets/fonts/plex-arabic-600.woff2", "site.webmanifest", "robots.txt"]) {
  assert.ok(await fileExists(path.join(outputRoot, asset)), `Missing asset: ${asset}`);
}
if (site.basePath) {
  const css = await readFile(path.join(outputRoot, "assets", "site.css"), "utf8");
  assert.ok(css.includes(`url("${site.basePath}/assets/fonts/`), "Stylesheet font URLs need the GitHub Pages base path");
  const manifest = JSON.parse(await readFile(path.join(outputRoot, "site.webmanifest"), "utf8"));
  assert.ok(manifest.start_url.startsWith(`${site.basePath}/`), "Manifest start URL needs the GitHub Pages base path");
  const index = await readFile(path.join(outputRoot, "index.html"), "utf8");
  assert.ok(index.includes(`${site.basePath}/ar/`), "Root language redirect needs the GitHub Pages base path");
}
console.log(`Quality gates passed: ${titles.size} unique page titles, one h1 per page, alt text, hreflang, assets present.`);
