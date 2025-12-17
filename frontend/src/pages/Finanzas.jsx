import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { inventarioService } from '../services/api';

const Finanzas = () => {
    const navigate = useNavigate();
    const [datos, setDatos] = useState({ 
        totalVentas: 0, 
        totalGastos: 0, 
        utilidadBruta: 0, 
        deudaSocio: 0 
    });
    
    // Estado para el pago al socio
    const [montoPago, setMontoPago] = useState("");

    const cargarFinanzas = async () => {
        const data = await inventarioService.obtenerFinanzas();
        if(data) setDatos(data);
    };

    useEffect(() => { cargarFinanzas(); }, []);

    const handlePagarSocio = async (e) => {
        e.preventDefault();
        if(!montoPago || montoPago <= 0) return alert("Ingresa un monto válido");
        
        if(!confirm(`¿Confirmar pago de $${montoPago} al Socio?`)) return;

        try {
            await inventarioService.liquidarSocio({ 
                monto: montoPago, 
                notas: "Pago manual desde Finanzas" 
            });
            alert("✅ Pago registrado. La deuda ha bajado.");
            setMontoPago("");
            cargarFinanzas(); // Recargar números
        } catch (error) {
            alert("Error al registrar pago");
        }
    };

    // Estilos de Tarjetas
    const cardStyle = { 
        background: '#333', 
        padding: '20px', 
        borderRadius: '10px', 
        flex: 1, 
        minWidth: '200px',
        textAlign: 'center'
    };

    return (
        <div style={{ padding: '20px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '20px' }}>
                <h1>💰 Panel Financiero</h1>
                <button onClick={() => navigate('/')} style={{ background: '#444' }}>⬅ Inicio</button>
            </div>

            {/* TARJETAS DE RESUMEN */}
            <div style={{ display: 'flex', gap: '20px', flexWrap: 'wrap', marginBottom: '30px' }}>
                
                <div style={cardStyle}>
                    <h3>Ventas Totales</h3>
                    <h2 style={{ color: '#4caf50' }}>${parseFloat(datos.totalVentas).toLocaleString()}</h2>
                </div>

                <div style={cardStyle}>
                    <h3>Gastos Operativos</h3>
                    <h2 style={{ color: '#f44336' }}>-${parseFloat(datos.totalGastos).toLocaleString()}</h2>
                </div>

                <div style={{ ...cardStyle, border: '1px solid #4caf50' }}>
                    <h3>Utilidad Neta (Caja)</h3>
                    <h2 style={{ color: '#fff' }}>${parseFloat(datos.utilidadBruta).toLocaleString()}</h2>
                    <small style={{ color: '#aaa' }}>Dinero disponible antes de pagar al socio</small>
                </div>

            </div>

            {/* SECCIÓN CRÍTICA: SOCIOS */}
            <div style={{ background: '#222', padding: '30px', borderRadius: '15px', border: '2px solid #ff9800' }}>
                <h2 style={{ marginTop: 0, color: '#ff9800' }}>🤝 Estado de Cuenta del Socio</h2>
                
                <div style={{ display: 'flex', gap: '40px', flexWrap: 'wrap', alignItems: 'center' }}>
                    
                    <div>
                        <p style={{ fontSize: '1.2em', marginBottom: '5px' }}>Deuda Acumulada:</p>
                        <h1 style={{ fontSize: '3em', margin: 0, color: datos.deudaSocio > 0 ? '#ff5722' : '#4caf50' }}>
                            ${parseFloat(datos.deudaSocio).toLocaleString()}
                        </h1>
                        <p style={{ fontSize: '0.9em', color: '#888' }}>
                            (Ganancias del socio + Inversión recuperada - Pagos realizados)
                        </p>
                    </div>

                    {/* FORMULARIO DE PAGO */}
                    <div style={{ background: '#333', padding: '20px', borderRadius: '10px', flex: 1, maxWidth: '400px' }}>
                        <h3 style={{ marginTop: 0 }}>Registrar Pago al Socio</h3>
                        <form onSubmit={handlePagarSocio} style={{ display: 'flex', gap: '10px' }}>
                            <div style={{ position: 'relative', flex: 1 }}>
                                <span style={{ position: 'absolute', left: '10px', top: '10px' }}>$</span>
                                <input 
                                    type="number" 
                                    placeholder="0.00" 
                                    value={montoPago} 
                                    onChange={e => setMontoPago(e.target.value)}
                                    style={{ width: '100%', padding: '10px 10px 10px 25px', boxSizing:'border-box' }}
                                />
                            </div>
                            <button type="submit" style={{ background: '#ff9800', color: 'black', fontWeight: 'bold', border: 'none', padding: '0 20px', cursor: 'pointer', borderRadius:'5px' }}>
                                PAGAR
                            </button>
                        </form>
                    </div>

                </div>
            </div>
        </div>
    );
};

export default Finanzas;