  document.addEventListener("DOMContentLoaded", () => {
    const authLink = document.querySelector(".navbar-menu a[href$='login.html']");
    const navbarMenu = document.querySelector(".navbar-menu");
  
    if (!authLink || !navbarMenu) {
      console.error("No se encontró el enlace de autenticación o el menú.");
      return;
    }
  
    const token = localStorage.getItem("token");
    const user = JSON.parse(localStorage.getItem("user"));
  
    if (token && user) {
      // Si está logueado, mostrar nombre y Logout
      const userNameLink = document.createElement("span");
      userNameLink.textContent = `👤 ${user.nombre}`;
      userNameLink.classList.add("user-name"); 
  
      const logoutLink = document.createElement("a");
      logoutLink.href = "#";
      logoutLink.textContent = "Logout";
      logoutLink.addEventListener("click", () => {
        localStorage.removeItem("token");
        localStorage.removeItem("user");
        window.location.href = "./login.html";
      });
  
      // Limpiar menú y agregar nombre + logout
      navbarMenu.innerHTML = ""; 
      navbarMenu.appendChild(userNameLink);
      navbarMenu.appendChild(logoutLink);
      navbarMenu.innerHTML += `
        <a href="./dashboard.html">Dashboard</a>
      `;
    } else {
      // Si no está logueado, mostrar Login y Registrar
      navbarMenu.innerHTML = `
        <a href="./login.html">Login</a>
        <a href="./register.html">Registrar</a>
      `;
    }
  });
  
  
