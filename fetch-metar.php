<?php
header('Content-Type: application/json');
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: GET');

$icao = isset($_GET['icao']) ? strtoupper(trim($_GET['icao'])) : null;

if (!$icao || strlen($icao) !== 4 || !preg_match('/^[A-Z]{4}$/', $icao)) {
    echo json_encode(['raw' => 'N/A']);
    exit;
}

// Cache METAR data for 30 minutes per airport
$cacheDir = __DIR__;
$cacheFile = $cacheDir . '/metar_cache.json';

// Try cache first
if (file_exists($cacheFile)) {
    $cache = json_decode(file_get_contents($cacheFile), true);
    if (is_array($cache) && isset($cache[$icao]) && time() - $cache[$icao]['time'] < 1800) {
        echo json_encode(['raw' => $cache[$icao]['data']]);
        exit;
    }
} else {
    $cache = [];
}

$raw = '';

// Fetch from VATSIM metar.vatsim.net
$vatsimUrl = "https://metar.vatsim.net/$icao";
$context = stream_context_create([
    'http' => [
        'timeout' => 8,
        'header' => "User-Agent: DoctorSimulator/1.0\r\nConnection: close\r\n"
    ],
    'ssl' => [
        'verify_peer' => false,
        'verify_peer_name' => false
    ]
]);

$raw = @file_get_contents($vatsimUrl, false, $context);

// Clean up the response (VATSIM returns raw METAR text)
if ($raw) {
    $raw = trim($raw);
    // Remove any HTML if present
    $raw = strip_tags($raw);
    $raw = trim($raw);
}

if (!$raw || strlen($raw) < 10) {
    $raw = 'N/A';
}

// Update cache
if (!is_array($cache)) {
    $cache = [];
}

$cache[$icao] = [
    'time' => time(),
    'data' => $raw
];

// Keep cache size reasonable (only last 60 airports)
if (count($cache) > 60) {
    uasort($cache, function($a, $b) { return $b['time'] - $a['time']; });
    $cache = array_slice($cache, 0, 50, true);
}

// Write cache atomically
$tmpFile = $cacheFile . '.tmp';
@file_put_contents($tmpFile, json_encode($cache));
@rename($tmpFile, $cacheFile);

echo json_encode(['raw' => $raw]);
?>
