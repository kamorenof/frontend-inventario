// Importamos React y hooks de navegación y parámetros de URL
import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Button } from 'primereact/button';
import '../CSS/DetalleMovimiento.css';

// Componente para mostrar el detalle de un movimiento individual
const DetalleMovimiento = () => {
  const { id } = useParams(); // Obtenemos el ID desde la URL
  const [movimiento, setMovimiento] = useState(null); // Estado para guardar los datos del movimiento
  const navigate = useNavigate(); // Para redireccionar

  // Al cargar el componente, hacemos una petición al backend para obtener los datos
  useEffect(() => {
    fetch(`https://backend-inventario-final.onrender.com/api/movimientos/${id}`)
      .then(res => res.json())
      .then(data => setMovimiento(data))
      .catch(err => console.error('❌ Error al obtener detalle del movimiento:', err));
  }, [id]);

  // Si aún no se han cargado los datos, mostramos mensaje
  if (!movimiento) {
    return <p className="detalle-cargando">Cargando...</p>;
  }

  return (
    <div className="detalle-container">
      {/* Título */}
      <h2 className="detalle-titulo">📦 Detalle del Movimiento #{id}</h2>

      {/* Información general del movimiento */}
      <div className="detalle-info">
        <p><strong>Tipo:</strong> {movimiento.tipo}</p>
        {movimiento.tipo === 'entrada' ? (
          <p><strong>Factura:</strong> {movimiento.factura}</p>
        ) : (
          <p><strong>Motivo:</strong> {movimiento.motivo}</p>
        )}
        <p><strong>Responsable:</strong> {movimiento.responsable}</p>
        <p><strong>Fecha:</strong> {new Date(movimiento.fecha).toLocaleString()}</p>
        <p><strong>Total:</strong> ${Number(movimiento.total).toFixed(2)}</p>
      </div>

      {/* Tabla de productos relacionados al movimiento */}
      <h3 className="detalle-subtitulo">🧾 Productos:</h3>
      <div className="tabla-responsive">
        <table className="detalle-tabla">
          <thead>
            <tr>
              <th>Código</th>
              <th>Descripción</th>
              <th>Categoría</th>
              <th>Cantidad</th>
              <th>Valor Unitario</th>
              <th>Total</th>
            </tr>
          </thead>
          <tbody>
            {movimiento.detalles.map((detalle, index) => (
              <tr key={index}>
                <td>{detalle.codigo}</td>
                <td>{detalle.descripcion}</td>
                <td>{detalle.categoria}</td>
                <td>{detalle.cantidad}</td>
                <td>${Number(detalle.valor_unitario).toFixed(2)}</td>
                <td>${Number(detalle.total).toFixed(2)}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Botón para volver */}
      <div className="detalle-volver">
        <Button
          label="Volver al historial"
          icon="pi pi-arrow-left"
          className="p-button-secondary"
          onClick={() => navigate('/historial')}
        />
      </div>
    </div>
  );
};

export default DetalleMovimiento;
