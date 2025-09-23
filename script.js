const loginForm = document.getElementById("login-form");
const loginContainer = document.getElementById("login-container");
const appContainer = document.getElementById("app-container");
const userDisplay = document.getElementById("user-display");
const logoutBtn = document.getElementById("logout");
const fichasSelect = document.getElementById("fichas");
const tablaBody = document.querySelector("#tabla-aprendices tbody");

const API_URL = "https://raw.githubusercontent.com/CesarMCuellarCha/apis/refs/heads/main/SENA-CTPI.matriculados.json";

loginForm.addEventListener("submit", (e) => {
  e.preventDefault();
  const username = document.getElementById("username").value.trim();
  const password = document.getElementById("password").value.trim();

  if (password === "adso3064975" && username !== "") {
    localStorage.setItem("usuario", username);
    mostrarApp();
  } else {
    alert("Usuario o contraseña incorrectos");
  }
});

function mostrarApp() {
  const usuario = localStorage.getItem("usuario");
  if (usuario) {
    userDisplay.textContent = usuario;
    loginContainer.classList.add("hidden");
    appContainer.classList.remove("hidden");
    cargarDatos();
  }
}

logoutBtn.addEventListener("click", () => {
  localStorage.clear();
  appContainer.classList.add("hidden");
  loginContainer.classList.remove("hidden");
});

async function cargarDatos() {
  try {
    const res = await fetch(API_URL);
    const datos = await res.json();

    const fichasUnicas = [...new Set(datos.map(a => a.FICHA))];
    fichasSelect.innerHTML = `<option value="">Seleccione...</option>`;
    fichasUnicas.forEach(f => {
      fichasSelect.innerHTML += `<option value="${f}">${f}</option>`;
    });

    fichasSelect.addEventListener("change", () => {
      const fichaSel = fichasSelect.value;
      if (fichaSel) {
        const lista = datos.filter(a => a.FICHA == fichaSel);
        mostrarAprendices(lista);
        const infoFicha = lista[0];
        localStorage.setItem("ficha", JSON.stringify({
          codigo: infoFicha.FICHA,
          programa: infoFicha.PROGRAMA,
          nivel: infoFicha.NIVEL_DE_FORMACION,
          estado: infoFicha.ESTADO_FICHA
        }));
      }
    });
  } catch (error) {
    console.error("Error al cargar datos:", error);
    alert("No se pudo cargar la información.");
  }
}

function mostrarAprendices(lista) {
  tablaBody.innerHTML = "";
  lista.forEach(a => {
    const tr = document.createElement("tr");
    if (a.ESTADO_APRENDIZ === "Retiro Voluntario") {
      tr.classList.add("retiro");
    }
    tr.innerHTML = `
      <td>${a.NUMERO_DOCUMENTO}</td>
      <td>${a.NOMBRE} ${a.PRIMER_APELLIDO} ${a.SEGUNDO_APELLIDO}</td>
      <td>${a.FICHA}</td>
      <td>${a.PROGRAMA}</td>
      <td>${a.ESTADO_APRENDIZ}</td>
    `;
    tablaBody.appendChild(tr);
  });
}

if (localStorage.getItem("usuario")) {
  mostrarApp();
}
