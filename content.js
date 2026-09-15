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
   … reorder sections        reorder the `sections` array at the bottom
   … turn a section off      set its `on` to false in `sections`
   … rename a section        change its `title` — the nav follows automatically
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
    portrait:    null,

    // US spelling throughout. NOTES-FOR-LEO.md has the one-command flip
    // to Canadian/British if you'd rather.
  },

  /* ─────────────────────────────── HERO ──────────────────────────────── */
  hero: {
    /* The identity line above the headline. Meg Mindlin — who won Best Art &
       Visuals in the 2025 academic-website contest — opens with
       "Scientist. ARTIST. Photographer." and the rest of her site backs the
       claim structurally. This is that move: state the multi-identity first,
       so the site reads as scientist AND educator AND everything else, rather
       than a CV with hobbies appended. Set to null to remove the line. */
    identity: ["Scientist", "Educator", "Art, music &amp; sport"],

    // <em>…</em> renders italic in purple. Use it on one phrase, not more.
    headline: "Some of the most interesting things a brain does happen <em>outside the lab.</em>",

    // <b>…</b> gets a soft maroon highlight. Three or four maximum.
    standfirst:
      "I am a scientist and an educator at <b>UBC</b> — chromatin and the gut–brain axis " +
      "at one end of the work, animal communication at the other. I also teach, design " +
      "curriculum, and spend a great deal of time on art, music and sport, which is less a " +
      "separate life than the reason the research interests me. Currently in R&amp;D at " +
      "<b>STEMCELL Technologies</b> and analyzing data for the <b>Moss Lab</b> at Johns Hopkins.",

    buttons: [
      { label: "See the work",     href: "#research", solid: true },
      { label: "Curriculum vitae", href: "cv.pdf",    solid: false }
    ],

    // The monospaced record block. Add or remove rows freely.
    // `flag: true` prints the gold ◆ marker before the value.
    record: [
      { k: "Fields",     v: "Neuroscience · education · neuroaesthetics" },
      { k: "Degree",     v: "BSc Cellular &amp; Molecular Neuroscience, UBC — 2028" },
      { k: "Labs",       v: "Ciernia · Moss · Si-Lab" },
      { k: "Industry",   v: "STEMCELL Technologies" },
      { k: "Fellowship", v: "Simons Foundation — SURFiN" },
      { k: "Teaches",    v: "ASTU 400E — Neuroaesthetics" },
      { k: "Home",       v: "Vancouver, BC — born and raised" },
      { k: "Status",     v: "Seeking Jan 2027 co-op", flag: true }
    ]
  },

  /* ────────────────────────── § RIGHT NOW ────────────────────────────── */
  now: {
    title: "Right now",
    hint:  "Three concurrent posts across industry, research and education.",
    items: [
      {
        tag:   "Industry",
        role:  "Research &amp; Development Intern",
        org:   "STEMCELL Technologies",
        note:  "Product licensing, testing &amp; integration",
        since: "May 2026 — present · UBC Co-op"
      },
      {
        tag:   "Research",
        role:  "Research Data Analyst",
        org:   "Moss Lab, Johns Hopkins",
        note:  "Psychological &amp; Brain Sciences",
        since: "Jun 2026 — present · Hybrid"
      },
      {
        tag:   "Education research",
        role:  "Med-Tech Education Research Assistant",
        org:   "Si-Lab, UBC",
        note:  "Audiology &amp; Speech Sciences",
        since: "May 2026 — present · Hybrid"
      }
    ]
  },

  /* ──────────────────────────── § ABOUT ──────────────────────────────── */
  about: {
    title: "About me",
    hint:  "Where the science, the teaching and everything else meet.",
    paragraphs: [
      "I am a scientist first and a neuroscientist second, and the distinction matters to me. " +
      "The questions I have chased so far run from chromatin remodeling and epigenetics — the " +
      "machinery deciding which genes a cell can reach — through the gut's surprisingly direct " +
      "influence on the brain, and out to animal communication. Different systems, one habit " +
      "of mind.",

      "Ultimately all of it converges on measurement. Much of science depends on inferring an " +
      "internal state from something recordable, and the interesting work usually sits in the " +
      "gap between the two. A mouse pup's ultrasonic call and a bat's echolocation are both " +
      "inaudible to us — and both are, handled properly, quantitative behavioral data.",

      "Teaching matters to me just as much as the bench. I co-created and taught <em>ASTU 400E " +
      "— Neuroaesthetics: Your Brain on Art</em> as a student-directed seminar at UBC, I " +
      "adjudicate undergraduate research, and I sit on the trainee committee at the Djavad " +
      "Mowafaghian Centre for Brain Health. Explaining something well is its own form of " +
      "understanding it.",

      "Art and music are not a hobby I keep at arm's length from the work — a course on what " +
      "the brain does in front of a painting is, after all, a neuroscience course. Outside all " +
      "of that I am a Vancouver kid, born and raised: biking, chess, most ball sports, and a " +
      "durable commitment to the Lakers and the Rams."
    ]
  },

  /* ─────────────────────────── § RESEARCH ────────────────────────────── */
  research: {
    title: "Research",
    hint:  "Four projects, 2024 — 2026. Ciernia Lab unless noted.",
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
        blurb: "Product licensing, testing and integration."
      },
      {
        when:  "Jun 2026<br>— present",
        title: "Research Data Analyst",
        meta:  ["Johns Hopkins University", "Baltimore, MD", "Hybrid"],
        blurb: "Data analysis and statistics for the Moss Lab, Department of Psychological and Brain Sciences."
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
    title: "Teaching &amp; education",
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
        blurb: "Research on how simulation-based teaching changes what clinical students know " +
               "and how confident they feel — didactic lecture against role-play and " +
               "high-fidelity simulation."
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

  /* ───────────────────────────── § FUN ───────────────────────────────── */
  /* Currently OFF — flip it on in `sections` once you have real items.

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
    title: "Off the clock",
    hint:  "Photos are mine. Clips are embedded from the original uploads.",
    items: [
      {
        kind: "video",
        youtube: "",                       // ← paste a YouTube id
        title: "A Rams game I will not shut up about",
        caption: "Replace this with the clip you actually mean."
      },
      {
        kind: "video",
        youtube: "",
        title: "Lakers",
        caption: "Same — embed, do not download."
      },
      {
        kind: "photo",
        src: null,                          // ← "assets/ramen.jpg"
        title: "Food",
        caption: "Somewhere in Vancouver. Your photo, your caption."
      },
      {
        kind: "photo",
        src: null,
        title: "On a bike",
        caption: "A route worth the climb."
      },
      {
        kind: "video",
        youtube: "",
        title: "Something I have had on repeat",
        caption: "Music goes here."
      },
      {
        kind: "link",
        href: "https://open.spotify.com/",  // ← anything: a playlist, an article
        title: "What I am listening to",
        caption: "A link card, for things that are not a photo or a clip."
      }
    ]
  },

  /* ─────────────────────────── § CONTACT ─────────────────────────────── */
  contact: {
    title: "Get in <em>touch.</em>",
    blurb: "I am looking for a January 2027 co-op or internship in biotech, pharma, or the " +
           "life sciences. I would be glad to hear from anyone working on chromatin, the " +
           "gut–brain axis, animal communication, or science education — and from students " +
           "who want to talk about getting into a lab.",
    links: [
      { k: "Email",     label: "leojc815@gmail.com",          href: "mailto:leojc815@gmail.com" },
      { k: "LinkedIn",  label: "linkedin.com/in/leojchung",   href: "https://www.linkedin.com/in/leojchung", me: true },
      { k: "Neuroarts", label: "neuroartsresourcecenter.com", href: "https://www.neuroartsresourcecenter.com/profile/leojchung", me: true },
      { k: "CV",        label: "Download PDF",                href: "cv.pdf" },
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
     SECTION ORDER AND VISIBILITY

     Reorder these lines to reorder the page. Set `on: false` to hide one
     without deleting anything. The § numbers renumber themselves, and the
     nav bar rebuilds itself from whatever has `nav: true`.
     ══════════════════════════════════════════════════════════════════════ */
  sections: [
    { key: "now",        on: true,  nav: false, id: null },
    { key: "about",      on: true,  nav: true,  id: "about",      navLabel: "About"      },
    { key: "research",   on: true,  nav: true,  id: "research",   navLabel: "Research"   },
    { key: "experience", on: true,  nav: true,  id: "experience", navLabel: "Experience" },
    { key: "teaching",   on: true,  nav: true,  id: "teaching",   navLabel: "Teaching"   },
    { key: "education",  on: true,  nav: true,  id: "education",  navLabel: "Education"  },
    { key: "press",      on: true,  nav: false, id: "press"       },
    { key: "service",    on: true,  nav: false, id: "service"     },
    { key: "skills",     on: true,  nav: false, id: "skills"      },
    { key: "notes",      on: false, nav: true,  id: "notes",      navLabel: "Notes" },
    { key: "fun",        on: true,  nav: true,  id: "fun",        navLabel: "Fun" },
    { key: "contact",    on: true,  nav: true,  id: "contact",    navLabel: "Contact"    }

    /* ADDING A NEW SECTION
       ───────────────────────────────────────────────────────────────────
       Renderers available, by the shape of the data they expect:

         now         card row      (tag / role / org / note / since)
         about       prose         (paragraphs: [])
         research    entry list    (idx / when / title / meta[] / blurb)
         experience  entry list    (same, plus grouped employers)
         teaching    entry list    (same)
         education   school list   (when / school / degree / chips[])
         service     two-col list  (role / org / yr / live)
         skills      chip groups   (name / items[])
         fun         media grid    (kind: photo | video | link)
         contact     contact block

       To add, say, a Publications section: copy the `research` block above,
       rename it `publications`, add
         { key: "publications", on: true, nav: true, id: "publications", navLabel: "Writing" }
       to this list, and add one line to RENDERERS in build.js:
         publications: renderEntries
       Three lines of work. build.js marks the exact spot.
    */
  ]
};
