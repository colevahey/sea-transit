/* ─── Seattle Transit PWA ───────────────────────────────────────────────────── */

const PROXY_URL = '/api/transit';

// ─── SVG icon library ─────────────────────────────────────────────────────────
const ICONS = {
  bus: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round">
    <rect x="1.5" y="4" width="21" height="12" rx="2"/>
    <rect x="2.5" y="7.5" width="3" height="6" rx="0.75"/>
    <rect x="7" y="7.5" width="3.5" height="6" rx="0.75"/>
    <rect x="12" y="7.5" width="3.5" height="6" rx="0.75"/>
    <rect x="17" y="7.5" width="4" height="6" rx="0.75"/>
    <rect x="4" y="4" width="11" height="2" rx="0.5" fill="currentColor" stroke="none" opacity="0.3"/>
    <circle cx="22" cy="10.5" r="0.8" fill="currentColor" stroke="none"/>
    <line x1="1.5" y1="16" x2="22.5" y2="16" opacity="0.35"/>
    <circle cx="6" cy="20.5" r="1.75"/>
    <circle cx="6" cy="20.5" r="0.65" fill="currentColor" stroke="none"/>
    <circle cx="17.5" cy="20.5" r="1.75"/>
    <circle cx="17.5" cy="20.5" r="0.65" fill="currentColor" stroke="none"/>
  </svg>`,

  rail: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.75" stroke-linecap="round" stroke-linejoin="round">
    <rect x="4" y="2" width="16" height="14" rx="2"/>
    <path d="M4 8h16M8 2v6M16 2v6"/>
    <circle cx="8" cy="19" r="1.5"/><circle cx="16" cy="19" r="1.5"/>
    <path d="M6.5 19l-2 2M17.5 19l2 2M8 17l8-1"/>
  </svg>`,

  ferry: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.75" stroke-linecap="round" stroke-linejoin="round">
    <path d="M2 20c2-2 4-2 6 0s4 2 6 0 4-2 6 0"/>
    <path d="M5 16l1-7h12l1 7"/>
    <path d="M12 9V5M9 5h6"/>
  </svg>`,

  warning: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.75" stroke-linecap="round" stroke-linejoin="round">
    <path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"/>
    <line x1="12" y1="9" x2="12" y2="13"/><line x1="12" y1="17" x2="12.01" y2="17"/>
  </svg>`,

  locationOff: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.75" stroke-linecap="round" stroke-linejoin="round">
    <line x1="1" y1="1" x2="23" y2="23"/>
    <path d="M13.4 13.4A3 3 0 0 1 8.6 8.6"/>
    <path d="M17.94 17.94A10 10 0 0 1 12 20c-7 0-11-8-11-8a18.09 18.09 0 0 1 5.06-5.94"/>
    <path d="M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19"/>
  </svg>`,

  search: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.75" stroke-linecap="round" stroke-linejoin="round">
    <circle cx="11" cy="11" r="8"/><path d="m21 21-4.35-4.35"/>
  </svg>`,

  clock: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.75" stroke-linecap="round" stroke-linejoin="round">
    <circle cx="12" cy="12" r="10"/>
    <polyline points="12 6 12 12 16 14"/>
  </svg>`,

  sun: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
    <circle cx="12" cy="12" r="5"/>
    <line x1="12" y1="1" x2="12" y2="3"/><line x1="12" y1="21" x2="12" y2="23"/>
    <line x1="4.22" y1="4.22" x2="5.64" y2="5.64"/><line x1="18.36" y1="18.36" x2="19.78" y2="19.78"/>
    <line x1="1" y1="12" x2="3" y2="12"/><line x1="21" y1="12" x2="23" y2="12"/>
    <line x1="4.22" y1="19.78" x2="5.64" y2="18.36"/><line x1="18.36" y1="5.64" x2="19.78" y2="4.22"/>
  </svg>`,

  moon: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
    <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"/>
  </svg>`,

  star: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
    <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/>
  </svg>`,

  starFilled: `<svg viewBox="0 0 24 24" fill="currentColor" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
    <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/>
  </svg>`,

  map: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.75" stroke-linecap="round" stroke-linejoin="round">
    <polygon points="1 6 1 22 8 18 16 22 23 18 23 2 16 6 8 2 1 6"/>
    <line x1="8" y1="2" x2="8" y2="18"/><line x1="16" y1="6" x2="16" y2="22"/>
  </svg>`,

  list: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.75" stroke-linecap="round" stroke-linejoin="round">
    <line x1="8" y1="6" x2="21" y2="6"/><line x1="8" y1="12" x2="21" y2="12"/>
    <line x1="8" y1="18" x2="21" y2="18"/>
    <line x1="3" y1="6" x2="3.01" y2="6"/><line x1="3" y1="12" x2="3.01" y2="12"/>
    <line x1="3" y1="18" x2="3.01" y2="18"/>
  </svg>`,
};

function icon(name) {
  return ICONS[name] || '';
}

function stateBox(iconName, message) {
  return `<div class="state-box">
    <div class="state-icon">${icon(iconName)}</div>
    <p>${message}</p>
  </div>`;
}

function stopIcon(routeIds) {
  const id = (routeIds && routeIds[0]) || '';
  if (id.includes('Link') || id.includes('ST_')) return icon('rail');
  if (id.toLowerCase().includes('ferry')) return icon('ferry');
  return icon('bus');
}

function firstRouteShortLabel(routeIds) {
  if (!routeIds || routeIds.length === 0) return null;
  const id = routeIds[0];
  const label = id.includes('_') ? id.split('_').pop() : id;
  return label && label.length <= 4 ? label : null;
}

// ─── State ───────────────────────────────────────────────────────────────────
const REFRESH_INTERVAL = 30; // seconds

const state = {
  currentView: 'nearby',
  userLat: null,
  userLon: null,
  stops: [],
  routes: null,
  selectedStop: null,
  arrivals: [],
  arrivalTimer: null,
  watchId: null,
  lastArrivalsUpdate: 0,
  tickTimer: null,
  countdownSecs: REFRESH_INTERVAL,
  countdownTimer: null,
  mapView: false,
  leafletMap: null,
  leafletTileLayer: null,
  leafletUserMarker: null,
  leafletStopMarkers: [],
  mapSelectedStop: null,
  mapLoadCenter: null,
  vehicles: [],
  leafletVehicleMarkers: [],
  mapSelectedVehicle: null,
  vehicleRefreshTimer: null,
};

// ─── Theme ───────────────────────────────────────────────────────────────────
function applyTheme(light) {
  document.documentElement.classList.add('theme-transitioning');
  document.body.classList.toggle('light-mode', light);
  const btn = document.getElementById('btn-theme');
  if (btn) btn.innerHTML = light ? icon('moon') : icon('sun');
  setTimeout(() => document.documentElement.classList.remove('theme-transitioning'), 400);
}

function toggleTheme() {
  const isLight = document.body.classList.contains('light-mode');
  const next = !isLight;
  localStorage.setItem('theme', next ? 'light' : 'dark');
  applyTheme(next);
}

