const { Router } = require('express');

//Llamamos al controlador de pedidos y al middleware
const control = require('../Controllers/ControllerPedido.js');
const verificarToken = require('../middlewares/verificarToken.js');

const routesPedido = Router();

//Las tres rutas protegidas con token
routesPedido.post('/', verificarToken, control.crearPedido);
routesPedido.get('/', verificarToken, control.listarMisPedidos);
routesPedido.get('/:id', verificarToken, control.obtenerPedido);

module.exports = routesPedido;