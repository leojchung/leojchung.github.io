# Notes for Leo

Rewritten 5 November 2026. The previous version (16 Sep) described a site
that no longer exists — an "Ask" tab, placeholder Fun photos, a private repo —
so it was replaced rather than patched.

**`CLAUDE.md` is the source of truth.** Its **Where things stand** section, at
the bottom, has what was done recently and what's still open. This file is
just the short version.

If you're picking this up on a different computer: `git pull`, then
`node build.js && node check.js`. It should print "ALL CHECKS PASSED" and
leave `git status` clean.

## The site right now

Five pages in the dock: **Home, My Works, Contact, Fun, Search.** The repo is
public and the site is live at <https://leojchung.github.io/>.

- **Home** — quote, splash, bento (Based in / What drives me / The record /
  About / I also like), Right Now, Featured (all five write-ups, scrolling),
  and Reading (your five picks from 5 Nov). The record's Status reads "Incoming @ AbCellera."
- **My Works** — Research and Teaching. Posters and the syllabus show as
  click-through thumbnails.
- **Contact** — one card per channel, plus the Formspree form.
- **Fun** — 13 of your photos with captions.
- **Search** — a keyword box on GitHub Pages. On a Vercel deploy it can
  answer with Gemini via `api/ask.js`.

## Still open

- **Fun grid** — the columns end unevenly at 13 photos. Re-balance once
  you've finished picking photos.
- **Leo.ai on Vercel** — the code exists. Whether the Vercel project and
  `GEMINI_API_KEY` are set up isn't recorded here.
- **Si-Lab wording** (T-04) — still needs Dr. Skoretz's sign-off before it
  changes.
