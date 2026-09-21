# CLAUDE.md — leojchung.github.io

Context for Claude Code working in this repo. Read this before touching
anything. `README.md` covers the same ground for a human; this file carries
the house rules, the invariants, and the things that need Leo's say-so.

## What this is

Leo J. Chung's personal website. Static HTML, no framework, no npm
dependencies, served from the repo root by GitHub Pages.

**The repo is public and the site is live at <https://leojchung.github.io/>.**
Anything committed here is world-readable the moment it is pushed.

## Starting a session

1. `git pull` first. Leo works across a Mac and a Windows PC, and other
   sessions push to `main`. If a pull ever leaves conflict markers in files,
   back the working tree up, reset to `origin/main`, and re-apply your edits
   by hand — don't try to merge generated HTML.
2. Read this file end to end, including **Where things stand** at the bottom.
3. `node build.js && node check.js` — it should pass and leave `git status`
   clean. If the build changes committed files, something is out of sync.
4. Start the preview (`python -m http.server 8000`) and tell Leo you're
   oriented. Then wait for his first change.

## Working with Leo

- **He directs the design; you make the implementation calls.** He is not a
  web developer. Explain trade-offs in terms of what a visitor *sees*, not in
  terms of CSS. The site mirrors **kellieho.framer.ai** with his tweaks on
  top — if a change would move it away from that reference, say so. You can
  screenshot her live site instead of guessing.
- **One or two changes at a time.** Make what he asked, rebuild, verify,
  stop. Don't bundle adjacent improvements or redesign around a small note.
  He often sends follow-ups mid-task; fold them in.
- **Flag, don't silently fix** — especially facts, attribution, and brand or
  trademark use. Give him the problem and the options; he answers fast and
  often says "do it anyway", which is fine.
- **Verify by machine and by screenshot, and say plainly which is which.**
  He is fine with honest gaps and not fine with unearned "looks great".
  Check desktop *and* 390px, light *and* dark.
- **Never invent a URL, headline or fact.** Look it up and check the link
  resolves before it goes on the page.
- **Pushing to `main` deploys the live site.** Ask first, unless Leo has
  said to go ahead for that session.

## Environment and tooling traps

- **Windows PC: Node is not on PATH.** Prefix node commands with
  `export PATH="$PATH:/c/Users/lchung/AppData/Local/Programs/node-portable/node-v24.21.0-win-x64"`.
  Don't conclude Node is missing, and don't use `winget` (its index is
  broken). The repo is at `C:\Users\lchung\code\leojchung.github.io`.
- **Windows uses `python`, not `python3`.** There is no `gh` CLI — read CI
  status from the GitHub REST API with curl
  (`/repos/leojchung/leojchung.github.io/actions/runs`).
- **In the Bash tool, heredocs halve backslashes.** A `\b` written into a
  Python heredoc once landed in `build.js` as a literal backspace character.
  Make any edit containing a backslash escape with the Edit tool instead.
- **Line endings are pinned to LF** by `.gitattributes`, and `build.js`
  hashes normalized CSS text for the `?v=` query string. Before this, the
  same `styles.css` hashed differently on Windows and Linux and CI failed on
  untouched files. Don't undo either half.
- **Seeing the page:** Claude-in-Chrome is blocked on the PC; headless Edge
  works. Run it from PowerShell with `Start-Process -Wait -NoNewWindow`
  (Bash mangles the paths). It won't lay out under ~500px wide, so shoot
  390px by loading the page inside a 390px `<iframe>`. Make a scratch copy of
  the built HTML with `<base href="http://localhost:8000/">`, a `data-theme`
  stamp, and `.reveal,.stagger-item{opacity:1!important;transform:none!important}`
  or cards are caught mid-fade. Work in a short path like
  `C:\Users\lchung\AppData\Local\Temp\vanmap` — the default scratch path
  exceeds Windows MAX_PATH for Python.
- **Windows has no flag emoji** — it renders 🇨🇦 as the letters "CA". That is
  why `flagify()` in `build.js` swaps in an inline SVG. Keep writing the
  emoji in `content.js`.

## The one rule that matters

**`index.html`, `projects.html`, `contact.html`, `ask.html`,
`cv.html`, `cv.pdf` and `sitemap.xml` are all GENERATED. Never edit them by
hand.**

