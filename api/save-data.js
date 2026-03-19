/**
 * API endpoint for saving completed routes
 * POST /api/save-data
 * Body: { routeId: string, status: boolean }
 */

export default async function handler(req, res) {
    // Enable CORS
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

    if (req.method === 'OPTIONS') {
        return res.status(200).end();
    }

    if (req.method !== 'POST') {
        return res.status(405).json({ error: 'Method not allowed' });
    }

    const { action, routeId, password } = req.body;

    // Simple password check (should use env variable in production)
    const adminPassword = process.env.ADMIN_PASSWORD || 'admin123';
    
    if (password !== adminPassword) {
        return res.status(401).json({ error: 'Invalid password' });
    }

    try {
        if (action === 'complete') {
            // TODO: Save to database
            return res.status(200).json({ 
                success: true,
                message: `Route ${routeId} marked as complete`,
                timestamp: new Date().toISOString()
            });
        } else if (action === 'reset') {
            // TODO: Clear completed routes
            return res.status(200).json({ 
                success: true,
                message: 'Data reset',
                timestamp: new Date().toISOString()
            });
        } else {
            return res.status(400).json({ error: 'Unknown action' });
        }
    } catch (error) {
        console.error('Error saving data:', error);
        return res.status(500).json({ 
            error: 'Failed to save data',
            details: error.message
        });
    }
}
