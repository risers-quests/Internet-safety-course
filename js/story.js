/* Tiny interactive story/comic-strip component: click through a few panels
   with a character, then land on a line that leads into the lesson. */
(function () {
  function el(tag, cls, html) {
    const e = document.createElement(tag);
    if (cls) e.className = cls;
    if (html !== undefined) e.innerHTML = html;
    return e;
  }

  function mountStory(containerId, opts) {
    const container = document.getElementById(containerId);
    if (!container) return;
    const panels = opts.panels || [];
    let idx = 0;

    const card = el('div', 'story-card');
    const head = el('div', 'story-head');
    const avatar = el('div', 'story-avatar');
    avatar.style.background = opts.color || 'var(--blue)';
    avatar.innerHTML = opts.avatarSvg || '';
    const nameBox = el('div');
    nameBox.appendChild(el('div', 'story-name', opts.name || 'Story time'));
    nameBox.appendChild(el('div', 'story-tag', 'Interactive story'));
    head.appendChild(avatar);
    head.appendChild(nameBox);

    const sceneBox = el('div', 'story-scene');
    const emojiEl = el('div', 'story-emoji');
    const textEl = el('div', 'story-text');
    sceneBox.appendChild(emojiEl);
    sceneBox.appendChild(textEl);

    const dots = el('div', 'story-dots');
    const dotEls = panels.map((_, i) => {
      const d = el('span', 'story-dot');
      dots.appendChild(d);
      return d;
    });

    const nav = el('div', 'story-nav');
    const backBtn = el('button', 'btn btn-ghost story-back', '← Back');
    const nextBtn = el('button', 'btn btn-primary story-next', 'Next →');
    backBtn.type = 'button';
    nextBtn.type = 'button';
    nav.appendChild(backBtn);
    nav.appendChild(nextBtn);

    card.appendChild(head);
    card.appendChild(sceneBox);
    card.appendChild(dots);
    card.appendChild(nav);
    container.appendChild(card);

    function render() {
      const p = panels[idx];
      emojiEl.textContent = p.emoji || '';
      textEl.textContent = p.text || '';
      dotEls.forEach((d, i) => d.classList.toggle('active', i === idx));
      backBtn.style.visibility = idx === 0 ? 'hidden' : 'visible';
      nextBtn.textContent = idx === panels.length - 1 ? (opts.endLabel || 'Got it! →') : 'Next →';
    }

    backBtn.addEventListener('click', () => { if (idx > 0) { idx--; render(); } });
    nextBtn.addEventListener('click', () => {
      if (idx < panels.length - 1) { idx++; render(); }
      else if (opts.onEnd) { opts.onEnd(); }
    });

    render();
  }

  window.mountStory = mountStory;
})();
