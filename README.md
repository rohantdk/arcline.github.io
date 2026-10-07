# Arcline

The web and AI studio of Rohan Tidke, Nashik. Plain HTML, CSS and JavaScript, hosted on GitHub Pages at
https://rohantdk.github.io/arcline.github.io/

## Page structure

One page, in separate sections, following the 2026 works brochure:

1. Hero, with the logo as the title and a dot per work category
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

- **The title** (hero): the One Line logo, drawn large, with seven square dots as its full stop, one per work
  category. The `h1` still holds the word "Arcline" (visually hidden) for search and screen readers. The logo is
  revealed from left to right, then the dots pop in. Hover or focus a dot for the
  name and count, click to jump there. Names and counts are read from the Contents list, so there is nothing extra
  to update.
- **Nav logo**: the logo's baseline fills from left to right as you scroll down the page. In the Work section the
  fill and the two square dots take the colour of the category in view, and (on wide screens) a label beside the logo names it, e.g. "03 / 07 AI engineering".
- **Live-site previews**: hovering a project card that has a live site shows its homepage in a small browser frame
  beside the cursor, after a quarter-second pause (at once on the link itself; mouse and trackpad only). To add one, save a 640 × 400 px screenshot to `assets/previews/<name>.webp` and add
  `data-peek="assets/previews/<name>.webp"` to the card's `card__link`.
- **Whole-card links**: a card's `card__link` is stretched over the card (in `style.css`), so a click or tap
  anywhere on it opens the site. Cards without a link light up briefly when clicked instead.
- **The mark again** (contact): it draws itself on the contact rule, and a dot slides along its line and lands as its full stop.
- **Tools marquee**: below the hero. It speeds up as you scroll, turns with the scroll direction and pauses on hover.
  Edit the list in `index.html`; `data-cat` sets each dot's colour.
- **Project filter**: above the work. Filter by status (driven by `chip--done` / `chip--open`) or search by name,
  client, city or stack. Category counts update and empty categories hide.
- **Command palette**: `⌘K`, `Ctrl+K` or `/` (or the Search button) jumps to any section, project or contact action.
  It is built from the page, so new cards appear in it on their own.
- **Small things**: section rules draw in, mono labels decode
  from random glyphs, the stats count up, a line draws across each Process step in turn, the dot on "live" chips
  pulses, cards light up under the pointer, buttons lean toward the cursor, and the email has a copy button.

## Logo

"One Line": the name drawn as one thick geometric line, standing on a baseline that ends in a square wine dot
(the dot on the i is square too). Square ends throughout. The symbol is the "a." on its line. Files are in
`assets/logo/`:

- `arcline-logo*.svg`: the full logo. `-dark-bg` for dark backgrounds, `-mono-dark` / `-mono-light` for one colour.
- `arcline-symbol*.svg`: the "a." symbol, same variants. `arcline-symbol-tile.svg` puts it on the dark band tile.
- `png/`: 512 px symbols, 1024 px social squares (dark and light), 2000 px logos on transparent backgrounds.

The nav uses the logo inline in `index.html` (so its baseline can show scroll progress) and `assets/favicon.svg`
is the symbol tile. The hero and Contact show the "a." symbol drawn into the page (see Motion and interaction).

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

`assets/og-banner.jpg` (1200 × 630 px) is the image shown when the link is shared on WhatsApp, LinkedIn and the
like: the logo on the dark band with the hero line. It is set by the `og:image` tags in `index.html`, with
`twitter:card` set to `summary_large_image`. To change it, replace the file at the same size and keep the name.
