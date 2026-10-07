# Arcline site — project memory

Portfolio site for **Arcline**, the solo web and AI studio of Rohan Tidke (Nashik, India).
Plain HTML, CSS and vanilla JavaScript. No framework, no build step, no package.json.

- Live: https://rohantdk.github.io/arcline.github.io/ (GitHub Pages from `main`, root folder, no custom domain)
- `arcline.github.io` is NOT the live address: the repo belongs to the `rohantdk` account.
  Pages links are relative, so the site also works if the repo is renamed or a domain is added.
- Files: `index.html` (all content), `style.css`, `script.js`, `assets/favicon.svg`, `README.md`.
- `index.html` is the source of truth. It was first generated from a script that is not in the repo;
  edit the HTML directly now.

## Content source

All copy comes from the owner's PDF brochure **"Arcline Works 2026"** (11 pages, 32 projects in 7 categories).
Keep wording close to the brochure. Known, deliberate differences:

- #29 Arcline: description rewritten to describe this site, status `live` (brochure says "in build" and
  describes an older design).
- #02 Rushikesh Enterprises links to `rushikeshentp.com` (from the old site; the brochure gives no link).
  Not yet confirmed by the owner that the link still works.
- Krishna Fresh World (on the pre-2026 site) was dropped because it is not in the brochure.
- The phone number is **not** printed on the page. Contact is email + WhatsApp link (`wa.me/918857852631`) + GitHub.
- No footer. The degree line lives in About, GitHub in Contact. The owner asked for the footer line to be removed.
- No `og:image` (none exists yet). README explains how to add one.

## Page structure (one page, separate sections)

Sticky nav → hero → contents (dark band) → About (`#about`, text + 4 stats) → Services (`#services`, 6 items)
→ Work (`#work`) with 7 category sections → Process (`#process`, "every project includes") → Contact (`#contact`, dark band).

Category section ids and `data-cat` keys, in order:
`web` (8 projects), `shop` (4), `ai` (4), `apps` (4), `platforms` (4), `brand` (4), `studio` (4).

Adding a project: copy an `<article class="card">` in the right section, renumber, and update the count in
that section's header and in the contents list. Status chip: `chip--done` for live / live demo / built / delivered,
`chip--open` for everything else (in build, scoping, mvp, hackathon, ongoing, internal, prototype).
Project #13 (German client) uses `card--feature` to match the brochure's highlight.

## Design system

**Palette "Nashik Valley"** (chosen by the owner from four options; Nashik is India's wine capital).
Tokens are at the top of `style.css`, named by role:

| Token | Hex | Use |
|---|---|---|
| `--ink` | `#22162A` | text, headings, solid button, outlines |
| `--band` | `#2B1631` | contents and contact bands |
| `--accent` | `#7B2346` | wine: nav CTA, eyebrows, stats, emphasis |
| `--accent-light` | `#E8A0BC` | accent on the dark bands |
| `--paper` | `#F6F5F2` | page background |
| `--paper-2` | `#FFFFFF` | raised sections (services, process) |
| `--muted` | `#645A6B` | secondary text |
| `--rule` | `#E4DFE3` | dividers |
| `--on-band` | `#D9CCDC` | secondary text on bands |

Each category has three colours: strong `--web` (text and marks on light), soft `--web-soft` (chip and highlight
backgrounds), light `--web-light` (marks on the dark bands). Any element with `data-cat="…"` gets them as
`--c`, `--c-soft`, `--c-light`. Category colours appear only on small marks (dots, numbers, rules, chips, links),
never as large backgrounds or body text.

Every text colour was checked to pass WCAG AA (≥ 4.5:1) on its background. Re-check any new colour.

**Type:** Schibsted Grotesk 700/800 for headings, DM Sans 400/500 for body, DM Mono 400 for labels
(uppercase, letter-spaced). Bold headings are fine in this design.

**Light theme only**, by choice (matches the brochure). Respect `prefers-reduced-motion`.

## Behaviour (`script.js`)

- Mobile menu toggle (≤ 760px), closes on link tap and Escape.
- Active nav link via IntersectionObserver.
- Smooth scrolling is turned on (`html.is-ready`) only after load + fonts. Opening a `#section` link directly
  re-aligns once fonts have loaded, so the section lands below the 64px sticky nav. Don't move
  `scroll-behavior: smooth` back onto plain `html`: the browser's own smooth fragment scroll then fights the
  font swap and lands sections under the nav.

## Checking changes

No tests or linters. Check visually with Playwright + the preinstalled Chromium:
serve the repo (`python3 -m http.server`), render at 1440×900, 820×1180 and 390×844, and confirm
no horizontal overflow (`scrollWidth - innerWidth === 0`), no console errors, and that `#ai` loads with the
section top at 76px.

## Workflow and owner preferences

- Work on a feature branch, open a PR into `main`, and merge (squash) only when the owner says so.
- The owner wants to be asked about goal, context, action and output before larger tasks, and wants honest
  pushback rather than agreement.
- History: original light agency-style site (blue accent, 5 projects) → #1 monochrome single-paragraph ledger (owner's first brief:
  no bold, no colour, no sections) → #2 the current coloured, sectioned design after the owner asked for a full
  redesign with colour and separated content. Don't drift back toward the monochrome brief.
- The PDF brochure still uses the old navy/indigo palette; the site and brochure currently differ in colour.
