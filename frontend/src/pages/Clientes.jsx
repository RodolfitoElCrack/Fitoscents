import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { inventarioService } from '../services/api';

const Clientes = () => {
    const navigate = useNavigate();
    const [clientes, setClientes] = useState([]);
    const [form, setForm] = useState({ nombreCliente: '', telefono: '', redSocialLink: '' });

    const cargarClientes = async () => {
        const data = await inventarioService.obtenerClientes();
        if(data.records) setClientes(data.records);
    };

    useEffect(() => {
        cargarClientes();
    }, []);

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            await inventarioService.guardarCliente(form);
            alert("✅ Cliente registrado");
            setForm({ nombreCliente: '', telefono: '', redSocialLink: '' });
            cargarClientes();
        } catch (error) {
            alert("Error al guardar cliente");
        }
    };

    return (
        <div style={{ padding: '20px', maxWidth: '800px', margin: '0 auto' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <h1>👥 Mis Clientes</h1>
                <button onClick={() => navigate('/')} style={{ background: '#444', padding: '10px' }}>⬅ Inicio</button>
            </div>

            {/* FORMULARIO */}
            <div style={{ background: '#2a2a2a', padding: '20px', borderRadius: '10px', marginBottom: '20px' }}>
                <h3>Nuevo Cliente</h3>
                <form onSubmit={handleSubmit} style={{ display: 'flex', gap: '10px', flexWrap: 'wrap' }}>
                    <input 
                        type="text" placeholder="Nombre Completo" required 
                        value={form.nombreCliente} 
                        onChange={e => setForm({...form, nombreCliente: e.target.value})}
                        style={{ flex: 2, padding: '10px' }}
                    />
                    <input 
                        type="text" placeholder="Teléfono" 
                        value={form.telefono} 
                        onChange={e => setForm({...form, telefono: e.target.value})}
                        style={{ flex: 1, padding: '10px' }}
                    />
                    <input 
                        type="text" placeholder="Link Perfil / Red Social" 
                        value={form.redSocialLink} 
                        onChange={e => setForm({...form, redSocialLink: e.target.value})}
                        style={{ flex: 1, padding: '10px' }}
                    />
                    <button type="submit" style={{ background: '#28a745', padding: '10px 20px' }}>Guardar</button>
                </form>
            </div>

            {/* TABLA */}
            <table border="1" style={{ width: '100%', borderCollapse: 'collapse' }}>
                <thead>
                    <tr style={{ background: '#333' }}>
                        <th style={{ padding: '10px' }}>Nombre</th>
                        <th>Contacto</th>
                        <th>Link</th>
                        <th>Compras</th>
                    </tr>
                </thead>
                <tbody>
                    {clientes.map(c => (
                        <tr key={c.idCliente}>
                            <td style={{ padding: '10px' }}>{c.nombreCliente}</td>
                            <td>{c.telefono || '-'}</td>
                            <td>
                                {c.redSocialLink ? 
                                    <a href={c.redSocialLink} target="_blank" rel="noreferrer" style={{color:'#646cff'}}>Ver Perfil</a> 
                                : '-'}
                            </td>
                            <td>{c.puntosAcumulados}</td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
};

export default Clientes;