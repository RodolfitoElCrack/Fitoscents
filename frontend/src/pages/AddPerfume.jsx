import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { inventarioService } from '../services/api';

const AddPerfume = () => {
    const navigate = useNavigate();
    
    // 1. Estados para los datos del perfume
    const [marcas, setMarcas] = useState([]);
    const [formData, setFormData] = useState({
        nombrePerfume: '',
        idMarca: '',
        mililitrosTotales: 100,
        cantidadStock: 1,
        costoAdquisicion: '',
        precioReferencia: '',
        precioVentaBotella: '',
        usoParaDecants: false,
        esCompartido: false,
        idSocioDuenio: null
    });

    // 2. Estados para la "Nueva Marca Rápida" (El botón verde)
    const [modoNuevaMarca, setModoNuevaMarca] = useState(false);
    const [nombreNuevaMarca, setNombreNuevaMarca] = useState("");

    // Cargar marcas al inicio
    const cargarMarcas = async () => {
        const data = await inventarioService.obtenerMarcas();
        if(data.records) setMarcas(data.records);
    };

    useEffect(() => {
        cargarMarcas();
    }, []);

    // Manejo de inputs normales
    const handleChange = (e) => {
        const { name, value, type, checked } = e.target;
        setFormData({
            ...formData,
            [name]: type === 'checkbox' ? checked : value
        });
    };

    // 3. Lógica para guardar la MARCA nueva sin salir de la pantalla
    const handleGuardarMarca = async () => {
        if(!nombreNuevaMarca.trim()) return alert("Escribe un nombre para la marca");

        try {
            await inventarioService.guardarMarca(nombreNuevaMarca);
            await cargarMarcas(); // Recargamos la lista para que aparezca la nueva
            setModoNuevaMarca(false); // Cerramos el input de marca
            setNombreNuevaMarca(""); // Limpiamos
            alert("✅ Marca creada exitosamente");
        } catch (error) {
            console.error(error);
            alert("❌ Error al crear la marca");
        }
    };

    // 4. Guardar el PERFUME
    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            await inventarioService.guardarPerfume(formData);
            alert('✅ ¡Perfume guardado con éxito!');
            navigate('/'); // Regresa al inventario
        } catch (error) {
            alert('❌ Error al guardar. Revisa los datos.');
        }
    };

    return (
        <div className="form-page" style={{ maxWidth: '600px', margin: '0 auto', paddingBottom: '50px' }}>
            <h1>✨ Registrar Nuevo Perfume</h1>
            
            <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '15px', textAlign: 'left' }}>
                
                {/* Nombre */}
                <div className="form-group">
                    <label>Nombre del Perfume:</label>
                    <input 
                        type="text" name="nombrePerfume" required 
                        value={formData.nombrePerfume} onChange={handleChange}
                        style={{ width: '100%', padding: '8px', boxSizing: 'border-box' }}
                    />
                </div>

                {/* --- SECCIÓN DE MARCAS CON BOTÓN VERDE --- */}
                <div className="form-group" style={{ background: '#2a2a2a', padding: '10px', borderRadius: '8px', border: '1px solid #444' }}>
                    <label style={{display: 'block', marginBottom: '5px'}}>Marca:</label>
                    
                    {!modoNuevaMarca ? (
                        // MODO SELECCIÓN
                        <div style={{ display: 'flex', gap: '10px' }}>
                            <select 
                                name="idMarca" required 
                                value={formData.idMarca} onChange={handleChange}
                                style={{ flex: 1, padding: '8px' }}
                            >
                                <option value="">-- Selecciona una Marca --</option>
                                {marcas.map(marca => (
                                    <option key={marca.idMarca} value={marca.idMarca}>
                                        {marca.nombreMarca}
                                    </option>
                                ))}
                            </select>
                            <button 
                                type="button" 
                                onClick={() => setModoNuevaMarca(true)}
                                style={{ background: '#28a745', color: 'white', border: 'none', padding: '0 15px', cursor: 'pointer', borderRadius: '4px', fontWeight: 'bold' }}
                            >
                                + Nueva
                            </button>
                        </div>
                    ) : (
                        // MODO CREACIÓN RÁPIDA
                        <div style={{ display: 'flex', gap: '10px' }}>
                            <input 
                                type="text" 
                                placeholder="Ej: Armaf..."
                                value={nombreNuevaMarca}
                                onChange={(e) => setNombreNuevaMarca(e.target.value)}
                                style={{ flex: 1, padding: '8px' }}
                                autoFocus
                            />
                            <button 
                                type="button" 
                                onClick={handleGuardarMarca}
                                style={{ background: '#007bff', color: 'white', border: 'none', padding: '0 15px', cursor: 'pointer', borderRadius: '4px' }}
                            >
                                Guardar
                            </button>
                            <button 
                                type="button" 
                                onClick={() => setModoNuevaMarca(false)}
                                style={{ background: '#666', color: 'white', border: 'none', padding: '0 15px', cursor: 'pointer', borderRadius: '4px' }}
                            >
                                ❌
                            </button>
                        </div>
                    )}
                </div>

                {/* Detalles Técnicos */}
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px' }}>
                    <div>
                        <label>Mililitros (Botella):</label>
                        <input type="number" name="mililitrosTotales" value={formData.mililitrosTotales} onChange={handleChange} style={{ width: '100%', boxSizing: 'border-box', padding: '8px' }} />
                    </div>
                    <div>
                        <label>Stock (Cantidad):</label>
                        <input type="number" name="cantidadStock" value={formData.cantidadStock} onChange={handleChange} style={{ width: '100%', boxSizing: 'border-box', padding: '8px' }} />
                    </div>
                </div>

                {/* Precios */}
                <h3>💰 Costos y Precios</h3>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '10px' }}>
                    <div>
                        <label>Costo ($):</label>
                        <input type="number" name="costoAdquisicion" required onChange={handleChange} style={{ width: '100%', boxSizing: 'border-box', padding: '8px' }} />
                    </div>
                    <div>
                        <label>Liverpool ($):</label>
                        <input type="number" name="precioReferencia" onChange={handleChange} style={{ width: '100%', boxSizing: 'border-box', padding: '8px' }} />
                    </div>
                    <div>
                        <label>Venta ($):</label>
                        <input type="number" name="precioVentaBotella" required onChange={handleChange} style={{ width: '100%', boxSizing: 'border-box', padding: '8px' }} />
                    </div>
                </div>

                {/* Opciones Extra */}
                <div style={{ background: '#333', padding: '15px', borderRadius: '5px' }}>
                    <label style={{ marginRight: '20px', display: 'inline-flex', alignItems: 'center', cursor: 'pointer' }}>
                        <input type="checkbox" name="usoParaDecants" checked={formData.usoParaDecants} onChange={handleChange} style={{ marginRight: '8px' }} />
                        🧪 Es para Decants
                    </label>

                    <label style={{ display: 'inline-flex', alignItems: 'center', cursor: 'pointer' }}>
                        <input type="checkbox" name="esCompartido" checked={formData.esCompartido} onChange={handleChange} style={{ marginRight: '8px' }} />
                        🤝 Es Compartido (50/50)
                    </label>
                </div>

                {/* Botones Finales */}
                <div style={{ marginTop: '20px', display: 'flex', gap: '10px' }}>
                    <button type="submit" style={{ flex: 1, background: '#646cff', color: 'white', padding: '12px', border: 'none', borderRadius: '5px', cursor: 'pointer', fontSize: '16px' }}>
                        💾 Guardar Perfume
                    </button>
                    <button type="button" onClick={() => navigate('/')} style={{ background: '#444', color: 'white', padding: '12px', border: 'none', borderRadius: '5px', cursor: 'pointer' }}>
                        Cancelar
                    </button>
                </div>

            </form>
        </div>
    );
};

export default AddPerfume;