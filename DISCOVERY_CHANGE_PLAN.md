# Raqmio Implementation Plan and Architecture

Status: Updated after the user's direct instruction on 2026-11-15 to build the website. The earlier Astro proposal was superseded. The current implementation is a zero-dependency static site generated with Node.js built-ins because the npm registry did not respond.

## Implemented structure

| Path | Purpose |
|---|---|
| `package.json` | Build and local preview commands; no third-party dependencies |
| `src/content.mjs` | English and Arabic copy, service categories, page labels, and process steps |
| `src/render.mjs` | Shared semantic HTML shell and localized page templates |
| `src/styles.css` | Responsive design tokens, layouts, components, RTL/LTR behavior, focus states, and reduced-motion support |
| `src/site.js` | Mobile navigation and validated WhatsApp click-to-chat project brief |
| `scripts/build.mjs` | Generates 30 static HTML documents under `dist/` and copies site assets |
| `scripts/serve.mjs` | Serves the generated site locally at `http://localhost:4173/` |
| `public/raqmio-logo.png` | Supplied logo asset copied from the user's Downloads folder |
| `README.md` | Run/build instructions and remaining owner decisions |

## Included routes

English and Arabic routes cover Home, About, Services, six service details, Process, Contact, Privacy, Terms, and localized 404 pages. A root route redirects to English. The generated site contains no Projects, Portfolio, Work, Case Studies, Concept Lab, blog, CMS, membership, or admin area.

## Scope and data safeguards

- The six user-confirmed service categories are presented as Raqmio services.
- The provided phone number, 01211659075, is linked to WhatsApp and direct calling.
- No clients, testimonials, metrics, company history, office, team size, or credentials have been invented.
- The brief builder validates fields and prepares a WhatsApp message. The visitor reviews it and chooses whether to send; the site does not save it.
- Privacy and Terms pages describe the actual WhatsApp and calling behavior.
- No backend, database, authentication, storage, analytics, cookies, external form service, hosting, migration, push, or deployment was added.

## Verification and limits

- `npm run build` succeeded and generated 30 HTML pages.
- `node --check` succeeded for the renderer, browser script, build script, and local server.
- The npm registry did not respond, so package lookup/installation was not available. The project uses no installed dependencies.
- A local browser preview could not attach in the available browser surface, and direct local socket access was denied. Visual browser QA, responsive width coverage, and browser interaction QA remain unverified.
- The project directory is not a Git repository; no Git initialization, commit, or push was performed.

## Owner inputs before publication

The user confirmed the listed services, telephone number, and WhatsApp as the contact channel. A production domain is needed before absolute canonical URLs and a domain-based sitemap can be finalized. Review the Privacy and Terms copy against the eventual hosting setup.
