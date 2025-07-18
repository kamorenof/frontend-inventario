// Importamos los hooks y componentes necesarios
import React, { useState } from 'react';
import { InputText } from 'primereact/inputtext';
import { Password } from 'primereact/password';
import { Button } from 'primereact/button';
import { Card } from 'primereact/card';
import { useNavigate, Link } from 'react-router-dom';
import '../CSS/RegistroUsuario.css';

const RegistroUsuario = () => {
  // Estados para campos del formulario
  const [nombre, setNombre] = useState('');
  const [correo, setCorreo] = useState('');
  const [password, setPassword] = useState('');
  const [mensaje, setMensaje] = useState(null);
  const navigate = useNavigate();

  // Función para registrar usuario
  const registrar = async () => {
    if (!nombre || !correo || !password) {
      setMensaje('Todos los campos son obligatorios');
      return;
    }

    try {
      const response = await fetch('https://backend-inventario-final.onrender.com/api/usuarios/registro', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ nombre, correo, password })
      });

      const data = await response.json();

      if (response.status === 201) {
        setMensaje('✅ Usuario registrado correctamente');
        setTimeout(() => navigate('/login'), 1500);
      } else {
        setMensaje(`❌ ${data.mensaje || 'Error al registrar'}`);
      }
    } catch {
      setMensaje('❌ Error de conexión con el servidor');
    }
  };

  return (
    <div className="registro-container">
      <Card title="Registro de Usuario" className="registro-card">
        <div className="registro-form">
          {/* Campo: nombre */}
          <span className="p-float-label">
            <InputText id="nombre" value={nombre} onChange={(e) => setNombre(e.target.value)} />
            <label htmlFor="nombre">Nombre</label>
          </span>

          {/* Campo: correo */}
          <span className="p-float-label">
            <InputText id="correo" value={correo} onChange={(e) => setCorreo(e.target.value)} />
            <label htmlFor="correo">Correo electrónico</label>
          </span>

          {/* Campo: contraseña */}
          <span className="p-float-label">
            <Password id="password" value={password} onChange={(e) => setPassword(e.target.value)} toggleMask feedback={false} />
            <label htmlFor="password">Contraseña</label>
          </span>

          {/* Botón para registrar */}
          <Button label="Registrarse" icon="pi pi-user-plus" onClick={registrar} className="w-full" />

          {/* Mensaje de error o éxito */}
          {mensaje && <small className="registro-mensaje">{mensaje}</small>}

          {/* Enlace a login */}
          <div className="registro-link">
            <span>¿Ya tienes cuenta? </span>
            <Link to="/login">Inicia sesión</Link>
          </div>
        </div>
      </Card>
    </div>
  );
};

export default RegistroUsuario;
