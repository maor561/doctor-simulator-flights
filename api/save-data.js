/**
 * API endpoint for saving and loading route data
 * POST /api/save-data - Save routes data (dates + completed)
 * GET /api/save-data - Load saved routes data
 * Body: { completed: {}, dates: {} }
 *
 * Storage: Uses Vercel KV (cloud) when available, falls back to file system (local dev)
 */

import fs from 'fs';
import path from 'path';

// ===== CLOUD STORAGE (Vercel KV / Upstash Redis) =====
const KV_URL = process.env.KV_REST_API_URL;
const KV_TOKEN = process.env.KV_REST_API_TOKEN;
const KV_KEY = 'doctor-simulator-data';

function isCloudMode() {
    return !!(KV_URL && KV_TOKEN);
}

async function kvGet() {
    try {
        const response = await fetch(`${KV_URL}`, {
            method: 'POST',
            headers: {
                Authorization: `Bearer ${KV_TOKEN}`,
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(['GET', KV_KEY])
        });
        if (!response.ok) throw new Error(`KV GET failed: ${response.status}`);
        const { result } = await response.json();
        return result ? (typeof result === 'string' ? JSON.parse(result) : result) : null;
    } catch (e) {
        console.error('KV GET error:', e.message);
        return null;
    }
}

async function kvSet(data) {
    try {
        const response = await fetch(`${KV_URL}`, {
            method: 'POST',
            headers: {
                Authorization: `Bearer ${KV_TOKEN}`,
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(['SET', KV_KEY, JSON.stringify(data)])
        });
        if (!response.ok) throw new Error(`KV SET failed: ${response.status}`);
        return true;
    } catch (e) {
        console.error('KV SET error:', e.message);
        return false;
    }
}

// ===== LOCAL FILE STORAGE (fallback for local development) =====
const DATA_FILE = process.env.DATA_DIR || './data/doctor-simulator-data.json';

function ensureDataDir() {
    const dir = path.dirname(DATA_FILE);
    if (!fs.existsSync(dir)) {
        fs.mkdirSync(dir, { recursive: true });
    }
}

function fileLoad() {
    try {
        ensureDataDir();
        if (fs.existsSync(DATA_FILE)) {
            const data = fs.readFileSync(DATA_FILE, 'utf-8');
            return JSON.parse(data);
        }
    } catch (e) {
        console.warn('Could not load data file:', e.message);
    }
    return null;
}

function fileSave(data) {
    try {
        ensureDataDir();
        fs.writeFileSync(DATA_FILE, JSON.stringify(data, null, 2), 'utf-8');
        return true;
    } catch (e) {
        console.error('Could not save data file:', e.message);
        return false;
    }
}

// ===== UNIFIED STORAGE API =====
async function loadData() {
    if (isCloudMode()) {
        console.log('☁️ Loading from Vercel KV...');
        const data = await kvGet();
        return data || { completed: {}, dates: {} };
    } else {
        console.log('📁 Loading from local file...');
        return fileLoad() || { completed: {}, dates: {} };
    }
}

async function saveData(data) {
    if (isCloudMode()) {
        console.log('☁️ Saving to Vercel KV...');
        return await kvSet(data);
    } else {
        console.log('📁 Saving to local file...');
        return fileSave(data);
    }
}

// ===== HANDLER =====
export default async function handler(req, res) {
    // Enable CORS
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
    res.setHeader('Cache-Control', 'no-store, no-cache, must-revalidate');

    const mode = isCloudMode() ? '☁️ CLOUD (Vercel KV)' : '📁 LOCAL (file system)';
    console.log(`[save-data] ${req.method} request - Storage: ${mode}`);

    if (req.method === 'OPTIONS') {
        return res.status(200).end();
    }

    // GET: Load saved data
    if (req.method === 'GET') {
        const data = await loadData();
        return res.status(200).json({
            success: true,
            data: data,
            storage: isCloudMode() ? 'cloud' : 'local',
            timestamp: new Date().toISOString()
        });
    }

    // POST: Save data
    if (req.method === 'POST') {
        const { completed, dates, action } = req.body;

        if (action === 'sync' || (completed !== undefined && dates !== undefined)) {
            const data = { completed, dates };
            if (await saveData(data)) {
                return res.status(200).json({
                    success: true,
                    message: 'Data saved successfully',
                    storage: isCloudMode() ? 'cloud' : 'local',
                    timestamp: new Date().toISOString()
                });
            } else {
                return res.status(500).json({
                    error: 'Failed to save data to server'
                });
            }
        } else if (action === 'reset') {
            if (await saveData({ completed: {}, dates: {} })) {
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
