# LifeHub Risers — Riser's Quest

A self-paced, pictorial, interactive quest built for LifeHub Risers, covering:

**Part 1 — Missions 1 & 2**
1. 🛡️ Dodge the Tricksters (passwords, tricky messages, strangers, malware, privacy)
2. 🔍 Become a Search Wizard (search tricks, filters, reading results, quick answers)

**Part 2 — Missions 3–5 & the Final Boss**
3. 💡 Go Full Detective (a research toolkit, what to avoid, what not to skip)
4. ✅ Busted or Trusted? (the CRAAP test, checking sideways, spot-the-difference examples)
5. 📖 Crack the Vault (how to use a trusted encyclopedia well, and why to still double-check)
6. 🏆 The Final Boss Challenge — a rigorous 20-question assessment, written fresh (not
   copies of the mission checkpoint questions), spanning everything from both parts
7. 🎓 Claim Your Reward — a printable certificate, unlocked by beating the Final Boss

It's deliberately not chaptered by calendar day — "Part 1" and "Part 2" are just
two pages for load-time reasons, not a schedule. There's no time-boxed "today
you must finish X" framing anywhere; progress saves itself, so it's fine to
stop mid-mission and resume days later.

Each of the first 5 missions opens with a short interactive story starring two
recurring characters, Maya and Leo (drawn as cartoon SVG characters, not
emoji — see `js/characters.js`), has a looping CSS/SVG animated mini-scene
(no video files needed), a glossary of new words, one or two "Think about it"
scenarios, and ends with a mixed practice quiz. A bonus game card appears at
the end of each part, linking out to a relevant free game from Google's
Be Internet Awesome (Reality River after Part 1, Tower of Treasure after the
certificate in Part 2 — the latter locked until the certificate is earned).

## How the practice quizzes work (Missions 1–5)

Every question must be finished before the next mission unlocks:

- Answer correctly on the first try → done immediately.
- Answer wrong → pick again if you like, then explain your thinking in a short
  open-text box. That box isn't graded right or wrong — it just needs to have
  something written in it. Once it's filled in, the question is marked done.

A mission stays visibly locked (blurred, non-interactive, with a padlock
message) until every question in the previous one is finished, and unlocks
automatically the moment the last one is done. Progress is saved in the
browser (`localStorage`), so it survives closing the tab and coming back
later — see "Continuing across devices" below for the one case that doesn't
cover.

If a mission is reopened after it's already done, it shows a compact
"✅ already finished" summary instead of a blank quiz (with an optional
"🔁 Redo for practice" button) — the underlying flag was never lost, only the
old UI failed to reflect it.

Leaving a mission *partway* through — some questions answered, others not —
and coming back later works the same way at the question level: each
question's solved/unsolved state is saved to `localStorage` the moment it's
solved (not just the all-done flag for the whole mission), so a reload shows
already-answered questions as a locked, checked-off "✅ already answered"
line while the remaining ones are still blank and interactive, with the
progress bar picking up right where it left off. Clicking "🔁 Redo for
practice" clears that saved per-question progress and starts the mission
fully blank again.

## How the Final Boss Challenge works

This one is graded for real, no reflection shortcut, and its 20 questions are
written from scratch — not reused from the mission checkpoints — leaning on
scenarios and application rather than recall, so passing it actually means
something. All 20 are answered, then submitted together with one "Submit
Final Assessment" button. The pass bar is a ratio — 80%, the same as 8 out of
every 10 — applied to however many questions are in the pool (20 here, so 16
correct), not a fixed question count. Passing unlocks the certificate section
immediately below; falling short shows the score and a "Try Again" button
that resets the whole assessment for another attempt. See `js/assessment.js`.

## The certificate

Locked until the Final Boss Challenge is passed. Type a name and it fills
into a styled certificate live (saved in `localStorage` so it's remembered on
refresh), with today's date filled in automatically. The "Print / Save as
PDF" button calls `window.print()`. On `beforeprint`, the certificate markup
is cloned into a fresh `#print-only-cert` div appended directly to `<body>`,
and everything else is hidden via `display:none` on `<body>`'s other direct
children — this avoids the classic `visibility:hidden` + `position:absolute`
trick, which still lets hidden content occupy layout space and can leave the
certificate spanning two printed pages. The clone is removed again on
`afterprint`.

