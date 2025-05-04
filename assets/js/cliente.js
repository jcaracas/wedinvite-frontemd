const verCliente = document.getElementById('verCliente');
//const modalId = document.getElementById('id');

/*document.addEventListener('DOMContentLoaded', () => {
  cargarClientes();
});*/

document.getElementById('form-cliente').addEventListener('submit', async function (e) {
  e.preventDefault();

  const id = document.getElementById('cliente-id').value;
  const cliente = {
    nombre: document.getElementById('nombre').value,
    email: document.getElementById('email').value,
    telefono: document.getElementById('telefono').value,
    estado: document.getElementById('estado').value,
    direccion: document.getElementById('direccion').value,
  };
  if (id) {
    console.log("Cliente existente, actualizando...",cliente);
    try {
        const response = await fetch(`${API_URL}/clientes/${id}`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
                Authorization: `Bearer ${token}`
            },
            body: JSON.stringify(cliente),
        });

        if (!response.ok) throw new Error("No se pudo actualizar el cliente");

        alert(`Cliente ${id ? 'actualizado' : 'creado'} con éxito`);
        document.getElementById('form-cliente').reset();
        document.getElementById('cliente-id').value = '';
        modalCliente.style.display = 'none';
        location.reload();
        //cargarClientes();
    } catch (error) {
        console.error(error);
        alert("Error al Actualizar el cliente");
    }
  }else{

    try {
        const response = await fetch(`${API_URL}/clientes`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                Authorization: `Bearer ${token}`
            },
            body: JSON.stringify(cliente),
        });

        if (!response.ok) throw new Error("Error al guardar el cliente");

        alert(`Cliente ${id ? 'actualizado' : 'creado'} con éxito`);
        document.getElementById('form-cliente').reset();
        document.getElementById('cliente-id').value = '';
        modalCliente.style.display = 'none';
        location.reload();
        //cargarClientes();
    } catch (error) {
        console.error(error);
        alert("Error al guardar el cliente");
    }
}
});
async function cargarClientePorId(idCliente) {
    try {
      const token = localStorage.getItem('token'); // Asegúrate de que esté disponible
      const response = await fetch(`${API_URL}/clientes/${idCliente}`, {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });
  
      if (!response.ok) {
        throw new Error(`Error HTTP: ${response.status}`);
      }
  
      const cliente = await response.json();
  
      // Aquí puedes hacer lo que quieras con los datos:
      // Por ejemplo, llenar un formulario:
      document.getElementById('cliente-id').value = cliente.id;
      document.getElementById('nombre').value = cliente.nombre;
      document.getElementById('email').value = cliente.email;
      document.getElementById('telefono').value = cliente.telefono;
      document.getElementById('estado').value = cliente.estado;
      document.getElementById('direccion').value = cliente.direccion;
  
      // Mostrar el formulario si está oculto
      //document.getElementById('formulario-cliente').classList.remove('hidden');
  
    } catch (error) {
      console.error('Error al cargar el cliente:', error);
    }
  }
  