# Arcline — arcline.github.io

The web and AI studio of Rohan Tidke, Nashik. Plain HTML, CSS and JavaScript, hosted on GitHub Pages.

## How the page works

- One paragraph, one ledger, one closing paragraph. There are no section blocks.
- The underlined category words in the opening paragraph filter the ledger. Each filter has its own link, e.g. `arcline.github.io/#ai`.
  Keys: `web`, `shop`, `ai`, `apps`, `platforms`, `brand`, `studio`.
- Each ledger line is a native `<details>`, so it opens and closes without JavaScript.
- Monochrome only (paper and ink, inverted in dark mode). Every font weight is 400.

## Adding a work

Copy one `<details class="w">` block in `index.html`, set `data-c` to a category key, renumber, and update the small count (`<sup>`) next to the matching word in the paragraph.

## Share preview

There is no `og:image` yet. To add one, export a 1200 × 630 px monochrome image to `assets/og-banner.jpg` and add:

```html
<meta property="og:image" content="https://arcline.github.io/assets/og-banner.jpg" />
```

and change `twitter:card` to `summary_large_image`.
