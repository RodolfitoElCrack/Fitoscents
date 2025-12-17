import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Inventory from './pages/Inventory';
import AddPerfume from './pages/AddPerfume';
import Insumos from './pages/Insumos';
import POS from './pages/POS'; // <--- 1. IMPORTAR
import EditPerfume from './pages/EditPerfume';
import Clientes from './pages/Clientes';
import Gastos from './pages/Gastos';
import Finanzas from './pages/Finanzas';

function App() {
  return (
    <Router>
      <div className="app-container">
        <main style={{ padding: '20px' }}> {/* Quité el padding 20px para que el POS ocupe toda la pantalla */}
          <Routes>
            <Route path="/" element={<Inventory />} />
            <Route path="/nuevo-perfume" element={<AddPerfume />} />
            <Route path="/insumos" element={<Insumos />} />
            <Route path="/vender" element={<POS />} /> 
            <Route path="/editar-perfume" element={<EditPerfume />} />
            <Route path="/clientes" element={<Clientes />} />
            <Route path="/gastos" element={<Gastos />} />
            <Route path="/finanzas" element={<Finanzas />} />
          </Routes>
        </main>
      </div>
    </Router>
  );
}

export default App;