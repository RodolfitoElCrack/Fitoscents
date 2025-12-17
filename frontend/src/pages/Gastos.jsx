import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { inventarioService } from '../services/api';

const Gastos = () => {
    const navigate = useNavigate();
    const [gastos, setGastos] = useState([]);
    const [form, setForm] = useState({ descripcion: '', monto: '', esGastoCompartido: false });

    const cargarGastos = async () => {
        const data = await inventarioService.obtenerGastos();
        if(data.records) setGastos(data.records);
    };

    useEffect(() => { cargarGastos(); }, []);

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            await inventarioService.guardarGasto(form);
            alert("💸 Gasto registrado");
            setForm({ descripcion: '', monto: '', esGastoCompartido: false });
            cargarGastos();
        } catch (error) { alert("Error al registrar"); }
    };

    return (
        <div style={{ padding: '20px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '20px' }}>
                <h1>📉 Gastos Operativos</h1>
                <button onClick={() => navigate('/')} style={{ background: '#444' }}>⬅ Inicio</button>
            </div>

            {/* FORMULARIO */}
            <div style={{ background: '#222', padding: '20px', borderRadius: '10px', marginBottom: '20px' }}>
                <h3>Registrar Salida de Dinero</h3>
                <form onSubmit={handleSubmit} style={{ display: 'flex', gap: '10px', alignItems: 'center', flexWrap: 'wrap' }}>
                    <input 
                        type="text" placeholder="Descripción (ej: Envíos, Cajas...)" required 
                        value={form.descripcion} 
                        onChange={e => setForm({...form, descripcion: e.target.value})}
                        style={{ flex: 2, padding: '10px' }}
                    />
                    <div style={{ position: 'relative' }}>
                        <span style={{ position: 'absolute', left: '10px', top: '10px' }}>$</span>
                        <input 
                            type="number" placeholder="Monto" required 
                            value={form.monto} 
                            onChange={e => setForm({...form, monto: e.target.value})}
                            style={{ width: '100px', padding: '10px 10px 10px 25px' }}
                        />
                    </div>
                    
                    <label style={{ display: 'flex', alignItems: 'center', cursor: 'pointer', background: '#333', padding: '10px', borderRadius: '5px' }}>
                        <input 
                            type="checkbox" 
                            checked={form.esGastoCompartido} 
                            onChange={e => setForm({...form, esGastoCompartido: e.target.checked})}
                            style={{ marginRight: '10px' }}
                        />
                        🤝 ¿Es Gasto Compartido?
                    </label>

                    <button type="submit" style={{ background: '#d32f2f', padding: '10px 20px' }}>Registrar</button>
                </form>
            </div>

            {/* TABLA */}
            <table border="1" style={{ width: '100%', borderCollapse: 'collapse' }}>
                <thead>
                    <tr style={{ background: '#333' }}>
                        <th style={{ padding: '10px' }}>Fecha</th>
                        <th>Descripción</th>
                        <th>Tipo</th>
                        <th>Monto</th>
                    </tr>
                </thead>
                <tbody>
                    {gastos.map(g => (
                        <tr key={g.idGasto}>
                            <td style={{ padding: '10px' }}>{new Date(g.fechaGasto).toLocaleDateString()}</td>
                            <td>{g.descripcion}</td>
                            <td style={{ textAlign: 'center' }}>
                                {g.esGastoCompartido == 1 
                                    ? <span style={{ background: '#ff9800', color: 'black', padding: '2px 8px', borderRadius: '10px', fontSize: '0.8em' }}>Compartido</span>
                                    : <span style={{ background: '#444', padding: '2px 8px', borderRadius: '10px', fontSize: '0.8em' }}>Operativo</span>
                                }
                            </td>
                            <td style={{ color: '#ff5252', fontWeight: 'bold' }}>-${g.monto}</td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
};

export default Gastos;