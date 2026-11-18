//Importar el pool de conexion
const pool = require('../config/db.js');

//Crear un cliente (la clave ya llega con hash) sin devolver el hash
async function crearCliente({ nombre, email, passwordHash }) {
    const r = await pool.query(
        `INSERT INTO clientes (nombre, email, password) VALUES ($1, $2, $3)
         RETURNING id, nombre, email, rol, activo, creado_en`,
        [nombre, email, passwordHash]);
    return r.rows[0];
}

//Buscar un cliente por email (para login y para evitar duplicados)
async function buscarPorEmail(email) {
    const r = await pool.query('SELECT * FROM clientes WHERE email = $1', [email]);
    return r.rows[0];
}

//Obtener un cliente por id (sin devolver el hash)
async function obtenerClientePorId(id) {
    const r = await pool.query(
        'SELECT id, nombre, email, rol, activo, creado_en FROM clientes WHERE id = $1', [id]);
    return r.rows[0];
}

module.exports = { crearCliente, buscarPorEmail, obtenerClientePorId };