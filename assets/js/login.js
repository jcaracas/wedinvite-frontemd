document.getElementById("loginForm").addEventListener("submit", async (e) => {
  e.preventDefault();

  const email = document.getElementById("email").value;
  const contrasenia = document.getElementById("password").value;

  try {
    const response = await fetch("http://localhost:5000/api/usuarios/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, contrasenia }),
    });

    const data = await response.json();
    
    if (response.ok) {
      localStorage.setItem("token", data.token); // Guardamos el token
      localStorage.setItem('user', JSON.stringify(data.user)); // Guardamos el usuario
      document.getElementById("mensaje").innerText = "✅ Login exitoso";
      // Redirigir al dashboard
      window.location.href = "dashboard.html";
    } else {
      document.getElementById("mensaje").innerText = "❌ " + data.error;
    }
  } catch (err) {
    console.error("Error en login:", err);
    document.getElementById("mensaje").innerText = "❌ Error en el servidor";
  }
});
