const express = require("express");
const bodyParser = require("body-parser");
const rutasPacientes = require("./routes/rutasPacientes");

const app = express();
const PUERTO = 3000;

// Middleware para parsear el cuerpo de las solicitudes JSON
app.use(bodyParser.json());

// Middleware para servir archivos estáticos desde la carpeta "public"
app.use(express.static("public"));

// Rutas de la API
app.use("/api", rutasPacientes);

// Middleware para manejar rutas no encontradas
app.use((req, res, next) => {
    res.status(404).json({ mensaje: "Recurso no encontrado." });
});

// Middleware para manejar errores del servidor
app.use((err, req, res, next) => {
    console.error("❌ Error del servidor:", err.message);
    res.status(500).json({ mensaje: "Error interno del servidor." });
});

// Iniciar el servidor
app.listen(PUERTO, () => {
    console.log(`🚀 Servidor corriendo en http://localhost:${PUERTO}`);
});