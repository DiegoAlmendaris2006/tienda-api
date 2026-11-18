const jwt = require('jsonwebtoken');

//Middleware: revisa el header Authorization: Bearer <token>
function verificarToken(req, res, next) {
    const header = req.headers.authorization || '';
    const [tipo, token] = header.split(' ');
    if (tipo !== 'Bearer' || !token) {
        return res.status(401).json({ error: 'Token requerido' });
    }
    try {
        req.cliente = jwt.verify(token, process.env.JWT_SECRET);
        next();
    } catch (error) {
        return res.status(401).json({ error: 'Token inválido o expirado' });
    }
}

module.exports = verificarToken;