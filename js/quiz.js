/* Lightweight quiz engine: supports mcq, tf, fill, match question types. */
(function () {
  function shuffle(arr) {
    const a = arr.slice();
    for (let i = a.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [a[i], a[j]] = [a[j], a[i]];
    }
    return a;
  }

  function normalize(s) {
    return String(s).trim().toLowerCase().replace(/\s+/g, ' ');
  }

  function el(tag, cls, html) {
    const e = document.createElement(tag);
    if (cls) e.className = cls;
    if (html !== undefined) e.innerHTML = html;
    return e;
  }

  class Quiz {
    constructor(container, questions, meta) {
      this.container = container;
      this.questions = questions;
      this.meta = meta || {};
      this.state = questions.map(() => ({ selected: null, checked: false }));
      this.matchState = questions.map((q) =>
        q.type === 'match'
          ? { order: shuffle(q.pairs.map((_, i) => i)), selectedTerm: null, matched: new Set() }
          : null
      );
      this.build();
    }

    build() {
      this.container.innerHTML = '';
      const head = el('div', 'quiz-title', this.icon() + (this.meta.title || 'Check your understanding'));
      this.container.appendChild(head);
      this.container.appendChild(el('div', 'quiz-sub', this.meta.sub || 'Answer every question, then hit Check Answers.'));

      this.questions.forEach((q, i) => this.container.appendChild(this.renderQuestion(q, i)));

      const actions = el('div', 'quiz-actions');
      const checkBtn = el('button', 'btn btn-primary', 'Check Answers');
      checkBtn.type = 'button';
      checkBtn.addEventListener('click', () => this.check());
      const retryBtn = el('button', 'btn btn-ghost', 'Try Again');
      retryBtn.type = 'button';
      retryBtn.addEventListener('click', () => this.retry());
      const score = el('span', 'quiz-score');
      score.style.display = 'none';
      actions.appendChild(checkBtn);
      actions.appendChild(retryBtn);
      actions.appendChild(score);
      this.container.appendChild(actions);
      this.scoreEl = score;
      this.checkBtn = checkBtn;
    }

    icon() {
      return '<svg viewBox="0 0 24 24" fill="none" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M9.09 9a3 3 0 0 1 5.83 1c0 2-3 2-3 4"></path><line x1="12" y1="17" x2="12.01" y2="17"></line><circle cx="12" cy="12" r="10"></circle></svg>';
    }

    renderQuestion(q, i) {
      const wrap = el('div', 'q-item');
      wrap.dataset.index = i;
      wrap.appendChild(el('div', 'q-num', 'Question ' + (i + 1) + ' · ' + this.typeLabel(q.type)));
      wrap.appendChild(el('div', 'q-prompt', q.q || ''));

      if (q.type === 'mcq') wrap.appendChild(this.renderChoices(q, i, q.choices));
      else if (q.type === 'tf') wrap.appendChild(this.renderChoices(q, i, ['True', 'False'], 'tf-row'));
      else if (q.type === 'fill') wrap.appendChild(this.renderFill(q, i));
      else if (q.type === 'match') wrap.appendChild(this.renderMatch(q, i));

      const fb = el('div', 'q-feedback');
      wrap.appendChild(fb);
      return wrap;
    }

    typeLabel(t) {
      return { mcq: 'Multiple choice', tf: 'True or False', fill: 'Fill in the blank', match: 'Match it' }[t] || '';
    }

    renderChoices(q, i, choices, extraCls) {
      const box = el('div', 'q-choices' + (extraCls ? ' ' + extraCls : ''));
      choices.forEach((c, ci) => {
        const item = el('div', 'q-choice');
        item.appendChild(el('span', 'dot'));
        item.appendChild(el('span', null, c));
        item.addEventListener('click', () => {
          if (this.state[i].checked) return;
          this.state[i].selected = ci;
          box.querySelectorAll('.q-choice').forEach((n) => n.classList.remove('selected'));
          item.classList.add('selected');
        });
        box.appendChild(item);
      });
      return box;
    }

    renderFill(q, i) {
      const box = el('div', 'fill-row');
      const input = el('input');
      input.type = 'text';
      input.placeholder = q.placeholder || 'Type your answer…';
      input.addEventListener('input', () => { this.state[i].selected = input.value; });
      box.appendChild(input);
      return box;
    }

    renderMatch(q, i) {
      const st = this.matchState[i];
      const box = el('div', 'match-cols');
      const termsCol = el('div', 'match-col');
      const defsCol = el('div', 'match-col');
      const defOrder = st.order;

      q.pairs.forEach((pair, ti) => {
        const t = el('div', 'match-item', pair[0]);
        t.dataset.term = ti;
        t.addEventListener('click', () => {
          if (st.matched.has(ti)) return;
          termsCol.querySelectorAll('.match-item').forEach((n) => n.classList.remove('selected'));
          t.classList.add('selected');
          st.selectedTerm = ti;
        });
        termsCol.appendChild(t);
      });

      defOrder.forEach((di) => {
        const d = el('div', 'match-item', q.pairs[di][1]);
        d.dataset.def = di;
        d.addEventListener('click', () => {
          if (st.selectedTerm === null) return;
          if (st.matched.has(Number(d.dataset.def))) return;
          const chosenTerm = st.selectedTerm;
          if (chosenTerm === Number(d.dataset.def)) {
            st.matched.add(chosenTerm);
            const termEl = termsCol.querySelector('[data-term="' + chosenTerm + '"]');
            termEl.classList.remove('selected');
            termEl.classList.add('matched');
            d.classList.add('matched');
            st.selectedTerm = null;
            if (st.matched.size === q.pairs.length) {
              this.state[i].checked = true;
              this.state[i].selected = 'complete';
            }
          } else {
            d.classList.add('shake');
            const termEl = termsCol.querySelector('[data-term="' + chosenTerm + '"]');
            termEl.classList.add('shake');
            setTimeout(() => { d.classList.remove('shake'); termEl.classList.remove('shake'); termEl.classList.remove('selected'); }, 350);
            st.selectedTerm = null;
          }
        });
        defsCol.appendChild(d);
      });

      box.appendChild(termsCol);
      box.appendChild(defsCol);
      return box;
    }

    isCorrect(q, i) {
      const s = this.state[i];
      if (q.type === 'mcq') return s.selected === q.answer;
      if (q.type === 'tf') return (s.selected === 0) === (q.answer === true);
      if (q.type === 'fill') {
        if (s.selected == null) return false;
        const val = normalize(s.selected);
        return q.answer.some((a) => normalize(a) === val);
      }
      if (q.type === 'match') return this.matchState[i].matched.size === q.pairs.length;
      return false;
    }

    check() {
      let correct = 0;
      this.questions.forEach((q, i) => {
        const item = this.container.querySelectorAll('.q-item')[i];
        const fb = item.querySelector('.q-feedback');
        const ok = this.isCorrect(q, i);
        this.state[i].checked = true;
        if (ok) correct++;

        if (q.type === 'mcq' || q.type === 'tf') {
          const choiceNodes = item.querySelectorAll('.q-choice');
          const correctIdx = q.type === 'tf' ? (q.answer === true ? 0 : 1) : q.answer;
          choiceNodes.forEach((n, ci) => {
            if (ci === correctIdx) n.classList.add('correct');
            else if (n.classList.contains('selected') && ci !== correctIdx) n.classList.add('incorrect');
          });
        }
        if (q.type === 'fill') {
          const input = item.querySelector('input');
          input.style.borderColor = ok ? 'var(--green)' : 'var(--red)';
          input.disabled = true;
        }

        fb.classList.add('show', ok ? 'right' : 'wrong');
        if (ok) {
          fb.textContent = '✓ Correct. ' + (q.explain || '');
        } else {
          let correctText = '';
          if (q.type === 'mcq') correctText = 'Correct answer: ' + q.choices[q.answer] + '. ';
          if (q.type === 'tf') correctText = 'Correct answer: ' + (q.answer ? 'True' : 'False') + '. ';
          if (q.type === 'fill') correctText = 'Correct answer: ' + q.answer[0] + '. ';
          if (q.type === 'match') correctText = 'Finish matching all pairs. ';
          fb.textContent = '✗ Not quite. ' + correctText + (q.explain || '');
        }
      });

      const pct = Math.round((correct / this.questions.length) * 100);
      this.scoreEl.style.display = 'inline';
      this.scoreEl.textContent = 'Score: ' + correct + '/' + this.questions.length + ' (' + pct + '%)';
      this.scoreEl.className = 'quiz-score ' + (pct >= 70 ? 'pass' : 'fail');
      this.checkBtn.disabled = true;
      this.checkBtn.style.opacity = '.6';

      if (pct >= 70 && this.meta.storageKey) {
        try { localStorage.setItem(this.meta.storageKey, '1'); } catch (e) {}
        document.dispatchEvent(new CustomEvent('quiz-passed', { detail: { key: this.meta.storageKey } }));
      }
    }

    retry() {
      this.state = this.questions.map(() => ({ selected: null, checked: false }));
      this.matchState = this.questions.map((q) =>
        q.type === 'match'
          ? { order: shuffle(q.pairs.map((_, i) => i)), selectedTerm: null, matched: new Set() }
          : null
      );
      this.build();
    }
  }

  window.mountQuiz = function (containerId, questions, meta) {
    const container = document.getElementById(containerId);
    if (!container) return;
    new Quiz(container, questions, meta);
  };
})();
