// Importamos React, hooks y componentes necesarios
import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from 'primereact/button';
import '../CSS/Historial.css';

const Historial = () => {
  // Estado para almacenar los movimientos obtenidos del backend
  const [movimientos, setMovimientos] = useState([]);
  const navigate = useNavigate(); // Hook para redirección

  // Al cargar el componente, obtenemos el historial de movimientos
  useEffect(() => {
    fetch('https://backend-inventario-final.onrender.com/api/movimientos')
      .then(res => res.json())
      .then(data => setMovimientos(data))
      .catch(err => console.error('❌ Error al obtener historial:', err));
  }, []);

  return (
    <div className="historial-container">
      {/* Título */}
      <h2 className="historial-titulo">📋 Historial de Movimientos</h2>

      {/* Tabla que muestra los movimientos */}
      <div className="tabla-responsive">
        <table className="tabla-historial">
          <thead>
            <tr>
              <th>Tipo</th>
              <th>Responsable</th>
              <th>Fecha</th>
              <th>Total ($)</th>
              <th>Acción</th>
            </tr>
          </thead>
          <tbody>
            {movimientos.map((mov) => (
              <tr key={mov.id}>
                <td className="capitalize">{mov.tipo}</td>
                <td>{mov.responsable}</td>
                <td>{new Date(mov.fecha).toLocaleString()}</td>
                <td>${Number(mov.total).toFixed(2)}</td>
                <td>
                  <Button
                    icon="pi pi-eye"
                    label="Ver"
                    className="p-button-info p-button-sm"
                    onClick={() => navigate(`/historial/${mov.id}`)}
                  />
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Botón para volver al menú */}
      <div className="volver-container">
        <Button
          label="Volver al menú"
          icon="pi pi-arrow-left"
          className="p-button-secondary"
          onClick={() => navigate('/menu')}
        />
      </div>
    </div>
  );
};

export default Historial;
