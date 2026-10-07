# Arcline — project memory

Portfolio site of Rohan Tidke's web and AI studio, Arcline (Nashik, India). One static page: `index.html`,
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
- Things like the arc dot labels and the palette's project list are read from the page (Contents list, cards),
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

- Kept: the magnetic buttons (hero buttons and nav "Start a project" lean toward the cursor). The owner wanted
  to try them; don't remove without asking.
- Removed at the owner's request: the live IST clock in the hero, the Nashik coordinates under the arc, and
  the degree line in About. Don't bring them back.
- Kept: the four stats in About (32, 14, 5, 2).
- Live-site previews show on hover anywhere on a card with a live site, after a 250 ms pause (instantly on the
  link itself). Nine cards have one.
- Cards with a live site open it from a click anywhere on the card (stretched link, CSS only; the trade-off is
  that text in those cards can't be selected). Cards without a link scroll fully into view and flash when
  clicked; the owner chose this over leaving them inert.
- Vrinda Mart: vrindamart.site showed Shopify's "store unavailable" page (October 2026), so its link was
  removed and it has no preview. The card stays. Restore the link only when the owner says the store is back.
- Advised against, owner agreed: a loading screen, a custom cursor, scroll-jacking or heavy parallax.

- Logo (October 2026): "One Line" in a tough weight (thick stroke, square ends, square wine dots), chosen after
  ten concepts. It replaced the arc in the nav and favicon; the hero and contact arcs stay as a motif. Files and
  variants are in `assets/logo/`.

## Working with the owner

- Ask about goal, context, action and expected output before a sizeable task. Give an honest recommendation
  rather than agreeing by default.
- Use plain language and give the owner the live link once something is published.
