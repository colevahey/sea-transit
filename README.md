# R(SEA)V Transit

A progressive web app for real-time Seattle-area transit, built on the [OneBusAway Puget Sound API](https://developer.onebusaway.org/api/where/).

## Features

**Nearby**
- Stops sorted by distance from your current location
- Favorite stops pinned at the top with live arrival previews
- Pull-to-refresh, live distance updates as you move
- Stop search by name or number

**Arrivals**
- Real-time predictions with on-time / late / early status
- Scheduled-only badge on arrivals without live GPS tracking
- Auto-refreshes every 30 seconds

**Lines**
- Nearby routes grouped by line, showing next arrivals per direction

**Map**
- Stop markers — tap to see stop info and jump to arrivals
- Live vehicle markers showing real-time bus positions, updated every 15 seconds
  - Directional arrow indicates heading
  - Greyed out if GPS signal is more than 3 minutes stale
  - Tap a vehicle for route, on-time status, and upcoming stops
- Dark and light map tiles

**General**
- Liquid glass design system
- Dark and light themes
- Installable PWA — add to home screen on iOS or Android

## Contributing

See [CONTRIBUTING.md](CONTRIBUTING.md) for local setup, API key configuration, and deployment notes.
