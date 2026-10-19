/* Cosigna prototype - state and rules (all simulated).
   Joint account: withdrawals (cash codes). Cooperative account: payouts (bank transfers only, no cash).
   Rules: the bank's mandate always wins. Cosigna only adds stricter conditions. */
(function () {
  var TP = window.TP, P = TP.PEOPLE;
  function cfg(coop) { return { bank: null, max: 10000000, hv: 1000000, delay: 30, cool: 24, cap: 20000000, paid: coop ? 2500000 : 0, inv: { B: 0, C: 0 }, active: false, act: 0, ref: '' }; }
  function fresh() {
    var c = { joint: cfg(false), coop: cfg(true) };
    return {
      user: 'A', screen: 'splash', tab: 'home', authTab: 'signup', animate: true,
      form: { name: '', phone: '', pin: '', otp: '', idt: 'BVN', idn: '', lphone: '', lpin: '' },
      signedUp: false, pin: '1234', keyStep: 0,
      cur: 'joint', cfgs: c, setup: c.joint, reqs: {}, frozens: {}, bens: [],
      payForm: { type: 'loan', ben: null, ref: '' }, ab: { no: '', bank: 'unity', kind: 'Member', state: '', name: '' },
      frozen: null, req: null, lastDone: null, hist: [], notes: [], filter: 'All', sheet: null, shown: {}, vf: null,
      amt: '', ch: 'POS', rr: 'Amount not agreed', reveal: false
    };
  }
  var S = (TP.S = fresh());
  TP.reset = function () { Object.keys(S).forEach(function (k) { delete S[k]; }); Object.assign(S, fresh()); S.screen = 'welcome'; };
  TP.isCoop = function () { return S.cur === 'coop'; };
  TP.acc = function () { return TP.ACC[S.cur]; };
  TP.linked = function (id) { return S.cfgs[id].active; };
  TP.switchAcct = function (id) {
    S.reqs[S.cur] = S.req; S.frozens[S.cur] = S.frozen;
    S.cur = id; S.req = S.reqs[id] || null; S.frozen = S.frozens[id] || null; S.setup = S.cfgs[id]; S.amt = ''; S.reveal = false;
  };
  TP.hl = function () { return S.hist.filter(function (x) { return x.acct === S.cur; }); };

  // ---- formatting
  TP.fmt = function (n) { return Number(n).toLocaleString('en-NG'); };
  TP.m = function (n) { return '₦' + TP.fmt(n); };
  TP.mk = function (n) { return n >= 1e6 ? '₦' + n / 1e6 + 'M' : '₦' + n / 1e3 + 'k'; };
  TP.clock = function () { var d = new Date(), h = d.getHours(); return ((h % 12) || 12) + ':' + ('0' + d.getMinutes()).slice(-2) + (h < 12 ? ' am' : ' pm'); };
  TP.nm = function (id) { return id === 'sys' ? 'System' : P[id] ? P[id].short : id; };
  TP.role = function (id) { return S.cur === 'coop' ? TP.ROLES[id] : ''; };
  TP.others = function (id) { return TP.IDS.filter(function (x) { return x !== id; }); };
  TP.names = function (ids) { return ids.map(TP.nm).join(' and '); };
  TP.hx = function (s) { var h = 5381; for (var i = 0; i < s.length; i++) h = ((h << 5) + h + s.charCodeAt(i)) | 0; return ('00000000' + (h >>> 0).toString(16)).slice(-8).toUpperCase(); };
  TP.chain = function (r) { var prev = '00000000'; r.audit.forEach(function (e) { e.h = TP.hx(prev + e.t + e.a + e.x); prev = e.h; }); return r.audit.length ? r.audit[r.audit.length - 1].h : prev; };
  TP.digits = function (n) { var c = ''; for (var i = 0; i < n; i++) c += Math.floor(Math.random() * 10); return c; };

  // ---- approvals model: r.need = who must approve; r.ap = state per person ('approved' | 'pending' | 'rejected' | 'na')
  TP.needOf = function (r) { return r.need || TP.IDS; };
  TP.count = function (r) { return TP.needOf(r).filter(function (i) { return r.ap[i] === 'approved'; }).length; };
  TP.total = function (r) { return TP.needOf(r).length; };
  TP.isHV = function (amt) { return amt >= S.setup.hv; };

  // ---- joint account rules
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

  // ---- cooperative payout rules
  TP.payType = function () { return TP.PAYTYPES.filter(function (x) { return x[0] === S.payForm.type; })[0]; };
  TP.payBen = function () { return S.bens.filter(function (b) { return b.id === S.payForm.ben; })[0] || null; };
  TP.payTotal = function () { var per = Number(S.amt) || 0; return S.payForm.type === 'div' ? per * TP.MEMBERS.length : per; };
  TP.coolLeft = function (b) { return Math.max(0, Math.ceil((b.cool - Date.now()) / 3600000)); };
  TP.payNeed = function (hv, maker, officer) {
    var n = hv ? TP.IDS.slice() : [maker, 'C'];
    return n.filter(function (x, i, a) { return a.indexOf(x) === i && x !== officer; });
  };
  TP.needsPay = function (tot, officer) {
    var hv = TP.isHV(tot), n = hv ? ['All officers approve (bank rule: 2 officers, Treasurer required)'] : ['Preparer + Treasurer approve (bank rule)'];
    n.push('Fingerprint or PIN', 'Signed on your device');
    if (officer) n.push(TP.nm(officer) + ' cannot approve: payee is an officer');
    if (hv) n.push('Face verification', S.setup.delay + '-minute safety delay');
    return n;
  };
  TP.duplicate = function (ben, amt) {
    return !!ben && S.hist.some(function (x) { return x.kind === 'payout' && x.payeeId === ben.id && x.amt === amt && x.when === 'Today' && ['rejected', 'cancelled'].indexOf(x.st) < 0; });
  };
  TP.payCheck = function () {
    var f = S.payForm, tot = TP.payTotal(), ben = TP.payBen(), div = f.type === 'div', cf = S.setup, err = '', rules = [], used = cf.paid;
    if (S.frozen) err = 'Payouts are frozen.';
    else if (S.user === 'C') err = 'The Treasurer checks payouts and cannot prepare them (maker-checker).';
    else if (!div && !ben) err = 'Choose who to pay.';
    else if (!div && ben.cool > Date.now()) err = ben.name + ' is in cooling-off for ' + TP.coolLeft(ben) + ' more hours.';
    else if (!div && ben.officer === S.user) err = 'You cannot prepare a payout to yourself.';
    else if (!f.ref.trim()) err = 'Add the ' + TP.payType()[2].toLowerCase() + '.';
    else if (!tot || tot < 1000) err = 'Enter an amount of at least ₦1,000.';
    else if (tot > cf.max) err = 'Above the per-payout limit of ' + TP.m(cf.max) + '.';
    else if (used + tot > cf.cap) err = 'This would pass the daily payout cap (' + TP.m(used) + ' used of ' + TP.m(cf.cap) + ').';
    var dup = TP.duplicate(ben, tot);
    rules = [['Bank transfer only (no cash payouts)', true], [div ? 'All 5 member accounts name-verified' : 'Payee account name verified', true], ['Maker-checker: preparer is not the checker', S.user !== 'C'], ['Approval reference provided', !!f.ref.trim()], ['Within per-payout limit', !tot || tot <= cf.max], ['Within daily payout cap', !tot || used + tot <= cf.cap], ['No duplicate payout today', !dup]];
    return { err: err, rules: rules, dup: dup, tot: tot, ben: ben, div: div };
  };

  // ---- simulated AI risk checks (rule-based demo, not a real model)
  function level(s) { return s < 25 ? 'Low' : s < 55 ? 'Medium' : 'High'; }
  function wrap(s, f) {
    s = Math.min(100, s); var lvl = level(s);
    return { score: s, level: lvl, cls: lvl === 'Low' ? 'ok' : lvl === 'Medium' ? 'pend' : 'bad', col: lvl === 'Low' ? '#12B76A' : lvl === 'Medium' ? '#F79009' : '#F04438', factors: f };
  }
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
    return wrap(s, f);
  };
  TP.riskPay = function (o) {
    var f = [], s = 0, x = o.amt / TP.TYPICAL_PAY;
    if (x >= 8) { s += 35; f.push({ k: 'bad', t: 'About ' + Math.round(x) + 'x the usual payout (' + TP.m(TP.TYPICAL_PAY) + ')' }); }
    else if (x >= 3) { s += 20; f.push({ k: 'warn', t: 'About ' + (Math.round(x * 10) / 10) + 'x the usual payout' }); }
    else if (x >= 1.5) { s += 8; f.push({ k: 'warn', t: 'Higher than the usual payout' }); }
    else f.push({ k: 'ok', t: 'Close to the usual payout size' });
    if (o.hv) { s += 10; f.push({ k: 'warn', t: 'High-value payout' }); }
    if (o.recent) { s += 15; f.push({ k: 'warn', t: 'Payee was added recently' }); } else if (!o.div) f.push({ k: 'ok', t: 'Established payee' });
    if (o.officer) { s += 15; f.push({ k: 'warn', t: 'Payee is an officer: conflict of interest' }); }
    if (o.dup) { s += 25; f.push({ k: 'bad', t: 'Same payee and amount already paid today' }); }
    var h = o.hour; if (h < 6 || h >= 22) { s += 15; f.push({ k: 'warn', t: 'Prepared at an unusual hour' }); } else f.push({ k: 'ok', t: 'Normal time of day' });
    f.push({ k: 'ok', t: o.div ? 'All member accounts name-verified' : 'Payee account name verified' }, { k: 'ok', t: 'Approval reference provided' });
    return wrap(s, f);
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
    return ({ pending: ['Pending', 'pend'], delay: ['Safety delay', 'pend'], code: ['Approved', 'ok'], sent: ['Paid', 'ok'], done: ['Completed', 'ok'], rejected: ['Rejected', 'bad'], cancelled: ['Cancelled', 'gray'] })[r.st];
  };
  TP.active = function () { var r = S.req; return !!r && ['pending', 'delay', 'code'].indexOf(r.st) > -1; };
  TP.mine = function () { var r = S.req; return r && r.st === 'pending' && r.ap[S.user] === 'pending' ? r : null; };
  TP.protList = function () { return S.cur === 'coop' ? TP.PROTECT_COOP : TP.PROTECT; };
  TP.protection = function () { return TP.protList().length; };
  function mkAp(need, maker) { var ap = {}; TP.IDS.forEach(function (i) { ap[i] = need.indexOf(i) < 0 ? 'na' : i === maker ? 'approved' : 'pending'; }); return ap; }
  function nextId(p) { return p + '-' + (1000 + S.hist.length + 1); }

  // ---- joint: withdrawal request
  TP.createRequest = function () {
    var amt = Number(S.amt), hour = new Date().getHours(), need = TP.IDS.slice();
    var r = { id: nextId('R'), type: 'req', kind: 'withdrawal', acct: 'joint', amt: amt, by: S.user, ch: S.ch, st: 'pending', hv: TP.isHV(amt), when: 'Today', need: need, ap: mkAp(need, S.user), audit: [], ref: '', risk: TP.risk({ amt: amt, ch: S.ch, hour: hour }) };
    TP.log(r, TP.nm(S.user), 'Requested ' + TP.m(amt) + (S.ch === 'POS' ? ' (POS / ATM)' : ' (branch pickup)'));
    TP.log(r, 'AI check', 'Risk ' + r.risk.level + ' (' + r.risk.score + '/100) · simulated', r.risk.cls === 'ok' ? 'sec' : r.risk.cls);
    TP.log(r, TP.nm(S.user), 'Approved own request: biometric' + (r.hv ? ' + face' : '') + ' · signed ' + TP.ref(), 'ok');
    r.ref = TP.chain(r);
    TP.notify(TP.others(S.user), TP.nm(S.user) + ' needs your approval', TP.m(amt) + ' withdrawal · AI risk: ' + r.risk.level, r.risk.cls === 'ok' ? 'pend' : r.risk.cls);
    S.hist.unshift(r); S.req = r; S.amt = ''; S.reveal = false;
  };

  // ---- cooperative: payout request
  TP.createPayout = function () {
    var pc = TP.payCheck(), f = S.payForm, t = TP.payType(), tot = pc.tot, ben = pc.ben, div = pc.div, hv = TP.isHV(tot), officer = ben && ben.officer || null, hour = new Date().getHours();
    var need = TP.payNeed(hv, S.user, officer), payee = div ? 'All members (' + TP.MEMBERS.length + ')' : ben.name;
    var r = { id: nextId('P'), type: 'req', kind: 'payout', acct: 'coop', payType: t[1], payee: payee, payeeId: ben ? ben.id : 'batch', amt: tot, per: div ? Number(S.amt) : null, by: S.user, st: 'pending', hv: hv, when: 'Today', need: need, ap: mkAp(need, S.user), audit: [], ref: '', refNo: f.ref.trim(), officer: officer,
      risk: TP.riskPay({ amt: tot, hv: hv, recent: ben && ben.recent, officer: !!officer, dup: pc.dup, div: div, hour: hour }) };
    TP.log(r, TP.nm(S.user), 'Prepared ' + t[1].toLowerCase() + ' ' + TP.m(tot) + ' to ' + payee + ' (' + r.refNo + ')');
    TP.log(r, 'AI check', 'Risk ' + r.risk.level + ' (' + r.risk.score + '/100) · simulated', r.risk.cls === 'ok' ? 'sec' : r.risk.cls);
    TP.log(r, TP.nm(S.user), 'Approved as preparer: biometric' + (hv ? ' + face' : '') + ' · signed ' + TP.ref(), 'ok');
    r.ref = TP.chain(r);
    TP.notify(need.filter(function (x) { return x !== S.user; }), TP.nm(S.user) + ' needs your approval', TP.m(tot) + ' payout to ' + payee + ' · AI risk: ' + r.risk.level, r.risk.cls === 'ok' ? 'pend' : r.risk.cls);
    S.hist.unshift(r); S.req = r; S.amt = ''; S.payForm.ref = '';
  };

  // ---- cooperative: add payee (needs preparer + Treasurer)
  TP.createBeneficiary = function () {
    var ab = S.ab, need = [S.user, 'C'];
    var r = { id: nextId('B'), type: 'req', kind: 'beneficiary', acct: 'coop', payType: 'New payee', payee: ab.name, amt: 0, by: S.user, st: 'pending', hv: false, when: 'Today', need: need, ap: mkAp(need, S.user), audit: [], ref: '', bdata: { name: ab.name, bank: TP.BANKS.filter(function (b) { return b.id === ab.bank; })[0].name, no: ab.no.slice(-4), kind: ab.kind },
      risk: { score: 10, level: 'Low', cls: 'ok', col: '#12B76A', factors: [{ k: 'ok', t: 'Account name verified with the bank' }, { k: 'warn', t: 'New payee: ' + S.setup.cool + '-hour cooling-off applies' }] } };
    TP.log(r, TP.nm(S.user), 'Proposed new payee ' + ab.name + ' (name verified)');
    TP.log(r, TP.nm(S.user), 'Approved: biometric · signed ' + TP.ref(), 'ok'); r.ref = TP.chain(r);
    TP.notify(['C'], TP.nm(S.user) + ' proposed a new payee', ab.name + ' · ' + ab.kind, 'pend');
    S.hist.unshift(r); S.req = r; S.ab = { no: '', bank: 'unity', kind: 'Member', state: '', name: '' };
  };

  TP.approve = function (id) {
    var r = S.req; if (!r || r.st !== 'pending') return;
    r.ap[id] = 'approved';
    TP.log(r, TP.nm(id), 'Approved' + (TP.isCoop() && TP.role(id) ? ' as ' + TP.role(id) : '') + ': biometric' + (r.hv ? ' + face' : '') + ' · signed ' + TP.ref(), 'ok');
    TP.notify([r.by], TP.nm(id) + ' approved', (r.kind === 'beneficiary' ? 'New payee ' + r.payee : TP.m(r.amt)) + ' · ' + TP.count(r) + ' of ' + TP.total(r) + ' approved', 'ok');
    if (TP.count(r) === TP.total(r)) {
      if (r.hv) {
        r.st = 'delay'; r.delayMs = S.setup.delay * 60000; r.delayStart = Date.now();
        TP.log(r, 'System', 'All approved. Safety delay started (' + S.setup.delay + ' min)', 'pend');
        TP.notify('all', 'Safety delay started', TP.m(r.amt) + ' · any ' + (r.kind === 'payout' ? 'officer' : 'signer') + ' can stop it', 'pend');
      } else TP.finishApproved(r);
    }
  };
  TP.finishApproved = function (r) {
    if (r.kind === 'payout') TP.executePayout(); else if (r.kind === 'beneficiary') TP.executeBeneficiary(); else TP.issueCode();
  };
  TP.reject = function (id, why) {
    var r = S.req; if (!r || r.st !== 'pending') return;
    r.ap[id] = 'rejected'; r.st = 'rejected'; r.reason = why;
    TP.log(r, TP.nm(id), 'Rejected: ' + why, 'bad'); TP.log(r, 'System', r.kind === 'withdrawal' ? 'Request closed. No code issued.' : 'Request closed. Nothing was paid.', 'bad');
    TP.notify('all', 'Request rejected', TP.nm(id) + ' rejected ' + (r.kind === 'beneficiary' ? 'new payee ' + r.payee : TP.m(r.amt)) + ': ' + why, 'bad');
  };
  TP.cancel = function (id, why) {
    var r = S.req; if (!r || ['done', 'sent', 'rejected', 'cancelled'].indexOf(r.st) > -1) return;
    r.st = 'cancelled'; TP.log(r, TP.nm(id), why, 'bad'); TP.notify('all', 'Request cancelled', why, 'bad');
  };
  TP.tick = function () { var r = S.req; if (r && r.st === 'delay' && Date.now() >= r.delayStart + r.delayMs) { TP.finishApproved(r); return true; } return false; };
  TP.skipDelay = function () { var r = S.req; if (r && r.st === 'delay') { r.delayStart = Date.now() - r.delayMs; TP.tick(); } };
  TP.issueCode = function () {
    var r = S.req, c = TP.digits(8);
    r.st = 'code'; r.code = c.slice(0, 4) + ' ' + c.slice(4); r.codeAt = Date.now(); S.reveal = false;
    TP.log(r, 'System', 'One-time cash code issued (amount-locked, 15 min)', 'ok');
    TP.notify([r.by], 'Your cash code is ready', TP.m(r.amt) + ' · expires in 15 minutes', 'ok');
  };
  TP.complete = function () {
    var r = S.req; r.st = 'done'; TP.log(r, TP.nm(r.by), 'Cash collected. Code used.', 'ok');
    TP.notify('all', 'Cash collected', TP.nm(r.by) + ' collected ' + TP.m(r.amt), 'ok'); S.lastDone = r; S.req = null;
  };
  TP.executePayout = function () {
    var r = S.req; r.st = 'sent'; r.session = 'NIP' + TP.digits(5) + '…' + TP.hx(r.id).slice(0, 3);
    TP.ACC.coop.bal -= r.amt; S.cfgs.coop.paid += r.amt;
    TP.log(r, 'System', 'Bank released the payout (simulated transfer) · ' + r.session, 'ok');
    TP.notify('all', 'Payout sent', TP.m(r.amt) + ' to ' + r.payee, 'ok'); S.lastDone = r; r.when = 'Today';
  };
  TP.executeBeneficiary = function () {
    var r = S.req, d = r.bdata; r.st = 'done';
    S.bens.push({ id: 'b' + (S.bens.length + 1), name: d.name, bank: d.bank, no: d.no, kind: d.kind, verified: true, cool: Date.now() + S.setup.cool * 3600000, recent: true });
    TP.log(r, 'System', 'Payee saved. Cooling-off ' + S.setup.cool + ' hours before the first payout.', 'ok');
    TP.notify('all', 'New payee approved', d.name + ' · cooling-off ' + S.setup.cool + ' hours', 'ok'); S.lastDone = r;
  };

  // ---- freeze (emergency, per account) and unfreeze (needs all)
  TP.freeze = function (id) {
    var e = { id: 'S-' + (2000 + S.hist.length), type: 'sec', acct: S.cur, amt: 0, st: 'sec', title: 'Account frozen by ' + TP.nm(id), when: 'Today', ref: '', audit: [] };
    TP.log(e, TP.nm(id), 'Pressed Freeze: emergency', 'bad'); TP.log(e, 'System', (S.cur === 'coop' ? 'All payouts' : 'All withdrawals') + ' blocked. All ' + (S.cur === 'coop' ? 'officers' : 'signers') + ' alerted.', 'sec'); e.ref = TP.chain(e);
    S.frozen = { by: id, un: {}, ev: e }; S.hist.unshift(e);
    if (S.req) TP.cancel(id, 'Cancelled because the account was frozen');
    TP.notify('all', TP.acc().short + ' frozen', TP.nm(id) + ' froze ' + (S.cur === 'coop' ? 'payouts' : 'withdrawals'), 'bad');
  };
  TP.approveUnfreeze = function (id) {
    var f = S.frozen; if (!f) return; f.un[id] = true; TP.log(f.ev, TP.nm(id), 'Approved unfreeze: biometric · signed ' + TP.ref(), 'ok');
    if (TP.IDS.every(function (i) { return f.un[i]; })) { TP.log(f.ev, 'All', 'Unfrozen with approval from all 3', 'ok'); TP.notify('all', TP.acc().short + ' unfrozen', 'All approved', 'ok'); S.frozen = null; }
  };

  // ---- setup and demo shortcut
  TP.activate = function () {
    var co = S.cur === 'coop', cf = S.setup;
    var e = { id: 'S-' + (1000 + S.hist.length), type: 'sec', acct: S.cur, amt: 0, st: 'sec', title: co ? 'Cooperative payouts activated' : 'Shared approvals activated', when: 'Today', ref: '', audit: [
      { t: TP.clock(), a: 'Bank (simulated)', x: 'Checked ' + (co ? 'the society resolution and ' : '') + 'all 3 verifications', k: 'ok' },
      { t: TP.clock(), a: 'Bank (simulated)', x: 'Registered 3 device keys and switched ' + (co ? 'payout approvals' : 'shared approvals') + ' on', k: 'ok' }] };
    e.ref = TP.chain(e);
    var seed = co ? TP.seedCoop() : TP.seed(); seed.hist.forEach(function (h) { h.acct = S.cur; if (!h.kind) h.kind = 'withdrawal'; TP.chain(h); });
    cf.active = true; cf.ref = co ? 'UDB-TP-00522' : 'UDB-TP-00417';
    S.hist = [e].concat(seed.hist, S.hist); S.notes = seed.notes.concat(S.notes);
    if (co && !S.bens.length) S.bens = TP.seedBens();
    TP.notify('all', (co ? 'Cooperative payouts' : 'Shared approvals') + ' active', 'Unity Demo Bank (simulated) confirmed the setup.', 'ok');
  };
  TP.demoSkip = function () {
    S.signedUp = true;
    ['coop', 'joint'].forEach(function (id) { TP.switchAcct(id); S.setup.bank = 'unity'; S.setup.inv = { B: 1, C: 1 }; S.setup.act = 1; TP.activate(); });
  };
})();
