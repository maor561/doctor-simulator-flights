/**
 * RSS Feed endpoint for flight routes
 * GET /api/rss - Returns RSS XML feed with all scheduled flights
 */

import { kv } from '@vercel/kv';

const KV_URL = process.env.KV_REST_API_URL;
const KV_TOKEN = process.env.KV_REST_API_TOKEN;
const KV_KEY = 'doctor-simulator-data';

const SITE_URL = 'https://doctor-simulator-flights.vercel.app';

// All routes data (mirrors index.html)
const ALL_ROUTES = [
    {id:1,from:"LLBG",fromCity:"תל אביב",fromCountry:"🇮🇱",to:"LCLK",toCity:"לרנקה",toCountry:"🇨🇾",time:65},
    {id:2,from:"LCLK",fromCity:"לרנקה",fromCountry:"🇨🇾",to:"LGSR",toCity:"רודוס",toCountry:"🇬🇷",time:60},
    {id:3,from:"LGSR",fromCity:"רודוס",fromCountry:"🇬🇷",to:"LGKF",toCity:"קורפו",toCountry:"🇬🇷",time:100},
    {id:4,from:"LGKF",fromCity:"קורפו",fromCountry:"🇬🇷",to:"LIRF",toCity:"רומא",toCountry:"🇮🇹",time:95},
    {id:5,from:"LIRF",fromCity:"רומא",fromCountry:"🇮🇹",to:"LFMN",toCity:"ניס",toCountry:"🇫🇷",time:70},
    {id:6,from:"LFMN",fromCity:"ניס",fromCountry:"🇫🇷",to:"LFPB",toCity:"פריז",toCountry:"🇫🇷",time:95},
    {id:7,from:"LFPB",fromCity:"פריז",fromCountry:"🇫🇷",to:"EGBB",toCity:"בירמינגהם",toCountry:"🇬🇧",time:80},
    {id:8,from:"EGBB",fromCity:"בירמינגהם",fromCountry:"🇬🇧",to:"EIDW",toCity:"דבלין",toCountry:"🇮🇪",time:70},
    {id:9,from:"EIDW",fromCity:"דבלין",fromCountry:"🇮🇪",to:"EKVG",toCity:"ווגאר",toCountry:"🇫🇴",time:100},
    {id:10,from:"EKVG",fromCity:"ווגאר",fromCountry:"🇫🇴",to:"BIKF",toCity:"קפלאוויק",toCountry:"🇮🇸",time:105},
    {id:11,from:"BIKF",fromCity:"קפלאוויק",fromCountry:"🇮🇸",to:"CYYT",toCity:"סנט ג'ונס",toCountry:"🇨🇦",time:255},
    {id:12,from:"CYYT",fromCity:"סנט ג'ונס",fromCountry:"🇨🇦",to:"CYQX",toCity:"גנדר",toCountry:"🇨🇦",time:60},
    {id:13,from:"CYQX",fromCity:"גנדר",fromCountry:"🇨🇦",to:"CYGZ",toCity:"גוס בע",toCountry:"🇨🇦",time:100},
    {id:14,from:"CYGZ",fromCity:"גוס בי",fromCountry:"🇨🇦",to:"CYQB",toCity:"קוויבק סיטי",toCountry:"🇨🇦",time:85},
    {id:15,from:"CYQB",fromCity:"קוויבק סיטי",fromCountry:"🇨🇦",to:"CYYZ",toCity:"טורונטו",toCountry:"🇨🇦",time:90},
    {id:16,from:"CYYZ",fromCity:"טורונטו",fromCountry:"🇨🇦",to:"KDTW",toCity:"דטרויט",toCountry:"🇺🇸",time:65},
    {id:17,from:"KDTW",fromCity:"דטרויט",fromCountry:"🇺🇸",to:"KORD",toCity:"שיקגו",toCountry:"🇺🇸",time:80},
    {id:18,from:"KORD",fromCity:"שיקגו",fromCountry:"🇺🇸",to:"KOMA",toCity:"אומהה",toCountry:"🇺🇸",time:95},
    {id:19,from:"KOMA",fromCity:"אומהה",fromCountry:"🇺🇸",to:"KDEN",toCity:"דנוור",toCountry:"🇺🇸",time:105},
    {id:20,from:"KDEN",fromCity:"דנוור",fromCountry:"🇺🇸",to:"KSLC",toCity:"סולט לייק סיטי",toCountry:"🇺🇸",time:85},
    {id:21,from:"KSLC",fromCity:"סולט לייק סיטי",fromCountry:"🇺🇸",to:"KRNO",toCity:"רנו",toCountry:"🇺🇸",time:70},
    {id:22,from:"KRNO",fromCity:"רנו",fromCountry:"🇺🇸",to:"KSFO",toCity:"סן פרנסיסקו",toCountry:"🇺🇸",time:75},
    {id:23,from:"KSFO",fromCity:"סן פרנסיסקו",fromCountry:"🇺🇸",to:"KPHX",toCity:"פיניקס",toCountry:"🇺🇸",time:90},
    {id:24,from:"KPHX",fromCity:"פיניקס",fromCountry:"🇺🇸",to:"MMCN",toCity:"הרמוסיו",toCountry:"🇲🇽",time:70},
    {id:25,from:"MMCN",fromCity:"הרמוסיו",fromCountry:"🇲🇽",to:"MMMZ",toCity:"מזטלן",toCountry:"🇲🇽",time:65},
    {id:26,from:"MMMZ",fromCity:"מזטלן",fromCountry:"🇲🇽",to:"MMMX",toCity:"מקסיקו סיטי",toCountry:"🇲🇽",time:90},
    {id:27,from:"MMMX",fromCity:"מקסיקו סיטי",fromCountry:"🇲🇽",to:"MROC",toCity:"סן חוסה",toCountry:"🇨🇷",time:105},
    {id:28,from:"MROC",fromCity:"סן חוסה",fromCountry:"🇨🇷",to:"MPTO",toCity:"פנמה סיטי",toCountry:"🇵🇦",time:70},
    {id:29,from:"MPTO",fromCity:"פנמה סיטי",fromCountry:"🇵🇦",to:"SKBO",toCity:"בוגוטה",toCountry:"🇨🇴",time:95},
    {id:30,from:"SKBO",fromCity:"בוגוטה",fromCountry:"🇨🇴",to:"SEQM",toCity:"קיטו",toCountry:"🇪🇨",time:65},
    {id:31,from:"SEQM",fromCity:"קיטו",fromCountry:"🇪🇨",to:"SPJC",toCity:"לימה",toCountry:"🇵🇪",time:105},
    {id:32,from:"SPJC",fromCity:"לימה",fromCountry:"🇵🇪",to:"SCLP",toCity:"סנטיאגו",toCountry:"🇨🇱",time:105},
    {id:33,from:"SCLP",fromCity:"סנטיאגו",fromCountry:"🇨🇱",to:"SCIP",toCity:"פונטה ארנס",toCountry:"🇨🇱",time:120},
    {id:34,from:"SCIP",fromCity:"פונטה ארנס",fromCountry:"🇨🇱",to:"SCAR",toCity:"ריו גלאנדה",toCountry:"🇦🇷",time:60},
    {id:35,from:"SCAR",fromCity:"ריו גלאנדה",fromCountry:"🇦🇷",to:"NZIR",toCity:"מקמורדו",toCountry:"🇦🇶",time:105},
    {id:36,from:"NZIR",fromCity:"מקמורדו",fromCountry:"🇦🇶",to:"NZCH",toCity:"כריסטצ'רץ'",toCountry:"🇳🇿",time:270},
    {id:37,from:"NZCH",fromCity:"כריסטצ'רץ'",fromCountry:"🇳🇿",to:"YMML",toCity:"מלבורן",toCountry:"🇦🇺",time:130},
    {id:38,from:"YMML",fromCity:"מלבורן",fromCountry:"🇦🇺",to:"YSSY",toCity:"סידני",toCountry:"🇦🇺",time:65},
    {id:39,from:"YSSY",fromCity:"סידני",fromCountry:"🇦🇺",to:"YBBN",toCity:"בריסביין",toCountry:"🇦🇺",time:95},
    {id:40,from:"YBBN",fromCity:"בריסביין",fromCountry:"🇦🇺",to:"NFNA",toCity:"סובה",toCountry:"🇫🇯",time:180},
    {id:41,from:"NFNA",fromCity:"סובה",fromCountry:"🇫🇯",to:"NSTU",toCity:"פאגו פאגו",toCountry:"🇦🇸",time:170},
    {id:42,from:"NSTU",fromCity:"פאגו פאגו",fromCountry:"🇦🇸",to:"PHOG",toCity:"מאווי",toCountry:"🇺🇸",time:280},
    {id:43,from:"PHOG",fromCity:"מאווי",fromCountry:"🇺🇸",to:"PHNL",toCity:"הונולולו",toCountry:"🇺🇸",time:40},
    {id:44,from:"PHNL",fromCity:"הונולולו",fromCountry:"🇺🇸",to:"VHHH",toCity:"הונג קונג",toCountry:"🇭🇰",time:495},
    {id:45,from:"VHHH",fromCity:"הונג קונג",fromCountry:"🇭🇰",to:"RCTP",toCity:"טאיפיי",toCountry:"🇨🇳",time:90},
    {id:46,from:"RCTP",fromCity:"טאיפיי",fromCountry:"🇨🇳",to:"RJAA",toCity:"טוקיו",toCountry:"🇯🇵",time:180},
    {id:47,from:"RJAA",fromCity:"טוקיו",fromCountry:"🇯🇵",to:"WSSS",toCity:"סינגפור",toCountry:"🇸🇬",time:390},
];