```
content.js  --[ node build.js ]-->     index.html, projects.html,
                                       contact.html, ask.html, sitemap.xml
content.js  --[ node build-cv.js ]-->  cv.html --[ print to PDF ]--> cv.pdf
```

Five pages, sharing one bottom icon dock (Home / My Works / Contact / Fun /
Search) and one footer. There is no top
header — the dock is the whole navigation, with the theme toggle at its
right end. All content — every word, date, link and section — lives in
`content.js`. Editing generated HTML works right up until the next build
silently erases it.
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
| `build.js` | content.js → the five live pages + `sitemap.xml`. `RENDERERS` maps a section key to a renderer |
| `build-cv.js` | content.js → cv.html. Reads `experience`/`education`/`service`/`skills` directly — those blocks still live in `content.js` but nothing on the *website* renders them any more, only the CV does |
| `main.js` | Theme toggle, footer year, click-to-play video, and the Search page's keyword map. The only JS the site ships |
| `check.js` | Audits the built pages — markup, escaping, class coverage, WCAG contrast in both themes, and that the two dark blocks agree. CI gates on it |
| `404.html`, `robots.txt`, `favicon.svg`, `.nojekyll` | Standard static-site furniture |
| `assets/` | Photos, org logos, syllabus PDFs — anything linked from content |

## Pages

