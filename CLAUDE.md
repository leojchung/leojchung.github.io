# CLAUDE.md — leojchung.github.io

Context for Claude Code working in this repo. Read this before touching
anything. `README.md` covers the same ground for a human; this file carries
the house rules, the invariants, and the things that need Leo's say-so.

## What this is

Leo J. Chung's personal website. Static HTML, no framework, no npm
dependencies, served from the repo root by GitHub Pages.

**The repo is public and the site is live at <https://leojchung.github.io/>.**
Anything committed here is world-readable the moment it is pushed.

## The one rule that matters

**`index.html`, `projects.html`, `fun.html`, `contact.html`, `ask.html`,
`cv.html`, `cv.pdf` and `sitemap.xml` are all GENERATED. Never edit them by
hand.**

```
content.js  --[ node build.js ]-->     index.html, projects.html, fun.html,
                                       contact.html, ask.html, sitemap.xml
content.js  --[ node build-cv.js ]-->  cv.html --[ print to PDF ]--> cv.pdf
```

Five pages, sharing one bottom icon dock (Home / Projects / Fun / Contact /
Ask) and one footer. There is no top header — the dock is the whole
navigation, with the theme toggle at its right end. All content — every word,
date, link and section — lives in `content.js`. Editing generated HTML works
right up until the next build silently erases it.
`.github/workflows/check-build.yml` fails the push if the committed HTML
doesn't match what `build.js` produces, which is the safety net for exactly
that mistake.

**After any change to `content.js`, run `node build.js` before committing,
and commit the regenerated HTML in the same commit.**

## Layout

| File | Role |
|---|---|
| `content.js` | All content + the `pages` array controlling which sections land on which page |
| `styles.css` | Design system. Colour tokens at the top; nothing else hard-codes a colour, except text on a surface that is the same in both themes — the file's header lists them |
| `build.js` | content.js → the five pages + `sitemap.xml`. `RENDERERS` maps a section key to a renderer |
| `build-cv.js` | content.js → cv.html. Reads `experience`/`education`/`service`/`skills` directly — those blocks still live in `content.js` but nothing on the *website* renders them any more, only the CV does |
| `main.js` | Theme toggle, footer year, click-to-play video, and the Ask page's keyword map. The only JS the site ships |
| `check.js` | Audits the built pages — markup, escaping, class coverage, WCAG contrast in both themes, and that the two dark blocks agree. CI gates on it |
| `404.html`, `robots.txt`, `favicon.svg`, `.nojekyll` | Standard static-site furniture |
| `assets/` | Photos, org logos, syllabus PDFs — anything linked from content |

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
special it needs — most pages need nothing beyond the generic section loop.

Home is the one page not built purely from the generic section loop.
`renderHome()` returns three pieces concatenated: the quote section, the
splash section, and the bento. The quote and splash are bare — no card fill,
full `100svh` each, centered — deliberately unlike every other section on the
site, which is left-aligned and just flows. The bento is hand-laid: `sp-*`
spans must total 12 per row, and it is the one grid arranged by hand rather
than generated from a flat list, because the layout carries meaning there.
Current order: Based in + What drives me (sp-6 each) / The record + About
(sp-5 + sp-7) / I also like (sp-12). About is `hero.points` — a few big
bullet points (`.about-points`), not a paragraph.

### The Ask page

A minimal "ask it anything" bar — headline, one hint line, one input. No
suggestion chips, no explainer text; Leo wants it that way, don't add them
back. **It is not an LLM** — there is no API key and no backend, on purpose:
this is a static Pages site and a client-side API key is public by
construction. `main.js`'s `TARGETS` array is a small keyword map scored
against whatever was typed; the best match navigates the browser there. No
match gets an honest "try rephrasing," never a wrong guess. Add a destination
with a `{ href, keys }` entry in `TARGETS`.

## Conventions

- **US spelling** throughout (behavioral, remodeling, analyzing). One
  convention, held consistently. Do not mix.
