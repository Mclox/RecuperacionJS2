const { conectarBaseDatos, sql } = require("../db/conexion"); 

// Crear un nuevo paciente

const crearPaciente = async (req, res) => {
    const { ID, Nombre, FechaNacimiento, FechaInicioTratamiento, CostoTratamiento, EstadoTratamiento, FotoInicial, HistoriaClinica, CategoriaTratamiento } = req.body;

    if (!ID || !Nombre || !FechaNacimiento || !FechaInicioTratamiento || !CostoTratamiento || !CategoriaTratamiento) {
        return res.status(400).json({ mensaje: "Faltan campos requeridos." });
    }

    try {
        const conexion = await conectarBaseDatos();
        const consulta = `
            INSERT INTO Pacientes (ID, Nombre, FechaNacimiento, FechaInicioTratamiento, CostoTratamiento, EstadoTratamiento, FotoInicial, HistoriaClinica, CategoriaTratamiento)
            VALUES (@ID, @Nombre, @FechaNacimiento, @FechaInicioTratamiento, @CostoTratamiento, @EstadoTratamiento, @FotoInicial, @HistoriaClinica, @CategoriaTratamiento)
        `;
        
        await conexion.request()
            .input("ID", sql.Int, ID)
            .input("Nombre", sql.NVarChar, Nombre)
            .input("FechaNacimiento", sql.Date, FechaNacimiento)
            .input("FechaInicioTratamiento", sql.Date, FechaInicioTratamiento)
            .input("CostoTratamiento", sql.Float, CostoTratamiento)
            .input("EstadoTratamiento", sql.Bit, EstadoTratamiento)
            .input("FotoInicial", sql.NVarChar, FotoInicial || null)
            .input("HistoriaClinica", sql.NVarChar, HistoriaClinica || null)
            .input("CategoriaTratamiento", sql.NVarChar, CategoriaTratamiento)
            .query(consulta);

        res.status(201).json({ mensaje: "Paciente creado con éxito." });
    } catch (error) {
        console.error("Error al crear paciente:", error);
        res.status(500).json({ mensaje: "Error al crear el paciente.", error: error.message });
    }
};


// Obtener todos los pacientes
const obtenerPacientes = async (req, res) => {
    try {
        const conexion = await conectarBaseDatos();
        const resultado = await conexion.request().query("SELECT * FROM Pacientes");

        res.status(200).json(resultado.recordset);
    } catch (error) {
        console.error("Error al obtener pacientes:", error);
        res.status(500).json({ mensaje: "Error al obtener pacientes.", error: error.message });
    }
};

// Buscar un paciente por su ID
const buscarPacientePorID = async (req, res) => {
    const { id } = req.params;

    if (!id) {
        return res.status(400).json({ mensaje: "El ID del paciente es obligatorio." });
    }

    try {
        const conexion = await conectarBaseDatos();
        const resultado = await conexion.request()
            .input("ID", sql.Int, id)
            .query("SELECT * FROM Pacientes WHERE ID = @ID");

        if (resultado.recordset.length === 0) {
            return res.status(404).json({ mensaje: "Paciente no encontrado." });
        }

        res.status(200).json(resultado.recordset[0]); // Devolver el paciente encontrado
    } catch (error) {
        console.error("❌ ERROR AL BUSCAR PACIENTE POR ID:", error);
        res.status(500).json({ mensaje: "Error al buscar el paciente.", error: error.message });
    }
};

// Actualizar un paciente por su ID
const actualizarPaciente = async (req, res) => {
    const { id } = req.params;
    const {
        Nombre,
        FechaNacimiento,
        FechaInicioTratamiento,
        CostoTratamiento,
        EstadoTratamiento,
        FotoInicial,
        HistoriaClinica,
        CategoriaTratamiento
    } = req.body;

    if (!id || !Nombre || !FechaNacimiento || !FechaInicioTratamiento || !CostoTratamiento || !CategoriaTratamiento) {
        return res.status(400).json({ mensaje: "Faltan campos requeridos para actualizar el paciente." });
    }

    try {
        const conexion = await conectarBaseDatos();
        const consulta = `
            UPDATE Pacientes
            SET Nombre = @Nombre,
                FechaNacimiento = @FechaNacimiento,
                FechaInicioTratamiento = @FechaInicioTratamiento,
                CostoTratamiento = @CostoTratamiento,
                EstadoTratamiento = @EstadoTratamiento,
                FotoInicial = @FotoInicial,
                HistoriaClinica = @HistoriaClinica,
                CategoriaTratamiento = @CategoriaTratamiento
            WHERE ID = @ID
        `;

        const resultado = await conexion.request()
            .input("ID", sql.Int, id)
            .input("Nombre", sql.NVarChar, Nombre)
            .input("FechaNacimiento", sql.Date, FechaNacimiento)
            .input("FechaInicioTratamiento", sql.Date, FechaInicioTratamiento)
            .input("CostoTratamiento", sql.Float, CostoTratamiento)
            .input("EstadoTratamiento", sql.Bit, EstadoTratamiento)
            .input("FotoInicial", sql.NVarChar, FotoInicial || null)
            .input("HistoriaClinica", sql.NVarChar, HistoriaClinica || null)
            .input("CategoriaTratamiento", sql.NVarChar, CategoriaTratamiento)
            .query(consulta);

        if (resultado.rowsAffected[0] === 0) {
            return res.status(404).json({ mensaje: "Paciente no encontrado o sin cambios." });
        }

        res.status(200).json({ mensaje: "Paciente actualizado con éxito." });
    } catch (error) {
        console.error("❌ Error al actualizar paciente:", error);
        res.status(500).json({ mensaje: "Error al actualizar el paciente.", error: error.message });
    }
};


// Eliminar un paciente por su ID

const eliminarPaciente = async (req, res) => {
    const { id } = req.params;

    try {
        const conexion = await conectarBaseDatos();
        const resultado = await conexion
            .request()
            .input("ID", sql.Int, id)
            .query("DELETE FROM Pacientes WHERE ID = @ID");

        if (resultado.rowsAffected[0] === 0) {
            return res.status(404).json({ mensaje: "Paciente no encontrado." });
        }

        res.json({ mensaje: "Paciente eliminado con éxito." });
    } catch (error) {
        console.error("Error al eliminar paciente:", error);
        res.status(500).json({ mensaje: "Error interno del servidor." });
    }
};


// Exportar las funciones
module.exports = {
    crearPaciente,
    obtenerPacientes,
    buscarPacientePorID, 
    actualizarPaciente,
    eliminarPaciente,
};
