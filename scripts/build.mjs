import { cp, mkdir, readFile, rm, writeFile } from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { locales, services } from "../src/content.mjs";
import { renderSitePage, urlFor } from "../src/render.mjs";
import { site } from "../site.config.mjs";

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const out = path.join(root, "dist");

async function writeRoute(route, html) {
  const publicRoute = site.basePath && route.startsWith(`${site.basePath}/`) ? route.slice(site.basePath.length) : route;
  const relativeRoute = publicRoute.replace(/^\/+/, "");
  const target = path.resolve(out, relativeRoute, ...(route.endsWith(".html") ? [] : ["index.html"]));
  if (!target.startsWith(`${out}${path.sep}`)) throw new Error(`Refusing to write outside dist/: ${route}`);
  await mkdir(path.dirname(target), { recursive: true });
  await writeFile(target, html, "utf8");
}

await rm(out, { recursive: true, force: true });
await mkdir(path.join(out, "assets"), { recursive: true });
const sourceStyles = await readFile(path.join(root, "src", "styles.css"), "utf8");
const deployStyles = site.basePath ? sourceStyles.replace(/url\((['"])\/assets\//g, `url($1${site.basePath}/assets/`) : sourceStyles;
await writeFile(path.join(out, "assets", "site.css"), deployStyles, "utf8");
await cp(path.join(root, "src", "site.js"), path.join(out, "assets", "site.js"));
await cp(path.join(root, "public"), path.join(out, "assets"), { recursive: true });
await cp(path.join(root, "public", "icon-192.png"), path.join(out, "assets", "icon-192.png"));

const pages = [["", "home"], ["about", "about"], ["services", "services"], ["process", "process"], ["contact", "contact"], ["privacy", "privacy"], ["terms", "terms"]];
const routes = [];
for (const lang of locales) {
  for (const [part, page] of pages) {
    await writeRoute(urlFor(lang, part), renderSitePage(lang, page));
    routes.push(urlFor(lang, part));
  }
  for (const service of services) {
    const r = urlFor(lang, `services/${service.slug}`);
    await writeRoute(r, renderSitePage(lang, "service", service));
    routes.push(r);
  }
  await writeRoute(urlFor(lang, "404.html"), renderSitePage(lang, "404"));
}
await writeRoute("404.html", renderSitePage(site.defaultLocale, "404"));

// "/" → visitor's language (English browsers → /en/, everyone else → default locale).
const d = site.defaultLocale;
const localeUrl = (locale) => urlFor(locale);
await writeFile(path.join(out, "index.html"), `<!doctype html><html lang="${d}"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><title>Raqmio</title><meta name="robots" content="noindex,follow"><meta name="theme-color" content="#060a11">${site.url ? `<link rel="canonical" href="${site.url}${localeUrl(d)}">` : ""}<link rel="alternate" hreflang="ar" href="${site.url}${localeUrl("ar")}"><link rel="alternate" hreflang="en" href="${site.url}${localeUrl("en")}"><link rel="alternate" hreflang="x-default" href="${site.url}${localeUrl(d)}"><noscript><meta http-equiv="refresh" content="0;url=${localeUrl(d)}"></noscript><script>var l=(navigator.language||"").toLowerCase();location.replace(l.indexOf("ar")===0?"${localeUrl("ar")}":l.indexOf("en")===0?"${localeUrl("en")}":"${localeUrl(d)}")</script><style>body{background:#060a11;color:#eef3f7;font:18px system-ui,sans-serif;display:grid;place-items:center;min-height:100vh;margin:0}a{color:#1ed6e6;margin:0 12px}</style></head><body><main id="main"><p><a href="${localeUrl("ar")}">العربية</a><a href="${localeUrl("en")}">English</a></p></main></body></html>`, "utf8");

// Web app manifest
await writeFile(path.join(out, "site.webmanifest"), JSON.stringify({
  name: "Raqmio", short_name: "Raqmio", start_url: localeUrl(d), display: "browser",
  background_color: "#060a11", theme_color: "#060a11",
  icons: [{ src: `${site.basePath}/assets/icon-192.png`, sizes: "192x192", type: "image/png" }, { src: `${site.basePath}/assets/icon-512.png`, sizes: "512x512", type: "image/png" }]
}, null, 2), "utf8");

// SEO files need the production domain.
if (site.url) {
  const alt = (r) => {
    const logical = r.slice(site.basePath.length);
    const m = logical.match(/^\/(ar|en)(\/.*)$/); const o = m[1] === "ar" ? "en" : "ar";
    return [`${site.basePath}/${m[1]}${m[2]}`, `${site.basePath}/${o}${m[2]}`];
  };
  const urls = routes.filter((r) => !/\/(privacy|terms)\/$/.test(r) || true).map((r) => {
    const [self, other] = alt(r);
    const isArabic = r.slice(site.basePath.length).startsWith("/ar/");
    const ol = isArabic ? "en" : "ar";
    return `  <url>\n    <loc>${site.url}${self}</loc>\n    <xhtml:link rel="alternate" hreflang="${isArabic ? "ar" : "en"}" href="${site.url}${self}"/>\n    <xhtml:link rel="alternate" hreflang="${ol}" href="${site.url}${other}"/>\n  </url>`;
  }).join("\n");
  await writeFile(path.join(out, "sitemap.xml"), `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9" xmlns:xhtml="http://www.w3.org/1999/xhtml">\n${urls}\n</urlset>\n`, "utf8");
  await writeFile(path.join(out, "robots.txt"), `User-agent: *\nAllow: /\n\nSitemap: ${site.url}${site.basePath}/sitemap.xml\n`, "utf8");
} else {
  await writeFile(path.join(out, "robots.txt"), "User-agent: *\nAllow: /\n", "utf8");
  console.warn("⚠  SITE_URL is not set: canonical tags, Open Graph URLs and sitemap.xml were skipped.\n   Build for production with:  SITE_URL=https://your-domain.com npm run build");
}

// Hosting configs (ignored by hosts that do not use them).
await writeFile(path.join(out, ".htaccess"), `# Apache / cPanel
Options -Indexes
DirectoryIndex index.html
ErrorDocument 404 /404.html
RewriteEngine On
# Force HTTPS (remove if your host already does this)
RewriteCond %{HTTPS} off
RewriteCond %{HTTP:X-Forwarded-Proto} !https
RewriteRule ^(.*)$ https://%{HTTP_HOST}/$1 [L,R=301]
# Trailing slash for folders
RewriteCond %{REQUEST_FILENAME} -d
RewriteRule ^(.*[^/])$ /$1/ [L,R=301]
<IfModule mod_headers.c>
  Header set X-Content-Type-Options "nosniff"
  Header set Referrer-Policy "strict-origin-when-cross-origin"
  Header set X-Frame-Options "SAMEORIGIN"
  Header set Permissions-Policy "camera=(), microphone=(), geolocation=()"
  <FilesMatch "\\.(woff2|png|css|js)$">
    Header set Cache-Control "public, max-age=2592000"
  </FilesMatch>
</IfModule>
<IfModule mod_deflate.c>
  AddOutputFilterByType DEFLATE text/html text/css application/javascript application/json image/svg+xml
</IfModule>
AddType font/woff2 .woff2
`, "utf8");
await writeFile(path.join(out, "_headers"), `/*
  X-Content-Type-Options: nosniff
  Referrer-Policy: strict-origin-when-cross-origin
  X-Frame-Options: SAMEORIGIN
  Permissions-Policy: camera=(), microphone=(), geolocation=()
/assets/*
  Cache-Control: public, max-age=2592000
`, "utf8");

console.log(`Built ${locales.length * (pages.length + services.length + 1) + 2} HTML pages into dist/${site.url ? ` for ${site.url}` : ""}.`);
