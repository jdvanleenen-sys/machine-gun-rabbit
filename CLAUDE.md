# Machine Gun Rabbit — Website

Static one-page site for Machine Gun Rabbit, Calgary's Party Band. Its one job:
point people to the band (book the band, follow on Instagram, see where we play).
Hosted free on GitHub Pages. Lives inside the MGR venture, beside the brand.

## Brand source of truth (canonical, do not duplicate here)

All brand facts — voice, color, type, logo, imagery, components — live in the
**Machine Gun Rabbit Design System**, one folder up:

`../Machine Gun Rabbit Design System/` → start at `readme.md`.

This site conforms to it. `styles.css` mirrors its `tokens/` values and its
component styles (Button, ShowRow, SongChip, SectionHeading, member cards). The
real `logo-lips.png` and `wordmark-pink.png` are copied into `assets/`. Never set
the band name in Anton — always place the wordmark artwork.

## Where things live

| Need | Go to |
| --- | --- |
| Scope, sections, checklist | `PRD.md` |
| Brand (voice, color, type, logo, components) | `../Machine Gun Rabbit Design System/` |
| The page | `index.html` |
| All styling | `styles.css` |
| Mobile nav + year | `script.js` |
| Logo, wordmark, photos | `assets/` |
| Setup, run, deploy | `README.md` |

## How to run
Pure static files, no build step. Open `index.html`, or serve the folder
(`python -m http.server 8000`) and visit http://localhost:8000

## Deploy
GitHub Pages from the `main` branch root. All asset paths are relative
(`assets/...`, `styles.css`) — never absolute (`/styles.css`), which breaks on a
Pages project subpath. Google Fonts (Anton, Inter) load over HTTPS.

## Non-negotiable
- Brand pink `#FF1493`. Black `#0a0a0a`. Gold `#c9a227`. Do not drift.
- Never fabricate show dates, member names, or channels. Lineup is five: Libby,
  Mike, Phil, Jeff, Tyler. Only `@machinegunrabbit` is verified — no booking email
  yet, so Book routes to Instagram DM until one exists.
- Never set the band name in Anton; use `assets/wordmark-pink.png`.
