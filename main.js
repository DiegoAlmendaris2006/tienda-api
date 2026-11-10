//Llamar a dotenv para variables de entorno
require('dotenv').config();
 
//Llamar a la aplicacion de express
const app = require('./src/app.js');
 
//Encriptar el servidor en el puerto 3000
const PORT = process.env.PORT ;
app.listen(PORT, () => {
  console.log(`Servidor listo en el puerto ${PORT}`);
});
 