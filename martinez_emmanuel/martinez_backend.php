<?php
error_reporting(E_ALL);
ini_set('display_errors', 1);

header("Access-Control-Allow-Origin: https://hypertechs.netlify.app");
header("Access-Control-Allow-Methods: GET, POST, PATCH, PUT, DELETE, OPTIONS");
header("Access-Control-Allow-Headers: Origin, Content-Type, X-Auth-Token");

// Establishes the database connection
$servername = "127.0.0.1:3306";
$username = "u754510873_user_exercise";
$password = "zK9]bR|Sgx/U";
$dbname = "u754510873_db_exercise18";

// Create a connection
$conn = new mysqli($servername, $username, $password, $dbname);

// Check the connection
if ($conn->connect_error) {
    die("Connection failed: " . $conn->connect_error);
}

// Check the request method
$method = $_SERVER['REQUEST_METHOD'];

switch ($method) {
    case 'GET':
        // Handle read (GET) operation
        if (isset($_GET['id'])) {
            // Fetch a specific song by ID
            $songId = $_GET['id'];
            $sql = "SELECT * FROM martinez_table WHERE id = $songId";
        } else {
            // Fetch all songs
            $sql = "SELECT * FROM martinez_table";
        }
        $result = $conn->query($sql);

        $playlist = array();

        if ($result->num_rows > 0) {
            while ($row = $result->fetch_assoc()) {
                $playlist[] = $row;
            }
        }

        // Return playlist data as JSON
        header('Content-Type: application/json');
        echo json_encode($playlist);
        break;

    case 'POST':
        // Handle create (POST) operation
        // Insert data into the 'martinez_table' table
        $title = mysqli_real_escape_string($conn, $_POST['title']);
        $artist = mysqli_real_escape_string($conn, $_POST['artist']);
        $genre = mysqli_real_escape_string($conn, $_POST['genre']);
        $year = mysqli_real_escape_string($conn, $_POST['year']);
        $plays = mysqli_real_escape_string($conn, $_POST['plays']);

        $sql = "INSERT INTO martinez_table (title, artist, genre, year, plays) 
                VALUES ('$title', '$artist', '$genre', '$year', '$plays')";

        if ($conn->query($sql) === TRUE) {
            echo "Song added to your playlist successfully!";
        } else {
            echo "Error: " . $sql . "<br>" . $conn->error;
        }
        break;

        // Inside the 'PATCH' case
    case 'PATCH':
        // Handle update (PATCH) operation
        // Update data in the 'martinez_table' table
        parse_str(file_get_contents("php://input"), $patchVars);

        $songId = $patchVars['id'];
        $title = mysqli_real_escape_string($conn, $patchVars['title']);
        $artist = mysqli_real_escape_string($conn, $patchVars['artist']);
        $genre = mysqli_real_escape_string($conn, $patchVars['genre']);
        $year = mysqli_real_escape_string($conn, $patchVars['year']);
        $plays = mysqli_real_escape_string($conn, $patchVars['plays']);

        $sql = "UPDATE martinez_table 
                    SET title='$title', artist='$artist', 
                    genre='$genre', year='$year', plays='$plays' 
                    WHERE id=$songId";

        if ($conn->query($sql) === TRUE) {
            echo "Song details updated successfully!";
        } else {
            echo "Error updating playlist: " . $conn->error;
        }
        break;



    case 'DELETE':
        // Handle delete (DELETE) operation
        // Delete data from the 'martinez_table' table
        $songId = $_GET['id'];
        $sql = "DELETE FROM martinez_table WHERE id=$songId";

        if ($conn->query($sql) === TRUE) {
            echo "Song deleted from the playlist successfully!";
        } else {
            echo "Error deleting playlist: " . $conn->error;
        }
        break;

    case 'OPTIONS':
        // Respond to preflight requests
        header("Access-Control-Allow-Origin: 
                https://hypertechs.netlify.app");
        header("Access-Control-Allow-Methods: 
                GET, POST, PATCH, PUT, DELETE, OPTIONS");
        header("Access-Control-Allow-Headers: Origin, Content-Type, 
                X-Auth-Token");
        header('Content-Type: application/json');
        http_response_code(200);
        break;


    default:
        // Invalid request method
        http_response_code(405); // Method Not Allowed
        echo "Invalid request method";
        break;
}

// Close the database connection
$conn->close();