- **Three theme blocks in `styles.css`**, and they must agree: bare `:root`
  (light), `@media (prefers-color-scheme: dark)` guarded with
  `:root:not([data-theme="light"])`, and `:root[data-theme="dark"]`. A
  visitor's theme has three states, not two — the un-stamped "system" default
  is the one people forget. `check.js` enforces that the last two agree.
- **Cards are flat.** Fill only — no border, no shadow. That restraint is the
  whole look; adding either makes the page read as a form rather than a
  layout. Shadow is spent in exactly one place, the floating dock.
- **Colour roles are fixed.** Violet `--accent` (`#7C3AED`) is a fill for the
  primary action and the active dock item; `--accent-ink` is the darker
  text/link variant, because the fill colour does not pass AA as text on a
  card. Amber `--cta` is the secondary action and **always takes `--ink`
  text, never white** — white on amber is about 2:1. Green `--live` means one
  thing: a currently-held post, and never appears without a text label.
- **Two-tone display text.** `<em>` inside a headline is the grey half of the
  sentence, set in `--ink-mute` and *not* italic. `<b>` inside grey body copy
  brings a phrase back to near-black. Both are colour changes, not emphasis —
  don't "fix" them into italics or bold.
- **`--ink-mute` is display sizes only** (≥24px, or ≥19px bold), where AA is
  3:1. It fails as body copy. Anything small or body-sized uses `--ink-2`.
- **Contrast is checked, not eyeballed.** The tightest pairing is `--ink-2` on
  `--card-3` (the chips) — if you lighten `--ink-2`, that is what breaks
  first. If you change a token, compute the ratio rather than assuming; run
  `node check.js` for the current numbers.
- Formal sections (Research, Teaching, Press) run roughly 20–25 words a
  sentence, em-dashes rather than semicolons. **Home's intro, Principles and
  the Contact blurb are deliberately casual/first-person by Leo's request** —
  don't "correct" them into the formal register.

## Invariants that are easy to break

- **Outbound links open in a new tab.** `externalizeLinks()` in `build.js`
  runs once over each finished page, so a link added by a future renderer is
  covered without anyone remembering. In-page anchors and our own `.html`
  pages stay in the tab; everything else — http(s), `tel:`, `cv.pdf` — gets
  `target="_blank" rel="noopener"`. `gmailify()` runs just before it and
  rewrites `mailto:` into a Gmail compose URL.
- **A logo plate's fill, padding and radius go on the SLOT, never the
  `<img>`.** A `border-radius` on the image clips the artwork. Where the slot
  hugs a mark's exact proportions the mark touches all four edges, and the
  corners bite into it — this cropped the UBC crest twice. `--logo-pad` is
  the inset, and it must clear the radius (about `0.29 × r`).
- **Logos are matched on height, not fitted into a square.** The marks are
  very different shapes (UBC 0.74:1, JHU 2.09:1, STEMCELL 4.64:1). A square
  box letterboxes the wide ones into strips — STEMCELL came out 10px tall
  against UBC's 46px. `img.mark` and `.now-logo img` need `object-fit:contain`
  or non-square logos get stretched.
- **The `styles.css` link carries a content-hash query string**
  (`styles.css?v=<hash>`, computed in `build.js`). It exists because a stale
  browser cache made several CSS-only pushes look like they hadn't landed.
  Don't remove it.
- **Something bleeding off a card edge** is offset by exactly
  `calc(-1 * var(--pad))` and given back `padding-inline: var(--pad)`. That is
  what keeps a bleeding row aligned with the text above it at every width.
  See `.panel` and `.bleed-row`.

## Common tasks

```bash
node build.js          # rebuild the five pages + sitemap.xml
node check.js          # audit the build
node build-cv.js       # rebuild cv.html; then print to PDF over cv.pdf
python -m http.server 8000     # local preview (python3 on macOS)
```

`node build.js && node check.js` is what CI runs, so run both before pushing.
`check.js` does **not** render anything, so it cannot tell you whether a card
looks right at 390px. Open the page for that.

