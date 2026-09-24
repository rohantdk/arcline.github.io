# Arcline — arcline.github.io

Portfolio of Rohan Tidke. Plain HTML, CSS and JS, hosted on GitHub Pages. No build step.

## Adding a project

Copy one `<li>` inside `<ol class="rows">` in `index.html` and change:

- `href`: the live URL
- `data-shot`: a short name used for the screenshot file (see below)
- `data-note`: one line shown under the hover preview
- the number, name, sector and address text

The "05 sites" count in the header updates itself.

## Screenshots

Hover previews first look for `assets/shots/<data-shot>.jpg` (1200×750, top of the live site).
If that file is missing, the page asks a screenshot service for the live site. If that fails too,
it shows a typographic tile.

## Deploy

Settings → Pages → Source: `main` branch, `/root`.