// ─── Favorites ───────────────────────────────────────────────────────────────
function getFavorites() { return JSON.parse(localStorage.getItem('favorites') || '[]'); }
function saveFavorites(favs) { localStorage.setItem('favorites', JSON.stringify(favs)); }
function isFavorite(stopId) { return getFavorites().some(f => f.id === stopId); }

function toggleFavorite(stop) {
  let favs = getFavorites();
  if (isFavorite(stop.id)) favs = favs.filter(f => f.id !== stop.id);
  else favs.push({ id: stop.id, name: stop.name, code: stop.code });
  saveFavorites(favs);
}

function updateFavBtn() {
  const btn = document.getElementById('btn-favorite');
  if (!btn || !state.selectedStop) return;
  const fav = isFavorite(state.selectedStop.id);
  btn.innerHTML = fav ? icon('starFilled') : icon('star');
  btn.classList.toggle('is-favorite', fav);
}

function renderFavoritesSettings() {
  const section = document.getElementById('favorites-section');
  if (!section) return;
  const favs = getFavorites();
  if (favs.length === 0) {
    section.innerHTML = '<div class="glass-card"><div class="settings-row"><span class="settings-row-label" style="color:var(--text-tertiary)">No saved stops yet</span></div></div>';
    return;
  }
  section.innerHTML = `<div class="glass-card">${favs.map((f) => `
    <div class="fav-item">
      <div>
        <div class="fav-item-name">${f.name}</div>
        <div class="fav-item-meta">Stop #${f.code || f.id}</div>
      </div>
      <button class="icon-btn fav-btn is-favorite" data-fav-id="${f.id}" aria-label="Remove from favorites">${icon('starFilled')}</button>
    </div>`).join('')}</div>`;
  section.querySelectorAll('.fav-btn[data-fav-id]').forEach((btn) => {
    btn.addEventListener('click', () => {
      const stopId = btn.dataset.favId;
      const row = btn.closest('.fav-item');
      if (btn.classList.contains('is-favorite')) {
        // Remove from favorites — dim in place, swap to empty star
        saveFavorites(getFavorites().filter(f => f.id !== stopId));
        btn.innerHTML = icon('star');
        btn.classList.remove('is-favorite');
        row.classList.add('fav-item--removed');
      } else {
        // Re-add to favorites — restore opacity, swap back to filled star
        const name = row.querySelector('.fav-item-name').textContent;
        const code = row.querySelector('.fav-item-meta').textContent.replace('Stop #', '').trim();
        const favs = getFavorites();
        if (!favs.find(f => f.id === stopId)) {
          favs.push({ id: stopId, name, code });
          saveFavorites(favs);
        }
        btn.innerHTML = icon('starFilled');
        btn.classList.add('is-favorite');
        row.classList.remove('fav-item--removed');
      }
    });
  });
}

// ─── Routing helpers ──────────────────────────────────────────────────────────
function showView(name) {
  document.querySelectorAll('.view').forEach((v) => v.classList.remove('active'));
  document.querySelectorAll('.nav-item').forEach((n) => n.classList.remove('active'));

  const view = document.getElementById(`view-${name}`);
  if (view) view.classList.add('active');

  const navItem = document.querySelector(`.nav-item[data-view="${name}"]`);
  if (navItem) navItem.classList.add('active');

  state.currentView = name;

  // Map toggle only visible in Nearby
  const mapToggleBtn = document.getElementById('btn-map-toggle');
  if (mapToggleBtn) mapToggleBtn.classList.toggle('hidden', name !== 'nearby');

  // Handle map/content switching
  const content = document.querySelector('.content');
  const mapContainer = document.getElementById('map-container');
  if (name === 'nearby' && state.mapView) {
    content.classList.add('hidden');
    mapContainer.classList.remove('hidden');
    if (state.leafletMap) requestAnimationFrame(() => state.leafletMap.invalidateSize());
  } else {
    content.classList.remove('hidden');
    if (mapContainer) mapContainer.classList.add('hidden');
  }

  // Show/hide search bar depending on view
  const searchWrap = document.querySelector('.search-wrap');
  const searchInput = document.getElementById('stop-search');
  const searchViews = ['nearby', 'lines'];
  if (searchWrap) searchWrap.classList.toggle('hidden', !searchViews.includes(name));
  if (searchInput) {
    searchInput.value = '';
    searchInput.placeholder = name === 'lines' ? 'Search routes…' : 'Search stops…';
  }

  if (name === 'nearby')   { renderFavPanels(); loadNearbyStops(); }
  if (name === 'lines')    { state.routes = null; loadNearbyRoutes(); }
  if (name === 'settings') renderFavoritesSettings();
}

// ─── API helpers ──────────────────────────────────────────────────────────────
async function apiFetch(endpoint, params = {}) {
  const url = new URL(PROXY_URL, location.origin);
  url.searchParams.set('endpoint', endpoint);
  for (const [k, v] of Object.entries(params)) url.searchParams.set(k, v);
  const res = await fetch(url.toString());
  if (!res.ok) throw new Error(`API error ${res.status}`);
  const json = await res.json();
  if (json.code !== 200) throw new Error(`OBA error code ${json.code}`);
  return json.data;
}

// ─── Geolocation ─────────────────────────────────────────────────────────────
function getUserLocation() {
  return new Promise((resolve, reject) => {
    if (!navigator.geolocation) return reject(new Error('Geolocation not supported'));
    navigator.geolocation.getCurrentPosition(
      (pos) => resolve({ lat: pos.coords.latitude, lon: pos.coords.longitude }),
      (err) => reject(err),
      { enableHighAccuracy: true, timeout: 8000 }
    );
  });
}

// ─── Real-time distance updater ───────────────────────────────────────────────
function updateNearbyDistances() {
  if (state.currentView !== 'nearby') return;
  document.querySelectorAll('#stops-list .stop-card').forEach(card => {
    const stop = state.stops.find(s => s.id === card.dataset.stopId);
    if (!stop || !state.userLat) return;
    const dist = haversineM(state.userLat, state.userLon, stop.lat, stop.lon);
    const el = card.querySelector('.stop-distance');
    if (el) el.textContent = formatDist(dist);
  });
}

// ─── Nearby stops view ────────────────────────────────────────────────────────
async function loadNearbyStops() {
  const list = document.getElementById('stops-list');
  list.innerHTML = renderLoading('Finding stops near you…');

  try {
    const { lat, lon } = await getUserLocation();
    state.userLat = lat;
    state.userLon = lon;

    const data = await apiFetch('stops-for-location', {
      lat, lon, radius: 500, maxCount: 20,
    });

    state.stops = data.list || [];
    state.stops.sort((a, b) =>
      haversineM(lat, lon, a.lat, a.lon) - haversineM(lat, lon, b.lat, b.lon)
    );

    if (state.stops.length === 0) {
      list.innerHTML = stateBox('search', 'No stops found within 500 m.');
      return;
    }

    list.innerHTML = state.stops.map((s) => renderStopCard(s, lat, lon)).join('');
    list.querySelectorAll('.stop-card').forEach((el) => {
      el.addEventListener('click', () => openStop(el.dataset.stopId));
    });

    // Refresh map markers if map is active
    if (state.mapView) updateMapMarkers();
  } catch (err) {
    if (err.code === 1) {
      list.innerHTML = stateBox('locationOff', 'Location access denied. Enable it in browser settings.');
    } else {
      list.innerHTML = stateBox('warning', err.message);
    }
  }
}

