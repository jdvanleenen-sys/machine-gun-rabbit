# PRD — Machine Gun Rabbit Website

## What this is
A single-page site for Machine Gun Rabbit, Calgary's Party Band. A link hub, not
a content platform. Someone lands from a poster, a QR code, or the Instagram bio
and leaves knowing who the band is, where to catch them, and how to book or follow.

## The one job
Two co-equal actions: **Book the band** and **Follow on Instagram** (positioning line: "Calgary's Party Band. From ABBA to AC/DC..."). Everything
points at one of them. Neither outranks the other (pink Book, gold Follow).

## Scope — v1
One page, no accounts, no backend. Sections: Header, Hero, Where We Play, The Set,
The Band, Follow / Book, Footer. Deploy to GitHub Pages.

## Confirmed facts (source: the Design System)
- Machine Gun Rabbit, Calgary, AB. Positioning: "Calgary's Party Band. From ABBA
  to AC/DC." Slogan: "Not famous... But Known." Hook: "27 songs. One night."
- Lineup (five): Libby (vocals), Mike (vocals, rhythm guitar), Phil (lead guitar),
  Jeff (bass), Tyler (drums).
- Venues played: Langdon, Elbow River Casino, The Kings Head, Big Al's.
- Verified channel: Instagram `@machinegunrabbit`.

## Honesty rules
- No stale show dates. The Upcoming Shows list (index.html `.gig-list`) carries
  confirmed gigs only, mirrored in the JSON-LD `MusicEvent` entries. Remove each
  gig from both once it has passed. Show a time only when the venue has published it.
- Book routes to `book.html`: call or text Phil at (403) 669-8116, with Instagram and
  Facebook as the alternatives. The FAQ (visible and JSON-LD) must say the same.
- No fabricated bios, quotes, counts, or links.

## Design
Conforms to the Machine Gun Rabbit Design System. Black `#0a0a0a` ground, pink
`#FF1493`, gold `#c9a227`, white text. Anton display, Inter body. The band name is
the `wordmark-pink.png` artwork — never set in Anton. Real photos, photo-scrim hero.

## Delivery checklist
- [x] Header: lockup + anchors + equal Book/Follow.
- [x] Hero: lockup (lips + wordmark), slogan, positioning, two equal CTAs, photo scrim.
- [x] Where We Play: venue rows + Instagram note (no stale dates).
- [x] The Set: song chips (uniform; 50+ song repertoire, sample shown).
- [x] The Band: five member cards + photos.
- [x] Follow / Book: two equal CTAs to Instagram.
- [x] Footer: handle, slogan, wordmark, year.
- [ ] All asset paths relative; mobile checked; deployed to Pages.

## Later (out of scope now)
Dated show calendar, ticket links, press kit, email signup (needs a form handler),
a booking email swap, TikTok / YouTube / Spotify when confirmed.
