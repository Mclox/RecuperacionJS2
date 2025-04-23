const sql = require("mssql");

// Configuración de la conexión a SQL Server
const configuracionDB = {
    server: "DESKTOP-B1SGN56", // Cambia esto por el nombre o IP de tu servidor SQL
    database: "OdontoDB", // Nombre de la base de datos
    user: "", // Reemplaza con tu usuario de SQL Server
    password: "", // Reemplaza con tu contraseña de SQL Server
    options: {
        encrypt: true, // Activar en Azure; en local, puede ser false si no se usa SSL
        trustServerCertificate: true, // Requerido para conexiones locales sin certificado SSL
    },
};

// Función para conectarse a la base de datos
const conectarBaseDatos = async () => {
    try {
        const conexion = await sql.connect(configuracionDB);
        console.log("🚀 Conectado a la base de datos exitosamente.");
        return conexion; // Retorna la conexión para reutilizarla en otros módulos
    } catch (error) {
        console.error("❌ Error al conectar a la base de datos:", error.message);
        throw error; // Lanza el error para que sea manejado en otros lugares
    }
};

// Función para cerrar la conexión (opcional, para tareas específicas)
const cerrarConexion = async () => {
    try {
        await sql.close();
        console.log("🔌 Conexión a la base de datos cerrada.");
    } catch (error) {
        console.error("❌ Error al cerrar la conexión a la base de datos:", error.message);
    }
};

// Exportar funciones y el módulo de SQL para uso en controladores
module.exports = { conectarBaseDatos, cerrarConexion, sql };