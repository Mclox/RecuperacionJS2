const sql = require("mssql");

// Configuración para autenticación SQL
const configuracionDB = {
    server: "DESKTOP-PO11P9S", // Nombre del servidor de base de datos
    database: "OdontoDB", // Nombre de la base de datos
    port: 1433, // Puerto de conexión (1433 es el puerto por defecto para SQL Server)
    driver: "tedious", // Controlador para conectarse a SQL Server
    options: {
        encrypt: false, // Desactiva en entornos locales
        trustServerCertificate: true // Si estás en un entorno local
    },
    authentication: {
        type: "default", // Usar autenticación SQL
        options: {
            userName: "miguelsql", // Nombre de usuario SQL que creaste
            password: "sqlote" // Nueva contraseña del usuario SQL
        }
    }
};

// Función para conectarse a la base de datos
const conectarBaseDatos = async () => {
    try {
        const conexion = await sql.connect(configuracionDB);
        console.log("Conectado a la base de datos exitosamente.");
        return conexion;
    } catch (error) {
        console.error("Error al conectar a la base de datos:", error.message);
        throw error;
    }
};

// Función opcional para cerrar la conexión
const cerrarConexion = async () => {
    try {
        await sql.close();
        console.log("Conexión a la base de datos cerrada.");
    } catch (error) {
        console.error("Error al cerrar la conexión:", error.message);
    }
};

// Exportar funciones
module.exports = { conectarBaseDatos, cerrarConexion, sql };
