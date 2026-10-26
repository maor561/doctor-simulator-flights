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

import { AIRPORT_DB } from './_airports.js';

const TIME_ZONE = 'Asia/Jerusalem';

// הפרש השעות של ישראל מ-UTC ברגע נתון (2 בחורף, 3 בקיץ), בדקות
function israelOffsetMinutes(utcMs) {
    const parts = {};
    for (const p of new Intl.DateTimeFormat('en-GB', {
        timeZone: TIME_ZONE, hourCycle: 'h23',
        year: 'numeric', month: '2-digit', day: '2-digit', hour: '2-digit', minute: '2-digit',
    }).formatToParts(new Date(utcMs))) parts[p.type] = p.value;
    const asUtc = Date.UTC(+parts.year, +parts.month - 1, +parts.day, +parts.hour, +parts.minute);
    return Math.round((asUtc - utcMs) / 60000);
}

// התאריך והשעה באפליקציה הם שעון ישראל. ממירים לרגע אמיתי, כדי ש-pubDate יהיה נכון ב-GMT.
export function israelLocalToDate(date, time) {
    const [y, mo, d] = date.split('-').map(Number);
    const [h, mi] = time.split(':').map(Number);
    const naive = Date.UTC(y, mo - 1, d, h, mi);
    let utc = naive - israelOffsetMinutes(naive) * 60000;
    utc = naive - israelOffsetMinutes(utc) * 60000; // תיקון ליד מעבר שעון
    return new Date(utc);
}

const isSaneDate = (date) => /^(20[2-9]\d)-\d{2}-\d{2}$/.test(date || '');

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
        // תאריך עם שנה שגויה (למשל 0026) לא מקבל pubDate מזויף; הבוט ממילא מדלג עליו
        const pubDate = isSaneDate(routeDate.date)
            ? israelLocalToDate(routeDate.date, routeDate.time).toUTCString()
            : null;
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
${pubDate ? `      <pubDate>${pubDate}</pubDate>\n` : ''}      <guid isPermaLink="false">${SITE_URL}/flight/${route.id}</guid>
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
