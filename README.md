# Seattle Transit PWA

A progressive web app for real-time Seattle transit arrivals, built on the [OneBusAway Puget Sound API](https://developer.onebusaway.org/api/where/).

## Features

- Nearby stops using your current location
- Real-time arrival predictions with on-time status
- Stop search by name
- iOS-style liquid glass UI
- Installable PWA (works offline for the shell)

## Setup

### 1. Get an API key

Register at [developer.onebusaway.org](https://developer.onebusaway.org) to get a free API key.

### 2. Add your API key

Create `config.js` in the project root and add your key:

```js
const CONFIG = {
  API_KEY: 'your-key-here',
  BASE_URL: 'https://api.pugetsound.onebusaway.org/api/where',
};
```

`config.js` is gitignored so your key stays local.

Alternatively, paste your key in the **Settings** tab of the app — it's saved to `localStorage`.

### 3. Run locally

Any static file server works:

```bash
npx serve .
# or
python3 -m http.server 3000
```

Then open `http://localhost:3000`.

## Deploy to Netlify

1. Push this repo to GitHub
2. Connect it in the Netlify dashboard (Build command: *none*, Publish directory: `.`)
3. Done — `netlify.toml` handles routing

## Project structure

```
sea-transit/
├── index.html        # App shell
├── sw.js             # Service worker (offline support)
├── manifest.json     # PWA manifest
├── netlify.toml      # Netlify config
├── config.js         # API key (gitignored — create locally)
├── css/
│   └── style.css     # Liquid glass design system
├── js/
│   └── app.js        # App logic + OBA API client
└── icons/
    ├── icon-192.png
    └── icon-512.png
```

## API

Built on the [OneBusAway REST API](https://developer.onebusaway.org/api/where/) (Puget Sound instance).
Key endpoints used:
- `stops-for-location` — nearby stops
- `arrivals-and-departures-for-stop` — live arrivals
