# parsafathii.github.io — Personal portfolio of Parsa Fathi

Live at **https://parsafathii.github.io**

A static, single-page portfolio with a "field survey" identity: a cartographic
report that numbers its sections as survey stations, draws its own pipe network,
and treats every claim as a record with evidence behind it.

**MK III "Prism" edition** — the survey now runs on an eight-band spectrum
(green · teal · cyan · cobalt · violet · magenta · coral · amber) that rotates
per station: each section carries its own accent hue, the ambient page light
sweeps through the spectrum as you scroll, and the dark SPERLUS chapter glows
with drifting aurora fields over animated architecture data-flows.

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
- Flowing eight-band spectrum typography on the hero title, gradient ghost
  numerals, spectrum scroll-progress bar, film-grain overlay, and a
  scroll-driven prism sweep that hue-cycles the ambient light through two full
  cycles over the page.
- Hero mesh orbs (blurred drifting color fields), prism divider lines with a
  traveling comet highlight, and a station rail navigation with pulsing
  station dots on desktop.
- Odometer stats (slot-machine digit rolls), 3D card tilt with glare and
  spotlight, spinning conic-gradient focus frames on cards and channels,
  chip pop-in hovers, chromatic (RGB-split) title hovers.
- Cursor particle trail in spectrum colors, burst sparks on primary buttons,
  click ripples, scroll velocity-reactive double marquee with hue-cycling and
  kinetic skew, decode-style text scrambles, timeline rail, magnetic buttons,
  constellation canvas with spectrum-cycling links near the cursor, crosshair
  survey cursor.
- `prefers-reduced-motion` disables every animation; the page is fully usable
  without JS.

## Structure

```
index.html          all content (semantic HTML, sections as stations 00–07)
assets/css/         design system + layout + MK III prism animation layer
assets/js/          interactions (preloader, reveals, canvas, odometer, tilt,
                    rail nav, cursor trail, bursts, ripples, nav, menu)
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
