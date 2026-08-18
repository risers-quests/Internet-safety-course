(function () {
  var ALL_KEYS = ['isc-d1-s1', 'isc-d1-s2', 'isc-d2-s1', 'isc-d2-s2', 'isc-d2-s3'];

  function completedCount() {
    var n = 0;
    ALL_KEYS.forEach(function (k) {
      try { if (localStorage.getItem(k)) n++; } catch (e) {}
    });
    return n;
  }

  function refreshProgress() {
    var pill = document.querySelector('[data-progress-pill]');
    if (pill) pill.textContent = completedCount() + ' / ' + ALL_KEYS.length + ' sections complete';

    document.querySelectorAll('[data-complete-key]').forEach(function (n) {
      var key = n.getAttribute('data-complete-key');
      var done = false;
      try { done = !!localStorage.getItem(key); } catch (e) {}
      n.classList.toggle('done', done);
      var badge = n.querySelector('.toc-check');
      if (done && !badge) {
        var b = document.createElement('span');
        b.className = 'toc-check';
        b.textContent = ' ✓';
        n.appendChild(b);
      } else if (!done && badge) {
        badge.remove();
      }
    });
  }

  document.addEventListener('DOMContentLoaded', refreshProgress);
  document.addEventListener('quiz-passed', refreshProgress);
})();
