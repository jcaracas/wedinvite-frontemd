document.addEventListener('DOMContentLoaded', async () => {
  const token = localStorage.getItem('token');
  if (!token) {
    alert("No tienes una sesión activa. Por favor inicia sesión.");
    window.location.href = 'login.html';
    return;
    }
    
  
    try {
      const response = await fetch('http://localhost:5000/api/contacto/mensajes', {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });
  
      if (!response.ok) {
        const errorData = await response.json();
        console.error('Error del servidor:', errorData);
        throw new Error(errorData.message || 'Token inválido o expirado');
      }
  
      const mensajes = await response.json();
      const contenedor = document.getElementById('mensajes');
  
      if (mensajes.length === 0) {
        contenedor.innerHTML = '<p>No hay mensajes por mostrar.</p>';
        return;
      }
  
      mensajes.forEach(mensaje => {
        const div = document.createElement('div');
        div.className = 'mensaje';
        div.innerHTML = `
          <strong>Nombre:</strong> ${mensaje.nombre}<br>
          <strong>Email:</strong> ${mensaje.email}<br>
          <strong>Mensaje:</strong> ${mensaje.mensaje}
        `;
        contenedor.appendChild(div);
      });
  
    } catch (error) {
      alert(error.message);
      localStorage.removeItem('token');
      window.location.href = 'login.html';
    }
    
  });
  
  function logout() {
    localStorage.removeItem('token');
    window.location.href = 'login.html';
  }