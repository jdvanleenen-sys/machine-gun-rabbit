# SEO & AEO — Machine Gun Rabbit site

Checked against Rymac's metadata method and Fred's audit checklist. This is a
single-page site, so the multi-page items (hub-and-spoke, per-post interlinking)
become the roadmap below rather than fixes.

## Done (live)
- One `<title>` (57 chars, keyword "Calgary's Party Band"), one meta description
  (~150 chars), one real text `<h1>` (band name was image-only before), canonical.
- Structured data (JSON-LD): `MusicGroup`, `MusicEvent` (Sept 19 Langdon), `FAQPage`.
- Visible FAQ, answer-first, matching the FAQ schema (feeds AI answer engines).
- Descriptive alt text on every content image; decorative images have empty alt.
- Keyword image filenames (`machine-gun-rabbit-*`), not generic.
- Photos optimized: resized + JPEG q82, ~6 MB → ~0.45 MB. `width`/`height` on every
  content image (no layout shift). `loading="lazy"` below the fold.
- Outbound authority links: venue names link out to Google Maps (new tab, trust signal).
- `robots.txt` + `sitemap.xml`; branded `404.html`; geo tags; Open Graph + Twitter card
  with a lips-on-black share image; `theme-color`; `prefers-reduced-motion`.

## Pending (needs Jeff)
- **Google Search Console**: verify (URL-prefix property, HTML-tag method — paste the
  tag, it gets added to `<head>`), then submit `sitemap.xml`, then Inspect + Request
  indexing. Bonus: import into Bing Webmaster Tools (feeds ChatGPT search).
- **Custom domain**: point a real domain at Pages; update all absolute URLs (canonical,
  OG image, sitemap, JSON-LD `@id`) to the new domain so authority doesn't split.

## Roadmap (when there's a video / more pages)
- After the Sept 19 shoot: post the video to YouTube, then build a **recap/blog page**
  here that embeds it, targets one keyword ("Machine Gun Rabbit live at Langdon"),
  answers in the first sentence, links out to an authority source, and adds
  `VideoObject` schema + the embed. That turns the site multi-page and starts the
  hub-and-spoke Fred describes.
- YouTube upload: use the `rymac-prep-the-file-for-upload` skill — renames the file to
  the title and bakes title/tags/rating/URL into the file properties before upload
  (spiders read the file name first).
- If an email capture is added (instead of IG-DM booking): wire the
  `rymac-relationship-sequence` (10 emails, one idea + one link each).
