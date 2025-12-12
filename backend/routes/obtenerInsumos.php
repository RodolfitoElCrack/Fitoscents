<?php
include_once '../config/cors.php';
include_once '../config/database.php';

$database = new Database();
$db = $database->getConnection();

$query = "SELECT * FROM insumosDecants ORDER BY capacidadMl ASC";

try {
    $stmt = $db->prepare($query);
    $stmt->execute();
    $num = $stmt->rowCount();

    if($num > 0) {
        $insumos_arr = array();
        $insumos_arr["records"] = array();

        while ($row = $stmt->fetch(PDO::FETCH_ASSOC)) {
            extract($row);
            $item = array(
                "idInsumo" => $idInsumo,
                "nombreInsumo" => $nombreInsumo,
                "capacidadMl" => $capacidadMl,
                "cantidadStock" => $cantidadStock,
                "costoUnitario" => $costoUnitario
            );
            array_push($insumos_arr["records"], $item);
        }
        http_response_code(200);
        echo json_encode($insumos_arr);
    } else {
        http_response_code(200);
        echo json_encode(array("records" => []));
    }
} catch (PDOException $e) {
    http_response_code(503);
    echo json_encode(array("error" => $e->getMessage()));
}
?>