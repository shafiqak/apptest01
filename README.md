# Namaz: prayer times, Hijri calendar, Qibla, Salah guide, duas, Quran

One codebase, three ways to use it:

| What | Where | How it updates |
|---|---|---|
| Website / installable web app (PWA) | `docs/` served by GitHub Pages | push to `main` |
| Masjid display (Raspberry Pi) | opens `docs/index.html` in kiosk mode | `git pull`, the page reloads itself at 03:05 |
| Android app with notifications | `android/` (built from `docs/`) | rebuild the APK in GitHub Actions |

## 1. Put it on GitHub
1. Create a repository and upload everything in this folder (keep the folder structure).
2. **Settings → Pages**: Source = *Deploy from a branch*, branch `main`, folder **/docs**. The web app is then at `https://<you>.github.io/<repo>/`.

## 2. Build the Android app (no Android Studio needed)
1. Open the **Actions** tab, choose **Build Android app**, press **Run workflow** (it also runs on every push).
2. When it finishes, open the run and download the artifact **namaz-debug-apk**. Unzip it and send `app-debug.apk` to your phone.
3. Install it (allow "install unknown apps" for your file manager or browser).
4. Open the app → **More → Settings → Notifications**. Turn them on and allow:
   - Notifications (Android asks once)
   - **Alarms & reminders / exact alarms** (the "Allow exact alarms" button opens that screen). Without it, alerts can be a few minutes late.
   - On some phones (Xiaomi, Oppo, Vivo, Samsung) also set the app's battery use to **Unrestricted**, or they may delay alerts.

**Before you publish anywhere:** change `appId` in `capacitor.config.json` to an id you own (for example `com.yourname.namaz`). It cannot be changed after the app is on Google Play.

## 3. How notifications work
The app schedules the next two weeks of alerts on the phone itself (no server, works offline) and refreshes them each time you open the app, change a setting, or change city. If you do not open the app for two weeks, alerts stop until you do.

Choices: before azan (5 to 30 min), at azan, at namaz (jamaat) time, Friday reminder, morning and evening azkar, verse of the day, Ramadan reminders (Sehri and Iftar), and sound mode (sound, vibrate, silent).
The azan audio itself is not included: add a licensed audio file later (see "Azan sound" below).

## Azan sound (later)
Put the audio file at `android/app/src/main/res/raw/azan.mp3` and tell me; the channel needs a one-line change.

## Content status
Salah, duas and Ramadan guides are drafts pending review by your imam. Quran data credits are in `docs/data/CREDITS.txt`.

## Tested vs not tested
The web app and the notification scheduling logic were tested in a headless browser (with a stand-in for the Android plugin). The Android build itself and real-device behaviour (exact alarms, battery restrictions, compass, GPS) have **not** been tested yet. If the first GitHub Actions run fails, send the error log.
