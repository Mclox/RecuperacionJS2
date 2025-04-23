const express = require("express");
const {
    crearPaciente,
    obtenerPacientes,
    buscarPacientePorID,
    actualizarPaciente,
    eliminarPaciente,
} = require("../controllers/controladorPacientes");

const router = express.Router();

// Ruta para crear un nuevo paciente
router.post("/pacientes", crearPaciente);

// Ruta para obtener todos los pacientes
router.get("/pacientes", obtenerPacientes);

// Ruta para buscar un paciente por su ID
router.get("/pacientes/:id", buscarPacientePorID);

// Ruta para actualizar un paciente por su ID
router.put("/pacientes/:id", actualizarPaciente);

// Ruta para eliminar un paciente por su ID
router.delete("/pacientes/:id", eliminarPaciente);

module.exports = router;