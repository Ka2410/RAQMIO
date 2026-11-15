# Raqmio Identity and UX Engineering Study

**Status:** Design direction and implementation brief
**Basis:** Supplied Raqmio logo, current project files, confirmed service categories, and telephone number `01211659075`. Competitor observations are documented separately in `COMPETITOR_BENCHMARK.md` and are not design templates.

## 1. Design problem

Raqmio needs to explain a broad software and digital-product practice without looking like a stack of interchangeable startup sections. The site must help a business visitor answer four questions in order: what kind of work Raqmio handles, which service relates to their need, how the work is framed, and how to make contact.

The current asset already has a distinctive structural cue: a cyan R-like path that changes direction and finishes in a lime diagonal. The site should extend that cue through its layout and navigation so the brand is recognized by its spatial behavior, not only by placing the logo in the header.

## 2. Identity hypothesis: The Raqmio Signal Path

Treat the mark as a small diagram of how work progresses:

1. **Signal in:** a clear business need enters from a quiet, horizontal cyan line.
2. **Shape the R:** the path bends, gathers information, and becomes a system. This is the open, curved upper portion of the mark.
3. **Release forward:** the lime diagonal marks a decision, next step, or usable outcome.

This is a visual grammar derived from the supplied mark, not an assertion about company history. Use it to connect the home, service, process, and contact journeys. Do not turn it into a generic node network, circuit-board pattern, floating glass card system, or a decorative gradient wash.

### Signature behaviors

- A fine cyan line enters the composition from an edge and makes one deliberate bend before reaching the content.
- A lime segment appears at the point of action: the next step, selected service, process outcome, or telephone CTA.
- The R silhouette may be suggested by negative space and line geometry. Avoid repeating a large literal logo outline in every section.
- Section indexes read as positions on one route, not as disconnected card numbers.
- Use asymmetry, generous dark space, and large editorial type to create a calm technical character.
- Keep gradients confined to the supplied logo or a very small signal transition. Prefer flat color and measured transparency elsewhere.

## 3. Audience and intended behavior

The primary visitor is a business decision maker or product owner with a software need that may still be unclear. A secondary visitor is a technical or operations lead comparing possible approaches. The site should be understandable without requiring either visitor to know implementation terminology.

The primary journey is:

`Recognize a need → find a service area → understand how the work is framed → call or prepare a brief`

The phone number `01211659075` is the confirmed contact number. Show it in the header, footer, and contact page; provide a WhatsApp click-to-chat link and a direct call action on the contact page. Explain that project details are included in the WhatsApp link and reach Raqmio only if the visitor presses Send.

## 4. Information architecture

Keep the bilingual route families paired and predictable:

| Route family | Visitor question | Main action |
|---|---|---|
| Home | What can Raqmio help with? | Choose a service area or call |
| About | What is Raqmio's approach? | Understand the principles and continue to services |
| Services | Which area matches my need? | Open one service detail |
| Six service details | What does this service cover? | Review the boundary and contact Raqmio |
| Process | How is the work framed? | Follow the five stages and discuss a need |
| Contact | How do I start? | Call or prepare a WhatsApp brief |
| Privacy / Terms | What does this site do with my information? | Read the policy that matches actual behavior |
| 404 | Where can I go now? | Return home or browse services |

Language switching should preserve the current page and service slug. At unknown or language-specific not-found routes, return to the equivalent locale's home page. Do not create a portfolio, case-study, client-logo, or “work” route under another name.

## 5. Page-by-page experience

### Home

- Open with one concrete proposition and one short explanation. Keep the headline to a few lines and avoid generic claims such as “innovative solutions.”
- Use a custom Signal Path composition to relate a business need to a software outcome. It should be an original SVG or CSS drawing based on the R mark, with no stock imagery.
- Give visitors three need-led entry points before listing all six services. Examples: clarify an offer, improve a repeated workflow, or shape a first product release.
- Present services as a numbered route index with short, distinct descriptions. Each entry must lead to its detail page.
- Show the five-step process as one connected progression, not five unrelated feature tiles.
- End with a clear WhatsApp action and a direct call option where relevant.

### About

- Explain the approach and operating principles without inventing a founding story, office, team size, credentials, or client history.
- Keep principles tied to observable work: understand the need, make decisions visible, and agree scope before building.
- Link the principles back to the relevant service and process routes.

### Services index

