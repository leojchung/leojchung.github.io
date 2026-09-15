# Notes for Leo

Written overnight, 14 September 2026. Read this first, then open `index.html`.

---

> ## ⚠️ Partly superseded — 15 September 2026
>
> The site was **redesigned on 15 September 2026** to mirror the format of
> `kellieho.framer.ai`, which Leo picked as the target. Flat grey cards in a
> bento grid on a white ground, Inter display type split two-tone, a bottom
> icon dock instead of a top header and a text tab bar. `CLAUDE.md` documents
> the current system and is the file to trust.
>
> **Stale in this document — ignore it:**
> - the whole *Palette* note (deep purple, maroon, gold). Those colours are
>   gone. The palette is now near-monochrome with a blue fill, a darker blue
>   for links, and amber for secondary actions.
> - *Prose voice*'s claim about Source Serif — the site is Inter now.
> - "Ten sections", and any description of the page as a single scroll.
> - *Things I could not do*: the repo is cloned on the Windows PC, it has
>   been pushed to GitHub, and Node is available there.
> - "It is **not published**" — still true of the *site*, but it is now
>   pushed to the private repo.
>
> **Still true and still worth doing:**
> - everything under *Read the CV I generated* — `cv.pdf` is unchanged.
> - **Add a photo.** `meta.portrait` is still `assets/placeholder.svg`, and
>   the new design gives the portrait a much bigger role (large and circular
>   at the foot of the hero card, again in the footer).
> - **Both fact-checks** — the Neuroaesthetics seminar was co-created with
>   Betty Bao under Dr. Steven Barnes, in Winter Term 2 (Jan–Apr 2026), as
>   `ASTU_V 400E-001`. Do not upgrade it to a solo credit.
> - the **Cellular & Molecular Neuroscience vs Neuroscience** discrepancy —
>   now resolved to Cellular & Molecular on the site; make your Neuroarts and
>   LinkedIn profiles agree.
> - *Check the facts I wrote* — STEMCELL, Moss Lab and Si-Lab descriptions
>   are still deliberately vague, and Si-Lab (T-02) still needs Dr. Skoretz's
>   sign-off before the site goes public.
> - **US spelling**, and the note that Home's intro, Principles and the
>   Contact blurb are deliberately casual.
> - the missing **ASTU 400E syllabus**, still the biggest content gap.
> - the **Fun** and **In the lab** placeholders — plus a new one, the
>   **reading list** on Home.

---

## What exists

A complete, working personal website. Ten sections, every fact pulled from
your LinkedIn, responsive down to a 390px phone, light and dark themes, and no
horizontal scroll at any width (I checked by rendering it in a real browser at
1440px and 390px, in both themes).

Every colour passes WCAG AA contrast in both themes, including the small
monospaced labels — I ran the numbers rather than eyeballing it, and darkened
two light-mode tokens that were failing by a hair.

It is **not published**. Nothing is public. The repo has not been pushed
anywhere, because pushing needs your GitHub login and you were asleep.

---

## What you need to do

### 1. Read the CV I generated

`cv.pdf` already exists — I built a second generator, `build-cv.js`, that reads
the *same* `content.js` and emits a print-ready academic CV. Your CV and your
website therefore cannot drift apart, which is the usual way these things go
wrong.

It is a **starting point, not a finished CV.** It runs to three pages, which is
long for an undergraduate but is a fair reflection of your record. Read it
properly before you send it anywhere. Things it does not have, because a website
does not have them either: awards, relevant coursework, a GPA, references.
There is a `CV_EXTRA` block at the bottom of `build-cv.js` with worked examples
for adding those — and the Synergy Trainee Rapid Talks prize is the obvious
first Award entry.

Regenerate with `node build-cv.js`, then Cmd-P → Save as PDF.

### 2. Add a photo

The 2025 academic-website contest judges singled out real photographs as the
thing that made sites feel like a person rather than a template. Put a square
image in `assets/`, then set `meta.portrait: "assets/leo.jpg"` in `content.js`.
It slots in above the record block in the hero.

### 3. Two things I got wrong, and fixed — read this bit

I wrote the first draft from your LinkedIn, then went and checked it against
public sources. Two corrections came out of that, and both mattered:

