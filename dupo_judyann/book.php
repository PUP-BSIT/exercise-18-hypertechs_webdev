<?php
error_reporting(E_ALL);
ini_set('display_errors', 1);

header("Access-Control-Allow-Origin: http://localhost:8080");
header("Access-Control-Allow-Methods: GET, POST, PATCH, PUT, DELETE, OPTIONS");
header("Access-Control-Allow-Headers: Origin, Content-Type, X-Auth-Token");

// Establishes a database connection 
$servername = "localhost";
$username = "root";
$password = "";
$dbname = "dupo";

// Create a connection
$conn = new mysqli($servername, $username, $password, $dbname);

// Check the connection
if ($conn->connect_error) {
    die("Connection failed: " . $conn->connect_error);
}

// Check the request method
$method = $_SERVER['REQUEST_METHOD'];

switch ($method) {
    // ... (existing code)

// ... (existing code)

    case 'GET':
        // Handle read (GET) operation
        if (isset($_GET['id'])) {
            // Fetch a specific book by ID
            $bookId = $_GET['id'];
            $sql = "SELECT * FROM dupo_table WHERE id = ?";
            $stmt = $conn->prepare($sql);
            $stmt->bind_param("i", $bookId);
        } else {
            // Fetch all books
            $sql = "SELECT * FROM dupo_table";
            $stmt = $conn->prepare($sql);
        }

        $stmt->execute();
        $result = $stmt->get_result();

        $booklist = array();

        if ($result->num_rows > 0) {
            while ($row = $result->fetch_assoc()) {
                $booklist[] = $row;
            }
        }

        // Return booklist data as JSON
        header('Content-Type: application/json');
        echo json_encode($booklist);
        break;

// ... (remaining code)

        // Handle read (GET) operation
        if (isset($_GET['id'])) {
            // Fetch a specific book by ID
            $bookId = $_GET['id'];
            $sql = "SELECT * FROM dupo_table WHERE id = ?";
            $stmt = $conn->prepare($sql);
            $stmt->bind_param("i", $bookId);
        } else {
            // Fetch all books
            $sql = "SELECT * FROM dupo_table";
            $stmt = $conn->prepare($sql);
        }

        $stmt->execute();
        $result = $stmt->get_result();

        $booklist = array();

        if ($result->num_rows > 0) {
            while ($row = $result->fetch_assoc()) {
                $booklist[] = $row;
            }
        }

        // Return booklist data as JSON
        header('Content-Type: application/json');
        echo json_encode($booklist);
        break;

    // ... (remaining code)


    case 'POST':
        // Handle create (POST) operation
        // Insert data into the 'dupo_table' table
        $postData = json_decode(file_get_contents("php://input"), true);
    
        $title = $conn->real_escape_string($postData['title']);
        $author = $conn->real_escape_string($postData['author']);
        $genre = $conn->real_escape_string($postData['genre']);
        $year = $conn->real_escape_string($postData['year']);
        $rating = $conn->real_escape_string($postData['rating']);
    
        $stmt = $conn->prepare("INSERT INTO dupo_table (title, author, genre, year, rating) VALUES (?, ?, ?, ?, ?)");
        $stmt->bind_param("sssss", $title, $author, $genre, $year, $rating);
    
        if ($stmt->execute()) {
            echo "Book added to your collection successfully!";
        } else {
            echo "Error: " . $stmt->error;
        }
    
        $stmt->close();
        break;
            
        

    // ... (remaining cases remain unchanged)

    default:
        // Invalid request method
        http_response_code(405); // Method Not Allowed
        echo "Invalid request method";
        break;
}

// Close the database connection
$conn->close();