- Use a compact, scannable index. Each service receives a title, a specific one-sentence description, and a visible route affordance.
- Make the six service categories feel like parts of one capability map using the same R-derived geometry, while allowing each to have a distinct technical accent or label.
- Avoid six repeated, identical “feature cards.” Prefer a continuous numbered list, split editorial columns, or an active index/detail composition that collapses cleanly on mobile.

### Service detail pages

- Reuse a stable structure: service purpose, likely need, included focus areas, boundaries that require agreement, related services, and a direct contact action.
- Describe the service in plain language. Technical vocabulary can appear as supporting detail, not as the first sentence.
- Do not imply a fixed platform, performance result, integration, delivery date, guarantee, or client outcome without evidence and agreement.

### Process

- Render five connected stages: understand, frame, shape, make, review.
- Give each stage an input, a decision, and a resulting artifact. Keep duration claims out unless the owner supplies them.
- Make the route line visible in both languages and ensure its order remains clear when direction is RTL.

### Contact

- Put the telephone action before the form and keep it available at narrow widths.
- Validate the project brief in the browser and prepare a WhatsApp message. On the visitor's click, open WhatsApp with the details in the link; let the visitor review and send the message. Do not add browser storage or hidden requests.
- State that WhatsApp receives the prefilled link and Raqmio receives the message only after the visitor presses Send. Use correct labels, required indicators, input types, error focus, and an announcement for the prepared message.

### Privacy, Terms, and 404

- The Privacy page must match the deployed implementation, including hosting logs, any future analytics, cookies, or form delivery. The current notice describes the WhatsApp handoff; revisit it if hosting or integrations change.
- Keep Terms factual. Do not invent a governing jurisdiction, legal entity address, service guarantee, or warranty.
- The 404 page should provide a return-to-home action and a services link. Avoid leaving a visitor at a dead end.

## 6. Design system proposal

These tokens are a starting point sampled from the supplied mark and current dark site. Adjust them through contrast and actual-device review rather than introducing an unrelated palette.

| Token | Starting value | Use |
|---|---|---|
| `signal-cyan` | `#08CEE0` | Incoming path, selected states, key links |
| `signal-lime` | `#8FEA30` | Path release, progress endpoint, primary action accent |
| `ink-950` | `#070B16` | Main canvas |
| `ink-900` | `#0D1422` | Secondary canvas and navigation |
| `ink-800` | `#152033` | Focused surface only; avoid repeated card grids |
| `text-primary` | `#F3F6FC` | Main content |
| `text-secondary` | `#A7B2C3` | Supporting content; recheck contrast at actual size |
| `line-subtle` | `rgba(189, 210, 236, .14)` | Separators and route traces |

Use the system font stack so the site has no external font dependency. English uses a compact sans-serif rhythm. Arabic uses a tested local Arabic-capable system font with slightly more line height and looser heading tracking. Keep line length near 60–72 Latin characters and avoid narrow columns for Arabic paragraphs.

Spacing should use a small consistent scale: 4, 8, 12, 16, 24, 32, 48, 64, 96. The content measure should remain roughly 1120–1200 px on wide screens. Use surface borders only when they communicate a boundary, state, or interactive target.

## 7. Component and state specifications

| Component | Required states and behavior |
|---|---|
| Header and language control | Default, active route, mobile menu open/closed, keyboard focus. Keep current route when switching locale. Close the menu after navigation or Escape. |
| Signal Path graphic | Static, meaningful SVG with accessible name or `aria-hidden` if decorative. Do not animate essential meaning. |
| Service index item | Default, hover, focus-visible, active/current. The whole row may link, with a clear focus ring and one announced name. |
| Process stage | Ordered, connected, readable without color. Stage number and heading remain understandable if the line is not perceived. |
| FAQ disclosure | Native disclosure state with keyboard support and visible open/closed indicator. |
| Brief builder | Empty, invalid, valid, reviewed, copied, copy-failed. Never show “sent” or “successfully submitted.” |
| Telephone link | Default, hover, focus-visible; use a clear accessible label and preserve the displayed number exactly. |
| Buttons and links | Default, hover, focus, active, disabled if applicable. Every visible control performs a real action. |

## 8. Responsive and localization rules

