<?php
// 1. Incluimos configuración
include_once '../database/cors.php';     
include_once '../database/database.php';

// 2. Conexión
$database = new Database();
$db = $database->getConnection();

// 3. Consulta SQL
// Usamos LEFT JOIN para traer el "nombreMarca" en lugar de solo el número ID
$query = "SELECT p.*, m.nombreMarca 
          FROM perfumes p 
          LEFT JOIN marcas m ON p.idMarca = m.idMarca 
          ORDER BY p.idPerfume DESC";

try {
    $stmt = $db->prepare($query);
    $stmt->execute();
    $num = $stmt->rowCount();

    // 4. Verificar si hay resultados
    if($num > 0) {
        $perfumes_arr = array();
        // "records" será la lista que recibirá React
        $perfumes_arr["records"] = array();

        while ($row = $stmt->fetch(PDO::FETCH_ASSOC)) {
            // extract($row) permite usar $nombreColumna en vez de $row['nombreColumna']
            extract($row);

            $perfume_item = array(
                "idPerfume" => $idPerfume,
                "nombrePerfume" => $nombrePerfume,
                "nombreMarca" => $nombreMarca, // Dato útil para mostrar en la lista
                "idMarca" => $idMarca,
                "mililitrosTotales" => $mililitrosTotales,
                "cantidadStock" => $cantidadStock,
                "costoAdquisicion" => $costoAdquisicion,
                "precioVentaBotella" => $precioVentaBotella,
                "usoParaDecants" => (bool)$usoParaDecants, // Convertimos a true/false real
                "esCompartido" => (bool)$esCompartido,
                "rutaImagen" => $rutaImagen
            );

            array_push($perfumes_arr["records"], $perfume_item);
        }

        // Respuesta OK (200)
        http_response_code(200);
        echo json_encode($perfumes_arr);

    } else {
        // No se encontraron datos (404)
        http_response_code(404);
        echo json_encode(array("mensaje" => "No se encontraron perfumes."));
    }
} catch (PDOException $e) {
    http_response_code(503);
    echo json_encode(array("error" => $e->getMessage()));
}
?>