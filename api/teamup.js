/**
 * TeamUp Calendar API endpoint
 * POST /api/teamup - Add event to TeamUp calendar
 */

const TEAMUP_API_KEY = 'cb257ed950f120e329ad66319e8eef13b74acb3d7aced4eb3826ab20d14fdf25';
const TEAMUP_CALENDAR_ID = 'o7y5wi';

export default async function handler(req, res) {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

    if (req.method === 'OPTIONS') {
        return res.status(200).end();
    }

    if (req.method !== 'POST') {
        return res.status(405).json({ error: 'Method not allowed' });
    }

    try {
        const { routeId, routeName, date, time } = req.body;

        if (!routeId || !routeName || !date || !time) {
            return res.status(400).json({
                error: 'Missing required fields: routeId, routeName, date, time'
            });
        }

        // Parse time (format: "HH:MM")
        const [hours, minutes] = time.split(':').map(Number);
        if (isNaN(hours) || isNaN(minutes)) {
            return res.status(400).json({ error: 'Invalid time format (use HH:MM)' });
        }

        // Create event object for TeamUp
        const startDateTime = new Date(`${date}T${time}:00`);
        const endDateTime = new Date(startDateTime.getTime() + 60 * 60 * 1000); // 1 hour duration

        const event = {
            title: `✈️ ${routeName}`,
            startDate: startDateTime.toISOString().split('T')[0],
            startTime: time,
            endDate: endDateTime.toISOString().split('T')[0],
            endTime: endDateTime.toISOString().split('T')[1].substring(0, 5),
            notes: `Flight Route ID: ${routeId}`,
            location: routeName
        };

        // Call TeamUp API
        const teamupUrl = `https://api.teamup.com/${TEAMUP_CALENDAR_ID}/events`;
        const response = await fetch(teamupUrl, {
            method: 'POST',
            headers: {
                'Teamup-Token': TEAMUP_API_KEY,
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ event })
        });

        if (!response.ok) {
            const error = await response.text();
            console.error('TeamUp API error:', response.status, error);
            return res.status(response.status).json({
                error: 'Failed to add event to TeamUp',
                details: error
            });
        }

        const result = await response.json();
        console.log('✅ Event added to TeamUp:', result.event?.id);

        return res.status(200).json({
            success: true,
            message: 'Event added to TeamUp successfully',
            eventId: result.event?.id,
            timestamp: new Date().toISOString()
        });

    } catch (err) {
        console.error('TeamUp endpoint error:', err.message);
        return res.status(500).json({
            error: 'Server error',
            message: err.message
        });
    }
}
