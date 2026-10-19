/* Cosigna prototype - screens. Prototype only: simulated bank, sample people, no real money. */
(function () {
  var TP = window.TP, S = TP.S, P = TP.PEOPLE, m = TP.m;
  var I = {
    home: '<path d="M3 11l9-8 9 8v9a1 1 0 0 1-1 1h-5v-6H9v6H4a1 1 0 0 1-1-1z"/>', list: '<path d="M8 6h12M8 12h12M8 18h12M4 6h.01M4 12h.01M4 18h.01"/>',
    bell: '<path d="M6 17v-6a6 6 0 0 1 12 0v6l2 2H4z"/><path d="M10 21h4"/>', user: '<circle cx="12" cy="8" r="4"/><path d="M4 21c0-4 4-6 8-6s8 2 8 6"/>',
    users: '<circle cx="9" cy="8" r="3"/><path d="M3 20c0-3 3-5 6-5s6 2 6 5M16 5a3 3 0 0 1 0 6M18 15c2 .5 3 2 3 5"/>',
    shield: '<path d="M12 3l8 3v6c0 5-3.5 8-8 9-4.5-1-8-4-8-9V6z"/><path d="M8.5 12l2.5 2.5 4.5-5"/>', check: '<path d="M5 12l5 5 9-10"/>', x: '<path d="M6 6l12 12M18 6L6 18"/>', back: '<path d="M15 5l-7 7 7 7"/>',
    lock: '<rect x="5" y="11" width="14" height="9" rx="2"/><path d="M8 11V8a4 4 0 0 1 8 0v3"/>', clock: '<circle cx="12" cy="12" r="9"/><path d="M12 7v5l3 2"/>',
    cash: '<rect x="3" y="6" width="18" height="12" rx="2"/><circle cx="12" cy="12" r="2.5"/>', plus: '<path d="M12 5v14M5 12h14"/>',
    fp: '<path d="M12 4a7 7 0 0 1 7 7v2M5 12a7 7 0 0 1 7-8M8 20c1-2 1-4 1-6a3 3 0 0 1 6 0c0 2 0 5-1 7M12 13v3"/>',
    face: '<path d="M4 8V6a2 2 0 0 1 2-2h2M16 4h2a2 2 0 0 1 2 2v2M20 16v2a2 2 0 0 1-2 2h-2M8 20H6a2 2 0 0 1-2-2v-2M9 10v1M15 10v1M9 15c1.5 1 4.5 1 6 0"/>',
    bank: '<path d="M3 10l9-6 9 6M5 10v8M9 10v8M15 10v8M19 10v8M3 20h18"/>', alert: '<path d="M12 3l10 18H2z"/><path d="M12 10v5M12 18h.01"/>',
    stop: '<circle cx="12" cy="12" r="9"/><path d="M9 9h6v6H9z"/>', chev: '<path d="M9 6l6 6-6 6"/>', send: '<path d="M4 12l16-8-6 16-3-7z"/>', key: '<circle cx="8" cy="15" r="4"/><path d="M11 12l9-9M16 7l3 3"/>',
    ai: '<path d="M12 3l1.8 4.7L18.5 9.5l-4.7 1.8L12 16l-1.8-4.7L5.5 9.5l4.7-1.8z"/><path d="M19 15l.7 1.8 1.8.7-1.8.7L19 20l-.7-1.8-1.8-.7 1.8-.7z"/>',
    id: '<rect x="3" y="5" width="18" height="14" rx="2"/><circle cx="9" cy="11" r="2"/><path d="M6 16c.5-2 5.5-2 6 0M14 10h4M14 14h3"/>',
    sign: '<path d="M4 20c4-1 5-6 7-6s1 4 4 4 3-3 5-3M14 5l5 5-9 9-5 1 1-5z"/>', chain: '<path d="M10 14a4 4 0 0 0 6 0l3-3a4 4 0 0 0-6-6l-1 1M14 10a4 4 0 0 0-6 0l-3 3a4 4 0 0 0 6 6l1-1"/>',
    swap: '<path d="M7 7h11l-3-3M17 17H6l3 3"/>', doc: '<path d="M7 3h8l4 4v14H7z"/><path d="M14 3v5h5M10 13h6M10 17h6"/>', dup: '<rect x="8" y="8" width="12" height="12" rx="2"/><path d="M16 8V6a2 2 0 0 0-2-2H6a2 2 0 0 0-2 2v8a2 2 0 0 0 2 2h2"/>', gauge: '<path d="M4 18a8 8 0 1 1 16 0"/><path d="M12 18l4-5"/>', eye: '<path d="M2 12s4-7 10-7 10 7 10 7-4 7-10 7S2 12 2 12z"/><circle cx="12" cy="12" r="3"/>', info: '<circle cx="12" cy="12" r="9"/><path d="M12 11v5M12 8h.01"/>'
  };
  var ic = (TP.ic = function (n, s) { return '<svg viewBox="0 0 24 24"' + (s ? ' style="width:' + s + 'px;height:' + s + 'px"' : '') + '>' + I[n] + '</svg>'; });
  function chip(t, k) { return '<span class="chip ' + (k || 'info') + '">' + t + '</span>'; }
  function av(id, sz) { var p = P[id]; return '<div class="av' + (sz ? ' ' + sz : '') + '" style="background:linear-gradient(135deg,' + p.col + ',' + p.col + 'CC)">' + p.init + '</div>'; }
  function top(t, back, dark) { return '<div class="top' + (dark ? ' dark' : '') + '">' + (back ? '<button class="ib" data-a="go" data-v="' + back + '">' + ic('back') + '</button>' : '') + '<b>' + t + '</b></div>'; }
  function body(h) { return '<div class="body">' + h + '</div>'; }
  function btn(t, a, v, cls, extra) { return '<button class="btn ' + (cls || '') + '" data-a="' + a + '"' + (v !== undefined ? ' data-v="' + v + '"' : '') + (extra || '') + '>' + t + '</button>'; }
  function banner(k, t, i) { return '<div class="banner ' + k + '">' + ic(i || (k === 'bad' ? 'alert' : k === 'ok' ? 'check' : k === 'ai' ? 'ai' : 'shield'), 20) + '<span>' + t + '</span></div>'; }
  function sim() { return banner('info', 'Prototype only. Simulated bank, sample people, no real money.', 'info'); }
  function vis(n) { return n.to === 'all' || n.to.indexOf(S.user) > -1; }
  function unread() { return S.notes.filter(function (n) { return vis(n) && !n.read; }).length; }
  function ring(p, size, color, mid, extra) {
    var C = 2 * Math.PI * 42;
    return '<div class="ring" style="width:' + size + 'px;height:' + size + 'px"><svg viewBox="0 0 100 100"><circle class="bg" cx="50" cy="50" r="42"/><circle class="fg" cx="50" cy="50" r="42" stroke="' + color + '" stroke-dasharray="' + C.toFixed(1) + '" stroke-dashoffset="' + (C * (1 - p)).toFixed(1) + '"' + (extra || '') + '/></svg><div class="mid">' + mid + '</div></div>';
  }
  function nav() {
    var t = [['home', 'home', 'Home'], ['approvals', 'users', 'Approvals'], ['fab'], ['history', 'list', 'Activity'], ['security', 'shield', 'Security']], pend = TP.mine() ? 1 : 0, co = TP.isCoop();
    return '<div class="nav">' + t.map(function (x) {
      if (x[0] === 'fab') return '<button class="fab" data-a="go" data-v="' + (co ? 'payout' : 'request') + '">' + ic(co ? 'send' : 'plus') + '</button>';
      return '<button data-a="tab" data-v="' + x[0] + '" class="' + (S.tab === x[0] ? 'on' : '') + '">' + ic(x[1]) + x[2] + (x[0] === 'approvals' && pend ? '<i>' + pend + '</i>' : '') + '</button>';
    }).join('') + '</div>';
  }
  function frozenBar() {
    return S.frozen ? '<div class="banner bad">' + ic('alert', 20) + '<span>' + (TP.isCoop() ? 'Payouts' : 'Withdrawals') + ' are FROZEN by ' + TP.nm(S.frozen.by) + '. Unfreezing needs all 3 ' + (TP.isCoop() ? 'officers' : 'signers') + '.</span></div>' : '';
  }
  function accTag() { return chip(ic(TP.isCoop() ? 'users' : 'lock', 12) + ' ' + TP.acc().short, TP.isCoop() ? 'sec' : 'info'); }
  function topA(t) { return '<div class="top"><b>' + t + '</b>' + accTag() + '<span style="width:8px"></span></div>'; }
  function hdrHome() {
    var a = TP.acc();
    return '<div class="top"><button data-a="go" data-v="profile">' + av(S.user) + '</button><button class="chip info" style="margin-left:8px;border:0;padding:9px 12px;font-size:13px" data-a="sheet" data-v="accts">' + ic(TP.isCoop() ? 'users' : 'lock', 14) + ' ' + a.short + ' <span style="display:inline-block;transform:rotate(90deg)">' + ic('chev', 14) + '</span></button><div class="grow"></div><button class="ib" data-a="go" data-v="alerts">' + ic('bell') + (unread() ? '<i style="position:absolute;top:9px;right:10px;width:10px;height:10px;border-radius:50%;background:var(--red);border:2px solid var(--bg)"></i>' : '') + '</button></div>';
  }
  function linkCard() {
    var other = TP.isCoop() ? 'joint' : 'coop';
    if (TP.linked(other)) return '';
    return '<button class="card" style="text-align:left;width:100%;border:1.5px dashed var(--blue)" data-a="go" data-v="accounts"><div class="row" style="gap:12px"><div class="ic">' + ic(other === 'coop' ? 'users' : 'lock', 20) + '</div><div class="grow"><b>Link your ' + (other === 'coop' ? 'cooperative account' : 'joint account') + '</b><div class="mute">' + (other === 'coop' ? 'Payouts to members and suppliers' : 'Cash withdrawals with cash codes') + '</div></div>' + ic('chev', 18) + '</div></button>';
  }
  function tl(items) {
    return '<div class="tl">' + items.map(function (s) {
      return '<div class="st ' + s[0] + '"><div class="dot">' + (s[0] === 'ok' ? ic('check', 15) : s[0] === 'bad' ? ic('x', 15) : '') + '</div><div><b>' + s[1] + '</b><div class="mute">' + s[2] + '</div></div></div>';
    }).join('') + '</div>';
  }
  function audit(r) {
    TP.chain(r);
    return tl(r.audit.map(function (e) { return [e.k === 'ok' ? 'ok' : e.k === 'bad' ? 'bad' : e.k === 'pend' ? 'now' : '', e.x, e.t + ' · ' + e.a + ' · #' + (e.h || '').slice(0, 6)]; }));
  }
  function steps(r) {
    var n = TP.count(r), tot = TP.total(r), fin = ['code', 'sent', 'done'].indexOf(r.st) > -1, w = r.kind === 'withdrawal';
    var what = r.kind === 'payout' ? m(r.amt) + ' to ' + r.payee : r.kind === 'beneficiary' ? 'New payee ' + r.payee : m(r.amt) + ' · ' + (r.ch === 'POS' ? 'POS / ATM' : 'Branch pickup');
    var s = [['ok', 'Request sent', TP.nm(r.by) + ' · ' + what]];
    s.push(['ok', 'AI risk check', 'Risk: ' + r.risk.level + ' (' + r.risk.score + '/100)']);
    s.push([r.st === 'rejected' ? 'bad' : n === tot ? 'ok' : r.st === 'cancelled' ? '' : 'now', 'Approvals', n + ' of ' + tot + ' approved · ' + (r.hv ? 'fingerprint/PIN + face' : 'fingerprint/PIN') + ' · signed on device']);
    if (r.hv) s.push([fin ? 'ok' : r.st === 'delay' ? 'now' : '', 'Safety delay', (r.delayMs ? r.delayMs / 60000 : S.setup.delay) + ' minutes. Any ' + (w ? 'signer' : 'officer') + ' can stop it.']);
    s.push([fin ? 'ok' : '', r.kind === 'payout' ? 'Payout released' : r.kind === 'beneficiary' ? 'Payee saved' : 'One-time cash code', fin ? (r.kind === 'payout' ? 'Bank transfer sent (simulated)' : r.kind === 'beneficiary' ? 'Cooling-off ' + S.setup.cool + ' hours starts' : 'Issued to ' + TP.nm(r.by)) : 'After the checks above']);
    if (r.st === 'rejected') s.push(['bad', 'Closed: rejected', r.reason]);
    if (r.st === 'cancelled') s.push(['bad', 'Cancelled', r.audit[r.audit.length - 1].x]);
    return tl(s);
  }
  function signers(r) {
    var co = r.acct === 'coop';
    return TP.IDS.map(function (i) {
      var st = r.ap[i], k = st === 'approved' ? 'ok' : st === 'rejected' ? 'bad' : 'pend', role = co ? TP.ROLES[i] + ' · ' : '';
      if (st === 'na') return '<div class="item" style="opacity:.55">' + av(i) + '<div class="grow"><b>' + P[i].name + '</b><div class="mute">' + role + (r.officer === i ? 'payee: cannot approve' : 'not required') + '</div></div>' + chip('Not required', 'gray') + '</div>';
      return '<div class="item">' + av(i) + '<div class="grow"><b>' + P[i].name + (i === S.user ? ' (you)' : '') + '</b><div class="mute">' + role + (st === 'approved' ? 'Signed on device' + (r.hv ? ' · face verified' : '') : st === 'rejected' ? 'Rejected' : 'Waiting for decision') + '</div></div>' + chip(st === 'approved' ? 'Approved' : st === 'rejected' ? 'Rejected' : 'Pending', k) + '</div>';
    }).join('');
  }
  function reqRow(r) {
    var b = TP.status(r);
    if (r.type === 'sec') return '<button class="item" data-a="sheet" data-v="detail:' + r.id + '"><div class="ic" style="background:' + (b[1] === 'bad' ? 'var(--rsoft)' : 'var(--soft)') + ';color:' + (b[1] === 'bad' ? 'var(--red)' : 'var(--blue2)') + '">' + ic('shield', 20) + '</div><div class="grow"><b>' + r.title + '</b><div class="mute">' + r.when + '</div></div>' + chip(b[0], b[1]) + '</button>';
    var title = r.kind === 'beneficiary' ? 'New payee: ' + r.payee : m(r.amt), sub = r.kind === 'payout' ? 'To ' + r.payee + ' · ' + r.when + (r.hv ? ' · high value' : '') : r.kind === 'beneficiary' ? TP.nm(r.by) + ' · ' + r.when : TP.nm(r.by) + ' · ' + r.when + (r.hv ? ' · high value' : '');
    return '<button class="item" data-a="sheet" data-v="detail:' + r.id + '">' + av(r.by) + '<div class="grow"><b>' + title + '</b><div class="mute">' + sub + '</div></div>' + chip(b[0], b[1]) + '</button>';
  }
  function reqCard(r) {
    var b = TP.status(r);
    return '<div class="card"><div class="row sp"><b style="font-size:20px">' + (r.kind === 'beneficiary' ? 'New payee' : m(r.amt)) + '</b>' + chip(b[0], b[1]) + '</div><div class="mute">' + (r.kind === 'withdrawal' ? TP.nm(r.by) + ' · ' + (r.ch === 'POS' ? 'POS / ATM' : 'Branch pickup') : r.kind === 'payout' ? 'To ' + r.payee : r.payee) + (r.hv ? ' · high value' : '') + '</div><div class="bar2" style="margin:12px 0"><i style="width:' + TP.count(r) / TP.total(r) * 100 + '%"></i></div>' + btn('Track request', 'go', 'track', 'sec') + '</div>';
  }
  function setc(label, key, arr, fmt) {
    return '<div class="card"><div class="lab">' + label + '</div><div class="chips">' + arr.map(function (v) { return '<button data-a="setc" data-k="' + key + '" data-v="' + v + '" class="' + (S.setup[key] === v ? 'on' : '') + '">' + fmt(v) + '</button>'; }).join('') + '</div></div>';
  }
  // AI risk card (simulated model)
  function aiCard(r, who, mini) {
    var sc = r.score;
    if (mini) return '<button class="card" style="width:100%;text-align:left;display:flex;gap:12px;align-items:center;padding:12px 14px" data-a="sheet" data-v="aihow"><div class="ic" style="background:linear-gradient(135deg,var(--ai),var(--blue));color:#fff">' + ic('ai', 20) + '</div><div class="grow"><div class="row" style="gap:8px"><b>AI risk check</b>' + chip(r.level + ' · ' + sc, r.cls) + '</div><div class="mute" style="font-size:13px">' + TP.advice(r, who) + '</div></div>' + ic('chev', 18) + '</button>';
    return '<div class="card" style="padding:0;overflow:hidden"><div style="padding:14px 16px;background:linear-gradient(135deg,var(--ai),var(--blue));color:#fff" class="row sp"><div class="row" style="gap:10px">' + ic('ai', 22) + '<b style="font-size:16px">AI Risk Warning</b></div><button class="chip glass" style="border:0" data-a="sheet" data-v="aihow">How it works</button></div><div style="padding:16px"><div class="row" style="gap:16px">' + ring(sc / 100, 96, r.col, '<b style="font-size:24px" class="num">' + sc + '</b><div class="mute" style="font-size:11px">of 100</div>') + '<div class="grow"><div class="row" style="gap:8px;margin-bottom:6px">' + chip(r.level + ' risk', r.cls) + '</div><div style="font-weight:700;line-height:1.3">' + TP.advice(r, who) + '</div></div></div><div style="margin-top:10px">' + r.factors.map(function (f) {
      return '<div class="item" style="padding:8px 0"><div style="color:' + (f.k === 'ok' ? 'var(--green)' : f.k === 'warn' ? 'var(--amber)' : 'var(--red)') + '">' + ic(f.k === 'ok' ? 'check' : 'alert', 18) + '</div><div class="grow" style="font-size:14px">' + f.t + '</div></div>';
    }).join('') + '</div><div class="mute" style="font-size:11px;margin-top:6px">Simulated in this prototype. A real model would learn from account history.</div></div></div>';
  }
  function qr(seed) {
    var h = parseInt(TP.hx(seed), 16), cells = '', x = h;
    for (var i = 0; i < 121; i++) {
      var r = Math.floor(i / 11), c = i % 11, fin = (r < 3 && c < 3) || (r < 3 && c > 7) || (r > 7 && c < 3);
      x = (x * 1103515245 + 12345) & 0x7fffffff; cells += '<i class="' + (fin || x % 3 === 0 ? '' : 'o') + '"></i>';
    }
    return '<div class="qr">' + cells + '</div>';
  }

  var V = (TP.V = {});

  // ---------- intro
  V.splash = function () {
    return '<div class="dark" style="justify-content:center;align-items:center;text-align:center"><div class="logo float"><svg class="draw" viewBox="0 0 24 24"><path d="M12 3l8 3v6c0 5-3.5 8-8 9-4.5-1-8-4-8-9V6z"/><path d="M8.5 12l2.5 2.5 4.5-5"/></svg></div><h1 style="font-size:38px;margin-top:6px">Cosigna</h1><div class="mute">Everyone signs. From anywhere. Safely.</div></div>';
  };
  V.welcome = function () {
    return '<div class="dark"><div style="margin-top:14px"><div class="logo" style="width:64px;height:64px;border-radius:20px">' + ic('shield') + '</div></div><div><h1 style="font-size:36px">Approve together.<br>Withdraw safely.</h1><div class="mute" style="margin-top:10px;font-size:16px">Approval security for bank joint accounts, including cash. The bank stays in charge.</div></div>' +
      '<div class="row wrap"><span class="chip glass">' + ic('face', 14) + ' Face check</span><span class="chip glass">' + ic('key', 14) + ' One-time cash code</span><span class="chip glass">' + ic('ai', 14) + ' AI risk warning</span><span class="chip glass">' + ic('bank', 14) + ' Bank rule first</span></div><div style="flex:1"></div>' +
      btn('Get started', 'auth', 'signup', 'light') + btn('See how it works', 'go', 'how', 'glass') + '<div class="c mute">Already set up? <button style="color:#fff;font-weight:800;text-decoration:underline" data-a="auth" data-v="login">Log in</button></div><div class="c mute" style="font-size:12px">Prototype. Simulated bank. Sample data.</div><button class="c mute" style="font-size:12px;text-decoration:underline" data-a="skip">Skip setup (demo shortcut)</button></div>';
  };
  V.how = function () {
    return top('How Cosigna works', 'welcome') + body('<div class="mute">Four steps. Security is built into every one.</div>' + TP.HOW.map(function (h, i) {
      return '<div class="card"><div class="row" style="align-items:flex-start;gap:14px"><div class="ic" style="width:48px;height:48px;background:linear-gradient(135deg,var(--blue),var(--blue2));color:#fff">' + ic(h[0], 24) + '</div><div class="grow"><div class="row sp"><h2>' + h[1] + '</h2><b style="color:#B8C2DC;font-size:22px">' + (i + 1) + '</b></div><div class="mute" style="margin:4px 0 8px">' + h[2] + '</div><div class="row wrap">' + h[3].map(function (c) { return chip(c, /AI/.test(c) ? 'ai' : 'info'); }).join('') + '</div></div></div></div>';
    }).join('') + btn('Get started', 'auth', 'signup'));
  };
  V.auth = function () {
    var f = S.form, su = S.authTab === 'signup';
    return top(su ? 'Create account' : 'Log in', 'welcome') + body('<div class="seg"><button data-a="authtab" data-v="signup" class="' + (su ? 'on' : '') + '">Sign up</button><button data-a="authtab" data-v="login" class="' + (!su ? 'on' : '') + '">Log in</button></div>' +
      (su ? '<div><div class="lab">Full name</div><input class="field" data-bind="name" value="' + f.name + '" placeholder="Full name"></div>' : '') +
      '<div><div class="lab">Phone number</div><input class="field" data-bind="' + (su ? 'phone' : 'lphone') + '" inputmode="numeric" maxlength="11" value="' + (su ? f.phone : f.lphone) + '" placeholder="11-digit phone"></div>' +
      '<div><div class="lab">' + (su ? 'Create a 4-digit PIN' : 'Your 4-digit PIN') + '</div><input class="field" data-bind="' + (su ? 'pin' : 'lpin') + '" type="password" inputmode="numeric" maxlength="4" value="' + (su ? f.pin : f.lpin) + '" placeholder="••••"></div>' +
      '<button class="chip info" style="align-self:flex-start;border:0" data-a="sample">' + (su ? 'Use sample details' : 'Fill my details') + '</button>' + banner('info', 'Your PIN confirms approvals on this phone. Sample data only.', 'lock') + '<div style="flex:1"></div>' + btn(su ? 'Create account' : 'Log in', 'authgo', undefined, '', ' id="primary"') + sim());
  };
  V.otp = function () {
    return top('Verify phone', 'auth') + body('<h1>Enter the 6-digit code</h1><div class="mute">We "sent" a code to •••• •••' + (S.form.phone || '0000').slice(-4) + '. This is a simulation: no SMS is sent.</div><input class="field" data-bind="otp" inputmode="numeric" maxlength="6" value="' + S.form.otp + '" placeholder="6-digit code" style="text-align:center;letter-spacing:8px;font-size:26px"><button class="chip info" style="align-self:center;border:0" data-a="otpfill">Demo code: ' + TP.DEMO_OTP + ' (tap to fill)</button><div style="flex:1"></div>' + btn('Verify', 'otpgo', undefined, '', ' id="primary"'));
  };
  V.idv = function () {
    var f = S.form;
    return top('Verify identity', 'otp') + body('<h1>Confirm it is really you</h1><div class="mute">Step 1: consent to a BVN or NIN check. Step 2: a live face check matched to your record. Step 3: we create your secret key.</div><div class="seg"><button data-a="idt" data-v="BVN" class="' + (f.idt === 'BVN' ? 'on' : '') + '">BVN</button><button data-a="idt" data-v="NIN" class="' + (f.idt === 'NIN' ? 'on' : '') + '">NIN</button></div><input class="field" data-bind="idn" inputmode="numeric" maxlength="11" value="' + f.idn + '" placeholder="11-digit ' + f.idt + '"><button class="chip info" style="align-self:flex-start;border:0" data-a="idsample">Use sample number</button>' + banner('info', 'Simulated consent (like NIBSS iGree). No real ' + f.idt + ' is checked or stored.', 'shield') + '<div style="flex:1"></div>' + btn(ic('face') + ' Continue to face check', 'idgo', undefined, '', ' id="primary"'));
  };
  V.keygen = function () {
    var k = S.keyStep, L = [['key', 'Creating your secret key', 'Inside the phone\'s secure chip. It never leaves the phone.'], ['bank', 'Registering your public key', 'With the bank (simulated), so it can check your approvals.'], ['lock', 'Binding this device to you', 'Only this phone can approve for you.']];
    return '<div class="dark" style="justify-content:center"><div class="c"><div class="logo float" style="margin:auto">' + ic('key') + '</div><h1 style="margin-top:18px;font-size:26px">Securing your device</h1></div><div class="card">' + L.map(function (x, i) {
      return '<div class="step ' + (k > i ? 'on' : '') + '"><div class="ic" style="background:' + (k > i + 0 ? 'var(--green)' : 'rgba(255,255,255,.15)') + ';color:#fff">' + ic(k > i ? 'check' : x[0], 20) + '</div><div><b>' + x[1] + '</b><div class="mute" style="font-size:13px">' + x[2] + '</div></div></div>';
    }).join('') + '</div></div>';
  };
  V.idok = function () {
    return body('<div class="c" style="margin-top:20px"><div class="tick">' + ic('check') + '</div><h1 style="margin-top:16px">You are verified</h1><div class="mute">Matched to the (simulated) bank record.</div></div><div class="card"><div class="item"><span class="grow mute">' + S.form.idt + ' consent</span>' + chip('Given', 'ok') + '</div><div class="item"><span class="grow mute">Liveness check</span>' + chip('Passed', 'ok') + '</div><div class="item"><span class="grow mute">Face match</span>' + chip('98% (simulated)', 'ok') + '</div><div class="item"><span class="grow mute">Secret key</span>' + chip('In secure chip', 'ok') + '</div><div class="item"><span class="grow mute">Device</span>' + chip('Bound', 'ok') + '</div></div><div style="flex:1"></div>' + btn('Choose your bank', 'go', 'bank'));
  };

  // ---------- verification (fingerprint/PIN, face, signing)
  V.verify = function () {
    var v = S.vf; if (!v) return V.home();
    if (v.step === 'face') {
      var L = ['Look straight at the camera', 'Blink slowly', 'Turn your head to the left', 'Matching with your record…', 'Face matched'], d = v.fs || 0;
      return '<div class="cam"><div class="top dark" style="width:calc(100% + 40px);margin:-8px -20px 0"><button class="ib" data-a="vfx">' + ic('x') + '</button><b>Face verification</b></div><div class="faceWrap"><svg class="ringS" viewBox="0 0 264 324"><ellipse cx="132" cy="162" rx="128" ry="158" fill="none" stroke="rgba(255,255,255,.18)" stroke-width="4"/><ellipse cx="132" cy="162" rx="128" ry="158" fill="none" stroke="' + (d >= 4 ? '#32D583' : '#6AA0FF') + '" stroke-width="5" stroke-linecap="round" pathLength="100" stroke-dasharray="100" stroke-dashoffset="' + (100 - Math.min(d, 4) * 25) + '" transform="rotate(-90 132 162)" style="transition:stroke-dashoffset .8s"/></svg><div class="oval">' + ic('user').replace('<svg', '<svg class="f"') + '<div class="mesh"></div>' + (d < 4 ? '<div class="scan"></div>' : '') + '</div></div><h2 style="font-size:20px">' + L[d] + '</h2><div class="dots">' + [0, 1, 2, 3, 4].map(function (i) { return '<i class="' + (i <= d ? 'on' : '') + '"></i>'; }).join('') + '</div><div style="opacity:.75;font-size:13px">Liveness check, matched to your bank record.<br>Simulated: no camera is used.</div></div>';
    }
    if (v.step === 'sign') {
      var r = S.req, amt = v.purpose === 'send' ? Number(S.amt) : v.purpose === 'payout' ? TP.payTotal() : v.purpose === 'addben' ? 0 : r ? r.amt : 0;
      return top('Signing your approval') + body('<div class="c mute">Your phone signs exactly what you saw.</div><div class="card"><div class="item"><span class="grow mute">Action</span><b>' + ({ send: 'Request cash', payout: 'Prepare payout', addben: 'Propose new payee', approve: 'Approve request', unfreeze: 'Approve unfreeze' }[v.purpose]) + '</b></div>' + (amt ? '<div class="item"><span class="grow mute">Amount</span><b class="num">' + m(amt) + '</b></div>' : '') + '<div class="item"><span class="grow mute">Time</span><b>' + TP.clock() + '</b></div><div class="item"><span class="grow mute">One-time number</span><b style="font-family:ui-monospace,monospace">' + v.nonce + '</b></div><div class="item"><span class="grow mute">Signature</span>' + (v.signed ? '<b style="font-family:ui-monospace,monospace;color:var(--green)">' + v.sig + '</b>' : '<span class="chip info">Signing…</span>') + '</div></div>' +
        '<div class="row wrap">' + (v.signed ? chip(ic('check', 12) + ' Signed on this device', 'ok') + chip(ic('bank', 12) + ' Bank can verify (simulated)', 'ok') : chip('Using your secret key…', 'info')) + '</div>' + banner('info', 'Each approval is signed once, expires quickly, and cannot be reused.', 'lock'));
    }
    var pin = v.mode === 'pin';
    return top(v.title, 'vfx') + body('<div class="c mute">' + v.sub + '</div>' +
      (pin ? '<div class="pin">' + [0, 1, 2, 3].map(function (i) { return '<i class="' + (i < (v.pin || '').length ? 'on' : '') + '"></i>'; }).join('') + '</div><div class="c" style="color:var(--red);font-weight:700;min-height:20px">' + (v.err || '') + '</div><div class="pad">' + ['1', '2', '3', '4', '5', '6', '7', '8', '9', '', '0', '⌫'].map(function (k) { return k === '' ? '<span></span>' : '<button data-a="pk" data-v="' + k + '">' + k + '</button>'; }).join('') + '</div><div class="c mute">Sample PIN: ' + S.pin + '</div>' + btn('Use fingerprint instead', 'vfmode', 'bio', 'sec')
        : '<div class="pulse ' + (v.scanning ? 'scanning' : '') + '"><div class="core">' + ic('fp') + '</div></div><div class="c" style="font-weight:800;font-size:18px">' + (v.scanning ? 'Scanning…' : 'Touch the sensor') + '</div><div class="c mute">Simulated fingerprint prompt</div>' + btn(v.scanning ? 'Scanning…' : 'Scan fingerprint', 'scan', undefined, '', v.scanning ? ' disabled' : '') + btn('Use PIN instead', 'vfmode', 'pin', 'sec')) +
      (v.steps.indexOf('face') > -1 ? banner('warn', 'High-value request: a face check comes next.', 'face') : ''));
  };

  // ---------- bank linking
  V.bank = function () {
    return top('Choose your bank', 'idok') + body('<h1>Which bank holds your joint account?</h1>' + sim() + '<div class="card" style="padding:4px 16px">' + TP.BANKS.map(function (b) {
      return '<button class="item" style="opacity:' + (b.ok ? 1 : .55) + '" data-a="' + (b.ok ? 'bank' : 'soon') + '" data-v="' + b.id + '"><div class="ic" style="background:var(--navy2);color:#fff">' + ic('bank', 20) + '</div><div class="grow"><b>' + b.name + '</b><div class="mute">' + b.note + '</div></div>' + (b.ok ? chip(S.setup.bank === b.id ? 'Selected' : 'Partner', S.setup.bank === b.id ? 'ok' : 'info') : chip('Soon', 'pend')) + '</button>';
    }).join('') + '</div><div class="mute">Only partner banks can enforce shared approvals.</div><div style="flex:1"></div>' + btn('Continue', 'go', 'consent', '', S.setup.bank ? '' : ' disabled'));
  };
  V.consent = function () {
    return '<div class="top" style="background:#0E3B8C;color:#fff"><button class="ib" data-a="go" data-v="bank">' + ic('back') + '</button><b>Unity Demo Bank (simulated)</b>' + ic('lock', 20) + '</div>' + body(banner('warn', 'This simulates the bank\'s own sign-in page. No real credentials are entered or stored.') + '<div><div class="lab">Username</div><input class="field" value="demo.user" disabled></div><div><div class="lab">Password</div><input class="field" value="••••••••" disabled></div><div class="card"><h2>Unity Demo Bank asks you to allow Cosigna to:</h2><div class="item">' + ic('check', 20) + '<span>See your joint accounts and their signing rules</span></div><div class="item">' + ic('check', 20) + '<span>Send approval requests to the other signers</span></div><div class="item">' + ic('check', 20) + '<span>Ask the bank to release a cash code, only after all approvals</span></div></div><div class="card"><h2>Cosigna can never:</h2><div class="item" style="color:var(--red)">' + ic('x', 20) + '<span>See your bank password or PIN</span></div><div class="item" style="color:var(--red)">' + ic('x', 20) + '<span>Move money without all approvals</span></div><div class="item" style="color:var(--red)">' + ic('x', 20) + '<span>Change the bank\'s signing rule</span></div></div><div style="flex:1"></div>' + btn('Allow access', 'go', 'accounts') + btn('Cancel', 'go', 'bank', 'sec'));
  };
  V.accounts = function () {
    var any = TP.linked('joint') || TP.linked('coop');
    return top('Select account', any ? 'home' : 'consent') + body('<h1>Your accounts at Unity Demo Bank</h1><div class="mute">Joint accounts make withdrawals. Cooperative accounts make payouts. Each was checked against the bank\'s rules.</div>' + TP.ACCOUNTS.map(function (a) {
      var ok = a.state === 'eligible', done = ok && TP.linked(a.type);
      return '<button class="card" style="text-align:left;opacity:' + (ok ? 1 : .62) + ';' + (ok && !done ? 'box-shadow:0 0 0 2px var(--blue),0 10px 30px rgba(47,107,255,.18)' : '') + '" data-a="' + (done ? 'swacct' : ok ? 'acct' : 'noacct') + '" data-v="' + (done ? a.type : a.id) + '"><div class="row sp"><b>' + a.name + '</b>' + chip(done ? 'Linked' : ok ? 'Eligible' : 'Not available', ok ? 'ok' : 'pend') + '</div><div class="row wrap" style="margin:6px 0 2px">' + chip(a.type === 'coop' ? 'Cooperative · payouts' : 'Joint · withdrawals', a.type === 'coop' ? 'sec' : 'info') + '</div><div class="mute">•••• ' + a.no + ' · ' + a.rule + '</div>' + (ok ? '' : '<div class="mute" style="margin-top:6px">' + a.why + '</div>') + '</button>';
    }).join(''));
  };
  V.rule = function () {
    var co = TP.isCoop();
    return top(co ? 'Bank mandate' : 'Bank signing rule', 'accounts') + body('<div class="banner ok">' + ic('lock', 20) + '<span><b>Set by the bank. Read only.</b><br>' + (co ? 'Any 2 officers must sign, and the Treasurer must be one of them.' : 'All 3 signers must approve every withdrawal.') + '</span></div>' +
      (co ? '<div class="card"><h2>Documents on file (simulated)</h2>' + ['Certificate of registration', 'Executive committee resolution naming the signers', 'Mandate card and specimen signatures', 'KYC and BVN of each officer'].map(function (x) { return '<div class="item" style="padding:9px 0">' + ic('check', 18) + '<span class="grow">' + x + '</span>' + chip('On file', 'ok') + '</div>'; }).join('') + '</div>' : '') +
      '<div class="card"><h2>' + (co ? 'Officers on the bank\'s record' : 'Signers on the bank\'s record') + '</h2>' + TP.IDS.map(function (i) { return '<div class="item">' + av(i) + '<div class="grow"><b>' + P[i].name + '</b><div class="mute">' + (co ? TP.ROLES[i] + ' · ' : '') + 'BVN ••••••• ' + P[i].bvn + ' · Phone •••• ' + P[i].ph + '</div></div>' + chip('Bank verified', 'ok') + '</div>'; }).join('') + '</div>' + banner('info', 'Bank rules always win. Cosigna can only add stricter safety conditions.') + '<div style="flex:1"></div>' + btn('Continue', 'go', 'conditions'));
  };
  V.conditions = function () {
    var co = TP.isCoop(), o = co ? TP.OPT_COOP : TP.OPT, st = S.setup, fm = function (v) { return v + ' min'; };
    return top('Safety conditions', 'rule') + body('<h1>Add stricter conditions</h1>' + banner('info', 'Stricter only. You cannot go below the bank\'s rule.') +
      setc(co ? 'Maximum per payout' : 'Maximum per request', 'max', o.max, TP.mk) + setc('High-value starts at (face check + safety delay)', 'hv', o.hv, TP.mk) + setc('Safety delay for high-value ' + (co ? 'payouts' : 'requests'), 'delay', o.delay, fm) +
      (co ? setc('New-payee cooling-off', 'cool', o.cool, function (v) { return v + ' hours'; }) + setc('Daily payout cap', 'cap', o.cap, TP.mk) : '') +
      '<div class="card"><div class="lab">Always on</div>' + (co ? ['Bank transfers only. No cash payouts', 'Maker-checker: the preparer cannot be the checker', 'The Treasurer checks and cannot prepare', 'Officers cannot approve payouts to themselves', 'Approval reference on every payout', 'Name-verified payees only'] : ['All 3 signers approve (bank rule)', 'Fingerprint or PIN confirmation', 'Single-use, amount-locked cash code']).map(function (x) { return '<div class="item" style="padding:9px 0">' + ic('check', 18) + '<span>' + x + '</span></div>'; }).join('') + '</div><div style="flex:1"></div>' + btn('Send invites', 'sendinv'));
  };
  V.invites = function () {
    var inv = S.setup.inv, n = 1 + inv.B + inv.C, co = TP.isCoop();
    return top(co ? 'Invite officers' : 'Invite signers', 'conditions') + body('<h1>Waiting for everyone</h1><div class="mute">Invites go to the phone numbers the bank has on file. You cannot change them.</div><div class="bar2"><i style="width:' + n / 3 * 100 + '%"></i></div><div class="mute">' + n + ' of 3 verified</div><div class="card">' + TP.IDS.map(function (i) {
      var ok = i === 'A' || inv[i];
      return '<div class="item">' + av(i) + '<div class="grow"><b>' + P[i].name + '</b><div class="mute">' + (co ? TP.ROLES[i] + ' · ' : '') + (i === 'A' ? 'You' : ok ? 'BVN, face, device key and terms done' : 'Invite sent to •••• ' + P[i].ph + ' · expires in 72h') + '</div></div>' + chip(ok ? 'Verified' : 'Invited', ok ? 'ok' : 'pend') + '</div>';
    }).join('') + '</div><div class="card"><b>Each ' + (co ? 'officer' : 'signer') + ' must:</b><div class="mute" style="margin-top:6px">1. Consent to a BVN check<br>2. Pass a face check<br>3. Create a device-bound secret key<br>4. Accept the digital signing terms</div></div>' +
      ['B', 'C'].filter(function (i) { return !inv[i]; }).map(function (i) { return btn('Demo: simulate ' + P[i].short + ' accepting', 'accept', i, 'demo'); }).join('') + '<div style="flex:1"></div>' + btn('Activate with bank', 'activate', undefined, '', n === 3 ? '' : ' disabled'));
  };
  V.activation = function () {
    var co = TP.isCoop();
    if (!S.setup.act) return '<div class="dark" style="justify-content:center;text-align:center"><div class="spin" style="border-color:rgba(255,255,255,.2);border-top-color:#fff"></div><h1 style="font-size:26px">Bank is activating…</h1><div class="mute">Checking every signature and registering your keys.<br>(Simulated)</div></div>';
    return body('<div class="c" style="margin-top:10px"><div class="tick">' + ic('check') + '</div><h1 style="margin-top:16px">' + (co ? 'Cooperative payouts are on' : 'Shared approvals are on') + '</h1><div class="mute">Confirmed by Unity Demo Bank (simulated).</div></div><div class="card row" style="gap:16px">' + ring(1, 92, '#12B76A', '<b style="font-size:22px">' + TP.protection() + '</b><div class="mute" style="font-size:11px">of ' + TP.protection() + '</div>') + '<div class="grow"><h2>Maximum protection</h2><div class="mute">All security checks are active on this account.</div></div></div><div class="card"><div class="item"><span class="grow mute">Reference</span><b>' + S.setup.ref + '</b></div><div class="item"><span class="grow mute">Bank rule</span><b>' + (co ? '2 officers, Treasurer required' : 'All 3 sign') + '</b></div><div class="item"><span class="grow mute">' + (co ? 'Max per payout' : 'Max per request') + '</span><b class="num">' + m(S.setup.max) + '</b></div><div class="item"><span class="grow mute">High-value from</span><b class="num">' + m(S.setup.hv) + '</b></div>' + (co ? '<div class="item"><span class="grow mute">Daily payout cap</span><b class="num">' + m(S.setup.cap) + '</b></div><div class="item"><span class="grow mute">New-payee cooling-off</span><b>' + S.setup.cool + ' hours</b></div>' : '') + '</div>' + banner('warn', 'No real bank is connected. This is a demonstration.', 'alert') + '<div style="flex:1"></div>' + btn('Go to dashboard', 'go', 'home'));
  };

  V.homeJoint = function () {
    var a = TP.acc(), r = TP.active() ? S.req : null, mine = TP.mine(), recent = TP.hl().slice(0, 3), risk = r ? r.risk : null;
    return hdrHome() +
      body(frozenBar() + '<div class="hero"><div class="row sp"><span class="lbl">' + a.name + '</span><span class="chip glass">Shared approvals ON</span></div><div class="amt num">' + m(a.bal) + '</div><div class="lbl">Sample balance · Unity Demo Bank (simulated) •••• ' + a.no + '</div><div class="row wrap" style="margin-top:6px"><span class="chip glass">' + ic('users', 13) + ' All 3 must sign</span><span class="chip glass">' + ic('lock', 13) + ' Bank rule first</span></div></div>' +
        '<div class="row" style="gap:10px">' + btn(ic('plus') + ' Request cash', 'go', 'request', '', S.frozen ? ' disabled' : '') + btn(ic('stop') + ' Freeze', 'sheet', 'freeze', 'redo', (S.frozen ? ' disabled' : '') + ' style="width:42%"') + '</div>' +
        (mine ? '<div class="card" style="background:var(--asoft)"><div class="row">' + av(mine.by) + '<div class="grow"><b>' + TP.nm(mine.by) + ' needs your approval</b><div class="mute">' + m(mine.amt) + ' · AI risk: ' + mine.risk.level + '</div></div></div><div style="height:12px"></div>' + btn('Review request', 'go', 'approve') + '</div>' : '') +
        (r && !mine ? reqCard(r) : '') + linkCard() +
        '<button class="card" style="text-align:left;width:100%" data-a="tab" data-v="security"><div class="row" style="gap:14px">' + ring(1, 64, '#12B76A', ic('shield', 24)) + '<div class="grow"><h2>Maximum protection</h2><div class="mute">' + TP.protection() + ' of ' + TP.protection() + ' security checks on</div></div>' + ic('chev', 18) + '</div></button>' +
        '<button class="card" style="text-align:left;width:100%;background:linear-gradient(135deg,var(--aisoft),#fff)" data-a="sheet" data-v="aihow"><div class="row" style="gap:12px"><div class="ic" style="background:linear-gradient(135deg,var(--ai),var(--blue));color:#fff">' + ic('ai', 20) + '</div><div class="grow"><div class="row" style="gap:8px"><b>AI Risk Watch</b>' + chip('Simulated', 'ai') + '</div><div class="mute">' + (risk ? 'Current request: ' + risk.level + ' risk (' + risk.score + '/100)' : 'Watching 6 signals. No unusual activity.') + '</div></div>' + ic('chev', 18) + '</div></button>' +
        '<div class="card"><div class="row sp"><h2>Recent activity</h2><button class="chip info" style="border:0" data-a="tab" data-v="history">See all</button></div>' + recent.map(reqRow).join('') + '</div><div class="c mute" style="font-size:12px">Prototype only. Simulated bank. No real money.</div>') + nav();
  };
  V.homeCoop = function () {
    var a = TP.acc(), r = TP.active() ? S.req : null, mine = TP.mine(), recent = TP.hl().slice(0, 3), risk = r ? r.risk : null, cf = S.setup, used = cf.paid;
    return hdrHome() +
      body(frozenBar() + '<div class="hero"><div class="row sp"><span class="lbl">' + a.name + '</span><span class="chip glass">Payouts ON</span></div><div class="amt num">' + m(a.bal) + '</div><div class="lbl">Sample pooled funds · Unity Demo Bank (simulated) •••• ' + a.no + '</div><div class="row wrap" style="margin-top:6px"><span class="chip glass">2 officers sign</span><span class="chip glass">Treasurer required</span><span class="chip glass">' + ic('stop', 13) + ' No cash</span></div></div>' +
        '<div class="row" style="gap:10px">' + btn(ic('send') + ' New payout', 'go', 'payout', '', S.frozen ? ' disabled' : '') + btn(ic('stop') + ' Freeze', 'sheet', 'freeze', 'redo', (S.frozen ? ' disabled' : '') + ' style="width:42%"') + '</div>' +
        (mine ? '<div class="card" style="background:var(--asoft)"><div class="row">' + av(mine.by) + '<div class="grow"><b>' + TP.nm(mine.by) + ' needs your approval</b><div class="mute">' + (mine.kind === 'beneficiary' ? 'New payee ' + mine.payee : m(mine.amt) + ' to ' + mine.payee) + ' · AI risk: ' + mine.risk.level + '</div></div></div><div style="height:12px"></div>' + btn('Review request', 'go', 'approve') + '</div>' : '') +
        (r && !mine ? reqCard(r) : '') + linkCard() +
        '<div class="card"><div class="row sp"><b>Daily payout cap</b><span class="mute num">' + m(used) + ' of ' + m(cf.cap) + '</span></div><div class="bar2" style="margin:10px 0 4px"><i style="width:' + Math.min(100, used / cf.cap * 100) + '%"></i></div></div>' +
        '<div class="row" style="gap:10px"><button class="card" style="text-align:left;flex:1;padding:14px" data-a="go" data-v="bens"><div class="ic" style="margin-bottom:8px">' + ic('users', 20) + '</div><b>Payees</b><div class="mute" style="font-size:13px">' + S.bens.length + ' verified</div></button><button class="card" style="text-align:left;flex:1;padding:14px" data-a="go" data-v="rules"><div class="ic" style="margin-bottom:8px">' + ic('doc', 20) + '</div><b>Payout rules</b><div class="mute" style="font-size:13px">Bank + Cosigna</div></button></div>' +
        '<button class="card" style="text-align:left;width:100%" data-a="tab" data-v="security"><div class="row" style="gap:14px">' + ring(1, 64, '#12B76A', ic('shield', 24)) + '<div class="grow"><h2>Maximum protection</h2><div class="mute">' + TP.protection() + ' of ' + TP.protection() + ' security checks on</div></div>' + ic('chev', 18) + '</div></button>' +
        '<button class="card" style="text-align:left;width:100%;background:linear-gradient(135deg,var(--aisoft),#fff)" data-a="sheet" data-v="aihow"><div class="row" style="gap:12px"><div class="ic" style="background:linear-gradient(135deg,var(--ai),var(--blue));color:#fff">' + ic('ai', 20) + '</div><div class="grow"><div class="row" style="gap:8px"><b>AI Risk Watch</b>' + chip('Simulated', 'ai') + '</div><div class="mute">' + (risk ? 'Current request: ' + risk.level + ' risk (' + risk.score + '/100)' : 'Watching payouts. No unusual activity.') + '</div></div>' + ic('chev', 18) + '</div></button>' +
        '<div class="card"><div class="row sp"><h2>Recent activity</h2><button class="chip info" style="border:0" data-a="tab" data-v="history">See all</button></div>' + recent.map(reqRow).join('') + '</div><div class="c mute" style="font-size:12px">Prototype only. Simulated bank. No real money.</div>') + nav();
  };
  V.home = function () { return TP.isCoop() ? V.homeCoop() : V.homeJoint(); };
  V.request = function () {
    var amt = Number(S.amt), err = S.amt ? TP.check(amt) : '', hv = amt && TP.isHV(amt), risk = amt && !err ? TP.risk({ amt: amt, ch: S.ch, hour: new Date().getHours() }) : null;
    var req = [['All 3 approve', true], ['Fingerprint/PIN', true], ['Face check', hv], ['Safety delay', hv]];
    return top('Request cash', 'home') + body(frozenBar() + '<div class="c mute" style="margin-top:2px">How much do you need?</div><div class="big num">' + m(S.amt || 0) + '</div><div class="c" style="font-size:13px;font-weight:700;color:' + (err ? 'var(--red)' : 'var(--mute)') + '">' + (err || 'Up to ' + m(S.setup.max) + ' per request') + '</div>' +
      '<div class="chips" style="justify-content:center">' + TP.CHIPS.map(function (v) { return '<button data-a="amt" data-v="' + v + '" class="' + (amt === v ? 'on' : '') + '">' + TP.mk(v) + '</button>'; }).join('') + '</div>' +
      '<div class="seg"><button data-a="ch" data-v="POS" class="' + (S.ch === 'POS' ? 'on' : '') + '">POS / ATM agent</button><button data-a="ch" data-v="BR" class="' + (S.ch === 'BR' ? 'on' : '') + '">Bank branch</button></div>' +
      '<div class="row wrap" style="justify-content:center">' + req.map(function (x) { return chip((x[1] ? ic('check', 12) : '') + ' ' + x[0], x[1] ? (x[0] === 'Face check' || x[0] === 'Safety delay' ? 'pend' : 'ok') : 'gray'); }).join('') + '</div>' +
      (risk ? aiCard(risk, 'the group', true) : '') +
      '<div class="pad">' + ['1', '2', '3', '4', '5', '6', '7', '8', '9', '000', '0', '⌫'].map(function (k) { return '<button data-a="key" data-v="' + k + '">' + k + '</button>'; }).join('') + '</div>' + btn('Continue', 'sheet', 'review', '', amt && !err ? '' : ' disabled'));
  };
  V.track = function () {
    var r = S.req; if (!r) return V.home();
    var b = TP.status(r), me = S.user === r.by, pend = TP.needOf(r).filter(function (i) { return r.ap[i] === 'pending' && i !== S.user; }), acts = '', w = r.kind === 'withdrawal';
    if (r.st === 'pending') {
      if (TP.mine()) acts += btn('Review and approve', 'go', 'approve');
      pend.forEach(function (i) { acts += btn('Demo: switch to ' + P[i].short + '\'s phone' + (r.acct === 'coop' ? ' (' + TP.ROLES[i] + ')' : ''), 'as', i, 'demo', ' data-s="approve"'); });
      if (me) acts += btn('Cancel request', 'sheet', 'cancel', 'redo');
    }
    if (r.st === 'delay') acts += btn('View safety delay', 'go', 'delay');
    if (r.st === 'code' && me) acts += btn('Show my cash code', 'go', 'code', 'green');
    if (r.st === 'sent' || (r.st === 'done' && r.kind === 'beneficiary')) acts += btn('View receipt', 'go', 'done', 'green');
    if ((r.st === 'delay' || r.st === 'code') && !me) acts += btn('Demo: back to ' + P[r.by].short + '\'s phone', 'as', r.by, 'demo', ' data-s="track"');
    if (r.st === 'rejected' || r.st === 'cancelled' || r.st === 'sent' || r.st === 'done') acts += btn('Back to dashboard', 'go', 'home', 'sec');
    return top('Approval tracking', 'home') + body('<div class="c"><div class="big num" style="font-size:' + (r.kind === 'beneficiary' ? 28 : 40) + 'px">' + (r.kind === 'beneficiary' ? r.payee : m(r.amt)) + '</div><div class="row wrap" style="justify-content:center">' + chip(b[0], b[1]) + (r.hv ? chip('High value', 'pend') : '') + chip(ic('ai', 12) + ' AI risk: ' + r.risk.level, 'ai') + '</div>' + (r.kind === 'payout' ? '<div class="mute" style="margin-top:8px">' + r.payType + ' to ' + r.payee + '</div>' : '') + '</div><div class="card">' + steps(r) + '</div><div class="card"><h2>' + (w ? 'Signers' : 'Officers') + '</h2>' + signers(r) + '</div>' + acts);
  };
  V.approve = function () {
    var r = S.req; if (!r) return V.home();
    var w = r.kind === 'withdrawal', na = r.ap[S.user] === 'na', needs = r.kind === 'beneficiary' ? ['Preparer + Treasurer approve (bank rule)', 'Fingerprint or PIN', 'Signed on your device'] : w ? TP.needs(r.amt) : TP.needsPay(r.amt, r.officer);
    var head = w ? '<div class="mute" style="margin-top:10px">' + P[r.by].name + ' is asking for</div><div class="big num" style="color:var(--navy2)">' + m(r.amt) + '</div>' + chip(r.ch === 'POS' ? 'POS / ATM' : 'Branch pickup', 'info') :
      r.kind === 'payout' ? '<div class="mute" style="margin-top:10px">' + P[r.by].name + ' (' + TP.ROLES[r.by] + ') prepared a payout of</div><div class="big num" style="color:var(--navy2)">' + m(r.amt) + '</div>' + chip(r.payType, 'sec') :
        '<div class="mute" style="margin-top:10px">' + P[r.by].name + ' proposed a new payee</div><div class="big" style="color:var(--navy2);font-size:30px">' + r.payee + '</div>' + chip('Name verified with the bank', 'ok');
    var det = r.kind === 'payout' ? '<div class="card"><h2>Payout details</h2><div class="item"><span class="grow mute">Payee</span><b>' + r.payee + '</b></div><div class="item"><span class="grow mute">Name check</span>' + chip('Verified (simulated)', 'ok') + '</div><div class="item"><span class="grow mute">Reference</span><b>' + r.refNo + '</b></div>' + (r.per ? '<div class="item"><span class="grow mute">Per member</span><b class="num">' + m(r.per) + '</b></div>' : '') + '<div class="item"><span class="grow mute">Payment type</span><b>Bank transfer (no cash)</b></div></div>' : r.kind === 'beneficiary' ? '<div class="card"><h2>Payee details</h2><div class="item"><span class="grow mute">Bank</span><b>' + r.bdata.bank + '</b></div><div class="item"><span class="grow mute">Account</span><b>•••• ' + r.bdata.no + '</b></div><div class="item"><span class="grow mute">Type</span><b>' + r.bdata.kind + '</b></div><div class="item"><span class="grow mute">Cooling-off</span><b>' + S.setup.cool + ' hours before the first payout</b></div></div>' : '';
    return top('Approval request', 'home') + body('<div class="c"><div style="display:grid;place-items:center">' + av(r.by, 'xl') + '</div>' + head + '</div>' + det + aiCard(r.risk, P[r.by].short) +
      '<div class="card"><h2>Required checks</h2>' + needs.map(function (n) { return '<div class="item" style="padding:8px 0">' + ic('check', 18) + '<span>' + n + '</span></div>'; }).join('') + '</div>' +
      (S.cur === 'coop' && S.user === 'C' && TP.mine() ? banner('info', 'You are the Treasurer. The bank mandate needs your approval on every payout.', 'lock') : '') +
      (TP.mine() ? btn(ic('fp') + ' Approve', 'vstart', 'approve') + btn('Reject', 'sheet', 'reject', 'sec') + btn('This is not me: freeze', 'sheet', 'freeze', 'redo') : banner('info', na ? 'You are not an approver on this request' + (r.officer === S.user ? ' because you are the payee.' : '.') : 'You have already responded to this request.', 'check') + btn('Back to tracking', 'go', 'track')));
  };
  V.delay = function () {
    var r = S.req; if (!r) return V.home();
    var pay = r.kind === 'payout';
    return top('Safety delay', 'track') + body('<div class="c mute">All approvers approved ' + m(r.amt) + '. The ' + (pay ? 'payout is sent' : 'code is released') + ' when the timer ends.</div><div style="display:grid;place-items:center">' + ring(1, 230, '#F79009', '<div class="timer num" style="color:#B54708" data-count="' + (r.delayStart + r.delayMs) + '" data-mode="delay">--:--</div><div class="mute" style="margin-top:6px">until the ' + (pay ? 'payout is sent' : 'code is released') + '</div>', ' data-ring="' + r.delayStart + ',' + r.delayMs + '"') + '</div>' + banner('warn', 'Any ' + (pay ? 'officer' : 'signer') + ' can stop this ' + (pay ? 'payout' : 'withdrawal') + ' until the timer ends.', 'clock') + '<div class="card">' + signers(r) + '</div><div style="flex:1"></div>' + btn(ic('stop') + ' Stop this ' + (pay ? 'payout' : 'withdrawal'), 'sheet', 'stop', 'red') + (S.user !== r.by ? btn('Demo: back to ' + P[r.by].short + '\'s phone', 'as', r.by, 'demo', ' data-s="delay"') : '') + btn('Demo: skip the delay', 'skipdelay', undefined, 'demo'));
  };
  V.code = function () {
    var r = S.req; if (!r) return V.home();
    if (r.st !== 'code') return V.track();
    if (S.user !== r.by) return top('Cash code', 'track') + body(banner('info', 'Only ' + P[r.by].short + ' can see this one-time code.', 'lock') + btn('Back to tracking', 'go', 'track'));
    return top('One-time cash code', 'track') + body('<div class="ticket"><div class="head"><div class="row sp"><b>Cash code</b>' + chip('<span data-count="' + (r.codeAt + 900000) + '" data-mode="code">15:00</span> left', 'pend') + '</div><div style="font-size:30px;font-weight:800;margin-top:4px" class="num">' + m(r.amt) + '</div><div style="opacity:.8;font-size:13px">Amount-locked · works once</div></div><div style="padding:18px">' + (S.reveal ? '<div class="mono">' + r.code + '</div><div style="margin:14px 0">' + qr(r.code) + '</div>' : '<div class="mono blur">0000 0000</div><div style="margin:14px 0;opacity:.2">' + qr('x') + '</div>') + '</div><div class="cut"></div><div style="padding:6px 18px 14px"><div class="item"><span class="grow mute">Use at</span><b>' + (r.ch === 'POS' ? 'POS agent or ATM' : 'Bank teller') + '</b></div><div class="item"><span class="grow mute">Approved by</span><b>' + TP.names(TP.others(r.by)) + '</b></div></div></div>' +
      (S.reveal ? banner('info', 'Works once. Never share it by call or chat. Cosigna will never ask for it.', 'lock') : btn(ic('fp') + ' Tap to reveal with fingerprint', 'reveal')) + '<div style="flex:1"></div>' + (S.reveal ? btn('I have my cash', 'complete', undefined, 'green') : '') + btn('Cancel code', 'sheet', 'cancel', 'redo'));
  };
  V.doneJoint = function () {
    var r = S.lastDone; if (!r) return V.home();
    var cf = ''; for (var i = 0; i < 26; i++) cf += '<i style="left:' + (Math.random() * 100).toFixed(1) + '%;background:' + ['#2F6BFF', '#12B76A', '#F79009', '#7C5CFF'][i % 4] + ';animation-delay:' + (Math.random() * .9).toFixed(2) + 's"></i>';
    return '<div class="conf">' + cf + '</div>' + body('<div class="c" style="margin-top:14px"><div class="tick">' + ic('check') + '</div><h1 style="margin-top:16px">Cash collected</h1><div class="mute">Everyone was notified.</div></div><div class="card"><div class="item"><span class="grow mute">Amount</span><b class="num">' + m(r.amt) + '</b></div><div class="item"><span class="grow mute">Approved by</span><b>3 of 3 signers</b></div><div class="item"><span class="grow mute">Security checks</span><b>' + (r.hv ? 'Fingerprint, face, delay' : 'Fingerprint / PIN') + '</b></div><div class="item"><span class="grow mute">AI risk</span>' + chip(r.risk.level + ' · ' + r.risk.score, r.risk.cls) + '</div><div class="item"><span class="grow mute">Audit chain</span>' + chip(ic('check', 12) + ' Verified #' + r.ref.slice(0, 6), 'ok') + '</div></div><div style="flex:1"></div>' + btn('Back to dashboard', 'go', 'home') + btn('View audit trail', 'go', 'history', 'sec'));
  };
  V.doneCoop = function () {
    var r = S.lastDone; if (!r) return V.home();
    var cf = ''; for (var i = 0; i < 26; i++) cf += '<i style="left:' + (Math.random() * 100).toFixed(1) + '%;background:' + ['#2F6BFF', '#12B76A', '#F79009', '#7C5CFF'][i % 4] + ';animation-delay:' + (Math.random() * .9).toFixed(2) + 's"></i>';
    var ben = r.kind === 'beneficiary', apr = TP.needOf(r).map(function (i) { return TP.nm(i) + ' (' + TP.ROLES[i] + ')'; }).join(', ');
    return '<div class="conf">' + cf + '</div>' + body('<div class="c" style="margin-top:14px"><div class="tick">' + ic('check') + '</div><h1 style="margin-top:16px">' + (ben ? 'Payee approved' : 'Payout sent') + '</h1><div class="mute">' + (ben ? 'Cooling-off of ' + S.setup.cool + ' hours has started.' : 'Bank transfer sent (simulated). All officers were notified.') + '</div></div><div class="card">' +
      (ben ? '<div class="item"><span class="grow mute">Payee</span><b>' + r.payee + '</b></div><div class="item"><span class="grow mute">Bank</span><b>' + r.bdata.bank + '</b></div>' : '<div class="item"><span class="grow mute">Amount</span><b class="num">' + m(r.amt) + '</b></div><div class="item"><span class="grow mute">Payee</span><b>' + r.payee + '</b></div><div class="item"><span class="grow mute">Type</span><b>' + r.payType + '</b></div><div class="item"><span class="grow mute">Reference</span><b>' + r.refNo + '</b></div><div class="item"><span class="grow mute">Bank session</span><b style="font-family:ui-monospace,monospace">' + r.session + '</b></div>') +
      '<div class="item"><span class="grow mute">Approved by</span><b style="text-align:right">' + apr + '</b></div><div class="item"><span class="grow mute">AI risk</span>' + chip(r.risk.level + ' · ' + r.risk.score, r.risk.cls) + '</div><div class="item"><span class="grow mute">Audit chain</span>' + chip(ic('check', 12) + ' Verified #' + r.ref.slice(0, 6), 'ok') + '</div></div><div style="flex:1"></div>' + btn('Back to dashboard', 'go', 'home') + btn('View audit trail', 'go', 'history', 'sec'));
  };
  V.done = function () { var r = S.lastDone; return r && r.acct === 'coop' ? V.doneCoop() : V.doneJoint(); };
  V.approvals = function () {
    var r = S.req, past = TP.hl().filter(function (x) { return x.type === 'req' && x !== r; }).slice(0, 4);
    return topA('Approvals') + body(frozenBar() + (r && TP.active() ? '<h2>In progress</h2>' + (TP.mine() ? '<div class="card" style="background:var(--asoft)"><b>' + TP.nm(r.by) + ' needs your approval</b><div class="mute">' + (r.kind === 'beneficiary' ? 'New payee ' + r.payee : m(r.amt)) + ' · AI risk: ' + r.risk.level + '</div><div style="height:12px"></div>' + btn('Review request', 'go', 'approve') + '</div>' : '') + reqCard(r) : '<div class="card c" style="padding:30px 16px"><div class="tick" style="width:64px;height:64px;margin-bottom:12px">' + ic('check', 30) + '</div><b>All caught up</b><div class="mute">No approvals are waiting.</div></div>') + '<div class="card"><h2>Recently decided</h2>' + (past.length ? past.map(reqRow).join('') : '<div class="mute" style="padding:12px 0">Nothing yet.</div>') + '</div>') + nav();
  };
  V.history = function () {
    var f = S.filter, list = TP.hl().filter(function (x) {
      var b = TP.status(x)[0]; return f === 'All' || (f === 'Pending' && (b === 'Pending' || b === 'Safety delay')) || (f === 'Approved' && (b === 'Approved' || b === 'Completed' || b === 'Paid')) || (f === 'Rejected' && (b === 'Rejected' || b === 'Cancelled')) || (f === 'Security' && x.type === 'sec');
    });
    return topA('Activity and audit') + body('<div class="chips">' + ['All', 'Pending', 'Approved', 'Rejected', 'Security'].map(function (x) { return '<button data-a="filter" data-v="' + x + '" class="' + (f === x ? 'on' : '') + '">' + x + '</button>'; }).join('') + '</div><div class="card" style="padding:4px 16px">' + (list.length ? list.map(reqRow).join('') : '<div class="mute c" style="padding:20px">Nothing here yet.</div>') + '</div>' + banner('info', 'Every record is chained to the one before it, so edits would be detected (simulated).', 'chain')) + nav();
  };
  V.alerts = function () {
    var l = S.notes.filter(vis), col = { ok: 'var(--green)', pend: 'var(--amber)', bad: 'var(--red)', info: 'var(--blue)' };
    return top('Alerts', 'home') + body('<div class="row sp"><div class="mute">Every step is announced to every signer.</div><button class="chip info" style="border:0" data-a="readall">Mark all read</button></div><div class="card" style="padding:4px 16px">' + (l.length ? l.map(function (n) {
      return '<button class="item" data-a="read" data-v="' + n.id + '"><div class="ic" style="background:' + col[n.k] + ';color:#fff;width:38px;height:38px">' + ic(n.k === 'bad' ? 'alert' : n.k === 'ok' ? 'check' : n.k === 'pend' ? 'clock' : 'bell', 18) + '</div><div class="grow"><b>' + n.title + '</b><div class="mute">' + n.body + '</div><div class="mute" style="font-size:12px">' + n.t + '</div></div>' + (n.read ? '' : '<span style="width:10px;height:10px;border-radius:50%;background:var(--blue)"></span>') + '</button>';
    }).join('') : '<div class="mute c" style="padding:20px">No alerts.</div>') + '</div>');
  };
  V.security = function () {
    var list = TP.protList(), n = list.length, groups = [];
    list.forEach(function (p) { if (groups.indexOf(p[3]) < 0) groups.push(p[3]); });
    return topA('Security Center') + body('<div class="hero"><div class="row" style="gap:16px">' + ring(1, 96, '#32D583', '<b style="font-size:26px" class="num">' + n + '</b><div style="font-size:11px;opacity:.8">of ' + n + '</div>').replace('class="ring"', 'class="ring" style="color:#fff;width:96px;height:96px"') + '<div class="grow"><h2 style="color:#fff;font-size:20px">Maximum protection</h2><div class="lbl">Every check below is on for this ' + (TP.isCoop() ? 'cooperative account' : 'joint account') + '.</div></div></div></div>' +
      groups.map(function (g) {
        return '<div class="card"><h2>' + g + '</h2>' + list.filter(function (p) { return p[3] === g; }).map(function (p) {
          return '<div class="item"><div class="ic" style="' + (p[0] === 'ai' ? 'background:linear-gradient(135deg,var(--ai),var(--blue));color:#fff' : '') + '">' + ic(p[0], 20) + '</div><div class="grow"><b>' + p[1] + '</b><div class="mute" style="font-size:13px">' + p[2] + '</div></div>' + chip('On', 'ok') + '</div>';
        }).join('') + '</div>';
      }).join('') + '<div class="mute c" style="font-size:12px">Prototype: all checks are simulated. Some need a real bank partner.</div>') + nav();
  };
  V.profile = function () {
    var a = TP.acc(), p = P[S.user], f = S.frozen, co = TP.isCoop(), st = S.setup;
    return top('Profile', 'home') + body(
      '<div class="card row">' + av(S.user, 'xl') + '<div class="grow"><h2 style="font-size:20px">' + p.name + '</h2><div class="mute">' + (co ? TP.ROLES[S.user] + ' · ' : '') + 'Signer</div><div class="row wrap" style="margin-top:6px">' + chip(ic('check', 12) + ' Verified', 'ok') + chip(ic('key', 12) + ' Device bound', 'ok') + '</div></div></div>' +
      '<div class="card"><div class="item"><span class="grow mute">BVN</span><b>••••••• ' + p.bvn + '</b></div><div class="item"><span class="grow mute">Phone</span><b>•••• ' + p.ph + '</b></div><div class="item"><span class="grow mute">Face check</span>' + chip('Passed', 'ok') + '</div><div class="item"><span class="grow mute">Secret key</span>' + chip('In secure chip', 'ok') + '</div></div>' +
      '<div class="card"><h2>My accounts</h2>' + ['joint', 'coop'].map(function (id) { var x = TP.ACC[id], on = TP.linked(id); return '<button class="item" data-a="' + (on ? 'swacct' : 'linknew') + '" data-v="' + id + '"><div class="ic">' + ic(id === 'coop' ? 'users' : 'lock', 20) + '</div><div class="grow"><b>' + x.name + '</b><div class="mute">' + (id === 'coop' ? 'Cooperative · payouts' : 'Joint · withdrawals') + '</div></div>' + chip(S.cur === id ? 'Current' : on ? 'Switch' : 'Link', S.cur === id ? 'info' : on ? 'ok' : 'pend') + '</button>'; }).join('') + '</div>' +
      '<div class="card"><div class="row sp"><h2>' + a.short + '</h2>' + chip(f ? 'Frozen' : 'Active', f ? 'bad' : 'ok') + '</div><div class="item"><span class="grow mute">Name</span><b style="text-align:right">' + a.name + '</b></div><div class="item"><span class="grow mute">Bank</span><b>Unity Demo Bank (simulated)</b></div><div class="item"><span class="grow mute">Account</span><b>•••• ' + a.no + '</b></div><div class="item"><span class="grow mute">Bank rule</span><b style="text-align:right">' + (co ? '2 officers, Treasurer required' : 'All 3 sign') + '</b></div><div class="item"><span class="grow mute">' + (co ? 'Max per payout' : 'Max per request') + '</span><b class="num">' + m(st.max) + '</b></div><div class="item"><span class="grow mute">High-value from</span><b class="num">' + m(st.hv) + '</b></div><div class="item"><span class="grow mute">Safety delay</span><b>' + st.delay + ' min</b></div>' + (co ? '<div class="item"><span class="grow mute">Daily payout cap</span><b class="num">' + m(st.cap) + '</b></div><div class="item"><span class="grow mute">New-payee cooling-off</span><b>' + st.cool + ' hours</b></div>' : '') + '</div>' +
      '<div class="card"><h2>' + (co ? 'Officers' : 'Signers') + '</h2>' + TP.IDS.map(function (i) { return '<div class="item">' + av(i) + '<div class="grow"><b>' + P[i].name + '</b><div class="mute">' + (co ? TP.ROLES[i] + ' · ' : '') + 'BVN ••••••• ' + P[i].bvn + '</div></div>' + chip(i === S.user ? 'You' : 'Verified', i === S.user ? 'info' : 'ok') + '</div>'; }).join('') + '</div>' +
      (f ? '<div class="card" style="box-shadow:0 0 0 2px var(--red)"><h2 style="color:var(--red)">Frozen by ' + TP.nm(f.by) + '</h2><div class="mute">Unfreezing needs all 3.</div>' + TP.IDS.map(function (i) { return '<div class="item">' + av(i) + '<div class="grow"><b>' + P[i].short + '</b></div>' + chip(f.un[i] ? 'Approved' : 'Waiting', f.un[i] ? 'ok' : 'pend') + '</div>'; }).join('') + btn('Approve unfreeze', 'vstart', 'unfreeze', 'green', f.un[S.user] ? ' disabled' : '') + '</div>' : btn(ic('stop') + ' Freeze ' + (co ? 'payouts' : 'withdrawals') + ' (emergency)', 'sheet', 'freeze', 'red')) +
      '<div class="card" style="box-shadow:0 0 0 1.5px #F9DBAF"><h2>Demo tools</h2><div class="mute" style="margin:4px 0 10px">Switch between the 3 sample ' + (co ? 'officers' : 'signers') + '.</div>' + TP.IDS.filter(function (i) { return i !== S.user; }).map(function (i) { return btn('View as ' + P[i].name + (co ? ' (' + TP.ROLES[i] + ')' : ''), 'as', i, 'demo', ' data-s="home"'); }).join('<div style="height:8px"></div>') + '<div style="height:8px"></div>' + btn('Reset demo', 'sheet', 'reset', 'sec') + '</div>' +
      btn('Sign out', 'sheet', 'logout', 'sec') + '<div class="c mute" style="font-size:12px">Cosigna prototype v3.0 · Sample data only</div>');
  };

  TP.sheet = function () {
    var k = S.sheet; if (!k) return '';
    var b = '', d = k.split(':');
    if (k === 'review') {
      var amt = Number(S.amt), risk = TP.risk({ amt: amt, ch: S.ch, hour: new Date().getHours() });
      b = '<h1 style="font-size:24px">Review request</h1><div class="card" style="box-shadow:none;border:1px solid var(--line)"><div class="item"><span class="grow mute">Amount</span><b class="num">' + m(amt) + '</b></div><div class="item"><span class="grow mute">Payout</span><b>' + (S.ch === 'POS' ? 'POS / ATM agent' : 'Bank branch') + '</b></div><div class="item"><span class="grow mute">Needs approval from</span><b>' + TP.names(TP.others(S.user)) + '</b></div><div class="item"><span class="grow mute">AI risk</span>' + chip(risk.level + ' · ' + risk.score, risk.cls) + '</div></div><div class="card" style="box-shadow:none;border:1px solid var(--line)"><div class="lab">Required checks</div>' + TP.needs(amt).map(function (n) { return '<div class="item" style="padding:8px 0">' + ic('check', 18) + '<span>' + n + '</span></div>'; }).join('') + '</div>' + (amt > 500000 && S.ch === 'POS' ? banner('warn', 'Cash above ₦500,000 may attract bank or CBN cash limits and fees. For large amounts, choose branch pickup.', 'alert') : '') + btn('Verify and send', 'vstart', 'send');
    } else if (k === 'reject') {
      b = '<h1 style="font-size:24px">Reject this request?</h1><div class="chips">' + ['Amount not agreed', 'Not approved by committee', 'Looks suspicious'].map(function (x) { return '<button data-a="rr" data-v="' + x + '" class="' + (S.rr === x ? 'on' : '') + '">' + x + '</button>'; }).join('') + '</div><div class="mute">The request closes and no code is issued.</div>' + btn('Reject request', 'reject', undefined, 'red') + btn('Keep it open', 'close', undefined, 'sec');
    } else if (k === 'cancel') {
      b = '<h1 style="font-size:24px">Cancel this?</h1><div class="mute">Everyone will be told. Any unused cash code stops working.</div>' + btn('Cancel it', 'cancelreq', undefined, 'red') + btn('Keep it', 'close', undefined, 'sec');
    } else if (k === 'stop') {
      b = '<h1 style="font-size:24px">Stop this withdrawal?</h1><div class="mute">Any signer can stop it during the safety delay. No code will be issued.</div>' + btn('Stop withdrawal', 'stopreq', undefined, 'red') + btn('Keep waiting', 'close', undefined, 'sec');
    } else if (k === 'freeze') {
      b = '<div class="c"><div class="tick" style="width:64px;height:64px;background:linear-gradient(135deg,#F97066,var(--red))">' + ic('alert', 30) + '</div><h1 style="font-size:24px;margin-top:12px">Freeze all ' + (TP.isCoop() ? 'payouts' : 'withdrawals') + '?</h1></div><div class="mute">Emergency stop. All signers are alerted, any active request is cancelled, and unfreezing needs all 3 signers.</div>' + btn('Freeze now', 'dofreeze', undefined, 'red') + btn('Keep active', 'close', undefined, 'sec');
    } else if (k === 'logout') {
      b = '<h1 style="font-size:24px">Sign out of Cosigna?</h1><div class="mute">Your setup stays saved in this demo. You will need your PIN to log back in.</div>' + btn('Sign out', 'logout', undefined, 'red') + btn('Stay signed in', 'close', undefined, 'sec');
    } else if (k === 'reset') {
      b = '<h1 style="font-size:24px">Reset the demo?</h1><div class="mute">This clears all sample progress and returns to the welcome screen.</div>' + btn('Reset', 'reset', undefined, 'red') + btn('Cancel', 'close', undefined, 'sec');
    } else if (k === 'aihow') {
      b = '<div class="row" style="gap:12px"><div class="ic" style="width:48px;height:48px;background:linear-gradient(135deg,var(--ai),var(--blue));color:#fff">' + ic('ai', 24) + '</div><div><h1 style="font-size:22px">AI Risk Warning</h1><div class="mute">Checks every request before anyone approves.</div></div></div><div class="card" style="box-shadow:none;border:1px solid var(--line)"><div class="lab">It looks at</div>' + ['Amount compared with your usual withdrawals', 'High-value rules and payout type', 'Whether the cash point is new to the group', 'Time of day', 'Known device and verified signer'].map(function (x) { return '<div class="item" style="padding:8px 0">' + ic('check', 18) + '<span>' + x + '</span></div>'; }).join('') + '</div><div class="row wrap">' + chip('Low · under 25', 'ok') + chip('Medium · 25 to 54', 'pend') + chip('High · 55 and above', 'bad') + '</div>' + banner('ai', 'It advises, and never decides. The signers and the bank decide.', 'ai') + banner('warn', 'In this prototype the check is simulated with simple rules. A real model would learn from account history.', 'info') + btn('Got it', 'close', undefined, 'sec');
    } else if (k === 'accts') {
      b = '<h1 style="font-size:24px">Your accounts</h1>' + ['joint', 'coop'].map(function (id) { var x = TP.ACC[id], on = TP.linked(id), cur = S.cur === id; return '<button class="card" style="text-align:left;box-shadow:' + (cur ? '0 0 0 2px var(--blue)' : '0 0 0 1.5px var(--line)') + '" data-a="' + (on ? 'swacct' : 'linknew') + '" data-v="' + id + '"><div class="row sp"><b>' + x.name + '</b>' + chip(cur ? 'Current' : on ? 'Linked' : 'Not linked', cur ? 'info' : on ? 'ok' : 'pend') + '</div><div class="mute">' + (id === 'coop' ? 'Cooperative · payouts only' : 'Joint account · withdrawals') + ' · •••• ' + x.no + '</div></button>'; }).join('') + btn('Close', 'close', undefined, 'sec');
    } else if (k === 'payreview') {
      var pc = TP.payCheck(), pt = TP.payType(), tot = pc.tot, hv = TP.isHV(tot), off = pc.ben && pc.ben.officer || null, need = TP.payNeed(hv, S.user, off);
      var rk = TP.riskPay({ amt: tot, hv: hv, recent: pc.ben && pc.ben.recent, officer: !!off, dup: pc.dup, div: pc.div, hour: new Date().getHours() });
      b = '<h1 style="font-size:24px">Review payout</h1><div class="card" style="box-shadow:none;border:1px solid var(--line)"><div class="item"><span class="grow mute">Type</span><b>' + pt[1] + '</b></div><div class="item"><span class="grow mute">Payee</span><b>' + (pc.div ? 'All members (' + TP.MEMBERS.length + ')' : pc.ben.name) + '</b></div><div class="item"><span class="grow mute">' + pt[2] + '</span><b>' + S.payForm.ref + '</b></div><div class="item"><span class="grow mute">Amount</span><b class="num">' + m(tot) + '</b></div><div class="item"><span class="grow mute">Approvers</span><b style="text-align:right">' + need.map(function (i) { return TP.nm(i) + ' (' + TP.ROLES[i] + ')'; }).join(', ') + '</b></div><div class="item"><span class="grow mute">AI risk</span>' + chip(rk.level + ' · ' + rk.score, rk.cls) + '</div></div>' +
        '<div class="card" style="box-shadow:none;border:1px solid var(--line)"><div class="lab">Payout rules</div>' + pc.rules.map(function (x) { return '<div class="item" style="padding:7px 0"><div style="color:' + (x[1] ? 'var(--green)' : 'var(--red)') + '">' + ic(x[1] ? 'check' : 'x', 18) + '</div><span>' + x[0] + '</span></div>'; }).join('') + '</div>' + (off ? banner('warn', TP.nm(off) + ' is the payee, so ' + TP.nm(off) + ' cannot approve this payout.', 'alert') : '') + (pc.dup ? banner('bad', 'Same payee and amount already paid today. Check it is not a duplicate.', 'alert') : '') + (hv ? banner('warn', 'High-value: all required officers approve with a face check, then a ' + S.setup.delay + '-minute safety delay.', 'clock') : '') + btn('Verify and send for approval', 'vstart', 'payout');
    } else if (d[0] === 'detail') {
      var x = S.hist.filter(function (h) { return h.id === d[1]; })[0]; if (!x) return '';
      var st = TP.status(x), w = x.kind === 'withdrawal';
      b = '<div class="row sp"><h1 style="font-size:24px">' + (x.type === 'sec' ? x.title : x.kind === 'beneficiary' ? x.payee : m(x.amt)) + '</h1>' + chip(st[0], st[1]) + '</div>' + (x.type === 'req' ? '<div class="card" style="box-shadow:none;border:1px solid var(--line)"><div class="item"><span class="grow mute">' + (w ? 'Requested by' : 'Prepared by') + '</span><b>' + P[x.by].name + '</b></div>' + (w ? '<div class="item"><span class="grow mute">Payout</span><b>' + (x.ch === 'POS' ? 'POS / ATM' : 'Bank branch') + '</b></div>' : '<div class="item"><span class="grow mute">Type</span><b>' + x.payType + '</b></div><div class="item"><span class="grow mute">Payee</span><b>' + x.payee + '</b></div>' + (x.refNo ? '<div class="item"><span class="grow mute">Reference</span><b>' + x.refNo + '</b></div>' : '')) + (x.session ? '<div class="item"><span class="grow mute">Bank session</span><b style="font-family:ui-monospace,monospace">' + x.session + '</b></div>' : '') + '<div class="item"><span class="grow mute">Checks</span><b>' + (x.hv ? 'Fingerprint + face + delay' : 'Fingerprint / PIN') + '</b></div><div class="item"><span class="grow mute">AI risk</span>' + chip(x.risk.level + ' · ' + x.risk.score, x.risk.level === 'Low' ? 'ok' : x.risk.level === 'Medium' ? 'pend' : 'bad') + '</div>' + (x.reason ? '<div class="item"><span class="grow mute">Reason</span><b>' + x.reason + '</b></div>' : '') + '</div><div class="card" style="box-shadow:none;border:1px solid var(--line)"><h2>Approvers</h2>' + signers(x) + '</div>' : '') + '<div class="card" style="box-shadow:none;border:1px solid var(--line)"><h2>Audit trail</h2><div style="height:8px"></div>' + audit(x) + '<div class="row" style="gap:8px">' + chip(ic('check', 12) + ' Chain verified', 'ok') + '<span class="mute" style="font-size:12px">Ref ' + x.ref + ' (simulated)</span></div></div>' + btn('Close', 'close', undefined, 'sec');
    }
    return '<div class="shade" data-a="close"></div><div class="sheet"><div class="grab"></div>' + b + '</div>';
  };

  // ---------- cooperative: payouts, payees, rulebook
  function benRow(b, f) {
    var cool = b.cool > Date.now(), sel = f && f.ben === b.id;
    return '<button class="item" style="' + (cool ? 'opacity:.6' : '') + '" data-a="' + (f ? (cool ? 'pcool' : 'pben') : 'pcool') + '" data-v="' + b.id + '"><div class="ic" style="' + (sel ? 'background:var(--blue);color:#fff' : '') + '">' + ic(sel ? 'check' : 'user', 20) + '</div><div class="grow"><b>' + b.name + '</b><div class="mute">' + b.bank + ' •••• ' + b.no + ' · ' + b.kind + '</div></div>' + (cool ? chip('Cooling-off ' + TP.coolLeft(b) + 'h', 'pend') : b.officer ? chip('Officer', 'sec') : chip(ic('check', 12) + ' Verified', 'ok')) + '</button>';
  }
  V.payout = function () {
    var f = S.payForm, t = TP.payType(), div = f.type === 'div', ex = { loan: 'LN-0231', div: 'AGM/2026/04', sup: 'INV-901', refund: 'EX-077' }[f.type];
    return top('New payout', 'home') + body(frozenBar() + banner('info', 'Cooperative accounts pay by bank transfer only. There is no cash withdrawal.', 'bank') +
      '<div class="card"><div class="lab">What is this payout for?</div><div class="chips">' + TP.PAYTYPES.map(function (x) { return '<button data-a="ptype" data-v="' + x[0] + '" class="' + (f.type === x[0] ? 'on' : '') + '">' + x[1] + '</button>'; }).join('') + '</div></div>' +
      (div ? '<div class="card"><div class="row sp"><h2>All members (' + TP.MEMBERS.length + ')</h2>' + chip(ic('check', 12) + ' Names verified', 'ok') + '</div><div class="mute" style="margin-top:6px">' + TP.MEMBERS.join(', ') + '</div></div>' :
        '<div class="card" style="padding:12px 16px"><div class="row sp"><h2>Who is being paid?</h2><button class="chip info" style="border:0" data-a="go" data-v="addben">+ New payee</button></div>' + S.bens.map(function (b) { return benRow(b, f); }).join('') + '</div>') +
      '<div><div class="lab">' + t[2] + '</div><input class="field" data-pf="ref" value="' + f.ref + '" placeholder="e.g. ' + ex + '"></div><div class="mute" style="font-size:13px">Every payout must cite an approval: a loan approval, a resolution or an invoice.</div><div style="flex:1"></div>' + btn('Continue', 'go', 'payamt', '', ' id="primary"'));
  };
  V.payamt = function () {
    var pc = TP.payCheck(), div = pc.div, tot = pc.tot, hv = tot && TP.isHV(tot), err = S.amt ? pc.err : '';
    var risk = tot && !pc.err ? TP.riskPay({ amt: tot, hv: hv, recent: pc.ben && pc.ben.recent, officer: !!(pc.ben && pc.ben.officer), dup: pc.dup, div: div, hour: new Date().getHours() }) : null;
    var chips = div ? [50000, 100000, 200000, 500000] : [250000, 500000, 1000000, 2000000, 5000000], req = [['Preparer + Treasurer', !hv], ['All officers', hv], ['Fingerprint/PIN', true], ['Face check', hv], ['Safety delay', hv]];
    return top(div ? 'Amount per member' : 'Amount', 'payout') + body(frozenBar() + '<div class="c mute">' + (div ? 'How much per member?' : 'How much to pay ' + (pc.ben ? pc.ben.name : '') + '?') + '</div><div class="big num">' + m(S.amt || 0) + '</div>' + (div ? '<div class="c" style="font-weight:700">Total ' + m(tot) + ' for ' + TP.MEMBERS.length + ' members</div>' : '') + '<div class="c" style="font-size:13px;font-weight:700;color:' + (err ? 'var(--red)' : 'var(--mute)') + '">' + (err || 'Up to ' + m(S.setup.max) + ' per payout · ' + m(S.setup.cap - S.setup.paid) + ' left today') + '</div>' +
      '<div class="chips" style="justify-content:center">' + chips.map(function (v) { return '<button data-a="amt" data-v="' + v + '" class="' + (Number(S.amt) === v ? 'on' : '') + '">' + TP.mk(v) + '</button>'; }).join('') + '</div>' +
      '<div class="row wrap" style="justify-content:center">' + req.map(function (x) { return chip((x[1] ? ic('check', 12) : '') + ' ' + x[0], x[1] ? (x[0] === 'Face check' || x[0] === 'Safety delay' || x[0] === 'All officers' ? 'pend' : 'ok') : 'gray'); }).join('') + '</div>' + (risk ? aiCard(risk, 'the preparer', true) : '') +
      '<div class="pad">' + ['1', '2', '3', '4', '5', '6', '7', '8', '9', '000', '0', '⌫'].map(function (k) { return '<button data-a="key" data-v="' + k + '">' + k + '</button>'; }).join('') + '</div>' + btn('Continue', 'sheet', 'payreview', '', tot && !pc.err ? '' : ' disabled'));
  };
  V.bens = function () {
    var cooling = S.bens.some(function (b) { return b.cool > Date.now(); });
    return top('Payees', 'home') + body(banner('info', 'New payees need the preparer and the Treasurer to approve, then a ' + S.setup.cool + '-hour cooling-off before the first payout.', 'clock') + '<div class="card" style="padding:4px 16px">' + S.bens.map(function (b) { return benRow(b, null); }).join('') + '</div>' + btn('+ Add new payee', 'go', 'addben') + (cooling ? btn('Demo: skip the cooling-off', 'skipcool', undefined, 'demo') : '') + banner('ai', 'Account names are checked with the bank before a payee is saved (simulated).', 'ai'));
  };
  V.addben = function () {
    var ab = S.ab, ok = ab.state === 'ok';
    return top('Add a payee', 'bens') + body('<h1>New payee</h1><div class="mute">We check the account name with the bank first.</div><div><div class="lab">Account number</div><input class="field" data-ab="no" inputmode="numeric" maxlength="10" value="' + ab.no + '" placeholder="10-digit account number"></div><button class="chip info" style="align-self:flex-start;border:0" data-a="absample">Use sample account number</button>' +
      '<div><div class="lab">Bank</div><div class="chips">' + TP.BANKS.map(function (b) { return '<button data-a="abbank" data-v="' + b.id + '" class="' + (ab.bank === b.id ? 'on' : '') + '">' + b.name.replace(' Bank', '') + '</button>'; }).join('') + '</div></div><div><div class="lab">Type</div><div class="chips">' + ['Member', 'Supplier'].map(function (k) { return '<button data-a="abkind" data-v="' + k + '" class="' + (ab.kind === k ? 'on' : '') + '">' + k + '</button>'; }).join('') + '</div></div>' +
      (ab.state === 'resolving' ? '<div class="card row"><div class="spin" style="width:28px;height:28px;border-width:4px;margin:0"></div><span class="mute">Checking the account name with the bank…</span></div>' : ok ? '<div class="card" style="background:var(--gsoft)"><div class="row">' + ic('check', 22) + '<div><div class="mute" style="font-size:12px">Account name (verified, simulated)</div><b style="font-size:18px">' + ab.name + '</b></div></div></div>' : '') +
      banner('warn', 'A new payee cannot be paid until the cooling-off ends. This stops fast, fake-payee fraud.', 'clock') + '<div style="flex:1"></div>' + btn('Propose payee', 'vstart', 'addben', '', ok ? '' : ' disabled'));
  };
  V.rules = function () {
    var st = S.setup, row = function (t, d, who) { return '<div class="item"><div class="grow"><b>' + t + '</b><div class="mute" style="font-size:13px">' + d + '</div></div>' + chip(who, who === 'Bank' ? 'sec' : 'ai') + '</div>'; };
    return top('Payout rules', 'home') + body('<div class="mute">How payouts are controlled on a cooperative account. Bank rules come first. Cosigna only adds stricter ones.</div>' +
      '<div class="card"><h2>Bank rules (simulated)</h2>' + row('Mandate from the society\'s resolution', 'Any 2 officers sign, and the Treasurer must be one. The bank holds the registration certificate and the executive committee resolution.', 'Bank') + row('Payouts by transfer only', 'The account pays to bank accounts. Cash withdrawals are not allowed. Cooperatives pay dividends by electronic transfer.', 'Bank') + row('Transfer limits', 'The bank sets its own transfer limits and charges.', 'Bank') + '</div>' +
      '<div class="card"><h2>Cosigna stricter rules</h2>' + row('Maker-checker', 'The preparer cannot be the checker. The Treasurer checks and cannot prepare.', 'Cosigna') + row('High-value payouts', 'From ' + m(st.hv) + ': all required officers approve, with a face check and a ' + st.delay + '-minute safety delay.', 'Cosigna') + row('Conflict of interest', 'An officer cannot prepare or approve a payout to themselves.', 'Cosigna') + row('Name-verified payees', 'The account name is checked with the bank before saving a payee.', 'Cosigna') + row('New-payee cooling-off', st.cool + ' hours before the first payout to a new payee.', 'Cosigna') + row('Approval reference', 'Every payout cites a loan approval, resolution or invoice number.', 'Cosigna') + row('Limits', 'Up to ' + m(st.max) + ' per payout and ' + m(st.cap) + ' a day.', 'Cosigna') + row('Duplicate check', 'The same payee and amount twice in a day is flagged.', 'Cosigna') + '</div>' + banner('warn', 'These rules are simulated for the demo. A real cooperative must follow its bye-laws and its bank\'s own rules.', 'info'));
  };
})();
