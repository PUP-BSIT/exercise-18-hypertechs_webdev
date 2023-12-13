<?php
require "./db_conn.php";

// $table = "favourite_movie";
$table = "serrano_table";


switch ($_SERVER['REQUEST_METHOD']) {
  case 'POST':
/*
    $title = "EHf";
    $director = "EHf";
    $genre = "EHf";
    $year = "EHf";
    $length = "EHf";
*/
    $title = $_POST['title'];
    $director = $_POST['director'];
    $genre = $_POST['genre'];
    $year = $_POST['year'];
    $length = $_POST['length'];
    
    $sql = "INSERT INTO $table (title, director, genre, year, length) 
      VALUES ('$title', '$director', '$genre', '$year', '$length');";
    mysqli_query ($conn, $sql);
    break;
  case 'GET':
    $sql = "SELECT * FROM $table;";
    $get_result = mysqli_query ($conn, $sql);
    $response = array ();
    while ($row = mysqli_fetch_assoc ($get_result)) {
      $response[] = $row;
    }
    echo json_encode ($response);
    break;
  case 'PATCH':
    parse_str (file_get_contents ('php://input'), $_PATCH);

    $title = $_PATCH['title'];
    $director = $_PATCH['director'];
    $genre = $_PATCH['genre'];
    $year = $_PATCH['year'];
    $length = $_PATCH['length'];
    $id = $_PATCH['id'];

    $sql = "UPDATE $table SET title='$title', director='$director',
      genre='$genre', year='$year', length='$length' WHERE id=$id;"; 
    mysqli_query ($conn, $sql);
    break;
  case 'DELETE':
    parse_str (file_get_contents ('php://input'), $_DELETE);
    $id = $_DELETE['id'];
    $sql = "DELETE FROM $table WHERE id=$id;"; 
    mysqli_query ($conn, $sql);
    echo $_DELETE['id']; 
    break;
}
?>
