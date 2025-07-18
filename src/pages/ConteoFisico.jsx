// Importación de React y hooks necesarios
import React, { useEffect, useState } from 'react';
import { Button } from 'primereact/button'; // Botón PrimeReact
import { Dialog } from 'primereact/dialog'; // Modal para observaciones
import { InputTextarea } from 'primereact/inputtextarea'; // Área de texto para observaciones
import { InputNumber } from 'primereact/inputnumber'; // Campo numérico para cantidades
import { useNavigate } from 'react-router-dom'; // Navegación
import '../CSS/ConteoFisico.css';

// Componente principal para conteo físico
const ConteoFisico = () => {
  const [productos, setProductos] = useState([]); // Lista de productos con stock actual
  const [observacionActiva, setObservacionActiva] = useState(null); // ID del producto con observación abierta
  const [conteo, setConteo] = useState([]); // Arreglo que almacena el conteo ingresado
  const navigate = useNavigate(); // Hook para redirección

  // Al montar, se obtiene el inventario y se inicializa el estado del conteo
  useEffect(() => {
    fetch('https://backend-inventario-final.onrender.com/api/inventario')
      .then(res => res.json())
      .then(data => {
        setProductos(data); // Guardamos productos en estado
        setConteo(data.map(p => ({
          id_producto: p.id,
          cantidad_fisica: null,
          observacion: ''
        }))); // Inicializamos conteo con cada producto
      })
      .catch(err => console.error('❌ Error al cargar inventario:', err));
  }, []);

  // Actualiza un campo (cantidad u observación) de un producto en el conteo
  const actualizarConteo = (id_producto, campo, valor) => {
    setConteo(prev =>
      prev.map(item =>
        item.id_producto === id_producto ? { ...item, [campo]: valor } : item
      )
    );
  };

  // Muestra el modal de observación para un producto
  const abrirObservacion = (id_producto) => {
    setObservacionActiva(id_producto);
  };

  // Cierra el modal de observación
  const cerrarObservacion = () => {
    setObservacionActiva(null);
  };

  // Función para enviar el conteo al backend
  const enviarConteo = () => {
    // Verifica si hay productos sin contar
    const incompletos = conteo.some(p => p.cantidad_fisica === null);

    // Verifica si hay diferencias entre stock y conteo físico
    const diferencias = conteo.some((p, idx) =>
      Number(p.cantidad_fisica) !== Number(productos[idx].stock)
    );

    if (incompletos) {
      alert('❌ Debes contar todos los productos antes de enviar.');
      return;
    }

    // Confirma si se desea continuar en caso de diferencias
    if (diferencias) {
      const confirmar = confirm('⚠️ Hay diferencias entre el conteo físico y el inventario. ¿Deseas continuar?');
      if (!confirmar) return;
    }

    // Construcción del objeto que se enviará
    const payload = {
      responsable: localStorage.getItem('nombreUsuario'),
      productos: conteo.map((c, i) => ({
        id_producto: c.id_producto,
        cantidad_actual: productos[i].stock,
        cantidad_fisica: Number(c.cantidad_fisica),
        observacion: c.observacion || ''
      }))
    };

    // Enviamos los datos al backend
    fetch('https://backend-inventario-final.onrender.com/api/conteos', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload)
    })
      .then(res => res.json())
      .then(data => {
        alert(data.mensaje); // Mostramos el mensaje de éxito
        navigate('/inventario'); // Volvemos al inventario
      })
      .catch(err => {
        console.error('❌ Error al guardar conteo:', err);
        alert('❌ Error al guardar conteo físico');
      });
  };

  return (
    <div className="conteo-container">
      <h2 className="conteo-titulo">📋 Conteo Físico de Inventario</h2>

      {/* Tabla de conteo físico */}
      <div className="tabla-responsive">
        <table className="conteo-tabla">
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
            {productos.map((p, i) => {
              const conteoProd = conteo.find(c => c.id_producto === p.id);
              const diferencia =
                conteoProd?.cantidad_fisica !== null
                  ? Number(conteoProd.cantidad_fisica) - Number(p.stock)
                  : null;
              const tieneObs = conteoProd?.observacion?.trim() !== '';

              return (
                <tr key={p.id}>
                  <td>{p.codigo}</td>
                  <td>{p.descripcion}</td>
                  <td>{p.categoria}</td>
                  <td>{p.stock}</td>
                  <td>
                    <InputNumber
                      value={conteoProd?.cantidad_fisica}
                      onValueChange={(e) => actualizarConteo(p.id, 'cantidad_fisica', e.value)}
                      min={0}
                      showButtons
                    />
                  </td>
                  <td className="text-center">
                    {diferencia !== null && diferencia !== 0 ? (
                      <span className="text-red-600 font-bold">❌ {diferencia}</span>
                    ) : diferencia === 0 ? (
                      <span className="text-green-600 font-bold">✔️</span>
                    ) : '-'}
                  </td>
                  <td className="text-center">
                    <Button
                      icon={tieneObs ? "pi pi-file-edit" : "pi pi-pencil"}
                      className={`p-button-sm ${tieneObs ? 'p-button-warning' : 'p-button-text'}`}
                      onClick={() => abrirObservacion(p.id)}
                      tooltip={tieneObs ? "Observación agregada" : "Agregar observación"}
                      tooltipOptions={{ position: 'top' }}
                    />
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      {/* Botones finales */}
      <div className="conteo-botones">
        <Button label="Enviar Conteo" icon="pi pi-check" className="p-button-success" onClick={enviarConteo} />
        <Button label="Volver" icon="pi pi-arrow-left" className="p-button-secondary" onClick={() => navigate('/inventario')} />
      </div>

      {/* Modal de observación */}
      <Dialog header="📝 Observación" visible={observacionActiva !== null} onHide={cerrarObservacion}>
        <InputTextarea
          rows={4}
          className="w-full"
          value={conteo.find(p => p.id_producto === observacionActiva)?.observacion || ''}
          onChange={(e) => actualizarConteo(observacionActiva, 'observacion', e.target.value)}
          placeholder="Escribe una observación..."
        />
      </Dialog>
    </div>
  );
};

export default ConteoFisico;
