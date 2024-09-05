<?php
ob_start();
session_start();
include('db.php'); // Ensure db.php sets up the PDO connection correctly

if ($_SERVER["REQUEST_METHOD"] == "POST") {
    // Debugging: Print the POST array to check received data
    echo '<pre>';
    print_r($_POST);
    echo '</pre>';

    // Check if all required fields are set and not empty
    if (!empty($_POST['name']) && !empty($_POST['email']) && !empty($_POST['password'])) {
        $name = $_POST['name'];
        $email = $_POST['email'];
        $password = $_POST['password'];

        try {
            // Prepare the SQL statement correctly
            $stmt = $conn->prepare("INSERT INTO newuser (name, email, password) VALUES (?, ?, ?)");
            
            // Execute the statement with the form data
            $stmt->execute([$name, $email, $password]);

            // Debugging: Output the intended redirection URL
            echo "Redirecting to: login.html";

            // Redirect to login.html after successful registration
            if (!headers_sent()) {
                header("Location: index.html");
                exit(); // Prevent further execution
            } else {
                echo "Headers already sent, cannot redirect.";
            }

        } catch (PDOException $e) {
            echo "Database error: " . $e->getMessage();
        }
    } else {
        echo "All fields are required."; // Error message if any field is missing
    }
}

ob_end_flush();
?>
