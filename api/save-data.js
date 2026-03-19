/**
 * API endpoint for saving and loading route data
 * POST /api/save-data - Save routes data (dates + completed)
 * GET /api/save-data - Load saved routes data
 * Body: { completed: {}, dates: {} }
 */

import fs from 'fs';
import path from 'path';

const DATA_FILE = '/tmp/doctor-simulator-data.json';

function ensureDataDir() {
    const dir = path.dirname(DATA_FILE);
    if (!fs.existsSync(dir)) {
        fs.mkdirSync(dir, { recursive: true });
    }
}

function loadData() {
    try {
        ensureDataDir();
        if (fs.existsSync(DATA_FILE)) {
            const data = fs.readFileSync(DATA_FILE, 'utf-8');
            return JSON.parse(data);
        }
    } catch (e) {
        console.warn('Could not load data file:', e.message);
    }
    return { completed: {}, dates: {} };
}

function saveData(data) {
    try {
        ensureDataDir();
        fs.writeFileSync(DATA_FILE, JSON.stringify(data, null, 2), 'utf-8');
        return true;
    } catch (e) {
        console.error('Could not save data file:', e.message);
        return false;
    }
}

export default async function handler(req, res) {
    // Enable CORS
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
    res.setHeader('Cache-Control', 'no-store, no-cache, must-revalidate');

    if (req.method === 'OPTIONS') {
        return res.status(200).end();
    }

    // GET: Load saved data
    if (req.method === 'GET') {
        const data = loadData();
        return res.status(200).json({
            success: true,
            data: data,
            timestamp: new Date().toISOString()
        });
    }

    // POST: Save data
    if (req.method === 'POST') {
        const { completed, dates, action } = req.body;

        if (action === 'sync' || (completed !== undefined && dates !== undefined)) {
            // Save the data
            const data = { completed, dates };
            if (saveData(data)) {
                return res.status(200).json({
                    success: true,
                    message: 'Data saved successfully',
                    timestamp: new Date().toISOString()
                });
            } else {
                return res.status(500).json({
                    error: 'Failed to save data to server'
                });
            }
        } else if (action === 'reset') {
            // Clear data
            if (saveData({ completed: {}, dates: {} })) {
                return res.status(200).json({
                    success: true,
                    message: 'Data reset successfully',
                    timestamp: new Date().toISOString()
                });
            }
        } else {
            return res.status(400).json({
                error: 'Invalid request - please provide completed and dates objects'
            });
        }
    }

    return res.status(405).json({ error: 'Method not allowed' });
}
