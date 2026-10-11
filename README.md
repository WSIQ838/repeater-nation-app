# Repeater Nation App

Phone and tablet app for [Repeater Nation](https://repeaternation.com).

## Download

Get the latest Android `.apk` and iPhone file from the [Releases page](https://github.com/WSIQ838/repeater-nation-app/releases/latest). iPhone install steps are in [docs/ios-install.md](docs/ios-install.md).

## What the app is (v0.2)

A native phone and tablet app built with Tauri 2 and React. It has its own screens and reads the same data as the website through the Base44 account (`@base44/sdk`).

- **Phone:** bottom tabs (Home, Repeaters, Nets, Clubs, More). **Tablet (900 px and wider):** side menu with list and detail side by side.
- **In the app now:** sign-in (email and password), Home, Repeaters (search, filters, detail, directions), Nets & Events, Clubs, Tools (frequency/offset, CTCSS/DCS, antenna, coax and SWR, power and ERP, distance, Morse), Me.
- **Still opening on the website:** Parks & Summits, Forum, Marketplace, Equipment, Trips, SDR Streams, Logbook, Messages, Emergency. Each becomes a native screen in a later release.
- **Not yet:** Google sign-in (needs a small change to the website's sign-in callback page), push notifications, maps.

The earlier v0.1 releases just showed the website with a tab bar on top.

## Layout of the code

- `src/App.jsx`: shell, navigation, tab bar and side menu.
- `src/screens/`: one file per screen. `src/tools/`: the calculators.
- `src/lib/api.js`: sign-in and all data access. Add `?mock` to the address to run with sample data and no sign-in.
- `design/index.html`: the clickable design the screens follow.

## Build it yourself

```bash
npm install
npm run dev                # the app in a browser, add ?mock for sample data
npm run build              # production build into dist/
npm run tauri:dev          # desktop window
```

Android and iPhone builds run on GitHub Actions (`.github/workflows/android.yml` and `ios.yml`) when started by hand from the Actions tab or when a tag like `v0.2.0` is pushed. They attach the files to the release for the version in `package.json`. Android builds are signed with the test key in `src-tauri/android/` until a real key is added as the repository secrets `ANDROID_KEYSTORE_BASE64`, `ANDROID_KEYSTORE_PASSWORD` and `ANDROID_KEY_ALIAS`.

## Screens in the design (`design/index.html`)

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
