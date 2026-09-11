# Machine Gun Rabbit — Website

One-page site for Machine Gun Rabbit, Calgary's Party Band. Points people to the
band: book the band, follow on Instagram, see where we play. Built to conform to
the Machine Gun Rabbit Design System (one folder up).

## Stack
Plain HTML, CSS, a little JavaScript. No framework, no build step. Fonts load from
Google Fonts (Anton + Inter).

## Run locally
Open `index.html`, or serve it:
```
python -m http.server 8000
```
Then visit http://localhost:8000

## Structure
```
website/
  index.html    the page
  styles.css    all styling (tokens mirror the Design System)
  script.js     mobile nav + year
  assets/       logo-lips.png, wordmark-pink.png, photos/
  CLAUDE.md     router for AI edits
  PRD.md        scope + checklist
```

## Deploy (GitHub Pages)
Push to GitHub, serve from the `main` branch root. Edit, commit, push — Pages
redeploys automatically. Keep asset paths relative.

## Editing
- Copy or a link: `index.html`.
- Look and feel: change it in the Design System first
  (`../Machine Gun Rabbit Design System/`), then mirror it in `styles.css`.
