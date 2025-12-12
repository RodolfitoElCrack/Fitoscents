import { useState, useEffect } from 'react';
import { inventarioService } from '../services/api';
import { useNavigate } from 'react-router-dom';

const Inventory = () => {
    const [perfumes, setPerfumes] = useState([]);
    const [cargando, setCargando] = useState(true);
    const [busqueda, setBusqueda] = useState(""); // Variable para lo que escribes en el buscador

    const navigate = useNavigate();

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

    useEffect(() => {
        cargarPerfumes();
    }, []);

    // Función para filtrar (Buscador)
    // Convierte todo a minúsculas para que encuentre "dior" aunque escribas "Dior"
    const perfumesFiltrados = perfumes.filter((perfume) => {
        const textoBusqueda = busqueda.toLowerCase();
        return (
            perfume.nombrePerfume.toLowerCase().includes(textoBusqueda) ||
            perfume.nombreMarca.toLowerCase().includes(textoBusqueda)
        );
    });

    return (
        <div className="inventory-page">
            <h1>📦 Mi Inventario</h1>
            
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '20px' }}>
                {/* Botón Nuevo */}
                <button 
                    onClick={() => navigate('/nuevo-perfume')} 
                    style={{ padding: '10px 20px', cursor: 'pointer', backgroundColor: '#646cff', color: 'white', border: 'none', borderRadius: '5px' }}
                >
                    + Nuevo Perfume
                </button>

                {/* --- AGREGA ESTE BOTÓN --- */}
                <button 
                    onClick={() => navigate('/insumos')} 
                    style={{ 
                        marginLeft: '10px',
                        padding: '10px 20px', 
                        cursor: 'pointer', 
                        backgroundColor: '#ff9800', // Color naranja para distinguir
                        color: 'white', 
                        border: 'none', 
                        borderRadius: '5px' 
                    }}
                >
                    🧪 Ver Botellas / Insumos
                </button>

                {/* Botón para IR A VENDER */}
                <button 
                    onClick={() => navigate('/vender')} 
                    style={{ 
                        marginLeft: '10px',
                        padding: '10px 20px', 
                        cursor: 'pointer', 
                        backgroundColor: '#28a745', // Verde dinero
                        color: 'white', 
                        border: 'none', 
                        borderRadius: '5px',
                        fontWeight: 'bold'
                    }}
                >
                    💰 PUNTO DE VENTA
                </button>

                {/* Buscador */}
                <input 
                    type="text" 
                    placeholder="🔍 Buscar perfume o marca..." 
                    value={busqueda}
                    onChange={(e) => setBusqueda(e.target.value)}
                    style={{ 
                        padding: '10px', 
                        width: '300px', 
                        borderRadius: '5px', 
                        border: '1px solid #ccc' 
                    }}
                />
            </div>

            {cargando ? (
                <p>Cargando datos...</p>
            ) : (
                <div className="table-container">
                    {perfumesFiltrados.length === 0 ? (
                        <p>No se encontraron perfumes.</p>
                    ) : (
                        <table border="1" style={{ width: '100%', borderCollapse: 'collapse', marginTop: '10px' }}>
                            <thead>
                                <tr style={{ background: '#333', color: 'white' }}>
                                    <th style={{ padding: '10px' }}>Nombre</th>
                                    <th style={{ padding: '10px' }}>Marca</th>
                                    <th style={{ padding: '10px' }}>Stock</th>
                                    <th style={{ padding: '10px' }}>Precio</th>
                                    <th style={{ padding: '10px' }}>Tipo</th>
                                </tr>
                            </thead>
                            <tbody>
                                {perfumesFiltrados.map((perfume) => (
                                    <tr key={perfume.idPerfume}>
                                        <td style={{ padding: '8px' }}>{perfume.nombrePerfume}</td>
                                        <td style={{ padding: '8px' }}>{perfume.nombreMarca}</td>
                                        <td style={{ padding: '8px' }}>{perfume.cantidadStock}</td>
                                        <td style={{ padding: '8px' }}>${perfume.precioVentaBotella}</td>
                                        <td style={{ padding: '8px' }}>
                                            {perfume.usoParaDecants 
                                                ? "🧪 Decants" 
                                                : "🍾 Botella"}
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