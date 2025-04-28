const API_URL = "http://localhost:5000/api"; // Asegúrate de que el backend corre en este puerto

document.addEventListener('DOMContentLoaded', () => {
    // Elementos del resumen rápido
    const totalClientesElement = document.getElementById('total-clientes');
    const nuevosClientesMesElement = document.getElementById('nuevos-clientes-mes');
    const mensajesPendientesElement = document.getElementById('mensajes-pendientes');
    const eventosProximosSemanaElement = document.getElementById('eventos-proximos-semana');

    // Tabla de clientes
    const tablaClientesBody = document.getElementById('tabla-clientes-body');
    const filtroEstadoCliente = document.getElementById('filtro-estado-cliente');
    const buscarClienteInput = document.getElementById('buscar-cliente');

    // Tabla de mensajes
    const tablaMensajesBody = document.getElementById('tabla-mensajes-body');
    const filtroEstadoMensaje = document.getElementById('filtro-estado-mensaje');

    // Lista de eventos
    const listaEventosProximos = document.getElementById('lista-eventos-proximos');
    const filtroRangoEventos = document.getElementById('filtro-rango-eventos');

    // --- Funciones para obtener y mostrar datos ---
    async function obtenerResumen() {
        try {
            const response = await fetch(`${API_URL}/dashboard/resumen`); // Reemplaza con tu endpoint real
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            const data = await response.json();
            totalClientesElement.textContent = data.totalClientes || 0;
            nuevosClientesMesElement.textContent = data.nuevosClientesMes || 0;
            mensajesPendientesElement.textContent = data.mensajesPendientes || 0;
            eventosProximosSemanaElement.textContent = data.eventosProximosSemana || 0;
        } catch (error) {
            console.error('Error al obtener el resumen:', error);
            // Manejar el error visualmente en el dashboard
        }
    }

    async function obtenerClientes(filtroEstado = '', busqueda = '') {
        try {
            const response = await fetch(`${API_URL}/clientes?estado=${filtroEstado}&q=${busqueda}`); // Reemplaza con tu endpoint real
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            const clientes = await response.json();
            renderizarClientes(clientes);
        } catch (error) {
            console.error('Error al obtener clientes:', error);
            // Manejar el error visualmente
        }
    }

    function renderizarClientes(clientes) {
        tablaClientesBody.innerHTML = '';
        clientes.forEach(cliente => {
            const row = tablaClientesBody.insertRow();
            row.insertCell().textContent = cliente.nombre;
            row.insertCell().textContent = cliente.email;
            //row.insertCell().textContent = new Date(cliente.fechaRegistro).toLocaleDateString();
            row.insertCell().textContent = cliente.estado;
            const accionesCell = row.insertCell();
            accionesCell.innerHTML = '<button class="btn-ver-detalle" data-id="' + cliente.id + '">Ver</button>';
            // Aquí podrías añadir más botones para editar o cambiar estado
        });
    }

    async function obtenerMensajes(filtroEstado = '') {
        try {
            const response = await fetch(`${API_URL}/mensajes?estado=${filtroEstado}`); // Reemplaza con tu endpoint real
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            const mensajes = await response.json();
            renderizarMensajes(mensajes);
        } catch (error) {
            console.error('Error al obtener mensajes:', error);
            // Manejar el error visualmente
        }
    }

    function renderizarMensajes(mensajes) {
        tablaMensajesBody.innerHTML = '';
        mensajes.forEach(mensaje => {
            const row = tablaMensajesBody.insertRow();
            row.insertCell().textContent = new Date(mensaje.fecha).toLocaleDateString();
            row.insertCell().textContent = mensaje.nombre;
            row.insertCell().textContent = mensaje.email;
            row.insertCell().textContent = mensaje.asunto;
            row.insertCell().textContent = mensaje.estado;
            const accionesCell = row.insertCell();
            accionesCell.innerHTML = '<button class="btn-ver-detalle-mensaje" data-id="' + mensaje.id + '">Ver</button><button class="btn-marcar-leido" data-id="' + mensaje.id + '">Leído</button>';
            // Aquí podrías añadir más botones para responder
        });
    }

    async function obtenerEventosProximos(rangoDias = 7) {
        try {
            const response = await fetch(`${API_URL}/eventos/proximos?dias=${rangoDias}`); // Reemplaza con tu endpoint real
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            const eventos = await response.json();
            renderizarEventosProximos(eventos);
        } catch (error) {
            console.error('Error al obtener eventos próximos:', error);
            // Manejar el error visualmente
        }
    }

    function renderizarEventosProximos(eventos) {
        listaEventosProximos.innerHTML = '';
        eventos.forEach(evento => {
            const listItem = document.createElement('li');
            listItem.classList.add('evento-item');
            listItem.innerHTML = `
                <div class="evento-info">
                    <strong>${evento.nombreCliente}</strong> - ${new Date(evento.fechaEvento).toLocaleDateString()} (${evento.tipo})
                </div>
                <div class="evento-acciones">
                    <button class="btn-ver-invitacion" data-id="${evento.id}">Ver Invitación</button>
                </div>
            `;
            listaEventosProximos.appendChild(listItem);
        });
    }

    // --- Event Listeners para los filtros ---
    filtroEstadoCliente.addEventListener('change', () => {
        obtenerClientes(filtroEstadoCliente.value, buscarClienteInput.value);
    });

    buscarClienteInput.addEventListener('input', () => {
        obtenerClientes(filtroEstadoCliente.value, buscarClienteInput.value);
    });

    filtroEstadoMensaje.addEventListener('change', () => {
        obtenerMensajes(filtroEstadoMensaje.value);
    });

    filtroRangoEventos.addEventListener('change', () => {
        obtenerEventosProximos(filtroRangoEventos.value);
    });

    // --- Carga inicial de datos ---
    obtenerResumen();
    obtenerClientes();
    obtenerMensajes();
    obtenerEventosProximos();
}); // <- Llave de cierre añadida aquí