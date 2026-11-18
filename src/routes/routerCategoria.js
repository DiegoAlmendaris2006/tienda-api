const { Router } = require('express');

//Llamamos al controlador de categorias y al middleware
const control = require('../Controllers/ControllerCategoria.js');
const verificarToken = require('../middlewares/verificarToken.js');

const routesCategoria = Router();

//Rutas publicas
routesCategoria.get('/', control.listarCategorias);
routesCategoria.get('/:id', control.obtenerCategoriaPorId);
//Rutas protegidas con token
routesCategoria.post('/', verificarToken, control.crearCategoria);
routesCategoria.put('/:id', verificarToken, control.actualizarCategoria);
routesCategoria.delete('/:id', verificarToken, control.eliminarCategoria);

module.exports = routesCategoria;