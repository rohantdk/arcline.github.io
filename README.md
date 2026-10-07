# Arcline

The web and AI studio of Rohan Tidke, Nashik. Plain HTML, CSS and JavaScript, hosted on GitHub Pages at
https://rohantdk.github.io/arcline.github.io/

## Page structure

One page, in separate sections, following the 2026 works brochure:

1. Hero
2. Contents (dark band, links to each work category)
3. About, with the four numbers
4. Services
5. Work, in seven categories: `#web`, `#shop`, `#ai`, `#apps`, `#platforms`, `#brand`, `#studio`
6. Process ("every project includes")
7. Contact

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
