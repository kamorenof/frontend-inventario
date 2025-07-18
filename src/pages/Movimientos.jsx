// Importamos React y hooks necesarios
import React, { useState, useEffect } from 'react';
import { Dropdown } from 'primereact/dropdown';       // Selector desplegable
import { InputText } from 'primereact/inputtext';     // Campo de texto
import { Button } from 'primereact/button';           // Botón estilizado
import { useNavigate } from 'react-router-dom';       // Para redireccionar
import '../CSS/Movimientos.css';

// Componente principal
const Movimientos = () => {
  // Estados para tipo de movimiento, factura/motivo y productos
  const [tipo, setTipo] = useState('entrada');
  const [facturaOMotivo, setFacturaOMotivo] = useState('');
  const [productosDisponibles, setProductosDisponibles] = useState([]);
  const [filas, setFilas] = useState([]);

  const navigate = useNavigate(); // Para navegar entre rutas

  const responsable = localStorage.getItem('nombreUsuario') || 'Usuario'; // Obtenemos el nombre desde localStorage

  // Al cargar, obtenemos todos los productos
  useEffect(() => {
    fetch('https://backend-inventario-final.onrender.com/api/productos')
      .then(res => res.json())
      .then(data => setProductosDisponibles(data))
      .catch(err => console.error('Error al obtener productos:', err));
  }, []);

  // Agrega una fila vacía al formulario
  const agregarFila = () => {
    setFilas([...filas, {
      id_producto: null,
      cantidad: '',
      valor_unitario: '',
      total: '',
      categoria: '',
      descripcion: ''
    }]);
  };

  // Actualiza una fila del formulario
  const actualizarFila = (index, campo, valor) => {
    const nuevasFilas = [...filas];
    nuevasFilas[index][campo] = valor;

    // Si selecciona un producto, se rellenan automáticamente sus datos
    if (campo === 'id_producto') {
      const producto = productosDisponibles.find(p => p.id === valor);
      if (producto) {
        nuevasFilas[index].valor_unitario = producto.valor_unitario;
        nuevasFilas[index].descripcion = producto.descripcion;
        nuevasFilas[index].categoria = producto.categoria;
        nuevasFilas[index].cantidad = '';
        nuevasFilas[index].total = '';
      }
    }

    // Calcula el total por fila
    if (campo === 'cantidad') {
      const cantidad = parseInt(valor);
      const unitario = parseFloat(nuevasFilas[index].valor_unitario);
      nuevasFilas[index].total = !isNaN(cantidad) && !isNaN(unitario) ? cantidad * unitario : '';
    }

    setFilas(nuevasFilas);
  };

  // Envía el movimiento al backend
  const registrarMovimiento = async () => {
    if (!facturaOMotivo || filas.length === 0 || filas.some(f => !f.id_producto || !f.cantidad)) {
      alert('Por favor completa todos los campos');
      return;
    }

    const datos = {
      tipo,
      factura: tipo === 'entrada' ? facturaOMotivo : null,
      motivo: tipo === 'salida' ? facturaOMotivo : null,
      responsable,
      productos: filas.map(f => ({
        id_producto: f.id_producto,
        cantidad: f.cantidad,
        valor_unitario: f.valor_unitario
      }))
    };

    try {
      const res = await fetch('https://backend-inventario-final.onrender.com/api/movimientos', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(datos)
      });

      const data = await res.json();
      alert(data.mensaje || 'Movimiento registrado');
      navigate('/menu');
    } catch (err) {
      console.error('❌ Error del servidor o red:', err);
      alert('Error al registrar movimiento');
    }
  };

  return (
    <div className="movimientos-container">
      <h2 className="titulo-movimiento">📦 Registrar Movimiento</h2>

      {/* Formulario de encabezado */}
      <div className="formulario-encabezado">
        <Dropdown
          value={tipo}
          options={['entrada', 'salida']}
          onChange={(e) => setTipo(e.value)}
          className="dropdown-movimiento"
        />
        <InputText
          placeholder={tipo === 'entrada' ? 'Factura' : 'Motivo'}
          value={facturaOMotivo}
          onChange={(e) => setFacturaOMotivo(e.target.value)}
          className="input-movimiento"
        />
        <InputText disabled value={responsable} className="input-responsable" />
      </div>

      {/* Tabla dinámica de productos */}
      <div className="tabla-movimiento">
        <table className="tabla-productos">
          <thead>
            <tr>
              <th>Producto</th>
              <th>Nombre</th>
              <th>Categoría</th>
              <th>Cantidad</th>
              <th>Valor unitario</th>
              <th>Total</th>
            </tr>
          </thead>
          <tbody>
            {filas.map((fila, index) => (
              <tr key={index}>
                <td>
                  <Dropdown
                    value={fila.id_producto}
                    options={productosDisponibles.map(p => ({ label: `${p.codigo} - ${p.descripcion}`, value: p.id }))}
                    onChange={(e) => actualizarFila(index, 'id_producto', e.value)}
                    filter
                    showClear
                    placeholder="Buscar producto"
                    className="w-full"
                  />
                </td>
                <td><InputText disabled value={fila.descripcion} /></td>
                <td><InputText disabled value={fila.categoria} /></td>
                <td>
                  <InputText
                    value={fila.cantidad}
                    onChange={(e) => actualizarFila(index, 'cantidad', e.target.value)}
                  />
                </td>
                <td><InputText disabled value={fila.valor_unitario} /></td>
                <td><InputText disabled value={fila.total} /></td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Botones de acción */}
      <div className="botones-movimiento">
        <Button label="Agregar Producto" icon="pi pi-plus" onClick={agregarFila} />
        <Button label="Registrar Movimiento" icon="pi pi-save" className="p-button-success" onClick={registrarMovimiento} />
        <Button label="Volver al Menú" icon="pi pi-arrow-left" className="p-button-secondary" onClick={() => navigate('/menu')} />
      </div>
    </div>
  );
};

export default Movimientos;
