const API_URL = "http://localhost:5000/api"; // Asegúrate de que el backend corre en este puerto
const modal = document.getElementById("mensajeModal");
const modalNombre = document.getElementById("modalNombre");
const modalEmail = document.getElementById("modalEmail");
const modalMensajeTexto = document.getElementById("modalMensajeTexto");
const modalEstado = document.getElementById("modalEstado");
const modalRespuesta = document.getElementById("modalRespuesta");
const closeModal = document.querySelector(".close-modal");
const abrirModal = document.getElementById("btn-agregar-cliente");
const modalCliente = document.getElementById("modal-cliente");
let mensajeActual = null;
const token = localStorage.getItem('token');

document.addEventListener('DOMContentLoaded', () => {
    // Verificar si el token existe
    
    if (!token) {
        alert("No tienes una sesión activa. Por favor inicia sesión.");
        window.location.href = './login.html';
        return;
    }else{

        try{
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
                    const response = await fetch(`${API_URL}/dashboard/resumen`, {
                        method: 'GET',
                        headers: {
                            'Authorization': `Bearer ${token}`,
                            'Content-Type': 'application/json'
                        }
                    });
            
                    if (!response.ok) {
                        if (response.status === 401) {
                            alert("Tu sesión ha expirado. Por favor, inicia sesión nuevamente.");
                            localStorage.removeItem("token");
                            window.location.href = "/login.html";
                            return;
                        }
                        throw new Error(`HTTP error! status: ${response.status}`);
                    }
            
                    const data = await response.json();
                    totalClientesElement.textContent = data.totalClientes || 0;
                    nuevosClientesMesElement.textContent = data.nuevosClientesMes || 0;
                    mensajesPendientesElement.textContent = data.mensajesPendientes || 0;
                    eventosProximosSemanaElement.textContent = data.eventosProximosSemana || 0;
            
                } catch (error) {
                    console.error('Error al obtener el resumen:', error);
                    // Mostrar mensaje de error en la interfaz si lo deseas
                }
            }
            

            async function obtenerClientes(filtroEstado = '', busqueda = '') {
                try {
                    const response = await fetch(`${API_URL}/clientes?estado=${filtroEstado}&q=${busqueda}`, {
                        method: 'GET',
                        headers: {
                            'Authorization': `Bearer ${token}`,
                            'Content-Type': 'application/json'
                        }
                    }); // Reemplaza con tu endpoint real
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
                    const emailCell = row.insertCell();
                    emailCell.textContent = cliente.email;
                    emailCell.classList.add("hide-on-mobile");
                    //row.insertCell().textContent = new Date(cliente.fechaRegistro).toLocaleDateString();
                    row.insertCell().textContent = cliente.estado;
                    const accionesCell = row.insertCell();
                    accionesCell.innerHTML = '<button class="btn-principal verCliente" data-id="' + cliente.id + '" >Ver</button>';
                    // Aquí podrías añadir más botones para editar o cambiar estado
                });

                // Asignar eventos después de renderizar
                document.querySelectorAll('.verCliente').forEach(boton => {
                    boton.addEventListener('click', function () {
                        const idCliente = this.dataset.id;
                        console.log("ID del cliente:", idCliente);
                        modalCliente.style.display = 'flex';
                        cargarClientePorId(idCliente)
                        document.querySelectorAll('.cerrar').forEach(boton => {
                            boton.onclick = () => {
                            modalCliente.style.display = 'none';
                            
                            };
                        });
                        // Cerrar si se hace clic fuera del modal
                        window.onclick = function (e) {
                            if (e.target === modalCliente) {
                            modalCliente.style.display = 'none';
                            //location.reload();
                            }
                        };
                    });
                });
            }

            async function obtenerMensajes(filtroEstado = '') {
                if (!token) {
                    console.warn("No se encontró el token. Redirigiendo a login...");
                    window.location.href = "/login.html"; // O muestra un mensaje
                    return;
                }
            
                try {
                    const response = await fetch(`${API_URL}/contacto/mensajes?estado=${filtroEstado}`, {
                        method: 'GET',
                        headers: {
                            'Authorization': `Bearer ${token}`,
                            'Content-Type': 'application/json'
                        }
                    });
            
                    if (!response.ok) {
                        if (response.status === 401) {
                            alert("Tu sesión ha expirado. Por favor, inicia sesión nuevamente.");
                            localStorage.removeItem("token");
                            window.location.href = "/login.html";
                            return;
                        }
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
            
                    // Fecha
                    row.insertCell().textContent = new Date(mensaje.createdAt).toLocaleDateString();
            
                    // Nombre con evento para abrir modal
                    const nombreCell = row.insertCell();
                    const nombreLink = document.createElement('span');
                    nombreLink.textContent = mensaje.nombre;
                    nombreLink.style.cursor = 'pointer';
                    nombreLink.style.color = '#007bff'; // Azul para parecer un link
                    nombreLink.dataset.id = mensaje.id;
            
                    nombreLink.addEventListener('click', () => abrirModalMensaje(mensaje));
                    
                    nombreCell.appendChild(nombreLink);
            
                    // Email y estado
                    const emailCell = row.insertCell();
                    emailCell.textContent = mensaje.email;
                    emailCell.classList.add("hide-on-mobile");
                    row.insertCell().textContent = mensaje.estado;
                });
            }
            

            async function obtenerEventosProximos(rangoDias = 7) {
            // const token = localStorage.getItem("token");
            
                try {
                    const response = await fetch(`${API_URL}/eventos/proximos?dias=${rangoDias}`, {
                        method: 'GET',
                        headers: {
                            'Authorization': `Bearer ${token}`,
                            'Content-Type': 'application/json'
                        }
                    }); // Reemplaza con tu endpoint real
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
                            <strong>${evento.nombreCliente}</strong> - ${evento.fecha_inicio} (${evento.tipo})
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
        }catch (error) {
            console.error('Error en el script:', error);
            alert("Ocurrió un error al cargar la página. Por favor, iicia sesion.");
        }
    }
}); // <- Llave de cierre añadida aquí


