# Arcline — project memory

Portfolio site of Arcline, the web and AI studio founded by Rohan Tidke. One static page: `index.html`,
`style.css`, `script.js`, plus `assets/`. No framework, no build step, no dependencies. Live at
https://rohantdk.github.io/arcline.github.io/ (GitHub Pages, published from `main`).

`README.md` is the reference for page structure, the colour tokens, every motion feature and how to add a
project or a preview. Read it before changing anything. This file holds what README doesn't: the rules, how
changes go live, and decisions already made.

## Ground rules

- **Vanilla only.** No libraries, frameworks or CDN scripts. Card 29 ("Arcline") says the site is hand-coded
  with no framework; keep that true.
- **Content is the owner's.** Never change project copy, numbers or claims unless asked. Motion and interaction
  work must leave the text as it is.
- **Motion is editorial, not showy.** Clients are mostly manufacturers and exporters. Every effect should help
  people see the work, keep their place or get in touch. Push back on effects that only decorate.
- **Three must-haves for any new effect:**
  1. Without JavaScript the page reads in full. Hidden starting states only apply under `html.js`.
  2. `prefers-reduced-motion: reduce` gets the finished state, no movement. Put hidden starting states inside
     `@media (prefers-reduced-motion: no-preference)`.
  3. Pointer-only effects (hover, cursor-follow) check `(hover: hover) and (pointer: fine)` or
     `pointerType === 'mouse'`, so phones get nothing broken.
- Category colours come from `data-cat="…"` (`--c`, `--c-soft`, `--c-light`); reuse them, don't hard-code.
- Things like the hero dots' labels and the palette's project list are read from the page (Contents list, cards),
  so new cards appear in them automatically. Keep it that way; don't duplicate data in `script.js`.

## Making a change live

1. Work on the session's feature branch. After a merge, restart it from the latest `main`.
2. Check it in Chromium with Playwright (pre-installed). Test desktop (1360px), phone (390px) and
   `reducedMotion: 'reduce'`. Look for console errors and horizontal overflow (`scrollWidth` must equal the
   viewport width). Playwright is the Node package, not Python: serve the folder with `python3 -m http.server`,
   write the test script in the scratchpad and run it with `NODE_PATH=/opt/node22/lib/node_modules node`.
3. Open a pull request against `main` and squash-merge it, but only when the owner asks for it to go live.
4. Confirm the "pages build and deployment" workflow run for the merge commit finished with `success`.
   The cloud environment's network blocks `*.github.io`, so check the workflow run, not the live page.
   It sits in `queued` for a while and usually finishes within a minute or two.
5. Tell the owner to hard-reload (Ctrl+Shift+R / Cmd+Shift+R): Pages caches files for about 10 minutes.

## Live-site preview screenshots

Client sites are blocked by the environment's network policy, so `curl` and Playwright can't reach them. The
Context web-scrape tool can: `formats.screenshot`, `area: "viewport"`, viewport 1280 × 800, `dismissCookies`
and `dismissPopups` on, `waitFor` 2500. Resize to 640 × 400 WebP (quality 80) into
`assets/previews/<name>.webp`, then add `data-peek` to the card's link. Check each screenshot before using it.

## How the cards work (gotchas)

- A card's `card__link` is stretched over the whole card with `::after` (`style.css`). It must stay the only
  link or button in a card; anything else clickable added to a card would sit under it and needs
  `position: relative; z-index: 1`.
- Because the link covers the card, its `pointerenter` fires anywhere on the card. The preview's "instant on
  the link" check therefore tests the pointer against the link text's `getBoundingClientRect()`.
