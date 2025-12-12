<?php
include_once '../config/cors.php';
include_once '../config/database.php';

$database = new Database();
$db = $database->getConnection();

$data = json_decode(file_get_contents("php://input"));

// Validamos que vengan los datos necesarios
if(!empty($data->nombreInsumo) && !empty($data->capacidadMl) && !empty($data->costoUnitario)) {
    try {
        $query = "INSERT INTO insumosDecants (nombreInsumo, capacidadMl, cantidadStock, costoUnitario) 
                  VALUES (:nombreInsumo, :capacidadMl, :cantidadStock, :costoUnitario)";
        
        $stmt = $db->prepare($query);

        $stmt->bindParam(":nombreInsumo", $data->nombreInsumo);
        $stmt->bindParam(":capacidadMl", $data->capacidadMl);
        $stmt->bindParam(":cantidadStock", $data->cantidadStock);
        $stmt->bindParam(":costoUnitario", $data->costoUnitario);

        if($stmt->execute()) {
            http_response_code(201);
            echo json_encode(array("mensaje" => "Insumo guardado correctamente."));
        } else {
            http_response_code(503);
            echo json_encode(array("mensaje" => "No se pudo guardar el insumo."));
        }
    } catch (PDOException $e) {
        http_response_code(503);
        echo json_encode(array("error" => $e->getMessage()));
    }
} else {
    http_response_code(400);
    echo json_encode(array("mensaje" => "Faltan datos."));
}
?>