document.addEventListener('DOMContentLoaded', () => {
    const modal = document.getElementById('mensajeModal');
    const closeBtn = document.querySelector('.close-modal');
    const nombreElem = document.getElementById('modal-nombre');
    const emailElem = document.getElementById('modal-email');
    const mensajeElem = document.getElementById('modal-mensaje');
    const respuestaElem = document.getElementById('respuesta');
  
    // Mostrar el modal con datos del mensaje
    document.querySelectorAll('.ver-mensaje-btn').forEach(btn => {
      btn.addEventListener('click', async () => {
        const id = btn.getAttribute('data-id');
        const res = await fetch(`/api/contacto/mensajes/${id}`, {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('token')}`
          }
        });
        const data = await res.json();
  
        nombreElem.textContent = `Nombre: ${data.nombre}`;
        emailElem.textContent = `Email: ${data.email}`;
        mensajeElem.textContent = `Mensaje: ${data.mensaje}`;
        respuestaElem.value = "";
  
        modal.classList.remove('hidden');
  
        // Cambiar estado a leído
        await actualizarEstado(id, "Leído");
  
        document.getElementById('marcar-nuevo').onclick = () => actualizarEstado(id, "Nuevo");
        document.getElementById('responder-mensaje').onclick = () => actualizarEstado(id, "Respondido");
      });
    });
  
    closeBtn.addEventListener('click', () => {
      modal.classList.add('hidden');
    });
  
    async function actualizarEstado(id, estado) {
      await fetch(`/api/contacto/mensajes/${id}/estado`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${localStorage.getItem('token')}`
        },
        body: JSON.stringify({ estado })
      });
      modal.classList.add('hidden');
      location.reload();
    }
  });
  