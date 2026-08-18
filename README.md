# LifeHub Risers — Maya & Leo's Internet Adventure

A self-paced, pictorial, interactive 2-day course built for LifeHub Risers, covering:

**Day 1 — Staying Safe & Searching Well** (about 75 minutes)
1. Staying Safe Online (passwords, tricky messages, strangers, malware, privacy)
2. Mastering Google Search (search tricks, filters, reading results, quick answers)

**Day 2 — Researching, Checking Facts & the Final Challenge** (about 2 hours)
3. Research Without Relying on AI (a research toolkit, what to avoid, what not to skip)
4. Finding Credible Sources (the CRAAP test, checking sideways, spot-the-difference examples)
5. Using Britannica Wisely (how to use a trusted encyclopedia well, and why to still double-check)
6. 🏆 Final Challenge — a rigorous 20-question assessment spanning both days
7. 🎓 Certificate — a printable certificate of achievement, unlocked by passing the Final Challenge

Each of the first 5 sections opens with a short interactive story starring two
recurring characters, Maya and Leo (drawn as cartoon SVG characters, not
emoji — see `js/characters.js`), has a video slot ready for real footage, a
glossary of new words, one or two "Think about it" scenarios, and ends with a
mixed practice quiz.

## How the practice quizzes work (Sections 1–5)

Every question must be finished before the next section unlocks:

- Answer correctly on the first try → done immediately.
- Answer wrong → pick again if you like, then explain your thinking in a short
  open-text box. That box isn't graded right or wrong — it just needs to have
  something written in it. Once it's filled in, the question is marked done.

A section stays visibly locked (blurred, non-interactive, with a padlock
message) until every question in the previous section is finished, and
unlocks automatically the moment the last one is done. Progress is saved in
the browser (`localStorage`), so it survives a refresh.

## How the Final Challenge works (Section 6)

This one is graded for real, no reflection shortcut. All 20 questions are
answered, then submitted together with one "Submit Final Assessment" button.
Scoring 80% or higher unlocks the certificate section immediately below;
scoring lower shows the score and a "Try Again" button that resets the whole
assessment for another attempt. See `js/assessment.js`.

## The certificate (Section 7)

Locked until the Final Challenge is passed. Type a name and it fills into a
styled certificate live (saved in `localStorage` so it's remembered on
refresh), with today's date filled in automatically. The "Print / Save as
PDF" button calls `window.print()`; a print stylesheet isolates just the
certificate (`#cert-print-area`) so the rest of the page doesn't print.

## Adding real videos

Each section has a placeholder "Watch & Learn" video slot (a `.video-slot`
div with a play icon) with an HTML comment right after it explaining where to
drop in real content. To add a real video, replace that div with either:

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
day1.html           Day 1 content + stories + quizzes (sections 1–2)
day2.html           Day 2 content + stories + quizzes + Final Challenge + certificate (sections 3–7)
css/styles.css      Shared styling
js/quiz.js          Practice quiz engine (mcq / true-false / fill-in / match + reflection)
js/assessment.js    Final Challenge engine (graded, pass/fail, retry)
js/characters.js    Maya & Leo cartoon SVG art
js/story.js         Interactive story/comic-strip component
js/app.js           Section locking + progress tracking across pages
```
