/* ══════════════════════════════════════════════════════════════════════════
   content.js — EVERYTHING ON THE SITE LIVES HERE.
   ══════════════════════════════════════════════════════════════════════════

   This is the only file you normally need to edit.

   After changing anything here, run:      node build.js
   That regenerates index.html. Then commit and push.

   HOW TO ...
   ─────────────────────────────────────────────────────────────────────────
   … add a role              add an object to the right block (copy one)
   … remove a role           delete it, or set  hidden: true
   … reorder a page's sections   reorder that page's `sections` array in `pages`
   … reorder the tabs        reorder the `pages` array at the bottom
   … rename a tab             change its `navLabel` in `pages`
   … add a whole section     see the note at the very bottom of this file
   … change the colours      styles.css, the :root block at the top

   Every entry may carry  hidden: true  to keep it in the file but off the page.
   Dates are free text — write them however you like, nothing is parsed.
   Inside strings you may use <em>italic</em> and <b>highlighted</b>.
   ══════════════════════════════════════════════════════════════════════════ */

module.exports = {

  /* ───────────────────────────── SITE META ───────────────────────────── */
  meta: {
    name:        "Leo J. Chung",
    shortName:   "Leo J. Chung",
    tagline:     "Scientist, teacher, and a Vancouver kid who thinks art, music and sport belong in the same conversation as the lab.",
    description: "Leo J. Chung — scientist and educator at the University of British Columbia. Neuroscience research with the Ciernia Lab, the Moss Lab at Johns Hopkins and UBC's Si-Lab; R&D at STEMCELL Technologies; creator of ASTU 400E, Neuroaesthetics.",

    // ↓ Change this once you know your final URL (README, step 6).
    url:         "https://leojchung.github.io/",

    email:       "leojc815@gmail.com",
    location:    "Vancouver, British Columbia",
    linkedin:    "https://www.linkedin.com/in/leojchung",
    cvFile:      "cv.pdf",       // drop your real CV in at this filename
    lang:        "en",

    // Optional headshot. Put a square image in assets/ and set the path here,
    // e.g. "assets/leo.jpg". Leave null and the hero simply has no photo.
    // The 2025 academic-website contest judges singled out real photographs
    // as the thing that made sites feel like a person — worth adding one.
    portrait:    "assets/placeholder.svg",  // PLACEHOLDER — swap in a real square photo

    // US spelling throughout. NOTES-FOR-LEO.md has the one-command flip
    // to Canadian/British if you'd rather.
  },

  /* ─────────────────────────────── HERO ──────────────────────────────── */
  hero: {
    // An optional one-line self-description under the quote credit.
    // Removed at Leo's request (Sep 2026); set a string to bring it back.
    card: null,

    /* The UBC badge in the hero card: a monogram disc plus the major.

       It is the LETTERS "UBC", deliberately not the university's crest or
       wordmark. UBC's brand policy reserves those for official university
       communications, and a student site carrying the crest can read as
       claiming institutional endorsement — a bad look on a page going to
       PIs and admissions readers, and the sort of thing a university
       communications office does ask people to take down.

       Leo has chosen to supply the official logo file himself (Sep 2026).
       Put it in assets/ and set `logo` to its path, e.g.
       logo: "assets/ubc-logo.svg" — the badge then shows the file instead of
       the letters. If `logo` is unset or the file is missing, the build falls
       back to the letters rather than shipping a broken image.
       Set the whole thing to null to drop the badge. */
    credential: { mark: "UBC", logo: "assets/ubc-logo.png", detail: "Major in Cellular &amp; Molecular Neuroscience" },

    /* The identity line above the headline. Meg Mindlin — who won Best Art &
       Visuals in the 2025 academic-website contest — opens with
       "Scientist. ARTIST. Photographer." and the rest of her site backs the
       claim structurally. This is that move: state the multi-identity first,
       so the site reads as scientist AND educator AND everything else, rather
       than a CV with hobbies appended. Set to null to remove the line. */
    identity: ["Scientist", "Educator", "Art, music &amp; sport"],

    /* The hero headline. <em>…</em> is the GREY half of the sentence — not
       italic. Split it at a clause break, not mid-phrase. */
    headline: "“Sometimes it is the people no one imagines anything of " +
              "<em>who do the things that no one can imagine.”</em>",

    /* ── READ THIS BEFORE CHANGING THE CREDIT ──────────────────────────────
       This line is almost universally attributed to Alan Turing. It is not
       his. It is dialogue from the 2014 film *The Imitation Game*, written
       by Graham Moore, spoken by the Joan Clarke character — there is no
       record of Turing writing or saying it.

       It is credited to the film here on purpose. The site is going to PIs
       and admissions readers, and a misattributed quotation on the front
       page is the kind of error that costs you credibility with exactly
       that audience — the same reason the Neuroaesthetics seminar is
       credited to two coordinators rather than one.

       If you want a real Turing line instead, take one from "Computing
       Machinery and Intelligence" (1950) and cite the paper. Set this to
       null to drop the credit line entirely — but then drop the quotation
       marks too, and don't imply the words are yours. */
    // Credited to the film alone, at Leo's request. It still must not say Turing.
    cite: "<em>The Imitation Game</em> (2014)",

    // <b>…</b> gets a soft maroon highlight. Three or four maximum.
    standfirst:
      "I am a scientist and an educator at <b>UBC</b> — chromatin and the gut–brain axis " +
      "at one end of the work, animal communication at the other. I also teach, design " +
      "curriculum, and spend a great deal of time on art, music and sport, which is less a " +
      "separate life than the reason the research interests me. Currently in R&amp;D at " +
      "<b>STEMCELL Technologies</b> and with the <b>Moss Lab</b> at Johns Hopkins.",

    buttons: [
      { label: "See my projects",  href: "projects.html", solid: true },
      { label: "Curriculum vitae", href: "cv.pdf",         solid: false }
    ],

    // The monospaced record block. Add or remove rows freely.
    // `flag: true` prints the gold ◆ marker before the value.
    record: [
      { k: "Fields",     v: "Neuroscience · education · neuroaesthetics" },
      { k: "Degree",     v: "BSc Cellular &amp; Molecular Neuroscience, UBC — 2028" },
      { k: "Now",          v: "STEMCELL Technologies" },
      // Leo will add to this row.
      { k: "Affiliations", v: "Simons Foundation · DMCBH" },
      { k: "Taught",       v: "ASTU 400E — Neuroaesthetics" },
      { k: "Home",       v: "Vancouver, BC — born and raised" },
      { k: "Status",     v: "Seeking Jan 2027 co-op", flag: true }
    ]
  },

  /* ──────────────────────────── § INTRO ──────────────────────────────── */
  /* Home-page only, rendered right under the hero. Casual/first-person on
     purpose — this is the "hi, it's me" paragraph, not the CV. The fuller,
     formal record of what he's worked on lives on projects.html; the CV
     file has everything else. */
  intro: {
    greeting: "Hi — I'm Leo 👋",
    location: "📍 Vancouver, BC",

    // Answers the "What drives me" card on the Home bento, set as a bold
    // standalone line — so it reads as a sentence, not as the tail of one.
    // Leo's own words: the line recurs across his 2025–26 co-op cover letters
    // ("committed to producing results that others can trust and build upon").
    focus: "Producing results that others can trust and build upon.",

    paragraphs: [
      "I'm a scientist and a teacher at UBC, and most days that means chasing " +
      "questions about the brain that don't fit in one lab: chromatin and " +
      "epigenetics on one end, the gut's surprisingly direct line to the " +
      "brain on the other, and animal communication somewhere in between. " +
      "Different systems, same habit of mind.",

      "What ties it together is measurement — figuring out what's actually " +
      "going on inside from whatever you can honestly record. That's also " +
      "why I care about teaching: I co-created and taught a for-credit UBC " +
      "seminar on the neuroscience of art, because explaining something well " +
      "is usually the fastest way to actually understand it."
    ],

    /* Vancouver's live weather, in the card under "I also like…".
       Coordinates are downtown Vancouver. Fetched in the browser from
       Open-Meteo, which needs no API key and sets no cookie — see the
       note in main.js. Set to null and the card disappears. */
    weather: { label: "Vancouver right now", lat: 49.2827, lon: -123.1207 },

    // Rotates in the "I also like ___" bubble under the paragraphs. Keep it
    // to short phrases — it swaps every couple of seconds.
    likes: [
      "biking",
      "chess",
      "the Lakers",
      "the Rams",
      "a good ramen spot",
      "the Fun page →"
    ],

    /* Icon row with a hover/focus popup. `logo` names an inline SVG mark in
       LOGOS in build.js; `icon` is an emoji fallback for anything without a
       mark. Nothing here needs an icon library or an image request.

       The Gmail and LinkedIn marks are hand-drawn in each brand's real
       palette. Check them against the official logos — if either is off,
       put the official SVG in assets/ and point its LOGOS entry at the
       file instead. */
    social: [
      { logo: "gmail",    label: "Email",             href: "mailto:leojc815@gmail.com" },
      { logo: "linkedin", label: "LinkedIn",          href: "https://www.linkedin.com/in/leojchung" },
      { logo: "neuroarts", label: "Neuroarts profile", href: "https://www.neuroartsresourcecenter.com/profile/leojchung" }
    ]
  },

  /* ─────────────────────────── § FEATURED ────────────────────────────── */
  /* Home page, between the hero bento and Right Now — the same row of cards,
     but each one links out. The items are PICKED from `press` further down
     by idx rather than copied, so each write-up is verified and dated in one
     place only: change the picks here, change the article there.

     Three is the number to keep, for the same reason as Principles. */
  featured: {
    eyebrow: "Featured",
    title: "Featured <em>elsewhere</em>",
    hint:  "Where the work has been written up by someone other than me.",
    action: { label: "All press", href: "projects.html#press-h" },
    from:  "press",
    pick:  ["F-01", "F-02", "F-03"]
  },

  /* ────────────────────────── § RIGHT NOW ────────────────────────────── */
  now: {
    eyebrow: "Currently",
    title: "Right now",
    hint:  "Three things I'm doing at once, across industry, research and education.",
    /* `logo` (optional) puts an organization's mark at the top of its card —
       a transparent PNG in assets/. Leo supplied these (Sep 2026). If any
       card in the row has one, the others keep an empty slot of the same
       height so the text still lines up across the row. */
    items: [
      {
        logo:  "assets/stemcell-logo.png", logoAlt: "STEMCELL Technologies",
        tag:   "Industry",
        role:  "Research &amp; Development Intern",
        org:   "STEMCELL Technologies",
        note:  "R&amp;D internship",
        since: "May 2026 — present · UBC Co-op"
      },
      {
        logo:  "assets/jhu-logo.png", logoAlt: "Johns Hopkins University",
        tag:   "Research",
        role:  "Research Data Analyst",
        org:   "Moss Lab, Johns Hopkins",
        note:  "Psychological &amp; Brain Sciences",
        since: "Jun 2026 — present · Hybrid"
      },
      {
        logo:  "assets/ubc-logo.png", logoAlt: "University of British Columbia",
        tag:   "Education research",
        role:  "Med-Tech Education Research Assistant",
        org:   "Si-Lab, UBC",
        note:  "Audiology &amp; Speech Sciences",
        since: "May 2026 — present · Hybrid"
      }
    ]
  },

  /* ───────────────────────── § PRINCIPLES ─────────────────────────────── */
  /* Home page, under Right Now. Short things — word + one line — the kind of
     block Kellie Ho's site does well.

     THREE is the number to keep. The cards sit in an auto-fitting row, so
     three fill one clean row at desktop width; a fourth wraps to a second
     row on its own, which looks like a mistake. Swap the wording freely,
     but if you add a fourth, hide one of the others. */
  principles: {
    eyebrow: "Principles",
    title: "What I <em>care about</em>",
    hint:  "Three things that show up in everything above.",
    /* Drawn from Leo's own cover letters (2025–26) — each one is a point he
       makes repeatedly there, put back into the casual register. */
    items: [
      { word: "Reproducibility", blurb: "Good science comes from tight execution. I troubleshoot and iterate until an assay works cleanly, not just once." },
      { word: "Clear data",      blurb: "Results only help if people can act on them — I organize and present data so a team can make decisions quickly." },
      { word: "The big picture", blurb: "Careful work upstream is what makes the data downstream mean something. Knowing where my piece fits matters." },

      // Kept, not deleted — flip `hidden` to bring one back and hide another.
      { word: "Curiosity", blurb: "Chromatin, the gut, animal calls — different systems, one habit of mind.", hidden: true },
      { word: "Rigor",     blurb: "Measurement first. If it isn't quantifiable, I don't trust my read of it.", hidden: true },
      { word: "Teaching",  blurb: "I co-created a for-credit course as an undergrad. Explaining something well is understanding it twice.", hidden: true },

      // Kept, not deleted — flip `hidden` to bring it back and hide another.
      { word: "Balance",   blurb: "Biking, chess, the Lakers, the Rams. The lab isn't the whole person.", hidden: true }
    ]
  },

  /* ─────────────────────────── § RESEARCH ────────────────────────────── */
  research: {
    eyebrow: "Experience",
    title: "Research",
    hint:  "Four projects, 2024 — 2026. Ciernia Lab unless noted.",
    action: { label: "Full CV", href: "cv.pdf" },
    items: [
      {
        idx:   "P-01",
        when:  "Aug 2025<br>— May 2026",
        title: "Exploring the role of autism-associated BAF complex variants in social communication in neonatal mice",
        meta:  ["Ciernia Lab, DMCBH", "Simons Foundation SURFiN Fellowship"],
        blurb: "The BAF complex remodels chromatin, and variants in it sit among the most " +
               "strongly autism-associated mutations known. This project asked what those " +
               "variants do to social communication in mouse pups — measured through " +
               "<em>ultrasonic vocalizations</em>, the calls a pup directs at its mother an " +
               "octave above anything a person can hear."
      },
      {
        idx:   "P-02",
        when:  "May 2025<br>— May 2026",
        title: "Neuroaesthetics: Your Brain on Art",
        meta:  ["ASTU 400E", "UBC Centre for Community Engaged Learning"],
        blurb: "A full-credit undergraduate seminar on what happens in the brain when people " +
               "make art, and when they look at it. I co-created and co-taught it with Betty " +
               "Bao, under faculty sponsor Dr. Steven Barnes, and it ran as a Student-Directed " +
               "Seminar in Winter Term 2 — January to April 2026."
      },
      {
        idx:   "P-03",
        when:  "Apr 2025<br>— Sep 2025",
        title: "The role of inflammatory bowel disease in the neurological immune response to the development of Alzheimer's disease pathology in mice",
        meta:  ["Ciernia Lab, DMCBH", "SBME Synergy Summer Studentship"],
        blurb: "Whether chronic gut inflammation changes the brain's immune response as " +
               "Alzheimer's pathology develops — one arm of the lab's broader work on the " +
               "gut–brain axis. The readout was immunohistochemical: staining for microglia, " +
               "the brain's resident immune cells, against amyloid-beta plaques. This work " +
               "took the top prize for Trainee Rapid Talks at UBC's Synergy Undergraduate " +
               "Research Day.",
        links: [{ label: "UBC SBME write-up", href: "https://bme.ubc.ca/student-scientists-shine-at-synergy-undergraduate-research-day/" }]
      },
      {
        idx:   "P-04",
        when:  "Jul 2024<br>— Apr 2025",
        title: "Impact of human IBD microbiota on hypothalamic gene expression and steroid regulation in the mouse brain",
        meta:  ["Ciernia Lab, DMCBH", "SBME Synergy Summer Studentship"],
        blurb: "Human IBD microbiota transplanted into mice, with the readout taken in the " +
               "hypothalamus — which genes shift, and what happens to steroid regulation. " +
               "My first project in the lab."
      }
    ]
  },

  /* ───────────────── § PROFESSIONAL & RESEARCH EXPERIENCE ────────────── */
  /* Two shapes are allowed:
       plain entry  { when, title, meta:[], blurb }
       grouped      { group: "Employer", when, roles: [ {when, title, detail} ] }
     Use `group` when one employer covers several roles.                      */
  experience: {
    title: "Professional &amp; research experience",
    hint:  "Reverse chronological. Teaching lives in its own section below.",
    items: [
      {
        when:  "May 2026<br>— present",
        title: "Research &amp; Development Intern",
        meta:  ["STEMCELL Technologies", "Vancouver, BC", "UBC Co-op"],
        blurb: "Research and development internship, UBC Co-op."
      },
      {
        when:  "Jun 2026<br>— present",
        title: "Research Data Analyst",
        meta:  ["Johns Hopkins University", "Baltimore, MD", "Hybrid"],
        blurb: "Research role with the Moss Lab, Department of Psychological and Brain Sciences."
      },
      {
        when:  "Aug 2025<br>— May 2026",
        title: "Undergraduate Research Fellow in Neuroscience",
        meta:  ["Simons Foundation", "Ciernia Lab, DMCBH"],
        blurb: "Shenoy Undergraduate Research Fellowship in Neuroscience (SURFiN)."
      },
      {
        when:  "Jun 2024<br>— May 2026",
        title: "Undergraduate Researcher",
        meta:  ["Djavad Mowafaghian Centre for Brain Health", "Ciernia Lab"],
        blurb: "Supported by the School of Biomedical Engineering Synergy Summer Studentship " +
               "and the UBC Work Learn Program; the post transitioned into the Simons " +
               "Foundation fellowship above."
      },
      {
        when:  "Jun 2021<br>— Jun 2025",
        title: "Handyman Mechanic",
        meta:  ["Handyman Services", "South Vancouver"]
      },
      {
        group: "University of Washington — Housing &amp; Food Services",
        when:  "2023 — 2024",
        roles: [
          {
            when:   "Sep 2023 —<br>Jun 2024",
            title:  "Community Advisory Board Member",
            detail: "Housing &amp; Food Services · UW Seattle"
          },
          {
            when:   "Sep 2023 —<br>Mar 2024",
            title:  "Concession Worker",
            detail: "Frost Bite · UW Seattle · On-call"
          }
        ]
      },
      {
        when:  "Mar 2021<br>— Oct 2021",
        title: "Pharmacy Assistant",
        meta:  ["Shoppers Drug Mart", "South Vancouver"]
      }
    ]
  },

  /* ───────────────────── § TEACHING & EDUCATION ──────────────────────── */
  /* Same renderer as experience — copy an entry to add one.                */
  teaching: {
    eyebrow: "Classroom",
    title: "Teaching &amp; <em>education</em>",
    hint:  "Courses taught, education research, adjudication and mentorship.",
    items: [
      {
        idx:   "T-01",
        when:  "Jul 2025<br>— May 2026",
        title: "Co-creator &amp; instructor — ASTU_V 400E, Neuroaesthetics: Your Brain on Art",
        meta:  ["UBC Centre for Community Engaged Learning", "Student-Directed Seminar"],
        blurb: "Co-proposed with Betty Bao under faculty sponsor Dr. Steven Barnes, and taught " +
               "for credit in Winter Term 2 of 2025/26. UBC's Student-Directed Seminars let " +
               "undergraduates design and lead a three-credit course on a subject the " +
               "university does not otherwise offer — so the syllabus, the reading list and " +
               "the teaching were all ours to build. The course asked what makes something " +
               "beautiful, and how the brain perceives and responds to art."
        // ← Drop your syllabus into assets/ and add a line here, e.g.:
        //   links: [{ label: "Syllabus (PDF)", href: "assets/astu400e-syllabus.pdf" }]
      },
      {
        idx:   "T-02",
        when:  "May 2026<br>— present",
        title: "Med-Tech Education Research Assistant",
        meta:  ["Si-Lab", "UBC School of Audiology &amp; Speech Sciences"],
        blurb: "Education research with the Si-Lab, UBC School of Audiology &amp; Speech Sciences."
      },
      {
        idx:   "T-03",
        when:  "Feb 2026<br>— Mar 2026",
        title: "Research Adjudicator — Multidisciplinary Undergraduate Research Conference",
        meta:  ["UBC Centre for Community Engaged Learning"],
        blurb: "Judged undergraduate research presentations across disciplines."
      },
      {
        idx:   "T-04",
        when:  "Oct 2024<br>— Apr 2025",
        title: "Research Adjudicator &amp; Mentor",
        meta:  ["International Youth Neuroscience Association"],
        blurb: "Reviewed student research and mentored high-school and early-undergraduate " +
               "students on getting started in neuroscience."
      },
      {
        idx:   "T-05",
        when:  "Mar 2021<br>— Aug 2023",
        title: "Peer Tutor",
        meta:  ["Youth Initiative Vancouver"],
        blurb: "Two and a half years of one-to-one tutoring."
      }
    ]
  },

  /* ───────────────────────── § IN THE LAB ─────────────────────────────── */
  /* Projects page. Same item shape and renderer as `fun` — kind: "photo",
     candid lab shots, not staged. */
  lab: {
    eyebrow: "Photos",
    title: "In the <em>lab</em>",
    hint:  "Candid, not staged.",
    items: [
      { kind: "photo", src: "assets/placeholder.svg", title: "PLACEHOLDER — At the bench", caption: "PLACEHOLDER — swap for a real lab photo" },
      { kind: "photo", src: "assets/placeholder.svg", title: "PLACEHOLDER — Poster session", caption: "PLACEHOLDER — swap for a real lab photo" },
      { kind: "photo", src: "assets/placeholder.svg", title: "PLACEHOLDER — Whiteboard, mid-argument", caption: "PLACEHOLDER — swap for a real lab photo" }
    ]
  },

  /* ────────────────────────── § EDUCATION ────────────────────────────── */
  education: {
    title: "Education",
    hint:  "Chips list programs and societies, not coursework.",
    items: [
      {
        when:   "Sep 2024<br>— May 2028",
        school: "The University of British Columbia",
        degree: "BSc — Cellular &amp; Molecular Neuroscience",
        chips: [
          "Undergraduate Program in Neuroscience",
          "Djavad Mowafaghian Centre for Brain Health",
          "Simons Foundation Neuroscience",
          "FoM Audiology &amp; Speech Sciences",
          "Student-Directed Seminars",
          "UBC Co-op Program",
          "Neuroscience Association",
          "Science Undergraduate Society",
          "Brain and Music"
        ]
      },
      {
        when:   "Sep 2023<br>— Jun 2024",
        school: "University of Washington",
        degree: "BSc — Neurobiology &amp; Neurosciences",
        chips: [
          "Grey Matters",
          "Housing &amp; Food Services",
          "Vietnamese Student Association",
          "Husky Frostbite",
          "Washington Chess"
        ]
      },
      {
        when:   "2018<br>— 2023",
        school: "St. George's School",
        degree: "High School Diploma — Honours with Distinction",
        chips:  []
      }
    ]
  },

  /* ──────────────────── § SERVICE & LEADERSHIP ───────────────────────── */
  /* `live: true` prints the year in maroon, meaning "currently held". */
  service: {
    title: "Service &amp; leadership",
    hint:  "Maroon dates mark currently held posts.",
    items: [
      { role: "DMCBH Trainee Committee Representative",            org: "Vancouver Coastal Health Research Institute", yr: "2025 —",   live: true },
      { role: "Abdul Ladha Science Centre Supervisor",             org: "Science Undergraduate Society, UBC",           yr: "2026 —",   live: true },
      { role: "Child Care Emergency Department Worker",            org: "BC Children's Hospital, Vancouver",            yr: "2024 —",   live: true },
      { role: "Academic Portfolio Director",                       org: "UBC Neuroscience Association",                 yr: "2025 – 26" },
      { role: "Career &amp; Professional Development Coordinator", org: "Science Undergraduate Society, UBC",           yr: "2025 – 26" },
      { role: "Academic Committee Member",                         org: "UBC Neuroscience Association",                 yr: "2024 – 25" },
      { role: "Web Content Producer",                              org: "VCBC JCKidz",                                  yr: "2020 – 23" }
    ]
  },

  /* ───────────────────── § SKILLS & TRAINING ─────────────────────────── */
  /* `cert: true` outlines the chip in purple — use it only for things you
     actually hold a certificate for.                                        */
  skills: {
    title: "Skills &amp; training",
    hint:  "Outlined entries are formally certified.",
    note:  "Formal certification on file.",

    /* The Home page "trained in" card reads these two. Every chip in its
       bleeding row comes from `groups` below, so the card cannot claim a
       skill the CV does not also list. Remove `headline` and the card
       disappears from the Home bento. */
    label:    "Trained in",

    /* The bullet list under that card's headline: broad areas, each with
       what it covers. Drawn from the skills list Leo keeps alongside his
       cover letters, plus the certified items in `groups`. Home page only —
       the CV does not read this. */
    areas: [
      { t: "Molecular biology",         d: "RT-qPCR, PCR &amp; genotyping, RNA &amp; DNA extraction, cDNA synthesis" },
      { t: "Cell &amp; tissue methods", d: "Cell culture, primary cell isolation, immunostaining, tissue sectioning" },
      { t: "Imaging",                   d: "Confocal microscopy, tissue slide imaging, ImageJ &amp; Fiji" },
      { t: "Data &amp; statistics",     d: "R, comparative testing, correlation and regression" },
      { t: "Animal research",           d: "Mouse handling, CCAC rodent ethics, behavioral assays" },
      { t: "Lab safety",                d: "Biosafety, chemical safety, hazardous waste" },
      { t: "Science communication",     d: "Posters and oral talks at conferences" },
      { t: "Teaching",                  d: "Curriculum design and mentorship" }
    ],
    headline: "Bench work, animal research, and <em>the classroom.</em>",
    groups: [
      {
        name: "Bench &amp; imaging",
        items: [
          { t: "Organoids" },
          { t: "Confocal microscopy" },
          { t: "Molecular biology" },
          { t: "Wet chemistry" }
        ]
      },
      {
        name: "Animal research",
        items: [
          { t: "Mouse handling",                cert: true },
          { t: "CCAC laboratory rodent ethics", cert: true },
          { t: "Behavioral assays" }
        ]
      },
      {
        name: "Safety &amp; compliance",
        items: [
          { t: "Biosafety permit",           cert: true },
          { t: "Chemical safety",            cert: true },
          { t: "Hazardous waste management", cert: true },
          { t: "Food safety — CP-FS",        cert: true }
        ]
      },
      {
        name: "Research practice",
        items: [
          { t: "Research ethics" },
          { t: "Project planning" },
          { t: "Data cleaning &amp; merging" },
          { t: "Scientific writing" }
        ]
      },
      {
        name: "Teaching &amp; outreach",
        items: [
          { t: "Curriculum design" },
          { t: "Community outreach" },
          { t: "Event planning" },
          { t: "Mentorship" }
        ]
      },
      {
        name: "Working with people",
        items: [
          { t: "Collaborative leadership" },
          { t: "Project management" },
          { t: "Teamwork" },
          { t: "Customer experience" }
        ]
      }
    ]
  },

  /* ──────────────────────── § FEATURED & PRESS ───────────────────────── */
  /* Every link here was fetched and verified on 14 September 2026. These are
     the four public pages that carry your name. Having outside institutions
     vouch for you is worth more on a personal site than another self-written
     paragraph — Craig Mod separates "published elsewhere" from "written here"
     for exactly this reason.                                                 */
  press: {
    eyebrow: "Elsewhere",
    title: "Featured",
    hint:  "Where the work has been written up by someone other than me.",
    items: [
      {
        idx:   "F-01",
        when:  "Sep 2025",
        title: "Student Scientists Shine at Synergy Undergraduate Research Day",
        meta:  ["UBC School of Biomedical Engineering"],
        blurb: "Coverage of the Synergy summer studentship, where the IBD and Alzheimer's " +
               "project took the top prize for Trainee Rapid Talks.",
        links: [{ label: "bme.ubc.ca", href: "https://bme.ubc.ca/student-scientists-shine-at-synergy-undergraduate-research-day/" }]
      },
      {
        idx:   "F-02",
        when:  "Nov 2025",
        title: "7 New Student Directed Seminars in Arts",
        meta:  ["UBC Faculty of Arts"],
        blurb: "The Faculty of Arts announcement of the seminars approved for 2025/26, " +
               "including Neuroaesthetics: Your Brain on Art.",
        links: [{ label: "arts.ubc.ca", href: "https://www.arts.ubc.ca/news/7-new-student-directed-seminars-in-arts/" }]
      },
      {
        idx:   "F-03",
        when:  "Sep 2025",
        title: "Simons Foundation Announces Latest Class of SURFiN Fellows",
        meta:  ["Simons Foundation", "2025–26 cohort, 84 fellows"],
        blurb: "The Shenoy Undergraduate Research Fellowship in Neuroscience, named in memory " +
               "of the neuroscientist Krishna Shenoy.",
        links: [{ label: "simonsfoundation.org", href: "https://www.simonsfoundation.org/2025/09/29/simons-foundation-announces-latest-class-of-surfin-fellows/" }]
      },
      {
        idx:   "F-04",
        when:  "Sep 2025",
        title: "SBME Synergy 2025 Undergraduate Summer Research Highlights",
        meta:  ["Djavad Mowafaghian Centre for Brain Health"],
        blurb: "A second write-up of the Synergy cohort, from the centre where the Ciernia Lab sits.",
        links: [{ label: "centreforbrainhealth.ca", href: "https://www.centreforbrainhealth.ca/news/sbme-synergy-2025-undergraduate-summer-research-highlights/" }]
      }
    ]
  },

  /* ──────────────────── § NOTES / LAB NOTEBOOK ───────────────────────── */
  /* Currently OFF. Switch it on in `sections` once you have written two or
     three things — an empty writing section is worse than none.

     Why this section exists: two of the best academic sites solve the same
     problem you have. Maggie Appleton grades her writing by maturity — Essays,
     Notes, Patterns, Smidgeons — rather than by date, and Madeline Eppley puts
     a "Lab Notebook" in her top-level nav. Both give an early-career person a
     legitimate place to publish in-progress thinking without pretending it is
     a paper. `idx` is the maturity tier; keep it to three or four labels.

     Each item can carry links: [{ label, href }] pointing at a PDF in assets/
     or anywhere else.                                                        */
  notes: {
    eyebrow: "Writing",
    title: "Notes",
    hint:  "Graded by how finished it is, not by date. Seedlings are thinking out loud.",
    items: [
      {
        idx:   "ESSAY",
        when:  "—",
        title: "Replace this with something you have actually written",
        meta:  ["Delete this entry once you have a real one"],
        blurb: "Finished pieces go at the top. An essay is something you would " +
               "be happy for a PI to read cold."
      },
      {
        idx:   "NOTE",
        when:  "—",
        title: "A worked-through idea that is not a full essay",
        meta:  ["Example entry"],
        blurb: "Notes are for a single argument or a paper you read closely — " +
               "a few hundred words, complete in itself."
      },
      {
        idx:   "SEEDLING",
        when:  "—",
        title: "Something you are still turning over",
        meta:  ["Example entry"],
        blurb: "Seedlings are explicitly unfinished, and labelling them that way " +
               "is what makes it safe to publish them."
      }
    ]
  },

  /* ──────────────────────── § READING LIST ───────────────────────────── */
  /* Home page. A plain divided list of things worth reading — the "what
     I've been consuming lately" card. Deliberately the cheapest section on
     the site to keep current: a title and a URL, no blurb to write.

     `href` is optional. Leave it off and the row renders as plain text.

     THESE ARE PLACEHOLDERS. Swap in five things you have actually read —
     papers, essays, a lecture — and delete the rest. A stale reading list
     is worse than none, so if you will not keep it fresh, remove "reading"
     from the Home page's `sections` array at the bottom of this file. */
  reading: {
    eyebrow: "Content",
    title:   "What I've been <em>reading lately…</em>",
    items: [
      { title: "PLACEHOLDER — a paper you actually read this month", href: null },
      { title: "PLACEHOLDER — a review that changed how you think about the gut–brain axis", href: null },
      { title: "PLACEHOLDER — something on chromatin or the BAF complex", href: null },
      { title: "PLACEHOLDER — an essay about teaching or science communication", href: null },
      { title: "PLACEHOLDER — something entirely unrelated to neuroscience", href: null }
    ]
  },

  /* ───────────────────────────── § FUN ───────────────────────────────── */
  /* ON, at fun.html — but every item is still a placeholder. Fill them in
     or drop "fun" from that page's `sections` before the site goes public.

     THREE KINDS OF ITEM. Set `kind` on each one:

       kind: "photo"  — your own photo.  src: "assets/whatever.jpg"
       kind: "video"  — an EMBED.        youtube: "<the id>"   or  vimeo: "<id>"
       kind: "link"   — anything else.   href: "https://..."

     ── READ THIS BEFORE ADDING CLIPS ──────────────────────────────────────
     Do NOT download game highlights or music videos and put the files in
     assets/. That is republishing someone else's copyrighted work from your
     own domain, under your real name, on a site you are sending to PIs and
     recruiters. Embedding is different and is fine: an embed plays the clip
     from the rightsholder's own upload, on their terms, with their ads. So
     use kind: "video" with a YouTube id, never a downloaded .mp4.

     Your own food photos, your own bike photos, your own lab photos — those
     are yours, put them in assets/ and use kind: "photo".

     Videos use a click-to-play poster: nothing loads from YouTube until a
     visitor actually clicks. That keeps the page fast and stops YouTube
     setting cookies on everyone who scrolls past. Leave `poster` unset and
     it falls back to YouTube's own thumbnail; set it to a local image if you
     would rather nothing at all is requested until the click.

     The YouTube id is the part after "v=" in a watch URL:
       https://www.youtube.com/watch?v=dQw4w9WgXcQ   →   "dQw4w9WgXcQ"
     ──────────────────────────────────────────────────────────────────── */
  fun: {
    eyebrow: "Off the clock",
    title: "Not the <em>lab</em>",
    hint:  "Photos are mine. Clips are embedded from the original uploads.",
    items: [
      {
        kind: "video",
        youtube: "jNQXAC9IVRw",             // PLACEHOLDER id — swap for the real clip
        title: "PLACEHOLDER — A Rams game I will not shut up about",
        caption: "PLACEHOLDER — replace with the clip you actually mean."
      },
      {
        kind: "video",
        youtube: "jNQXAC9IVRw",
        title: "PLACEHOLDER — Lakers",
        caption: "PLACEHOLDER — embed, do not download."
      },
      {
        kind: "photo",
        src: "assets/placeholder.svg",       // PLACEHOLDER — swap for e.g. "assets/ramen.jpg"
        title: "PLACEHOLDER — Food",
        caption: "PLACEHOLDER — somewhere in Vancouver. Your photo, your caption."
      },
      {
        kind: "photo",
        src: "assets/placeholder.svg",
        title: "PLACEHOLDER — On a bike",
        caption: "PLACEHOLDER — a route worth the climb."
      },
      {
        kind: "video",
        youtube: "jNQXAC9IVRw",
        title: "PLACEHOLDER — Something I have had on repeat",
        caption: "PLACEHOLDER — music goes here."
      },
      {
        kind: "link",
        href: "https://example.com",         // PLACEHOLDER — anything: a playlist, an article
        title: "PLACEHOLDER — What I am listening to",
        caption: "PLACEHOLDER — a link card, for things that are not a photo or a clip."
      }
    ]
  },

  /* ─────────────────────────── § CONTACT ─────────────────────────────── */
  contact: {
    eyebrow: "Let's talk",
    title: "Get in <em>touch.</em>",
    blurb: "I'm looking for a co-op or internship for January 2027, in biotech, pharma, or the " +
           "life sciences. Reach out if you're working on chromatin, the gut–brain axis, animal " +
           "communication, or science education — or if you're a student trying to figure out " +
           "how to get into a lab. Happy to talk.",
    links: [
      { k: "Email",     label: "leojc815@gmail.com",          href: "mailto:leojc815@gmail.com" },
      { k: "Phone",     label: "(778) 980-8436",              href: "tel:+17789808436" },
      { k: "LinkedIn",  label: "linkedin.com/in/leojchung",   href: "https://www.linkedin.com/in/leojchung", me: true },
      { k: "Neuroarts", label: "neuroartsresourcecenter.com", href: "https://www.neuroartsresourcecenter.com/profile/leojchung", me: true },
      { k: "Located",   label: "Vancouver, British Columbia", href: null }
    ],

    /* ── THE MESSAGE FORM ──────────────────────────────────────────────────
       GitHub Pages serves files and nothing else — there is no server of
       yours to receive a form, so a form needs somewhere to POST to. The
       standard free answer is Formspree.

       SETUP (about three minutes, and you do it, not me):
         1. Go to formspree.io and make a free account with leojc815@gmail.com
         2. Create a new form. It gives you an endpoint like
            https://formspree.io/f/abcdwxyz
         3. Paste that whole URL into `action` below
         4. node build.js

       The endpoint is not a secret — it sits in the page source of every site
       that uses one. It is a mailbox address, not a password.

       Leave `action` empty and the form renders as a plain mailto: link
       instead, which needs no account and no third party but opens the
       visitor's own email app. Less slick, zero dependencies.

       The free tier is around 50 messages a month, which is more than a
       personal site gets. Messages pass through Formspree's servers before
       reaching your inbox — fine for "nice site, can we talk", not the place
       for anything confidential. The note under the form says so.        */
    form: {
      on: true,
      action: "",                       // ← your Formspree endpoint goes here
      heading: "Send me a message",
      note: "Messages are delivered through Formspree. For anything sensitive, email me directly.",
      button: "Send",
      fields: {
        name:    "Your name",
        email:   "Your email",
        message: "Message"
      }
    }
  },

  /* ══════════════════════════════════════════════════════════════════════
     PAGES — one HTML file each, linked from the tab bar

     Each page lists which content blocks render on it, top to bottom.
     `intro` (Home only) and `hero`/`contact` (their own pages) are handled
     directly by build.js and are not listed here.

     The bottom dock is built from this array's order — reorder pages here
     to reorder it. `navLabel` names the page (shown on hover, and read out
     by a screen reader); `icon` names a glyph in ICONS in build.js.
     ══════════════════════════════════════════════════════════════════════ */
  pages: [
    { key: "home",     file: "index.html",    navLabel: "Home",     icon: "home",
      sections: ["featured", "now", "principles", "reading"] },
    { key: "projects", file: "projects.html", navLabel: "My Works", icon: "folder",
      description: "Research and teaching by Leo J. Chung — chromatin and the BAF complex, the gut–brain axis, animal communication, and the Neuroaesthetics seminar he co-created at UBC.",
      sections: ["research", "teaching", "lab", "press"] },
    { key: "fun",      file: "fun.html",      navLabel: "Fun",      icon: "spark",
      description: "Photos and clips of Leo J. Chung off the clock — biking, chess, the Lakers, the Rams, and Vancouver food.",
      sections: ["fun"] },
    { key: "contact",  file: "contact.html",  navLabel: "Contact",  icon: "mail",
      description: "Get in touch with Leo J. Chung — looking for a co-op or internship for January 2027 in biotech, pharma, or the life sciences.",
      sections: ["contact"] }

    /* ADDING A NEW SECTION TO AN EXISTING PAGE
       ───────────────────────────────────────────────────────────────────
       Renderers available, by the shape of the data they expect:

         now         card row      (tag / role / org / note / since)
         featured    card row      (picks items from another entry-list block by idx)
         principles  word grid     (word / blurb)
         research    entry list    (idx / when / title / meta[] / blurb)
         teaching    entry list    (same)
         lab         media grid    (kind: photo | video | link — same as fun)
         press       entry list    (same as research)
         fun         media grid    (kind: photo | video | link)
         contact     contact block

       Add the block above, add its key to the right page's `sections`
       array, and add one line to RENDERERS in build.js.

       ADDING A WHOLE NEW PAGE
       ───────────────────────────────────────────────────────────────────
       Add an entry to this array with a new `file`, then teach build.js's
       page loop what (if anything) is special about it — most pages need
       nothing beyond the generic section loop.

       Note: `experience`, `education`, `service`, `skills` still exist as
       data blocks further up this file, but nothing on the website reads
       them any more — only build-cv.js does, for the CV PDF. Edit them
       there for the CV; they no longer need to agree with anything on the
       site.
    */
  ]
};
