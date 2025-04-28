function generarInvitacion() {
    // Obtener valores del formulario
    let nombres = document.getElementById("nombres").value;
    let fecha = document.getElementById("fecha").value;
    let ubicacion = document.getElementById("ubicacion").value;
    let mensaje = document.getElementById("mensaje").value;

    // Validación simple
    if (!nombres || !fecha || !ubicacion || !mensaje) {
        alert("Por favor, completa todos los campos.");
        return;
    }

    // Mostrar valores en la invitación
    document.getElementById("prev-nombres").textContent = nombres;
    document.getElementById("prev-fecha").textContent = "📅 Fecha: " + fecha;
    document.getElementById("prev-ubicacion").textContent = "📍 Ubicación: " + ubicacion;
    document.getElementById("prev-mensaje").textContent = "💌 " + mensaje;

    // Mostrar invitación
    document.getElementById("invitacion").style.display = "block";
}
