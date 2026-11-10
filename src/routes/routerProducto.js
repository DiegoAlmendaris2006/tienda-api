//Llamar un router de express
const { Router } = require('express');

//Llamamos al controlador de productos
const control = require('../Controllers/ControllerProductos.js');

const routesProductos = Router();
 
//Rutas de productos
routesProductos.get('/', control.listarProductos);
routesProductos.get('/:id', control.obtenerProductoPorId);
routesProductos.post('/', control.crearProducto);
routesProductos.put('/:id', control.actualizarProducto);
routesProductos.delete('/:id', control.eliminarProducto);

module.exports = routesProductos;