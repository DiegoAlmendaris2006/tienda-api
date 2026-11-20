//Llamar al modelo de Pedido
const Pedido = require('../models/modelPedido.js');

//Validaciones
const enteroPositivo = n => Number.isInteger(Number(n)) && Number(n) > 0;
const idValido = id => /^\d+$/.test(id) && Number(id) > 0;

// POST /pedidos -> 201, 400
async function crearPedido(req, res) {
    const { items } = req.body || {};
    //items debe ser un arreglo no vacio
    if (!Array.isArray(items) || items.length === 0) {
        return res.status(400).json({ error: 'items debe ser un arreglo con al menos un producto' });
    }
    //cada item necesita producto_id y cantidad mayores a 0
    const itemsValidos = items.every(i => i && enteroPositivo(i.producto_id) && enteroPositivo(i.cantidad));
    if (!itemsValidos) {
        return res.status(400).json({ error: 'Cada item necesita producto_id y cantidad mayores a 0' });
    }
    try {
        //comprobar que todos los productos existan ANTES de crear nada
        const ids = [...new Set(items.map(i => Number(i.producto_id)))];
        const existentes = await Pedido.productosExistentes(ids);
        const faltantes = ids.filter(id => !existentes.includes(id));
        if (faltantes.length > 0) {
            return res.status(400).json({ error: `Producto no existe: ${faltantes.join(', ')}` });
        }
        //el dueño del pedido sale del token, nunca del body
        const pedido = await Pedido.crearPedido(req.usuario.id);
        for (const i of items) {
            await Pedido.agregarDetalle(pedido.id, Number(i.producto_id), Number(i.cantidad));
        }
        const pedidoFinal = await Pedido.actualizarTotal(pedido.id);
        const detalle = await Pedido.obtenerDetalle(pedido.id);
        res.status(201).json({ ...pedidoFinal, detalle });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Error interno del servidor' });
    }
}

// GET /pedidos -> 200 (solo los pedidos del cliente del token)
async function listarMisPedidos(req, res) {
    try {
        const pedidos = await Pedido.listarPedidosDeCliente(req.usuario.id);
        res.status(200).json(pedidos);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Error interno del servidor' });
    }
}

// GET /pedidos/:id -> 200, 400, 404
async function obtenerPedido(req, res) {
    const { id } = req.params;
    if (!idValido(id)) {
        return res.status(400).json({ error: 'ID inválido' });
    }
    try {
        //busca por id Y por cliente del token: si es de otro cliente, no lo encuentra
        const pedido = await Pedido.obtenerPedido(id, req.usuario.id);
        if (!pedido) {
            return res.status(404).json({ error: 'Pedido no encontrado' });
        }
        const detalle = await Pedido.obtenerDetalle(pedido.id);
        res.status(200).json({ ...pedido, detalle });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Error interno del servidor' });
    }
}

module.exports = { crearPedido, listarMisPedidos, obtenerPedido };