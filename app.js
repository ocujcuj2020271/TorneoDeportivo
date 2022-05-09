const express = require('express');
const cors = require('cors');
const app = express();

// IMPORTARCION RUTAS
const usuarioRutas = require('./src/routes/usuario.routes');
const ligaRutas = require('./src/routes/liga.routes');
const equipoRutas = require('./src/routes/equipos.routes')
const jornadaRutas = require('./src/routes/jornadas.routes')
//MIDDLEWARES
app.use(express.urlencoded({ extended: false }));
app.use(express.json());

//CABECERAS

app.use(cors());

// CARGA DE RUTAS localhost:3000/api/

app.use('/api', usuarioRutas, ligaRutas, equipoRutas, jornadaRutas)

module.exports = app;