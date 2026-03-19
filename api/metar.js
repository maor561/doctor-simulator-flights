/**
 * API endpoint for fetching METAR data
 * GET /api/metar?icao=LLBG
 */

export default async function handler(req, res) {
    // Enable CORS
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET, OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

    if (req.method === 'OPTIONS') {
        return res.status(200).end();
    }

    if (req.method !== 'GET') {
        return res.status(405).json({ error: 'Method not allowed' });
    }

    const { icao } = req.query;

    if (!icao) {
        return res.status(400).json({ error: 'ICAO code required' });
    }

    try {
        // Fetch from VATSIM METAR API with timeout
        const controller = new AbortController();
        const timeout = setTimeout(() => controller.abort(), 5000);

        const response = await fetch(`https://metar.vatsim.net/${icao}.json`, {
            signal: controller.signal
        });

        clearTimeout(timeout);

        if (!response.ok) {
            throw new Error(`VATSIM API returned ${response.status}`);
        }

        const data = await response.json();

        // Cache response for 1 hour
        res.setHeader('Cache-Control', 'public, max-age=3600');

        return res.status(200).json({
            icao: icao.toUpperCase(),
            metar: data.metar || null,
            time: new Date().toISOString()
        });
    } catch (error) {
        console.error(`Error fetching METAR for ${icao}:`, error.message);

        // Return graceful error with empty METAR
        return res.status(200).json({
            icao: icao.toUpperCase(),
            metar: null,
            error: 'METAR data unavailable',
            time: new Date().toISOString()
        });
    }
}
