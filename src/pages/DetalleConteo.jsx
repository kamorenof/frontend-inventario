// Importación de React y hooks necesarios
import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Button } from 'primereact/button';
import '../CSS/DetalleConteo.css';

// Componente que muestra el detalle de un conteo físico específico
const DetalleConteo = () => {
  const { id } = useParams();           // Extrae el parámetro de la URL
  const [conteo, setConteo] = useState(null);  // Estado para guardar el conteo
  const navigate = useNavigate();       // Hook para redirección

  // Al montar el componente, obtener los datos del conteo
  useEffect(() => {
    fetch(`https://backend-inventario-final.onrender.com/api/conteos/${id}`)
      .then(res => res.json())
      .then(data => setConteo(data))
      .catch(err => console.error('❌ Error al cargar detalle del conteo:', err));
  }, [id]);

  // Mientras se carga la información
  if (!conteo) return <p className="detalle-loading">Cargando...</p>;

  return (
    <div className="detalle-conteo-container">
      <h2 className="detalle-titulo">📋 Detalle de Conteo #{id}</h2>

      <p><strong>Fecha:</strong> {new Date(conteo.conteo.fecha).toLocaleString()}</p>
      <p><strong>Diferencias:</strong> {conteo.conteo.diferencias ? '❌ Sí' : '✔️ No'}</p>
      <p className="detalle-observaciones"><strong>Observaciones:</strong> {conteo.conteo.observaciones || '—'}</p>

      <h3 className="detalle-subtitulo">🧾 Productos contados:</h3>

      {/* Tabla de productos contados */}
      <div className="tabla-responsive">
        <table className="detalle-tabla">
          <thead>
            <tr>
              <th>Código</th>
              <th>Descripción</th>
              <th>Categoría</th>
              <th>Stock</th>
              <th>Cantidad Física</th>
              <th>Diferencia</th>
              <th>Observación</th>
            </tr>
          </thead>
          <tbody>
            {conteo.detalles.map((d, i) => {
              const dif = d.cantidad_fisica - d.cantidad_actual; // Calcula diferencia
              return (
                <tr key={i}>
                  <td>{d.codigo}</td>
                  <td>{d.descripcion}</td>
                  <td>{d.categoria}</td>
                  <td>{d.cantidad_actual}</td>
                  <td>{d.cantidad_fisica}</td>
                  <td className="detalle-diferencia">
                    {dif !== 0
                      ? <span className="text-red-600">❌ {dif}</span>
                      : <span className="text-green-600">✔️</span>
                    }
                  </td>
                  <td>{d.observacion || '—'}</td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      {/* Botón para volver */}
      <Button
        label="Volver al historial"
        icon="pi pi-arrow-left"
        className="p-button-secondary mt-4"
        onClick={() => navigate('/inventario/historial')}
      />
    </div>
  );
};

export default DetalleConteo;