- In Playwright, `locator.click()` on text inside a linked card times out ("card__link intercepts pointer
  events"). That's expected; click with `page.mouse.click` / `page.touchscreen.tap` at coordinates instead.
  The new tab it opens shows `chrome-error://` because client sites are blocked here; that still counts.
- `flash()` in `script.js` is shared by the unlinked-card click and the command palette. Under reduced motion
  CSS turns animations off, so don't add the `is-flash` class then (`animationend` would never fire).

## Decisions so far

### Positioning and copy (October 2026)

- **High-ticket clients only.** The owner wants the site aimed at high-ticket clients; that drives the rules
  below. Judge every change by "does this read as a premium studio?".
- **Studio voice.** The site speaks as "we" / "Arcline", never "I". Rohan is named once, as founder, in About
  (and in the meta description). Arcline "brings in specialist partners when a project needs them"; never claim a
  team, team size or roles beyond that (the owner works with partners per project, no staff).
- **Never say where the studio is.** No city, state or address anywhere: page, meta tags, share image, README,
  this file, commit messages. Client cities and regions are removed from cards and About too (a wide scan of
  Indian place names over the visible text should find none). "Clients in India and Germany", the Germany client
  and country-level mentions in project copy ("Indian payments", "Indian exporters") stay. Project names with
  "Marathi" stay; the search box no longer suggests "Marathi". The +91 WhatsApp number is the one unavoidable hint.
- **Hero line:** "A web and AI studio for manufacturers, exporters and growing brands" (also on the share image).
- **Hidden projects:** 31 Vanguard Zero (game prototype) and 32 AI Foundations (learning builds) were removed as
  non-client experiments; they are in git history. Every count says 30 (hero, meta, About stat, Work title,
  filter, Contents, Studio section "Studio and systems", 2 projects). If projects are added or hidden, update all
  of these plus the category's count in its header and in Contents.
- Kept: the four stats in About (30, 14, 5, 2).
- Vrinda Mart: vrindamart.site showed Shopify's "store unavailable" page (October 2026), so its link was
  removed and it has no preview. The card stays. Restore the link only when the owner says the store is back.

### Logo and hero (October 2026)

- **Logo "One Line"** in a tough weight, chosen after ten concepts and two rounds: the name drawn as one thick
  geometric line on its baseline, square ends, square wine dots (the i's dot and the full stop). Files:
  `assets/logo/` (logo and "a." symbol in light, dark-bg, mono-dark, mono-light; symbol tile; PNGs in `png/`).
  `assets/favicon.svg` is the symbol tile. `assets/og-banner.jpg` (1200 × 630) is the share image.
- **Geometry** (to rebuild or extend it; the generator script was not kept): units with x-height 30–70, baseline
  y = 70, ascender y = 4, bowls are circles r = 20 (centre line), stroke 13 with square caps, miter joins. Letters
  a (bowl + stem at its right edge), r (stem + shoulder curve), c (bowl open ±45° on the right), l, i (square dot,
  16.25 wide, wine), n (stem + arch 32 wide), e (bar across the bowl's middle, bowl open at the lower right).
  Gaps between letters grow with stroke weight; the baseline runs under every letter and ends in the square
  full stop. Text is always outlined paths, no font needed.
- **Nav:** the logo inline in `index.html`; its baseline fills left to right with scroll progress and takes the
  category colour in Work.
- **Hero title:** the owner removed the word "Arcline". The title is the "a." symbol alone (viewBox 0 124 520 174,
  scale 3), with seven square category dots as its full stop: links with hover/focus labels read from the
  Contents list. The `h1` keeps "Arcline", visually hidden. The line and the "a" draw in (`stroke-dashoffset`
  with butt ends, so square corners are built into the geometry), then the dots pop in. Tried and dropped there:
  the arc, the full wordmark, the "a." beside the word.
- **Contact:** the same "a." on the dark band; a dot slides along the line and lands as the full stop.
- Gone with the arc: the arc's lean toward the cursor, and the title's letter rise and hover lift.

### Motion and interaction

- Kept: the magnetic buttons (hero buttons and nav "Start a project" lean toward the cursor). The owner wanted
  to try them; don't remove without asking.
- Removed at the owner's request: the live IST clock in the hero, the city coordinates under the old hero arc, and
  the degree line in About. Don't bring them back.
- Live-site previews show on hover anywhere on a card with a live site, after a 250 ms pause (instantly on the
  link itself). Nine cards have one.
- Cards with a live site open it from a click anywhere on the card (stretched link, CSS only; the trade-off is
  that text in those cards can't be selected). Cards without a link scroll fully into view and flash when
  clicked; the owner chose this over leaving them inert.
- Advised against, owner agreed: a loading screen, a custom cursor, scroll-jacking or heavy parallax.

## Open items (next time)

Suggested for the high-ticket positioning, not done yet; the owner decides:

1. **Check the "5 AI products and pipelines" stat.** If AI Foundations was one of the five, it should be 4.
2. **Case studies.** Turn the best 5–6 projects into short case studies (client's problem, what was built, what
   changed). Needs real results from the owner; never invent numbers.
3. **Own domain** (e.g. arcline.studio) pointed at GitHub Pages; then update `og:url`, the `og:image` URL, the
   share image's printed address and README.
4. **Studio email** on that domain, replacing the personal Gmail in Contact and the command palette.
5. **Qualify enquiries:** a "projects start from ₹X" line or a short enquiry form (budget, timeline) in place of
   "Message us" on WhatsApp. Needs the owner's figure.
6. Hero dots are small on phones (about 15 px); enlarge if the owner wants them tappable there.

## Working with the owner

- Ask about goal, context, action and expected output before a sizeable task. Give an honest recommendation
  rather than agreeing by default.
- Use plain language and give the owner the live link once something is published.