async function loadData() {
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

function calcEndTime(date, time, durationMin) {
    const [h, m] = time.split(':').map(Number);
    const totalMin = h * 60 + m + durationMin;
    const endH = Math.floor(totalMin / 60) % 24;
    const endM = totalMin % 60;
    return `${String(endH).padStart(2,'0')}:${String(endM).padStart(2,'0')}`;
}

function escapeXml(str) {
    return String(str)
        .replace(/&/g, '&amp;')
        .replace(/</g, '&lt;')
        .replace(/>/g, '&gt;')
        .replace(/"/g, '&quot;')
        .replace(/'/g, '&apos;');
}

export default async function handler(req, res) {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Cache-Control', 'public, max-age=300'); // cache 5 min

    if (req.method !== 'GET') {
        return res.status(405).json({ error: 'Method not allowed' });
    }

    const { completed, dates } = await loadData();
    const now = new Date().toUTCString();

    // Build RSS items - only flights with scheduled dates
    const items = [];

    for (const route of ALL_ROUTES) {
        const routeDate = dates[route.id];
        if (!routeDate || !routeDate.date || !routeDate.time) continue;

        const isCompleted = !!completed[route.id];
        const endTime = calcEndTime(routeDate.date, routeDate.time, route.time);
        const pubDate = new Date(`${routeDate.date}T${routeDate.time}:00`).toUTCString();

        const title = `${route.fromCountry} ${route.from} → ${route.to} ${route.toCountry}`;
        const description = [
            `<b>Departure:</b> ${escapeXml(route.fromCity)} (${route.from})`,
            `<b>Arrival:</b> ${escapeXml(route.toCity)} (${route.to})`,
            `<b>Date:</b> ${routeDate.date}`,
            `<b>Departure Time:</b> ${routeDate.time}`,
            `<b>Arrival Time:</b> ${endTime}`,
            `<b>Duration:</b> ${formatDuration(route.time)}`,
            `<b>Flight Type:</b> IFR`,
            `<b>Status:</b> ${isCompleted ? '✅ Completed' : '🕐 Scheduled'}`,
            `<b>Route #:</b> ${route.id} / ${ALL_ROUTES.length}`,
        ].join('<br/>');

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

    const scheduledCount = items.length;
    const completedCount = Object.keys(completed).length;

    const xml = `<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0" xmlns:atom="http://www.w3.org/2005/Atom">
  <channel>
    <title>Doctor Simulator - Flight Schedule</title>
    <link>${SITE_URL}</link>
    <description>מסביב לעולם - IFR Flight Training Schedule | ${scheduledCount} flights scheduled, ${completedCount} completed</description>
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
