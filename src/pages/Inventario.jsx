// Importamos React, hooks y componentes necesarios
import React, { useEffect, useState } from 'react';
import { Button } from 'primereact/button';
import { useNavigate } from 'react-router-dom';
import '../CSS/Inventario.css';

// Componente principal para mostrar el inventario actual
const Inventario = () => {
  const [productos, setProductos] = useState([]); // Estado para guardar productos del inventario
  const navigate = useNavigate(); // Hook para redirigir entre rutas

  // Al montar el componente, hacemos la petición para obtener el inventario
  useEffect(() => {
    fetch('https://backend-inventario-final.onrender.com/api/inventario')
      .then(res => res.json())
      .then(data => setProductos(data))
      .catch(err => console.error('Error al obtener inventario:', err));
  }, []);

  return (
    <div className="inventario-container">
      {/* Título principal */}
      <h2 className="inventario-titulo">📦 Inventario Actual</h2>

      {/* Tabla que muestra la lista de productos con stock */}
      <div className="tabla-responsive">
        <table className="inventario-tabla">
          <thead>
            <tr>
              <th>Código</th>
              <th>Descripción</th>
              <th>Categoría</th>
              <th>Valor Unitario</th>
              <th>Stock</th>
            </tr>
          </thead>
          <tbody>
            {productos.map((prod) => (
              <tr key={prod.id}>
                <td>{prod.codigo}</td>
                <td>{prod.descripcion}</td>
                <td>{prod.categoria}</td>
                <td>${parseFloat(prod.valor_unitario).toFixed(2)}</td>
                <td>{prod.stock}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Botones para acciones: conteo, historial y volver */}
      <div className="inventario-botones">
        <Button
          label="📝 Realizar Conteo Físico"
          icon="pi pi-pencil"
          className="p-button-primary"
          onClick={() => navigate('/inventario/conteo')}
        />
        <Button
          label="📊 Ver Historial de Conteos"
          icon="pi pi-calendar"
          className="p-button-secondary"
          onClick={() => navigate('/inventario/historial')}
        />
        <Button
          label="🏠 Volver al Menú"
          icon="pi pi-home"
          className="p-button-secondary"
          onClick={() => navigate('/menu')}
        />
      </div>
    </div>
  );
};

export default Inventario;
