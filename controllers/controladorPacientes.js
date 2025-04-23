const { conectarBaseDatos, sql } = require("../db/conexion");

// Crear un nuevo paciente
const crearPaciente = async (req, res) => {
    const { Nombre, FechaNacimiento, FechaInicioTratamiento, CostoTratamiento, EstadoTratamiento, FotoInicial, HistoriaClinica, CategoriaTratamiento } = req.body;

    if (!Nombre || !FechaNacimiento || !FechaInicioTratamiento || !CostoTratamiento || !CategoriaTratamiento) {
        return res.status(400).json({ mensaje: "Todos los campos obligatorios deben ser completados." });
    }

    try {
        const conexion = await conectarBaseDatos();
        await conexion.request()
            .input("Nombre", sql.NVarChar, Nombre)
            .input("FechaNacimiento", sql.Date, FechaNacimiento)
            .input("FechaInicioTratamiento", sql.Date, FechaInicioTratamiento)
            .input("CostoTratamiento", sql.Decimal(10, 2), CostoTratamiento)
            .input("EstadoTratamiento", sql.Bit, EstadoTratamiento || 0)
            .input("FotoInicial", sql.NVarChar, FotoInicial || null)
            .input("HistoriaClinica", sql.NVarChar, HistoriaClinica || null)
            .input("CategoriaTratamiento", sql.NVarChar, CategoriaTratamiento)
            .query(`
                INSERT INTO Pacientes (Nombre, FechaNacimiento, FechaInicioTratamiento, CostoTratamiento, EstadoTratamiento, FotoInicial, HistoriaClinica, CategoriaTratamiento)
                VALUES (@Nombre, @FechaNacimiento, @FechaInicioTratamiento, @CostoTratamiento, @EstadoTratamiento, @FotoInicial, @HistoriaClinica, @CategoriaTratamiento)
            `);
        res.status(201).json({ mensaje: "Paciente creado exitosamente." });
    } catch (error) {
        res.status(500).json({ mensaje: "Error al crear el paciente.", error });
    }
};

// Obtener todos los pacientes
const obtenerPacientes = async (req, res) => {
    try {
        const conexion = await conectarBaseDatos();
        const resultados = await conexion.request().query("SELECT * FROM Pacientes");
        res.status(200).json(resultados.recordset);
    } catch (error) {
        res.status(500).json({ mensaje: "Error al obtener los pacientes.", error });
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

        res.status(200).json(resultado.recordset[0]);
    } catch (error) {
        res.status(500).json({ mensaje: "Error al buscar el paciente.", error });
    }
};

// Actualizar un paciente por su ID
const actualizarPaciente = async (req, res) => {
    const { id } = req.params;
    const { Nombre, FechaNacimiento, FechaInicioTratamiento, CostoTratamiento, EstadoTratamiento, FotoInicial, HistoriaClinica, CategoriaTratamiento } = req.body;

    if (!id) {
        return res.status(400).json({ mensaje: "El ID del paciente es obligatorio." });
    }

    try {
        const conexion = await conectarBaseDatos();
        const resultado = await conexion.request()
            .input("ID", sql.Int, id)
            .input("Nombre", sql.NVarChar, Nombre)
            .input("FechaNacimiento", sql.Date, FechaNacimiento)
            .input("FechaInicioTratamiento", sql.Date, FechaInicioTratamiento)
            .input("CostoTratamiento", sql.Decimal(10, 2), CostoTratamiento)
            .input("EstadoTratamiento", sql.Bit, EstadoTratamiento)
            .input("FotoInicial", sql.NVarChar, FotoInicial)
            .input("HistoriaClinica", sql.NVarChar, HistoriaClinica)
            .input("CategoriaTratamiento", sql.NVarChar, CategoriaTratamiento)
            .query(`
                UPDATE Pacientes
                SET 
                    Nombre = @Nombre,
                    FechaNacimiento = @FechaNacimiento,
                    FechaInicioTratamiento = @FechaInicioTratamiento,
                    CostoTratamiento = @CostoTratamiento,
                    EstadoTratamiento = @EstadoTratamiento,
                    FotoInicial = @FotoInicial,
                    HistoriaClinica = @HistoriaClinica,
                    CategoriaTratamiento = @CategoriaTratamiento
                WHERE ID = @ID
            `);

        if (resultado.rowsAffected[0] === 0) {
            return res.status(404).json({ mensaje: "Paciente no encontrado." });
        }

        res.status(200).json({ mensaje: "Paciente actualizado exitosamente." });
    } catch (error) {
        res.status(500).json({ mensaje: "Error al actualizar el paciente.", error });
    }
};

// Eliminar un paciente por su ID
const eliminarPaciente = async (req, res) => {
    const { id } = req.params;

    if (!id) {
        return res.status(400).json({ mensaje: "El ID del paciente es obligatorio." });
    }

    try {
        const conexion = await conectarBaseDatos();
        const resultado = await conexion.request()
            .input("ID", sql.Int, id)
            .query("DELETE FROM Pacientes WHERE ID = @ID");

        if (resultado.rowsAffected[0] === 0) {
            return res.status(404).json({ mensaje: "Paciente no encontrado." });
        }

        res.status(200).json({ mensaje: "Paciente eliminado exitosamente." });
    } catch (error) {
        res.status(500).json({ mensaje: "Error al eliminar el paciente.", error });
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