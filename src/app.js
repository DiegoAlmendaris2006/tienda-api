//Llamar a express
const express = require('express');
//Llamar a las rutas de productos
const routesProductos = require('./routes/routerProducto.js');
 
//Crear una aplicacion de express
const app = express();
app.use(express.json());
 
//Rutas de productos
app.use('/productos', routesProductos);
 
//Manejo de errores
app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).json({ error: 'Error interno del servidor' });
});
 
module.exports = app;