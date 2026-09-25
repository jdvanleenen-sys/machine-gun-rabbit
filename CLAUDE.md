# Machine Gun Rabbit — Website

Static one-page site for Machine Gun Rabbit, Calgary's Party Band. Its one job:
point people to the band (book the band, follow on Instagram, see where we play).
Hosted free on GitHub Pages at machinegunrabbit.com. Code lives here in
`C:\GitHub\machine-gun-rabbit`; the brand lives in Jeff-HQ (never put this repo
back in OneDrive, it corrupts `.git`).

## Brand source of truth (canonical, do not duplicate here)

All brand facts — voice, color, type, logo, imagery, components — live in the
**Machine Gun Rabbit Design System**, in the band's Jeff-HQ venture folder:

`Jeff-HQ/10 Ventures/machine-gun-rabbit/Machine Gun Rabbit Design System/` → start at `readme.md`.

This site conforms to it. `styles.css` mirrors its `tokens/` values and its
component styles (Button, ShowRow, SongChip, SectionHeading, member cards). The
real `logo-lips.png` and `wordmark-pink.png` are copied into `assets/`. Never set
the band name in Anton — always place the wordmark artwork.

## Where things live

| Need | Go to |
| --- | --- |
| Scope, sections, checklist | `PRD.md` |
| Brand (voice, color, type, logo, components) | `Jeff-HQ/10 Ventures/machine-gun-rabbit/Machine Gun Rabbit Design System/` |
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
  Mike, Phil, Jeff, Tyler. Channels: Instagram `@machinegunrabbit` and the Facebook
  page. Booking is call or text Phil at (403) 669-8116 (`book.html`); every booking
  mention on the site, including the FAQ and its JSON-LD, says the same.
- Never set the band name in Anton; use `assets/wordmark-pink.png`.