function renderStopCard(stop, userLat, userLon) {
  const dist = userLat ? haversineM(userLat, userLon, stop.lat, stop.lon) : null;
  const distStr = dist !== null ? formatDist(dist) : '';
  const favMark = isFavorite(stop.id) ? '<span class="stop-fav-mark">★</span>' : '';

  const badge = firstRouteShortLabel(stop.routeIds);
  return `
    <div class="glass-card stop-card" data-stop-id="${stop.id}">
      <div class="stop-icon">${stopIcon(stop.routeIds)}${badge ? `<span class="stop-icon-badge">${badge}</span>` : ''}</div>
      <div class="stop-info">
        <div class="stop-name">${stop.name}${favMark}</div>
        <div class="stop-meta">Stop #${stop.code || stop.id}${stop.direction ? ' · ' + stop.direction : ''}</div>
      </div>
      <div class="stop-distance">${distStr}</div>
      <svg class="chevron" width="8" height="14" viewBox="0 0 8 14" fill="none">
        <path d="M1 1l6 6-6 6" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
      </svg>
    </div>`;
}

// ─── Stop detail / arrivals view ──────────────────────────────────────────────
function clearArrivalTimers() {
  clearInterval(state.arrivalTimer);
  clearInterval(state.tickTimer);
  clearInterval(state.countdownTimer);
}

function tickArrivals() {
  if (!state.arrivals.length) return;
  const list = document.getElementById('arrivals-list');
  if (list) list.innerHTML = state.arrivals.map(renderArrivalRow).join('');
}

function startCountdown() {
  clearInterval(state.countdownTimer);
  state.countdownSecs = REFRESH_INTERVAL;
  updateCountdownUI();

  state.countdownTimer = setInterval(() => {
    state.countdownSecs--;
    updateCountdownUI();
    if (state.countdownSecs <= 0) {
      clearInterval(state.countdownTimer);
      refreshArrivals().then(startCountdown);
    }
  }, 1000);
}

function updateCountdownUI() {
  const el = document.getElementById('refresh-countdown');
  if (!el) return;
  const s = state.countdownSecs;
  el.textContent = s > 0 ? `${s}s` : '…';
}

async function openStop(stopId) {
  clearArrivalTimers();
  const stop = state.stops.find((s) => s.id === stopId);
  state.selectedStop = stop || { id: stopId, name: 'Stop', code: '' };
  document.getElementById('detail-stop-name').textContent = state.selectedStop.name;

  showDetailView();
  updateFavBtn();
  await refreshArrivals();
  startCountdown();

  state.tickTimer = setInterval(tickArrivals, 15000);
}

function showDetailView() {
  document.querySelectorAll('.view').forEach((v) => v.classList.remove('active'));
  document.getElementById('view-detail').classList.add('active');
  document.querySelectorAll('.nav-item').forEach((n) => n.classList.remove('active'));
  state.currentView = 'detail';
  document.querySelector('.search-wrap')?.classList.add('hidden');

  // Ensure content area is visible (detail view lives inside it)
  document.querySelector('.content').classList.remove('hidden');
  const mapContainer = document.getElementById('map-container');
  if (mapContainer) mapContainer.classList.add('hidden');

  // Hide map toggle in detail
  const mapToggleBtn = document.getElementById('btn-map-toggle');
  if (mapToggleBtn) mapToggleBtn.classList.add('hidden');
}

async function refreshArrivals() {
  const list = document.getElementById('arrivals-list');
  if (!state.selectedStop) return;

  try {
    const data = await apiFetch(`arrivals-and-departures-for-stop/${state.selectedStop.id}`, {
      minutesBefore: 0,
      minutesAfter: 60,
    });

    const arrivals = (data.entry?.arrivalsAndDepartures || []).slice(0, 15);
    state.arrivals = arrivals;

    if (arrivals.length === 0) {
      list.innerHTML = stateBox('clock', 'No arrivals in the next hour.');
      return;
    }

    list.innerHTML = arrivals.map(renderArrivalRow).join('');
    state.lastArrivalsUpdate = Date.now();
    const updatedEl = document.getElementById('arrivals-updated');
    if (updatedEl) updatedEl.textContent = 'Updated just now';
  } catch (err) {
    list.innerHTML = stateBox('warning', err.message);
  }
}

function renderArrivalRow(arrival) {
  const now = Date.now();
  const predicted = arrival.predictedArrivalTime || arrival.scheduledArrivalTime;
  const scheduled = arrival.scheduledArrivalTime;
  const minsAway = Math.round((predicted - now) / 60000);
  const displayMins = minsAway <= 0 ? 'Now' : minsAway;
  const minLabel = minsAway <= 0 ? '' : 'min';

  const hasPredicted = !!arrival.predictedArrivalTime;
  const diffMs = predicted - scheduled;
  let statusClass = 'on-time';
  let statusText = 'On time';
  if (!hasPredicted) { statusClass = ''; statusText = 'Scheduled'; }
  else if (diffMs > 60000)  { statusClass = 'delayed'; statusText = `+${Math.round(diffMs / 60000)} min late`; }
  else if (diffMs < -30000) { statusClass = 'early';   statusText = `${Math.round(-diffMs / 60000)} min early`; }

  const scheduledBadge = !hasPredicted ? '<span class="scheduled-badge">S</span>' : '';

  return `
    <div class="arrival-row">
      <div class="route-badge">${arrival.routeShortName || '?'}</div>
      <div class="arrival-info">
        <div class="arrival-headsign">${arrival.tripHeadsign || 'Unknown destination'}</div>
        <div class="arrival-status ${statusClass}">${statusText}${scheduledBadge}</div>
      </div>
      <div class="arrival-time">
        <div class="minutes">${displayMins}</div>
        <div class="min-label">${minLabel}</div>
      </div>
    </div>`;
}

// ─── Stop search ──────────────────────────────────────────────────────────────
function scoreStop(stop, q) {
  const tokens = q.toLowerCase().split(/\s+/).filter(Boolean);
  const words = [stop.name, stop.code, stop.direction, ...(stop.routeIds || [])]
    .filter(Boolean).join(' ').toLowerCase().split(/[\s\-\/]+/);

  let score = 0;
  for (const t of tokens) {
    const exact  = words.some(w => w === t);
    const prefix = words.some(w => w.startsWith(t));
    const sub    = words.some(w => w.includes(t));
    if (exact)       score += 3;
    else if (prefix) score += 2;
    else if (sub)    score += 1;
    else             return 0; // token not found at all → no match
  }

  // Boost when query matches stop name words
  const nameWords = stop.name.toLowerCase().split(/[\s\-\/]+/);
  if (tokens.every(t => nameWords.some(w => w.startsWith(t)))) score += 5;

  return score;
}

