<?php
ob_start();
session_start();
include('db.php'); // Ensure db.php sets up the PDO connection correctly

if ($_SERVER["REQUEST_METHOD"] == "POST") {
    // Debugging: Print the POST array to check received data
    echo '<pre>';
    print_r($_POST);
    echo '</pre>';

    // Check if required fields are set and not empty
    if (!empty($_POST['email']) && !empty($_POST['password'])) {
        $email = $_POST['email'];
        $password = $_POST['password'];

        try {
            // Prepare the SQL statement to fetch the user by email
            $stmt = $conn->prepare("SELECT id, password FROM newuser WHERE email = ?");
            $stmt->execute([$email]);
            $user = $stmt->fetch(PDO::FETCH_ASSOC);

            // Check if a user was found and directly compare passwords
            if ($user && $password === $user['password']) {
                // Set session and redirect on successful login
                $_SESSION['user_id'] = $user['id'];
                
                // Debugging: Output the intended redirection URL
                echo "Redirecting to: main.html";

                if (!headers_sent()) {
                    header("Location: main.html");
                    exit(); // Prevent further script execution
                } else {
                    echo "Headers already sent, cannot redirect.";
                }
            } else {
                echo "Invalid email or password."; // Error if credentials don't match
            }

        } catch (PDOException $e) {
            echo "Database error: " . $e->getMessage(); // Output any database-related errors
        }
    } else {
        echo "Email and password are required."; // Error message if any field is missing
    }
}

ob_end_flush();
?>
