<?php
$servername = "localhost"; // Database server
$username = "root"; // Database username
$password = ""; // Database password (for local testing)
$dbname = "blood_donation"; // Database name

// Create connection
$conn = new mysqli($servername, $username, $password, $dbname);

// Check connection
if ($conn->connect_error) {
    die("Connection failed: " . $conn->connect_error);
}
?>