async function abrirModalMensaje(mensaje) {
    // Mostrar datos en el modal
    mensajeActual = mensaje;
    modalNombre.textContent = mensaje.nombre;
    modalEmail.textContent = mensaje.email;
    modalMensajeTexto.textContent = mensaje.mensaje;
    modalRespuesta.value = mensaje.respuesta || "";
      
    // Mostrar el modal
    const modal = document.getElementById('modal-exito');
    modal.style.display = 'flex';
  
    // Cambiar estado a "Leído" si no lo está ya
    if (mensaje.estado !== "Leído") {
      await actualizarEstado(mensaje.id, "Leído");
    }
  
    // Botón para marcar como "Nuevo"
    document.getElementById('marcar-nuevo').onclick = async () => {
      await actualizarEstado(mensaje.id, "Nuevo");
      modal.style.display = 'none';
      location.reload();
    };
  
    // Botón para responder y marcar como "Respondido"
    document.getElementById('responder-mensaje').onclick = async () => {
       await actualizarEstado(mensaje.id, "Respondido");
       modal.style.display = 'none';
       location.reload();
    };
  
    // Cerrar modal al presionar la X
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
  }
  
  // Función para actualizar solo el estado
  async function actualizarEstado(id, estado) {
    console.log('Actualizando estado:', id, estado); // Agregado para depuración
    try {
      await fetch(`${API_URL}/contacto/mensajes/${id}/estado`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify({ estado })
        
      });
    } catch (error) {
      console.error('Error al actualizar estado:', error);
    }
  }

  abrirModal.addEventListener('click', function() {
    modalCliente.style.display = 'flex';
    //console.log('Modal cliente abierto');
    document.querySelectorAll('.cerrar').forEach(boton => {
        boton.onclick = () => {
          modalCliente.style.display = 'none';
          
        };
      });
          // Cerrar si se hace clic fuera del modal
    window.onclick = function (e) {
        if (e.target === modalCliente) {
          modalCliente.style.display = 'none';
          //location.reload();
        }
      };
      const cancelar = document.getElementById('btn-cancelar');
        cancelar.addEventListener('click', function() {
            modalCliente.style.display = 'none';
            alert("No se han guardado cambios.");
            
        });
  });

  