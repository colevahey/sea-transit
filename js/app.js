/* ─── Seattle Transit PWA ───────────────────────────────────────────────────── */

const PROXY_URL = '/api/transit';

// ─── SVG icon library ─────────────────────────────────────────────────────────
const ICONS = {
  bus: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.75" stroke-linecap="round" stroke-linejoin="round">
    <rect x="3" y="3" width="18" height="13" rx="2"/>
    <path d="M3 11h18M8 3v8M16 3v8"/>
    <circle cx="7.5" cy="19" r="1.5"/><circle cx="16.5" cy="19" r="1.5"/>
    <path d="M7.5 17.5V16h9v1.5"/>
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

// ─── State ───────────────────────────────────────────────────────────────────
const state = {
  currentView: 'nearby',
  userLat: null,
  userLon: null,
  stops: [],
  selectedStop: null,
  arrivals: [],
  arrivalTimer: null,
};

// ─── Theme ───────────────────────────────────────────────────────────────────
function applyTheme(light) {
  document.body.classList.toggle('light-mode', light);
  const btn = document.getElementById('btn-theme');
  if (btn) btn.innerHTML = light ? icon('moon') : icon('sun');
}

function toggleTheme() {
  const isLight = document.body.classList.contains('light-mode');
  const next = !isLight;
  localStorage.setItem('theme', next ? 'light' : 'dark');
  applyTheme(next);
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

  if (name === 'nearby') loadNearbyStops();
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

    if (state.stops.length === 0) {
      list.innerHTML = stateBox('search', 'No stops found within 500 m.');
      return;
    }

    list.innerHTML = state.stops.map((s) => renderStopCard(s, lat, lon)).join('');
    list.querySelectorAll('.stop-card').forEach((el) => {
      el.addEventListener('click', () => openStop(el.dataset.stopId));
    });
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

  return `
    <div class="glass-card stop-card" data-stop-id="${stop.id}">
      <div class="stop-icon">${stopIcon(stop.routeIds)}</div>
      <div class="stop-info">
        <div class="stop-name">${stop.name}</div>
        <div class="stop-meta">Stop #${stop.code || stop.id}${stop.direction ? ' · ' + stop.direction : ''}</div>
      </div>
      <div class="stop-distance">${distStr}</div>
      <svg class="chevron" width="8" height="14" viewBox="0 0 8 14" fill="none">
        <path d="M1 1l6 6-6 6" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
      </svg>
    </div>`;
}

// ─── Stop detail / arrivals view ──────────────────────────────────────────────
async function openStop(stopId) {
  const stop = state.stops.find((s) => s.id === stopId);
  state.selectedStop = stop || { id: stopId, name: 'Stop', code: '' };
  document.getElementById('detail-stop-name').textContent = state.selectedStop.name;

  showDetailView();
  await refreshArrivals();

  clearInterval(state.arrivalTimer);
  state.arrivalTimer = setInterval(refreshArrivals, 30000);
}

function showDetailView() {
  document.querySelectorAll('.view').forEach((v) => v.classList.remove('active'));
  document.getElementById('view-detail').classList.add('active');
  document.querySelectorAll('.nav-item').forEach((n) => n.classList.remove('active'));
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

  return `
    <div class="arrival-row">
      <div class="route-badge">${arrival.routeShortName || '?'}</div>
      <div class="arrival-info">
        <div class="arrival-headsign">${arrival.tripHeadsign || 'Unknown destination'}</div>
        <div class="arrival-status ${statusClass}">${statusText}</div>
      </div>
      <div class="arrival-time">
        <div class="minutes">${displayMins}</div>
        <div class="min-label">${minLabel}</div>
      </div>
    </div>`;
}

// ─── Stop search ──────────────────────────────────────────────────────────────
async function searchStops(query) {
  if (query.length < 2) return;
  const list = document.getElementById('stops-list');
  list.innerHTML = renderLoading('Searching…');

  try {
    const data = await apiFetch('stops-for-location', {
      lat: state.userLat || 47.6062,
      lon: state.userLon || -122.3321,
      query,
      radius: 5000,
      maxCount: 20,
    });

    state.stops = data.list || [];
    if (state.stops.length === 0) {
      list.innerHTML = stateBox('search', `No stops found for "${query}".`);
      return;
    }

    list.innerHTML = state.stops.map((s) => renderStopCard(s, state.userLat, state.userLon)).join('');
    list.querySelectorAll('.stop-card').forEach((el) => {
      el.addEventListener('click', () => openStop(el.dataset.stopId));
    });
  } catch (err) {
    list.innerHTML = stateBox('warning', err.message);
  }
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
  return m < 1000 ? `${Math.round(m)} m` : `${(m / 1609).toFixed(1)} mi`;
}

function renderLoading(msg = 'Loading…') {
  return `<div class="state-box"><div class="spinner"></div><p>${msg}</p></div>`;
}

// ─── Boot ─────────────────────────────────────────────────────────────────────
document.addEventListener('DOMContentLoaded', () => {
  if ('serviceWorker' in navigator) {
    navigator.serviceWorker.register('/sw.js').catch(console.warn);
  }

  // Restore theme preference
  const savedTheme = localStorage.getItem('theme');
  applyTheme(savedTheme === 'light');

  // Theme toggle
  document.getElementById('btn-theme').addEventListener('click', toggleTheme);

  // Nav bar
  document.querySelectorAll('.nav-item').forEach((btn) => {
    btn.addEventListener('click', () => {
      clearInterval(state.arrivalTimer);
      showView(btn.dataset.view);
    });
  });

  // Back button
  document.getElementById('btn-back').addEventListener('click', () => {
    clearInterval(state.arrivalTimer);
    showView('nearby');
  });

  // Search input
  let searchDebounce;
  document.getElementById('stop-search').addEventListener('input', (e) => {
    clearTimeout(searchDebounce);
    const q = e.target.value.trim();
    if (q === '') { loadNearbyStops(); return; }
    searchDebounce = setTimeout(() => searchStops(q), 350);
  });

  showView('nearby');
});
