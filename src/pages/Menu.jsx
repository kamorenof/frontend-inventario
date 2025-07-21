import React, { useEffect, useState } from 'react';
import { TabMenu } from 'primereact/tabmenu';
import { Button } from 'primereact/button';
import { Dialog } from 'primereact/dialog';
import { useNavigate } from 'react-router-dom';
import '../CSS/Menu.css';

const Menu = () => {
  const navigate = useNavigate();
  const nombreUsuario = localStorage.getItem('nombreUsuario') || 'Usuario';

  const items = [
    { label: 'Inicio', icon: 'pi pi-home' },
    { label: 'Productos', icon: 'pi pi-box', command: () => navigate('/productos') },
    { label: 'Movimientos', icon: 'pi pi-exchange', command: () => navigate('/movimientos') },
    { label: 'Historial', icon: 'pi pi-calendar', command: () => navigate('/historial') },
    { label: 'Inventario', icon: 'pi pi-box', command: () => navigate('/inventario') },
    { label: 'Reportes', icon: 'pi pi-chart-line' }
  ];

  const [imagenes, setImagenes] = useState([]);
  const [cargando, setCargando] = useState(true);
  const [imagenSeleccionada, setImagenSeleccionada] = useState(null);

  useEffect(() => {
    fetch('https://backend-inventario-final.onrender.com/api/combos')
      .then(res => res.json())
      .then(data => {
        setImagenes(data);
        setCargando(false);
      })
      .catch(err => {
        console.error('❌ Error al cargar combos:', err);
        setCargando(false);
      });
  }, []);

  const handleAgregarImagen = async (e) => {
    const archivo = e.target.files[0];
    if (!archivo) return;

    const formData = new FormData();
    formData.append('imagen', archivo);

    try {
      const res = await fetch('https://backend-inventario-final.onrender.com/api/combos/subir', {
        method: 'POST',
        body: formData
      });

      const data = await res.json();
      if (res.ok) {
        // Agregamos la imagen que viene con su URL e ID
        setImagenes(prev => [...prev, { id: data.id, imagen_url: data.url }]);
      } else {
        alert(`❌ Error al subir: ${data.mensaje}`);
      }
    } catch (err) {
      console.error('❌ Error al subir imagen:', err);
    }
  };

  const eliminarImagen = async (id) => {
    const confirmacion = confirm('¿Estás seguro de eliminar esta imagen?');
    if (!confirmacion) return;

    try {
      const res = await fetch(`https://backend-inventario-final.onrender.com/api/combos/${id}`, {
        method: 'DELETE'
      });

      const data = await res.json();
      if (res.ok) {
        setImagenes(prev => prev.filter(img => img.id !== id));
      } else {
        alert(`❌ Error al eliminar: ${data.mensaje}`);
      }
    } catch (err) {
      console.error('❌ Error al eliminar imagen:', err);
    }
  };

  const cerrarSesion = () => {
    localStorage.clear();
    navigate('/login');
  };

  return (
    <div className="menu-container">
      <div className="menu-header">
        <h2 className="menu-bienvenida">Bienvenido, {nombreUsuario}</h2>
        <Button
          label="Cerrar sesión"
          icon="pi pi-sign-out"
          className="p-button-danger"
          onClick={cerrarSesion}
        />
      </div>

      <TabMenu model={items} className="menu-tabs" />

      <div className="menu-combos mt-5">
        <h3 className="text-white text-xl mb-2">🔥 Combos de la Semana</h3>

        {cargando ? (
          <p className="text-white">Cargando combos...</p>
        ) : imagenes.length === 0 ? (
          <p className="text-gray-300">No hay promociones disponibles.</p>
        ) : (
          <div className="menu-combos-carrusel">
            {imagenes.map((img) => (
              <div key={img.id} className="menu-combo-item">
                <img
                  src={img.imagen_url}
                  alt={`combo-${img.id}`}
                  className="menu-combo-img cursor-pointer"
                  onClick={() => setImagenSeleccionada(img.imagen_url)}
                />
                <Button
                  icon="pi pi-trash"
                  className="p-button-danger p-button-sm mt-2"
                  onClick={() => eliminarImagen(img.id)}
                />
              </div>
            ))}
          </div>
        )}

        <label htmlFor="combo-upload" className="p-button p-button-primary mt-3 inline-block cursor-pointer">
          <i className="pi pi-plus mr-2"></i>Agregar Imagen
        </label>
        <input
          id="combo-upload"
          type="file"
          accept="image/*"
          className="hidden"
          onChange={handleAgregarImagen}
        />
      </div>

      <Dialog
        header="Vista previa"
        visible={!!imagenSeleccionada}
        onHide={() => setImagenSeleccionada(null)}
        modal
        className="w-auto"
      >
        <img
          src={imagenSeleccionada}
          alt="Combo"
          style={{ width: '100%', borderRadius: '10px' }}
        />
      </Dialog>

      <div className="menu-instrucciones">
        <p>Selecciona una pestaña del menú para comenzar.</p>
      </div>
    </div>
  );
};

export default Menu;
