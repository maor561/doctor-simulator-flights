/**
 * RSS Feed endpoint for flight routes
 * GET /api/rss - Returns RSS XML feed with all scheduled flights
 * Routes are loaded from the same Google Sheet as the main app.
 */

const KV_URL = process.env.KV_REST_API_URL;
const KV_TOKEN = process.env.KV_REST_API_TOKEN;
const KV_KEY = 'doctor-simulator-data';
const SHEET_URL = 'https://docs.google.com/spreadsheets/d/1FxCamcUs_L8-IT3ea24x0DYCg7-dig7a1Tz5rlIjZxY/export?format=csv';
const SITE_URL = 'https://doctor-simulator-flights.vercel.app';

// Airport database with coordinates
const AIRPORT_DB = {
    'LLBG': { coords: [32.0114, 34.8867], city: 'Tel Aviv', country: 'IL' },
    'LROP': { coords: [44.5711, 26.0850], city: 'Bucharest', country: 'RO' },
    'LCLK': { coords: [34.8751, 33.6249], city: 'Larnaca', country: 'CY' },
    'LGSR': { coords: [36.3992, 25.4793], city: 'Santorini', country: 'GR' },
    'LGAV': { coords: [37.9364, 23.9445], city: 'Athens', country: 'GR' },
    'LGKF': { coords: [38.1200, 20.5005], city: 'Kefalonia', country: 'GR' },
    'LIRF': { coords: [41.8003, 12.2389], city: 'Rome', country: 'IT' },
    'LFMN': { coords: [43.6584, 7.2159], city: 'Nice', country: 'FR' },
    'LFPB': { coords: [48.9694, 2.4414], city: 'Paris', country: 'FR' },
    'EGBB': { coords: [52.4539, -1.7480], city: 'Birmingham', country: 'GB' },
    'EGLL': { coords: [51.4700, -0.4543], city: 'London', country: 'GB' },
    'EIDW': { coords: [53.4213, -6.2700], city: 'Dublin', country: 'IE' },
    'EKVG': { coords: [62.0161, -7.1926], city: 'Vágar', country: 'FO' },
    'BIKF': { coords: [63.9850, -22.6056], city: 'Keflavík', country: 'IS' },
    'CYYT': { coords: [47.6144, -52.7519], city: 'St. John\'s', country: 'CA' },
    'CYQX': { coords: [48.4436, -54.5675], city: 'Gander', country: 'CA' },
    'CYGZ': { coords: [53.2719, -60.3986], city: 'Goose Bay', country: 'CA' },
    'CYQB': { coords: [46.7911, -71.2260], city: 'Quebec', country: 'CA' },
    'CYYZ': { coords: [43.6772, -79.6306], city: 'Toronto', country: 'CA' },
    'KDTW': { coords: [42.2124, -83.3534], city: 'Detroit', country: 'US' },
    'KORD': { coords: [41.9742, -87.9073], city: 'Chicago', country: 'US' },
    'KOMA': { coords: [41.3033, -95.8980], city: 'Omaha', country: 'US' },
    'KDEN': { coords: [39.8561, -104.6737], city: 'Denver', country: 'US' },
    'KSLC': { coords: [40.7884, -111.8787], city: 'Salt Lake City', country: 'US' },
    'KRNO': { coords: [39.4665, -119.7674], city: 'Reno', country: 'US' },
    'KSFO': { coords: [37.6213, -122.3790], city: 'San Francisco', country: 'US' },
    'KPHX': { coords: [33.4342, -112.0116], city: 'Phoenix', country: 'US' },
    'MMCN': { coords: [29.9705, -110.3888], city: 'Hermosillo', country: 'MX' },
    'MMMZ': { coords: [25.5261, -109.3910], city: 'Mazatlán', country: 'MX' },
    'MMMX': { coords: [19.4366, -99.0720], city: 'Mexico City', country: 'MX' },
    'MROC': { coords: [9.9281, -84.1208], city: 'San José', country: 'CR' },
    'MPTO': { coords: [8.9824, -79.5199], city: 'Panama City', country: 'PA' },
    'SKBO': { coords: [4.7212, -74.1479], city: 'Bogotá', country: 'CO' },
    'SEQM': { coords: [-0.2155, -78.4896], city: 'Quito', country: 'EC' },
    'SPJC': { coords: [-12.0219, -77.1144], city: 'Lima', country: 'PE' },
    'SCLP': { coords: [-33.3989, -70.7942], city: 'Santiago', country: 'CL' },
    'SCIP': { coords: [-53.0033, -70.8153], city: 'Punta Arenas', country: 'CL' },
    'SCAR': { coords: [-38.7369, -57.5924], city: 'Río Grande', country: 'AR' },
    'NZIR': { coords: [-77.8405, 166.6789], city: 'McMurdo', country: 'AQ' },
    'NZCH': { coords: [-43.4890, 172.5326], city: 'Christchurch', country: 'NZ' },
    'YMML': { coords: [-37.6733, 144.8445], city: 'Melbourne', country: 'AU' },
    'YSSY': { coords: [-33.9461, 151.1772], city: 'Sydney', country: 'AU' },
    'YBBN': { coords: [-27.3842, 153.1175], city: 'Brisbane', country: 'AU' },
    'YPDN': { coords: [-12.4534, 131.0064], city: 'Darwin', country: 'AU' },
    'WADD': { coords: [-8.7674, 115.1674], city: 'Denpasar', country: 'ID' },
    'WMKP': { coords: [3.1186, 101.6869], city: 'Kuala Lumpur', country: 'MY' },
    'VTBS': { coords: [13.9125, 100.6075], city: 'Bangkok', country: 'TH' },
    'VOCI': { coords: [9.8267, 76.2706], city: 'Kochi', country: 'IN' },
    'OOMS': { coords: [23.6100, 58.2844], city: 'Muscat', country: 'OM' },
    'OTHH': { coords: [25.2731, 51.6072], city: 'Doha', country: 'QA' },
    'UBBB': { coords: [40.0620, 50.2300], city: 'Baku', country: 'AZ' },
    'LTAR': { coords: [39.5564, 32.4143], city: 'Ankara', country: 'TR' },
    'LTAI': { coords: [40.3967, 33.1036], city: 'Istanbul', country: 'TR' },
    'MMIT': { coords: [19.2547, -99.4896], city: 'Mexico City Terminal 1', country: 'MX' },
    'MMZO': { coords: [19.6178, -99.5339], city: 'Toluca', country: 'MX' }
};

