<?php
include_once '../config/cors.php';
include_once '../config/database.php';

$database = new Database();
$db = $database->getConnection();

$query = "SELECT * FROM clientes ORDER BY nombreCliente ASC";

try {
    $stmt = $db->prepare($query);
    $stmt->execute();
    
    $clientes = array();
    $clientes["records"] = array();

    while ($row = $stmt->fetch(PDO::FETCH_ASSOC)) {
        extract($row);
        $item = array(
            "idCliente" => $idCliente,
            "nombreCliente" => $nombreCliente,
            "telefono" => $telefono,
            "redSocialLink" => $redSocialLink,
            "puntosAcumulados" => $puntosAcumulados
        );
        array_push($clientes["records"], $item);
    }
    http_response_code(200);
    echo json_encode($clientes);

} catch (PDOException $e) {
    http_response_code(503);
    echo json_encode(array("error" => $e->getMessage()));
}
?>