// Country flags
const countryFlags = {
    'IL': '🇮🇱', 'CY': '🇨🇾', 'GR': '🇬🇷', 'IT': '🇮🇹', 'FR': '🇫🇷',
    'UK': '🇬🇧', 'IE': '🇮🇪', 'FO': '🇫🇴', 'IS': '🇮🇸', 'CA': '🇨🇦',
    'US': '🇺🇸', 'MX': '🇲🇽', 'PA': '🇵🇦', 'CR': '🇨🇷', 'CO': '🇨🇴',
    'EC': '🇪🇨', 'PE': '🇵🇪', 'CL': '🇨🇱', 'AR': '🇦🇷', 'AQ': '🇦🇶',
    'NZ': '🇳🇿', 'AU': '🇦🇺', 'ID': '🇮🇩', 'MY': '🇲🇾', 'TH': '🇹🇭',
    'IN': '🇮🇳', 'OM': '🇴🇲', 'QA': '🇶🇦'
};

// Airport to country mapping
const airportToCountry = {
    'LLBG': 'IL', 'LCEN': 'CY', 'LGSR': 'GR', 'LGKF': 'GR', 'LIRF': 'IT', 'LFMN': 'FR',
    'LFPB': 'FR', 'EGBB': 'UK', 'EIDW': 'IE', 'EKVG': 'FO', 'BIKF': 'IS',
    'CYYT': 'CA', 'CYQX': 'CA', 'CYGZ': 'CA', 'CYQB': 'CA', 'CYYZ': 'CA',
    'KDTW': 'US', 'KORD': 'US', 'KOMA': 'US', 'KDEN': 'US', 'KSLC': 'US',
    'KRNO': 'US', 'KSFO': 'US', 'KPHX': 'US', 'MMCN': 'MX', 'MMMX': 'MX',
    'MMMZ': 'MX', 'MPTO': 'PA', 'MROC': 'CR', 'SKBO': 'CO', 'SEQM': 'EC',
    'SPJC': 'PE', 'SCLP': 'CL', 'SCIP': 'CL', 'SCAR': 'AR', 'NZIR': 'AQ',
    'NZCH': 'NZ', 'YSSY': 'AU', 'YMML': 'AU', 'YBBN': 'AU', 'YPDN': 'AU',
    'WADD': 'ID', 'WMKP': 'MY', 'VTBS': 'TH', 'VOCI': 'IN', 'OTHH': 'QA', 'OOMS': 'OM'
};