**The Neuroaesthetics seminar was co-created, not solo.** Every official UBC
source — the Faculty of Arts announcement and the Student Services register of
past Student-Directed Seminars — names **two** coordinators: you and **Betty
Bao**, under faculty sponsor **Dr. Steven Barnes**. My first draft said you
proposed and wrote it, full stop. That is the kind of overclaim a UBC reader
would catch immediately, so the site now says co-created and co-taught, and
names them both.

**The term was Winter Term 2, January to April 2026** — not "2026 Winter
Session," which I had. The official course code as printed is `ASTU_V 400E-001`.

One thing you may not have on your LinkedIn: the SBME write-up says the IBD and
Alzheimer's project took the **top prize for Trainee Rapid Talks** at Synergy.
That is now on the site, in P-03 and in the new Featured section.

One discrepancy for you to settle: your Neuroarts Resource Center profile says
your major is **Cellular & Molecular Neuroscience**; LinkedIn says
**Neuroscience**. The site currently says Neuroscience. Pick one and make them
agree.

### 4. Check the facts I wrote

I pulled everything from LinkedIn, but three descriptions are **mine, not
yours**, and you should read them with an employer's eye before anything goes
public:

- **STEMCELL** — "Product licensing, testing and integration." Straight from
  your profile, but check it does not overshare anything your co-op agreement
  covers.
- **Moss Lab** — "Data analysis and statistics for the Moss Lab, Department of
  Psychological and Brain Sciences." Deliberately vague, since I do not know
  what you are actually allowed to say about the work.
- **Si-Lab (T-02)** — I described it as simulation-based teaching research
  comparing didactic lecture against role-play and high-fidelity simulation.
  That comes from the manuscript, not from LinkedIn. **Confirm Dr. Skoretz is
  comfortable with that being on a public page before you publish**, since the
  paper is unsubmitted.

### 5. Push it

Full instructions are in `README.md` under "Publishing it." The short version:
make a **private** repo named `leojchung.github.io`, push, and flip it public
only when you are happy.

---

## Decisions I made for you

Each of these is a real choice with a real alternative. Change any of them.

**Palette.** Deep purple `#4A2D6E` on cool violet-grey paper in light mode;
midnight blue-violet `#101120` with lavender `#B79BE8` in dark. Maroon
`#8E2F3C` appears in exactly one role — marking a post you currently hold —
and gold in exactly one place, the ◆ on your status line. That restraint is
deliberate: your reference points (Lakers purple-and-gold, Rams blue-and-gold)
share a structure, a deep cool hue plus one warm metallic, and the way to use
that without it reading as team merchandise is to spend the warm colour once.

If you want to push it further toward what you described, Amelia Wattenberger's
periwinkle **`#8179ff`** is the closest thing I found to your stated taste
anywhere. It will not pass contrast on a light background, so it works as a
dark-mode accent only. Swap it into `--accent` inside the two dark blocks in
`styles.css` and see.

**US spelling.** "Behavioral," "remodeling," "analyzing." Your voice-principles
file says to pick one convention per document and hold it, and the Si-Lab
manuscript is US-normalized, so I matched that. If you would rather have
Canadian spelling on your own site — defensible, you are at a Canadian
university — it is one pass:

```bash
cd ~/Downloads/ClaudeCoworkProjects/leojchung.github.io
sed -i '' -e 's/behavioral/behavioural/g' -e 's/Behavioral/Behavioural/g' \
          -e 's/remodeling/remodelling/g' -e 's/analyzing/analysing/g' content.js
node build.js
```

**Prose voice.** Every paragraph was written against your `voice-principles.md`
— sentences in the 20–25 word band, em-dashes rather than semicolons, a gloss
on first use set off by dashes, paragraphs that close forward. One thing that
file flags is worth repeating here: your habit of opening paragraphs with
connectives ("Ultimately," "Together,") is also a well-known fingerprint of
AI-written text. I used it exactly once, in the second About paragraph. That is
a deliberate compromise, and you may want to cut even that one.

**Teaching split out from experience.** You asked for this, and it is the right
call for a second reason: it stops the site reading as a research CV with
teaching appended. Meg Mindlin's site — the 2025 Best Art & Visuals winner —
makes the same argument for art, and it is why the hero now opens
"Scientist · Educator · Art, music & sport" before the headline.

**Service list trimmed.** LinkedIn lists ten volunteering entries. I moved the
five teaching-shaped ones into the Teaching section, which left seven under
Service. Nothing was deleted — it moved.

