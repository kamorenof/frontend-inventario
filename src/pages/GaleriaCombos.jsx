// src/pages/GaleriaCombos.jsx
import React, { useEffect, useRef, useState } from 'react';
import { Button } from 'primereact/button';
import { Toast } from 'primereact/toast';
import { ConfirmDialog, confirmDialog } from 'primereact/confirmdialog';
import '../CSS/GaleriaCombos.css';

const GaleriaCombos = () => {
  const [imagenes, setImagenes] = useState([]);
  const toast = useRef(null);

  // 🔄 Obtener las imágenes desde el backend
  const cargarImagenes = () => {
    fetch('https://backend-inventario-final.onrender.com/api/combos')
      .then(res => res.json())
      .then(data => setImagenes(data))
      .catch(err => console.error('❌ Error al obtener imágenes:', err));
  };

  useEffect(() => {
    cargarImagenes();
  }, []);

  // 📤 Subir nueva imagen
  const subirImagen = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const formData = new FormData();
    formData.append('imagen', file);

    try {
      const res = await fetch('https://backend-inventario-final.onrender.com/api/combos', {
        method: 'POST',
        body: formData
      });

      const data = await res.json();
      toast.current.show({ severity: 'success', summary: '✅ Imagen subida', detail: data.mensaje });
      cargarImagenes();
    } catch (error) {
      console.error('❌ Error al subir imagen:', error);
      toast.current.show({ severity: 'error', summary: 'Error', detail: 'No se pudo subir la imagen' });
    }
  };

  // 🗑️ Confirmar y eliminar imagen
  const eliminarImagen = (nombre) => {
    confirmDialog({
      message: '¿Estás seguro de eliminar esta imagen?',
      header: 'Confirmar Eliminación',
      icon: 'pi pi-exclamation-triangle',
      accept: async () => {
        try {
          const res = await fetch(`https://backend-inventario-final.onrender.com/api/combos/${nombre}`, {
            method: 'DELETE'
          });

          const data = await res.json();
          toast.current.show({ severity: 'info', summary: 'Imagen eliminada', detail: data.mensaje });
          cargarImagenes();
        } catch (error) {
          console.error('❌ Error al eliminar imagen:', error);
          toast.current.show({ severity: 'error', summary: 'Error', detail: 'No se pudo eliminar la imagen' });
        }
      }
    });
  };

  return (
    <div className="galeria-container">
      <Toast ref={toast} />
      <ConfirmDialog />

      <div className="galeria-header">
        <h2>📸 Combos de la Semana</h2>
        <input
          type="file"
          accept="image/*"
          onChange={subirImagen}
          className="input-file"
        />
      </div>

      <div className="galeria-imagenes">
        {imagenes.length === 0 ? (
          <p>No hay imágenes aún.</p>
        ) : (
          imagenes.map((img) => (
            <div key={img} className="galeria-item">
              <img src={`https://backend-inventario-final.onrender.com/uploads/${img}`} alt="combo" />
              <Button
                icon="pi pi-trash"
                className="p-button-danger p-button-sm mt-2"
                onClick={() => eliminarImagen(img)}
              />
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default GaleriaCombos;
