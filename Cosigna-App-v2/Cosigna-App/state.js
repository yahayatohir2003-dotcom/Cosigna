/* Cosigna prototype - state and rules (all simulated).
   Rules: the bank's signing rule (all must sign) always wins. Cosigna only adds stricter conditions. */
(function () {
  var TP = window.TP, P = TP.PEOPLE;
  function fresh() {
    return {
      user: 'A', screen: 'splash', tab: 'home', authTab: 'signup', animate: true,
      form: { name: '', phone: '', pin: '', otp: '', idt: 'BVN', idn: '', lphone: '', lpin: '' },
      signedUp: false, pin: '1234', keyStep: 0,
      setup: { bank: null, acct: null, max: 10000000, hv: 1000000, delay: 30, inv: { B: 0, C: 0 }, active: false, act: 0, ref: '' },
      frozen: null, req: null, lastDone: null, hist: [], notes: [], filter: 'All', sheet: null, toast: null, push: null, shown: {}, vf: null,
      amt: '', ch: 'POS', rr: 'Amount not agreed', reveal: false
    };
  }
  var S = (TP.S = fresh());
  TP.reset = function () { Object.keys(S).forEach(function (k) { delete S[k]; }); Object.assign(S, fresh()); S.screen = 'welcome'; };

  // ---- formatting
  TP.fmt = function (n) { return Number(n).toLocaleString('en-NG'); };
  TP.m = function (n) { return '₦' + TP.fmt(n); };
  TP.mk = function (n) { return n >= 1e6 ? '₦' + n / 1e6 + 'M' : '₦' + n / 1e3 + 'k'; };
  TP.clock = function () { var d = new Date(), h = d.getHours(); return ((h % 12) || 12) + ':' + ('0' + d.getMinutes()).slice(-2) + (h < 12 ? ' am' : ' pm'); };
  TP.nm = function (id) { return id === 'sys' ? 'System' : P[id] ? P[id].short : id; };
  TP.others = function (id) { return TP.IDS.filter(function (x) { return x !== id; }); };
  TP.names = function (ids) { return ids.map(TP.nm).join(' and '); };
  TP.hx = function (s) { var h = 5381; for (var i = 0; i < s.length; i++) h = ((h << 5) + h + s.charCodeAt(i)) | 0; return ('00000000' + (h >>> 0).toString(16)).slice(-8).toUpperCase(); };
  // tamper-evident chain: each record's hash includes the previous one (simulated)
  TP.chain = function (r) { var prev = '00000000'; r.audit.forEach(function (e) { e.h = TP.hx(prev + e.t + e.a + e.x); prev = e.h; }); return r.audit.length ? r.audit[r.audit.length - 1].h : prev; };

  // ---- rules
  TP.isHV = function (amt) { return amt >= S.setup.hv; };
  TP.needs = function (amt) {
    var n = ['All 3 signers approve (bank rule)', 'Fingerprint or PIN', 'Signed on your device'];
    if (TP.isHV(amt)) n.push('Face verification', S.setup.delay + '-minute safety delay');
    return n;
  };
  TP.check = function (amt) {
    if (S.frozen) return 'Withdrawals are frozen.';
    if (!amt || amt < 1000) return 'Enter at least ₦1,000.';
    if (amt > S.setup.max) return 'Above your account maximum of ' + TP.m(S.setup.max) + ' per request.';
    return '';
  };

  // ---- simulated AI risk check (rule-based demo, not a real model)
  TP.risk = function (o) {
    var f = [], s = 0, x = o.amt / TP.TYPICAL;
    if (x >= 8) { s += 35; f.push({ k: 'bad', t: 'About ' + Math.round(x) + 'x the usual withdrawal (' + TP.m(TP.TYPICAL) + ')' }); }
    else if (x >= 3) { s += 20; f.push({ k: 'warn', t: 'About ' + (Math.round(x * 10) / 10) + 'x the usual withdrawal' }); }
    else if (x >= 1.5) { s += 8; f.push({ k: 'warn', t: 'Higher than the usual withdrawal' }); }
    else f.push({ k: 'ok', t: 'Close to the usual withdrawal size' });
    if (o.amt >= S.setup.hv) { s += 10; f.push({ k: 'warn', t: 'High-value request' }); }
    if (o.ch === 'POS') {
      if (o.amt > 1000000) { s += 15; f.push({ k: 'warn', t: 'Agents hold about ₦1M of cash a day' }); }
      s += 8; f.push({ k: 'warn', t: 'Cash point not used by this group before' });
    } else f.push({ k: 'ok', t: 'Branch pickup: a teller can check the signer' });
    var h = o.hour; if (h < 6 || h >= 22) { s += 15; f.push({ k: 'warn', t: 'Requested at an unusual hour' }); } else f.push({ k: 'ok', t: 'Normal time of day' });
    f.push({ k: 'ok', t: 'Known device and verified signer' });
    s = Math.min(100, s);
    var lvl = s < 25 ? 'Low' : s < 55 ? 'Medium' : 'High';
    return { score: s, level: lvl, cls: lvl === 'Low' ? 'ok' : lvl === 'Medium' ? 'pend' : 'bad', col: lvl === 'Low' ? '#12B76A' : lvl === 'Medium' ? '#F79009' : '#F04438', factors: f };
  };
  TP.advice = function (r, who) {
    if (r.level === 'Low') return 'Looks normal. Check the details, then approve.';
    if (r.level === 'Medium') return 'This is unusual. Confirm with ' + who + ' by phone before you approve.';
    return 'High risk. Do not approve until you have spoken to ' + who + '. If unsure, stop or freeze.';
  };

  // ---- logs and alerts
  TP.log = function (r, who, x, k) { r.audit.push({ t: TP.clock(), a: who, x: x, k: k || 'info' }); TP.chain(r); };
  TP.notify = function (to, title, body, k) { S.notes.unshift({ id: Date.now() + Math.random(), to: to, t: 'Just now', title: title, body: body, k: k || 'info', read: false }); };
  TP.status = function (r) {
    if (r.type === 'sec') return r.title && r.title.indexOf('frozen') > -1 ? ['Emergency', 'bad'] : ['Security', 'sec'];
    return ({ pending: ['Pending', 'pend'], delay: ['Safety delay', 'pend'], code: ['Approved', 'ok'], done: ['Completed', 'ok'], rejected: ['Rejected', 'bad'], cancelled: ['Cancelled', 'gray'] })[r.st];
  };
  TP.count = function (r) { return TP.IDS.filter(function (i) { return r.ap[i] === 'approved'; }).length; };
  TP.active = function () { var r = S.req; return !!r && ['pending', 'delay', 'code'].indexOf(r.st) > -1; };
  TP.mine = function () { var r = S.req; return r && r.st === 'pending' && r.ap[S.user] === 'pending' ? r : null; };
  TP.protection = function () { return TP.PROTECT.length; };

  // ---- withdrawal lifecycle
  TP.createRequest = function () {
    var amt = Number(S.amt), hour = new Date().getHours();
    var r = { id: 'R-' + (1000 + S.hist.length + 1), type: 'req', amt: amt, by: S.user, ch: S.ch, st: 'pending', hv: TP.isHV(amt), when: 'Today', ap: {}, audit: [], ref: '', risk: TP.risk({ amt: amt, ch: S.ch, hour: hour }) };
    TP.IDS.forEach(function (i) { r.ap[i] = i === S.user ? 'approved' : 'pending'; });
    TP.log(r, TP.nm(S.user), 'Requested ' + TP.m(amt) + (S.ch === 'POS' ? ' (POS / ATM)' : ' (branch pickup)'));
    TP.log(r, 'AI check', 'Risk ' + r.risk.level + ' (' + r.risk.score + '/100) · simulated', r.risk.cls === 'ok' ? 'sec' : r.risk.cls);
    TP.log(r, TP.nm(S.user), 'Approved own request: biometric' + (r.hv ? ' + face' : '') + ' · signed ' + TP.ref(), 'ok');
    r.ref = TP.chain(r);
    TP.notify(TP.others(S.user), TP.nm(S.user) + ' needs your approval', TP.m(amt) + ' · AI risk: ' + r.risk.level, r.risk.cls === 'ok' ? 'pend' : r.risk.cls);
    S.hist.unshift(r); S.req = r; S.amt = ''; S.reveal = false;
  };
  TP.approve = function (id) {
    var r = S.req; if (!r || r.st !== 'pending') return;
    r.ap[id] = 'approved';
    TP.log(r, TP.nm(id), 'Approved: biometric' + (r.hv ? ' + face' : '') + ' · signed ' + TP.ref(), 'ok');
    TP.notify([r.by], TP.nm(id) + ' approved', TP.m(r.amt) + ' · ' + TP.count(r) + ' of 3 approved', 'ok');
    if (TP.count(r) === 3) {
      if (r.hv) {
        r.st = 'delay'; r.delayMs = S.setup.delay * 60000; r.delayStart = Date.now();
        TP.log(r, 'System', 'All 3 approved. Safety delay started (' + S.setup.delay + ' min)', 'pend');
        TP.notify('all', 'Safety delay started', TP.m(r.amt) + ' · any signer can stop it', 'pend');
      } else TP.issueCode();
    }
  };
  TP.reject = function (id, why) {
    var r = S.req; if (!r || r.st !== 'pending') return;
    r.ap[id] = 'rejected'; r.st = 'rejected'; r.reason = why;
    TP.log(r, TP.nm(id), 'Rejected: ' + why, 'bad'); TP.log(r, 'System', 'Request closed. No code issued.', 'bad');
    TP.notify('all', 'Request rejected', TP.nm(id) + ' rejected ' + TP.m(r.amt) + ': ' + why, 'bad');
  };
  TP.cancel = function (id, why) {
    var r = S.req; if (!r || ['done', 'rejected', 'cancelled'].indexOf(r.st) > -1) return;
    r.st = 'cancelled'; TP.log(r, TP.nm(id), why, 'bad'); TP.notify('all', 'Request cancelled', why, 'bad');
  };
  TP.tick = function () { var r = S.req; if (r && r.st === 'delay' && Date.now() >= r.delayStart + r.delayMs) { TP.issueCode(); return true; } return false; };
  TP.skipDelay = function () { var r = S.req; if (r && r.st === 'delay') { r.delayStart = Date.now() - r.delayMs; TP.tick(); } };
  TP.issueCode = function () {
    var r = S.req, c = ''; for (var i = 0; i < 8; i++) c += Math.floor(Math.random() * 10);
    r.st = 'code'; r.code = c.slice(0, 4) + ' ' + c.slice(4); r.codeAt = Date.now(); S.reveal = false;
    TP.log(r, 'System', 'One-time cash code issued (amount-locked, 15 min)', 'ok');
    TP.notify([r.by], 'Your cash code is ready', TP.m(r.amt) + ' · expires in 15 minutes', 'ok');
  };
  TP.complete = function () {
    var r = S.req; r.st = 'done'; TP.log(r, TP.nm(r.by), 'Cash collected. Code used.', 'ok');
    TP.notify('all', 'Cash collected', TP.nm(r.by) + ' collected ' + TP.m(r.amt), 'ok'); S.lastDone = r; S.req = null;
  };

  // ---- freeze (emergency) and unfreeze (needs all signers)
  TP.freeze = function (id) {
    var e = { id: 'S-' + (2000 + S.hist.length), type: 'sec', amt: 0, st: 'sec', title: 'Account frozen by ' + TP.nm(id), when: 'Today', ref: '', audit: [] };
    TP.log(e, TP.nm(id), 'Pressed Freeze: emergency', 'bad'); TP.log(e, 'System', 'All withdrawals blocked. All signers alerted.', 'sec'); e.ref = TP.chain(e);
    S.frozen = { by: id, un: {}, ev: e }; S.hist.unshift(e);
    if (S.req) TP.cancel(id, 'Cancelled because the account was frozen');
    TP.notify('all', 'Account frozen', TP.nm(id) + ' froze withdrawals', 'bad');
  };
  TP.approveUnfreeze = function (id) {
    var f = S.frozen; if (!f) return; f.un[id] = true; TP.log(f.ev, TP.nm(id), 'Approved unfreeze: biometric · signed ' + TP.ref(), 'ok');
    if (TP.IDS.every(function (i) { return f.un[i]; })) { TP.log(f.ev, 'All', 'Unfrozen with approval from all 3 signers', 'ok'); TP.notify('all', 'Account unfrozen', 'All signers approved', 'ok'); S.frozen = null; }
  };

  // ---- setup and demo shortcut
  TP.activate = function () {
    var e = { id: 'S-1000', type: 'sec', amt: 0, st: 'sec', title: 'Shared approvals activated', when: 'Today', ref: '', audit: [
      { t: TP.clock(), a: 'Bank (simulated)', x: 'Checked all 3 signer verifications', k: 'ok' },
      { t: TP.clock(), a: 'Bank (simulated)', x: 'Registered 3 device keys and switched shared approvals on', k: 'ok' }] };
    e.ref = TP.chain(e);
    var seed = TP.seed(); seed.hist.forEach(TP.chain);
    S.setup.active = true; S.setup.ref = 'UDB-TP-00417'; S.hist = [e].concat(seed.hist); S.notes = seed.notes.slice();
    TP.notify('all', 'Shared approvals active', 'Unity Demo Bank (simulated) confirmed the setup.', 'ok');
  };
  TP.demoSkip = function () { S.signedUp = true; S.setup.bank = 'unity'; S.setup.acct = 'a1'; S.setup.inv = { B: 1, C: 1 }; TP.activate(); S.setup.act = 1; };
})();
