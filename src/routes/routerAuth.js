const { Router } = require('express');

//Llamamos al controlador de autenticacion y al middleware
const control = require('../Controllers/ControllerAuth.js');
const verificarToken = require('../middlewares/verificarToken.js');

const routesAuth = Router();

routesAuth.post('/registro', control.registro);
routesAuth.post('/login', control.login);
routesAuth.get('/perfil', verificarToken, control.perfil);

module.exports = routesAuth;