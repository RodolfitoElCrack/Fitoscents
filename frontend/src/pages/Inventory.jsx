import { useState, useEffect } from 'react';
import { inventarioService } from '../services/api';

const Inventory = () => {
    // 1. Estados (Variables) para guardar los datos
    const [perfumes, setPerfumes] = useState([]);
    const [cargando, setCargando] = useState(true);

    // 2. Función para cargar los datos del backend
    const cargarPerfumes = async () => {
        try {
            const data = await inventarioService.obtenerPerfumes();
            if (data.records) {
                setPerfumes(data.records);
            }
        } catch (error) {
            console.error("Error cargando inventario:", error);
        } finally {
            setCargando(false);
        }
    };

    // 3. useEffect: Se ejecuta una vez cuando carga la página
    useEffect(() => {
        cargarPerfumes();
    }, []);

    return (
        <div className="inventory-page">
            <h1>📦 Mi Inventario de Perfumes</h1>
            
            {/* Botón temporal para probar */}
            <button style={{ marginBottom: '20px', padding: '10px' }}>
                + Nuevo Perfume
            </button>

            {cargando ? (
                <p>Cargando datos...</p>
            ) : (
                <div className="table-container">
                    {perfumes.length === 0 ? (
                        <p>No hay perfumes registrados. ¡Agrega uno!</p>
                    ) : (
                        <table border="1" style={{ width: '100%', borderCollapse: 'collapse' }}>
                            <thead>
                                <tr>
                                    <th>Nombre</th>
                                    <th>Marca</th>
                                    <th>Stock</th>
                                    <th>Precio Botella</th>
                                    <th>Tipo</th>
                                </tr>
                            </thead>
                            <tbody>
                                {perfumes.map((perfume) => (
                                    <tr key={perfume.idPerfume}>
                                        <td>{perfume.nombrePerfume}</td>
                                        <td>{perfume.nombreMarca}</td>
                                        <td>{perfume.cantidadStock}</td>
                                        <td>${perfume.precioVentaBotella}</td>
                                        <td>
                                            {perfume.usoParaDecants 
                                                ? "🧪 Decants" 
                                                : "🍾 Botella Cerrada"}
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    )}
                </div>
            )}
        </div>
    );
};

export default Inventory;