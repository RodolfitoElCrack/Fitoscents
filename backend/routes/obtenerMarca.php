<?php
include_once '../database/cors.php';     
include_once '../database/database.php';

$database = new Database();
$db = $database->getConnection();

// Ordenamos alfabéticamente (ASC) para que sea fácil buscar en la lista
$query = "SELECT * FROM marcas ORDER BY nombreMarca ASC";

try {
    $stmt = $db->prepare($query);
    $stmt->execute();
    $num = $stmt->rowCount();

    if($num > 0) {
        $marcas_arr = array();
        $marcas_arr["records"] = array();

        while ($row = $stmt->fetch(PDO::FETCH_ASSOC)) {
            extract($row);
            $marca_item = array(
                "idMarca" => $idMarca,
                "nombreMarca" => $nombreMarca
            );
            array_push($marcas_arr["records"], $marca_item);
        }

        http_response_code(200);
        echo json_encode($marcas_arr);
    } else {
        // Si no hay marcas, devolvemos lista vacía pero código 200 (para no romper el frontend)
        http_response_code(200); 
        echo json_encode(array("records" => []));
    }
} catch (PDOException $e) {
    http_response_code(503);
    echo json_encode(array("error" => $e->getMessage()));
}
?>