async function searchStops(query) {
  if (query.length < 2) return;
  const list = document.getElementById('stops-list');
  list.innerHTML = renderLoading('Searching…');

  try {
    // Client-side filter: score and sort
    const clientMatches = state.stops
      .map(s => ({ stop: s, score: scoreStop(s, query) }))
      .filter(x => x.score > 0)
      .sort((a, b) => b.score - a.score)
      .map(x => x.stop);

    // API call in parallel for stop-code lookups
    const apiResults = await apiFetch('stops-for-location', {
      lat: state.userLat || 47.6062,
      lon: state.userLon || -122.3321,
      query,
      radius: 5000,
      maxCount: 20,
    }).then(data => data.list || []).catch(() => []);

    // Merge: client matches first, append API results not already present
    const seen = new Set(clientMatches.map(s => s.id));
    const merged = [...clientMatches, ...apiResults.filter(s => !seen.has(s.id))];

    // Absorb new API stops into state
    const allIds = new Set(state.stops.map(s => s.id));
    apiResults.forEach(s => { if (!allIds.has(s.id)) state.stops.push(s); });

    if (merged.length === 0) {
      list.innerHTML = stateBox('search', `No stops found for "${query}".`);
      return;
    }

    list.innerHTML = merged.map((s) => renderStopCard(s, state.userLat, state.userLon)).join('');
    list.querySelectorAll('.stop-card').forEach((el) => {
      el.addEventListener('click', () => openStop(el.dataset.stopId));
    });
  } catch (err) {
    list.innerHTML = stateBox('warning', err.message);
  }
}

async function searchRoutes(query) {
  if (query.length < 2) return;
  const list = document.getElementById('routes-list');
  list.innerHTML = renderLoading('Searching routes…');

  try {
    const data = await apiFetch('routes-for-location', {
      lat: state.userLat || 47.6062,
      lon: state.userLon || -122.3321,
      query,
      radius: 10000,
    });

    const routeRefs = data.list || [];
    if (routeRefs.length === 0) {
      list.innerHTML = stateBox('search', `No routes found for "${query}".`);
      return;
    }

    const routes = routeRefs.map(r => ({
      shortName: r.shortName || r.id,
      typeClass: routeTypeLabel(r.type || 3),
      arrivals: [],
      headsigns: [],
      nearestStopDist: Infinity,
      nearestStopName: r.longName || '',
      singleDirection: false,
    }));

    list.innerHTML = routes.map(renderRouteCard).join('');
    list.querySelectorAll('.route-card').forEach(el => {
      el.addEventListener('click', () => openRoute(el));
    });
  } catch (err) {
    list.innerHTML = stateBox('warning', err.message);
  }
}

// ─── Lines (by-route) view ────────────────────────────────────────────────────
function routeTypeLabel(type) {
  if (type === 3) return 'bus';
  if (type === 4) return 'ferry';
  if ([0, 1, 2].includes(type)) return 'rail';
  return 'bus';
}

function renderRouteCard(route) {
  const typeClass = route.typeClass || 'bus';
  const now = Date.now();

  // Distinct headsigns with their next arrival time
  const seen = new Set();
  const rows = [];
  for (const a of route.arrivals) {
    const h = a.tripHeadsign || 'Unknown';
    if (seen.has(h)) continue;
    seen.add(h);
    const t = a.predictedArrivalTime || a.scheduledArrivalTime;
    const mins = Math.round((t - now) / 60000);
    const hasPredicted = !!a.predictedArrivalTime;
    rows.push({ headsign: h, display: mins <= 0 ? 'Now' : `${mins} min`, hasPredicted });
  }

  const headsignHtml = rows.map(r => {
    const badge = !r.hasPredicted ? '<span class="scheduled-badge fav-scheduled-badge">S</span>' : '';
    return `
      <div class="route-card-headsign">
        <span class="route-card-dest">${r.headsign}${badge}</span>
        <span class="route-card-time">${r.display}</span>
      </div>`;
  }).join('');

  const distStr = route.nearestStopDist < Infinity ? formatDist(route.nearestStopDist) : '';
  const stopHtml = route.nearestStopName
    ? `<div class="route-card-stop">${route.nearestStopName}${distStr ? ' · ' + distStr : ''}</div>`
    : '';
  const oneDirHtml = route.singleDirection
    ? `<div class="route-card-one-dir">↑ 1 direction found nearby</div>`
    : '';

  return `
    <div class="glass-card route-card" data-route-short="${route.shortName}" data-route-type="${typeClass}">
      <div class="route-badge route-type-${typeClass}">${route.shortName}</div>
      <div class="route-card-info">
        ${headsignHtml}
        ${oneDirHtml}
        ${stopHtml}
      </div>
      <svg class="chevron" width="8" height="14" viewBox="0 0 8 14" fill="none">
        <path d="M1 1l6 6-6 6" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
      </svg>
    </div>`;
}

async function loadNearbyRoutes() {
  const list = document.getElementById('routes-list');
  if (!list) return;
  list.innerHTML = renderLoading('Loading routes…');

  try {
    // Ensure we have nearby stops to work from
    if (state.stops.length === 0) {
      try {
        const { lat, lon } = await getUserLocation();
        state.userLat = lat; state.userLon = lon;
        const data = await apiFetch('stops-for-location', { lat, lon, radius: 500, maxCount: 20 });
        state.stops = (data.list || []).sort((a, b) =>
          haversineM(lat, lon, a.lat, a.lon) - haversineM(lat, lon, b.lat, b.lon)
        );
      } catch {
        list.innerHTML = stateBox('locationOff', 'Location needed to find nearby routes.');
        return;
      }
    }

    const stops = state.stops.slice(0, 8);

    // Fetch arrivals for all nearby stops in parallel
    const results = await Promise.allSettled(
      stops.map(s => apiFetch(`arrivals-and-departures-for-stop/${s.id}`, {
        minutesBefore: 0, minutesAfter: 45,
      }))
    );

    // Group arrivals by routeShortName
    const routeMap = new Map();
    results.forEach((r, i) => {
      if (r.status !== 'fulfilled') return;
      const stop = stops[i];
      const dist = (state.userLat && stop.lat)
        ? haversineM(state.userLat, state.userLon, stop.lat, stop.lon)
        : Infinity;
      const rows = r.value.entry?.arrivalsAndDepartures || [];

      rows.forEach(a => {
        const key = a.routeShortName || '?';
        if (!routeMap.has(key)) {
          const rid = (a.routeId || '').toLowerCase();
          const typeClass = (rid.includes('link') || rid.includes('st_')) ? 'rail'
                          : rid.includes('ferry') ? 'ferry' : 'bus';
          routeMap.set(key, {
            shortName: key,
            typeClass,
            arrivals: [],
            nearestStopDist: dist,
            nearestStopName: stop.name,
          });
        }
        const entry = routeMap.get(key);
        entry.arrivals.push(a);
        if (dist < entry.nearestStopDist) {
          entry.nearestStopDist = dist;
          entry.nearestStopName = stop.name;
        }
      });
    });

    if (routeMap.size === 0) {
      list.innerHTML = stateBox('clock', 'No arrivals found nearby.');
      return;
    }

    const routes = [...routeMap.values()];
    routes.forEach(r => {
      r.arrivals.sort((a, b) =>
        (a.predictedArrivalTime || a.scheduledArrivalTime) -
        (b.predictedArrivalTime || b.scheduledArrivalTime)
      );
      const first = r.arrivals[0];
      r.nextTime = first ? (first.predictedArrivalTime || first.scheduledArrivalTime) : Infinity;
      r.headsigns = [...new Set(r.arrivals.map(a => a.tripHeadsign).filter(Boolean))];
      r.singleDirection = r.headsigns.length === 1;
    });

    // Sort by next arrival (closest first)
    routes.sort((a, b) => a.nextTime - b.nextTime);

    state.routes = routes;
    list.innerHTML = routes.map(renderRouteCard).join('');
    list.querySelectorAll('.route-card').forEach(el => {
      el.addEventListener('click', () => openRoute(el));
    });
  } catch (err) {
    list.innerHTML = stateBox('warning', err.message);
  }
}

