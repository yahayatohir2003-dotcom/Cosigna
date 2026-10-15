/* Cosigna prototype - MOCK DATA ONLY.
   All people, banks, accounts and transactions are fictional. No real bank is connected. */
(function () {
  var TP = (window.TP = window.TP || {});
  TP.FT = window.FT || 1000;
  TP.DEMO_OTP = '482913';
  TP.IDS = ['A', 'B', 'C'];
  TP.PEOPLE = {
    A: { id: 'A', name: 'Amina Bello', short: 'Amina', init: 'AB', bvn: '7731', ph: '4471', col: '#2F6BFF' },
    B: { id: 'B', name: 'Chinedu Okafor', short: 'Chinedu', init: 'CO', bvn: '4417', ph: '2208', col: '#0E9384' },
    C: { id: 'C', name: 'Tunde Adeyemi', short: 'Tunde', init: 'TA', bvn: '9902', ph: '9035', col: '#7C5CFF' }
  };
  TP.BANKS = [
    { id: 'unity', name: 'Unity Demo Bank', note: 'Simulated partner bank', ok: true },
    { id: 'harmony', name: 'Harmony Sandbox Bank', note: 'Coming soon', ok: false },
    { id: 'savannah', name: 'Savannah Demo Bank', note: 'Coming soon', ok: false }
  ];
  TP.ACCOUNTS = [
    { id: 'a1', name: 'Sunrise Ventures Joint Account', no: '4821', rule: 'All signatories must sign', state: 'eligible' },
    { id: 'a2', name: 'Family Savings', no: '1180', rule: 'Either to sign', state: 'no', why: 'One person can already use a card, so approvals are not needed.' },
    { id: 'a3', name: 'Operations Account', no: '5521', rule: 'Class A/B signatories with limits', state: 'no', why: 'Class A/B mandates are not supported yet.' }
  ];
  TP.CHIPS = [500000, 1000000, 1500000, 2000000, 5000000];
  TP.OPT = { max: [5000000, 10000000, 20000000], hv: [250000, 500000, 1000000], delay: [30, 60] };
  TP.BALANCE = 48250000;   // sample balance, display only
  TP.TYPICAL = 600000;     // sample "usual withdrawal" used by the simulated AI risk check
  TP.HOW = [
    ['link', 'Link', 'Connect the joint account. The bank\'s signing rule always comes first.', ['Bank sign-in on the bank\'s page', 'Stricter-only rules']],
    ['send', 'Request', 'A signer asks for cash. An AI risk check reviews it before anyone approves.', ['AI risk warning', 'High-value rules']],
    ['user', 'Approve', 'Every signer approves on their own phone, with proof of who they are.', ['Fingerprint or PIN', 'Face check', 'Signed on device']],
    ['key', 'Cash code', 'The bank releases a single-use code for one amount, after a safety delay for big sums.', ['One-time code', 'Amount-locked', 'Safety delay']]
  ];
  TP.PROTECT = [
    ['bank', 'Bank rule always first', 'Cosigna can only add stricter rules, never loosen the bank\'s.', 'Rules'],
    ['id', 'BVN / NIN consent', 'Identity is checked with the signer\'s consent at sign-up.', 'Identity'],
    ['face', 'Live face check', 'A liveness test matched to your record. Required for high-value approvals.', 'Identity'],
    ['key', 'Device-bound secret key', 'Your key lives in the phone\'s secure chip and never leaves it.', 'Identity'],
    ['fp', 'Fingerprint or PIN', 'Every approval is confirmed on your phone.', 'Approvals'],
    ['sign', 'Signed approvals', 'Each approval is signed, so it cannot be forged or reused.', 'Approvals'],
    ['ai', 'AI risk warning', 'Flags unusual requests before you approve.', 'Monitoring'],
    ['clock', 'Safety delay', 'Big withdrawals wait, and any signer can stop them.', 'Cash'],
    ['lock', 'One-time cash code', 'Single use, amount-locked, and it expires in minutes.', 'Cash'],
    ['chain', 'Tamper-evident audit trail', 'Every record is chained to the one before it.', 'Monitoring'],
    ['stop', 'Instant freeze', 'Any signer can stop all withdrawals at once.', 'Cash'],
    ['bell', 'Alerts to everyone', 'Every request, approval and code is announced.', 'Monitoring']
  ];
  function a(t, who, x, k) { return { t: t, a: who, x: x, k: k || 'info' }; }
  TP.ref = function () {
    var h = '0123456789ABCDEF', s = '';
    for (var i = 0; i < 4; i++) s += h[Math.floor(Math.random() * 16)];
    return s + '…' + h[Math.floor(Math.random() * 16)] + h[Math.floor(Math.random() * 16)] + h[Math.floor(Math.random() * 16)];
  };
  TP.seed = function () {
    var ap3 = { A: 'approved', B: 'approved', C: 'approved' };
    return {
      hist: [
        { id: 'R-0912', type: 'req', amt: 1500000, by: 'B', ch: 'BR', st: 'done', hv: true, when: 'Mon, 28 Sep', ap: ap3, risk: { score: 31, level: 'Medium' }, ref: TP.ref(), audit: [
          a('2:02 pm', 'Chinedu', 'Requested ₦1,500,000 (branch pickup)'), a('2:05 pm', 'Amina', 'Approved: biometric + face · signed', 'ok'), a('2:07 pm', 'Tunde', 'Approved: biometric + face · signed', 'ok'),
          a('2:08 pm', 'System', 'Safety delay started (30 min)', 'pend'), a('2:38 pm', 'System', 'One-time cash code issued', 'ok'), a('2:52 pm', 'Chinedu', 'Cash collected', 'ok')] },
        { id: 'R-0911', type: 'req', amt: 3000000, by: 'A', ch: 'BR', st: 'rejected', hv: true, when: 'Fri, 25 Sep', reason: 'Amount not agreed', ap: { A: 'approved', B: 'pending', C: 'rejected' }, risk: { score: 40, level: 'Medium' }, ref: TP.ref(), audit: [
          a('10:12 am', 'Amina', 'Requested ₦3,000,000 (branch pickup)'), a('10:20 am', 'Tunde', 'Rejected: Amount not agreed', 'bad'), a('10:20 am', 'System', 'Request closed. No code issued.', 'bad')] },
        { id: 'R-0905', type: 'req', amt: 850000, by: 'C', ch: 'POS', st: 'done', hv: false, when: 'Tue, 22 Sep', ap: ap3, risk: { score: 16, level: 'Low' }, ref: TP.ref(), audit: [
          a('4:40 pm', 'Tunde', 'Requested ₦850,000 (POS / ATM)'), a('4:44 pm', 'Chinedu', 'Approved: biometric · signed', 'ok'), a('4:49 pm', 'Amina', 'Approved: biometric · signed', 'ok'), a('4:49 pm', 'System', 'One-time cash code issued', 'ok'), a('5:03 pm', 'Tunde', 'Cash collected', 'ok')] },
        { id: 'S-0903', type: 'sec', amt: 0, st: 'sec', title: 'Account frozen by Tunde', when: 'Sun, 20 Sep', ref: TP.ref(), audit: [
          a('9:15 pm', 'Tunde', 'Pressed Freeze: emergency', 'bad'), a('9:16 pm', 'System', 'All signers alerted', 'sec'), a('9:40 pm', 'All', 'Unfrozen with approval from all 3 signers', 'ok')] }
      ],
      notes: [
        { id: 1, to: 'all', t: 'Yesterday', title: 'Shared approvals active', body: 'Unity Demo Bank (simulated) confirmed the setup.', k: 'ok', read: true },
        { id: 2, to: 'all', t: 'Mon', title: 'Cash collected', body: 'Chinedu collected ₦1,500,000 at the branch.', k: 'ok', read: true }
      ]
    };
  };
})();
