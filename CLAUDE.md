# Arcline — project memory

Portfolio site of Arcline, the web and AI studio founded by Rohan Tidke. One static page: `index.html`,
`style.css`, `script.js`, plus `assets/`. No framework, no build step, no dependencies. Live at
https://rohantdk.github.io/arcline.github.io/ (GitHub Pages, published from `main`) and on Vercel at
https://arcline-eta.vercel.app (project `arcline`, team "tidkerohan8228-3858's projects", linked to `main`, so
every push to `main` redeploys both).

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
   Vercel deploys the same commit; check it with the Vercel tools (`get_project` "arcline"). The network blocks
   `*.vercel.app` too; `web_fetch_vercel_url` can fetch it. The owner created the project in the dashboard
   because the Vercel connection here isn't allowed to create projects. Share the short production link, not
   the per-deployment one (that sits behind Vercel login). `og:url` and the share image still point at GitHub
   Pages, by the owner's choice (October 2026).
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

### Arcline Ace (October 2026, idea stage, not on the site)

- **The idea:** "Arcline Ace" is a private AI assistant for a company's own documents (like a custom ChatGPT
  whose data stays with the company): staff ask, it finds documents and builds reports live. The owner also named
  the agent inside it "Arcline Actor"; advised using one name (Ace) with clients, so the pitch leaves Actor out.
- **Honest validation given:** the need is real (staff already paste company data into public AI tools), but
  "private ChatGPT" alone competes with Copilot, ChatGPT/Claude Enterprise, Glean and free tools (AnythingLLM,
  Open WebUI, PrivateGPT, Onyx). The value is in permissions, connecting real data (Tally, ERP, Excel, email),
  cited answers, and a vertical focus. Sell as setup plus yearly support, not a cheap subscription. Validate by
  interviewing 5–8 existing clients and landing one paid pilot before building.
- **One-page A4 pitch (PDF) made and sent.** Owner's choices: audience is owners of client firms (exporters and
  manufacturers); three workflows (export documents, buyer queries, live reports); privacy promise is "your
  choice of setup": on your premises or a private cloud account in the client's name, never used to train AI
  (not "on-premise only"); call to action "Start with one workflow. Book a discovery call."; contact is email,
  WhatsApp and arcline-eta.vercel.app. No prices or results printed (none exist yet); no location.
  The pitch promises role-based access, cited sources and an on-premise option, which aren't built yet.
- The pitch's HTML source was in the session scratchpad and was not kept (not in the repo, so it isn't published
  on Pages). Rebuild from this description in the site's tokens and fonts if it needs changing.

### Portable copy for other hosts (October 2026)

- The owner asked for the site as a zip to deploy on Netlify or Vercel later with a new custom domain. Given as
  `arcline-site.zip` with one top folder `arcline-site/` holding `index.html`, `style.css`, `script.js` and
  `assets/`. Every internal path is relative, so the folder works on any host or domain unchanged.
- Leave `CLAUDE.md` out of any deploy copy: whatever is in the folder gets published, and this file holds private
  notes. `README.md` and `.git` are left out too.
- Don't commit the zip: on `main` it would be published on Pages, and it goes stale with the next change. Build it
  in the scratchpad, send it, and make a fresh one whenever the owner asks.
- Told the owner: Netlify Drop (app.netlify.com/drop) takes the dropped folder; Vercel has no true folder drop, so
  keep the Git link (recommended) or run `npx vercel --prod` in the folder. On a new domain, update `og:url` and
  `og:image` (`index.html` lines 11 and 13) and the share image's printed address (see open item 3).

### Separate AI-only site (October 2026)

- The owner wants Arcline niche, so a second site sells only AI engineering to owners of manufacturing and export
  firms: repo `rohantdk/arcline-ai`, live at https://arcline-ai-ace.vercel.app (Vercel project `arcline-ai`,
  deploys every push to its `main`). Its own `CLAUDE.md` holds its rules and decisions; read it before changing
  that site. Note: arcline-eta.vercel.app is this site, not the AI one.
- **Keep the two sites separate:** neither links to the other. This site stays the full portfolio; don't change
  it to match the AI site unless the owner asks.
- It reuses this site's logo, palette, fonts and motion (the hero "a." mark with three dots, the strip, decoding
  labels, counting stats), with the AI violet as its accent, under the name "Arcline" only.
- **Positioning (30 October 2026):** outcomes first, ownership second. Hero: "Your company's own AI. Not rented.
  Not shared." with "It saves time, cuts costs and wins orders." under it; the rest of the page leads with time,
  cost and orders (tiles: Win more orders, Save hours, Cut costs), and the privacy promises sit under "And it stays
  yours". The owner picked this mix section by section from two versions. Arcline builds custom AI for the whole
  company, owned by it, on its own servers or a private cloud account in its name, never used to train anyone
  else's AI. Confirmed deliverable: cited answers, actions a person approves, email/Excel/ERP, a separate AI per
  team, learning the company's terms. Entry is a one-workflow pilot; no numbers until a pilot measures them; no
  Tally promise yet. Still to confirm: "no per-user fees" and "we measure hours before and after the pilot".
- **Minimal, rounded redesign (live 30 October 2026):** about 370 words; rounded interface with a square logo; a
  nav that rounds into a pill on scroll; a hero example that plays the task on hover. That Vercel project builds
  only `main`, so redesigns are reviewed on a private claude.ai preview page first.
- This positioning is broader than the Arcline Ace pitch PDF above (a document assistant); rebuild the pitch to
  match if the owner wants it.

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
7. **Arcline Ace next steps** (owner's call): client interview questions, a technical architecture, a prototype
   of one workflow, a Hindi version of the pitch, or adding Ace to the site once a pilot exists.

## Working with the owner

- Ask about goal, context, action and expected output before a sizeable task. Give an honest recommendation
  rather than agreeing by default.
- Use plain language and give the owner the live link once something is published.
