// Base URL de la API
const API_URL = "/api/pacientes";

// Función genérica para realizar solicitudes a la API
const fetchAPI = async (endpoint, method = "GET", body = null) => {
    const opciones = {
        method,
        headers: { "Content-Type": "application/json" },
    };
    if (body) opciones.body = JSON.stringify(body);

    try {
        const respuesta = await fetch(endpoint, opciones);
        return await respuesta.json();
    } catch (error) {
        console.error("Error en la solicitud:", error);
        alert("Ocurrió un error, intenta nuevamente.");
    }
};

// Crear un paciente
document.getElementById("formCrearPaciente").addEventListener("submit", async (e) => {
    e.preventDefault();
    const paciente = {
        ID: parseInt(document.getElementById("id").value),
        Nombre: document.getElementById("nombre").value,
        FechaNacimiento: document.getElementById("fechaNacimiento").value,
        FechaInicioTratamiento: document.getElementById("fechaInicioTratamiento").value,
        CostoTratamiento: parseFloat(document.getElementById("costoTratamiento").value),
        EstadoTratamiento: document.getElementById("estadoTratamiento").value === "true",
        FotoInicial: document.getElementById("fotoInicial").value || null,
        HistoriaClinica: document.getElementById("historiaClinica").value || null,
        CategoriaTratamiento: document.getElementById("categoriaTratamiento").value,
    };
    const resultado = await fetchAPI(API_URL, "POST", paciente);
    alert(resultado.mensaje || "Paciente creado con éxito.");
    e.target.reset();
});

// Buscar un paciente por ID
document.getElementById("formBuscarPaciente").addEventListener("submit", async (e) => {
    e.preventDefault();
    const id = document.getElementById("buscarID").value;
    const resultado = await fetchAPI(`${API_URL}/${id}`);
    const contenedor = document.getElementById("resultadoBusqueda");
    if (resultado && resultado.ID) {
        contenedor.innerHTML = `
            <p><strong>Nombre:</strong> ${resultado.Nombre}</p>
            <p><strong>Fecha de Nacimiento:</strong> ${resultado.FechaNacimiento}</p>
            <p><strong>Categoría:</strong> ${resultado.CategoriaTratamiento}</p>
        `;
    } else {
        contenedor.innerHTML = `<p>Paciente no encontrado.</p>`;
    }
});

// Listar todos los pacientes
document.getElementById("btnListarPacientes").addEventListener("click", async () => {
    const pacientes = await fetchAPI(API_URL);
    const tabla = document.getElementById("tablaPacientes").querySelector("tbody");
    tabla.innerHTML = pacientes.map(paciente => `
        <tr>
            <td>${paciente.ID}</td>
            <td>${paciente.Nombre}</td>
            <td>${paciente.HistoriaClinica || "No disponible"}</td>
            <td>${paciente.FechaInicioTratamiento}</td>
            <td>${paciente.CostoTratamiento}</td>
            <td>${paciente.EstadoTratamiento ? "Culminado" : "No Culminado"}</td>
            <td>${paciente.CategoriaTratamiento}</td>
            <td>
                ${paciente.FotoInicial ? 
                    `<img src="${paciente.FotoInicial}" alt="Foto del paciente" width="60" height="60" style="object-fit: cover; border-radius: 10px; cursor: pointer;" onclick="mostrarModal('${paciente.FotoInicial}')">` 
                    : "Sin foto"}
            </td>
        </tr>
    `).join("");
});

// Mostrar la imagen en el modal
function mostrarModal(fotoUrl) {
    const modal = document.getElementById("modal");
    const imgModal = document.getElementById("imgModal");
    imgModal.src = fotoUrl;
    modal.style.display = "block";  // Mostrar el modal
}

// Cerrar el modal cuando se hace clic en la X
document.getElementById("cerrarModal").addEventListener("click", () => {
    const modal = document.getElementById("modal");
    modal.style.display = "none";  // Ocultar el modal
});


// Actualizar un paciente
document.getElementById("formActualizarPaciente").addEventListener("submit", async (e) => {
    e.preventDefault();
    const id = document.getElementById("actualizarID").value;
    const paciente = {
        Nombre: document.getElementById("actualizarNombre").value || undefined,
        FechaNacimiento: document.getElementById("actualizarFechaNacimiento").value || undefined,
        FechaInicioTratamiento: document.getElementById("actualizarFechaInicioTratamiento").value || undefined,
        CostoTratamiento: parseFloat(document.getElementById("actualizarCostoTratamiento").value) || undefined,
        EstadoTratamiento: document.getElementById("actualizarEstadoTratamiento").value === "true",
        FotoInicial: document.getElementById("actualizarFotoInicial").value || undefined,
        HistoriaClinica: document.getElementById("actualizarHistoriaClinica").value || undefined,
        CategoriaTratamiento: document.getElementById("actualizarCategoriaTratamiento").value || undefined,
    };
    const resultado = await fetchAPI(`${API_URL}/${id}`, "PUT", paciente);
    alert(resultado.mensaje || "Paciente actualizado con éxito.");
    e.target.reset();
});

// Eliminar un paciente
document.getElementById("formEliminarPaciente").addEventListener("submit", async (e) => {
    e.preventDefault();
    const id = document.getElementById("eliminarID").value;
    const resultado = await fetchAPI(`${API_URL}/${id}`, "DELETE");
    alert(resultado.mensaje || "Paciente eliminado con éxito.");
    e.target.reset();
});