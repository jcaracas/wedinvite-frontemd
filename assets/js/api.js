const API_URL = "http://localhost:5000/api"; // Asegúrate de que el backend corre en este puerto

// Login de usuario
document.getElementById("loginForm")?.addEventListener("submit", async (e) => {
    e.preventDefault();

    const email = document.getElementById("email").value;
    const password = document.getElementById("password").value;

    const response = await fetch(`${API_URL}/usuarios/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
    });

    const data = await response.json();
    if (response.ok) {
        alert("Inicio de sesión exitoso");
        localStorage.setItem("token", data.token); // Guardamos el token
        window.location.href = "./dashboard.html"; // Redirigir a eventos
    } else {
        alert("Error: " + data.message);
    }
});
