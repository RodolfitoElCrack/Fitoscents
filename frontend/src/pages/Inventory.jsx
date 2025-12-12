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
            if (data.records) setPerfumes(data.records);
        } catch (error) {
            console.error("Error:", error);
        } finally {
            setCargando(false);
        }
    };

    useEffect(() => {
        cargarPerfumes();
    }, []);

    // 1. Lógica para BORRAR
    const handleEliminar = async (id) => {
        if(confirm("⚠ ¿Estás seguro de ELIMINAR este perfume? Esta acción no se puede deshacer.")) {
            try {
                await inventarioService.borrarPerfume(id);
                alert("🗑️ Perfume eliminado");
                cargarPerfumes(); // Recargar la lista
            } catch (error) {
                alert("Error al eliminar");
            }
        }
    };

    // 2. Lógica para EDITAR (Navegar a la otra página con datos)
    const handleEditar = (perfume) => {
        navigate('/editar-perfume', { state: { perfume } });
    };

    const perfumesFiltrados = perfumes.filter(p => 
        p.nombrePerfume.toLowerCase().includes(busqueda.toLowerCase()) || 
        p.nombreMarca.toLowerCase().includes(busqueda.toLowerCase())
    );

    return (
        <div className="inventory-page">
            <h1>📦 Mi Inventario</h1>
            
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '20px', flexWrap: 'wrap', gap: '10px' }}>
                <div>
                    <button onClick={() => navigate('/nuevo-perfume')} style={{ padding: '10px 20px', backgroundColor: '#646cff', color: 'white', border: 'none', borderRadius: '5px', marginRight: '10px', cursor:'pointer' }}>+ Nuevo Perfume</button>
                    <button onClick={() => navigate('/vender')} style={{ padding: '10px 20px', backgroundColor: '#28a745', color: 'white', border: 'none', borderRadius: '5px', marginRight: '10px', cursor:'pointer' }}>💰 Ir a Vender</button>
                </div>
                <input type="text" placeholder="🔍 Buscar..." value={busqueda} onChange={(e) => setBusqueda(e.target.value)} style={{ padding: '10px', borderRadius: '5px', border: '1px solid #ccc', minWidth: '250px' }} />
            </div>

            {cargando ? <p>Cargando...</p> : (
                <div className="table-container">
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
                                        {/* Botones de Acción */}
                                        <button onClick={() => handleEditar(perfume)} style={{marginRight:'5px', cursor:'pointer', background:'#ff9800', border:'none', borderRadius:'3px', padding:'5px'}}>✏️</button>
                                        <button onClick={() => handleEliminar(perfume.idPerfume)} style={{cursor:'pointer', background:'#f44336', border:'none', borderRadius:'3px', padding:'5px', color:'white'}}>🗑️</button>
                                        <button onClick={() => navigate('/clientes')} style={{ background: '#9c27b0', color: 'white', padding: '10px 20px', border: 'none', borderRadius: '5px', marginLeft: '10px', cursor:'pointer' }}>👥 Clientes</button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            )}
        </div>
    );
};

export default Inventory;