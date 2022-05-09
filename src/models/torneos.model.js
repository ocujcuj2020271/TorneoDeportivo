var mongoose = require('mongoose');
var Schema = mongoose.Schema;

const TorneosSchema = Schema({
    nombreTorneo: String,
    usuario: {type: Schema.Types.ObjectId, ref: 'Usuarios'}
})

module.exports = mongoose.model('Torneos', TorneosSchema)