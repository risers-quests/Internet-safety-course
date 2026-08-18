(function () {
  var ALL_KEYS = ['isc-d1-s1', 'isc-d1-s2', 'isc-d2-s1', 'isc-d2-s2', 'isc-d2-s3'];
  var LOCK_ICON = '<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round" style="display:inline-block;vertical-align:-2px;margin-right:4px;"><rect x="4" y="11" width="16" height="9" rx="2"></rect><path d="M8 11V7a4 4 0 0 1 8 0v4"></path></svg>';

  function hasKey(k) {
    try { return !!localStorage.getItem(k); } catch (e) { return false; }
  }

  function keysMet(attrVal) {
    if (!attrVal) return true;
    return attrVal.split(',').map(function (s) { return s.trim(); }).filter(Boolean).every(hasKey);
  }

  function completedCount() {
    var n = 0;
    ALL_KEYS.forEach(function (k) { if (hasKey(k)) n++; });
    return n;
  }

  function refreshProgress() {
    var pill = document.querySelector('[data-progress-pill]');
    if (pill) pill.textContent = completedCount() + ' / ' + ALL_KEYS.length + ' sections complete';

    document.querySelectorAll('.section[data-requires]').forEach(function (section) {
      section.classList.toggle('locked', !keysMet(section.getAttribute('data-requires')));
    });

    document.querySelectorAll('[data-day-lock]').forEach(function (n) {
      n.style.display = keysMet(n.getAttribute('data-day-lock')) ? 'none' : 'flex';
    });

    document.querySelectorAll('.toc a').forEach(function (link) {
      if (!link.dataset.label) link.dataset.label = link.textContent.trim();
      var locked = !keysMet(link.getAttribute('data-requires'));
      var done = link.hasAttribute('data-complete-key') && hasKey(link.getAttribute('data-complete-key'));
      link.classList.toggle('locked', locked);
      link.classList.toggle('done', done && !locked);
      link.innerHTML = (locked ? LOCK_ICON : '') + link.dataset.label + (done && !locked ? ' ✓' : '');
    });
  }

  document.addEventListener('click', function (e) {
    var link = e.target.closest('.toc a.locked');
    if (!link) return;
    e.preventDefault();
    link.animate(
      [{ transform: 'translateX(0)' }, { transform: 'translateX(-5px)' }, { transform: 'translateX(5px)' }, { transform: 'translateX(0)' }],
      { duration: 300 }
    );
  });

  document.addEventListener('DOMContentLoaded', refreshProgress);
  document.addEventListener('quiz-passed', refreshProgress);
})();
