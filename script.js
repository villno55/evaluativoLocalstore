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
  const res = await fetch(API_URL);
  const datos = await res.json();

  const fichasUnicas = [...new Set(datos.map(a => a.ficha))];
  fichasSelect.innerHTML = `<option value="">Seleccione...</option>`;
  fichasUnicas.forEach(f => {
    fichasSelect.innerHTML += `<option value="${f}">${f}</option>`;
  });

  fichasSelect.addEventListener("change", () => {
    const fichaSel = fichasSelect.value;
    if (fichaSel) {
      mostrarAprendices(datos.filter(a => a.ficha == fichaSel));

      const infoFicha = datos.find(a => a.ficha == fichaSel);
      if (infoFicha) {
        localStorage.setItem("ficha", JSON.stringify({
          codigo: infoFicha.ficha,
          programa: infoFicha.programa,
          nivel: infoFicha.nivel,
          estado: infoFicha.estadoFicha
        }));
      }
    }
  });
}


function mostrarAprendices(lista) {
  tablaBody.innerHTML = "";
  lista.forEach(a => {
    const tr = document.createElement("tr");
    if (a.estadoAprendiz === "Retiro Voluntario") {
      tr.classList.add("retiro");
    }
    tr.innerHTML = `
      <td>${a.documento}</td>
      <td>${a.nombre}</td>
      <td>${a.ficha}</td>
      <td>${a.programa}</td>
      <td>${a.estadoAprendiz}</td>
    `;
    tablaBody.appendChild(tr);
  });
}

if (localStorage.getItem("usuario")) {
  mostrarApp();
}
