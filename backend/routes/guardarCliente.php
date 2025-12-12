<?php
include_once '../config/cors.php';
include_once '../config/database.php';

$database = new Database();
$db = $database->getConnection();

$data = json_decode(file_get_contents("php://input"));

if(!empty($data->nombreCliente)) {
    try {
        $query = "INSERT INTO clientes (nombreCliente, telefono, redSocialLink, puntosAcumulados) 
                  VALUES (:nombre, :tel, :link, 0)";
        
        $stmt = $db->prepare($query);
        $stmt->bindParam(":nombre", $data->nombreCliente);
        $stmt->bindParam(":tel", $data->telefono);
        $stmt->bindParam(":link", $data->redSocialLink);

        if($stmt->execute()) {
            http_response_code(201);
            echo json_encode(array("mensaje" => "Cliente registrado."));
        } else {
            http_response_code(503);
            echo json_encode(array("mensaje" => "Error al registrar."));
        }
    } catch (PDOException $e) {
        http_response_code(503);
        echo json_encode(array("error" => $e->getMessage()));
    }
} else {
    http_response_code(400);
    echo json_encode(array("mensaje" => "Falta el nombre."));
}
?>