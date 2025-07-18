// Importamos los hooks de React y los componentes necesarios
import React, { useState } from 'react';
import { InputText } from 'primereact/inputtext'; // Campo de texto para el correo
import { Password } from 'primereact/password';   // Campo especial para contraseñas
import { Button } from 'primereact/button';       // Botón estilizado de PrimeReact
import { Card } from 'primereact/card';           // Tarjeta estilizada para el formulario
import { useNavigate, Link } from 'react-router-dom'; // Navegación y enlaces entre rutas

// Importamos el archivo de estilos personalizado para este componente
import '../CSS/Login.css';

const LoginUsuario = () => {
  // useState para almacenar el correo ingresado
  const [correo, setCorreo] = useState('');
  // useState para la contraseña ingresada
  const [password, setPassword] = useState('');
  // useState para mostrar mensajes de error o éxito
  const [mensaje, setMensaje] = useState(null);
  // Hook para redireccionar a otras rutas
  const navigate = useNavigate();

  // Función que se ejecuta cuando el usuario hace clic en "Ingresar"
  const iniciarSesion = async () => {
    // Validación: si falta correo o contraseña, mostrar mensaje de error
    if (!correo || !password) {
      setMensaje('Por favor completa todos los campos');
      return;
    }

    try {
      // Hacemos la solicitud POST al backend para iniciar sesión
      const response = await fetch('https://backend-inventario-final.onrender.com/api/usuarios/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' }, // Indicamos que el contenido es JSON
        body: JSON.stringify({ correo, password }) // Enviamos los datos del formulario
      });

      // Convertimos la respuesta en JSON
      const data = await response.json();

      // Si el inicio de sesión fue exitoso...
      if (response.status === 200) {
        // Guardamos el nombre del usuario en el localStorage
        localStorage.setItem('nombreUsuario', data.nombre);
        // Mostramos un mensaje de éxito
        setMensaje('✅ Inicio de sesión exitoso');
        // Esperamos 1.5 segundos y luego redirigimos al menú principal
        setTimeout(() => navigate('/menu'), 1500);
      } else {
        // Si hubo un error, mostramos el mensaje del servidor
        setMensaje(`❌ ${data.mensaje || 'Error al iniciar sesión'}`);
      }
    } catch {
      // Si ocurre un error de conexión, mostramos un mensaje general
      setMensaje('❌ Error de conexión con el servidor');
    }
  };

  return (
    // Contenedor principal centrado en la pantalla
    <div className="login-container">
      {/* Tarjeta estilizada que contiene el formulario */}
      <Card title="Iniciar Sesión" className="login-card">
        <div className="p-fluid space-y-4">
          {/* Campo de entrada para el correo */}
          <span className="p-float-label">
            <InputText
              id="correo"
              value={correo}
              onChange={(e) => setCorreo(e.target.value)} // Actualiza el estado con lo que escribe el usuario
            />
            <label htmlFor="correo">Correo electrónico</label>
          </span>

          {/* Campo de entrada para la contraseña */}
          <span className="p-float-label">
            <Password
              id="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)} // Actualiza la contraseña
              toggleMask // Muestra un ícono para ocultar/mostrar contraseña
              feedback={false} // No mostrar sugerencias de seguridad
            />
            <label htmlFor="password">Contraseña</label>
          </span>

          {/* Botón de ingreso */}
          <Button
            label="Ingresar"
            icon="pi pi-sign-in"
            onClick={iniciarSesion} // Ejecuta la función iniciarSesion
            className="w-full"
          />

          {/* Mensaje de error o éxito */}
          {mensaje && (
            <small className="text-error">{mensaje}</small>
          )}

          {/* Enlace a la página de registro */}
          <div className="login-link">
            <span>¿No estás registrado? </span>
            <Link to="/registro">Regístrate aquí</Link>
          </div>
        </div>
      </Card>
    </div>
  );
};

// Exportamos el componente para poder usarlo en otras partes de la app
export default LoginUsuario;
