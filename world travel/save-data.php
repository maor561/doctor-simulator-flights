<?php
header('Content-Type: application/json');
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: GET, POST');

$dataFile = 'doctor-data.json';

if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    $input = json_decode(file_get_contents('php://input'), true);
    if (isset($input['completed']) && isset($input['dates'])) {
        file_put_contents($dataFile, json_encode($input));
        echo json_encode(['success' => true]);
    }
} else {
    if (file_exists($dataFile)) {
        echo file_get_contents($dataFile);
    } else {
        echo json_encode(['completed' => [], 'dates' => []]);
    }
}
?>
