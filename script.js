const userDisplay = document.getElementById("user-display");
const logoutBtn = document.getElementById("logout");
const fichasSelect = document.getElementById("fichas");
const busquedaInput = document.getElementById("busqueda");
const tablaBody = document.querySelector("#tabla-aprendices tbody");

const API_URL = "https://raw.githubusercontent.com/CesarMCuellarCha/apis/refs/heads/main/SENA-CTPI.matriculados.json";
let datosGlobal = [];

if (!localStorage.getItem("usuario")) {
  window.location.href = "login.html";
} else {
  userDisplay.textContent = localStorage.getItem("usuario");
  cargarDatos();
}

logoutBtn.addEventListener("click", () => {
  localStorage.clear();
  window.location.href = "login.html";
});

async function cargarDatos() {
  try {
    const res = await fetch(API_URL);
    const datos = await res.json();
    datosGlobal = datos;

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

    busquedaInput.addEventListener("input", () => {
      const texto = busquedaInput.value.toLowerCase();
      const lista = datos.filter(a => a.PROGRAMA.toLowerCase().includes(texto));
      mostrarAprendices(lista);
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
