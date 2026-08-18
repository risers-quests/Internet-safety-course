# Smart & Safe Online — A 2-Day Internet Safety & Research Course

A self-paced, pictorial, interactive course covering:

**Day 1 — Staying Safe & Searching Well**
1. Staying Safe Online (passwords, phishing, privacy)
2. Mastering Google Search (operators, filters, search habits)

**Day 2 — Researching & Verifying Without Shortcuts**
3. Research Without Relying on AI (a repeatable research process)
4. Finding Credible Sources (the CRAAP test, lateral reading, red flags)
5. Wikipedia & Online Encyclopedias (how to use them well, and their limits)

Each section ends with an interactive quiz mixing multiple choice, true/false,
fill-in-the-blank, and matching questions. Progress (70%+ on a section quiz)
is tracked in the browser via `localStorage` and reflected in the progress
pill in the header and checkmarks in each day's table of contents.

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
day1.html       Day 1 content + quizzes (sections 1–2)
day2.html       Day 2 content + quizzes (sections 3–5)
css/styles.css  Shared styling
js/quiz.js      Reusable quiz engine (mcq / true-false / fill-in / match)
js/app.js       Progress tracking across pages
```
