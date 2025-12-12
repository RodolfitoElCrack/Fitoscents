<?php
// 1. Incluimos las configuraciones previas
include_once '../database/cors.php';     
include_once '../database/database.php';

// 2. Conectamos a la base de datos
$database = new Database();
$db = $database->getConnection();

// 3. Obtenemos los datos que nos envía el Frontend (React)
// React enviará un JSON, así que lo leemos así:
$data = json_decode(file_get_contents("php://input"));

// 4. Verificamos que los datos mínimos existan
if(
    !empty($data->nombrePerfume) &&
    !empty($data->idMarca) &&
    !empty($data->mililitrosTotales) &&
    !empty($data->costoAdquisicion)
) {
    try {
        // 5. Preparamos la consulta SQL (INSERT)
        // Usamos :variable para evitar hackeos (SQL Injection)
        $query = "INSERT INTO perfumes 
                  (nombrePerfume, idMarca, mililitrosTotales, cantidadStock, costoAdquisicion, precioReferencia, precioVentaBotella, usoParaDecants, esCompartido, idSocioDuenio) 
                  VALUES 
                  (:nombrePerfume, :idMarca, :mililitrosTotales, :cantidadStock, :costoAdquisicion, :precioReferencia, :precioVentaBotella, :usoParaDecants, :esCompartido, :idSocioDuenio)";

        $stmt = $db->prepare($query);

        // 6. Asignamos los valores (Binding)
        // htmlspecialchars y strip_tags limpian el texto de código malicioso
        $stmt->bindParam(":nombrePerfume", htmlspecialchars(strip_tags($data->nombrePerfume)));
        $stmt->bindParam(":idMarca", $data->idMarca);
        $stmt->bindParam(":mililitrosTotales", $data->mililitrosTotales);
        $stmt->bindParam(":cantidadStock", $data->cantidadStock);
        $stmt->bindParam(":costoAdquisicion", $data->costoAdquisicion);
        $stmt->bindParam(":precioReferencia", $data->precioReferencia);
        $stmt->bindParam(":precioVentaBotella", $data->precioVentaBotella);
        
        // Convertimos booleanos a 1 o 0 para MySQL
        $usoParaDecants = $data->usoParaDecants ? 1 : 0;
        $esCompartido = $data->esCompartido ? 1 : 0;
        
        $stmt->bindParam(":usoParaDecants", $usoParaDecants);
        $stmt->bindParam(":esCompartido", $esCompartido);
        $stmt->bindParam(":idSocioDuenio", $data->idSocioDuenio);

        // 7. Ejecutamos la consulta
        if($stmt->execute()) {
            // Respuesta Éxitosa (Código 201: Creado)
            http_response_code(201);
            echo json_encode(array("mensaje" => "Perfume guardado correctamente."));
        } else {
            // Error en la ejecución
            http_response_code(503);
            echo json_encode(array("mensaje" => "No se pudo guardar el perfume."));
        }

    } catch (PDOException $e) {
        http_response_code(503);
        echo json_encode(array("error" => $e->getMessage()));
    }

} else {
    // 8. Si faltan datos obligatorios
    http_response_code(400); // Bad Request
    echo json_encode(array("mensaje" => "Faltan datos obligatorios."));
}
?>