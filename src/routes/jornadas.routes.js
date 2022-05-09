const express = require('express');
const jornadaControlador = require('../controllers/jornadas.controller');

const md_autenticacion = require('../middlewares/autenticacion');
const md_roles = require('../middlewares/roles');

const api = express.Router();

api.post('/registrarJornada/:idLiga',[md_autenticacion.Auth, md_roles.verUsuario], jornadaControlador.ingresarJornada);
api.put('/agregarPartido/:idJornada',[md_autenticacion.Auth, md_roles.verUsuario], jornadaControlador.ingresarPartido);


module.exports = api;