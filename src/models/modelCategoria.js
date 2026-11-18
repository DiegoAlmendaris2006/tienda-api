//Importar el pool de conexion
const pool = require('../config/db.js');

//funciones de listar
async function listarCategorias() {
    const r = await pool.query('SELECT * FROM categorias ORDER BY id');
    return r.rows;
}
async function obtenerCategoriaPorId(id) {
    const r = await pool.query('SELECT * FROM categorias WHERE id = $1', [id]);
    return r.rows[0];
}

//funciones de crear
async function crearCategoria(nombre) {
    const r = await pool.query('INSERT INTO categorias (nombre) VALUES ($1) RETURNING *', [nombre]);
    return r.rows[0];
}
//funciones de actualizar
async function actualizarCategoria(id, nombre) {
    const r = await pool.query('UPDATE categorias SET nombre = $1 WHERE id = $2 RETURNING *', [nombre, id]);
    return r.rows[0];
}
//funciones de eliminar
async function eliminarCategoria(id) {
    const r = await pool.query('DELETE FROM categorias WHERE id = $1 RETURNING *', [id]);
    return r.rowCount;
}
module.exports = {
    listarCategorias,
    obtenerCategoriaPorId,
    crearCategoria,
    actualizarCategoria,
    eliminarCategoria
}