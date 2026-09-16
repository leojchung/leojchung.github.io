# CLAUDE.md — leojchung.github.io

Context for Claude Code working in this repo. Read this before touching anything.
Also read `NOTES-FOR-LEO.md` — it tracks what's changed recently and what's
still open, and is kept current at the end of each work session.

## What this is

Leo J. Chung's personal website. Static HTML, no framework, no npm dependencies,
served free from GitHub Pages at the repo root.

## The one rule that matters

**`index.html`, `projects.html`, `fun.html`, `contact.html`, `ask.html`,
`cv.html` and `cv.pdf` are all GENERATED. Never edit them by hand.**

```
content.js  --[ node build.js ]-->     index.html, projects.html, fun.html, contact.html, ask.html
content.js  --[ node build-cv.js ]-->  cv.html --[ print to PDF ]--> cv.pdf
```

The site is five pages, sharing one bottom icon dock
(Home / Projects / Fun / Contact / Ask) and one footer. There is no top header —
the dock is the whole navigation, with the theme toggle at its right end.
All content — every word, date, link and section — lives in `content.js`.
Editing generated HTML directly works right up until the next build silently
erases it. `.github/workflows/check-build.yml` fails the push if the
committed HTML files don't match what `build.js` produces, which is the
safety net for exactly this mistake.

**After any change to `content.js`, run `node build.js` before committing.**

## Layout

| File | Role |
|---|---|
| `content.js` | All content + the `pages` array controlling which sections land on which page |
| `styles.css` | Design system. Colour tokens at the top; nothing else hard-codes a colour, except text on a surface that is the same in both themes (white on the blue fill, ink on amber, the overlay on a photo, print) — the file's header lists them |
| `build.js` | content.js → the five HTML pages. `RENDERERS` maps a section key to a renderer |
| `build-cv.js` | content.js → cv.html. Reads `experience`/`education`/`service`/`skills` directly — those blocks still live in `content.js` but nothing on the *website* renders them any more, only the CV does |
| `main.js` | Light/dark toggle, footer year, click-to-play video. The only JS the site ships |
| `check.js` | Audits the built pages — markup, escaping, and WCAG contrast in both themes. CI gates on it |
| `404.html` | Not-found page |
| `assets/` | Photos, syllabus PDFs, anything linked from content |

## Pages

| Page | File | Sections |
|---|---|---|
| Home | `index.html` | quote (bare, full-viewport), splash ("Hi, I'm Leo", also bare/full-viewport), the bento (Based in / What drives me / The record / About / I also like), Right Now, Featured, Principles, Reading |
| Projects | `projects.html` | Research, Teaching, "In the lab" photo grid, Featured |
| Fun | `fun.html` | the Fun media grid — a CSS-columns masonry (`.fun-grid`), not a uniform row grid; tiles carry a `shape` (wide/tall/square) in content.js |
| Contact | `contact.html` | contact bento — the ask, one card per channel, the form |
| Ask | `ask.html` | one centered input, no card. See "The Ask page" below |

Reorder or rename dock items by editing `pages` at the bottom of `content.js`.
Each page needs an `icon`, naming a key in `ICONS` in `build.js`. Add a page by
adding an entry there and teaching `build.js`'s page loop about anything
special it needs (most pages need nothing beyond the generic section loop
already there).

Home is the one page not built purely from the generic section loop.
`renderHome()` in build.js returns three pieces concatenated: the quote
section, the splash section, and the bento. The quote and splash are bare —
no card fill, full `100svh` each, centered — deliberately unlike every
other section on the site, which is left-aligned and just flows. The bento
itself is hand-laid: `sp-*` spans must total 12 per row, and it's the one
grid on the site arranged by hand rather than generated from a flat list,
because the layout carries meaning there. Current bento order: Based in +
What drives me (sp-6 each) / The record + About (sp-5 + sp-7) / I also like
(sp-12, full width). About is `content.js`'s `hero.points` — a few big
bullet points (`.about-points`, reusing the `.value` size/weight), not a
paragraph.

### The Ask page

A minimal "ask it anything" bar — headline, one hint line, one input, no
suggestion chips, no explainer text (Leo wants it that way; don't add them
back). It is NOT an LLM — there is no API key and no backend, on purpose:
this is a static GitHub Pages site, and a client-side API key is public by
construction. `main.js`'s `TARGETS` array is a small keyword map scored
against whatever was typed; the best match navigates the browser there
(a real link — a section on another page, or an anchor on this one). No
match gets an honest "try rephrasing," never a wrong guess. Add a
destination by adding a `{ href, keys }` entry to `TARGETS`.

## Conventions

- **US spelling** throughout (behavioral, remodeling, analyzing). One convention,
  held consistently. Do not mix.
- **Three theme blocks in `styles.css`**, and they must agree: bare `:root`
  (light), `@media (prefers-color-scheme: dark)` guarded with
  `:root:not([data-theme="light"])`, and `:root[data-theme="dark"]`. A visitor's
  theme has three states, not two — the un-stamped "system" default is the one
  people forget. Change a dark token in one block, change it in both.
- **Cards are flat.** Fill only — no border, no shadow. That restraint is the
  whole look; adding either makes the page read as a form rather than a
  layout. Shadow is spent in exactly one place, the floating dock.
- **Colour roles are fixed.** Violet `--accent` (`#7C3AED`) is a fill for the
  primary action and the active dock item; `--accent-ink` is the darker
  text/link variant, because the fill colour does not pass AA as text on a
  card. Amber
  `--cta` is the secondary action and **always takes `--ink` text, never
  white** — white on amber is about 2:1. Green `--live` means one thing: a
  currently-held post, and never appears without a text label beside it.
