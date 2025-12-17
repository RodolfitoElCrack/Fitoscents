<?php
include_once '../config/cors.php';
include_once '../config/database.php';

$database = new Database();
$db = $database->getConnection();

$data = json_decode(file_get_contents("php://input"));

if(!empty($data->monto) && $data->monto > 0) {
    try {
        // Registramos el pago en la tabla de liquidaciones
        // idSocio lo dejamos hardcodeado a 1 o lo recibes si tienes varios socios
        $query = "INSERT INTO liquidacionessocios (montoPagado, notas) VALUES (:monto, :notas)";
        $stmt = $db->prepare($query);

        $stmt->bindParam(":monto", $data->monto);
        $stmt->bindParam(":notas", $data->notas);

        if($stmt->execute()) {
            http_response_code(201);
            echo json_encode(array("mensaje" => "Pago registrado correctamente."));
        } else {
            http_response_code(503);
            echo json_encode(array("mensaje" => "Error al registrar pago."));
        }
    } catch (PDOException $e) {
        http_response_code(503);
        echo json_encode(array("error" => $e->getMessage()));
    }
} else {
    http_response_code(400);
    echo json_encode(array("mensaje" => "Monto inválido."));
}
?>