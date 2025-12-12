import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Inventory from './pages/Inventory';
import AddPerfume from './pages/AddPerfume';
import Insumos from './pages/Insumos';
import POS from './pages/POS'; // <--- 1. IMPORTAR

function App() {
  return (
    <Router>
      <div className="app-container">
        <main style={{ padding: '0' }}> {/* Quité el padding 20px para que el POS ocupe toda la pantalla */}
          <Routes>
            <Route path="/" element={<Inventory />} />
            <Route path="/nuevo-perfume" element={<AddPerfume />} />
            <Route path="/insumos" element={<Insumos />} />
            
            {/* 2. NUEVA RUTA */}
            <Route path="/vender" element={<POS />} /> 
            
          </Routes>
        </main>
      </div>
    </Router>
  );
}

export default App;