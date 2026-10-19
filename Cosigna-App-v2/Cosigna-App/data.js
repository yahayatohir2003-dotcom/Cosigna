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
    { id: 'a1', type: 'joint', name: 'Sunrise Ventures Joint Account', no: '4821', rule: 'All signers must sign', state: 'eligible' },
    { id: 'a4', type: 'coop', name: 'Unity Thrift & Credit Cooperative', no: '7714', rule: 'Any 2 officers sign. The Treasurer must be one.', state: 'eligible' },
    { id: 'a2', type: 'joint', name: 'Family Savings', no: '1180', rule: 'Either to sign', state: 'no', why: 'One person can already use a card, so approvals are not needed.' },
    { id: 'a3', type: 'coop', name: 'Youth Union Society', no: '5521', rule: 'Class A/B signatories with limits', state: 'no', why: 'Class A/B mandates are not supported yet.' }
  ];
  TP.ACC = {
    joint: { id: 'joint', type: 'joint', name: 'Sunrise Ventures Joint Account', short: 'Joint account', no: '4821', bal: 48250000, acctId: 'a1' },
    coop: { id: 'coop', type: 'coop', name: 'Unity Thrift & Credit Cooperative', short: 'Cooperative', no: '7714', bal: 86400000, acctId: 'a4' }
  };
  TP.ROLES = { A: 'President', B: 'Secretary', C: 'Treasurer' };
  TP.PAYTYPES = [['loan', 'Loan disbursement', 'Loan approval no.'], ['div', 'Dividend / share-out', 'AGM resolution no.'], ['sup', 'Supplier payment', 'Committee resolution or invoice no.'], ['refund', 'Member savings refund', 'Exit approval no.']];
  TP.MEMBERS = ['Ngozi Eze', 'Musa Danjuma', 'Femi Adeleke', 'Hauwa Bello', 'Ifeanyi Obi'];
  TP.TYPICAL_PAY = 400000;  // sample "usual payout" used by the simulated AI check
  TP.OPT_COOP = { max: [5000000, 10000000, 20000000], hv: [500000, 1000000, 2000000], delay: [30, 60], cool: [24, 48], cap: [10000000, 20000000, 30000000] };
  TP.NAMEBOOK = ['Adaeze Nwosu', 'Yusuf Garba', 'Bola Ajayi', 'Esther Udo', 'Kabir Sani', 'Tolu Martins', 'Zainab Lawal', 'Peter Eze', 'Ruth Danladi', 'Sade Coker'];
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

  TP.PROTECT_COOP = [
    ['bank', 'Bank mandate first', 'The bank\'s signing rule (2 officers, Treasurer required) always wins. Cosigna only adds stricter rules.', 'Rules'],
    ['stop', 'Payouts only: no cash', 'The account pays by bank transfer to verified accounts. There is no cash withdrawal.', 'Rules'],
    ['doc', 'Approval reference required', 'Every payout cites a loan approval, resolution or invoice number.', 'Rules'],
    ['id', 'Name-verified payees', 'The account name is checked with the bank before a payee is saved.', 'Payees'],
    ['clock', 'New-payee cooling-off', 'A new payee cannot be paid until the cooling-off period ends.', 'Payees'],
    ['users', 'Maker-checker', 'The person who prepares a payout cannot approve it. The Treasurer checks, and cannot prepare.', 'Approvals'],
    ['alert', 'Conflict-of-interest block', 'Officers cannot approve or prepare payouts to themselves.', 'Approvals'],
    ['face', 'Live face check', 'Required for high-value payouts, matched to your record.', 'Approvals'],
    ['fp', 'Fingerprint or PIN', 'Every approval is confirmed on your phone.', 'Approvals'],
    ['sign', 'Signed approvals', 'Each approval is signed on your device and cannot be reused.', 'Approvals'],
    ['key', 'Device-bound secret key', 'Your key lives in the phone\'s secure chip and never leaves it.', 'Approvals'],
    ['gauge', 'Limits and daily cap', 'A per-payout limit and a daily payout cap protect the pooled funds.', 'Limits'],
    ['dup', 'Duplicate payout check', 'The same payee and amount twice in a day is flagged.', 'Limits'],
    ['clock', 'Safety delay', 'High-value payouts wait, and any officer can stop them.', 'Limits'],
    ['ai', 'AI risk warning', 'Flags unusual payouts before you approve.', 'Monitoring'],
    ['chain', 'Tamper-evident audit trail', 'Every record is chained to the one before it.', 'Monitoring'],
    ['bell', 'Alerts to all officers', 'Every payout request, approval and payment is announced.', 'Monitoring'],
    ['stop', 'Instant freeze', 'Any officer can stop all payouts at once.', 'Limits']
  ];
  TP.seedBens = function () {
    var h = 3600000;
    return [
      { id: 'b1', name: 'Ngozi Eze', bank: 'Unity Demo Bank', no: '0412', kind: 'Member', verified: true, cool: 0, recent: false },
      { id: 'b2', name: 'Musa Danjuma', bank: 'Harmony Sandbox Bank', no: '7721', kind: 'Member', verified: true, cool: 0, recent: false },
      { id: 'b3', name: 'Bright Supplies Ltd', bank: 'Savannah Demo Bank', no: '3305', kind: 'Supplier', verified: true, cool: 0, recent: true },
      { id: 'b4', name: 'Chinedu Okafor', bank: 'Unity Demo Bank', no: '2208', kind: 'Member', officer: 'B', verified: true, cool: 0, recent: false },
      { id: 'b5', name: 'Grace Ibe', bank: 'Unity Demo Bank', no: '9150', kind: 'Member', verified: true, cool: Date.now() + 18 * h, recent: true }
    ];
  };
  TP.seedCoop = function () {
    var ap2 = { A: 'approved', B: 'na', C: 'approved' }, ap3 = { A: 'approved', B: 'approved', C: 'approved' };
    function pay(id, amt, by, type, payee, st, when, need, ap, risk, audit, extra) {
      var o = { id: id, type: 'req', kind: 'payout', acct: 'coop', payType: type, payee: payee, amt: amt, by: by, st: st, hv: amt >= 1000000, when: when, need: need, ap: ap, risk: risk, refNo: extra && extra.refNo || '', ref: TP.ref(), audit: audit };
      if (extra) for (var k in extra) o[k] = extra[k]; return o;
    }
    return {
      hist: [
        pay('P-0731', 750000, 'A', 'Loan disbursement', 'Ngozi Eze', 'sent', 'Mon, 28 Sep', ['A', 'C'], { A: 'approved', B: 'na', C: 'approved' }, { score: 8, level: 'Low' }, [
          a('11:02 am', 'Amina', 'Prepared payout ₦750,000 to Ngozi Eze (LN-0231)'), a('11:03 am', 'AI check', 'Risk Low (8/100) · simulated', 'sec'), a('11:04 am', 'Amina', 'Approved: biometric · signed', 'ok'),
          a('11:20 am', 'Tunde', 'Approved as Treasurer: biometric · signed', 'ok'), a('11:20 am', 'System', 'Bank released the payout (simulated transfer)', 'ok')], { refNo: 'LN-0231', session: 'NIP00481…2D1' }),
        pay('P-0730', 2400000, 'B', 'Dividend / share-out', 'All members (5)', 'sent', 'Fri, 25 Sep', ['A', 'B', 'C'], ap3, { score: 20, level: 'Low' }, [
          a('9:10 am', 'Chinedu', 'Prepared dividend ₦2,400,000 to 5 members (AGM/2026/03)'), a('9:11 am', 'AI check', 'Risk Low (20/100) · simulated', 'sec'), a('9:12 am', 'Chinedu', 'Approved: biometric + face · signed', 'ok'),
          a('9:40 am', 'Amina', 'Approved: biometric + face · signed', 'ok'), a('9:44 am', 'Tunde', 'Approved as Treasurer: biometric + face · signed', 'ok'), a('9:45 am', 'System', 'Safety delay started (30 min)', 'pend'), a('10:15 am', 'System', 'Bank released 5 payouts (simulated)', 'ok')], { refNo: 'AGM/2026/03', session: 'NIP00377…9AC' }),
        pay('P-0729', 1200000, 'A', 'Supplier payment', 'Bright Supplies Ltd', 'rejected', 'Tue, 22 Sep', ['A', 'B', 'C'], { A: 'approved', B: 'pending', C: 'rejected' }, { score: 38, level: 'Medium' }, [
          a('3:30 pm', 'Amina', 'Prepared payout ₦1,200,000 to Bright Supplies Ltd (INV-884)'), a('3:35 pm', 'Tunde', 'Rejected: Invoice not approved by committee', 'bad'), a('3:35 pm', 'System', 'Request closed. No payout made.', 'bad')], { refNo: 'INV-884', reason: 'Invoice not approved by committee' })
      ],
      notes: [{ id: 21, to: 'all', t: 'Yesterday', title: 'Cooperative payouts active', body: 'Unity Demo Bank (simulated) confirmed the setup.', k: 'ok', read: true }]
    };
  };
})();
