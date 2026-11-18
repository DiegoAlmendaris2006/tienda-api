//Librerias para hash y token
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
//Llamar al modelo de Cliente
const Cliente = require('../models/modelCliente.js');

//Validacion de datos
const textoValido = t => typeof t === 'string' && t.trim() !== '';

//Firmar el token con las variables del .env
const generarToken = cliente => jwt.sign(
    { id: cliente.id, email: cliente.email },
    process.env.JWT_SECRET,
    { expiresIn: process.env.JWT_EXPIRES }
);

// POST /auth/registro -> 201, 400, 409
async function registro(req, res) {
    const { nombre, email, password } = req.body || {};
    if (!textoValido(nombre) || !textoValido(email) || !textoValido(password)) {
        return res.status(400).json({ error: 'Nombre, email y password son obligatorios' });
    }
    try {
        const existe = await Cliente.buscarPorEmail(email);
        if (existe) {
            return res.status(409).json({ error: 'El email ya está registrado' });
        }
        const passwordHash = await bcrypt.hash(password, 10);
        const cliente = await Cliente.crearCliente({ nombre, email, passwordHash });
        res.status(201).json({ mensaje: 'Cliente registrado', cliente });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Error interno del servidor' });
    }
}

// POST /auth/login -> 200, 401
async function login(req, res) {
    const { email, password } = req.body || {};
    try {
        const cliente = textoValido(email) ? await Cliente.buscarPorEmail(email) : null;
        const ok = cliente && textoValido(password) && await bcrypt.compare(password, cliente.password);
        if (!ok) {
            return res.status(401).json({ error: 'Credenciales incorrectas' });
        }
        const token = generarToken(cliente);
        res.status(200).json({ mensaje: 'Login correcto', token });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Error interno del servidor' });
    }
}

// GET /auth/perfil (protegido con token)
async function perfil(req, res) {
    try {
        const cliente = await Cliente.buscarPorId(req.cliente.id);
        if (!cliente) {
            return res.status(404).json({ error: 'Cliente no encontrado' });
        }
        res.status(200).json(cliente);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Error interno del servidor' });
    }
}

module.exports = { registro, login, perfil };