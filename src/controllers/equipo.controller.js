var Equipo = require('../models/equipos.model');

function crearEquipo(req, res){
    var equipoModel = new Equipo();
    var parametros = req.body;
    var idLiga = req.params.idLiga;

    if(parametros.nombre){
        Equipo.find({nombre: parametros.nombre}, (err, equipoEncontrado)=>{
            if(equipoEncontrado.length > 0){
                return res.status(500).send({mensaje: "Ya existe el Equipo"});
            } else {
                Equipo.find({idLiga: idLiga}, (err, equiposLiga) => {
                    if(equiposLiga.length>=10){
                        return res.status(500).send({mensaje: "No puede tener mas de 10 equipos por Liga"});
                    } else {
                        equipoModel.nombre = parametros.nombre;
                        equipoModel.idUsuario = req.user.sub;
                        equipoModel.idLiga = idLiga;
                        equipoModel.puntos = 0;
                        equipoModel.golesFavor = 0;
                        equipoModel.golesContra = 0;
                        equipoModel.diferenciaGoles = 0;

                        equipoModel.save((err, equipoGuardado) =>{
                            if(err) return res.status(500).send({mensaje: "Error en la peticion"});
                            if(!equipoGuardado) return res.status(500).send({mensaje:"Error al registrar"});
                            
                            return res.status(200).send({equipo: equipoGuardado});
                        })
                    }
                })
            }
        })

    } else {
        return res.status(500).send({mensaje: "Debe ingresar parametros obligatorios"})
    }
    
}

function editarEquipo(req, res) {
    var idEquipo = req.params.idEquipo;
    var parametros = req.body;

    if(parametros.nombre){
        Equipo.findOne({nombre: parametros.nombre}, (err, equipoEncontrado) => {
            if( equipoEncontrado.length >0){
                return res.status(500).send({mensaje: "El nombre ya esta en uso"});
            } else{
                Equipo.findOne({_id: idEquipo, idUsuario: req.user.sub},(err, ligaEncontrada) => {
                    if(!ligaEncontrada) {
                        return res.status(500).send({mensaje: "Este equipo no te pertenece"});
                    } else {
                        Equipo.findOne({_id: idEquipo, idUsuario: req.user.sub }, (err, ligaEncontrada) => {
                            if (!ligaEncontrada){
                                return res.status(500).send({mensaje: ""})
                            } else {
                                Equipo.findByIdAndUpdate(idEquipo, {$set:{nombre:parametros.nombre}},{new: true},(err, equipoActualizado) => {
                                    if(err) return res.status(500).send({mensaje: "Error en la peticion"});
                                    if(!equipoActualizado) return res.status(500).send({mensaje: "Error al editar Equipo"});
                                    return res.status(200).send({Equipo: equipoActualizado});
                                });
                            }
                        });
                    }
                });
            }
        })
    } else {
        return res.status(500).send({mensaje: "Debes ingresar parametros obligarios"})
    }
}

function eliminarEquipo(req, res){
    var idEquipo = req.params.idEquipo;

    Equipo.findOne({_id: idEquipo, idUsuario: req.user.sub}, (err, equipoEncontrado)=>{
        if (!equipoEncontrado){
            return res.status(500).send({mensaje: "Este Equipo no te pretenece"})
        } else {
            Equipo.findByIdAndDelete(idEquipo, (err, equipoEliminado)=>{
                if(err) return res.status(500).send({mensaje: "Error en la peticion"});
                if (!equipoEliminado) return res.status(500).send({mensaje: "Error al eliminar equipo"});

                return res.status(200).send({equipo: equipoEliminado});
            })
        }
    })
}

function mostrarEquipo(req, res){
    
    Equipo.findOne({idUsuario: req.user.sub}, (err, equipoEncontrado)=>{
        if(!equipoEncontrado){
            return res.status(500).send({mensaje: "esta liga no te pretenece"});
        } else {
            Equipo.find({idUsuario: req.user.sub}, (err, equipo)=>{
                return res.status(500).send({Equipo: equipo });
            })
        }
    });
}

function mostrarEquipoLiga(req, res) {
    var idLiga = req.params.idLiga;

    Equipo.findOne({idUsuario: req.user.sub}, (err, equipoEncontrado)=>{
        if(!equipoEncontrado){
            return res.status(500).send({mensaje: "Esta liga no te pertenece"});
        } else {
            Equipo.find({idLiga: idLiga},(err, equipo)=>{
                return res.status(200).send({Equipo: equipo})
            })
        }
    })
}

module.exports = {
    crearEquipo,
    editarEquipo,
    eliminarEquipo,
    mostrarEquipo,
    mostrarEquipoLiga,
}