- **Add a role** → copy the nearest entry in the right `content.js` block.
- **Hide something** → `hidden: true` on that entry. Don't delete.
- **Move or reorder a section** → the `sections` array on the relevant entry
  in `pages`, at the bottom of `content.js`.
- **New section type** → add the data block to `content.js`, one line to
  `RENDERERS` in `build.js`, and its key to the right page's `sections`. Give
  the block an `eyebrow` and optionally an `action: { label, href }`.
- **Reskin** → only the token blocks at the top of `styles.css`.
- **Swap a logo** → drop a transparent PNG in `assets/` and point at it:
  `src:` on a social entry, `logo:` on `hero.credential` or a Right Now entry.
  A missing file warns at build time and falls back to the drawn mark.

## Rules for the fun section

- Items have `kind: "photo" | "video" | "link"`.
- **Never download a game highlight or music video into `assets/`.** That
  republishes someone else's copyrighted work from Leo's own domain under his
  real name. Clips are `kind: "video"` with a YouTube or Vimeo id, which plays
  from the rightsholder's own upload. Photos in `assets/` must be Leo's own.
- Videos are click-to-play: the tile is a `<button>` and `main.js` swaps in
  the iframe on click. Do not "simplify" this into a plain iframe. (The
  thumbnail still loads from YouTube's CDN, so a scrolling visitor does touch
  YouTube — the click-to-play is about the player, not about zero contact.)

## Rules for the contact form

- Pages has no backend, so the form POSTs to Formspree. The endpoint is in
  `contact.form.action` and is currently **connected**.
- With `action` empty it renders a `mailto:` fallback instead. **Keep that
  fallback.** A form that silently fails is worse than no form.
- `#f-gotcha` is a honeypot — hidden, `aria-hidden`, out of the tab order.
  Leave it alone; it is most of the spam defence.

## Decisions already made — don't undo these without being asked

- **The "Based in" card is a row of pins**, cloned from Kellie Ho's reference
  card. An earlier version traced a real OpenStreetMap map of Vancouver and
  Leo rejected it. Don't bring a map back.
- **The weather card and the Vancouver time card are gone**, tried twice and
  explicitly removed both times.
- **The "Trained in" skills marquee is gone**, along with its CSS.
- **The hero quote is credited to Alan Turing *and* the film.** The line is
  dialogue from *The Imitation Game* (2014), written by Graham Moore — there
  is no record of the historical Turing saying it. Leo knows, and asked for
  the credit as it stands. The film half is load-bearing: never reduce it to
  a bare "— Alan Turing".
- **Leo supplied the UBC, JHU and STEMCELL logos himself** and accepted the
  brand/trademark risk. Don't re-litigate it; do flag anything new.
- **`PLACEHOLDER` rows in `fun`, `lab` and `reading` are known and deliberate.**
  Leo knows they are publicly visible and chose to leave them. Don't re-raise.

## Things to check with Leo before doing

- **Changing the Si-Lab description** (entry `T-02`). It draws on an
  unsubmitted manuscript; Dr. Skoretz needs to be comfortable with the public
  wording.
- **The STEMCELL and Moss Lab descriptions.** Both are deliberately vague
  because the co-op and lab agreements may constrain what can be said. Do not
  enrich them from other sources without asking. Leo's cover letters describe
  the STEMCELL work in detail; that wording has deliberately not been used.
- **Adding claims about the Neuroaesthetics seminar.** It was *co*-created
  with Betty Bao under faculty sponsor Dr. Steven Barnes, and ran Winter Term
  2 (Jan–Apr 2026), course code `ASTU_V 400E-001`. Do not upgrade this to a
  solo credit — official UBC sources name both coordinators.
- **A custom domain.** That is Leo's call, not yours.

## Git

- Small, single-purpose commits. Present tense, no scope prefixes:
  `Add Moss Lab role`, not `feat(content): add role`. Explain the why in the
  body.
- Always `node build.js` before committing a `content.js` or `styles.css`
  change, and include the regenerated HTML in the same commit — otherwise CI
  goes red on the next push.
- `main` is the deploy branch; Pages serves it directly. Ask before pushing.
