//Llamar a express
const express = require('express');
//Llamar a las rutas de productos
const routesProductos = require('./routes/routerProducto.js');

const routesCategoria = require('./routes/routerCategoria.js')

const routesAuth = require('./routes/routesAuth.js');

const routesPedido = require('./routes/routesPedido.js');

//Crear una aplicacion de express
const app = express();
app.use(express.json());
 
//Rutas de productos
app.use('/productos', routesProductos);

app.use('/categorias', routesCategoria);

//Rutas de autenticacion
app.use('/auth', routesAuth);

//Rutas de pedidos
app.use('/pedidos', routesPedido);

//Manejador de 404 (ruta no existe)
app.use((req, res) => {
    res.status(404).json({ error: 'Ruta no encontrada' });
});
 
//Manejo de errores
app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).json({ error: 'Error interno del servidor' });
});
 
module.exports = app;