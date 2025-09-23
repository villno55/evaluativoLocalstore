const apiUrl = "https://raw.githubusercontent.com/CesarMCuellarCha/apis/refs/heads/main/SENA-CTPI.matriculados.json";

document.getElementById("loginForm").addEventListener("submit", (e) => {
  e.preventDefault();
  const usuario = document.getElementById("usuario").value;
  const password = document.getElementById("password").value;

  if (password === "adso3064975") {
    localStorage.setItem("usuario", usuario);
    mostrarApp();
  } else {
    alert("Credenciales incorrectas");
  }
});

function mostrarApp() {
  const usuario = localStorage.getItem("usuario");
  if (!usuario) return;

  document.getElementById("login").style.display = "none";
  document.getElementById("app").style.display = "block";
  document.getElementById("nombreUsuario").textContent = usuario;

  cargarFichas();
}

document.getElementById("logout").addEventListener("click", () => {
  localStorage.clear();
  location.reload();
});

async function cargarFichas() {
  const resp = await fetch(apiUrl);
  const data = await resp.json();

  const fichas = [...new Set(data.map(item => item.ficha.codigo))];
  const select = document.getElementById("fichas");
  select.innerHTML = "<option value=''>-- Seleccione --</option>";

  fichas.forEach(codigo => {
    const option = document.createElement("option");
    option.value = codigo;
    option.textContent = codigo;
    select.appendChild(option);
  });

  select.addEventListener("change", () => mostrarAprendices(data, select.value));
}

function mostrarAprendices(data, codigoFicha) {
  const tbody = document.getElementById("tablaAprendices");
  tbody.innerHTML = "";

  const aprendices = data.filter(item => item.ficha.codigo == codigoFicha);

  if (aprendices.length > 0) {
    // Guardar datos de la ficha en localStorage
    const { ficha } = aprendices[0];
    localStorage.setItem("ficha", JSON.stringify({
      codigo: ficha.codigo,
      programa: ficha.programa,
      nivel: ficha.nivel,
      estado: ficha.estado
    }));

    aprendices.forEach(a => {
      const tr = document.createElement("tr");
      if (a.estado === "Retiro Voluntario") tr.classList.add("retiro");
      tr.innerHTML = `
        <td>${a.documento}</td>
        <td>${a.nombre}</td>
        <td>${a.ficha.codigo}</td>
        <td>${a.estado}</td>
      `;
      tbody.appendChild(tr);
    });
  }
}

window.onload = () => {
  if (localStorage.getItem("usuario")) {
    mostrarApp();
  }
};