async function loadRoutesFromSheet() {
    const response = await fetch(SHEET_URL + '&t=' + Date.now());
    const csv = await response.text();
    const lines = csv.trim().split('\n');
    const routes = [];

    for (let i = 1; i < lines.length; i++) {
        const line = lines[i].trim();
        if (!line) continue;
        const cols = line.split(',').map(c => c.trim().replace(/^"|"$/g, ''));
        if (cols.length >= 3) {
            const sanitize = str => str.toUpperCase().trim().replace(/[\u200B-\u200F\u202A-\u202E\u2060-\u206F]/g, '');
            const num = parseInt(cols[0]) || i;
            const from = sanitize(cols[1]);
            const to = sanitize(cols[2]);
            if (from && to) routes.push({ id: num, num, from, to });
        }
    }
    return routes;
}

async function loadSavedData() {
    if (KV_URL && KV_TOKEN) {
        try {
            const response = await fetch(KV_URL, {
                method: 'POST',
                headers: { Authorization: `Bearer ${KV_TOKEN}`, 'Content-Type': 'application/json' },
                body: JSON.stringify(['GET', KV_KEY])
            });
            const { result } = await response.json();
            return result ? (typeof result === 'string' ? JSON.parse(result) : result) : { completed: {}, dates: {} };
        } catch (e) {
            return { completed: {}, dates: {} };
        }
    }
    return { completed: {}, dates: {} };
}

function formatDuration(minutes) {
    const h = Math.floor(minutes / 60);
    const m = minutes % 60;
    return h > 0 ? `${h}h ${m}m` : `${m}m`;
}

