import { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom'; // useLocation para recibir datos
import { inventarioService } from '../services/api';

const EditPerfume = () => {
    const navigate = useNavigate();
    const location = useLocation();
    const perfumeAEditar = location.state?.perfume; // Recibimos el perfume desde el inventario

    const [marcas, setMarcas] = useState([]);
    const [formData, setFormData] = useState({
        idPerfume: '',
        nombrePerfume: '',
        idMarca: '',
        mililitrosTotales: 100,
        cantidadStock: 1,
        costoAdquisicion: '',
        precioReferencia: '',
        precioVentaBotella: '',
        usoParaDecants: false,
        esCompartido: false
    });

    useEffect(() => {
        // 1. Si no hay perfume seleccionado, volver al inicio
        if (!perfumeAEditar) {
            navigate('/');
            return;
        }

        // 2. Cargar datos del perfume en el formulario
        setFormData({
            idPerfume: perfumeAEditar.idPerfume,
            nombrePerfume: perfumeAEditar.nombrePerfume,
            idMarca: perfumeAEditar.idMarca,
            mililitrosTotales: perfumeAEditar.mililitrosTotales,
            cantidadStock: perfumeAEditar.cantidadStock,
            costoAdquisicion: perfumeAEditar.costoAdquisicion,
            precioReferencia: perfumeAEditar.precioReferencia || 0,
            precioVentaBotella: perfumeAEditar.precioVentaBotella,
            usoParaDecants: perfumeAEditar.usoParaDecants === true || perfumeAEditar.usoParaDecants === "1",
            esCompartido: perfumeAEditar.esCompartido === true || perfumeAEditar.esCompartido === "1"
        });

        // 3. Cargar marcas
        const cargarMarcas = async () => {
            const data = await inventarioService.obtenerMarcas();
            if(data.records) setMarcas(data.records);
        };
        cargarMarcas();
    }, [perfumeAEditar, navigate]);

    const handleChange = (e) => {
        const { name, value, type, checked } = e.target;
        setFormData({
            ...formData,
            [name]: type === 'checkbox' ? checked : value
        });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            await inventarioService.editarPerfume(formData); // Usamos la función de EDITAR
            alert('✅ Perfume actualizado correctamente');
            navigate('/');
        } catch (error) {
            alert('❌ Error al actualizar');
        }
    };

    return (
        <div className="form-page" style={{ maxWidth: '600px', margin: '0 auto' }}>
            <h1>✏️ Editar Perfume</h1>
            
            <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '15px', textAlign: 'left' }}>
                <div className="form-group">
                    <label>Nombre:</label>
                    <input type="text" name="nombrePerfume" value={formData.nombrePerfume} onChange={handleChange} style={{ width: '100%', padding: '8px' }} />
                </div>

                <div className="form-group">
                    <label>Marca:</label>
                    <select name="idMarca" value={formData.idMarca} onChange={handleChange} style={{ width: '100%', padding: '8px' }}>
                        {marcas.map(m => <option key={m.idMarca} value={m.idMarca}>{m.nombreMarca}</option>)}
                    </select>
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px' }}>
                    <div>
                        <label>Stock:</label>
                        <input type="number" name="cantidadStock" value={formData.cantidadStock} onChange={handleChange} style={{ width: '100%' }} />
                    </div>
                    <div>
                        <label>Precio Venta ($):</label>
                        <input type="number" name="precioVentaBotella" value={formData.precioVentaBotella} onChange={handleChange} style={{ width: '100%' }} />
                    </div>
                </div>

                <div style={{ background: '#333', padding: '10px', borderRadius: '5px' }}>
                    <label style={{ marginRight: '15px' }}>
                        <input type="checkbox" name="usoParaDecants" checked={formData.usoParaDecants} onChange={handleChange} /> 🧪 Decants
                    </label>
                    <label>
                        <input type="checkbox" name="esCompartido" checked={formData.esCompartido} onChange={handleChange} /> 🤝 50/50
                    </label>
                </div>

                <div style={{ marginTop: '20px', display: 'flex', gap: '10px' }}>
                    <button type="submit" style={{ flex: 1, background: '#ff9800', color: 'white', padding: '12px' }}>Actualizar</button>
                    <button type="button" onClick={() => navigate('/')} style={{ background: '#444', padding: '12px' }}>Cancelar</button>
                </div>
            </form>
        </div>
    );
};

export default EditPerfume;