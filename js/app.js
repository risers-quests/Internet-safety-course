(function () {
  var ALL_KEYS = ['isc-d1-s1', 'isc-d1-s2', 'isc-d2-s1', 'isc-d2-s2', 'isc-d2-s3', 'isc-final'];
  var LOCK_ICON = '<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round" style="display:inline-block;vertical-align:-2px;margin-right:4px;"><rect x="4" y="11" width="16" height="9" rx="2"></rect><path d="M8 11V7a4 4 0 0 1 8 0v4"></path></svg>';

  function hasKey(k) {
    try { return !!(window.Player ? Player.pGet(k) : localStorage.getItem(k)); } catch (e) { return false; }
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

  function hasPlayer() {
    return !!(window.Player && Player.getPlayer());
  }

  function el(tag, cls, html) {
    var e = document.createElement(tag);
    if (cls) e.className = cls;
    if (html !== undefined) e.innerHTML = html;
    return e;
  }

  function refreshProgress() {
    var playerSet = hasPlayer();

    var pill = document.querySelector('[data-progress-pill]');
    if (pill) pill.textContent = completedCount() + ' / ' + ALL_KEYS.length + ' complete';

    document.querySelectorAll('.section[data-requires]').forEach(function (section) {
      section.classList.toggle('locked', !playerSet || !keysMet(section.getAttribute('data-requires')));
    });

    document.querySelectorAll('[data-day-lock]').forEach(function (n) {
      n.style.display = (!playerSet || keysMet(n.getAttribute('data-day-lock'))) ? 'none' : 'flex';
    });

    document.querySelectorAll('.toc a').forEach(function (link) {
      if (!link.dataset.label) link.dataset.label = link.textContent.trim();
      var locked = !playerSet || !keysMet(link.getAttribute('data-requires'));
      var done = link.hasAttribute('data-complete-key') && hasKey(link.getAttribute('data-complete-key'));
      link.classList.toggle('locked', locked);
      link.classList.toggle('done', done && !locked);
      link.innerHTML = (locked ? LOCK_ICON : '') + link.dataset.label + (done && !locked ? ' ✓' : '');
    });

    var gate = document.getElementById('player-gate');
    if (gate) gate.style.display = playerSet ? 'none' : 'flex';

    refreshPlayerBadge();
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

  /* ---- Who's playing? (shares one computer without mixing up progress) ----
     No accounts — just a name "checked in" on this browser that namespaces
     every progress key, so a second kid on the same computer can check in
     under their own name and get a clean slate instead of seeing someone
     else's unlocked missions. */
  function buildPlayerGate() {
    var main = document.querySelector('main.container') || document.querySelector('main');
    if (!main || document.getElementById('player-gate')) return;

    var gate = el('div', 'player-gate');
    gate.id = 'player-gate';
    gate.innerHTML =
      '<div class="player-gate-card">' +
      '<div class="player-gate-title">👋 Who\'s on this quest?</div>' +
      '<p>If someone else uses this computer too, typing your name keeps your progress separate from theirs. Used this before? Type the same name to pick up where you left off.</p>' +
      '<div class="sync-row"><input type="text" id="player-name-input" placeholder="Type your name…" maxlength="40"><button type="button" class="btn btn-primary" id="player-name-btn">Let\'s go!</button></div>' +
      '</div>';
    main.prepend(gate);

    function submit() {
      var val = document.getElementById('player-name-input').value;
      if (Player.setPlayer(val)) refreshProgress();
    }
    document.getElementById('player-name-btn').addEventListener('click', submit);
    document.getElementById('player-name-input').addEventListener('keydown', function (e) {
      if (e.key === 'Enter') { e.preventDefault(); submit(); }
    });
  }

  function refreshPlayerBadge() {
    var nav = document.querySelector('.main-nav');
    if (!nav) return;
    var badge = document.getElementById('player-badge');
    var name = window.Player ? Player.getPlayer() : '';

    if (!name) { if (badge) badge.remove(); return; }

    if (!badge) {
      badge = el('button', 'player-badge');
      badge.id = 'player-badge';
      badge.type = 'button';
      var syncBtn = document.getElementById('sync-btn');
      nav.insertBefore(badge, syncBtn || null);
      badge.addEventListener('click', function () {
        if (confirm('Switch to a different player on this computer? (Your progress under "' + Player.getPlayer() + '" stays saved — you can switch back anytime by typing the same name.)')) {
          Player.clearPlayer();
          refreshProgress();
        }
      });
    }
    badge.textContent = '👤 ' + name + ' ▾';
  }

  /* ---- Continue on another device (no login needed) ----
     Progress lives in localStorage, which is tied to one browser on one
     device. This packs the CURRENT player's progress into a short code you
     can copy and paste into the site on a different device/browser to pick
     up where you left off — no account, no server, no shared login. */
  function encodeCode() {
    var name = window.Player ? Player.getPlayer() : '';
    var bits = ALL_KEYS.map(function (k) { return hasKey(k) ? '1' : '0'; }).join('');
    var certName = window.Player ? (Player.pGet('isc-cert-name') || '') : '';
    var payload = bits + '|' + encodeURIComponent(certName) + '|' + encodeURIComponent(name);
    try { return btoa(payload); } catch (e) { return ''; }
  }

  function applyCode(code) {
    try {
      var payload = atob(code.trim());
      var parts = payload.split('|');
      var bits = parts[0] || '';
      var certName = decodeURIComponent(parts[1] || '');
      var playerName = decodeURIComponent(parts[2] || '');
      if (playerName && window.Player) Player.setPlayer(playerName);
      var okAny = false;
      ALL_KEYS.forEach(function (k, i) {
        if (bits[i] === '1') { (window.Player ? Player.pSet(k, '1') : localStorage.setItem(k, '1')); okAny = true; }
      });
      if (certName && window.Player) Player.pSet('isc-cert-name', certName);
      return okAny;
    } catch (e) { return false; }
  }

  function buildSyncWidget() {
    var nav = document.querySelector('.main-nav');
    if (!nav || document.getElementById('sync-btn')) return;

    var btn = el('button', 'sync-btn', '🔗 Switch device');
    btn.id = 'sync-btn';
    btn.type = 'button';

    var panel = el('div', 'sync-panel');
    panel.innerHTML =
      '<div class="sync-panel-title">📱 Continue on another device</div>' +
      '<p>No login needed! Copy this code on your first device, then paste it into this box on the other one. It carries your name and progress together.</p>' +
      '<label>Your code (copy this)</label>' +
      '<div class="sync-row"><input type="text" id="sync-code-out" readonly><button type="button" class="btn btn-ghost" id="sync-copy-btn">Copy</button></div>' +
      '<label>Paste a code here to restore progress</label>' +
      '<div class="sync-row"><input type="text" id="sync-code-in" placeholder="Paste code…"><button type="button" class="btn btn-primary" id="sync-apply-btn">Restore</button></div>' +
      '<div class="sync-msg" id="sync-msg"></div>';

    nav.appendChild(btn);
    document.body.appendChild(panel);

    btn.addEventListener('click', function () {
      var showing = panel.classList.toggle('show');
      if (showing) document.getElementById('sync-code-out').value = encodeCode();
    });

    document.addEventListener('click', function (e) {
      if (panel.classList.contains('show') && !panel.contains(e.target) && e.target !== btn) {
        panel.classList.remove('show');
      }
    });

    panel.addEventListener('click', function (e) { e.stopPropagation(); });

    panel.querySelector('#sync-copy-btn').addEventListener('click', function () {
      var input = document.getElementById('sync-code-out');
      input.select();
      try {
        navigator.clipboard.writeText(input.value);
        document.getElementById('sync-msg').textContent = '✅ Copied!';
      } catch (e) {
        document.execCommand && document.execCommand('copy');
        document.getElementById('sync-msg').textContent = 'Selected — press Ctrl+C to copy.';
      }
    });

    panel.querySelector('#sync-apply-btn').addEventListener('click', function () {
      var code = document.getElementById('sync-code-in').value;
      var msg = document.getElementById('sync-msg');
      if (!code.trim()) { msg.textContent = '👉 Paste a code first!'; return; }
      if (applyCode(code)) {
        msg.textContent = '🎉 Progress restored! Reloading…';
        setTimeout(function () { window.location.reload(); }, 700);
      } else {
        msg.textContent = '❌ That code didn\'t work — check it and try again.';
      }
    });
  }

  document.addEventListener('DOMContentLoaded', function () {
    if (document.querySelector('.day-hero')) buildPlayerGate();
    buildSyncWidget();
    refreshProgress();
  });
  document.addEventListener('quiz-passed', refreshProgress);
  document.addEventListener('player-changed', refreshProgress);
})();
