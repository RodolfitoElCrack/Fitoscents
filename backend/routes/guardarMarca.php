<?php
include_once '../config/cors.php';
include_once '../config/database.php';

$database = new Database();
$db = $database->getConnection();

$data = json_decode(file_get_contents("php://input"));

if(!empty($data->nombreMarca)) {
    try {
        $query = "INSERT INTO marcas (nombreMarca) VALUES (:nombreMarca)";
        $stmt = $db->prepare($query);

        // Limpieza y asignación
        $stmt->bindParam(":nombreMarca", htmlspecialchars(strip_tags($data->nombreMarca)));

        if($stmt->execute()) {
            http_response_code(201);
            echo json_encode(array("mensaje" => "Marca guardada."));
        } else {
            http_response_code(503);
            echo json_encode(array("mensaje" => "Error al guardar la marca."));
        }
    } catch (PDOException $e) {
        http_response_code(503);
        echo json_encode(array("error" => $e->getMessage()));
    }
} else {
    http_response_code(400);
    echo json_encode(array("mensaje" => "Falta el nombre de la marca."));
}
?>