| Page | File | Sections |
|---|---|---|
| Home | `index.html` | quote (bare, full-viewport), splash ("Hi, I'm Leo", also bare/full-viewport), the bento (Based in / What drives me / The record / About / I also like), Right Now, Featured, Reading (Principles is switched off — data still in `content.js`, dropped from Home's `sections`) |
| Projects | `projects.html` | Research, Teaching, Featured |
| Contact | `contact.html` | contact bento — the ask, one card per channel, the form |
| Fun | `fun.html` | the photo collage. See "The Fun page" below |
| Search | `ask.html` | one centered input, no card. See "The Search page" below |

The dock's label is **Search**; the file is still `ask.html` and the `content.js` key is still `ask` —
only `navLabel` and the eyebrow were renamed (21 Sep 2026), so no URL changed.

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

### The Search page

A minimal "ask it anything" bar — headline, one hint line, one input. No
suggestion chips, no explainer text; Leo wants it that way, don't add them
back. **It is not an LLM** — there is no API key and no backend, on purpose:
this is a static Pages site and a client-side API key is public by
construction. `main.js`'s `TARGETS` array is a small keyword map scored
against whatever was typed; the best match navigates the browser there. No
match gets an honest "try rephrasing," never a wrong guess. Add a destination
with a `{ href, keys }` entry in `TARGETS`.

### The Fun page

**Live since 20 Sep 2026.** Eyebrow "Out and about", headline "Parts of my
*life!*", hint "If I were defined by photos...". Fifteen of Leo's own photos,
each with a thin one-line caption in his words, in US spelling (his
"favourite" was converted on request).

- **Photos live in `assets/fun/`**, one file per photo, already resized to
  1600px, recompressed, and stripped of EXIF/GPS. Raw originals never go in
  the repo: Leo drops them in `fun-inbox/` (gitignored) and they are processed
  into `assets/fun/`. The processing script lives outside the repo (Pillow +
  pillow-heif: long side 1600px, JPEG q82, no metadata written) — recreate it
  if needed. The rule that matters: **strip GPS before anything is committed.**
- **Order is by column.** `.fun-grid` is CSS columns, which fill top to bottom,
  so the first five items are the left column, the next five the middle, the
  last five the right. Each column is three `tall` + two `wide` in a scattered
  order so the three end level. Adding or removing a photo means re-balancing
  that arrangement; 15 photos in two columns on a phone leaves the last tile
  alone at the bottom, which is known and accepted.
- **A photo tile may carry a link pill** (`link: { label, href }`), a small red
  pill under the caption. The Calgary photo uses it for the CBC article. CBC
  blocks automated readers, so the article's content was not machine-verified —
  the link resolves (200) and Leo supplied it.
- **People in shots:** the football photo has bystanders blurred; a pro game
  photo and a team softball photo were deliberately dropped (not Leo's shot /
  other people). Ask before adding anyone else's face.
- Chess and Rams link tiles were tried and removed as empty-looking. The
  `link` and `video` tile kinds still render if Leo wants them back.
- The gutters are wide on purpose (`column-gap` up to 72px) and the grid fills
  the same width as the footer cards below it — Leo asked for smaller, airier
  photos and an aligned right edge.

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

(The Fun page is live — see **The Fun page** above.)

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
- **`PLACEHOLDER` rows in `fun` and `lab` are known and deliberate.** Leo
  knows they are publicly visible and chose to leave them. Don't re-raise.
- **`reading` holds real, current news articles** as stand-ins for Leo's own
  picks (economics, sport, AI, AI policy, neuroscience — Sep 2026). Only ever
  add links you have checked resolve; never invent a headline or URL.

## Things to check with Leo before doing

- **Changing the Si-Lab description** (entry `T-04`). It draws on an
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
- **A custom domain.** That is Leo's call, not yours. He has decided to pursue one for the Vercel "Leo.ai" idea, but don't buy it, point DNS, or configure Vercel for him.

## Git

- Small, single-purpose commits. Present tense, no scope prefixes:
  `Add Moss Lab role`, not `feat(content): add role`. Explain the why in the
  body.
- Always `node build.js` before committing a `content.js` or `styles.css`
  change, and include the regenerated HTML in the same commit — otherwise CI
  goes red on the next push.
- `main` is the deploy branch; Pages serves it directly. Ask before pushing.
- CI only runs on the pushed head commit, so when splitting work into
  several commits, rebuild before each one so every commit is self-consistent.

## Where things stand

*Last updated 21 September 2026. Everything below is pushed and live unless it says otherwise.*

**Recently done (20–21 Sep 2026):** the Fun page is back and live — 15 photos,
thin captions, scattered column order, wide gutters, a red "See me on CBC
News!" pill on the Calgary photo; Fun sits right of Contact in the dock and
footer; the "Ask" tab was renamed **Search**; the Home splash got a flashing
scroll cue and two outlined buttons; Projects Teaching cards stack beside the
long ASTU 400E card; Research entries can carry several documents; US spelling
throughout. **Earlier:** research entries and the ASTU 400E Teaching entry now
show a click-through poster/syllabus thumbnail (whole page, small, not
cropped) with a small "Poster"/"Syllabus" tag under it; "Featured Article"
links relabeled and colour-coded (red/navy pills tone-matched to the site's
violet accent); the placeholder "In the lab" section and the Peer Tutor
teaching entry removed; the Featured rail is now click-drag and
wheel-scrollable (it only worked by trackpad/touch swipe before) and reads
most-recent-left; the P-/T-/F- codes across Research, Teaching and Featured
were renumbered so 01 is always the oldest item and the number climbs with
recency, independent of each section's display order. Earlier: real Gmail/Instagram/Chess.com logo files in the social row; Right Now
logos all the same 52px height; UBC crest clipping fixed; inline-SVG
Canadian flag; every outbound link opens in a new tab; About and Principles
rewritten in Leo's words; reading list filled with real current articles;
build made reproducible across Mac and Windows.

**Still open** — none of these are blockers:

- **`cv.html` and `cv.pdf` lag `content.js`.** Run `node build-cv.js`, check
  the diff with Leo, then print `cv.html` to PDF over `cv.pdf`. Ask him which
  is the source of truth first — the real CV may hold things `content.js`
  doesn't.
- **The reading list dates quickly.** The articles are from early September
  2026; refresh them, or drop `reading` from Home's sections, by about
  mid-October.
- **The JHU logo is the stacked lockup.** A horizontal version would read
  better. Dropping one in as `assets/jhu-logo.png` needs no code change.
- **"Leo.ai" (a Vercel-hosted AI search) is planned, not built.** `leo.ai`
  is registered to someone else until 2028; `leochung.ai` and `leojchung.ai`
  showed as unregistered on 21 Sep 2026. It needs a small serverless function
  on Vercel that holds the API key server-side — see `VERCEL-LEO-AI.md` in the
  parent Cowork folder. Until it exists, Search stays a keyword map and the
  "no API key in the client" rule stands.
- **Fun page checks:** light mode and 390px were checked on 21 Sep. The CBC
  article's content was not machine-verified.
- **`404.html` is hand-maintained and outside `check.js`.** Its `<em>` is a
  deliberate violet italic, unlike the rest of the site.
- **Si-Lab (T-04, "Med-Tech Education Research Assistant") wording** still
  needs Dr. Skoretz's sign-off before it changes.
