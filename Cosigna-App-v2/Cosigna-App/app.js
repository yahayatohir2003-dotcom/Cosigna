/* Cosigna prototype - navigation, events, simulated verification (fingerprint/PIN, face, signing) and timers. */
(function () {
  var TP = window.TP, S = TP.S, P = TP.PEOPLE, FT = function () { return TP.FT; };
  var TABS = ['home', 'approvals', 'history', 'security'];
  var BACK = { how: 'welcome', auth: 'welcome', otp: 'auth', idv: 'otp', bank: 'idok', consent: 'bank', accounts: 'consent', rule: 'accounts', conditions: 'rule', invites: 'conditions', request: 'home', payout: 'home', payamt: 'payout', bens: 'home', addben: 'bens', rules: 'home', track: 'home', approve: 'home', delay: 'track', code: 'track', alerts: 'home', profile: 'home' };
  var timers = [], toastT = null, pushT = null;
  TP.later = function (fn, ms) { timers.push(setTimeout(fn, ms)); };
  TP.clear = function () { timers.forEach(clearTimeout); timers = []; };
  var $ = function (id) { return document.getElementById(id); };

  // ---- rendering (scroll position is kept; entrance animation plays only when the screen changes)
  function render() {
    var view = $('view'), sc = view.querySelector('.body'), y = sc ? sc.scrollTop : 0;
    view.className = S.animate ? 'enter' : ''; S.animate = false;
    view.innerHTML = TP.V[S.screen]() + TP.sheet();
    var nb = view.querySelector('.body'); if (nb && y) nb.scrollTop = y;
    after();
  }
  TP.render = render;
  function go(s) { TP.clear(); S.keyRun = false; S.splashT = false; S.screen = s; S.sheet = null; S.animate = true; if (TABS.indexOf(s) > -1) S.tab = s; render(); }
  function say(t) {
    $('toastBox').innerHTML = '<div class="toast">' + TP.ic('check', 18) + ' ' + t + '</div>';
    if (navigator.vibrate) navigator.vibrate(25);
    clearTimeout(toastT); toastT = setTimeout(function () { $('toastBox').innerHTML = ''; }, 2600);
  }
  function push(title, body, k) {
    var col = k === 'bad' ? 'var(--red)' : k === 'ok' ? 'var(--green)' : k === 'pend' ? 'var(--amber)' : 'var(--blue)';
    $('pushBox').innerHTML = '<div class="push"><div class="pi">' + TP.ic('shield', 20) + '</div><div class="grow"><div class="row sp"><b style="font-size:13px">COSIGNA</b><span class="mute" style="font-size:12px">now</span></div><div style="font-weight:800">' + title + '</div><div class="mute" style="font-size:13px">' + body + '</div></div><span style="width:6px;align-self:stretch;border-radius:4px;background:' + col + '"></span></div>';
    if (navigator.vibrate) navigator.vibrate([30, 40, 30]);
    clearTimeout(pushT); pushT = setTimeout(function () { $('pushBox').innerHTML = ''; }, 4600);
  }
  function pushFor() {
    var n = S.notes.filter(function (x) { return (x.to === 'all' || x.to.indexOf(S.user) > -1) && !x.read && !S.shown[x.id]; })[0];
    if (n) { S.shown[n.id] = 1; push(n.title, n.body, n.k); }
  }

  // ---- form validation
  var OK = {
    auth: function () { var f = S.form; return S.authTab === 'signup' ? f.name.trim().length >= 3 && /^\d{11}$/.test(f.phone) && /^\d{4}$/.test(f.pin) : /^\d{11}$/.test(f.lphone) && /^\d{4}$/.test(f.lpin); },
    otp: function () { return /^\d{6}$/.test(S.form.otp); },
    idv: function () { return /^\d{11}$/.test(S.form.idn); },
    payout: function () { return S.payForm.ref.trim().length > 0 && (S.payForm.type === 'div' || !!S.payForm.ben); }
  };
  function refresh() { var b = $('primary'); if (b && OK[S.screen]) b.disabled = !OK[S.screen](); }
  var C = 2 * Math.PI * 42;
  function clockText() {
    document.querySelectorAll('[data-count]').forEach(function (e) {
      var s = Math.ceil(Math.max(0, Number(e.dataset.count) - Date.now()) / 1000);
      e.textContent = ('0' + Math.floor(s / 60)).slice(-2) + ':' + ('0' + (s % 60)).slice(-2);
    });
    document.querySelectorAll('[data-ring]').forEach(function (e) {
      var a = e.dataset.ring.split(','), rem = Math.max(0, Number(a[0]) + Number(a[1]) - Date.now());
      e.style.strokeDashoffset = (C * (1 - rem / Number(a[1]))).toFixed(1);
    });
  }

  // ---- simulated verification: fingerprint/PIN, then face for high-value, then device signing
  function startVerify(purpose) {
    var r = S.req, amt = Number(S.amt), hv = purpose === 'send' ? TP.isHV(amt) : purpose === 'payout' ? TP.isHV(TP.payTotal()) : purpose === 'approve' ? !!(r && r.hv) : false;
    var steps = purpose === 'identity' ? ['face'] : ['bio'].concat(hv ? ['face'] : [], ['sign']);
    var what = r ? (r.kind === 'beneficiary' ? 'new payee ' + r.payee : TP.m(r.amt) + (r.kind === 'payout' ? ' payout to ' + r.payee : '')) : '';
    var sub = { identity: 'Live face check for your identity', send: 'Confirm to send ' + TP.m(amt) + ' for approval', payout: 'Confirm to send a ' + TP.m(TP.payTotal()) + ' payout for approval', addben: 'Confirm to propose this payee', approve: 'Approve ' + what + (r ? ' for ' + TP.nm(r.by) : ''), unfreeze: 'Approve unfreezing' }[purpose];
    S.vf = { purpose: purpose, steps: steps, i: 0, step: steps[0], mode: 'bio', pin: '', err: '', fs: 0, running: false, scanning: false, signed: false, nonce: TP.hx(String(Math.random())).slice(0, 6), sig: TP.ref(), title: "Confirm it's you", sub: sub };
    go('verify');
  }
  function advance() {
    var v = S.vf; if (!v) return; v.i++;
    if (v.i >= v.steps.length) return finish();
    v.step = v.steps[v.i]; v.running = false; v.mode = 'bio'; render();
  }
  function runFace() {
    var v = S.vf; if (!v || v.running) return; v.running = true; v.fs = 0;
    (function tick() {
      TP.later(function () {
        if (S.vf !== v) return;
        if (v.fs >= 4) { TP.later(advance, FT() * 0.8); return; }
        v.fs++; render(); tick();
      }, FT());
    })();
  }
  function runSign() {
    var v = S.vf; if (!v || v.running) return; v.running = true;
    TP.later(function () { if (S.vf === v) { v.signed = true; render(); } }, FT() * 0.8);
    TP.later(function () { if (S.vf === v) advance(); }, FT() * 1.7);
  }
  function finish() {
    var v = S.vf, p = v.purpose; S.vf = null;
    if (p === 'identity') go('keygen');
    else if (p === 'send') { TP.createRequest(); go('track'); say('Request sent. Waiting for the other signers.'); }
    else if (p === 'payout') { TP.createPayout(); go('track'); say('Payout sent for approval.'); }
    else if (p === 'addben') { TP.createBeneficiary(); go('track'); say('Payee proposed. The Treasurer must approve.'); }
    else if (p === 'approve') {
      TP.approve(S.user); var st = S.req.st;
      go('track'); say(st === 'delay' ? 'All approved. Safety delay started.' : st === 'code' ? 'All approved. Cash code issued.' : st === 'sent' ? 'All approved. Payout sent.' : st === 'done' ? 'Payee approved. Cooling-off started.' : 'Approved and signed on your device.');
    }
    else if (p === 'unfreeze') { TP.approveUnfreeze(S.user); go('profile'); say(S.frozen ? 'Your approval is recorded.' : 'Account unfrozen.'); }
  }
  function after() {
    refresh(); clockText();
    if (S.screen === 'splash' && !S.splashT) { S.splashT = true; TP.later(function () { go('welcome'); }, FT() * 2.2); }
    if (S.screen === 'verify' && S.vf && S.vf.step === 'face') runFace();
    if (S.screen === 'verify' && S.vf && S.vf.step === 'sign') runSign();
    if (S.screen === 'keygen' && !S.keyRun) {
      S.keyRun = true; S.keyStep = 0;
      [1, 2, 3].forEach(function (n) { TP.later(function () { S.keyStep = n; render(); }, FT() * 0.9 * n); });
      TP.later(function () { go('idok'); }, FT() * 3.9);
    }
    if (S.screen === 'activation' && !S.setup.act && !S.actT) {
      S.actT = true; TP.later(function () { TP.activate(); S.setup.act = 1; S.actT = false; render(); }, FT() * 1.8);
    }
  }
  setInterval(function () {
    clockText();
    if (TP.tick()) { if (S.screen === 'delay') { go('track'); say(S.req && S.req.kind === 'payout' ? 'Safety delay finished. Payout sent.' : 'Safety delay finished. Cash code issued.'); } else render(); }
  }, 500);

  // ---- inputs (no re-render, keeps the keyboard open)
  function resolveAb() {
    var ab = S.ab;
    if (ab.no.length === 10 && ab.state !== 'ok' && ab.state !== 'resolving') {
      ab.state = 'resolving'; render();
      TP.later(function () { ab.name = TP.NAMEBOOK[Number(ab.no.slice(-1))]; ab.state = 'ok'; render(); }, FT() * 1.1);
    } else if (ab.no.length < 10 && ab.state) { ab.state = ''; ab.name = ''; }
  }
  document.addEventListener('input', function (e) {
    var d = e.target.dataset || {};
    if (d.pf) { S.payForm[d.pf] = e.target.value; refresh(); return; }
    if (d.ab) { var nv = e.target.value.replace(/\D/g, '').slice(0, 10); e.target.value = nv; S.ab.no = nv; resolveAb(); return; }
    var k = d.bind; if (!k) return;
    var v = e.target.value; if (k !== 'name') { v = v.replace(/\D/g, ''); e.target.value = v; }
    S.form[k] = v; refresh();
  });

  // ---- clicks
  document.addEventListener('click', function (e) {
    var t = e.target.closest('[data-a]'); if (!t) return;
    var a = t.dataset.a, v = t.dataset.v, f = S.form, nmk = TP.nm(S.user);
    switch (a) {
      case 'go': if ((v === 'request' || v === 'payout') && TP.active()) { go('track'); say('A request is already in progress.'); } else go(v); break;
      case 'tab': go(v); break;
      case 'auth': S.authTab = v; go('auth'); break;
      case 'authtab': S.authTab = v; render(); break;
      case 'sample':
        if (S.authTab === 'signup') { f.name = 'Amina Bello'; f.phone = '08030001234'; f.pin = '1234'; } else { f.lphone = f.phone || '08030001234'; f.lpin = S.pin; }
        render(); break;
      case 'authgo':
        if (S.authTab === 'signup') {
          var w = f.name.trim().split(/\s+/); P.A.name = f.name.trim(); P.A.short = w[0]; P.A.init = (w[0][0] + (w[1] ? w[1][0] : '')).toUpperCase();
          S.pin = f.pin; S.signedUp = true; S.user = 'A'; go('otp');
        } else if (!S.signedUp) say('No account yet. Sign up first.');
        else if (f.lphone !== f.phone || f.lpin !== S.pin) say('Wrong phone number or PIN.');
        else { S.user = 'A'; go(S.setup.active ? 'home' : 'idv'); }
        break;
      case 'otpfill': f.otp = TP.DEMO_OTP; render(); break;
      case 'otpgo': if (f.otp === TP.DEMO_OTP) go('idv'); else say('That code is not right. Use the demo code.'); break;
      case 'idt': f.idt = v; render(); break;
      case 'idsample': f.idn = '12345678901'; render(); break;
      case 'idgo': startVerify('identity'); break;
      case 'vstart': startVerify(v); break;
      case 'vfx': var pu = S.vf && S.vf.purpose; S.vf = null; go({ identity: 'idv', send: 'request', approve: 'approve', unfreeze: 'profile' }[pu] || 'home'); break;
      case 'vfmode': S.vf.mode = v; S.vf.pin = ''; S.vf.err = ''; render(); break;
      case 'scan': S.vf.scanning = true; render(); TP.later(function () { if (S.vf) { S.vf.scanning = false; advance(); } }, FT() * 1.1); break;
      case 'pk':
        var q = S.vf; if (v === '⌫') q.pin = q.pin.slice(0, -1); else if (q.pin.length < 4) q.pin += v; q.err = '';
        if (q.pin.length === 4) { if (q.pin === S.pin) { advance(); break; } q.err = 'Wrong PIN. Try again.'; q.pin = ''; }
        render(); break;
      case 'bank': S.setup.bank = v; render(); break;
      case 'soon': say('Not a partner yet. Joint accounts at this bank are not supported.'); break;
      case 'acct': var ac = TP.ACCOUNTS.filter(function (x) { return x.id === v; })[0]; TP.switchAcct(ac.type); S.setup.bank = 'unity'; S.setup.inv = { B: 0, C: 0 }; go('rule'); break;
      case 'swacct': TP.switchAcct(v); go('home'); say('Switched to ' + TP.acc().short); break;
      case 'linknew': S.sheet = null; go('accounts'); break;
      case 'ptype': S.payForm.type = v; S.amt = ''; render(); break;
      case 'pben': S.payForm.ben = v; render(); break;
      case 'pcool': say('This payee is in cooling-off and cannot be paid yet.'); break;
      case 'abbank': S.ab.bank = v; render(); break;
      case 'abkind': S.ab.kind = v; render(); break;
      case 'absample': S.ab.no = '0123456783'; S.ab.state = ''; resolveAb(); break;
      case 'skipcool': S.bens.forEach(function (b) { b.cool = 0; }); render(); say('Demo: cooling-off skipped.'); break;
      case 'noacct': say(TP.ACCOUNTS.filter(function (x) { return x.id === v; })[0].why); break;
      case 'setc': S.setup[t.dataset.k] = Number(v); render(); break;
      case 'sendinv': S.setup.inv = { B: 0, C: 0 }; go('invites'); break;
      case 'accept': S.setup.inv[v] = 1; render(); say(P[v].short + ' verified: BVN, face, device key, terms'); break;
      case 'activate': S.setup.act = 0; go('activation'); break;
      case 'skip': TP.demoSkip(); go('home'); say('Demo shortcut: sample setup loaded'); break;
      case 'amt': S.amt = String(v); render(); break;
      case 'key': if (v === '⌫') S.amt = S.amt.slice(0, -1); else if (S.amt.length + v.length <= 8) S.amt = (S.amt + v).replace(/^0+/, ''); render(); break;
      case 'ch': S.ch = v; render(); break;
      case 'sheet': S.sheet = v; render(); break;
      case 'close': S.sheet = null; render(); break;
      case 'cancelreq': TP.cancel(S.user, 'Cancelled by ' + nmk); go('track'); say('Cancelled. Everyone was told.'); break;
      case 'stopreq': TP.cancel(S.user, 'Stopped during the safety delay by ' + nmk); go('track'); say('Withdrawal stopped. No code issued.'); break;
      case 'dofreeze': TP.freeze(S.user); go('home'); say('Withdrawals frozen. Everyone alerted.'); break;
      case 'rr': S.rr = v; render(); break;
      case 'reject': TP.reject(S.user, S.rr); go('track'); say('Request rejected.'); break;
      case 'reveal': say('Scanning fingerprint…'); TP.later(function () { S.reveal = true; render(); }, FT() * 0.9); break;
      case 'complete': TP.complete(); go('done'); break;
      case 'skipdelay': TP.skipDelay(); go('track'); say('Demo: delay skipped. Cash code issued.'); break;
      case 'as': var d = t.dataset.s || 'home'; S.user = v; if (d === 'approve' && !TP.mine()) d = S.req ? 'track' : 'home'; if (d === 'track' && !S.req) d = 'home'; go(d); pushFor(); break;
      case 'filter': S.filter = v; render(); break;
      case 'read': S.notes.forEach(function (n) { if (String(n.id) === v) n.read = true; }); render(); break;
      case 'readall': S.notes.forEach(function (n) { n.read = true; }); render(); break;
      case 'logout': go('welcome'); S.user = 'A'; say('Signed out'); break;
      case 'reset': TP.reset(); go('welcome'); break;
    }
  });

  // ---- Android back button (only inside the installed app)
  var A = window.Capacitor && window.Capacitor.Plugins && window.Capacitor.Plugins.App;
  if (A) A.addListener('backButton', function () {
    if (S.sheet) { S.sheet = null; render(); }
    else if (S.screen === 'verify') { var x = document.querySelector('[data-a="vfx"]'); if (x) x.click(); }
    else if (S.screen === 'activation' || S.screen === 'keygen' || S.screen === 'splash') { /* stay */ }
    else if (S.screen === 'welcome') A.exitApp();
    else if (S.screen === 'done') go('home');
    else if (S.screen === 'accounts') go(TP.linked('joint') || TP.linked('coop') ? 'home' : 'consent');
    else if (BACK[S.screen]) go(BACK[S.screen]);
    else if (S.screen !== 'home' && TABS.indexOf(S.screen) > -1) go('home');
    else A.exitApp();
  });

  TP.go = go; TP.say = say;
  render();
})();
