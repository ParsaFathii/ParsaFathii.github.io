parsafathii.github.io — Personal portfolio of Parsa Fathi

Live at **https://parsafathii.github.io**

A static, single-page portfolio with a "field survey" identity: a cartographic
report that numbers its sections as survey stations, draws its own pipe network,
and treats every claim as a record with evidence behind it.

**MK II "Spectrum" edition** — the survey now runs on a five-band spectrum
(green · cyan · violet · magenta · amber) that rotates per station: each section
carries its own accent hue, ambient page light shifts as you scroll, and the
dark SPERLUS chapter glows with drifting aurora fields over animated
architecture data-flows.

## Stack

- **Vanilla HTML / CSS / JS** — no frameworks, no build step, no trackers.
- Fonts self-hosted: [Archivo](https://fonts.google.com/specimen/Archivo) (variable) + [IBM Plex Mono](https://fonts.google.com/specimen/IBM+Plex+Mono).
- Animations: CSS transitions + keyframes + IntersectionObserver + SVG
  line-drawing + a 2D-canvas particle constellation, all dependency-free.
  `prefers-reduced-motion` disables every animation; the page is fully usable
  without JS.

## Motion & color system

- Station accent rotation (01 green → 03 cyan → 04 magenta → 05 amber →
  06 violet → 07 orange) wired through CSS custom properties.
- Flowing spectrum typography on the hero title, gradient ghost numerals,
  spectrum scroll-progress bar, film-grain overlay, hue-shifting ambient light.
- Scroll velocity-reactive double marquee, decode-style text scrambles,
  count-up stats, timeline rail, card spotlights, magnetic buttons,
  constellation canvas with mouse interaction, crosshair survey cursor.

## Structure

```
index.html          all content (semantic HTML, sections as stations 00–07)
assets/css/         design system + layout (spectrum edition)
assets/js/          interactions (preloader, reveals, canvas, counters, cursor, nav, menu)
assets/fonts/       self-hosted woff2 (latin subsets)
assets/img/         real screenshots from public repositories (Apache-2.0), OG cover, icons
404.html            off-the-grid page
robots.txt sitemap.xml
```

## Content policy

- Every project shown is real and inspectable; screenshots are captured from the
  running systems in the public repositories.
- No fabricated metrics, dates, stars or follower counts anywhere; the SPERLUS
  stats shown are the versions and catalog sizes verifiable in repository
  history.
- The SPERLUS case study is architecture-level only: client identity and
  inspection data are confidential and are never published.

## Editing

Project entries live directly in `index.html` (Stations 03 and 06). Images go to
`assets/img/` (WebP preferred). Bump `REV` labels in the hero/footer when shipping.
