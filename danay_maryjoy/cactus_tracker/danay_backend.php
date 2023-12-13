<?php
    header('Content-Type: application/json');
    header("Access-Control-Allow-Origin: https://hypertechs.netlify.app");
    header("Access-Control-Allow-Methods: GET, POST, PATCH, DELETE, OPTIONS");
    header("Access-Control-Allow-Headers: Origin, Content-Type, X-Auth-Token");

    // Database connection
    $servername = "127.0.0.1:3306"; 
    $username = "u754510873_user_exercise"; 
    $password = "zK9]bR|Sgx/U";
    $dbname = "u754510873_db_exercise18";

    $conn = new mysqli($servername, $username, $password, $dbname);

    // Check connection
    if ($conn->connect_error) {
        die("Connection failed: " . $conn->connect_error);
    }

    // Handling CRUD operations
    $request_method = $_SERVER["REQUEST_METHOD"];

    switch ($request_method) {
        case 'GET':
            // Get cacti list
            $query = "SELECT * FROM danay_table";
            $result = $conn->query($query);

            $cacti = array();
            if ($result->num_rows) {
                while ($row = $result->fetch_assoc()) {
                    $cacti[] = $row;
                }
            }
            echo json_encode($cacti);
            break;

        case 'POST':
            // Create a new cactus
            $data = json_decode(file_get_contents("php://input"), true);

            $name = $data['name'];
            $species = $data['species'];
            $color = $data['color'];
            $size = $data['size'];
            $age = $data['age'];

            $query = "INSERT INTO danay_table (name, species, color, size, age) 
                VALUES ('$name', '$species', '$color', '$size', $age)";
            if ($conn->query($query)) {
                echo "Cactus added successfully";
            } else {
                echo "Error: " . $conn->error;
            }
            break;

        case 'PATCH':
            $inputJSON = file_get_contents('php://input');
            $input = json_decode($inputJSON, TRUE);
            
            $id = $input['id'];
            $name = $input['name'];
            $species = $input['species'];
            $color = $input['color'];
            $size = $input['size'];
            $age = $input['age'];
            
            $query = "UPDATE danay_table SET name='$name', 
                species='$species', color='$color', size='$size', 
                age=$age WHERE id=$id";
            if ($conn->query($query)) {
                echo "Cactus updated successfully";
            } else {
                echo "Error: " . $conn->error;
            }
            break;

        case 'DELETE':
            // Delete cactus
            parse_str(file_get_contents("php://input"), $data);
            $id = $data['id'];

            $query = "DELETE FROM danay_table WHERE id=$id";
            if ($conn->query($query)) {
                echo "Cactus deleted successfully";
            } else {
                echo "Error: " . $conn->error;
            }
            break;
        
        case 'OPTIONS':
            header("Access-Control-Allow-Origin: *");
            header("Access-Control-Allow-Methods: 
                POST, GET, OPTIONS, DELETE, PATCH"); 
            header("Access-Control-Allow-Headers: Content-Type");
            header("HTTP/1.1 200 OK");
            break;

        default:
            // Invalid Request Method
            header("HTTP/1.0 405 Method Not Allowed");
            break;
    }

    $conn->close();
?>