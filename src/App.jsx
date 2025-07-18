import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import RegistroUsuario from './pages/RegistroUsuario';
import LoginUsuario from './pages/Login';
import Menu from './pages/Menu.jsx';
import Productos from './pages/Productos';
import Movimientos from './pages/Movimientos';
import DetalleMovimiento from './pages/DetalleMovimiento';
import Historial from './pages/Historial'; 
import Inventario from './pages/Inventario';
import ConteoFisico from './pages/ConteoFisico';
import HistorialConteos from './pages/HistorialConteos';
import DetalleConteo from './pages/DetalleConteo';

const App = () => {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<LoginUsuario />} />
        <Route path="/login" element={<LoginUsuario />} />
        <Route path="/registro" element={<RegistroUsuario />} />
        <Route path="/menu" element={<Menu />} />
        <Route path="/productos" element={<Productos />} />
        <Route path="/movimientos" element={<Movimientos />} />
        <Route path="/historial" element={<Historial />} />
        <Route path="/historial/:id" element={<DetalleMovimiento />} />
        <Route path="/inventario" element={<Inventario />} />
        <Route path="/inventario/conteo" element={<ConteoFisico />} />
        <Route path="/inventario/historial" element={<HistorialConteos />} />
        <Route path="/inventario/conteo/:id" element={<DetalleConteo />} />
      </Routes>
    </Router>
  );
};

export default App;