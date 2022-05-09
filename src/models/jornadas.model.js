var mongoose = require('mongoose');
var Schema = mongoose.Schema;

const JornadaSchema = Schema({
    nombre: String,
    idLiga: { type: Schema.Types.ObjectId, ref: 'Ligas' },
    partidos: [{
        equipo: String,
        equipo2: String,
        goles: Number,
        goles2: Number,
    }]
});

module.exports = mongoose.model('Jornadas', JornadaSchema);