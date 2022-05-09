var mongoose = require('mongoose');
var Schema = mongoose.Schema;

const equipoSchema = Schema({
    nombre: String,
    idUsuario: {type: Schema.Types.ObjectId, ref: 'Usuarios'},
    idLiga: {type: Schema.Types.ObjectId, ref: 'Ligas'},
    puntos: Number,
    golesFavor: Number,
    golesContra: Number,
    diferenciaGoles: Number
});

module.exports = mongoose.model('equipos', equipoSchema);