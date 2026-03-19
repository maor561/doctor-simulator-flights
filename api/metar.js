/**
 * API endpoint for fetching METAR data
 * GET /api/metar?icao=LLBG
 * Uses CheckWX API (free tier available)
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
        // Try multiple METAR sources in order of preference

        // 1. Try CheckWX API (free, but limited)
        try {
            const checkwxResponse = await fetch(
                `https://api.checkwx.com/metar/${icao}/decoded`,
                {
                    headers: { 'X-API-Key': 'free' },
                    signal: AbortSignal.timeout(5000)
                }
            );

            if (checkwxResponse.ok) {
                const checkwxData = await checkwxResponse.json();
                if (checkwxData.data && checkwxData.data[0]) {
                    const metar = checkwxData.data[0].raw_text;
                    res.setHeader('Cache-Control', 'public, max-age=3600');
                    return res.status(200).json({
                        icao: icao.toUpperCase(),
                        metar: metar || null,
                        source: 'CheckWX',
                        time: new Date().toISOString()
                    });
                }
            }
        } catch (e) {
            console.warn(`CheckWX failed: ${e.message}`);
        }

        // 2. Fallback: Return mock METAR data
        const mockMetarData = {
            'LLBG': 'LLBG 201720Z 31008KT 9999 FEW040 23/14 Q1018',
            'LCLK': 'LCLK 201720Z 04012KT 9999 SCT035 25/16 Q1012',
            'LGSR': 'LGSR 201720Z 32010KT 9999 FEW050 26/15 Q1015',
            'LGKF': 'LGKF 201720Z 33009KT 9999 SCT045 24/14 Q1016',
            'LIRF': 'LIRF 201720Z 34008KT 9999 FEW040 22/13 Q1017',
            'LFMN': 'LFMN 201720Z 33007KT 9999 SCT035 21/12 Q1018',
            'LFPB': 'LFPB 201720Z 32006KT 9999 FEW040 20/11 Q1019',
            'EGBB': 'EGBB 201720Z 31005KT 9999 BKN035 19/10 Q1020',
            'EIDW': 'EIDW 201720Z 30004KT 9999 SCT040 18/10 Q1021',
            'EKVG': 'EKVG 201720Z 29012KT 9999 FEW050 15/08 Q1015',
            'BIKF': 'BIKF 201720Z 28015KT 9999 BKN030 12/06 Q1010'
        };

        const metar = mockMetarData[icao.toUpperCase()] || null;

        res.setHeader('Cache-Control', 'public, max-age=3600');
        return res.status(200).json({
            icao: icao.toUpperCase(),
            metar: metar,
            source: metar ? 'Mock' : 'N/A',
            time: new Date().toISOString()
        });

    } catch (error) {
        console.error(`Error in METAR endpoint for ${icao}:`, error.message);

        res.setHeader('Cache-Control', 'public, max-age=3600');
        return res.status(200).json({
            icao: icao.toUpperCase(),
            metar: null,
            error: 'METAR data unavailable',
            time: new Date().toISOString()
        });
    }
}
