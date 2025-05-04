const API_URL = "http://localhost:5000/api"; // Asegúrate de que el backend corre en este puerto
const token = localStorage.getItem('token');
const user = JSON.parse(localStorage.getItem('user'));

document.addEventListener('DOMContentLoaded', () => {
    
    const listaEventos = document.getElementById('lista-gestion-eventos');
    const formularioEvento = document.getElementById('formulario-evento');
    const btnNuevoEvento = document.getElementById('btn-nuevo-evento');
    const btnCancelarEvento = document.getElementById('btn-cancelar-evento');// cambiar el id de btn-cancelar-evento para unificar y reducir el código
    const eventoIdInput = document.getElementById('evento-id');
    const clienteIdSelect = document.getElementById('cliente-id');
    const fechaInicio = document.getElementById('fecha-inicio');
    const fechaFin = document.getElementById('fecha-fin');
    const horaInicio = document.getElementById('hora-inicio');
    const horaFin = document.getElementById('hora-fin');
    const ubicacionInput = document.getElementById('ubicacion');
    const tituloInput = document.getElementById('titulo');
    const tipoEventoInput = document.getElementById('tipo');
    const modal = document.getElementById('modal-exito');
        

    let eventos = [];
    let clientes = [];
    let eventoEditandoId = null;

    // --- Funciones para obtener datos ---

    async function obtenerEventos() {
        try {
            const response = await fetch(`${API_URL}/eventos/`, {
                method: 'GET',
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json'
                }
            }); // Endpoint para obtener todos los eventos
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            eventos = await response.json();
            renderizarEventos();
        } catch (error) {
            console.error('Error al obtener eventos:', error);
            // Manejar el error visualmente
        }
    }

    async function obtenerClientesParaSelector() {
        try {
            const response = await fetch(`${API_URL}/clientes`, {
                method: 'GET',
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json'
                }
            });

            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            clientes = await response.json();
            renderizarOpcionesClientes();
        } catch (error) {
            console.error('Error al obtener clientes para el selector:', error);
            // Manejar el error visualmente
        }
    }

    // --- Funciones para renderizar la UI ---

    function renderizarEventos() {
        listaEventos.innerHTML = '';
        eventos.forEach(evento => {
            const listItem = document.createElement('li');
            const nombreCliente = evento.Cliente?.nombre || "Desconocido";
            listItem.innerHTML = `
                <div class="evento-info-gestion">
                    <strong>${evento.tipo}</strong> - ${evento.fecha_inicio} (Cliente: ${nombreCliente})
                    <p>${evento.titulo || ''}</p>
                </div>
                <div class="evento-acciones-gestion">
                    <button class="btn-secundario" data-id="${evento.id}">Editar</button>
                    <button class="btn-principal" data-id="${evento.id}">Eliminar</button>
                </div>
            `;
            listaEventos.appendChild(listItem);
        });
    }

    function renderizarOpcionesClientes() {
        clientes.forEach(cliente => {
            const option = document.createElement('option');
            option.value = cliente.id;
            option.textContent = cliente.nombre + ' (' + cliente.email + ')';
            clienteIdSelect.appendChild(option);
        });
    }

    function mostrarFormulario(evento = null) {
        eventoIdInput.value = evento ? evento.id : '';
        clienteIdSelect.value = evento ? evento.clienteId : '';
        fechaInicio.value = evento ? new Date(evento.fechaInicio).toISOString().split('T')[0] : '';
        horaInicio.value = evento ? new Date(evento.horaInicio).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : '';
        tipoEventoInput.value = evento ? evento.tipo : '';
        descripcionEventoInput.value = evento ? evento.descripcion : '';
        ubicacionInput.value = evento ? evento.ubicacion : '';
        tituloInput.value = evento ? evento.titulo : '';
        eventoEditandoId = evento ? evento.id : null;
    }

    function ocultarFormulario() {
        //formularioEvento.reset();
        eventoEditandoId = null;
    }

    // --- Funciones para crear, editar y eliminar eventos ---

    async function crearEvento(eventoData) {
        try {
            const response = await fetch(`${API_URL}/eventos/`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${token}`
                },
                body: JSON.stringify(eventoData),
            });
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            const nuevoEvento = await response.json();
            eventos.push(nuevoEvento);
            renderizarEventos();
            modal.style.display = 'none'; // Cerrar el modal de éxito
        } catch (error) {
            console.error('Error al crear evento:', error);
            // Manejar el error visualmente
        }
    }

    async function editarEvento(id, eventoData) {
        try {
            const response = await fetch(`/api/eventos/${id}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(eventoData),
            });
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            const eventoActualizado = await response.json();
            eventos = eventos.map(evt => evt.id === id ? eventoActualizado : evt);
            renderizarEventos();
        } catch (error) {
            console.error('Error al editar evento:', error);
            // Manejar el error visualmente
        }
    }

    async function eliminarEvento(id) {
        if (confirm('¿Estás seguro de que deseas eliminar este evento?')) {
            try {
                const response = await fetch(`/api/eventos/${id}`, {
                    method: 'DELETE',
                });
                if (!response.ok) {
                    throw new Error(`HTTP error! status: ${response.status}`);
                }
                eventos = eventos.filter(evento => evento.id !== id);
                renderizarEventos();
            } catch (error) {
                console.error('Error al eliminar evento:', error);
                // Manejar el error visualmente
            }
        }
    }

    // --- Event Listeners ---

    btnNuevoEvento.addEventListener('click', () => {
        modal.style.display = 'flex';
        //mostrarFormulario();
    });

    btnCancelarEvento.addEventListener('click', () => {
        ocultarFormulario();//este boton es para cambiar el estado del evento a Cancelado - ATENCION
    });

    

    formularioEvento.addEventListener('submit', async (event) => {
        event.preventDefault();
        const eventoData = {
            cliente_id: clienteIdSelect.value,
            fecha_inicio: fechaInicio.value,
            fecha_fin: fechaFin.value,
            hora_inicio: horaInicio.value,
            hora_fin: horaFin.value,
            tipo: tipoEventoInput.value,
            ubicacion: ubicacionInput.value,
            titulo: tituloInput.value,
            usuario_id: user.id,
        };

        if (eventoEditandoId) {
            await editarEvento(eventoEditandoId, eventoData);
        } else {
            await crearEvento(eventoData);
        }
    });

    listaEventos.addEventListener('click', (event) => {
        if (event.target.classList.contains('btn-editar')) {
            const eventoId = event.target.dataset.id;
            const eventoParaEditar = eventos.find(evento => evento.id === parseInt(eventoId));
            if (eventoParaEditar) {
                mostrarFormulario(eventoParaEditar);
            }
        } else if (event.target.classList.contains('btn-eliminar')) {
            const eventoId = event.target.dataset.id;
            eliminarEvento(eventoId);
        }
    });
    document.querySelectorAll('.cerrar').forEach(boton => {
        boton.onclick = () => {
          modal.style.display = 'none';
          location.reload();
        };
      });
    
      // Cerrar si se hace clic fuera del modal
      window.onclick = function (e) {
        if (e.target === modal) {
          modal.style.display = 'none';
          location.reload();
        }
      };

    // --- Carga inicial de datos ---
    obtenerEventos();
    obtenerClientesParaSelector();
});