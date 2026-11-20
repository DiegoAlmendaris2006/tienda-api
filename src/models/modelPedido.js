//Importar el pool de conexion
const pool = require('../config/db.js');

//Crear la cabecera del pedido (el cliente sale del token)
async function crearPedido(cliente_id) {
    const r = await pool.query(
        'INSERT INTO pedidos (cliente_id) VALUES ($1) RETURNING *', [cliente_id]);
    return r.rows[0];
}

//Agregar una linea: copia el precio desde la tabla productos
async function agregarDetalle(pedido_id, producto_id, cantidad) {
    const r = await pool.query(
        `INSERT INTO detalle_pedido (pedido_id, producto_id, cantidad, precio_unitario, subtotal)
         SELECT $1, p.id, $3::int, p.precio, p.precio * $3::int
         FROM productos p
         WHERE p.id = $2 AND p.activo = true
         RETURNING *`,
        [pedido_id, producto_id, cantidad]);
    return r.rows[0];
}

//Calcular el total con la suma de los subtotales
async function actualizarTotal(pedido_id) {
    const r = await pool.query(
        `UPDATE pedidos
         SET total = (SELECT COALESCE(SUM(subtotal), 0) FROM detalle_pedido WHERE pedido_id = $1)
         WHERE id = $1 RETURNING *`,
        [pedido_id]);
    return r.rows[0];
}

//Listar solo los pedidos del cliente del token
async function listarPedidosDeCliente(cliente_id) {
    const r = await pool.query(
        'SELECT * FROM pedidos WHERE cliente_id = $1 ORDER BY id DESC', [cliente_id]);
    return r.rows;
}

//Obtener un pedido solo si pertenece al cliente
async function obtenerPedido(id, cliente_id) {
    const r = await pool.query(
        'SELECT * FROM pedidos WHERE id = $1 AND cliente_id = $2', [id, cliente_id]);
    return r.rows[0];
}

//Detalle del pedido con el nombre de cada producto
async function obtenerDetalle(pedido_id) {
    const r = await pool.query(
        `SELECT d.id, d.producto_id, p.nombre AS producto,
                d.cantidad, d.precio_unitario, d.subtotal
         FROM detalle_pedido d
         JOIN productos p ON p.id = d.producto_id
         WHERE d.pedido_id = $1
         ORDER BY d.id`,
        [pedido_id]);
    return r.rows;
}

//Comprobar que los productos existen (antes de crear el pedido)
async function productosExistentes(ids) {
    const r = await pool.query(
        'SELECT id FROM productos WHERE id = ANY($1::int[]) AND activo = true', [ids]);
    return r.rows.map(p => p.id);
}

module.exports = {
    crearPedido,
    agregarDetalle,
    actualizarTotal,
    listarPedidosDeCliente,
    obtenerPedido,
    obtenerDetalle,
    productosExistentes
};