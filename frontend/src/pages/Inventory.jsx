import { useState, useEffect } from 'react';
import { inventarioService } from '../services/api';
import { useNavigate } from 'react-router-dom';

const Inventory = () => {
    const [perfumes, setPerfumes] = useState([]);
    const [cargando, setCargando] = useState(true);
    const [busqueda, setBusqueda] = useState(""); 
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

    // Funciones CRUD (Pendientes de conectar al 100% con backend si faltan archivos)
    const handleEliminar = async (id) => {
        if(confirm("⚠ ¿Eliminar perfume?")) {
            try {
                await inventarioService.borrarPerfume(id);
                alert("🗑️ Eliminado");
                cargarPerfumes();
            } catch (error) { alert("Error al eliminar"); }
        }
    };

    const handleEditar = (perfume) => {
        navigate('/editar-perfume', { state: { perfume } });
    };

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
            
            {/* BARRA DE ACCIONES */}
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px', flexWrap: 'wrap', gap: '10px' }}>
                
                {/* GRUPO DE BOTONES (Izquierda) */}
                <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
                    <button 
                        onClick={() => navigate('/nuevo-perfume')} 
                        style={{ padding: '10px 15px', cursor: 'pointer', backgroundColor: '#646cff', color: 'white', border: 'none', borderRadius: '5px' }}
                    >
                        + Nuevo
                    </button>

                    <button 
                        onClick={() => navigate('/vender')} 
                        style={{ padding: '10px 15px', cursor: 'pointer', backgroundColor: '#28a745', color: 'white', border: 'none', borderRadius: '5px' }}
                    >
                        💰 Vender
                    </button>

                    <button 
                        onClick={() => navigate('/insumos')} 
                        style={{ padding: '10px 15px', cursor: 'pointer', backgroundColor: '#ff9800', color: 'white', border: 'none', borderRadius: '5px' }}
                    >
                        🧪 Insumos
                    </button>

                    {/* BOTÓN ROJO DE GASTOS */}
                    <button 
                        onClick={() => navigate('/gastos')} 
                        style={{ padding: '10px 15px', cursor: 'pointer', backgroundColor: '#d32f2f', color: 'white', border: 'none', borderRadius: '5px' }}
                    >
                        📉 Gastos
                    </button>

                    <button 
                        onClick={() => navigate('/clientes')} 
                        style={{ padding: '10px 15px', cursor: 'pointer', backgroundColor: '#9c27b0', color: 'white', border: 'none', borderRadius: '5px' }}
                    >
                        👥 Clientes
                    </button>

                    <button
                        onClick={() => navigate('/finanzas')}
                        style={{ padding: '10px 15px', cursor: 'pointer', backgroundColor: '#ffd700', color: 'black', border: 'none', borderRadius: '5px', fontWeight:'bold' }}
                    >
                        💰 Finanzas
                    </button>

                </div>

                {/* BUSCADOR (Derecha) */}
                <input 
                    type="text" 
                    placeholder="🔍 Buscar perfume..." 
                    value={busqueda}
                    onChange={(e) => setBusqueda(e.target.value)}
                    style={{ 
                        padding: '10px', 
                        width: '250px', 
                        borderRadius: '5px', 
                        border: '1px solid #ccc' 
                    }}
                />
            </div>

            {/* TABLA */}
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
                                    <th style={{ padding: '10px' }}>Acciones</th>
                                </tr>
                            </thead>
                            <tbody>
                                {perfumesFiltrados.map((perfume) => (
                                    <tr key={perfume.idPerfume}>
                                        <td style={{ padding: '8px' }}>{perfume.nombrePerfume}</td>
                                        <td style={{ padding: '8px' }}>{perfume.nombreMarca}</td>
                                        <td style={{ padding: '8px' }}>{perfume.cantidadStock}</td>
                                        <td style={{ padding: '8px' }}>${perfume.precioVentaBotella}</td>
                                        <td style={{ padding: '8px', textAlign: 'center' }}>
                                            <button onClick={() => handleEditar(perfume)} style={{marginRight:'5px', cursor:'pointer', background:'#ff9800', border:'none', borderRadius:'3px', padding:'5px'}}>✏️</button>
                                            <button onClick={() => handleEliminar(perfume.idPerfume)} style={{cursor:'pointer', background:'#f44336', border:'none', borderRadius:'3px', padding:'5px', color:'white'}}>🗑️</button>
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