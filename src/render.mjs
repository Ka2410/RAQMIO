import { services } from "./content.mjs";
import { copy } from "./copy.mjs";
import { site } from "../site.config.mjs";

const esc = (v = "") => String(v).replace(/[&<>"']/g, (ch) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[ch]));
const assetUrl = (path) => `${site.basePath}${path}`;

export const urlFor = (lang, page = "") => {
  const clean = page.replace(/^\/+|\/+$/g, "");
  if (!clean) return `${site.basePath}/${lang}/`;
  return `${site.basePath}/${lang}/${clean}${clean.endsWith(".html") ? "" : "/"}`;
};
const abs = (path) => (site.url ? `${site.url}${path}` : path);
const serviceUrl = (lang, slug) => urlFor(lang, `services/${slug}`);
const waUrl = (text) => `https://wa.me/${site.whatsappNumber}${text ? `?text=${encodeURIComponent(text)}` : ""}`;
const clip = (text, max = 158) => (text.length <= max ? text : `${text.slice(0, max).replace(/\s+\S*$/, "")}…`);

/* ───────── icons (inline, no external requests) ───────── */
const ICON_WA = `<svg class="ico" viewBox="0 0 24 24" aria-hidden="true" focusable="false"><path fill="currentColor" d="M17.47 14.38c-.3-.15-1.76-.87-2.03-.97-.27-.1-.47-.15-.67.15-.2.3-.77.97-.94 1.17-.17.2-.35.22-.64.07-.3-.15-1.26-.46-2.4-1.48-.88-.79-1.48-1.76-1.65-2.06-.17-.3-.02-.46.13-.6.13-.14.3-.35.45-.52.15-.17.2-.3.3-.5.1-.2.05-.37-.03-.52-.07-.15-.67-1.61-.92-2.2-.24-.58-.49-.5-.67-.51h-.57c-.2 0-.52.07-.79.37-.27.3-1.04 1.02-1.04 2.48 0 1.46 1.07 2.88 1.21 3.07.15.2 2.1 3.2 5.08 4.49.71.3 1.26.49 1.69.63.71.23 1.36.2 1.87.12.57-.08 1.76-.72 2-1.41.25-.7.25-1.29.17-1.41-.07-.13-.27-.2-.57-.35zM12.05 21.8h-.01a9.87 9.87 0 0 1-5.03-1.38l-.36-.21-3.74.98 1-3.65-.24-.37a9.86 9.86 0 0 1-1.51-5.26c0-5.45 4.44-9.88 9.89-9.88 2.64 0 5.12 1.03 6.99 2.9a9.83 9.83 0 0 1 2.89 6.99c0 5.45-4.44 9.88-9.88 9.88zM20.46 3.49A11.82 11.82 0 0 0 12.05 0C5.5 0 .16 5.34.16 11.89c0 2.1.55 4.14 1.59 5.95L.06 24l6.3-1.65a11.88 11.88 0 0 0 5.68 1.45h.01c6.55 0 11.89-5.34 11.89-11.89 0-3.18-1.24-6.17-3.48-8.42z"/></svg>`;
const ICON_PHONE = `<svg class="ico" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true" focusable="false"><path d="M5 4h4l2 5-2.5 1.5a11 11 0 0 0 5 5L15 13l5 2v4a2 2 0 0 1-2 2A16 16 0 0 1 3 6a2 2 0 0 1 2-2z"/></svg>`;
const ICON_ARROW = `<svg class="ico ico--arrow" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true" focusable="false"><path d="M5 12h14M13 6l6 6-6 6"/></svg>`;
const ICON_CHECK = `<svg class="ico" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true" focusable="false"><path d="m5 12.5 4.5 4.5L19 7.5"/></svg>`;
const SERVICE_ICONS = {
  "web-commerce": `<rect x="3" y="4" width="18" height="16" rx="2.5"/><path d="M3 9h18M7 6.5h.01M10 6.5h.01"/><path d="M8 14h8M8 17h5"/>`,
  "mobile-apps": `<rect x="7" y="2.5" width="10" height="19" rx="2.5"/><path d="M10.5 18.5h3"/>`,
  "business-systems": `<rect x="3" y="3" width="7.5" height="7.5" rx="1.5"/><rect x="13.5" y="3" width="7.5" height="7.5" rx="1.5"/><rect x="3" y="13.5" width="7.5" height="7.5" rx="1.5"/><path d="M13.5 17.25h7.5M17.25 13.5v7.5"/>`,
  "saas-products": `<path d="M7 18a4.5 4.5 0 0 1-.6-8.96A6 6 0 0 1 18 8.5a4.75 4.75 0 0 1-.5 9.5z"/><path d="M12 11v6M9.5 13.5 12 11l2.5 2.5"/>`,
  "ai-automation": `<path d="M12 3v3M12 18v3M3 12h3M18 12h3M5.6 5.6l2.1 2.1M16.3 16.3l2.1 2.1M18.4 5.6l-2.1 2.1M7.7 16.3l-2.1 2.1"/><circle cx="12" cy="12" r="3.2"/>`,
  "product-design": `<path d="M4 20l1-4 11-11a2.1 2.1 0 0 1 3 3L8 19z"/><path d="M14 7l3 3M4 20h5"/>`
};
const serviceIcon = (slug) => `<svg class="service-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true" focusable="false">${SERVICE_ICONS[slug] || ""}</svg>`;

/* ───────── small building blocks ───────── */
const btn = (href, label, kind = "primary", { icon = ICON_ARROW, external = false, id = "" } = {}) =>
  `<a class="btn btn--${kind}" href="${esc(href)}"${external ? ' target="_blank" rel="noopener noreferrer"' : ""}${id ? ` id="${id}"` : ""}>${icon === ICON_WA ? icon : ""}<span>${esc(label)}</span>${icon === ICON_WA ? "" : icon}</a>`;
const waBtn = (c, label = c.whatsappCta, kind = "wa", text = c.whatsappGreeting) =>
  btn(waUrl(text), label, kind, { icon: ICON_WA, external: true });
const callBtn = (c, kind = "ghost") =>
  `<a class="btn btn--${kind}" href="${esc(c.phoneHref)}">${ICON_PHONE}<span>${esc(c.callCta)} <bdi dir="ltr">${esc(c.phoneNumber)}</bdi></span></a>`;
const eyebrow = (text) => `<span class="eyebrow">${esc(text)}</span>`;
const sectionHead = (eb, title, intro = "", center = false) =>
  `<header class="section-head${center ? " section-head--center" : ""}" data-reveal>${eb ? eyebrow(eb) : ""}<h2>${esc(title)}</h2>${intro ? `<p>${esc(intro)}</p>` : ""}</header>`;

function glyph() {
  return `<svg class="glyph" viewBox="0 0 600 390" fill="none" aria-hidden="true" focusable="false">
    <path class="glyph__base" d="M25 302H146L265 104H386C462 104 496 183 445 232L382 292L430 341H566"/>
    <path class="glyph__cyan" d="M25 302H146L265 104H386C462 104 496 183 445 232L382 292"/>
    <path class="glyph__lime" d="M381 292L430 341H566"/>
    <circle class="glyph__node" cx="146" cy="302" r="8"/><circle class="glyph__end" cx="566" cy="341" r="9"/>
  </svg>`;
}


/* ───────── illustrations (original, abstract UI sketches; no claims) ───────── */
function svgArt(inner) { return `<svg class="art" viewBox="0 0 280 150" fill="none" aria-hidden="true" focusable="false">${inner}</svg>`; }
const ART = {
  "web-commerce": svgArt(`<rect x="22" y="14" width="236" height="122" rx="10" class="a-fill a-line"/><path d="M22 36h236" class="a-line"/><circle cx="36" cy="25" r="3" class="a-dot"/><circle cx="47" cy="25" r="3" class="a-dot2"/><circle cx="58" cy="25" r="3" class="a-dot2"/><rect x="36" y="48" width="104" height="10" rx="5" class="a-solid"/><rect x="36" y="66" width="78" height="6" rx="3" class="a-soft"/><rect x="36" y="78" width="92" height="6" rx="3" class="a-soft"/><rect x="36" y="94" width="44" height="16" rx="8" class="a-solid"/><rect x="156" y="48" width="86" height="40" rx="8" class="a-soft"/><rect x="156" y="96" width="40" height="30" rx="6" class="a-line a-fill"/><rect x="202" y="96" width="40" height="30" rx="6" class="a-line a-fill"/>`),
  "mobile-apps": svgArt(`<rect x="100" y="8" width="80" height="136" rx="14" class="a-fill a-line"/><rect x="128" y="14" width="24" height="4" rx="2" class="a-dot2"/><rect x="110" y="28" width="60" height="30" rx="7" class="a-soft"/><rect x="110" y="66" width="60" height="7" rx="3.5" class="a-solid"/><rect x="110" y="80" width="44" height="6" rx="3" class="a-soft"/><rect x="110" y="94" width="60" height="22" rx="7" class="a-line a-fill"/><circle cx="124" cy="128" r="4" class="a-solid"/><circle cx="140" cy="128" r="4" class="a-dot2"/><circle cx="156" cy="128" r="4" class="a-dot2"/><path d="M52 60c-14 10-14 30 0 40M40 52c-22 16-22 46 0 62" class="a-line" stroke-linecap="round"/><path d="M228 60c14 10 14 30 0 40M240 52c22 16 22 46 0 62" class="a-line" stroke-linecap="round"/>`),
  "business-systems": svgArt(`<rect x="20" y="14" width="240" height="122" rx="10" class="a-fill a-line"/><rect x="32" y="26" width="52" height="98" rx="6" class="a-soft"/><rect x="40" y="36" width="36" height="6" rx="3" class="a-solid"/><rect x="40" y="50" width="30" height="5" rx="2.5" class="a-dot2"/><rect x="40" y="62" width="34" height="5" rx="2.5" class="a-dot2"/><rect x="40" y="74" width="26" height="5" rx="2.5" class="a-dot2"/><rect x="98" y="88" width="16" height="36" rx="3" class="a-solid"/><rect x="122" y="70" width="16" height="54" rx="3" class="a-soft2"/><rect x="146" y="58" width="16" height="66" rx="3" class="a-solid"/><rect x="170" y="78" width="16" height="46" rx="3" class="a-soft2"/><path d="M98 52l32-14 26 8 40-18" class="a-line" stroke-linecap="round" stroke-linejoin="round"/><circle cx="196" cy="28" r="4" class="a-solid"/><rect x="204" y="62" width="44" height="62" rx="6" class="a-line a-fill"/>`),
  "saas-products": svgArt(`<path d="M140 22l78 30-78 30-78-30z" class="a-solid2"/><path d="M62 70l78 30 78-30" class="a-line" stroke-linecap="round" stroke-linejoin="round"/><path d="M62 90l78 30 78-30" class="a-line" stroke-linecap="round" stroke-linejoin="round"/><path d="M140 22l78 30-78 30-78-30z" class="a-line" stroke-linejoin="round"/><circle cx="140" cy="52" r="7" class="a-solid"/><path d="M58 28h26M214 118h30M40 112h20" class="a-soft-line" stroke-linecap="round"/>`),
  "ai-automation": svgArt(`<path d="M60 75h44M104 75l36-34M104 75l36 34M140 41h46M140 109h46M186 41l34 34M186 109l34-34" class="a-line" stroke-linecap="round" stroke-linejoin="round"/><circle cx="52" cy="75" r="12" class="a-solid"/><circle cx="140" cy="41" r="10" class="a-fill a-line"/><circle cx="140" cy="109" r="10" class="a-fill a-line"/><circle cx="186" cy="41" r="8" class="a-soft"/><circle cx="186" cy="109" r="8" class="a-soft"/><circle cx="228" cy="75" r="14" class="a-solid"/><path d="M222 75l4 4 8-9" stroke="#fff" stroke-width="2.4" stroke-linecap="round" stroke-linejoin="round"/><path d="M96 20l3 8 8 3-8 3-3 8-3-8-8-3 8-3zM240 118l2 5 5 2-5 2-2 5-2-5-5-2 5-2z" class="a-solid"/>`),
  "product-design": svgArt(`<rect x="24" y="16" width="112" height="118" rx="10" class="a-fill a-line"/><rect x="36" y="28" width="88" height="44" rx="6" class="a-soft"/><rect x="36" y="82" width="52" height="7" rx="3.5" class="a-solid"/><rect x="36" y="96" width="76" height="6" rx="3" class="a-soft"/><rect x="36" y="110" width="40" height="14" rx="7" class="a-line a-fill"/><path d="M156 130l14-62 44-14 28 28-30 38z" class="a-soft2" stroke-linejoin="round"/><path d="M170 68l30 30M214 54l28 28" class="a-line" stroke-linecap="round"/><circle cx="162" cy="30" r="9" class="a-solid"/><circle cx="188" cy="30" r="9" class="a-soft2"/><circle cx="214" cy="30" r="9" class="a-dot2"/>`)
};
const STEP_ICONS = [
  `<path d="M11 19a8 8 0 1 0 0-16 8 8 0 0 0 0 16zM21 21l-4.3-4.3"/>`,
  `<path d="M4 8V4h4M16 4h4v4M20 16v4h-4M8 20H4v-4"/><rect x="9" y="9" width="6" height="6" rx="1"/>`,
  `<rect x="3" y="4" width="18" height="16" rx="2"/><path d="M3 10h18M9 10v10"/>`,
  `<path d="m8 8-5 4 5 4M16 8l5 4-5 4M14 5l-4 14"/>`,
  `<circle cx="12" cy="12" r="9"/><path d="m8 12.5 3 3 5-6"/>`
];
const stepIcon = (i) => `<span class="step__icon"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">${STEP_ICONS[i] || STEP_ICONS[4]}</svg></span>`;
const WHY_ICONS = [
  `<circle cx="12" cy="12" r="9"/><circle cx="12" cy="12" r="4.5"/><path d="M12 3v3M12 18v3M3 12h3M18 12h3"/>`,
  `<circle cx="6" cy="18" r="2.5"/><circle cx="18" cy="6" r="2.5"/><path d="M8.5 18H15a3 3 0 0 0 0-6H9a3 3 0 0 1 0-6h6.5"/>`,
  `<path d="M3 17 17 3l4 4L7 21z"/><path d="m14 6 2 2M11 9l2 2M8 12l2 2"/>`
];
const whyIcon = (i) => `<span class="why-card__icon"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">${WHY_ICONS[i] || WHY_ICONS[0]}</svg></span>`;

function serviceCards(lang, c, { compact = false, exclude = "" } = {}) {
  const items = services.filter((s) => s.slug !== exclude).map((s) => {
    const t = s[lang];
    return `<a class="card service-card" data-svc="${s.slug}" href="${serviceUrl(lang, s.slug)}" data-reveal>
      ${compact ? `<span class="service-card__icon">${serviceIcon(s.slug)}</span>` : `<div class="service-card__art">${ART[s.slug] || ""}</div>`}
      <div class="service-card__body"><h3>${esc(t.title)}</h3><p>${esc(t.short)}</p>
      ${compact ? "" : `<span class="card__more">${esc(c.viewService)} ${ICON_ARROW}</span>`}</div>
    </a>`;
  }).join("");
  return `<div class="card-grid card-grid--services${compact ? "" : " bento"}">${items}</div>`;
}

function serviceIndex(lang, c, { exclude = "" } = {}) {
  const rows = services.map((s, i) => ({ s, i })).filter(({ s }) => s.slug !== exclude).map(({ s, i }) => {
    const t = s[lang];
    return `<a class="svc-row" href="${serviceUrl(lang, s.slug)}" data-reveal>
      <span class="svc-row__num">0${i + 1}</span>
      <span class="svc-row__title">${esc(t.title)}</span>
      <span class="svc-row__desc">${esc(t.short)}</span>
      <span class="svc-row__go" aria-label="${esc(c.viewService)}">${ICON_ARROW}</span>
    </a>`;
  }).join("");
  return `<div class="svc-index">${rows}</div>`;
}

function marquee(lang) {
  const names = services.map((s) => esc(s[lang].title));
  const run = names.map((n) => `<span>${n}</span>`).join("");
  return `<div class="marquee" aria-hidden="true"><div class="marquee__track">${run}${run}</div></div>`;
}

function processList(c, { detailed = true, rows = false } = {}) {
  return `<ol class="steps${detailed ? "" : " steps--compact"}${rows ? " steps--rows" : ""}">${c.stages.map(([n, title, body], i) =>
    `<li class="step" data-reveal><span class="step__num">${esc(n)}</span>${stepIcon(i)}<h3>${esc(title)}</h3>${detailed ? `<p>${esc(body)}</p>` : ""}</li>`).join("")}</ol>`;
}

function faqList(c) {
  return `<div class="faq">${c.faq.map(([q, a]) => `<details data-reveal><summary><span>${esc(q)}</span><span class="faq__plus" aria-hidden="true"></span></summary><p>${esc(a)}</p></details>`).join("")}</div>`;
}

function ctaBand(lang, c, { title = c.ctaTitle, body = c.ctaBody, text } = {}) {
  return `<section class="cta-band wrap" data-reveal><div class="cta-band__inner"><div><h2>${esc(title)}</h2><p>${esc(body)}</p></div><div class="cta-band__actions">${waBtn(c, c.whatsappCta, "wa", text)}${callBtn(c)}</div></div></section>`;
}

function pageHero(c, eb, title, lead, extra = "") {
  return `<section class="page-hero wrap"><div class="page-hero__copy">${eyebrow(eb)}<h1>${esc(title)}</h1><p class="lead">${esc(lead)}</p>${extra}</div></section>`;
}

/* ───────── layout ───────── */
function header(lang, active, c, routeSegment) {
  const items = [["home", "", c.home], ["services", "services", c.services], ["process", "process", c.process], ["about", "about", c.about], ["contact", "contact", c.contact]];
  const isService = active.startsWith("service:");
  const nav = items.map(([key, path, label]) => {
    const cur = active === key || (key === "services" && isService);
    return `<a class="nav-link${cur ? " is-active" : ""}" href="${urlFor(lang, path)}"${cur ? ' aria-current="page"' : ""}>${esc(label)}</a>`;
  }).join("");
  const other = lang === "ar" ? "en" : "ar";
  const switchHref = routeSegment === "404.html" ? urlFor(other) : urlFor(other, routeSegment);
  return `<a class="skip-link" href="#main">${esc(c.skip)}</a>
<header class="site-header"><div class="header-inner wrap">
  <a class="brand" href="${urlFor(lang)}" aria-label="Raqmio — ${esc(c.home)}"><img src="${assetUrl("/assets/raqmio-logo.png")}" width="40" height="40" alt=""><span class="brand__name">RAQMIO</span></a>
  <button id="menu-toggle" class="menu-toggle" type="button" aria-expanded="false" aria-controls="site-navigation"><span class="menu-toggle__bars" aria-hidden="true"></span><span class="sr-only">${esc(c.menu)}</span></button>
  <nav class="site-nav" id="site-navigation" aria-label="${esc(c.navLabel)}">
    <div class="site-nav__links">${nav}</div>
    <div class="site-nav__actions"><a class="lang-switch" href="${switchHref}" hreflang="${other}" lang="${other}">${esc(c.switchLanguage)}</a>${waBtn(c, c.navCta, "wa btn--sm")}</div>
  </nav>
</div></header>`;
}

function footer(lang, c) {
  const links = services.map((s) => `<li><a href="${serviceUrl(lang, s.slug)}">${esc(s[lang].title)}</a></li>`).join("");
  const social = Object.entries(site.social).filter(([, v]) => v)
    .map(([k, v]) => `<li><a href="${esc(v)}" target="_blank" rel="noopener noreferrer">${esc(k[0].toUpperCase() + k.slice(1))}</a></li>`).join("");
  const mail = site.email ? `<li><a href="mailto:${esc(site.email)}" dir="ltr">${esc(site.email)}</a></li>` : "";
  return `<footer class="site-footer"><div class="wrap footer-grid">
  <div class="footer-brand"><a class="brand" href="${urlFor(lang)}"><img src="${assetUrl("/assets/raqmio-logo.png")}" width="40" height="40" alt=""><span class="brand__name">RAQMIO</span></a><p>${esc(c.footerLine)}</p></div>
  <nav aria-label="${esc(c.footerServices)}"><h2 class="footer-title">${esc(c.footerServices)}</h2><ul>${links}</ul></nav>
  <nav aria-label="${esc(c.footerCompany)}"><h2 class="footer-title">${esc(c.footerCompany)}</h2><ul><li><a href="${urlFor(lang, "about")}">${esc(c.about)}</a></li><li><a href="${urlFor(lang, "process")}">${esc(c.process)}</a></li><li><a href="${urlFor(lang, "contact")}">${esc(c.contact)}</a></li><li><a href="${urlFor(lang, "privacy")}">${esc(c.privacyTitle)}</a></li><li><a href="${urlFor(lang, "terms")}">${esc(c.termsTitle)}</a></li></ul></nav>
  <div><h2 class="footer-title">${esc(c.footerContact)}</h2><ul><li><a href="${waUrl(c.whatsappGreeting)}" target="_blank" rel="noopener noreferrer">${esc(c.whatsappCard)}</a></li><li><a href="${esc(c.phoneHref)}" dir="ltr">${esc(c.phoneNumber)}</a></li>${mail}${social}</ul></div>
</div><div class="wrap footer-bottom"><span>© ${new Date().getFullYear()} Raqmio. ${esc(c.rights)}</span></div></footer>
<a class="wa-float" href="${waUrl(c.whatsappGreeting)}" target="_blank" rel="noopener noreferrer" aria-label="${esc(c.whatsappCta)}">${ICON_WA}<span>${esc(c.floatingWhatsapp)}</span></a>`;
}

function jsonLd(lang, c, active) {
  const org = {
    "@context": "https://schema.org", "@type": "ProfessionalService", name: "Raqmio",
    telephone: site.phoneIntl, availableLanguage: ["Arabic", "English"],
    description: copy.en.heroLead,
    ...(site.url ? { url: site.url, logo: `${site.url}/assets/raqmio-logo.png`, image: `${site.url}/assets/og-image.png` } : {}),
    ...(site.email ? { email: site.email } : {}),
    ...(Object.values(site.social).some(Boolean) ? { sameAs: Object.values(site.social).filter(Boolean) } : {})
  };
  const blocks = [org];
  if (active === "home") {
    blocks.push({ "@context": "https://schema.org", "@type": "FAQPage", mainEntity: c.faq.map(([q, a]) => ({ "@type": "Question", name: q, acceptedAnswer: { "@type": "Answer", text: a } })) });
  }
  return blocks.map((b) => `<script type="application/ld+json">${JSON.stringify(b).replace(/</g, "\\u003c")}</script>`).join("\n  ");
}

function documentShell(lang, active, title, description, body, routeSegment = "", { noindex = false } = {}) {
  const c = copy[lang];
  const other = lang === "en" ? "ar" : "en";
  const isHome = active === "home";
  const fullTitle = isHome ? title : `${title} | Raqmio`;
  const canonicalPath = routeSegment === "404.html" ? "" : urlFor(lang, routeSegment);
  const alt = (l) => (routeSegment === "404.html" ? urlFor(l) : urlFor(l, routeSegment));
  const desc = clip(description);
  const hreflang = routeSegment === "404.html" ? "" : `
  <link rel="alternate" hreflang="${lang}" href="${abs(urlFor(lang, routeSegment))}">
  <link rel="alternate" hreflang="${other}" href="${abs(alt(other))}">
  <link rel="alternate" hreflang="x-default" href="${abs(urlFor(site.defaultLocale, routeSegment))}">`;
  const canonical = site.url && !noindex ? `\n  <link rel="canonical" href="${abs(canonicalPath)}">` : "";
  const og = `
  <meta property="og:type" content="website">
  <meta property="og:site_name" content="Raqmio">
  <meta property="og:title" content="${esc(fullTitle)}">
  <meta property="og:description" content="${esc(desc)}">
  <meta property="og:locale" content="${lang === "ar" ? "ar_EG" : "en_US"}">
  <meta property="og:locale:alternate" content="${lang === "ar" ? "en_US" : "ar_EG"}">${site.url ? `
  <meta property="og:url" content="${abs(canonicalPath)}">
  <meta property="og:image" content="${site.url}/assets/og-image.png">
  <meta name="twitter:image" content="${site.url}/assets/og-image.png">` : ""}
  <meta name="twitter:card" content="summary_large_image">
  <meta name="twitter:title" content="${esc(fullTitle)}">
  <meta name="twitter:description" content="${esc(desc)}">`;
  return `<!doctype html>
<html lang="${lang}" dir="${c.direction}">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1, viewport-fit=cover">
  <title>${esc(fullTitle)}</title>
  <meta name="description" content="${esc(desc)}">
  <meta name="theme-color" content="#060a11">
  <meta name="color-scheme" content="dark">${noindex ? '\n  <meta name="robots" content="noindex">' : ""}${canonical}${hreflang}${og}
  <link rel="icon" type="image/png" sizes="32x32" href="${assetUrl("/assets/favicon-32.png")}">
  <link rel="apple-touch-icon" href="${assetUrl("/assets/apple-touch-icon.png")}">
  <link rel="manifest" href="${assetUrl("/site.webmanifest")}">
  <link rel="preload" href="${assetUrl(`/assets/fonts/${lang === "ar" ? "plex-arabic-600.woff2" : "inter-var.woff2"}`)}" as="font" type="font/woff2" crossorigin>
  <link rel="stylesheet" href="${assetUrl("/assets/site.css")}">
  ${jsonLd(lang, c, active)}
  <script src="${assetUrl("/assets/site.js")}" defer></script>
</head>
<body class="locale-${lang}">
${header(lang, active, c, routeSegment || (isHome ? "" : active))}
${body}
${footer(lang, c)}
</body>
</html>`;
}

/* ───────── pages ───────── */

function heroStage(lang) {
  const t = (slug) => esc(services.find((x) => x.slug === slug)[lang].title);
  return `<div class="stage" id="hero-stage">
    <div class="stage__grid"></div>
    ${glyph().replace('class="glyph"', 'class="glyph stage__path"')}
    <div class="win win--web" data-depth="14" style="--acc:#0a6fa8">${ART["web-commerce"]}</div>
    <div class="win win--dash" data-depth="22" style="--acc:#0f8a8a">${ART["business-systems"]}</div>
    <div class="win win--phone" data-depth="32" style="--acc:#6d4ae0">${ART["mobile-apps"]}</div>
    <span class="chip chip--a" data-depth="40">${t("ai-automation")}</span>
    <span class="chip chip--b" data-depth="26">${t("product-design")}</span>
  </div>`;
}

function homePage(lang, c) {
  const trust = c.trust.map(([t, b]) => `<li data-reveal><span class="trust__check">${ICON_CHECK}</span><div><h3>${esc(t)}</h3><p>${esc(b)}</p></div></li>`).join("");
  const why = c.why.map(([t, b], i) => `<article class="card why-card" data-reveal>${whyIcon(i)}<span class="why-card__num">0${i + 1}</span><h3>${esc(t)}</h3><p>${esc(b)}</p></article>`).join("");
  const starts = c.starts.map(([t, b, slug]) => `<a class="card start-card" data-svc="${slug}" href="${serviceUrl(lang, slug)}" data-reveal><span class="service-card__icon">${serviceIcon(slug)}</span><h3>${esc(t)}</h3><p>${esc(b)}</p><span class="card__more">${esc(c.viewService)} ${ICON_ARROW}</span></a>`).join("");
  const body = `<main id="main">
  <section class="hero-full">
  <div class="hero wrap">
    <div class="hero__copy">${eyebrow(c.heroEyebrow)}<h1>${esc(c.heroTitle)}</h1><p class="lead">${esc(c.heroLead)}</p>
      <div class="hero__actions">${waBtn(c, c.ctaPrimary)}${btn(urlFor(lang, "services"), c.ctaSecondary, "ghost")}</div>
      <p class="hero__note">${esc(c.heroNote)}</p></div>
    <div class="hero__visual" aria-hidden="true">${heroStage(lang)}</div>
  </div></section>
  <section class="trust wrap" aria-label="${esc(c.whyEyebrow)}"><ul class="trust__list">${trust}</ul></section>
  <section class="section wrap" id="services">${sectionHead(c.services, c.servicesTitle, c.servicesIntro)}${serviceCards(lang, c)}</section>
  <section class="section section--dark"><div class="wrap">${sectionHead(c.whyEyebrow, c.whyTitle, c.whyIntro)}<div class="card-grid card-grid--3">${why}</div></div></section>
  <section class="section wrap">${sectionHead(c.startEyebrow, c.startTitle)}<div class="card-grid card-grid--3">${starts}</div></section>
  <section class="section section--band"><div class="wrap">${sectionHead(c.processEyebrow, c.processTitle, c.processIntro)}${processList(c)}<div class="section__after">${btn(urlFor(lang, "process"), c.processCta, "ghost")}</div></div></section>
  <section class="section wrap faq-section"><div class="faq-section__head">${sectionHead(c.faqEyebrow, c.faqTitle)}</div>${faqList(c)}</section>
  ${ctaBand(lang, c)}
</main>`;
  const title = lang === "ar" ? "Raqmio | برمجيات وتصميم منتجات وذكاء اصطناعي" : "Raqmio | Software, product design & AI";
  return documentShell(lang, "home", title, c.heroLead, body, "");
}

function aboutPage(lang, c) {
  const principles = c.why.map(([t, b], i) => `<article class="card why-card" data-reveal><span class="why-card__num">0${i + 1}</span><h3>${esc(t)}</h3><p>${esc(b)}</p></article>`).join("");
  const expect = c.expect.map((t) => `<li><span class="trust__check">${ICON_CHECK}</span><span>${esc(t)}</span></li>`).join("");
  const body = `<main id="main">${pageHero(c, c.about, c.aboutTitle, c.aboutLead)}
  <section class="section wrap">${sectionHead("", c.principlesTitle)}<div class="card-grid card-grid--3">${principles}</div></section>
  <section class="section section--band"><div class="wrap split"><div data-reveal>${eyebrow(c.approachTitle)}<h2>${esc(c.approachTitle)}</h2></div><ul class="checklist" data-reveal>${expect}</ul></div></section>
  <section class="section wrap">${sectionHead(c.services, c.servicesTitle, c.servicesIntro)}${serviceCards(lang, c, { compact: true })}</section>
  ${ctaBand(lang, c)}</main>`;
  return documentShell(lang, "about", c.aboutTitle, c.aboutLead, body, "about");
}

function servicesPage(lang, c) {
  const body = `<main id="main">${pageHero(c, c.services, c.servicesPageTitle, c.servicesPageLead)}
  <section class="section wrap section--tight">${serviceCards(lang, c)}<p class="note" data-reveal>${esc(c.scopeNotice)}</p></section>
  <section class="section section--band"><div class="wrap">${sectionHead(c.processEyebrow, c.processTitle, c.processIntro)}${processList(c, { detailed: false })}<div class="section__after">${btn(urlFor(lang, "process"), c.processCta, "ghost")}</div></div></section>
  ${ctaBand(lang, c)}</main>`;
  return documentShell(lang, "services", c.servicesPageTitle, c.servicesPageLead, body, "services");
}

function servicePage(lang, c, service) {
  const t = service[lang];
  const focus = t.focus.map((f, i) => `<li><span class="focus__num">0${i + 1}</span><span>${esc(f)}</span></li>`).join("");
  const body = `<main id="main"><section class="page-hero page-hero--service wrap"><div class="page-hero__copy">
    <a class="back-link" href="${urlFor(lang, "services")}"><span class="back-link__arrow">${ICON_ARROW}</span>${esc(c.backServices)}</a>
    <span class="service-hero__icon">${serviceIcon(service.slug)}</span>${eyebrow(c.detailEyebrow)}<h1>${esc(t.title)}</h1><p class="lead">${esc(t.short)}</p>
    <div class="hero__actions">${waBtn(c, c.talkAbout, "wa", c.serviceGreeting + t.title)}${callBtn(c)}</div></div></section>
  <section class="section wrap"><div class="detail-grid">
    <div class="detail-main" data-reveal><p class="detail-intro">${esc(t.body)}</p>
      <div class="detail-fit card"><h2 class="h3">${esc(c.fit)}</h2><p>${esc(t.fit)}</p></div></div>
    <aside class="detail-side">
      <div class="card" data-reveal><h2 class="h3">${esc(c.focus)}</h2><ol class="focus">${focus}</ol></div>
      <div class="card card--note" data-reveal><h2 class="h3">${esc(c.boundary)}</h2><p>${esc(t.boundary)}</p></div></aside></div></section>
  <section class="section section--band"><div class="wrap">${sectionHead("", c.related)}${serviceCards(lang, c, { compact: true, exclude: service.slug })}</div></section>
  ${ctaBand(lang, c, { text: c.serviceGreeting + t.title })}</main>`;
  return documentShell(lang, `service:${service.slug}`, t.title, `${t.short} ${t.fit}`, body, `services/${service.slug}`);
}

function processPage(lang, c) {
  const body = `<main id="main">${pageHero(c, c.process, c.processPageTitle, c.processPageLead)}
  <section class="section wrap section--tight">${processList(c, { rows: true })}<div class="callout" data-reveal>${ICON_CHECK}<p>${esc(c.processPrinciple)}</p></div></section>
  ${ctaBand(lang, c)}</main>`;
  return documentShell(lang, "process", c.processPageTitle, c.processPageLead, body, "process");
}

function contactPage(lang, c) {
  const options = services.map((s) => `<option value="${s.slug}">${esc(s[lang].title)}</option>`).join("");
  const tl = Object.entries(c.timelines).map(([k, v]) => `<option value="${k}">${esc(v)}</option>`).join("");
  const mail = site.email ? `<a class="card contact-card" href="mailto:${esc(site.email)}" dir="ltr"><h3>Email</h3><p>${esc(site.email)}</p></a>` : "";
  const body = `<main id="main">${pageHero(c, c.contact, c.contactTitle, c.contactLead)}
  <section class="section wrap section--tight"><div class="contact-grid">
    <div class="contact-direct" data-reveal><h2 class="h3">${esc(c.directTitle)}</h2>
      <a class="card contact-card contact-card--wa" href="${waUrl(c.whatsappGreeting)}" target="_blank" rel="noopener noreferrer">${ICON_WA}<div><h3>${esc(c.whatsappCard)}</h3><p>${esc(c.cardWhatsappBody)}</p><strong dir="ltr">${esc(c.phoneNumber)}</strong></div></a>
      <a class="card contact-card" href="${esc(c.phoneHref)}">${ICON_PHONE}<div><h3>${esc(c.callCard)}</h3><p>${esc(c.cardCallBody)}</p><strong dir="ltr">${esc(c.phoneNumber)}</strong></div></a>${mail}</div>
    <div class="brief card" data-reveal>${eyebrow(c.briefEyebrow)}<h2 class="h3">${esc(c.briefTitle)}</h2>
      <div class="brief-form" role="group" aria-label="${esc(c.briefTitle)}">
        <div class="field-row"><label>${esc(c.name)}<input name="name" autocomplete="name" required maxlength="120"></label><label>${esc(c.company)}<input name="company" autocomplete="organization" maxlength="160"></label></div>
        <label>${esc(c.email)}<input name="email" type="email" dir="ltr" autocomplete="email" required maxlength="254"></label>
        <label>${esc(c.need)}<input name="need" required maxlength="240"></label>
        <div class="field-row"><label>${esc(c.serviceChoice)}<select name="service" required><option value="">${esc(c.chooseOne)}</option>${options}</select></label><label>${esc(c.timeline)}<select name="timeline" required><option value="">${esc(c.chooseOne)}</option>${tl}</select></label></div>
        <label>${esc(c.details)}<textarea name="details" rows="4" maxlength="1500"></textarea></label>
        <p class="brief__notice">${esc(c.briefNotice)}</p>
        <button id="review-brief" class="btn btn--wa" type="button" data-whatsapp-href="${esc(c.whatsappHref)}">${ICON_WA}<span>${esc(c.reviewBrief)}</span></button>
      </div>
      <section id="brief-result" class="brief-result" hidden aria-live="polite"><h3>${esc(c.briefSuccess)}</h3><pre id="brief-text"></pre><button class="btn btn--ghost btn--sm" id="copy-brief" type="button" data-copied="${esc(c.copied)}" data-copy-failed="${esc(c.copyFailed)}">${esc(c.copyBrief)}</button><p id="copy-status" class="copy-status" role="status"></p></section>
    </div></div></section></main>`;
  return documentShell(lang, "contact", c.contactTitle, c.contactLead, body, "contact");
}

function policyPage(lang, c, type) {
  const privacy = type === "privacy";
  const title = privacy ? c.privacyTitle : c.termsTitle;
  const intro = privacy ? c.privacyIntro : c.termsIntro;
  const paras = (privacy ? c.privacyBody : c.termsBody).map((p) => `<p>${esc(p)}</p>`).join("");
  const body = `<main id="main">${pageHero(c, title, title, intro)}<section class="section wrap section--tight"><article class="prose" data-reveal>${paras}<p class="prose__date">${esc(c.updated)}: <time datetime="${site.legalUpdated}">${site.legalUpdated}</time></p></article></section></main>`;
  const rawParas = privacy ? c.privacyBody : c.termsBody;
  return documentShell(lang, type, title, `${intro} ${rawParas[0]}`, body, type);
}

function notFoundPage(lang, c) {
  const body = `<main id="main"><section class="page-hero page-hero--404 wrap"><div class="page-hero__copy"><span class="code404" aria-hidden="true">404</span><h1>${esc(c.notFoundTitle)}</h1><p class="lead">${esc(c.notFoundBody)}</p><div class="hero__actions">${btn(urlFor(lang), c.goHome, "primary")}${waBtn(c)}</div></div></section></main>`;
  return documentShell(lang, "", c.notFoundTitle, c.notFoundBody, body, "404.html", { noindex: true });
}

export function renderSitePage(lang, page, service) {
  const c = copy[lang];
  if (!c) throw new Error(`Unsupported locale: ${lang}`);
  switch (page) {
    case "home": return homePage(lang, c);
    case "about": return aboutPage(lang, c);
    case "services": return servicesPage(lang, c);
    case "service": if (service) return servicePage(lang, c, service); break;
    case "process": return processPage(lang, c);
    case "contact": return contactPage(lang, c);
    case "privacy": case "terms": return policyPage(lang, c, page);
    case "404": return notFoundPage(lang, c);
  }
  throw new Error(`Unknown page type: ${page}`);
}