// Airport coordinates for mapping
const airportCoordinates = {
    'LLBG': { lat: 32.0057, lng: 34.8873, name: 'בן גוריון, ישראל' },
    'LCEN': { lat: 34.7650, lng: 33.0542, name: 'לרנקה, קפריסין' },
    'LGSR': { lat: 36.4047, lng: 28.1061, name: 'רודוס, יוון' },
    'LGKF': { lat: 39.6019, lng: 19.9181, name: 'קורפו, יוון' },
    'LIRF': { lat: 41.8002, lng: 12.2388, name: 'רומא, איטליה' },
    'LFMN': { lat: 43.6584, lng: 7.2158, name: 'ניס, צרפת' },
    'LFPB': { lat: 48.9689, lng: 2.4499, name: "פריז לה בורז'ה" },
    'EGBB': { lat: 52.4540, lng: -1.7479, name: 'בירמינגהם, בריטניה' },
    'EIDW': { lat: 53.4213, lng: -6.2700, name: 'דבלין, אירלנד' },
    'EKVG': { lat: 62.0161, lng: -6.7669, name: 'ווגאר, איי פארו' },
    'BIKF': { lat: 64.1466, lng: -21.9206, name: 'קפלאוויק, איסלנד' },
    'CYYT': { lat: 47.6175, lng: -52.7518, name: "סנט ג'ונס, ניופאונדלנד" },
    'CYQX': { lat: 47.8875, lng: -54.5678, name: 'גנדר, קנדה' },
    'CYGZ': { lat: 67.0008, lng: -50.1855, name: 'גרינלנד, קנדה' },
    'CYQB': { lat: 46.8139, lng: -71.2254, name: 'קוויבק סיטי, קנדה' },
    'CYYZ': { lat: 43.6777, lng: -79.6248, name: 'טורונטו, קנדה' },
    'KDTW': { lat: 42.2124, lng: -83.3534, name: 'דטרויט, ארה"ב' },
    'KORD': { lat: 41.9742, lng: -87.9073, name: 'שיקגו, ארה"ב' },
    'KOMA': { lat: 41.4025, lng: -95.7589, name: 'אומהה, ארה"ב' },
    'KDEN': { lat: 39.8561, lng: -104.6737, name: 'דנבר, ארה"ב' },
    'KSLC': { lat: 40.7884, lng: -111.8787, name: 'סולט לייק סיטי, ארה"ב' },
    'KRNO': { lat: 39.4992, lng: -119.7674, name: 'רנו, ארה"ב' },
    'KSFO': { lat: 37.6213, lng: -122.3790, name: 'סן פרנסיסקו, קליפורניה' },
    'KPHX': { lat: 33.4342, lng: -112.0116, name: 'פיניקס, ארה"ב' },
    'MMCN': { lat: 25.6866, lng: -111.4520, name: 'הרמוסיו, מקסיקו' },
    'MMMX': { lat: 25.2048, lng: -110.5728, name: 'מקסיקו סיטי' },
    'MMMZ': { lat: 23.1708, lng: -106.2662, name: 'מאזאטלאן, מקסיקו' },
    'MPTO': { lat: 8.9824, lng: -79.5199, name: 'פנמה סיטי, פנמה' },
    'MROC': { lat: 9.7489, lng: -84.4314, name: 'סן חוסה, קוסטה ריקה' },
    'SKBO': { lat: 4.7213, lng: -74.1497, name: 'בוגוטה, קולומביה' },
    'SEQM': { lat: 0.2176, lng: -78.4891, name: 'קיטו, אקוודור' },
    'SPJC': { lat: -12.0219, lng: -77.1144, name: 'לימה, פרו' },
    'SCLP': { lat: -33.3963, lng: -70.1855, name: 'סנטיאגו, צ\'ילה' },
    'SCIP': { lat: -53.0019, lng: -70.8116, name: "פונטה ארנס, צ'ילה" },
    'SCAR': { lat: -53.9940, lng: -67.8110, name: 'ריו גראנדה, ארגנטינה' },
    'NZIR': { lat: -77.8319, lng: 166.7324, name: 'מקרמרדו, אנטארקטיקה' },
    'NZCH': { lat: -43.4826, lng: 172.5329, name: 'קרייסטצ\'רץ\', ניו זילנד' },
    'YSSY': { lat: -33.9461, lng: 151.1772, name: 'סידני, אוסטרליה' },
    'YMML': { lat: -37.6733, lng: 144.8411, name: 'מלבורן, אוסטרליה' },
    'YBBN': { lat: -27.3842, lng: 153.1175, name: 'בריסביין, אוסטרליה' },
    'YPDN': { lat: -12.4544, lng: 131.0087, name: 'דרווין, אוסטרליה' },
    'WADD': { lat: -8.7521, lng: 115.1675, name: 'באלי (דנפסר), אינדונזיה' },
    'WMKP': { lat: 3.1386, lng: 101.6869, name: 'קואלה לומפור, מלזיה' },
    'VTBS': { lat: 13.6923, lng: 100.7501, name: 'בנגקוק, תאילנד' },
    'VOCI': { lat: 10.1591, lng: 76.2193, name: 'קוצ\'י, הודו' },
    'OTHH': { lat: 25.2731, lng: 51.6092, name: 'דוחא, קטאר' },
    'OOMS': { lat: 23.6100, lng: 58.2841, name: 'מאסקט, עומאן' }
};

// App state
let appState = {
    routes: [],
    map: null,
    completedRoutes: {},
    routeDates: {}
};

// Initialize
document.addEventListener('DOMContentLoaded', () => {
    loadSavedData();
    initializeApp();
});

function loadSavedData() {
    const saved = localStorage.getItem('doctorSimulatorData');
    if (saved) {
        const data = JSON.parse(saved);
        appState.completedRoutes = data.completed || {};
        appState.routeDates = data.dates || {};

        // Migrate old string format to new object format
        Object.keys(appState.routeDates).forEach(key => {
            if (typeof appState.routeDates[key] === 'string') {
                appState.routeDates[key] = {
                    date: appState.routeDates[key],
                    time: ''
                };
            }
        });
    }
}

function saveData() {
    localStorage.setItem('doctorSimulatorData', JSON.stringify({
        completed: appState.completedRoutes,
        dates: appState.routeDates
    }));
}

function initializeApp() {
    appState.routes = flightRoutes;

    // Set total routes
    document.getElementById('totalRoutes').textContent = appState.routes.length;
    document.getElementById('totalCount').textContent = appState.routes.length;

    // Initialize map
    initializeMap();

    // Render routes list
    renderRoutesList();

    // Draw initial map
    drawAllRoutes();

    // Update stats
    updateStats();
}

function initializeMap() {
    appState.map = L.map('map').setView([20, 0], 2);

    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '© OpenStreetMap contributors',
        maxZoom: 19
    }).addTo(appState.map);
}