## Sharing one computer between kids (no login)

The very first thing anyone sees on any page — including the home page,
before Part 1 or Part 2 — is a "👋 Who's on this quest?" name prompt (see
`js/player.js` and `buildPlayerGate` in `js/app.js`). Typing a name
namespaces every progress key under it (`isc-d1-s1::Priya` instead of just
`isc-d1-s1`), so a second kid can type their own name and get a completely
clean slate on the same computer — nothing they see was unlocked by the
previous kid, and nothing they do affects the previous kid's saved progress.
The "👤 Name ▾" badge in the header lets anyone switch out; typing the same
name back in picks up exactly where that person left off, since their
progress was never deleted, just parked under their name.

This is deliberately not a real login: there's no password and nothing
stops someone from typing any name, including someone else's. It solves
"two kids, one keyboard, no mix-ups" without needing accounts.

The moment a name is submitted, before the quest itself is reachable, the
same card shows that name's sync code (see "Continuing across devices"
below) with a Copy button and a nudge to save it somewhere safe right then
— rather than leaving it as something a kid has to remember to go dig up
from a header button later. There's no way to hand out a fixed code ahead
of time, since the code encodes actual progress and changes as missions get
finished — but showing name and code together at the moment they're most
likely to be written down gets most of the way there without needing a
backend to issue and look up real per-kid accounts.

## Continuing across devices (no login)

Progress lives in `localStorage`, which is tied to one browser on one device
— it already survives closing the tab, restarting the browser, or coming
back later on the *same* device. It only breaks if a learner switches
devices or browsers mid-quest.

Real accounts (Google Sign-In or similar) would need a backend server plus
real privacy/consent handling for a product aimed at kids — a lot of
infrastructure for what's otherwise a static site. Instead there's a
lightweight no-login workaround: the "🔄 Restore Session" button in the
header packs the *current player's* name and progress into a short code.
The panel leads with pasting a code back in (the most common reason to open
it — a new device, a cleared browser, progress that looks lost), with
getting the current code to use elsewhere as the secondary option below it.
Copy it on device A, paste it into the same panel on device B, and both the
name and progress are restored instantly under that name. See
`buildSyncWidget` and `encodeCode`/`applyCode` in `js/app.js`.

## Adding real videos (optional)

Each mission currently ships with a `.mini-scene` — a small looping CSS/SVG
animation — in place of a video, since no real footage was available yet. If
real video does become available later, replace a `.mini-scene` div with
either:

```html
<video controls poster="your-poster.jpg">
  <source src="your-video.mp4" type="video/mp4">
</video>
```

or a YouTube embed:

```html
<iframe width="100%" height="360" src="https://www.youtube.com/embed/VIDEO_ID"
  title="Video title" frameborder="0" allowfullscreen></iframe>
```

## Running the course

No build step is required — it's plain HTML/CSS/JS.

- Open `index.html` directly in a browser, or
- Serve the folder locally, e.g. `python3 -m http.server`, then visit
  `http://localhost:8000`, or
- Enable GitHub Pages on this repository (Settings → Pages → deploy from
  the default branch) to host it online.

## Structure

```
index.html         Course home page
day1.html           Part 1 content + stories + quizzes (missions 1–2)
day2.html           Part 2 content + stories + quizzes + Final Boss + certificate (missions 3–5, 6, 7)
css/styles.css      Shared styling
js/quiz.js          Practice quiz engine (mcq / true-false / fill-in / match + reflection)
js/assessment.js    Final Boss engine (graded, pass/fail, retry)
js/characters.js    Maya & Leo cartoon SVG art
js/story.js         Interactive story/comic-strip component
js/player.js        Per-name progress namespacing (shared-computer support)
js/app.js           Mission locking, progress tracking, and the cross-device sync widget
```

The `day1.html` / `day2.html` filenames are kept for simplicity (nothing
externally links to them by a different name), even though the visible text
throughout says "Part 1" / "Part 2," not "Day."
