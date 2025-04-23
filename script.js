document.getElementById("formularioPaciente").addEventListener("submit", async (e) => {
    e.preventDefault();

    const datosPaciente = {
        Nombre: document.getElementById("nombre").value,
        FechaNacimiento: document.getElementById("fechaNacimiento").value,
        FechaInicioTratamiento: document.getElementById("fechaInicioTratamiento").value,
        CostoTratamiento: parseFloat(document.getElementById("costoTratamiento").value),
        EstadoTratamiento: false, // Por defecto no culminado
        FotoInicial: null, // Se puede agregar un campo para subir la foto
        HistoriaClinica: null,
        CategoriaTratamiento: document.getElementById("categoriaTratamiento").value,
    };

    try {
        const respuesta = await fetch("/api/pacientes", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(datosPaciente),
        });
        const resultado = await respuesta.json();
        alert(resultado.mensaje);
    } catch (error) {
        alert("Error al crear el paciente.");
    }
});