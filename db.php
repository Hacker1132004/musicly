<?php
$host = 'localhost'; // Replace with your actual database host
$dbname = 'ukcmngiz_musicly';
$username = 'ukcmngiz_lokendrapal';
$password = '11032004';

try {
    $conn = new PDO("mysql:host=$host;dbname=$dbname;charset=utf8", $username, $password, [
        PDO::ATTR_ERRMODE => PDO::ERRMODE_EXCEPTION,
    ]);
    echo "Connected successfully";
} catch (PDOException $e) {
    echo "Connection failed: " . $e->getMessage();
}
?>
