<?php
include_once '../config/cors.php';
include_once '../config/database.php';

$database = new Database();
$db = $database->getConnection();

$data = json_decode(file_get_contents("php://input"));

if(!empty($data->idPerfume)) {
    try {
        // Borramos el perfume (Ojo: Si tiene ventas asociadas, podría dar error por integridad referencial. 
        // Lo ideal sería marcarlo como "inactivo", pero para este CRUD básico lo borraremos).
        $query = "DELETE FROM perfumes WHERE idPerfume = :id";
        $stmt = $db->prepare($query);
        $stmt->bindParam(":id", $data->idPerfume);

        if($stmt->execute()) {
            http_response_code(200);
            echo json_encode(array("mensaje" => "Perfume eliminado."));
        } else {
            http_response_code(503);
            echo json_encode(array("mensaje" => "No se pudo eliminar."));
        }
    } catch (PDOException $e) {
        http_response_code(503);
        echo json_encode(array("error" => $e->getMessage()));
    }
} else {
    http_response_code(400);
    echo json_encode(array("mensaje" => "Falta el ID."));
}
?>