function drawAllRoutes() {
    // Clear existing layers
    appState.map.eachLayer((layer) => {
        if (layer instanceof L.Polyline || layer instanceof L.CircleMarker) {
            appState.map.removeLayer(layer);
        }
    });

    // Draw all routes
    appState.routes.forEach((route, index) => {
        const from = airportCoordinates[route.departure];
        const to = airportCoordinates[route.destination];

        if (from && to) {
            const isCompleted = appState.completedRoutes[route.id];
            const color = isCompleted ? '#4caf50' : '#0288d1';
            const opacity = isCompleted ? 0.4 : 0.7;

            // Draw line with hover effects
            const polyline = L.polyline(
                [[from.lat, from.lng], [to.lat, to.lng]],
                {
                    color: color,
                    weight: 2,
                    opacity: opacity,
                    dashArray: isCompleted ? '5,5' : undefined
                }
            );

            // Add hover effects
            polyline.on('mouseover', function() {
                this.setStyle({weight: 4, opacity: 1});
            });
            polyline.on('mouseout', function() {
                this.setStyle({weight: 2, opacity: opacity});
            });

            // Add click handler to zoom to route
            polyline.on('click', function() {
                zoomToRoute(route.id);
            });

            polyline.addTo(appState.map);

            // Draw marker with hover effects
            const marker = L.circleMarker([from.lat, from.lng], {
                radius: 5,
                fillColor: color,
                color: '#fff',
                weight: 2,
                opacity: opacity,
                fillOpacity: opacity
            });

            marker.on('mouseover', function() {
                this.setStyle({radius: 8, weight: 3});
            });
            marker.on('mouseout', function() {
                this.setStyle({radius: 5, weight: 2});
            });

            marker.bindPopup(
                `<b>${route.departure} → ${route.destination}</b><br>` +
                `טיסה #${route.number}<br>` +
                `${route.airport_name}<br>` +
                `זמן טיסה: ${route.flight_time} דקות`
            ).addTo(appState.map);
        }
    });
}

function renderRoutesList() {
    const container = document.getElementById('routesList');

    container.innerHTML = appState.routes.map(route => {
        const isCompleted = appState.completedRoutes[route.id];
        const routeDateTime = appState.routeDates[route.id] || {};
        const date = routeDateTime.date || '';
        const time = routeDateTime.time || '';

        const depCountry = airportToCountry[route.departure];
        const destCountry = airportToCountry[route.destination];
        const depFlag = depCountry ? countryFlags[depCountry] : '';
        const destFlag = destCountry ? countryFlags[destCountry] : '';

        return `
            <div class="route-item ${isCompleted ? 'completed' : ''}" data-route-id="${route.id}" onclick="zoomToRoute(${route.id})">
                <input
                    type="checkbox"
                    class="route-checkbox"
                    ${isCompleted ? 'checked' : ''}
                    onchange="toggleRoute(${route.id}); event.stopPropagation()"
                >
                <div class="route-info">
                    <div class="route-number">✈️ טיסה #${route.number}</div>
                    <div class="route-codes">
                        ${depFlag} ${route.departure} ← → ${route.destination} ${destFlag}
                    </div>
                    <div class="route-name">${route.airport_name}</div>
                    <div class="route-time">⏱️ ${route.flight_time} דקות</div>
                    <div class="route-datetime">
                        <input
                            type="date"
                            class="route-date-input"
                            value="${date}"
                            onchange="updateRouteDateTime(${route.id}, 'date', this.value); event.stopPropagation()"
                            placeholder="תאריך"
                        >
                        <input
                            type="time"
                            class="route-time-input"
                            value="${time}"
                            onchange="updateRouteDateTime(${route.id}, 'time', this.value); event.stopPropagation()"
                            placeholder="שעה"
                        >
                    </div>
                </div>
            </div>
        `;
    }).join('');

    setTimeout(() => {
        if (typeof twemoji !== 'undefined') {
            twemoji.parse(container);
        }
    }, 100);
}

function toggleRoute(routeId) {
    appState.completedRoutes[routeId] = !appState.completedRoutes[routeId];
    saveData();
    renderRoutesList();
    drawAllRoutes();
    updateStats();
}

function updateRouteDateTime(routeId, type, value) {
    if (!appState.routeDates[routeId]) {
        appState.routeDates[routeId] = {};
    }

    if (type === 'date') {
        if (value) {
            appState.routeDates[routeId].date = value;
        } else {
            delete appState.routeDates[routeId].date;
        }
    } else if (type === 'time') {
        if (value) {
            appState.routeDates[routeId].time = value;
        } else {
            delete appState.routeDates[routeId].time;
        }
    }

    // Clean up empty objects
    if (Object.keys(appState.routeDates[routeId]).length === 0) {
        delete appState.routeDates[routeId];
    }

    saveData();
}

function zoomToRoute(routeId) {
    const route = appState.routes.find(r => r.id === routeId);
    if (!route) return;

    const from = airportCoordinates[route.departure];
    const to = airportCoordinates[route.destination];

    if (from && to) {
        // Create bounds for the route
        const bounds = L.latLngBounds(
            [from.lat, from.lng],
            [to.lat, to.lng]
        );

        // Fit map to bounds with padding
        appState.map.fitBounds(bounds, { padding: [50, 50] });
    }
}

function updateStats() {
    const completed = Object.values(appState.completedRoutes).filter(Boolean).length;
    document.getElementById('completedCount').textContent = completed;
    document.getElementById('completedCount2').textContent = completed;
}

// Export for onclick handlers
window.toggleRoute = toggleRoute;
window.updateRouteDateTime = updateRouteDateTime;
window.zoomToRoute = zoomToRoute;