async function openRoute(cardEl) {
  const shortName = cardEl.dataset.routeShort;
  const routeData = state.routes?.find(r => r.shortName === shortName);

  // Header: "5 · Capitol Hill / Northgate"
  const titleEl = document.getElementById('route-detail-title');
  if (titleEl) {
    const headsignsStr = routeData?.headsigns?.join(' / ') || '';
    titleEl.textContent = headsignsStr ? `${shortName} · ${headsignsStr}` : `Route ${shortName}`;
  }

  // Show route detail view
  document.querySelectorAll('.view').forEach(v => v.classList.remove('active'));
  document.getElementById('view-route-detail').classList.add('active');
  document.querySelectorAll('.nav-item').forEach(n => n.classList.remove('active'));
  document.querySelector('.search-wrap')?.classList.add('hidden');

  // Render from cached arrivals — no extra API call
  const list = document.getElementById('route-arrivals-list');
  if (!list) return;
  if (routeData?.arrivals?.length) {
    list.innerHTML = routeData.arrivals.slice(0, 15).map(renderArrivalRow).join('');
  } else {
    await loadRouteArrivals(shortName);
  }
}

async function loadRouteArrivals(routeShortName) {
  const list = document.getElementById('route-arrivals-list');
  if (!list) return;
  list.innerHTML = renderLoading('Fetching arrivals…');

  try {
    const stops = state.stops.slice(0, 10); // limit to 10 nearby stops
    if (stops.length === 0) {
      list.innerHTML = stateBox('clock', 'No nearby stops loaded yet.');
      return;
    }

    const results = await Promise.allSettled(
      stops.map(s => apiFetch(`arrivals-and-departures-for-stop/${s.id}`, {
        minutesBefore: 0, minutesAfter: 60,
      }))
    );

    const arrivals = [];
    results.forEach(r => {
      if (r.status !== 'fulfilled') return;
      const rows = r.value.entry?.arrivalsAndDepartures || [];
      rows.forEach(a => {
        if ((a.routeShortName || '').toLowerCase() === routeShortName.toLowerCase()) {
          arrivals.push(a);
        }
      });
    });

    // Sort by predicted arrival time, take top 15
    arrivals.sort((a, b) => {
      const tA = a.predictedArrivalTime || a.scheduledArrivalTime;
      const tB = b.predictedArrivalTime || b.scheduledArrivalTime;
      return tA - tB;
    });
    const top15 = arrivals.slice(0, 15);

    if (top15.length === 0) {
      list.innerHTML = stateBox('clock', 'No upcoming arrivals for this route.');
      return;
    }
    list.innerHTML = top15.map(renderArrivalRow).join('');
  } catch (err) {
    list.innerHTML = stateBox('warning', err.message);
  }
}

// ─── Favorites home panels ────────────────────────────────────────────────────
function renderFavPanel(fav, arrivals, distStr = '') {
  const arrivalsHtml = arrivals.length === 0
    ? '<div class="fav-arrival-row fav-arrival-empty">No upcoming arrivals</div>'
    : arrivals.map(a => {
        const now = Date.now();
        const predicted = a.predictedArrivalTime || a.scheduledArrivalTime;
        const minsAway = Math.round((predicted - now) / 60000);
        const displayMins = minsAway <= 0 ? 'Now' : minsAway;
        const minLabel = minsAway <= 0 ? '' : ' min';
        const hasPredicted = !!a.predictedArrivalTime;
        const scheduledBadge = !hasPredicted ? '<span class="scheduled-badge fav-scheduled-badge">S</span>' : '';
        return `
          <div class="fav-arrival-row">
            <div class="route-badge">${a.routeShortName || '?'}</div>
            <div class="fav-arrival-dest">${a.tripHeadsign || 'Unknown'}${scheduledBadge}</div>
            <div class="fav-arrival-time"><span class="minutes">${displayMins}</span><span class="min-label">${minLabel}</span></div>
          </div>`;
      }).join('');
  return `
    <div class="glass-card fav-panel" data-stop-id="${fav.id}">
      <div class="fav-panel-header">
        <span class="fav-panel-name">${fav.name}</span>
        <div class="fav-panel-right">
          ${distStr ? `<span class="fav-panel-dist">${distStr}</span>` : ''}
          <svg class="chevron" width="8" height="14" viewBox="0 0 8 14" fill="none">
            <path d="M1 1l6 6-6 6" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
          </svg>
        </div>
      </div>
      <div class="fav-panel-arrivals">${arrivalsHtml}</div>
    </div>`;
}

