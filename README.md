# Repeater Nation App

Phone and tablet app for [Repeater Nation](https://repeaternation.com).

## Download

Get the latest Android `.apk` and iPhone file from the [Releases page](https://github.com/WSIQ838/repeater-nation-app/releases/latest). iPhone install steps are in [docs/ios-install.md](docs/ios-install.md).

## How it works today (v0.1)

The app opens the real Repeater Nation website and adds a tab bar on phones and small tablets: **Home, Repeaters, Nets, Clubs, More**. More opens a menu with Parks & Summits, Forum, Marketplace, Equipment, Trips, SDR Streams, Logbook, Tools, Messages, Emergency and Me. Sign in on the site's own sign-in page.

- `src-tauri/shell.js` is the tab bar. It is injected into every page, because the site cannot be shown inside another page (it sends `X-Frame-Options: DENY`).
- On screens 1024 px wide or more the site already has its own side menu, so the tab bar stays hidden.
- Known limits of this first version: features that need location or the microphone inside the page (such as GPS Navigation) are not enabled yet.

## Next: native screens

`index.html` is the clickable design for the full app (open it in a browser, toggle Phone / Tablet). Screens from that design will replace the website pages one at a time, starting with Tools.

## Build it yourself

```bash
npm install
npm run check              # syntax check of the tab bar script
npm run tauri:dev          # desktop window, for trying the tab bar at a narrow width
```

Android and iPhone builds run on GitHub Actions (`.github/workflows/android.yml` and `ios.yml`) whenever a tag like `v0.1.0` is pushed, or when started by hand from the Actions tab. They attach the files to the release for that version. Android builds are signed with the test key in `src-tauri/android/` until a real key is added as the repository secrets `ANDROID_KEYSTORE_BASE64`, `ANDROID_KEYSTORE_PASSWORD` and `ANDROID_KEY_ALIAS`.

## Screens in the design (`index.html`)

Built from the sections the site already has.

- **Home**: live net with check-in, XP and level, friends online, nearest repeaters, your clubs, upcoming events
- **Repeaters**: directory with filters, list/map, ratings, photos, access requests
- **Nets & Events**: live net check-in, weekly nets with streaks, event calendar
- **Clubs**: club list and detail, join, threads, officers, streak badges
- **Parks & Summits**: POTA and SOTA, favorites, schedule an activation
- **Forum**, **Marketplace**, **Equipment** (check out, return, reserve), **Messages**
- **Tools** ("Operator Tools", same 9 categories as the website): Most Used, Repeaters & Directories, Logbook & Awards, On the Air & Nets, Propagation & Spotting, Satellites, Digital Radio Networks, Weather & Situational Awareness, Calculators & Reference, HAM Learning. Search and category filters work. Tools that already have an app screen (Net Control, POTA, SOTA, Equipment, Logger, Emergency, SDR, Trips, directories) open it. The calculators work (Frequency, CTCSS/DCS, Channel Planner, Antenna, Coax, Power & ERP, Distance, Morse, FCC lookup). The rest show an example readout or open the full tool.
- **Trips**, **SDR Streams**, **Logbook** (add contacts, export), **Emergency & Situational Awareness** (alerts, emergency nets, SOS, I'm safe, go-kit)
- **Me**: profile, notifications, privacy

Phone: five tabs (Home, Repeaters, Nets, Clubs, More) plus a More hub. Tablet: a grouped side rail with list and detail side by side.
