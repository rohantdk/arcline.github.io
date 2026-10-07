# Arcline

The web and AI studio of Rohan Tidke, Nashik. Plain HTML, CSS and JavaScript, hosted on GitHub Pages at
https://rohantdk.github.io/arcline.github.io/

## Page structure

One page, in separate sections, following the 2026 works brochure:

1. Hero, with the interactive arc
2. Tools marquee
3. Contents (dark band, links to each work category)
4. About, with the four numbers
5. Services
6. Work, with the project filter, in seven categories: `#web`, `#shop`, `#ai`, `#apps`, `#platforms`, `#brand`, `#studio`
7. Process ("every project includes")
8. Contact

## Motion and interaction

All in `script.js`, vanilla JavaScript with no libraries. Without JavaScript the page reads in full, and anyone
with *reduce motion* switched on gets the finished state with no movement.

- **The arc** (hero): the logo's arc, with three echo lines, standing on the baseline of the word. It leans toward
  the pointer and sways on its own otherwise. Its seven dots are the work categories; hover for the name and count,
  click to jump there. Names and counts are read from the Contents list, so there is nothing extra to update.
- **Nav logo**: the small arc fills as you scroll down the page. In the Work section it takes the colour of the
  category in view, and (on wide screens) a label beside the logo names it, e.g. "03 / 07 AI engineering".
- **Live-site previews**: hovering a project card that has a live site shows its homepage in a small browser frame
  beside the cursor, after a quarter-second pause (at once on the link itself; mouse and trackpad only). To add one, save a 640 × 400 px screenshot to `assets/previews/<name>.webp` and add
  `data-peek="assets/previews/<name>.webp"` to the card's `card__link`.
- **Whole-card links**: a card's `card__link` is stretched over the card (in `style.css`), so a click or tap
  anywhere on it opens the site. Cards without a link light up briefly when clicked instead.
- **The arc again** (contact): it draws itself on the contact rule, and a dot travels from its foot to its top.
- **Tools marquee**: below the hero. It speeds up as you scroll, turns with the scroll direction and pauses on hover.
  Edit the list in `index.html`; `data-cat` sets each dot's colour.
- **Project filter**: above the work. Filter by status (driven by `chip--done` / `chip--open`) or search by name,
  client, city or stack. Category counts update and empty categories hide.
- **Command palette**: `⌘K`, `Ctrl+K` or `/` (or the Search button) jumps to any section, project or contact action.
  It is built from the page, so new cards appear in it on their own.
- **Small things**: letters of the title rise in and lift on hover, section rules draw in, mono labels decode
  from random glyphs, the stats count up, a line draws across each Process step in turn, the dot on "live" chips
  pulses, cards light up under the pointer, buttons lean toward the cursor, and the email has a copy button.

## Colours

Palette "Nashik Valley", defined as tokens at the top of `style.css`: aubergine ink `#22162A`,
wine accent `#7B2346`, vine green `#4E7428`, paper `#F6F5F2`, and the dark band `#2B1631`.
Each work category has a strong, a soft and a light colour (`--web`, `--web-soft`, `--web-light`, and so on).
Any element with `data-cat="…"` picks them up as `--c` (text and marks on light), `--c-soft` (chip and
highlight backgrounds) and `--c-light` (marks on the dark bands).

## Adding a project

Copy an `<article class="card">` inside the right category section of `index.html`, renumber it, and
update the project count in that section's header and in the Contents list.
Status chips: `chip--done` (live, built, delivered) or `chip--open` (in build, scoping, mvp, and so on).

## Share preview

There is no `og:image` yet. To add one, export a 1200 × 630 px image to `assets/og-banner.jpg`, add
`<meta property="og:image" content="https://rohantdk.github.io/arcline.github.io/assets/og-banner.jpg" />`
and change `twitter:card` to `summary_large_image`.
