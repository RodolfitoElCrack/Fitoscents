<?php
include_once '../config/cors.php';
include_once '../config/database.php';

$database = new Database();
$db = $database->getConnection();

$data = json_decode(file_get_contents("php://input"));

if(!empty($data->idPerfume)) {
    try {
        $query = "UPDATE perfumes SET 
                    nombrePerfume = :nombre,
                    idMarca = :marca,
                    mililitrosTotales = :ml,
                    cantidadStock = :stock,
                    costoAdquisicion = :costo,
                    precioReferencia = :ref,
                    precioVentaBotella = :venta,
                    usoParaDecants = :decant,
                    esCompartido = :compartido
                  WHERE idPerfume = :id";

        $stmt = $db->prepare($query);

        $stmt->bindParam(":nombre", $data->nombrePerfume);
        $stmt->bindParam(":marca", $data->idMarca);
        $stmt->bindParam(":ml", $data->mililitrosTotales);
        $stmt->bindParam(":stock", $data->cantidadStock);
        $stmt->bindParam(":costo", $data->costoAdquisicion);
        $stmt->bindParam(":ref", $data->precioReferencia);
        $stmt->bindParam(":venta", $data->precioVentaBotella);
        
        $decant = $data->usoParaDecants ? 1 : 0;
        $compartido = $data->esCompartido ? 1 : 0;
        
        $stmt->bindParam(":decant", $decant);
        $stmt->bindParam(":compartido", $compartido);
        $stmt->bindParam(":id", $data->idPerfume);

        if($stmt->execute()) {
            http_response_code(200);
            echo json_encode(array("mensaje" => "Perfume actualizado."));
        } else {
            http_response_code(503);
            echo json_encode(array("mensaje" => "No se pudo actualizar."));
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