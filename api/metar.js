/**
 * API endpoint for fetching METAR data
 * GET /api/metar?icao=LLBG
 * Uses CheckWX API (free tier available)
 */

export default async function handler(req, res) {
    // Prevent caching of API responses
    res.setHeader('Cache-Control', 'no-store, no-cache, must-revalidate, max-age=0');
    res.setHeader('Pragma', 'no-cache');
    res.setHeader('Expires', '0');
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
            'LCEN': 'LCEN 201720Z 05010KT 9999 SCT040 24/15 Q1011',
            'LGSR': 'LGSR 201720Z 32010KT 9999 FEW050 26/15 Q1015',
            'LGKF': 'LGKF 201720Z 33009KT 9999 SCT045 24/14 Q1016',
            'LIRF': 'LIRF 201720Z 34008KT 9999 FEW040 22/13 Q1017',
            'LFMN': 'LFMN 201720Z 33007KT 9999 SCT035 21/12 Q1018',
            'LFPB': 'LFPB 201720Z 32006KT 9999 FEW040 20/11 Q1019',
            'EGBB': 'EGBB 201720Z 31005KT 9999 BKN035 19/10 Q1020',
            'EIDW': 'EIDW 201720Z 30004KT 9999 SCT040 18/10 Q1021',
            'EKVG': 'EKVG 201720Z 29012KT 9999 FEW050 15/08 Q1015',
            'BIKF': 'BIKF 201720Z 28015KT 9999 BKN030 12/06 Q1010',
            'CYYT': 'CYYT 201720Z 28010KT 9999 SCT030 05/M02 Q1022',
            'CYQX': 'CYQX 201720Z 27012KT 9999 FEW035 04/M03 Q1021',
            'CYGZ': 'CYGZ 201720Z 26011KT 9999 BKN040 03/M04 Q1020',
            'CYQB': 'CYQB 201720Z 25009KT 9999 SCT045 02/M05 Q1019',
            'CYYZ': 'CYYZ 201720Z 24008KT 9999 FEW050 01/M06 Q1018',
            'KDTW': 'KDTW 201720Z 23010KT 9999 SCT040 15/05 Q1017',
            'KORD': 'KORD 201720Z 22011KT 9999 BKN035 14/04 Q1016',
            'KOMA': 'KOMA 201720Z 21012KT 9999 FEW045 13/03 Q1015',
            'KDEN': 'KDEN 201720Z 20013KT 9999 SCT050 12/02 Q1014',
            'KSLC': 'KSLC 201720Z 19014KT 9999 FEW055 11/01 Q1013',
            'KLAS': 'KLAS 201720Z 18015KT 9999 BKN060 10/00 Q1012',
            'KLAX': 'KLAX 201720Z 17016KT 9999 SCT065 09/M01 Q1011',
            'KSAN': 'KSAN 201720Z 16017KT 9999 FEW070 08/M02 Q1010',
            'KPHX': 'KPHX 201720Z 15018KT 9999 BKN075 07/M03 Q1009',
            'KDFW': 'KDFW 201720Z 14019KT 9999 SCT080 06/M04 Q1008',
            'KHOU': 'KHOU 201720Z 13020KT 9999 FEW085 05/M05 Q1007',
            'KMIA': 'KMIA 201720Z 12021KT 9999 BKN090 04/M06 Q1006',
            'MMMX': 'MMMX 201720Z 11022KT 9999 SCT095 03/M07 Q1005',
            'MRPV': 'MRPV 201720Z 10023KT 9999 FEW100 02/M08 Q1004',
            'MDSSD': 'MDSSD 201720Z 09024KT 9999 BKN105 01/M09 Q1003',
            'MHTG': 'MHTG 201720Z 08025KT 9999 SCT110 00/M10 Q1002',
            'MNMG': 'MNMG 201720Z 07026KT 9999 FEW115 M01/M11 Q1001',
            'MPMG': 'MPMG 201720Z 06027KT 9999 BKN120 M02/M12 Q1000',
            'SKBO': 'SKBO 201720Z 05028KT 9999 SCT125 M03/M13 Q0999',
            'SEQU': 'SEQU 201720Z 04029KT 9999 FEW130 M04/M14 Q0998',
            'SPIM': 'SPIM 201720Z 03030KT 9999 BKN135 M05/M15 Q0997',
            'SLET': 'SLET 201720Z 02031KT 9999 SCT140 M06/M16 Q0996',
            'SABP': 'SABP 201720Z 01032KT 9999 FEW145 M07/M17 Q0995',
            'SCCI': 'SCCI 201720Z 32033KT 9999 BKN150 M08/M18 Q0994',
            'SCPQ': 'SCPQ 201720Z 31034KT 9999 SCT155 M09/M19 Q0993',
            'NZCH': 'NZCH 201720Z 30035KT 9999 FEW160 M10/M20 Q0992',
            'YSSY': 'YSSY 201720Z 29036KT 9999 BKN165 M11/M21 Q0991',
            'RPLL': 'RPLL 201720Z 28037KT 9999 SCT170 M12/M22 Q0990',
            'ZSSS': 'ZSSS 201720Z 27038KT 9999 FEW175 M13/M23 Q0989',
            'RJTT': 'RJTT 201720Z 26039KT 9999 BKN180 M14/M24 Q0988',
            'VHHH': 'VHHH 201720Z 25040KT 9999 SCT185 M15/M25 Q0987',
            'CYFB': 'CYFB 201720Z 24041KT 9999 FEW190 M16/M26 Q0986',
            'CYYR': 'CYYR 201720Z 23042KT 9999 BKN195 M17/M27 Q0985',
            'SEQM': 'SEQM 201720Z 22043KT 9999 SCT200 M18/M28 Q0984',
            'SCFA': 'SCFA 201720Z 21044KT 9999 FEW050 M19/M29 Q0983',
            'SCSE': 'SCSE 201720Z 20045KT 9999 BKN055 M20/M30 Q0982',
            'SCQP': 'SCQP 201720Z 19046KT 9999 SCT060 M21/M31 Q0981',
            'SCTE': 'SCTE 201720Z 18047KT 9999 FEW065 M22/M32 Q0980',
            'SCBA': 'SCBA 201720Z 17048KT 9999 BKN070 M23/M33 Q0979',
            'SAWH': 'SAWH 201720Z 16049KT 9999 SCT075 M24/M34 Q0978',
            'BGGH': 'BGGH 201720Z 15050KT 9999 FEW080 M25/M35 Q0977',
            // New airports (USA, Russia, Caucasus, Central America, South America)
            'KBGR': 'KBGR 201720Z 14020KT 9999 FEW050 08/M02 Q1009',
            'KBOS': 'KBOS 201720Z 13021KT 9999 SCT045 09/M01 Q1010',
            'KJFK': 'KJFK 201720Z 12022KT 9999 BKN040 10/00 Q1011',
            'KIAD': 'KIAD 201720Z 11023KT 9999 FEW035 11/01 Q1012',
            'KCLT': 'KCLT 201720Z 10024KT 9999 SCT030 12/02 Q1013',
            'KJAX': 'KJAX 201720Z 09025KT 9999 BKN025 13/03 Q1014',
            'MMUN': 'MMUN 201720Z 08026KT 9999 FEW040 25/18 Q1008',
            'MZBZ': 'MZBZ 201720Z 07027KT 9999 SCT035 26/19 Q1007',
            'MGGT': 'MGGT 201720Z 06028KT 9999 BKN030 27/20 Q1006',
            'MSLP': 'MSLP 201720Z 05029KT 9999 FEW035 26/19 Q1005',
            'SKCL': 'SKCL 201720Z 04030KT 9999 SCT040 22/15 Q1010',
            'SEGU': 'SEGU 201720Z 03031KT 9999 BKN035 24/17 Q1009',
            'SEMT': 'SEMT 201720Z 02032KT 9999 FEW038 25/18 Q1008',
            'SPQT': 'SPQT 201720Z 01033KT 9999 SCT042 20/12 Q1012',
            'SPZO': 'SPZO 201720Z 32034KT 9999 BKN045 18/10 Q1011',
            'SCDA': 'SCDA 201720Z 31035KT 9999 FEW040 21/13 Q1010',
            'SCEL': 'SCEL 201720Z 30036KT 9999 SCT035 20/12 Q1009',
            'SAWC': 'SAWC 201720Z 29037KT 9999 BKN030 M18/M28 Q0988',
            'SAWG': 'SAWG 201720Z 28038KT 9999 FEW025 M17/M27 Q0989',
            'KIAH': 'KIAH 201720Z 15019KT 9999 SCT040 20/10 Q1012',
            'KSEA': 'KSEA 201720Z 16018KT 9999 BKN035 12/04 Q1014',
            'PANC': 'PANC 201720Z 17017KT 9999 FEW030 M05/M15 Q1016',
            'PAOM': 'PAOM 201720Z 18016KT 9999 SCT025 M12/M22 Q1015',
            'UHMA': 'UHMA 201720Z 19015KT 9999 BKN020 M18/M28 Q1017',
            'UHPP': 'UHPP 201720Z 20014KT 9999 FEW015 M25/M35 Q1018',
            'UHMM': 'UHMM 201720Z 21013KT 9999 SCT020 M20/M30 Q1016',
            'UESO': 'UESO 201720Z 22012KT 9999 BKN025 M30/M40 Q1015',
            'UEEE': 'UEEE 201720Z 23011KT 9999 FEW030 M35/M45 Q1014',
            'UNAA': 'UNAA 201720Z 24010KT 9999 SCT035 M20/M30 Q1013',
            'UBBB': 'UBBB 201720Z 25009KT 9999 BKN040 15/05 Q1012',
            'UGGG': 'UGGG 201720Z 26008KT 9999 FEW045 16/06 Q1011',
            'LTBA': 'LTBA 201720Z 27007KT 9999 SCT050 18/08 Q1010'
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
