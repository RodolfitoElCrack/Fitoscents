<?php
include_once '../config/cors.php';
include_once '../config/database.php';

$database = new Database();
$db = $database->getConnection();

$data = json_decode(file_get_contents("php://input"));

if(!empty($data->descripcion) && !empty($data->monto)) {
    try {
        // Insertamos directo en la tabla 'gastos' que es independiente
        $query = "INSERT INTO gastos (descripcion, monto, esGastoCompartido) VALUES (:desc, :monto, :compartido)";
        $stmt = $db->prepare($query);

        $stmt->bindParam(":desc", $data->descripcion);
        $stmt->bindParam(":monto", $data->monto);
        
        // Si el checkbox viene true es 1, si no 0
        $esCompartido = !empty($data->esGastoCompartido) ? 1 : 0;
        $stmt->bindParam(":compartido", $esCompartido);

        if($stmt->execute()) {
            http_response_code(201);
            echo json_encode(array("mensaje" => "Gasto registrado."));
        } else {
            http_response_code(503);
            echo json_encode(array("mensaje" => "Error al guardar."));
        }
    } catch (PDOException $e) {
        http_response_code(503);
        echo json_encode(array("error" => $e->getMessage()));
    }
} else {
    http_response_code(400);
    echo json_encode(array("mensaje" => "Datos incompletos."));
}
?>