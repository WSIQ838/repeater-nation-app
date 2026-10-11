// Injected into every page the app opens (see src-tauri/src/lib.rs).
// Adds the app's bottom tab bar and More menu on top of the Repeater Nation website.
// The site is a single-page app, so tabs change the address without reloading the page.
(function () {
  if (window.__rnShell) return;
  if (!/(^|\.)repeaternation\.com$/.test(location.hostname)) return; // not on sign-in pages of other sites
  window.__rnShell = true;

  var I = {
    home: '<path d="M3 11l9-8 9 8v9a1 1 0 0 1-1 1h-5v-6H9v6H4a1 1 0 0 1-1-1z"/>',
    tower: '<path d="M12 12v9M8 21l4-9 4 9M9 8a4 4 0 0 1 6 0M6.5 5.5a8 8 0 0 1 11 0"/><circle cx="12" cy="10.5" r="1"/>',
    cal: '<rect x="3" y="4" width="18" height="17" rx="2"/><path d="M16 2v4M8 2v4M3 10h18"/>',
    users: '<circle cx="9" cy="8" r="3.5"/><path d="M2 21a7 7 0 0 1 14 0M16 4.5a3.5 3.5 0 0 1 0 7M22 21a7 7 0 0 0-4-6.3"/>',
    grid: '<rect x="3" y="3" width="7" height="7" rx="1"/><rect x="14" y="3" width="7" height="7" rx="1"/><rect x="3" y="14" width="7" height="7" rx="1"/><rect x="14" y="14" width="7" height="7" rx="1"/>',
    x: '<path d="M18 6L6 18M6 6l12 12"/>'
  };
  var icon = function (n) {
    return '<svg viewBox="0 0 24 24" aria-hidden="true">' + I[n] + '</svg>';
  };

  var TABS = [
    ['Home', '/dashboard', 'home'],
    ['Repeaters', '/repeaters', 'tower'],
    ['Nets', '/events', 'cal'],
    ['Clubs', '/clubs', 'users'],
    ['More', null, 'grid']
  ];
  var MORE = [
    ['Parks & Summits', '/tools/pota', 'POTA and SOTA'],
    ['Forum', '/forums', 'Antennas, repeaters, nets'],
    ['Marketplace', '/marketplace', 'Buy, sell and swap gear'],
    ['Equipment', '/equipment', 'Club gear to borrow'],
    ['Trips', '/trips', 'Routes with repeaters'],
    ['SDR Streams', '/tools/sdr', 'Listen to receivers'],
    ['Logbook', '/logbook', 'Your contacts'],
    ['Tools', '/tools', 'Calculators and more'],
    ['Messages', '/messages', 'Friends and DMs'],
    ['Emergency', '/tools/emergency', 'Alerts and awareness'],
    ['Me', '/profile', 'Profile and settings']
  ];
  // Pages that are not part of the signed-in app: no tab bar there.
  var HIDE = ['/', '/login', '/register', '/forgot-password', '/reset-password', '/ThankYou', '/access-denied'];
  // The site already has its own side menu from this width up.
  var MAX_WIDTH = 1024;

  var css =
    '#rn-bar{position:fixed;left:0;right:0;bottom:0;z-index:2147483000;display:flex;background:#0e1115;border-top:1px solid #262d36;padding:6px 6px calc(10px + env(safe-area-inset-bottom,0px));font:500 11px system-ui,-apple-system,Segoe UI,sans-serif}' +
    '#rn-bar button{flex:1;display:flex;flex-direction:column;align-items:center;gap:3px;padding:6px 0;background:none;border:0;border-radius:10px;color:#8a95a3;font:inherit;cursor:pointer}' +
    '#rn-bar button[aria-current=page]{color:#ff8a1f}' +
    '#rn-bar svg,#rn-more svg{width:22px;height:22px;stroke:currentColor;fill:none;stroke-width:1.8;stroke-linecap:round;stroke-linejoin:round}' +
    '#rn-more{position:fixed;inset:0;z-index:2147483001;background:rgba(0,0,0,.6);display:flex;align-items:flex-end;font-family:system-ui,-apple-system,Segoe UI,sans-serif}' +
    '#rn-more>div{width:100%;max-height:80%;overflow:auto;background:#14181d;color:#eef1f4;border-radius:22px 22px 0 0;padding:14px 16px calc(18px + env(safe-area-inset-bottom,0px))}' +
    '#rn-more header{display:flex;justify-content:space-between;align-items:center;margin-bottom:12px;font:700 20px system-ui,sans-serif}' +
    '#rn-more header button{background:none;border:0;color:#8a95a3;padding:6px}' +
    '#rn-more .g{display:grid;grid-template-columns:1fr 1fr;gap:10px}' +
    '#rn-more .g button{text-align:left;background:#1b2027;border:1px solid #262d36;border-radius:14px;padding:12px;color:#eef1f4;font:inherit;cursor:pointer}' +
    '#rn-more .g b{display:block;font-size:15px}' +
    '#rn-more .g span{font-size:12px;color:#8a95a3}' +
    'body.rn-has-bar #root{padding-bottom:calc(70px + env(safe-area-inset-bottom,0px))}';

  function go(path) {
    history.pushState(null, '', path);
    window.dispatchEvent(new PopStateEvent('popstate'));
  }

  function active() {
    var p = location.pathname;
    if (TABS[0][1] === p) return 0;
    for (var i = 1; i < 4; i++) if (p === TABS[i][1] || p.indexOf(TABS[i][1] + '/') === 0) return i;
    for (var j = 0; j < MORE.length; j++) if (p === MORE[j][1] || p.indexOf(MORE[j][1] + '/') === 0) return 4;
    return -1;
  }

  function closeMore() {
    var m = document.getElementById('rn-more');
    if (m) m.remove();
  }

  function openMore() {
    closeMore();
    var m = document.createElement('div');
    m.id = 'rn-more';
    m.innerHTML =
      '<div role="dialog" aria-label="More"><header><span>More</span><button aria-label="Close">' + icon('x') + '</button></header><div class="g">' +
      MORE.map(function (r, i) { return '<button data-i="' + i + '"><b>' + r[0] + '</b><span>' + r[2] + '</span></button>'; }).join('') +
      '</div></div>';
    m.addEventListener('click', function (e) {
      var b = e.target.closest('button');
      if (e.target === m || (b && b.getAttribute('aria-label') === 'Close')) return closeMore();
      if (b && b.dataset.i) { closeMore(); go(MORE[+b.dataset.i][1]); }
    });
    document.body.appendChild(m);
  }

  function update() {
    document.body.setAttribute('data-rn-path', location.pathname);
    var show = innerWidth < MAX_WIDTH && HIDE.indexOf(location.pathname) < 0 && location.pathname.indexOf('/admin') !== 0;
    var bar = document.getElementById('rn-bar');
    document.body.classList.toggle('rn-has-bar', show);
    if (!show) { if (bar) bar.remove(); closeMore(); return; }
    if (!bar) {
      bar = document.createElement('nav');
      bar.id = 'rn-bar';
      bar.setAttribute('aria-label', 'Main');
      bar.addEventListener('click', function (e) {
        var b = e.target.closest('button');
        if (!b) return;
        var t = TABS[+b.dataset.i];
        if (t[1]) { closeMore(); go(t[1]); } else openMore();
      });
      document.body.appendChild(bar);
    }
    var cur = active();
    bar.innerHTML = TABS.map(function (t, i) {
      return '<button data-i="' + i + '"' + (i === cur ? ' aria-current="page"' : '') + '>' + icon(t[2]) + t[0] + '</button>';
    }).join('');
  }

  function start() {
    var s = document.createElement('style');
    s.textContent = css;
    document.head.appendChild(s);
    ['pushState', 'replaceState'].forEach(function (k) {
      var orig = history[k];
      history[k] = function () {
        var r = orig.apply(this, arguments);
        setTimeout(update, 0);
        return r;
      };
    });
    window.addEventListener('popstate', function () { setTimeout(update, 0); });
    window.addEventListener('resize', update);
    // The site can replace the page body; put the bar back if it disappears.
    new MutationObserver(function () {
      var want = innerWidth < MAX_WIDTH && HIDE.indexOf(location.pathname) < 0 && location.pathname.indexOf('/admin') !== 0;
      if (want && !document.getElementById('rn-bar')) update();
    }).observe(document.body, { childList: true });
    update();
  }

  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', start);
  else start();
})();
