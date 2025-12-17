<?php
include_once '../config/cors.php';
include_once '../config/database.php';

$database = new Database();
$db = $database->getConnection();

$response = array();

try {
    // 1. Total de Ventas (Solo las pagadas o todas, depende de ti. Aquí sumamos todo lo vendido)
    $qVentas = "SELECT SUM(totalVenta) as total FROM ventas WHERE estadoPago = 'Pagado'";
    $stmt = $db->prepare($qVentas);
    $stmt->execute();
    $row = $stmt->fetch(PDO::FETCH_ASSOC);
    $response['totalVentas'] = $row['total'] ? $row['total'] : 0;

    // 2. Total de Gastos
    $qGastos = "SELECT SUM(monto) as total FROM gastos";
    $stmt = $db->prepare($qGastos);
    $stmt->execute();
    $row = $stmt->fetch(PDO::FETCH_ASSOC);
    $response['totalGastos'] = $row['total'] ? $row['total'] : 0;

    // 3. Utilidad Bruta (Ventas - Gastos)
    $response['utilidadBruta'] = $response['totalVentas'] - $response['totalGastos'];

    // 4. CÁLCULO DE DEUDA AL SOCIO
    // A) Cuánto ha generado el socio en ventas (acumulado histórico)
    $qGeneradoSocio = "SELECT SUM(ingresoSocio) as total FROM detalleventas";
    $stmt = $db->prepare($qGeneradoSocio);
    $stmt->execute();
    $row = $stmt->fetch(PDO::FETCH_ASSOC);
    $generadoSocio = $row['total'] ? $row['total'] : 0;

    // B) Cuánto ya le has pagado (Liquidaciones)
    $qPagadoSocio = "SELECT SUM(montoPagado) as total FROM liquidacionessocios";
    $stmt = $db->prepare($qPagadoSocio);
    $stmt->execute();
    $row = $stmt->fetch(PDO::FETCH_ASSOC);
    $pagadoSocio = $row['total'] ? $row['total'] : 0;

    // C) Deuda Actual = Lo que generó - Lo que ya se le pagó
    $response['deudaSocio'] = $generadoSocio - $pagadoSocio;

    http_response_code(200);
    echo json_encode($response);

} catch (PDOException $e) {
    http_response_code(503);
    echo json_encode(array("error" => $e->getMessage()));
}
?>