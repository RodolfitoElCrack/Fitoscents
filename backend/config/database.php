<?php
class Database {
    // Credenciales de XAMPP (por defecto)
    private $host = "localhost";
    private $db_name = "perfumes_db"; // Asegúrate de que creaste la BD con este nombre
    private $username = "root";
    private $password = ""; // En XAMPP suele venir vacía
    public $conn;

    // Método para obtener la conexión
    public function getConnection() {
        $this->conn = null;

        try {
            // Intentamos conectar
            $this->conn = new PDO("mysql:host=" . $this->host . ";dbname=" . $this->db_name, $this->username, $this->password);
            
            // Configuración para que reconozca ñ y acentos (UTF-8)
            $this->conn->exec("set names utf8");
            
            // Configuración para que nos avise si hay errores SQL
            $this->conn->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);
            
        } catch(PDOException $exception) {
            // Si falla, muestra el error
            echo "Error de conexión: " . $exception->getMessage();
        }

        return $this->conn;
    }
}
?>