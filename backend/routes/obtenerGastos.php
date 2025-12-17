<?php
include_once '../config/cors.php';
include_once '../config/database.php';

$database = new Database();
$db = $database->getConnection();

// Traemos todo ordenado por fecha (el más reciente primero)
$query = "SELECT * FROM gastos ORDER BY fechaGasto DESC";

try {
    $stmt = $db->prepare($query);
    $stmt->execute();
    
    $gastos = array();
    $gastos["records"] = array();

    while ($row = $stmt->fetch(PDO::FETCH_ASSOC)) {
        array_push($gastos["records"], $row);
    }
    http_response_code(200);
    echo json_encode($gastos);

} catch (PDOException $e) {
    http_response_code(503);
    echo json_encode(array("error" => $e->getMessage()));
}
?>