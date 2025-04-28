document.getElementById('registroForm').addEventListener('submit', async function (e) {
  e.preventDefault();

  const nombre = document.getElementById('nombre').value.trim();
  const email = document.getElementById('email').value.trim();
  const contrasenia = document.getElementById('contraseña').value.trim();
  const tipo_usuario = document.getElementById('tipo_usuario').value;

  const mensajeDiv = document.getElementById('mensaje');
  mensajeDiv.textContent = '';

  if (!nombre || !email || !contrasenia) {
    mensajeDiv.textContent = 'Todos los campos son obligatorios.';
    return;
  }

  try {
    const response = await fetch('http://localhost:5000/api/usuarios/registro', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ nombre, email, contrasenia, tipo_usuario }),
    });

    const data = await response.json();

    if (response.ok) {
      document.getElementById('registroForm').reset();
      document.getElementById('modal-exito').style.display = 'flex'; // Muestra modal de éxito
    } else {
      // Mostrar el mensaje de error específico en el modal
      const mensajeError = data.message || 'Ocurrió un error inesperado.';
      document.querySelector('#modal-error p').textContent = mensajeError;
      document.getElementById('modal-error').style.display = 'flex'; // Muestra modal de error
    }
  } catch (err) {
    // Mostrar un mensaje de error genérico en caso de fallo de red
    document.querySelector('#modal-error p').textContent = 'Error de conexión. Por favor, intenta nuevamente.';
    document.getElementById('modal-error').style.display = 'flex'; // Muestra modal de error
  }
});

// Cerrar el modal de éxito
document.querySelector('.cerrar').onclick = function () {
  document.getElementById('modal-exito').style.display = 'none';
};

// Cerrar el modal de error
document.querySelectorAll('.cerrar').forEach(boton => {
  boton.addEventListener('click', function () {
    const modal = boton.closest('.modal');
    modal.style.display = 'none';
  });
});

// Cerrar el modal al hacer clic fuera de él
window.onclick = function (e) {
  const modalExito = document.getElementById('modal-exito');
  const modalError = document.getElementById('modal-error');
  if (e.target === modalExito) {
    modalExito.style.display = 'none';
  }
  if (e.target === modalError) {
    modalError.style.display = 'none';
  }
};