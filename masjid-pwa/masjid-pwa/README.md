# Namaz: prayer times, Hijri calendar, Qibla, Salah guide, duas and Quran

One web app (`docs/`) used three ways:

1. **Website / installable PWA**: GitHub Pages, source folder `/docs`.
2. **Display on a Raspberry Pi**: open `docs/index.html` in kiosk mode (add `?display` for the wide layout on a touch screen).
3. **Android app**: the same files wrapped with Capacitor; this adds real notifications (azan, namaz, Friday, azkar, verse of the day).

## Build the Android APK (no Android Studio needed)
1. Put everything in this folder in a GitHub repository, **including the hidden `.github` folder**.
2. Open the repository, go to **Actions**, choose **Build Android APK**, then **Run workflow**.
3. When it finishes, open the run and download **namaz-debug-apk** (a zip containing `app-debug.apk`).
4. Copy the APK to the phone, open it, and allow "Install unknown apps" for your file manager or browser.

If the build fails, open the failed step and copy the error text; the usual causes are small version mismatches.

## Before you publish
- **App ID:** `app.namaz.prayertimes` in `capacitor.config.json` is a placeholder. Change it to one you own (reverse domain, for example `com.yourname.namaz`) **before** the first release, then run `npx cap sync android` (the CI does this). The app ID cannot be changed after publishing to Google Play.
- **Play Store:** needs a signed release bundle (AAB), a developer account, a privacy policy and the Data safety form. The app uses location only on the phone and sends the city or coordinates to Open-Meteo for weather and city search.
- **Azan sound:** none is included. Add a licensed audio file as `android/app/src/main/res/raw/azan.mp3` and tell me, and I will add an "Azan" sound option.

## Notifications: how they work and their limits
- The app schedules about the next 10 to 14 days of alerts on the phone and refreshes them each time it is opened. If it is not opened for two weeks, alerts stop until it is opened again.
- Android 12 and later needs "Alarms & reminders" permission for exact timing. The app shows a button for it in Settings. Without it, alerts can be a few minutes late.
- Some phones (Xiaomi, Oppo, Vivo, Samsung and others) stop apps in the background. Turn off battery optimisation for the app if alerts are missed.

## Content status
Salah, dua and Quran-guide content is marked as a draft pending review by a scholar. Quran data credits are in `docs/data/CREDITS.txt`.

## Updating
Edit files in `docs/`, push to GitHub. Pages updates the website; run the Android workflow to get a new APK. A Raspberry Pi can `git pull` and reload.
