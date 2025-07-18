// Importamos React y los componentes de PrimeReact necesarios
import React, { useEffect, useState } from 'react';
import { DataTable } from 'primereact/datatable';      // Tabla para mostrar los productos
import { Column } from 'primereact/column';            // Columnas para la tabla
import { InputText } from 'primereact/inputtext';      // Campo de entrada de texto
import { Button } from 'primereact/button';            // Botones
import { Dialog } from 'primereact/dialog';            // Modal de creación/edición
import { Toolbar } from 'primereact/toolbar';          // Barra de herramientas (botones superiores)
import { useNavigate } from 'react-router-dom';        // Para redirigir
import '../CSS/Productos.css';

// Componente principal de la pantalla de productos
const Productos = () => {
  const [productos, setProductos] = useState([]);   // Lista de productos cargados
  const [producto, setProducto] = useState({        // Estado del producto actual en el formulario
    codigo: '',
    descripcion: '',
    categoria: '',
    valor_unitario: ''
  });
  const [productoDialog, setProductoDialog] = useState(false); // Visibilidad del modal
  const [submitted, setSubmitted] = useState(false);           // Para validaciones simples
  const [editando, setEditando] = useState(false);             // Si estamos en modo edición
  const navigate = useNavigate();                              // Hook para redirigir

  // 🔄 Al montar el componente, cargamos los productos desde el backend
  useEffect(() => {
    obtenerProductos();
  }, []);

  // Función para obtener todos los productos desde el backend
  const obtenerProductos = async () => {
    const res = await fetch('https://backend-inventario-final.onrender.com/api/productos');
    const data = await res.json();
    setProductos(data);
  };

  // Abre el modal para registrar un nuevo producto
  const abrirNuevo = () => {
    setProducto({ codigo: '', descripcion: '', categoria: '', valor_unitario: '' });
    setSubmitted(false);
    setEditando(false);
    setProductoDialog(true);
  };

  // Oculta el modal
  const ocultarDialogo = () => {
    setProductoDialog(false);
    setSubmitted(false);
  };

  // Guarda el producto, ya sea nuevo o editado
  const guardarProducto = async () => {
    setSubmitted(true);

    // Validación rápida: todos los campos obligatorios
    if (!producto.codigo || !producto.descripcion || !producto.categoria || !producto.valor_unitario) return;

    // Si estamos editando, usamos PUT
    if (editando) {
      await fetch(`https://backend-inventario-final.onrender.com/api/productos/${producto.codigo}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(producto)
      });
    } else {
      // Si es nuevo, usamos POST
      await fetch('https://backend-inventario-final.onrender.com/api/productos', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(producto)
      });
    }

    ocultarDialogo();     // Cierra el modal
    obtenerProductos();   // Refresca la lista
  };

  // Carga el producto seleccionado para edición
  const editarProducto = (prod) => {
    setProducto({ ...prod });
    setEditando(true);
    setProductoDialog(true);
  };

  // Elimina un producto dado su código
  const eliminarProducto = async (codigo) => {
    await fetch(`https://backend-inventario-final.onrender.com/api/productos/${codigo}`, { method: 'DELETE' });
    obtenerProductos(); // Refresca la lista
  };

  // Botones de acción por fila (editar / eliminar)
  const actionTemplate = (rowData) => (
    <div className="productos-acciones">
      <Button icon="pi pi-pencil" className="p-button-rounded p-button-warning" onClick={() => editarProducto(rowData)} />
      <Button icon="pi pi-trash" className="p-button-rounded p-button-danger" onClick={() => eliminarProducto(rowData.codigo)} />
    </div>
  );

  // Botón izquierdo de la barra (Nuevo producto)
  const izquierda = (
    <Button label="Nuevo Producto" icon="pi pi-plus" className="p-button-success" onClick={abrirNuevo} />
  );

  // Botón derecho de la barra (volver al menú)
  const derecha = (
    <Button label="Volver al Menú" icon="pi pi-arrow-left" className="p-button-secondary" onClick={() => navigate('/menu')} />
  );

  return (
    <div className="productos-container">
      {/* Barra con botones */}
      <Toolbar start={izquierda} end={derecha} className="productos-toolbar" />

      {/* Tabla con productos */}
      <DataTable value={productos} dataKey="codigo" paginator rows={5}>
        <Column field="codigo" header="Código" />
        <Column field="descripcion" header="Descripción" />
        <Column field="categoria" header="Categoría" />
        <Column field="valor_unitario" header="Valor Unitario" />
        <Column body={actionTemplate} header="Acciones" />
      </DataTable>

      {/* Modal para registrar o editar productos */}
      <Dialog
        visible={productoDialog}
        header={editando ? "Editar Producto" : "Nuevo Producto"}
        onHide={ocultarDialogo}
        modal
        className="w-96"
      >
        <div className="field">
          <label>Código</label>
          <InputText
            value={producto.codigo}
            onChange={(e) => setProducto({ ...producto, codigo: e.target.value })}
            disabled={editando}
          />
        </div>
        <div className="field mt-3">
          <label>Descripción</label>
          <InputText
            value={producto.descripcion}
            onChange={(e) => setProducto({ ...producto, descripcion: e.target.value })}
          />
        </div>
        <div className="field mt-3">
          <label>Categoría</label>
          <InputText
            value={producto.categoria}
            onChange={(e) => setProducto({ ...producto, categoria: e.target.value })}
          />
        </div>
        <div className="field mt-3">
          <label>Valor Unitario</label>
          <InputText
            value={producto.valor_unitario}
            onChange={(e) => setProducto({ ...producto, valor_unitario: e.target.value })}
          />
        </div>
        <div className="mt-4 text-right">
          <Button label="Cancelar" icon="pi pi-times" onClick={ocultarDialogo} className="p-button-text" />
          <Button label="Guardar" icon="pi pi-check" onClick={guardarProducto} autoFocus />
        </div>
      </Dialog>
    </div>
  );
};

export default Productos;
