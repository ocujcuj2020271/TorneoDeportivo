const express = require('express');
const usuarioControlador = require('../controllers/usuario.controller');


const md_autenticacion = require('../middlewares/autenticacion');
const md_roles = require('../middlewares/roles');

const api = express.Router();



api.post('/login', usuarioControlador.Login);
api.post('/crearUsuario', usuarioControlador.crearUsuario);
api.post('/crearUsuarioAdmin',[md_autenticacion.Auth, md_roles.verAdmin], usuarioControlador.crearUsuarioAdmin);
api.put('/editarUsuario/:idUser', md_autenticacion.Auth, usuarioControlador.editarUsuario);
api.delete('/eliminarUsuario/:idUser', [md_autenticacion.Auth, md_roles.verAdmin], usuarioControlador.editarUsuario);
api.get('/verUsuarios', [md_autenticacion.Auth, md_roles.verAdmin], usuarioControlador.verUsuario);




module.exports = api;