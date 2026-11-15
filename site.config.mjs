// ─────────────────────────────────────────────────────────────
// Raqmio — single place for facts the owner controls.
// Edit here, then run:  SITE_URL=https://your-domain.com npm run build
// ─────────────────────────────────────────────────────────────
export const site = {
  name: "Raqmio",
  // Production domain, no trailing slash. Can also be passed as SITE_URL at build time.
  // Needed for canonical URLs, hreflang, Open Graph, sitemap.xml and robots.txt.
  url: (process.env.SITE_URL || "").replace(/\/+$/, ""),
  // Optional GitHub Pages project path, e.g. /raqmio. Empty for a custom/root domain.
  basePath: (() => {
    const value = (process.env.SITE_BASE || "").replace(/^\/+|\/+$/g, "");
    return value ? `/${value}` : "";
  })(),
  phoneLocal: "01211659075",
  phoneIntl: "+201211659075",
  whatsappNumber: "201211659075",
  email: "",            // e.g. "hello@raqmio.com" — leave empty to hide email everywhere
  defaultLocale: "ar",  // where "/" sends visitors whose browser is not English
  legalUpdated: "2026-11-15", // shown on Privacy and Terms; update when the text changes
  social: {             // add real profile URLs only; empty values are never shown
    linkedin: "",
    facebook: "",
    instagram: "",
    x: ""
  }
};