function calcEndTime(time, durationMin) {
    const [h, m] = time.split(':').map(Number);
    const totalMin = h * 60 + m + durationMin;
    const endH = Math.floor(totalMin / 60) % 24;
    const endM = totalMin % 60;
    return `${String(endH).padStart(2,'0')}:${String(endM).padStart(2,'0')}`;
}

function escapeXml(str) {
    return String(str || '')
        .replace(/&/g, '&amp;')
        .replace(/</g, '&lt;')
        .replace(/>/g, '&gt;')
        .replace(/"/g, '&quot;')
        .replace(/'/g, '&apos;');
}

export default async function handler(req, res) {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Cache-Control', 'public, max-age=300');

    if (req.method !== 'GET') {
        return res.status(405).json({ error: 'Method not allowed' });
    }

    // Load routes from Google Sheet (same source as the app)
    let routes = [];
    try {
        routes = await loadRoutesFromSheet();
    } catch (e) {
        return res.status(500).json({ error: 'Failed to load routes from sheet: ' + e.message });
    }

    const { completed, dates } = await loadSavedData();
    const now = new Date().toUTCString();

    // Build RSS items - only flights with scheduled dates
    const items = [];
    for (const route of routes) {
        const routeDate = dates[route.id];
        if (!routeDate || !routeDate.date || !routeDate.time) continue;

        const isCompleted = !!completed[route.id];
        const pubDate = new Date(`${routeDate.date}T${routeDate.time}:00`).toUTCString();
        const title = `✈️ ${route.from} → ${route.to}`;

        // Get airport info with coordinates
        const fromAirport = AIRPORT_DB[route.from] || { coords: null, city: route.from, country: '' };
        const toAirport = AIRPORT_DB[route.to] || { coords: null, city: route.to, country: '' };

        const description = [
            `<b>Departure Airport:</b> ${escapeXml(route.from)} - ${escapeXml(fromAirport.city)}`,
            fromAirport.coords ? `<b>Departure Coordinates:</b> ${fromAirport.coords[0].toFixed(4)}°, ${fromAirport.coords[1].toFixed(4)}°` : '',
            `<b>Arrival Airport:</b> ${escapeXml(route.to)} - ${escapeXml(toAirport.city)}`,
            toAirport.coords ? `<b>Arrival Coordinates:</b> ${toAirport.coords[0].toFixed(4)}°, ${toAirport.coords[1].toFixed(4)}°` : '',
            `<b>Date:</b> ${routeDate.date}`,
            `<b>Departure Time:</b> ${routeDate.time}`,
            `<b>Flight Type:</b> IFR`,
            `<b>Status:</b> ${isCompleted ? '✅ Completed' : '🕐 Scheduled'}`,
            `<b>Route #:</b> ${route.num} / ${routes.length}`,
        ].filter(x => x).join('<br/>');

        items.push(`
    <item>
      <title>${escapeXml(title)}</title>
      <description><![CDATA[${description}]]></description>
      <pubDate>${pubDate}</pubDate>
      <guid isPermaLink="false">${SITE_URL}/flight/${route.id}</guid>
      <link>${SITE_URL}</link>
      <category>IFR Flight</category>
      <category>${isCompleted ? 'Completed' : 'Scheduled'}</category>
    </item>`);
    }

    const xml = `<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0" xmlns:atom="http://www.w3.org/2005/Atom">
  <channel>
    <title>Doctor Simulator - Flight Schedule</title>
    <link>${SITE_URL}</link>
    <description>מסביב לעולם - IFR Flight Training Schedule | ${items.length} flights scheduled, ${Object.keys(completed).length} completed</description>
    <language>he</language>
    <lastBuildDate>${now}</lastBuildDate>
    <atom:link href="${SITE_URL}/api/rss" rel="self" type="application/rss+xml"/>
    <image>
      <url>${SITE_URL}/logo.png</url>
      <title>Doctor Simulator</title>
      <link>${SITE_URL}</link>
    </image>
${items.join('\n')}
  </channel>
</rss>`;

    res.setHeader('Content-Type', 'application/rss+xml; charset=UTF-8');
    return res.status(200).send(xml);
}
