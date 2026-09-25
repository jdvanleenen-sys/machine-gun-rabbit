# SEO & AEO — Machine Gun Rabbit site

**Method (canonical, reusable):** `90 Jeff Standards/playbooks/seo-aeo-checklist.md`.
This file is only *this site's status* against that standard. This is a single-page
site, so the multi-page items (hub-and-spoke, per-post interlinking) are roadmap, below.

## Done (live)
- One `<title>` (57 chars, keyword "Calgary's Party Band"), one meta description
  (~150 chars), one real text `<h1>` (band name was image-only before), canonical.
- Structured data (JSON-LD): `MusicGroup`, one `MusicEvent` per confirmed night (nine,
  Oct 16 to Dec 5, with start/end times), `Place` venues, `FAQPage`. Mirrors the
  visible Upcoming Shows list; drop each gig from both after it passes.
- Visible FAQ, answer-first, matching the FAQ schema (feeds AI answer engines).
- Descriptive alt text on every content image; decorative images have empty alt.
- Keyword image filenames (`machine-gun-rabbit-*`), not generic.
- Photos optimized: Sept 19 Langdon shots resized (1400px hero/band, 800px pair),
  JPEG, ~0.8 MB total. `width`/`height` on every content image (no layout shift).
  `loading="lazy"` below the fold.
- Live video (Sept 19 Langdon clip) self-hosted as H.264 MP4 with a poster frame,
  so it plays in every browser; `preload="metadata"` keeps first load light.
- Custom domain `machinegunrabbit.com` live (CNAME); canonical, OG image, sitemap and
  JSON-LD `@id`s all use it.
- Visitor analytics: GoatCounter on `index.html` and `book.html` (cookieless, no
  banner needed). Dashboard: https://machinegunrabbit.goatcounter.com
- Outbound authority links: venue names link out to Google Maps (new tab, trust signal).
- `robots.txt` + `sitemap.xml`; branded `404.html`; geo tags; Open Graph + Twitter card
  with a lips-on-black share image; `theme-color`; `prefers-reduced-motion`.

## Pending (needs Jeff)
- **Google Search Console**: verification file `google8df924566f848570.html` is live
  (HTML-file method). Confirm the property shows as verified in Jeff's account, submit
  `sitemap.xml`, then Inspect + Request indexing. Bonus: import into Bing Webmaster
  Tools (feeds ChatGPT search).
## Roadmap (when there's a video / more pages)
- The Sept 19 clip is on the home page (self-hosted). Next: post it to YouTube, then build a **recap/blog page**
  here that embeds it, targets one keyword ("Machine Gun Rabbit live at Langdon"),
  answers in the first sentence, links out to an authority source, and adds
  `VideoObject` schema + the embed. That turns the site multi-page and starts the
  hub-and-spoke Fred describes.
- YouTube upload: use the `rymac-prep-the-file-for-upload` skill — renames the file to
  the title and bakes title/tags/rating/URL into the file properties before upload
  (spiders read the file name first).
- If an email capture is added (instead of IG-DM booking): wire the
  `rymac-relationship-sequence` (10 emails, one idea + one link each).
