<?php
include_once '../config/cors.php';
include_once '../config/database.php';

$database = new Database();
$db = $database->getConnection();

$data = json_decode(file_get_contents("php://input"));

if(empty($data->items) || empty($data->totalVenta)) {
    http_response_code(400);
    echo json_encode(array("mensaje" => "Faltan datos de la venta."));
    exit;
}

try {
    $db->beginTransaction();

    // 1. Crear la Cabecera de la Venta
    $queryVenta = "INSERT INTO ventas (idCliente, totalVenta, estadoPago) VALUES (:idCliente, :totalVenta, 'Pagado')";
    $stmtVenta = $db->prepare($queryVenta);
    $idCliente = isset($data->idCliente) ? $data->idCliente : null;
    $stmtVenta->bindParam(":idCliente", $idCliente);
    $stmtVenta->bindParam(":totalVenta", $data->totalVenta);
    
    if(!$stmtVenta->execute()) throw new Exception("Error al crear ticket.");
    $idVenta = $db->lastInsertId();

    // 2. Procesar cada producto
    foreach($data->items as $item) {
        
        // A) OBTENER DATOS REALES DEL PERFUME (Costo y Dueño)
        // Consultamos la BD directo para no confiar solo en lo que envía el frontend
        $qProd = "SELECT costoAdquisicion, mililitrosTotales, esCompartido, idSocioDuenio FROM perfumes WHERE idPerfume = :id";
        $stmtProd = $db->prepare($qProd);
        $stmtProd->bindParam(":id", $item->idPerfume);
        $stmtProd->execute();
        $productoDB = $stmtProd->fetch(PDO::FETCH_ASSOC);

        if(!$productoDB) throw new Exception("El perfume ID " . $item->idPerfume . " no existe.");

        // B) CÁLCULOS MATEMÁTICOS
        $precioVenta = $item->precioVenta;
        $esDecant = $item->esDecant ? 1 : 0;
        
        // 1. Costo Proporcional (Lo que costó el líquido vendido)
        if ($esDecant) {
            // Regla de tres: (CostoBotella / MlTotales) * MlVendidos
            $costoReal = ($productoDB['costoAdquisicion'] / $productoDB['mililitrosTotales']) * $item->capacidadMl;
            // Sumar costo del insumo (botellita vacía) si aplica
            // $costoReal += $costoInsumo... (Esto lo refinamos luego para decants)
        } else {
            // Botella cerrada: El costo es tal cual lo que costó comprarla
            $costoReal = $productoDB['costoAdquisicion'];
        }

        // 2. Ganancia Neta (Utilidad pura)
        $gananciaNeta = $precioVenta - $costoReal;

        // 3. REPARTO DE DINERO (Lógica de Socios)
        $ingresoVendedor = 0; // Para ti
        $ingresoSocio = 0;    // Para el socio

        if ($productoDB['esCompartido'] == 1) {
            // CASO MIXTO (50/50)
            $ingresoVendedor = $gananciaNeta / 2;
            $ingresoSocio = $gananciaNeta / 2;

        } elseif (!empty($productoDB['idSocioDuenio'])) {
            // CASO ES DEL SOCIO
            // Aquí entra tu regla manual: Tú cobras comisión, él se lleva el resto.
            // El frontend debe enviar "montoComision" si tú decidiste cobrar algo.
            $comision = isset($item->montoComision) ? floatval($item->montoComision) : 0;
            
            $ingresoVendedor = $comision;
            $ingresoSocio = $gananciaNeta - $comision;

        } else {
            // CASO ES 100% TUYO
            $ingresoVendedor = $gananciaNeta;
            $ingresoSocio = 0;
        }

        // C) INSERTAR DETALLE CON DESGLOSE FINANCIERO
        $queryDetalle = "INSERT INTO detalleVentas 
            (idVenta, idPerfume, esDecant, idInsumoBotella, mililitrosVendidos, precioFinalVenta, costoProporcional, gananciaNeta, ingresoVendedor, ingresoSocio) 
            VALUES 
            (:idVenta, :idPerfume, :esDecant, :idInsumoBotella, :mlVendidos, :precioFinal, :costo, :ganancia, :ingresoYo, :ingresoEl)";
        
        $stmtDetalle = $db->prepare($queryDetalle);
        $stmtDetalle->bindParam(":idVenta", $idVenta);
        $stmtDetalle->bindParam(":idPerfume", $item->idPerfume);
        $stmtDetalle->bindParam(":esDecant", $esDecant);
        
        $idInsumo = $item->esDecant ? $item->idInsumo : null;
        $mlVendidos = $item->esDecant ? $item->capacidadMl : 0;
        
        $stmtDetalle->bindParam(":idInsumoBotella", $idInsumo);
        $stmtDetalle->bindParam(":mlVendidos", $mlVendidos);
        $stmtDetalle->bindParam(":precioFinal", $precioVenta);
        $stmtDetalle->bindParam(":costo", $costoReal);
        $stmtDetalle->bindParam(":ganancia", $gananciaNeta);
        $stmtDetalle->bindParam(":ingresoYo", $ingresoVendedor);
        $stmtDetalle->bindParam(":ingresoEl", $ingresoSocio);
        
        if(!$stmtDetalle->execute()) throw new Exception("Error al registrar producto.");

        // D) DESCONTAR INVENTARIO (Tu lógica original)
        if ($esDecant) {
            $qUpd = "UPDATE perfumes SET mililitrosTotales = mililitrosTotales - :ml WHERE idPerfume = :id";
            $stmtUpd = $db->prepare($qUpd);
            $stmtUpd->bindParam(":ml", $mlVendidos);
            $stmtUpd->bindParam(":id", $item->idPerfume);
            $stmtUpd->execute();

            if($idInsumo) {
                $qIns = "UPDATE insumosDecants SET cantidadStock = cantidadStock - 1 WHERE idInsumo = :idIns";
                $stmtIns = $db->prepare($qIns);
                $stmtIns->bindParam(":idIns", $idInsumo);
                $stmtIns->execute();
            }
        } else {
            // Botella cerrada: Restar 1 unidad
            $qUpd = "UPDATE perfumes SET cantidadStock = cantidadStock - 1 WHERE idPerfume = :id";
            $stmtUpd = $db->prepare($qUpd);
            $stmtUpd->bindParam(":id", $item->idPerfume);
            $stmtUpd->execute();
        }
    }

    $db->commit();
    http_response_code(201);
    echo json_encode(array("mensaje" => "Venta registrada. Finanzas calculadas."));

} catch (Exception $e) {
    $db->rollBack();
    http_response_code(503);
    echo json_encode(array("error" => $e->getMessage()));
}
?>