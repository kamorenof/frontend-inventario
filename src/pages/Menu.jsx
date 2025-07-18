import React, { useEffect, useState } from 'react';
import { TabMenu } from 'primereact/tabmenu';
import { Button } from 'primereact/button';
import { Dialog } from 'primereact/dialog'; // Para vista ampliada de imágenes
import { useNavigate } from 'react-router-dom';
import '../CSS/Menu.css'; // Hoja de estilos personalizada

const Menu = () => {
  const navigate = useNavigate();
  const nombreUsuario = localStorage.getItem('nombreUsuario') || 'Usuario';

  // Opciones del menú principal
  const items = [
    { label: 'Inicio', icon: 'pi pi-home' },
    { label: 'Productos', icon: 'pi pi-box', command: () => navigate('/productos') },
    { label: 'Movimientos', icon: 'pi pi-arrow-right-arrow-lef', command: () => navigate('/movimientos') },
    { label: 'Historial', icon: 'pi pi-calendar', command: () => navigate('/historial') },
    { label: 'Inventario', icon: 'pi pi-box', command: () => navigate('/inventario') },
    { label: 'Reportes', icon: 'pi pi-chart-line' }
  ];

  // Estados para imágenes
  const [imagenes, setImagenes] = useState([]);
  const [cargando, setCargando] = useState(true);
  const [imagenSeleccionada, setImagenSeleccionada] = useState(null); // Imagen para vista grande

  // Al montar, obtener las imágenes guardadas en el servidor
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

  // Subir nueva imagen
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
        setImagenes(prev => [...prev, {
          filename: data.filename,
          url: `https://backend-inventario-final.onrender.com/uploads/combos/${data.filename}`
        }]);
      } else {
        alert(`❌ Error al subir: ${data.mensaje}`);
      }
    } catch (err) {
      console.error('❌ Error al subir imagen:', err);
    }
  };

  // Eliminar imagen del servidor y del estado
  const eliminarImagen = async (filename) => {
    const confirmacion = confirm('¿Estás seguro de eliminar esta imagen?');
    if (!confirmacion) return;

    try {
      const res = await fetch(`https://backend-inventario-final.onrender.com/api/combos/${filename}`, {
        method: 'DELETE'
      });
      const data = await res.json();

      if (res.ok) {
        setImagenes(prev => prev.filter(img => img.filename !== filename));
      } else {
        alert(`❌ Error al eliminar: ${data.mensaje}`);
      }
    } catch (err) {
      console.error('❌ Error al eliminar imagen:', err);
    }
  };

  // Cerrar sesión
  const cerrarSesion = () => {
    localStorage.clear();
    navigate('/login');
  };

  return (
    <div className="menu-container">
      {/* Encabezado con bienvenida y botón de logout */}
      <div className="menu-header">
        <h2 className="menu-bienvenida">Bienvenido, {nombreUsuario}</h2>
        <Button
          label="Cerrar sesión"
          icon="pi pi-sign-out"
          className="p-button-danger"
          onClick={cerrarSesion}
        />
      </div>

      {/* Menú de navegación */}
      <TabMenu model={items} className="menu-tabs" />

      {/* Sección de combos de la semana */}
      <div className="menu-combos mt-5">
        <h3 className="text-white text-xl mb-2">🔥 Combos de la Semana</h3>

        {cargando ? (
          <p className="text-white">Cargando combos...</p>
        ) : imagenes.length === 0 ? (
          <p className="text-gray-300">No hay promociones disponibles.</p>
        ) : (
          <div className="menu-combos-carrusel">
            {imagenes.map((img) => (
              <div key={img.filename} className="menu-combo-item">
                <img
                  src={img.url}
                  alt={img.filename}
                  className="menu-combo-img cursor-pointer"
                  onClick={() => setImagenSeleccionada(img.url)}
                />
                <Button
                  icon="pi pi-trash"
                  className="p-button-danger p-button-sm mt-2"
                  onClick={() => eliminarImagen(img.filename)}
                />
              </div>
            ))}
          </div>
        )}

        {/* Botón para agregar imagen */}
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

      {/* Diálogo con imagen grande */}
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

      {/* Instrucciones al final */}
      <div className="menu-instrucciones">
        <p>Selecciona una pestaña del menú para comenzar.</p>
      </div>
    </div>
  );
};

export default Menu;