async function renderFavPanels() {
  const section = document.getElementById('fav-panels-section');
  const container = document.getElementById('fav-panels');
  if (!section || !container) return;

  const favs = getFavorites();
  if (favs.length === 0) {
    section.classList.add('hidden');
    return;
  }
  section.classList.remove('hidden');

  // Get user location if not yet known
  if (!state.userLat) {
    try {
      const { lat, lon } = await getUserLocation();
      state.userLat = lat;
      state.userLon = lon;
    } catch {}
  }

  // Skeleton cards while loading
  container.innerHTML = favs.map(fav => `
    <div class="glass-card fav-panel" data-stop-id="${fav.id}">
      <div class="fav-panel-header">
        <span class="fav-panel-name">${fav.name}</span>
        <div class="fav-panel-right">
          <svg class="chevron" width="8" height="14" viewBox="0 0 8 14" fill="none">
            <path d="M1 1l6 6-6 6" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
          </svg>
        </div>
      </div>
      <div class="fav-panel-arrivals">
        <div class="fav-arrival-row" style="justify-content:center">
          <div class="spinner" style="margin:6px auto;width:20px;height:20px;border-width:2px"></div>
        </div>
      </div>
    </div>`).join('');

  // Fetch arrivals for all favs in parallel
  const results = await Promise.allSettled(
    favs.map(fav =>
      apiFetch(`arrivals-and-departures-for-stop/${fav.id}`, { minutesBefore: 0, minutesAfter: 60 })
    )
  );

  // Enrich favs with lat/lon from API references and arrivals
  const enriched = favs.map((fav, i) => {
    const result = results[i];
    const refs = result.status === 'fulfilled' ? result.value.references?.stops : null;
    const stopRef = refs?.find(s => s.id === fav.id);
    const arrivals = result.status === 'fulfilled'
      ? (result.value.entry?.arrivalsAndDepartures || []).slice(0, 3)
      : [];
    return { ...fav, lat: stopRef?.lat, lon: stopRef?.lon, arrivals };
  });

  // Sort by distance if we have location
  if (state.userLat && state.userLon) {
    enriched.sort((a, b) => {
      const dA = a.lat ? haversineM(state.userLat, state.userLon, a.lat, a.lon) : Infinity;
      const dB = b.lat ? haversineM(state.userLat, state.userLon, b.lat, b.lon) : Infinity;
      return dA - dB;
    });
  }

  // Ensure enriched fav stops are in state.stops for back-nav
  enriched.forEach(fav => {
    if (!state.stops.find(s => s.id === fav.id)) {
      state.stops.push({ id: fav.id, name: fav.name, code: fav.code || '', lat: fav.lat, lon: fav.lon });
    }
  });

  // Render panels with real data and distance
  container.innerHTML = enriched.map(fav => {
    const distStr = (state.userLat && fav.lat)
      ? formatDist(haversineM(state.userLat, state.userLon, fav.lat, fav.lon))
      : '';
    return renderFavPanel(fav, fav.arrivals, distStr);
  }).join('');

  container.querySelectorAll('.fav-panel').forEach(panel => {
    panel.addEventListener('click', () => openStop(panel.dataset.stopId));
  });
}

// ─── Utility functions ────────────────────────────────────────────────────────
function haversineM(lat1, lon1, lat2, lon2) {
  const R = 6371000;
  const dLat = ((lat2 - lat1) * Math.PI) / 180;
  const dLon = ((lon2 - lon1) * Math.PI) / 180;
  const a =
    Math.sin(dLat / 2) ** 2 +
    Math.cos((lat1 * Math.PI) / 180) * Math.cos((lat2 * Math.PI) / 180) * Math.sin(dLon / 2) ** 2;
  return R * 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
}

function formatDist(m) {
  const mi = m / 1609.34;
  return mi < 1 ? `${mi.toFixed(2)} mi` : `${mi.toFixed(1)} mi`;
}

function renderLoading(msg = 'Loading…') {
  return `<div class="state-box"><div class="spinner"></div><p>${msg}</p></div>`;
}

// ─── Map view ─────────────────────────────────────────────────────────────────
async function loadStopsForMapCenter() {
  if (!state.leafletMap) return;
  const c = state.leafletMap.getCenter();
  try {
    const data = await apiFetch('stops-for-location', {
      lat: c.lat, lon: c.lng, radius: 600, maxCount: 25,
    });
    const newStops = data.list || [];
    const existingIds = new Set(state.stops.map(s => s.id));
    newStops.forEach(s => {
      if (!existingIds.has(s.id)) {
        state.stops.push(s);
      } else {
        const idx = state.stops.findIndex(x => x.id === s.id);
        if (idx >= 0) state.stops[idx] = s;
      }
    });
    updateMapMarkers();
  } catch {}
}

async function loadVehiclesForMap() {
  try {
    const [r1, r40] = await Promise.allSettled([
      apiFetch('vehicles-for-agency/1'),
      apiFetch('vehicles-for-agency/40'),
    ]);
    const vehicles = [
      ...(r1.status === 'fulfilled' ? r1.value.list || [] : []),
      ...(r40.status === 'fulfilled' ? r40.value.list || [] : []),
    ].filter(v => v.tripStatus?.phase === 'in_progress' && v.location?.lat);
    state.vehicles = vehicles;
    updateVehicleMarkers();
  } catch (err) {
    console.warn('Failed to load vehicles:', err);
  }
}

const TILE_DARK  = 'https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png';
const TILE_LIGHT = 'https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png';
const TILE_ATTR  = '© <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> © <a href="https://carto.com/attributions">CARTO</a>';

function initMap() {
  if (state.leafletMap) return;

  const lat = state.userLat || 47.6062;
  const lon = state.userLon || -122.3321;

  const map = L.map('stops-map', {
    center: [lat, lon],
    zoom: 15,
    zoomControl: false,
  });
  L.control.zoom({ position: 'topright' }).addTo(map);

  const isLight = document.body.classList.contains('light-mode');
  state.leafletTileLayer = L.tileLayer(isLight ? TILE_LIGHT : TILE_DARK, {
    attribution: TILE_ATTR,
    subdomains: 'abcd',
    maxZoom: 20,
  }).addTo(map);

  state.leafletMap = map;
  map.on('click', () => { hideMapStopSheet(); hideMapVehicleSheet(); });
  map.on('moveend', () => {
    const c = map.getCenter();
    if (state.mapLoadCenter) {
      const dist = haversineM(state.mapLoadCenter.lat, state.mapLoadCenter.lon, c.lat, c.lng);
      if (dist < 250) return;
    }
    state.mapLoadCenter = { lat: c.lat, lon: c.lng };
    loadStopsForMapCenter();
  });
  updateMapMarkers();

  // Start vehicle polling
  loadVehiclesForMap();
  state.vehicleRefreshTimer = setInterval(() => loadVehiclesForMap(), 15000);
}

function updateMapMarkers() {
  if (!state.leafletMap) return;

  // User location
  if (state.userLat) {
    if (state.leafletUserMarker) {
      state.leafletUserMarker.setLatLng([state.userLat, state.userLon]);
    } else {
      const userIcon = L.divIcon({
        className: 'user-location-marker',
        html: '<div class="user-location-pulse"></div><div class="user-location-dot"></div>',
        iconSize: [20, 20],
        iconAnchor: [10, 10],
      });
      state.leafletUserMarker = L.marker([state.userLat, state.userLon], { icon: userIcon })
        .addTo(state.leafletMap);
    }
  }

  // Stop markers
  state.leafletStopMarkers.forEach(m => m.remove());
  state.leafletStopMarkers = [];

  state.stops.forEach(stop => {
    if (!stop.lat || !stop.lon) return;
    const stopIcon = L.divIcon({
      className: 'stop-map-marker',
      html: '<div class="stop-marker-dot"></div>',
      iconSize: [12, 12],
      iconAnchor: [6, 6],
    });
    const marker = L.marker([stop.lat, stop.lon], { icon: stopIcon }).addTo(state.leafletMap);
    marker.bindTooltip(stop.name, { direction: 'top', offset: [0, -6], className: 'stop-map-tooltip' });
    marker.on('click', () => { hideMapVehicleSheet(); showMapStopSheet(stop); });
    state.leafletStopMarkers.push(marker);
  });

  // Vehicle markers
  updateVehicleMarkers();
}

