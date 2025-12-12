import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { inventarioService } from '../services/api';

const POS = () => {
    const navigate = useNavigate();

    const [perfumes, setPerfumes] = useState([]);
    const [busqueda, setBusqueda] = useState("");
    const [carrito, setCarrito] = useState([]);
    const [total, setTotal] = useState(0);

    // Cargar solo perfumes (Sin insumos/decants)
    useEffect(() => {
        const cargarDatos = async () => {
            const dataPerfumes = await inventarioService.obtenerPerfumes();
            if(dataPerfumes.records) setPerfumes(dataPerfumes.records);
        };
        cargarDatos();
    }, []);

    // Calcular total en tiempo real
    useEffect(() => {
        const suma = carrito.reduce((acc, item) => acc + parseFloat(item.precioVenta || 0), 0);
        setTotal(suma);
    }, [carrito]);

    const agregarBotella = (perfume) => {
        // Lógica de Socio: ¿Es ajeno?
        const esAjeno = perfume.idSocioDuenio && !perfume.esCompartido;

        const item = {
            uniqueId: Date.now(),
            idPerfume: perfume.idPerfume,
            nombre: perfume.nombrePerfume,
            esDecant: false, // Siempre falso ahora
            descripcion: esAjeno ? "Botella (Socio)" : "Botella Cerrada",
            precioVenta: perfume.precioVentaBotella,

            // Datos financieros para el backend
            esAjeno: esAjeno,
            montoComision: 0 // Inicia en 0, tú decides cuánto cobrar si es ajeno
        };
        setCarrito([...carrito, item]);
    };

    const eliminarDelCarrito = (uniqueId) => {
        setCarrito(carrito.filter(item => item.uniqueId !== uniqueId));
    };

    const actualizarItem = (uniqueId, campo, valor) => {
        setCarrito(carrito.map(item => 
            item.uniqueId === uniqueId ? { ...item, [campo]: valor } : item
        ));
    };

    const handleCobrar = async () => {
        if(carrito.length === 0) return alert("Carrito vacío");
        if(!confirm(`Total a cobrar: $${total}\n¿Confirmar venta?`)) return;

        const ventaData = {
            idCliente: null, // Venta mostrador
            totalVenta: total,
            items: carrito
        };

        try {
            await inventarioService.guardarVenta(ventaData);
            alert("✅ Venta registrada correctamente");
            setCarrito([]);
            navigate('/');
        } catch (error) {
            console.error(error);
            alert("❌ Error al procesar venta");
        }
    };

    const perfumesFiltrados = perfumes.filter(p => 
        p.nombrePerfume.toLowerCase().includes(busqueda.toLowerCase()) || 
        p.nombreMarca.toLowerCase().includes(busqueda.toLowerCase())
    );

    return (
        <div style={{ display: 'grid', gridTemplateColumns: '60% 40%', height: '100vh', fontFamily: 'Arial, sans-serif' }}>

            {/* IZQUIERDA: CATÁLOGO DE BOTELLAS */}
            <div style={{ padding: '20px', overflowY: 'auto', background: '#222', color: 'white' }}>
                <div style={{ display: 'flex', gap: '10px', marginBottom: '20px' }}>
                    <button onClick={() => navigate('/')} style={{ background: '#444', color: 'white', border: 'none', padding: '10px', borderRadius: '5px', cursor: 'pointer' }}>🏠 Salir</button>
                    <input 
                        type="text" placeholder="🔍 Buscar perfume..." 
                        value={busqueda} onChange={e => setBusqueda(e.target.value)}
                        style={{ flex: 1, padding: '10px', borderRadius: '5px', border: 'none' }}
                    />
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))', gap: '15px' }}>
                    {perfumesFiltrados.map(perfume => (
                        <div key={perfume.idPerfume} style={{ background: '#333', padding: '15px', borderRadius: '10px', border: perfume.idSocioDuenio ? '1px solid #e91e63' : '1px solid #444' }}>
                            <h3 style={{ margin: '0 0 5px 0', fontSize: '1em' }}>{perfume.nombrePerfume}</h3>
                            <p style={{ color: '#aaa', fontSize: '0.8em', margin: 0 }}>{perfume.nombreMarca}</p>

                            {/* Etiquetas Visuales */}
                            {perfume.esCompartido && <span style={{fontSize:'0.7em', background:'#ff9800', color:'black', padding:'2px 5px', borderRadius:'3px', display:'inline-block', marginTop:'5px'}}>🤝 Compartido 50/50</span>}
                            {perfume.idSocioDuenio && !perfume.esCompartido && <span style={{fontSize:'0.7em', background:'#e91e63', color:'white', padding:'2px 5px', borderRadius:'3px', display:'inline-block', marginTop:'5px'}}>👤 Del Socio</span>}

                            <button 
                                onClick={() => agregarBotella(perfume)}
                                style={{ width: '100%', marginTop: '15px', padding:'10px', background: '#007bff', color:'white', border:'none', borderRadius:'5px', cursor:'pointer', fontWeight:'bold' }}
                            >
                                Vender Botella (${perfume.precioVentaBotella})
                            </button>
                        </div>
                    ))}
                </div>
            </div>

            {/* DERECHA: TICKET Y COMISIONES */}
            <div style={{ padding: '20px', background: '#1a1a1a', color: 'white', display: 'flex', flexDirection: 'column' }}>
                <h2 style={{ borderBottom: '1px solid #555', paddingBottom: '10px', margin: '0 0 20px 0' }}>🛒 Ticket de Venta</h2>

                <div style={{ flex: 1, overflowY: 'auto' }}>
                    {carrito.length === 0 && <p style={{color:'#666', textAlign:'center'}}>Agrega perfumes para vender</p>}

                    {carrito.map(item => (
                        <div key={item.uniqueId} style={{ background: '#333', padding: '10px', marginBottom: '10px', borderRadius: '5px' }}>
                            <div style={{ display:'flex', justifyContent:'space-between', marginBottom:'5px' }}>
                                <strong>{item.nombre}</strong>
                                <button onClick={() => eliminarDelCarrito(item.uniqueId)} style={{color:'red', background:'none', border:'none', cursor:'pointer', fontSize:'1.2em'}}>✕</button>
                            </div>
                            <div style={{ fontSize: '0.8em', color: '#ccc', marginBottom: '8px' }}>{item.descripcion}</div>

                            <div style={{ display:'flex', gap:'10px', alignItems:'center' }}>
                                {/* PRECIO DE VENTA */}
                                <div style={{flex:1}}>
                                    <label style={{fontSize:'0.7em', display:'block', color:'#aaa'}}>Precio Venta:</label>
                                    <input 
                                        type="number" 
                                        value={item.precioVenta} 
                                        onChange={(e) => actualizarItem(item.uniqueId, 'precioVenta', e.target.value)}
                                        style={{ width: '100%', padding: '8px', background:'#222', border:'1px solid #555', color:'white', borderRadius:'4px' }}
                                    />
                                </div>

                                {/* COMISIÓN (Solo aparece si el perfume es ajeno) */}
                                {item.esAjeno && (
                                    <div style={{flex:1}}>
                                        <label style={{fontSize:'0.7em', display:'block', color:'#4caf50', fontWeight:'bold'}}>Tu Comisión ($):</label>
                                        <input 
                                            type="number" 
                                            value={item.montoComision} 
                                            onChange={(e) => actualizarItem(item.uniqueId, 'montoComision', e.target.value)}
                                            style={{ width: '100%', padding: '8px', background:'#1b5e20', border:'1px solid #4caf50', color:'white', borderRadius:'4px' }}
                                        />
                                    </div>
                                )}
                            </div>
                        </div>
                    ))}
                </div>

                <div style={{ borderTop: '2px solid #555', paddingTop: '20px' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '1.5em', fontWeight: 'bold', marginBottom: '20px' }}>
                        <span>Total:</span>
                        <span>${total.toFixed(2)}</span>
                    </div>
                    <button 
                        onClick={handleCobrar}
                        style={{ width: '100%', padding: '15px', fontSize: '1.2em', background: '#28a745', color:'white', border:'none', borderRadius:'5px', fontWeight: 'bold', cursor: 'pointer' }}
                    >
                        💰 COBRAR VENTA
                    </button>
                </div>
            </div>
        </div>
    );
};

export default POS;