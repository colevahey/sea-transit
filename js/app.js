/* ─── Seattle Transit PWA ───────────────────────────────────────────────────── */

// Load API key from config.js (not committed to git)
const API_KEY  = (typeof CONFIG !== 'undefined' && CONFIG.API_KEY) || '';
const BASE_URL = (typeof CONFIG !== 'undefined' && CONFIG.BASE_URL) || 'https://api.pugetsound.onebusaway.org/api/where';

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
  if (name === 'settings') renderSettings();
}

// ─── API helpers ──────────────────────────────────────────────────────────────
async function apiFetch(path, params = {}) {
  if (!API_KEY) throw new Error('NO_API_KEY');
  const url = new URL(`${BASE_URL}/${path}.json`);
  url.searchParams.set('key', API_KEY);
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

  if (!API_KEY) {
    list.innerHTML = renderNoKey();
    return;
  }

  try {
    const { lat, lon } = await getUserLocation();
    state.userLat = lat;
    state.userLon = lon;

    const data = await apiFetch('stops-for-location', {
      lat,
      lon,
      radius: 500,
      maxCount: 20,
    });

    state.stops = data.list || [];

    if (state.stops.length === 0) {
      list.innerHTML = `<div class="state-box"><div class="icon">🚏</div><p>No stops found within 500 m.</p></div>`;
      return;
    }

    list.innerHTML = state.stops
      .map((stop) => renderStopCard(stop, lat, lon))
      .join('');

    list.querySelectorAll('.stop-card').forEach((el) => {
      el.addEventListener('click', () => openStop(el.dataset.stopId));
    });
  } catch (err) {
    if (err.code === 1) {
      list.innerHTML = `<div class="state-box"><div class="icon">📍</div><p>Location access denied. Enable it in browser settings.</p></div>`;
    } else {
      list.innerHTML = `<div class="state-box"><div class="icon">⚠️</div><p>${err.message}</p></div>`;
    }
  }
}

function renderStopCard(stop, userLat, userLon) {
  const dist = userLat ? haversineM(userLat, userLon, stop.lat, stop.lon) : null;
  const distStr = dist !== null ? formatDist(dist) : '';
  const icon = stopEmoji(stop.routeIds);

  return `
    <div class="glass-card stop-card" data-stop-id="${stop.id}">
      <div class="stop-icon">${icon}</div>
      <div class="stop-info">
        <div class="stop-name">${stop.name}</div>
        <div class="stop-meta">Stop #${stop.code || stop.id} · ${stop.direction || ''}</div>
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

  // Auto-refresh every 30 s
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

    const refs = data.references || {};
    const arrivals = (data.entry?.arrivalsAndDepartures || []).slice(0, 15);
    state.arrivals = arrivals;

    if (arrivals.length === 0) {
      list.innerHTML = `<div class="state-box"><div class="icon">🎉</div><p>No arrivals in the next hour.</p></div>`;
      return;
    }

    list.innerHTML = arrivals.map((a) => renderArrivalRow(a, refs)).join('');
  } catch (err) {
    list.innerHTML = `<div class="state-box"><div class="icon">⚠️</div><p>${err.message}</p></div>`;
  }
}

function renderArrivalRow(arrival, refs) {
  const now = Date.now();
  const predicted = arrival.predictedArrivalTime || arrival.scheduledArrivalTime;
  const scheduled = arrival.scheduledArrivalTime;
  const minsAway = Math.round((predicted - now) / 60000);
  const displayMins = minsAway <= 0 ? 'Now' : minsAway;
  const minLabel = minsAway <= 0 ? '' : 'min';

  const diffSec = predicted - scheduled;
  let statusClass = 'on-time';
  let statusText = 'On time';
  if (diffSec > 60000) { statusClass = 'delayed'; statusText = `+${Math.round(diffSec/60000)} min late`; }
  else if (diffSec < -30000) { statusClass = 'early'; statusText = `${Math.round(-diffSec/60000)} min early`; }

  const hasPredicted = !!arrival.predictedArrivalTime;
  if (!hasPredicted) { statusClass = ''; statusText = 'Scheduled'; }

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
    // OBA doesn't have a dedicated stop-search endpoint; search by location with query
    const data = await apiFetch('stops-for-location', {
      lat: state.userLat || 47.6062,
      lon: state.userLon || -122.3321,
      query,
      radius: 5000,
      maxCount: 20,
    });

    state.stops = data.list || [];
    if (state.stops.length === 0) {
      list.innerHTML = `<div class="state-box"><div class="icon">🔍</div><p>No stops found for "${query}".</p></div>`;
      return;
    }

    list.innerHTML = state.stops.map((s) => renderStopCard(s, state.userLat, state.userLon)).join('');
    list.querySelectorAll('.stop-card').forEach((el) => {
      el.addEventListener('click', () => openStop(el.dataset.stopId));
    });
  } catch (err) {
    list.innerHTML = `<div class="state-box"><div class="icon">⚠️</div><p>${err.message}</p></div>`;
  }
}

// ─── Settings view ────────────────────────────────────────────────────────────
function renderSettings() {
  const keyEl = document.getElementById('settings-api-key');
  if (keyEl) keyEl.value = API_KEY !== 'YOUR_API_KEY_HERE' ? API_KEY : '';
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

function stopEmoji(routeIds) {
  if (!routeIds || routeIds.length === 0) return '🚏';
  // Light rail route IDs in Puget Sound start with '40_'
  const id = routeIds[0] || '';
  if (id.includes('Link') || id.includes('ST_')) return '🚊';
  if (id.includes('Ferry') || id.includes('ferry')) return '⛴️';
  return '🚌';
}

function renderLoading(msg = 'Loading…') {
  return `<div class="state-box"><div class="spinner"></div><p>${msg}</p></div>`;
}

function renderNoKey() {
  return `<div class="state-box">
    <div class="icon">🔑</div>
    <p>Add your OneBusAway API key in <strong>Settings</strong> to get started.</p>
  </div>`;
}

// ─── Boot ─────────────────────────────────────────────────────────────────────
document.addEventListener('DOMContentLoaded', () => {
  // Register service worker
  if ('serviceWorker' in navigator) {
    navigator.serviceWorker.register('/sw.js').catch(console.warn);
  }

  // Nav bar
  document.querySelectorAll('.nav-item').forEach((btn) => {
    btn.addEventListener('click', () => {
      clearInterval(state.arrivalTimer);
      showView(btn.dataset.view);
    });
  });

  // Back button in detail view
  document.getElementById('btn-back').addEventListener('click', () => {
    clearInterval(state.arrivalTimer);
    showView('nearby');
  });

  // Search input
  let searchDebounce;
  document.getElementById('stop-search').addEventListener('input', (e) => {
    clearTimeout(searchDebounce);
    const q = e.target.value.trim();
    if (q === '') {
      loadNearbyStops();
      return;
    }
    searchDebounce = setTimeout(() => searchStops(q), 350);
  });

  // Settings: save API key to localStorage on change
  document.getElementById('settings-api-key')?.addEventListener('change', (e) => {
    localStorage.setItem('oba_api_key', e.target.value.trim());
    window.location.reload(); // reload so config picks it up
  });

  // Restore API key from localStorage if config placeholder is still set
  const stored = localStorage.getItem('oba_api_key');
  if (stored && typeof CONFIG !== 'undefined' && CONFIG.API_KEY === 'YOUR_API_KEY_HERE') {
    CONFIG.API_KEY = stored;
  }

  // Initial view
  showView('nearby');
});
