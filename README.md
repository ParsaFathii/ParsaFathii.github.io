# parsafathii.github.io — Personal portfolio of Parsa Fathi

Live at **https://parsafathii.github.io**

A static, single-page portfolio with a "field survey" identity: a cartographic
report that numbers its sections as survey stations, draws its own pipe network,
and treats every claim as a record with evidence behind it.

## Stack

- **Vanilla HTML / CSS / JS** — no frameworks, no build step, no trackers.
- Fonts self-hosted: [Archivo](https://fonts.google.com/specimen/Archivo) (variable) + [IBM Plex Mono](https://fonts.google.com/specimen/IBM+Plex+Mono).
- Animations: CSS transitions + IntersectionObserver + SVG line-drawing.
  `prefers-reduced-motion` disables all of them; the page is fully usable without JS.

## Structure

```
index.html          all content (semantic HTML, sections as stations 00–07)
assets/css/         design system + layout
assets/js/          interactions (preloader, reveals, crosshair cursor, nav, menu)
assets/fonts/       self-hosted woff2 (latin subsets)
assets/img/         real screenshots from public repositories (Apache-2.0), OG cover, icons
404.html            off-the-grid page
robots.txt sitemap.xml
```

## Content policy

- Every project shown is real and inspectable; screenshots are captured from the
  running systems in the public repositories.
- No fabricated metrics, dates, stars or follower counts anywhere.
- The SPERLUS case study is architecture-level only: client identity and
  inspection data are confidential and are never published.

## Editing

Project entries live directly in `index.html` (Stations 03 and 06). Images go to
`assets/img/` (WebP preferred). Bump `REV` labels in the hero/footer when shipping.
