# LifeHub Risers — Smart & Safe Online

A self-paced, pictorial, interactive 2-day course built for LifeHub Risers, covering:

**Day 1 — Staying Safe & Searching Well** (about 1 hour)
1. Staying Safe Online (passwords, tricky messages, privacy)
2. Mastering Google Search (search tricks, filters, habits)

**Day 2 — Researching & Checking Facts Without Shortcuts** (about 1 hour)
3. Research Without Relying on AI (a simple, repeatable research process)
4. Finding Credible Sources (the CRAAP test, checking sideways, warning signs)
5. Using Britannica Wisely (how to use a trusted encyclopedia well, and why to still double-check)

Each of the 5 sections opens with a short interactive story starring one of five
recurring characters (Zara, Gigi, Remy, Vera, and Bea), has a video slot ready
for real footage, and ends with a mixed quiz (multiple choice, true/false,
fill-in-the-blank, matching).

## How the quiz works

Every question must be finished before the next section unlocks:

- Answer correctly on the first try → done immediately.
- Answer wrong → pick again if you like, then explain your thinking in a short
  open-text box. That box isn't graded right or wrong — it just needs to have
  something written in it. Once it's filled in, the question is marked done.

A section stays visibly locked (blurred, non-interactive, with a padlock
message) until every question in the previous section is finished, and
unlocks automatically the moment the last one is done. Progress is saved in
the browser (`localStorage`), so it survives a refresh.

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
index.html      Course home page
day1.html       Day 1 content + stories + quizzes (sections 1–2)
day2.html       Day 2 content + stories + quizzes (sections 3–5)
css/styles.css  Shared styling
js/quiz.js      Quiz engine (mcq / true-false / fill-in / match + reflection)
js/story.js     Interactive story/comic-strip component
js/app.js       Section locking + progress tracking across pages
```