- **Two-tone display text.** `<em>` inside a headline is the grey half of the
  sentence, set in `--ink-mute` and *not* italic. `<b>` inside grey body copy
  brings a phrase back to near-black. Both are colour changes, not emphasis —
  don't "fix" them into italics or bold.
- **`--ink-mute` is display sizes only** (≥24px, or ≥19px bold), where AA is
  3:1. It measures 3.3:1 on a card and fails as body copy. Anything small or
  body-sized uses `--ink-2`.
- **Contrast is checked, not eyeballed.** Every colour meets WCAG AA in both
  themes including the 10–11px monospaced labels. The tightest pairing is
  `--ink-2` on `--card-3` (the chips), at 5.1:1 — if you lighten `--ink-2`,
  that is what breaks first. If you change a token, compute the ratio rather
  than assuming.
- Formal sections (Research, Teaching, Press) run roughly 20–25 words a
  sentence, em-dashes rather than semicolons — there's a fuller voice profile
  at `~/Downloads/ClaudeCoworkProjects/00_Resources/voice-principles.md`.
  **Home's intro paragraph, Principles, and the Contact blurb are
  deliberately casual/first-person by Leo's request** — don't "correct" them
  back to the formal register.

## Common tasks

```bash
node build.js          # rebuild all four HTML pages after editing content.js
node check.js          # audit the build: escaping, markup, WCAG in both themes
node build-cv.js       # rebuild cv.html; then print to PDF over cv.pdf
python3 -m http.server 8000   # local preview at http://localhost:8000
```

`node build.js && node check.js` is what CI runs, so run both before pushing.
`check.js` is how the contrast rule below is actually enforced — it measures
every pairing the design uses, in both themes. It does **not** render
anything, so it cannot tell you whether a card looks right at 390px. Open the
page for that.

- **Add a role** → copy the nearest entry in the right `content.js` block.
- **Hide something** → `hidden: true` on that entry. Don't delete.
- **Move a section to a different page, or reorder within a page** → the
  `sections` array on the relevant entry in `pages`, at the bottom of
  `content.js`.
- **New section type** → add the data block to `content.js`, add one line to
  `RENDERERS` in `build.js`, add its key to the right page's `sections` array.
  Give the block an `eyebrow` (the small label over its headline) and,
  optionally, an `action: { label, href }` for a pill beside the heading.
- **Reskin** → only the token blocks at the top of `styles.css`.
- **Something bleeding off a card edge** → offset it by exactly
  `calc(-1 * var(--pad))` and give it back `padding-inline: var(--pad)`.
  That is what keeps a bleeding row aligned with the text above it at every
  width. See `.panel` and `.bleed-row`.

The `notes` block still exists in `content.js` but isn't listed on any page in
`pages` — placeholder entries, leave it unreferenced until Leo has real
writing for it.

The `fun`, `lab` and `reading` sections currently hold placeholder
tiles/photos/rows, and `meta.portrait` is still `assets/placeholder.svg`.
**All of these must be filled in with real content before the site goes
public** — rows reading "PLACEHOLDER" or "add a YouTube id" on a live page
look broken. `reading` is the cheapest of them to keep current (a title and a
URL, no blurb); if it will not be kept fresh, remove it from the Home page's
`sections` array rather than letting it go stale.

### Rules for the fun section

- Items have `kind: "photo" | "video" | "link"`.
- **Never download a game highlight or music video into `assets/`.** That
  republishes someone else's copyrighted work from Leo's own domain under his
  real name. Clips are `kind: "video"` with a YouTube or Vimeo id, which plays
  from the rightsholder's own upload. Photos in `assets/` must be Leo's own.
- Videos are click-to-play by design: the tile is a `<button>` and `main.js`
  swaps in the iframe on click, so nothing is requested from YouTube for a
  visitor who only scrolls past. Do not "simplify" this into a plain iframe.

### Rules for the contact form

- GitHub Pages has no backend, so the form POSTs to a third-party endpoint set
  in `contact.form.action` (Formspree by default).
- With `action` empty it renders a mailto: fallback instead. **Keep that
  fallback.** A form that silently fails is worse than no form.
- `#f-gotcha` is a honeypot — hidden, `aria-hidden`, out of the tab order.
  Leave it alone; it is most of the spam defence.

## Git

- Small, single-purpose commits. Present tense, no scope prefixes:
  `Add Moss Lab role`, not `feat(content): add role`.
- Always `node build.js` before committing a `content.js` change, and include
  the regenerated `index.html` in the same commit.
- `main` is the deploy branch — GitHub Pages serves it directly.

## Things to check with Leo before doing

- **Anything that makes the site or repo public.** The repo is private on
  purpose. Flipping visibility, enabling Pages on a public repo, or adding a
  custom domain are his calls, not yours.
- **Changing the Si-Lab description** (entry `T-02`). It draws on an unsubmitted
  manuscript; Dr. Skoretz needs to be comfortable with the public wording.
- **The STEMCELL and Moss Lab descriptions.** Both are deliberately vague about
  the work because the co-op and lab agreements may constrain what can be said.
  Do not enrich them from other sources without asking.
- **Adding claims about the Neuroaesthetics seminar.** It was *co*-created with
  Betty Bao under faculty sponsor Dr. Steven Barnes, and ran Winter Term 2
  (Jan–Apr 2026), course code `ASTU_V 400E-001`. Do not upgrade this to a solo
  credit — official UBC sources name both coordinators.
