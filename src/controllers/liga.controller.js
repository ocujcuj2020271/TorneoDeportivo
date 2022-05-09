var Liga = require("../models/ligas.model");

function crearLiga(req, res) {
    var parametros = req.body;
    var ligasModel = new Liga();

    if (parametros.nombre) {


        Liga.find({ nombre: parametros.nombre }, (err, ligaEncontrada) => {
            if (ligaEncontrada.length > 0) {
                return res.status(500).send({ message: "Ya existe esta Liga" });
            } else {
                ligasModel.nombre = parametros.nombre;
                ligasModel.idUsuario = req.user.sub;

                ligasModel.save((err, ligaGuardada) => {
                    if (err) return res.status(500).send({ mensaje: "Error en la peticion de la liga " })
                    if (!ligaGuardada) return res.status(500).send({ mensaje: "Error al crear liga" })
                    return res.status(200).send({ Liga: ligaGuardada })
                })
            }
        })
    } else {
        return res.status(500).send({ mensaje: "Debe enviar los parametros obligatorios" })
    }
}

function verLigas(req, res) {
    Liga.find({ idUsuario: req.user.sub }, (err, ligasEncontradas) => {
        if (err) return res.status(500).send({ mensaje: "Error en la peticion" });
        if (!ligasEncontradas) return res.status(500).send({ mensaje: "Error en la peticion" });

        return res.status(200).send({ ligasEncontradas })
    });
}

function editarLiga(req, res) {
    var parametros = req.body;
    var idLiga = req.parametros.idLiga;

    Liga.findByIdAndUpdate(idLiga, parametros, { new: true }, (err, ligaActualizada) => {
        if (err) return res.status(500).send({ mensaje: "Error en la peticion" });
        if (!ligaActualizada) return res.status(500).send({ mensaje: "Error al Actualizar liga" });

        return res.status(200).send({ ligaActualizada });
    })
}

function eliminarLiga(req, res) {
    var idLiga = req.params.idLiga;

    Liga.findOne({ idUsuario: req.user.sub }, (err, usuarioEncontrado) => {
        if (req.user.rol == "ADMIN") {

            Liga.findByIdAndDelete(idLiga, (err, ligaEliminada) => {
                if (err) return res.status(500).send({ mensaje: "Error en la peticion" });
                        if (!ligaEliminada) return res.status(500).send({ mensaje: "Error al eliminar"});

                        return res.status(200).send({ liga: ligaEliminada });
            })

        } else {
            Liga.findOne({ _id: idLiga, idUsuario: req.user.sub }, (err, ligaEncontrada) => {
                if (!ligaEncontrado) {
                    return res.status(500).send({ mensaje: "No pudes Eliminar otras ligas" })
                } else {
                    Liga.findByIdAndDelete(idLiga, (err, ligaEliminada) => {
                        if (err) return res.status(500).send({ mensaje: "Error en la peticion" });
                        if (!ligaEliminada) return res.status(500).send({ mensaje: "Error al eliminar"});

                        return res.status(200).send({ liga: ligaEliminada });
                    })
                }
            })
        }
    })
}

function buscarLiga(req, res) {
    var idLiga = req.params.idLiga;

    Liga.findOne({ _id: idLiga }, (err, ligaEncontrada) => {
        if (err) return res.status(500).send({ mensaje: "Error en la peticion" })
        if (!ligaEncontrada) return res.status(500).send({ mensaje: "Error en la peticion" });
        return res.status(200).send({ ligaEncontrada });
    })
}

module.exports = {
    crearLiga,
    verLigas,
    editarLiga,
    eliminarLiga,
    buscarLiga,
}