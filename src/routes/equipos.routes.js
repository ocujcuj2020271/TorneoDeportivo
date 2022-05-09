const express = require('express');
const equiposControlador = require('../controllers/equipo.controller');

const md_autenticacion = require('../middlewares/autenticacion');
const md_roles = require('../middlewares/roles');

const api = express.Router();

api.post('/registrarEquipo/:idLiga',[md_autenticacion.Auth, md_roles.verUsuario], equiposControlador.crearEquipo);
api.put('/editarEquipo/:idEquipo',[md_autenticacion.Auth, md_roles.verUsuario], equiposControlador.editarEquipo);
api.delete('/eliminarEquipo/:idEquipo',[md_autenticacion.Auth, md_roles.verUsuario], equiposControlador.eliminarEquipo);
api.get('/mostrarEquipos',[md_autenticacion.Auth, md_roles.verUsuario], equiposControlador.mostrarEquipo);
api.get('/mostrarEquiposLiga/:idLiga',[md_autenticacion.Auth, md_roles.verUsuario],equiposControlador.mostrarEquipoLiga);


module.exports = api;