function updateVehicleMarkers() {
  if (!state.leafletMap) return;

  // Clear existing vehicle markers
  state.leafletVehicleMarkers.forEach(m => m.remove());
  state.leafletVehicleMarkers = [];

  state.vehicles.forEach(vehicle => {
    if (!vehicle.location?.lat || !vehicle.location?.lon) return;

    const stale = Date.now() - vehicle.lastLocationUpdateTime > 60_000;
    const orientation = vehicle.tripStatus?.orientation || 0;
    const headsign = vehicle.tripStatus?.activeTripId ? `Bus ${vehicle.vehicleId.split('_')[1]}` : 'Bus';

    const vehicleIcon = L.divIcon({
      className: `vehicle-map-marker ${stale ? 'vehicle-stale' : ''}`,
      html: `
        <div class="vehicle-marker-body">${icon('bus')}</div>
        <div class="vehicle-marker-arrow" style="transform: rotate(${orientation}deg);"></div>
      `,
      iconSize: [28, 42],
      iconAnchor: [14, 35],
    });

    const marker = L.marker([vehicle.location.lat, vehicle.location.lon], { icon: vehicleIcon })
      .addTo(state.leafletMap);
    marker.bindTooltip(headsign, { direction: 'top', offset: [0, -6], className: 'stop-map-tooltip' });
    marker.on('click', () => { hideMapStopSheet(); showMapVehicleSheet(vehicle); });
    state.leafletVehicleMarkers.push(marker);
  });
}

function showMapStopSheet(stop) {
  state.mapSelectedStop = stop;
  const sheet = document.getElementById('map-stop-sheet');
  sheet.querySelector('.map-stop-sheet-name').textContent = stop.name;
  const dist = (state.userLat && stop.lat)
    ? formatDist(haversineM(state.userLat, state.userLon, stop.lat, stop.lon))
    : '';
  const meta = [stop.code ? `Stop #${stop.code}` : null, dist].filter(Boolean).join(' · ');
  sheet.querySelector('.map-stop-sheet-meta').textContent = meta;
  const favBtn = document.getElementById('map-sheet-fav-btn');
  const fav = isFavorite(stop.id);
  favBtn.innerHTML = fav ? icon('starFilled') : icon('star');
  favBtn.classList.toggle('is-favorite', fav);
  sheet.classList.add('visible');
}

function hideMapStopSheet() {
  document.getElementById('map-stop-sheet').classList.remove('visible');
}

async function showMapVehicleSheet(vehicle) {
  state.mapSelectedVehicle = vehicle;
  const sheet = document.getElementById('map-vehicle-sheet');

  // Populate header
  const badgeEl = document.getElementById('vehicle-sheet-badge');
  const headsignEl = document.getElementById('vehicle-sheet-headsign');
  const statusEl = document.getElementById('vehicle-sheet-status');

  const routeShortName = vehicle.routeShortName || '?';
  badgeEl.textContent = routeShortName;
  badgeEl.className = 'route-badge route-type-bus';

  const tripHeadsign = vehicle.tripStatus?.tripHeadsign || 'Unknown';
  headsignEl.textContent = tripHeadsign;

  const schedDev = vehicle.tripStatus?.scheduleDeviation || 0;
  const schedDevMins = Math.round(schedDev / 60);
  let statusText = 'On time';
  if (schedDevMins > 1) statusText = `${schedDevMins} min late`;
  else if (schedDevMins < -1) statusText = `${-schedDevMins} min early`;
  statusEl.textContent = statusText;

  // Show loading
  const stopsEl = document.getElementById('vehicle-sheet-stops');
  stopsEl.innerHTML = '<div class="state-box"><div class="spinner"></div><p>Loading stops…</p></div>';

  // Fetch trip details
  try {
    const tripData = await apiFetch(`trip-for-vehicle/${vehicle.vehicleId}`, {
      includeSchedule: true,
      includeStatus: true,
    });

    const stopTimes = tripData.schedule?.stopTimes || [];
    const references = tripData.references || {};
    const stopMap = {};
    (references.stops || []).forEach(s => { stopMap[s.id] = s; });

    const serviceDate = tripData.schedule?.serviceDate || tripData.status?.serviceDate || 0;
    const schedDev = tripData.status?.scheduleDeviation || 0;

    // Filter to upcoming stops (not yet passed)
    const now = Date.now();
    const upcoming = stopTimes
      .filter(st => {
        const estArrival = serviceDate + (st.arrivalTime * 1000) - (schedDev * 1000);
        return estArrival > now;
      })
      .slice(0, 5);

    if (upcoming.length === 0) {
      stopsEl.innerHTML = '<div class="state-box"><p style="color:var(--text-secondary);">No upcoming stops</p></div>';
    } else {
      stopsEl.innerHTML = upcoming.map(st => {
        const stop = stopMap[st.stopId] || {};
        const estArrival = new Date(serviceDate + (st.arrivalTime * 1000) - (schedDev * 1000));
        const minsAway = Math.round((estArrival - now) / 60000);
        const displayTime = minsAway <= 0 ? 'Now' : `${minsAway} min`;

        return `
          <div class="vehicle-stop-row">
            <div class="vehicle-stop-name">${stop.name || st.stopId}</div>
            <div class="vehicle-stop-time">${displayTime}</div>
          </div>`;
      }).join('');
    }
  } catch (err) {
    stopsEl.innerHTML = '<div class="state-box"><p style="color:var(--text-secondary);">Failed to load stops</p></div>';
    console.warn('Failed to load vehicle trip:', err);
  }

  // Show stale indicator if needed
  const staleEl = document.getElementById('vehicle-sheet-stale');
  const stale = Date.now() - vehicle.lastLocationUpdateTime > 90_000;
  if (stale) {
    const secondsAgo = Math.round((Date.now() - vehicle.lastLocationUpdateTime) / 1000);
    staleEl.textContent = `Location last updated ${secondsAgo}s ago`;
    staleEl.classList.remove('hidden');
  } else {
    staleEl.classList.add('hidden');
  }

  sheet.classList.add('visible');
}

function hideMapVehicleSheet() {
  document.getElementById('map-vehicle-sheet').classList.remove('visible');
}

function swapMapTiles() {
  if (!state.leafletMap || !state.leafletTileLayer) return;
  const isLight = document.body.classList.contains('light-mode');
  state.leafletTileLayer.setUrl(isLight ? TILE_LIGHT : TILE_DARK);
}

