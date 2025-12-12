import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { inventarioService } from '../services/api';

const Insumos = () => {
    const navigate = useNavigate();
    const [insumos, setInsumos] = useState([]);
    
    // Formulario pequeño
    const [form, setForm] = useState({
        nombreInsumo: '',
        capacidadMl: 5, // Valor por defecto común
        cantidadStock: 0,
        costoUnitario: ''
    });

    const cargarInsumos = async () => {
        const data = await inventarioService.obtenerInsumos();
        if(data.records) setInsumos(data.records);
    };

    useEffect(() => {
        cargarInsumos();
    }, []);

    const handleChange = (e) => {
        setForm({ ...form, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            await inventarioService.guardarInsumo(form);
            alert("✅ Insumo guardado");
            cargarInsumos(); // Recargar tabla
            setForm({ ...form, nombreInsumo: '', cantidadStock: 0, costoUnitario: '' }); // Limpiar campos
        } catch (error) {
            alert("Error al guardar insumo");
        }
    };

    return (
        <div style={{ padding: '20px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <h1>🧪 Botellas e Insumos</h1>
                <button onClick={() => navigate('/')} style={{ background: '#444' }}>⬅ Volver al Inventario</button>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 2fr', gap: '30px', marginTop: '20px' }}>
                
                {/* 1. FORMULARIO DE REGISTRO RAPIDO */}
                <div style={{ background: '#2a2a2a', padding: '20px', borderRadius: '10px', height: 'fit-content' }}>
                    <h3>Nuevo Insumo</h3>
                    <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '10px', textAlign: 'left' }}>
                        
                        <label>Nombre (ej: Botella Vidrio 5ml):</label>
                        <input type="text" name="nombreInsumo" required value={form.nombreInsumo} onChange={handleChange} style={{ padding: '8px' }} />

                        <label>Capacidad (ml):</label>
                        <select name="capacidadMl" value={form.capacidadMl} onChange={handleChange} style={{ padding: '8px' }}>
                            <option value="3">3 ml</option>
                            <option value="5">5 ml</option>
                            <option value="10">10 ml</option>
                            <option value="30">30 ml</option>
                        </select>

                        <div style={{ display: 'flex', gap: '10px' }}>
                            <div style={{ flex: 1 }}>
                                <label>Stock Inicial:</label>
                                <input type="number" name="cantidadStock" required value={form.cantidadStock} onChange={handleChange} style={{ width: '100%', padding: '8px' }} />
                            </div>
                            <div style={{ flex: 1 }}>
                                <label>Costo c/u ($):</label>
                                <input type="number" name="costoUnitario" required value={form.costoUnitario} onChange={handleChange} style={{ width: '100%', padding: '8px' }} />
                            </div>
                        </div>

                        <button type="submit" style={{ marginTop: '10px', background: '#28a745' }}>+ Guardar Botellas</button>
                    </form>
                </div>

                {/* 2. TABLA DE INSUMOS */}
                <div>
                    {insumos.length === 0 ? (
                        <p>No tienes botellas registradas.</p>
                    ) : (
                        <table border="1" style={{ width: '100%', borderCollapse: 'collapse' }}>
                            <thead>
                                <tr style={{ background: '#333', color: 'white' }}>
                                    <th style={{ padding: '10px' }}>Insumo</th>
                                    <th>Capacidad</th>
                                    <th>Stock</th>
                                    <th>Costo Unit.</th>
                                </tr>
                            </thead>
                            <tbody>
                                {insumos.map((item) => (
                                    <tr key={item.idInsumo}>
                                        <td style={{ padding: '8px' }}>{item.nombreInsumo}</td>
                                        <td>{item.capacidadMl} ml</td>
                                        <td style={{ padding: '8px', color: item.cantidadStock < 10 ? 'orange' : 'white' }}>
                                            {item.cantidadStock} pzas
                                        </td>
                                        <td>${item.costoUnitario}</td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    )}
                </div>

            </div>
        </div>
    );
};

export default Insumos;