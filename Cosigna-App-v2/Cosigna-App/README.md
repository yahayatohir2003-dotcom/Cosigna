# Cosigna (demo prototype)

Cosigna is an **approval layer for bank joint accounts**. It does not hold money, store bank passwords, or move money on its own. The bank stays in charge and Cosigna can only add stricter safety conditions.

> **This is a prototype for demonstration.** The bank, people, accounts, balances and transactions are fictional sample data. No real bank is connected. Face, fingerprint, BVN/NIN checks, the bank's signature checking and the **AI risk warning are all simulated**.

## What the demo shows

1. **Intro:** splash, welcome, and a 4-step "How it works" guide.
2. **Sign-up and identity:** phone and PIN, OTP, BVN/NIN consent, live face check, and creation of a device-bound secret key.
3. **Linking the joint account:** choose a bank, simulated bank sign-in and consent, pick an eligible account, see the bank's read-only signing rule, add stricter-only safety conditions, invite and verify the other signers, bank activation.
4. **Dashboard:** protection status, AI Risk Watch, request cash, freeze, recent activity.
5. **Request cash:** live AI risk check, live security requirements (all must approve, fingerprint/PIN, face check and safety delay for high-value amounts such as ₦1.5M, ₦2M and ₦5M+).
6. **Approval:** push-style alerts, AI Risk Warning with reasons, fingerprint/PIN, face verification, device signing, approval tracking.
7. **Safety delay:** a countdown ring. Any signer can stop the withdrawal.
8. **One-time cash code:** reveal with fingerprint, amount-locked, expiry timer, receipt.
9. **Security Center, Activity with a tamper-evident audit chain, Alerts, Profile, Freeze and unfreeze (needs all signers), Sign out.**

## A 90-second demo path for your video

1. On the welcome screen tap **See how it works**, then go back and tap **Skip setup (demo shortcut)**. (Or run through the full setup once for a longer video.)
2. On the dashboard point out the **protection status** and **AI Risk Watch**, then tap the blue **+** button.
3. Choose **₦2M** and watch the **requirements and AI risk** change. Tap **Bank branch** and see the risk drop. Tap **POS / ATM agent** and **₦5M** to see it rise.
4. Tap **Continue**, **Verify and send**, then scan the fingerprint, complete the face check and watch the **signing** screen.
5. On the tracking screen tap **Demo: switch to Chinedu's phone**. A push alert appears. Read the **AI Risk Warning**, tap **Approve**, and repeat as Tunde.
6. The **safety delay** ring starts. Tap **Demo: back to Amina's phone**, then **Demo: skip the delay**.
7. Tap **Show my cash code**, **Tap to reveal**, and then **I have my cash**.
8. Open **Activity** to show the audit trail, and **Security** to show all 12 protections.

Sample PIN: `1234`. Sample OTP: `482913`.

**About the AI risk score:** it is a simple simulated rule set, not a trained model. It also treats requests made between 10 pm and 6 am as unusual, so record in the daytime if you want the scores shown in the app's explanation (for example, ₦2M by agent is Medium).

## Get the APK (no installs on your computer)

If you already have the repo from before, you only need to **replace these six files** with the new ones: `index.html`, `styles.css`, `data.js`, `state.js`, `screens.js`, `app.js`. Commit. The build starts by itself.

For a fresh repo:
1. Create a free account on github.com, then click **New repository**. Choose **Private**.
2. Click **uploading an existing file** and drag in all the files from this folder (they are all at the top level). Commit.
3. Click **Add file → Create new file**, type `.github/workflows/build-apk.yml` as the name, paste the contents of `build-apk.yml`, and commit.
4. Open the **Actions** tab. When the run has a green tick, scroll to **Artifacts** at the bottom of the run and download **Cosigna-Prototype-APK**. Unzip it to get `app-debug.apk`.

### Install on an Android phone

Send `app-debug.apk` to the phone, open it, allow "Install unknown apps" if asked, tap **Install**. **If an older Cosigna or TogetherPay app is installed, uninstall it first.**

### Recording the video

On Android, use the built-in screen recorder (swipe down, **Screen record**). Turn on Do Not Disturb, set the phone to stay awake, and charge it first.

## Project structure

| File | What it does |
|---|---|
| `index.html` | App shell. Loads the files below. |
| `styles.css` | The visual design: navy and royal blue, green = success, amber = pending, red = emergency, violet = AI. |
| `data.js` | All mock data: sample people, simulated banks and accounts, sample history, the security list. |
| `state.js` | App state and rules: bank rule first, stricter-only conditions, approvals, safety delay, freeze, simulated AI risk, audit chain. |
| `screens.js` | Every screen and bottom sheet. |
| `app.js` | Navigation, buttons, simulated fingerprint/PIN/face/signing, timers, alerts, Android back button. |
| `capacitor.config.json`, `package.json` | Wrap the app as an Android project. |
| `make_icons.py` | Creates the app icon during the build. |
| `.github/workflows/build-apk.yml` | Builds the downloadable APK on GitHub. |

## Limits

- Not a banking app. No real bank connection, credentials, money, identity or biometric data.
- Face, fingerprint and signing are animations. No camera, sensor or real keys are used.
- Android only. This is a debug APK for demonstrations, not a Play Store release.
- If the build fails, open the failed run in the Actions tab and read the last lines of the red step.