function toggleMapView() {
  state.mapView = !state.mapView;
  const content      = document.querySelector('.content');
  const mapContainer = document.getElementById('map-container');
  const btn          = document.getElementById('btn-map-toggle');

  if (state.mapView) {
    content.classList.add('hidden');
    mapContainer.classList.remove('hidden');
    if (btn) { btn.innerHTML = icon('list'); btn.classList.add('active'); }
    requestAnimationFrame(() => {
      initMap();
      if (state.leafletMap) state.leafletMap.invalidateSize();
    });
  } else {
    content.classList.remove('hidden');
    mapContainer.classList.add('hidden');
    if (btn) { btn.innerHTML = icon('map'); btn.classList.remove('active'); }
    // Stop vehicle polling
    if (state.vehicleRefreshTimer) {
      clearInterval(state.vehicleRefreshTimer);
      state.vehicleRefreshTimer = null;
    }
    // Hide vehicle sheet
    hideMapVehicleSheet();
  }
}

// ─── Pull-to-refresh ─────────────────────────────────────────────────────────
function initPullToRefresh() {
  const content = document.querySelector('.content');
  const indicator = document.getElementById('ptr-indicator');
  const label = indicator.querySelector('.ptr-label');
  const PTR_THRESHOLD = 72; // px to trigger refresh
  let startY = 0;
  let pulling = false;
  let refreshing = false;

  content.addEventListener('touchstart', (e) => {
    if (refreshing) return;
    if (content.scrollTop > 0) return;
    if (state.currentView === 'settings') return;
    startY = e.touches[0].clientY;
    pulling = true;
  }, { passive: true });

  content.addEventListener('touchmove', (e) => {
    if (!pulling || refreshing) return;
    const dy = e.touches[0].clientY - startY;
    if (dy <= 0) { pulling = false; return; }

    const progress = Math.min(dy, PTR_THRESHOLD * 1.5);
    const height = Math.min(progress * 0.6, 56);
    indicator.style.height = `${height}px`;
    indicator.classList.add('ptr-pulling');
    indicator.classList.toggle('ptr-ready', dy >= PTR_THRESHOLD);
    label.textContent = dy >= PTR_THRESHOLD ? 'Release to refresh' : 'Pull to refresh';
  }, { passive: true });

  async function finishPull(dy) {
    if (!pulling) return;
    pulling = false;
    const triggered = dy >= PTR_THRESHOLD;
    const refreshableView = state.currentView === 'detail' || state.currentView === 'nearby' || state.currentView === 'lines';
    if (!triggered || !refreshableView) {
      indicator.style.height = '';
      indicator.classList.remove('ptr-pulling', 'ptr-ready');
      return;
    }
    refreshing = true;
    indicator.classList.remove('ptr-pulling', 'ptr-ready');
    indicator.classList.add('ptr-refreshing');
    if (state.currentView === 'detail') {
      clearInterval(state.countdownTimer);
      await refreshArrivals();
      startCountdown();
    } else if (state.currentView === 'nearby') {
      renderFavPanels(); // no await — skeleton shows synchronously
      await loadNearbyStops();
    } else if (state.currentView === 'lines') {
      await loadNearbyRoutes();
    }
    refreshing = false;
    indicator.classList.remove('ptr-refreshing');
    indicator.style.height = '';
  }

  content.addEventListener('touchend', (e) => {
    const dy = e.changedTouches[0].clientY - startY;
    finishPull(dy);
  }, { passive: true });

  content.addEventListener('touchcancel', () => {
    pulling = false;
    indicator.style.height = '';
    indicator.classList.remove('ptr-pulling', 'ptr-ready', 'ptr-refreshing');
  }, { passive: true });
}

// ─── Boot ─────────────────────────────────────────────────────────────────────
document.addEventListener('DOMContentLoaded', () => {
  if ('serviceWorker' in navigator) {
    navigator.serviceWorker.register('/sw.js').catch(console.warn);
  }


  // Watch position for real-time distance updates (Task C)
  if (navigator.geolocation) {
    state.watchId = navigator.geolocation.watchPosition(
      pos => {
        state.userLat = pos.coords.latitude;
        state.userLon = pos.coords.longitude;
        updateNearbyDistances();
      },
      () => {},
      { enableHighAccuracy: true }
    );
  }

  // Restore theme preference
  const savedTheme = localStorage.getItem('theme');
  applyTheme(savedTheme === 'light');

  // Theme toggle (also swaps map tiles)
  document.getElementById('btn-theme').addEventListener('click', (e) => {
    toggleTheme();
    swapMapTiles();
    e.currentTarget.blur();
  });

  // Map toggle button
  const mapToggleBtn = document.getElementById('btn-map-toggle');
  if (mapToggleBtn) {
    mapToggleBtn.innerHTML = icon('map');
    mapToggleBtn.addEventListener('click', (e) => {
      toggleMapView();
      e.currentTarget.blur();
    });
  }

  // Nav bar
  document.querySelectorAll('.nav-item').forEach((btn) => {
    btn.addEventListener('click', () => {
      clearArrivalTimers();
      showView(btn.dataset.view);
    });
  });

  // Favorite button
  document.getElementById('btn-favorite').addEventListener('click', () => {
    if (!state.selectedStop) return;
    toggleFavorite(state.selectedStop);
    updateFavBtn();
  });

  // Map stop sheet buttons
  document.getElementById('map-sheet-fav-btn').addEventListener('click', () => {
    if (!state.mapSelectedStop) return;
    toggleFavorite(state.mapSelectedStop);
    const fav = isFavorite(state.mapSelectedStop.id);
    const btn = document.getElementById('map-sheet-fav-btn');
    btn.innerHTML = fav ? icon('starFilled') : icon('star');
    btn.classList.toggle('is-favorite', fav);
  });

  document.getElementById('map-sheet-arrivals-btn').addEventListener('click', () => {
    const stop = state.mapSelectedStop;
    hideMapStopSheet();
    if (stop) openStop(stop.id);
  });

  // Back button (stop detail → nearby)
  document.getElementById('btn-back').addEventListener('click', () => {
    clearArrivalTimers();
    showView('nearby');
  });

  // Back button (route detail → lines)
  document.getElementById('btn-back-lines').addEventListener('click', () => {
    showView('lines');
  });

  // Manual refresh button
  document.getElementById('btn-refresh-now').addEventListener('click', async () => {
    const btn = document.getElementById('btn-refresh-now');
    if (btn.classList.contains('spinning')) return;
    clearInterval(state.countdownTimer);
    btn.classList.add('spinning');
    await refreshArrivals();
    btn.classList.remove('spinning');
    startCountdown();
  });

  // Search input
  let searchDebounce;
  document.getElementById('stop-search').addEventListener('input', (e) => {
    clearTimeout(searchDebounce);
    const q = e.target.value.trim();
    if (state.currentView === 'lines') {
      if (q === '') { loadNearbyRoutes(); return; }
      searchDebounce = setTimeout(() => searchRoutes(q), 350);
    } else {
      if (q === '') { loadNearbyStops(); return; }
      searchDebounce = setTimeout(() => searchStops(q), 350);
    }
  });

  initPullToRefresh();
  showView('nearby');
});