**A Featured section, built from verified sources.** Four public pages carry
your name — the UBC SBME Synergy write-up, the Faculty of Arts seminar
announcement, the Simons Foundation SURFiN cohort list, and the DMCBH Synergy
highlights. Every one was fetched and confirmed before it went on the page.
Outside institutions vouching for you is worth more than another paragraph you
wrote about yourself.

**The two things you asked for after the first build.**

- **A message form** sits under the contact section. GitHub Pages has no
  server, so a form has to post somewhere — that is a genuine limitation of
  free static hosting, not something I skipped. Formspree is the standard free
  answer: make an account, paste the endpoint into `contact.form.action`, done.
  Until you do, the form renders an "Email me instead" button rather than a
  form that silently swallows messages. There is a honeypot field for spam.
- **A fun section, "Off the clock"**, with three kinds of tile: your photos,
  embedded clips, and link cards. It is switched **on** with placeholders, so
  fill it in or turn it off before publishing.

  On the clips: embed them, do not download them. Putting an NFL highlight or a
  music video as a file in your own repo is republishing someone else's work
  from your own domain, under your real name, on a page you are sending to PIs.
  An embed plays it from the rightsholder's own upload and is unremarkable.
  The section only accepts a YouTube or Vimeo id for exactly this reason.

  The clips are click-to-play — nothing loads from YouTube until a visitor
  clicks. Six autoplaying embeds would make the page slow and would set
  third-party cookies on everyone who scrolled past.

**One section is built but switched off.**

- **Notes** (`on: false`) — a writing section graded by maturity, Essay / Note /
  Seedling, rather than by date. This is the single most useful thing you can
  add as an undergraduate: it gives you a legitimate place to publish
  in-progress thinking. It currently holds three placeholder entries. Write two
  or three real ones, delete the placeholders, flip it on.


---

## Things I could not do

**Copy the repo onto your Mac.** Your laptop went to sleep mid-build, so the
folder never landed in `~/Downloads/ClaudeCoworkProjects/`. The zip in the chat
is the whole thing — unzip it there and everything in this document applies.

**Push to GitHub.** The sandbox that reaches your Mac has `git` but no `gh`, and
no credentials of yours — by design, and correctly so. I would not handle your
GitHub token even if it were sitting there. This is your one manual step.

**Find your Neuroaesthetics syllabus.** Your Mac went to sleep before I could
search it, and there is **no public syllabus or reading list anywhere** — I
looked. The UBC course schedule has moved to Workday behind a login, and the
Student-Directed Seminars list has rolled over to 2026/27, so ASTU 400E is gone
from it. (Be careful with `blogs.ubc.ca/astu400e` — that is a *different*,
earlier seminar on Disorders of Consciousness. The 400E code gets reused.)

This is the single biggest thing still missing. It is the most distinctive item
on the whole site — a three-credit course you co-designed and taught as an
undergraduate — and right now it is described rather than shown. Drop the
syllabus PDF into `assets/` and point me at it, or just uncomment the `links:`
line already sitting in the T-01 entry.

**Publish anything.** You said not to, so I did not.

---

## Where to look for ideas

I opened sixteen personal sites and wrote up what is worth taking from each —
that is the separate **"Sites Worth Stealing From"** page. Four things are worth
your attention before you start editing:

1. **Nicky Case** sorts everything by what a visitor *does* — play, read, watch
   — instead of Projects / Publications / Teaching. For you that maps onto
   interactive explainers, writing, and the seminar. It is the one change that
   would make the site read as scientist *and* educator *and* artist by
   structure rather than by assertion.
2. **Roberta Rosa Valtorta** won the 2025 contest outright with a six-item nav,
   two font weights, charcoal-grey-maroon, and nothing more than one click deep.
   Her palette is about 80% of yours already.
3. **Gwern** and **Lynn Fisher** are what "shades" looks like done properly —
   one hue, five to seven values, hierarchy carried by value rather than colour.
4. **Patrick Manser** has a sixteen-item navigation. Do not do that. A short
   site always reads as more confident than an exhaustive one.

---

## If something breaks

`index.html` is generated. If you hand-edit it and then run `node build.js`, your
edits vanish — that is the one real footgun in this setup. Edit `content.js`,
rebuild, and the HTML is disposable by design.

If the build throws, the error names the section: `No renderer for section "x"`
means you added a key to `sections` without adding a line to `RENDERERS` in
`build.js`, and `content.js has no block named "x"` means the reverse.
