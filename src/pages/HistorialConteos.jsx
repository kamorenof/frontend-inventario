// Importación de React y hooks necesarios
import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from 'primereact/button';      // Botones
import { Calendar } from 'primereact/calendar';  // Selector de fecha
import '../CSS/HistorialConteos.css';

// Componente para mostrar historial de conteos físicos
const HistorialConteos = () => {
  const [conteos, setConteos] = useState([]);            // Todos los conteos físicos
  const [fechaFiltro, setFechaFiltro] = useState(null);  // Fecha seleccionada para filtrar
  const navigate = useNavigate();                        // Hook de navegación

  // Cargar conteos desde la API al iniciar
  useEffect(() => {
    fetch('https://backend-inventario-final.onrender.com/api/conteos')
      .then(res => res.json())
      .then(data => setConteos(data))
      .catch(err => console.error('❌ Error al cargar historial:', err));
  }, []);

  // Filtrar conteos por fecha seleccionada
  const conteosFiltrados = fechaFiltro
    ? conteos.filter(c => {
        const fechaConteo = new Date(c.fecha);
        return fechaConteo.toDateString() === new Date(fechaFiltro).toDateString();
      })
    : conteos;

  return (
    <div className="historial-container">
      <h2 className="historial-titulo">📊 Historial de Conteos Físicos</h2>

      {/* Filtros y navegación */}
      <div className="historial-filtros">
        <Calendar
          value={fechaFiltro}
          onChange={(e) => setFechaFiltro(e.value)}
          placeholder="Filtrar por fecha"
          showIcon
          dateFormat="dd/mm/yy"
        />
        <Button
          label="Limpiar Filtro"
          icon="pi pi-times"
          className="p-button-secondary"
          onClick={() => setFechaFiltro(null)}
        />
        <Button
          label="Volver"
          icon="pi pi-arrow-left"
          className="p-button-secondary ml-auto"
          onClick={() => navigate('/inventario')}
        />
      </div>

      {/* Tabla de resultados */}
      <div className="tabla-responsive">
        <table className="historial-tabla">
          <thead>
            <tr>
              <th>ID</th>
              <th>Fecha</th>
              <th>Diferencias</th>
              <th>Observaciones</th>
              <th>Acciones</th>
            </tr>
          </thead>
          <tbody>
            {conteosFiltrados.length === 0 ? (
              <tr>
                <td colSpan="5" className="sin-registros">
                  No hay registros para la fecha seleccionada.
                </td>
              </tr>
            ) : (
              conteosFiltrados.map((c) => (
                <tr key={c.id}>
                  <td>{c.id}</td>
                  <td>{new Date(c.fecha).toLocaleString()}</td>
                  <td>{c.diferencias ? '❌ Sí' : '✔️ No'}</td>
                  <td>{c.observaciones?.slice(0, 40) || '—'}</td>
                  <td>
                    <Button
                      label="Ver Detalle"
                      icon="pi pi-search"
                      className="p-button-sm"
                      onClick={() => navigate(`/inventario/conteo/${c.id}`)}
                    />
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default HistorialConteos;
