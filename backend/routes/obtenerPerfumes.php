<?php
include_once '../config/cors.php';
include_once '../config/database.php';

$database = new Database();
$db = $database->getConnection();

// JOIN con marcas para el nombre
$query = "SELECT p.*, m.nombreMarca 
          FROM perfumes p 
          LEFT JOIN marcas m ON p.idMarca = m.idMarca 
          ORDER BY p.idPerfume DESC";

try {
    $stmt = $db->prepare($query);
    $stmt->execute();
    $num = $stmt->rowCount();

    if($num > 0) {
        $perfumes_arr = array();
        $perfumes_arr["records"] = array();

        while ($row = $stmt->fetch(PDO::FETCH_ASSOC)) {
            extract($row);

            $perfume_item = array(
                "idPerfume" => $idPerfume,
                "nombrePerfume" => $nombrePerfume,
                "nombreMarca" => $nombreMarca,
                "idMarca" => $idMarca,
                "mililitrosTotales" => $mililitrosTotales,
                "cantidadStock" => $cantidadStock,
                "costoAdquisicion" => $costoAdquisicion,
                "precioVentaBotella" => $precioVentaBotella,
                "usoParaDecants" => (bool)$usoParaDecants,
                "esCompartido" => (bool)$esCompartido,
                // DATO CLAVE PARA COMISIONES:
                "idSocioDuenio" => $idSocioDuenio 
            );

            array_push($perfumes_arr["records"], $perfume_item);
        }

        http_response_code(200);
        echo json_encode($perfumes_arr);

    } else {
        http_response_code(200); // 200 OK pero vacío para no romper React
        echo json_encode(array("records" => []));
    }
} catch (PDOException $e) {
    http_response_code(503);
    echo json_encode(array("error" => $e->getMessage()));
}
?>