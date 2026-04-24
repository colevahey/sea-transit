# Contributing

## Local setup

The deployed app routes all API calls through a Netlify serverless function (`netlify/functions/transit.js`) that injects the API key server-side — public users don't need a key. If you're running a fork locally you'll need your own.

### 1. Get an API key (forks only)

Register at [developer.onebusaway.org](https://developer.onebusaway.org) for a free key against the Puget Sound instance.

Create `config.js` in the project root:

```js
const CONFIG = {
  API_KEY: 'your-key-here',
};
```

`config.js` is gitignored. Alternatively, paste your key in the **Settings** tab of the app — it's saved to `localStorage`.

### 2. Run locally

The simplest approach is the Netlify CLI, which runs the serverless function locally:

```bash
npm install -g netlify-cli
netlify dev
```

Or use any static file server if you've set your key in `config.js` and have temporarily pointed `PROXY_URL` in `app.js` directly at the OBA API:

```bash
python3 -m http.server 3000
```

Open `http://localhost:3000`.

## Project structure

```
sea-transit/
├── index.html          # App shell — all views declared here
├── sw.js               # Service worker (network-first API, cache-first static)
├── manifest.json       # PWA manifest
├── netlify.toml        # Netlify config + function routing
├── config.js           # API key (gitignored — create locally)
├── css/
│   └── style.css       # Design system + all component styles
├── js/
│   └── app.js          # All app logic: routing, API client, map, state
├── netlify/
│   └── functions/
│       └── transit.js  # Serverless proxy — keeps API key server-side
└── icons/
    ├── icon.svg
    ├── icon-192.png
    └── icon-512.png
```

## Deploying to Netlify

1. Push to GitHub
2. Connect the repo in the Netlify dashboard — build command: *none*, publish directory: `.`
3. Set `OBA_API_KEY` as an environment variable in Netlify (the function reads it server-side)

`netlify.toml` handles SPA routing and the function mount automatically.

## API

Built on the [OneBusAway REST API](https://developer.onebusaway.org/api/where/) (Puget Sound instance, agencies 1 and 40).

| Endpoint | Used for |
|---|---|
| `stops-for-location` | Nearby stops, map stop loading |
| `arrivals-and-departures-for-stop` | Live arrivals for a stop |
| `vehicles-for-agency/{id}` | Live vehicle positions on the map |
| `trip-for-vehicle/{id}` | Upcoming stops for a tapped vehicle |
| `routes-for-location` | Lines tab route list |
