const express = require('express');
const LigaControlador = require("../controllers/liga.controller");

const md_autenticacion = require('../middlewares/autenticacion');
const md_roles = require('../middlewares/roles');

const api = express.Router();

api.post('/crearLiga', md_autenticacion.Auth, LigaControlador.crearLiga);
api.put('/editarLiga/:idLiga',md_autenticacion.Auth, LigaControlador.editarLiga);
api.delete('/eliminarLiga/:idLiga',[md_autenticacion.Auth, md_roles.verUsuario], LigaControlador.eliminarLiga);
api.get('/mostrarLigas',[md_autenticacion.Auth, md_roles.verUsuario], LigaControlador.buscarLiga);

module.exports = api;