- Start with a single-column layout. Add asymmetric editorial columns only when the content can breathe; do not simply shrink the desktop composition.
- Protect 320 px screens from horizontal overflow. Test at 320, 360, 375, 390, 430, 768, 820, 1024, 1280, 1440, and 1920 px; include portrait and landscape for mobile.
- At narrow widths, transform route diagrams into vertical progress paths, stack service rows, keep the phone action in the first viewport, and give form fields full width.
- Apply `dir="rtl"` at the document level for Arabic. Use logical properties (`margin-inline`, `inset-inline`, `text-align: start`) instead of physical left/right values.
- Mirror directional arrows and path progression in RTL. Do not mirror the Raqmio logo itself or reorder numeric service IDs.
- Check mixed Arabic/English content, phone numbers, email syntax, URLs, and long service names for bidi isolation and wrapping.

## 9. Accessibility and motion

- Maintain semantic landmarks, one clear page `h1`, logical heading order, and a skip link.
- Provide visible focus on every interactive element. Preserve keyboard operation for navigation, language switching, disclosures, and contact controls.
- Maintain text contrast and never use cyan/lime alone to encode status. Use text or a shape/position cue alongside color.
- Keep touch targets comfortably tappable, associate every form control with a persistent label, and place validation feedback beside the relevant field.
- Respect `prefers-reduced-motion`. If a line draws or a marker moves, keep it brief, nonessential, and disabled/reduced when requested.
- Do not claim WCAG conformance until both manual and automated checks have actually been completed.

## 10. Content, privacy, and SEO invariants

- Confirmed service categories: Web & Commerce, Mobile Apps, Business Systems, SaaS Products, AI & Automation, and UI/UX & Product Design.
- Confirmed contact number: `01211659075`, with WhatsApp requested as the primary contact channel. Do not add email or other channels unless the owner confirms them.
- No fabricated client names, logos, case studies, testimonials, metrics, launch dates, team facts, office details, credentials, or outcomes.
- Keep the brief handoff explicit: the details are included in the WhatsApp link; the visitor chooses whether to send the message to Raqmio. Avoid `localStorage`, cookies, analytics, or hidden requests.
- Use page-specific titles, descriptions, meaningful internal links, paired locale routes, and accurate language/dir metadata.
- Canonical URLs, absolute `hreflang` links, and a domain-based sitemap require the production domain. Do not publish placeholders or invent a domain.

## 11. Acceptance criteria for the redesign

1. A visitor can explain the service scope and find a relevant service page without reading the whole home page.
2. The R-derived Signal Path appears as a consistent structural cue across Home, Services, Process, and Contact, but does not become repetitive decoration.
3. No section looks like a generic repeated card template; service information is scannable and navigable.
4. Arabic and English pages have content parity, correct direction, preserved route when switching languages, and no clipping or unintended overflow at the listed widths.
5. The supplied phone number is visible and tappable in header, footer, and Contact.
6. All controls work by keyboard and touch; the visitor reviews and sends the prepared WhatsApp message, while copy remains available.
7. Required routes, page titles, metadata, and 404 behavior are coherent. Domain-dependent SEO fields remain deferred until the domain is known.
8. The build completes, generated route count matches the route matrix, and the final site is reviewed in a browser for both locales and representative viewport widths.

## 12. Risks and unresolved inputs

| Risk | Why it matters | Resolution |
|---|---|---|
| Raqmio has no supplied production domain | Absolute canonical/hreflang and sitemap cannot be correct without it | Add once the domain is chosen |
| Brief is not delivered to a destination | A “submit” control would create false confidence | Keep review/copy and visible phone contact until an endpoint is separately approved |
| Policy wording can drift from implementation | Hosting or integrations may change privacy behavior | Reconcile pages with the final deployment configuration before launch |
| Logo source includes a dark square background | It can look like a tile on non-dark surfaces or at small sizes | Keep it on matching ink surfaces; create a crop/transparent variant only from the supplied asset if needed |
| Visual QA has not been demonstrated in a browser | CSS correctness alone cannot prove layout quality | Capture and inspect both locales at mobile and desktop widths before calling the redesign complete |

## 13. Implementation sequence and traceability

1. Lock the identity grammar from the supplied mark and update shared shell, homepage composition, service index, and process flow.
2. Apply the shared tokens and responsive/RTL rules without adding external assets or dependencies.
3. Integrate the confirmed telephone link and ensure the brief remains local and truthful.
4. Verify route generation, titles, language switching, and contact links in both locales.
5. Perform visual and interaction review at representative screen widths, then address defects before calling the redesign complete.

The study maps directly to the current route renderer (`src/render.mjs`), bilingual content (`src/content.mjs`), styles (`src/styles.css`), browser interactions (`src/site.js`), static route generator (`scripts/build.mjs`), and local preview server (`scripts/serve.mjs`).
