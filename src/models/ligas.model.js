var mongoose = require('mongoose');
var Schema = mongoose.Schema;

const LigaSchema = Schema({
    nombre: String,
    idUsuario: {type: Schema.Types.ObjectId, ref: "Usuarios"}
})

module.exports = mongoose.model('Ligas', LigaSchema);