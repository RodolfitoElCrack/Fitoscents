import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Inventory from './pages/Inventory';
import AddPerfume from './pages/AddPerfume'; // <--- 1. Importamos la nueva página
import Insumos from './pages/Insumos';

function App() {
  return (
    <Router>
      <div className="app-container">
        <main style={{ padding: '20px' }}>
          <Routes>
            <Route path="/" element={<Inventory />} />
            
            {/* 2. Agregamos la ruta nueva */}
            <Route path="/nuevo-perfume" element={<AddPerfume />} />

            <Route path="/insumos" element={<Insumos />} />
            
          </Routes>
        </main>
      </div>
    </Router>
  );
}

export default App;