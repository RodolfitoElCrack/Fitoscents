import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Inventory from './pages/Inventory';
// Aquí importarás las otras páginas luego (Dashboard, Clientes, etc.)

function App() {
  return (
    <Router>
      <div className="app-container">
        {/* Aquí iría tu barra de navegación (Navbar) en el futuro */}
        
        <main style={{ padding: '20px' }}>
          <Routes>
            {/* Ruta Principal: El Inventario */}
            <Route path="/" element={<Inventory />} />
            
            {/* Aquí agregaremos más rutas después:
            <Route path="/clientes" element={<Cliente />} /> 
            */}
          </Routes>
        </main>
      </div>
    </Router>
  );
}

export default App;