# Notes for Leo

Rewritten 16 September 2026, replacing the 14 September version (which had
been patched with a "partly superseded" notice and was getting hard to trust).
This one reflects the site as it actually is right now. **Read this, then
`CLAUDE.md`** — CLAUDE.md has the house rules and technical detail; this file
is "what happened recently and what's still open."

If you're picking this up on a different computer: `git pull`, then
`node build.js && node check.js` to confirm your checkout matches what's
committed (it should print "ALL CHECKS PASSED" and `git status` should show
no changes after the build — if it does, something's out of sync). No
`npm install` needed anywhere; this repo has zero dependencies.

---

## What exists right now

A five-page site — Home, Projects (My Works), Fun, Contact, and a new **Ask**
page. Static HTML generated from `content.js`, GitHub Pages, no framework.

**Home** is no longer one dense hero card. It's three pieces stacked:
1. A bare, full-viewport **quote** (the Turing/*Imitation Game* line), with a
   soft bouncing "Scroll for profile" cue at the bottom.
2. A bare, full-viewport **splash** — "Hi, I'm Leo! 👋", portrait, tagline,
   UBC credential, social row (Gmail/LinkedIn/Instagram/Chess.com/NeuroArts,
   all raw logos, no bubble backgrounds), and the two CTA buttons.
3. The **bento**: Based in + What drives me (side by side), The record +
   About (About is now a few big bullet points, not a paragraph), I also
   like (full width). Weather and a Vancouver time card were both tried and
   explicitly removed again — don't re-add either without Leo asking.

**Fun** (and "In the lab," which shares the same renderer) is a CSS-columns
masonry now, not a uniform grid — tiles vary in shape (wide/tall/square).
The old placeholder video clips (fake YouTube ids) are gone, replaced with
real links tied to Leo's actual stated interests, since a fake/unverified
video id is worse than no video. The photo tiles are still placeholders.

**Projects** — Research and Teaching entries dropped their blurb paragraphs;
they're title + affiliation chips + award/write-up links only now, leaner
and more like Kellie Ho's site. Research went from 4 projects to 3 — the
Neuroaesthetics entry was research-labeled by mistake; it's Teaching-only.

**Ask** is a new page/tab — rightmost dock icon (magnifying glass), before
the theme toggle. Deliberately minimal: headline, one hint line, one input.
**It is not a real LLM chatbot** — no API key, no backend. It's a small
client-side keyword map (`TARGETS` in `main.js`) that navigates you to the
matching section. See CLAUDE.md's "The Ask page" section before changing it.

Every color passes WCAG AA in both themes — `check.js` gates this, not
eyeballing. The stylesheet link now carries a content-hash query string
(`styles.css?v=<hash>`) specifically because a stale-cache bug made several
CSS-only pushes look like they hadn't taken effect — if a change still looks
wrong after a hard refresh, this is the first thing to suspect is *not* the
cause anymore, but check it existed before assuming the CSS itself is broken.

---

## Known open items — genuinely not done

- **`hero.record` / `hero.buttons` / `hero.credential` data is behind the
  real CV.** `cv.pdf` reflects STEMCELL, JHU/Moss Lab, the UBC Audiology VR
  project, and an awards list that `content.js` doesn't fully carry yet.
  Ask Leo before reconciling — it's his call which one is the source of truth.
- **`About`'s three bullet points (`hero.points` in content.js) are Claude's
  best guess**, written this session from facts already verified elsewhere
  in the file. Leo said he'd edit them — don't treat them as final/checked.
- **Fun/lab photo placeholders** (`assets/placeholder.svg`) still need Leo's
  real photos before the site goes public — see the `PLACEHOLDER` titles in
  `content.js`'s `fun` and `lab` blocks.
- **The `reading` list on Home** is still placeholder rows.
- **Si-Lab description (entry `T-02`)** needs Dr. Skoretz's sign-off before
  publishing — it draws on an unsubmitted manuscript.
- **STEMCELL and Moss Lab descriptions** are deliberately vague (co-op/lab
  agreement constraints) — don't enrich them from outside sources without asking.
- **The repo is private on purpose.** Never flip visibility, enable Pages on
  a public repo, or add a custom domain without Leo asking directly.

## Recently reversed — don't re-add without being asked

Weather + Vancouver-time card (tried twice, explicitly deleted both times).
The "Trained in" skills marquee and its CSS (deleted — dead code was removed
along with the card, not left behind). If asked to bring either back, that's
a new decision each time, not an assumption.
