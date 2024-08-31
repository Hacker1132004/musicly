<?php
// Database credentials
$host = 'localhost';  // Hostname
$dbname = 'User';  // Database name
$username = 'musicly';  // Database username
$password = '112233';  // Database password

try {
    // Create a PDO instance (connect to the database)
    $conn = new PDO("mysql:host=$host;dbname=$dbname", $username, $password);
    
    // Set the PDO error mode to exception
    $conn->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);
    
    echo "Connected successfully";
} catch(PDOException $e) {
    echo "Connection failed: " . $e->getMessage();
}

// Close the connection when done
// $conn = null;
?>
