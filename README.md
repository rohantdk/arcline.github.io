# Arcline

The web and AI studio of Rohan Tidke, Nashik. Plain HTML, CSS and JavaScript, hosted on GitHub Pages at
https://rohantdk.github.io/arcline.github.io/

## Page structure

One page, in separate sections, following the 2026 works brochure:

1. Hero
2. Contents (navy band, links to each work category)
3. About, with the four numbers
4. Services
5. Work, in seven categories: `#web`, `#shop`, `#ai`, `#apps`, `#platforms`, `#brand`, `#studio`
6. Process ("every project includes")
7. Contact

## Colours

Defined as tokens at the top of `style.css`: navy `#0F1733`, indigo `#3D3DC8`, lavender `#ECEEFB`.
Each work category has a strong and a soft colour (`--web` / `--web-soft`, and so on). Any element with
`data-cat="…"` picks up its category's colours as `--c` and `--c-soft`.

## Adding a project

Copy an `<article class="card">` inside the right category section of `index.html`, renumber it, and
update the project count in that section's header and in the Contents list.
Status chips: `chip--done` (live, built, delivered) or `chip--open` (in build, scoping, mvp, and so on).

## Share preview

There is no `og:image` yet. To add one, export a 1200 × 630 px image to `assets/og-banner.jpg`, add
`<meta property="og:image" content="https://rohantdk.github.io/arcline.github.io/assets/og-banner.jpg" />`
and change `twitter:card` to `summary_large_image`.
