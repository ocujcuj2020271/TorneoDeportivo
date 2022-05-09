const Jornadas = require("../models/jornadas.model");
const Equipos = require("../models/equipos.model");

function ingresarJornada(req, res) {
    var modeloJornada = new Jornada();
    var parametros = req.body;
    var idLiga = req.params.idLiga;

    if (parametros.nombre) {
        Jornada.find({ nombre: parametros.nombre }, (err, jornadaEncontrada) => {
            if (jornadaEncontrada.length > 0) {
                return res.status(500).send({ mensaje: "Existe otra Jornada con el mismo nombre" })
            } else {
                Jornada.find({ idLiga: idLiga }, (err, jornada) => {
                    Equipo.find({ idLiga: idLiga }, (err, cantidadEquipos) => {

                        if (cantidadEquipos.length % 2 == 0) {
                            if (jornada.length >= cantidadEquipos.length - 1) {
                                return res.status(500).send({ mensaje: "No se puede crear más Jornadas" })
                            } else {
                                modeloJornada.nombre = parametros.nombre;
                                modeloJornada.idLiga = idLiga;

                                modeloJornada.save((err, jornadaGuardada) => {
                                    if (err) return res.status(500).send({ mensaje: "Errir en la peticion" })
                                    if (!jornadaGuardada) return res.status(500).send({ mensaje: "Error al registar" })

                                    return res.status(200).send({ Jornada: jornadaGuardada })
                                });
                            }
                        } else {
                            if (jornada.length >= cantidadEquipos.length) {
                                return res.status(500).send({ mensaje: "No puedes crear mas Jornadas, No tienes los Equipos sufucientes" });
                            } else {
                                modeloJornada.nombre = parametros.nombre;
                                modeloJornada.idLiga = idLiga;

                                modeloJornada.save((err, guardarJornada) => {
                                    if (err) return res.status(500).send({ mensaje: "Error en la peticion" });
                                    if (!guardarJornada) return res.status(500).send({ mensaje: "Error al registrar" });

                                    return res.status(200).send({ usuario: guardarJornada });
                                });
                            }
                        }
                    })
                })
            }
        })
    } else {
        return res.status(500).send({ mensaje: "Debe enviar los parametros Obligatorios " });
    }
}

function ingresarPartido(req, res) {
    var idJornada = req.params.idJornada;
    var parametros = req.body;

    if (parametros.equipo, parametros.equipo2, parametros.gol, parametros.gol2) {
        Equipo.findOne({ nombre: parametros.equipo } && { nombre: parametros.equipo2 }, (err, equipoEncontrado) => {
            if (!equipoEncontrado) {
                return res.status(500).send({ mensaje: "No Existe el Equipo" })
            } else {
                Jornada.findOne({ _id: idJornada, partidos: { $elemMatch: { equipo: parametros.equipo } } }, (err, equipoEncontrado) => {
                    if (err) return res.status(500).send({ mensaje: "Error en la peticion2" });
                    if (equipoEncontrado) {
                        return res.status(500).send({ mensaje: "Ya existe un partido" })
                    } else {
                        Jornada.findOne({ _id: idJornada, partidos: { $elemMatch: { equipo2: parametros.equipo2 } } }, (err, equipoEncontrado2) => {
                            if (err) return res.status(500).send({ mensaje: "error en la peticion3" });
                            if (equipoEncontrado2) {
                                return res.status(500).send({ mensaje: "Ya existe un partido con el nombre del equipo2" })
                            } else {
                                Jornada.findById(idJornada, { idLiga: 1, _id: 0 }, (err, jornada) => {
                                    Jornada.findById(idJornada, { partidos: 1, _id: 0 }, (err, Partidos) => {
                                        Equipo.find({ jornada }, (err, ekipos) => {
                                            if (ekipos.length % 2 == 0) {
                                                if (Partidos.partidos.length >= ekipos.length / 2) {
                                                    return res.status(500).send({ mensaje: "No puedes crear mas partidos00" });
                                                } else {
                                                    Jornada.findByIdAndUpdate(idJornada, {
                                                        $push: {
                                                            partidos: [{
                                                                equipo: parametros.equipo,
                                                                equipo2: parametros.equipo2,
                                                                goles: parametros.gol,
                                                                goles2: parametros.gol2,
                                                            }]
                                                        }
                                                    }, { new: true }, (err, ingresaPartido) => {
                                                        if (err) return res.status(500).send({ mensaje: "Error en la peticion 4" });
                                                        if (!ingresaPartido) return res.status(500).send({ mensaje: "No se pudo ingresar el partido 2" });

                                                        if (ingresaPartido) return res.status(200).send({ Partidos: ingresaPartido })
                                                    });
                                                }
                                            } else {
                                                if (Partidos.partidos.length >= (ekipos.length - 1) / 2) {
                                                    return res.status(500).send({ mensaje: "No puedes crear mas Partidos 2" })
                                                } else {
                                                    Jornada.findByIdAndUpdate(idJornada, {
                                                        $push: {
                                                            partidos: [{
                                                                equipo: parametros.equipo,
                                                                equipo2: parametros.equipo2,
                                                                goles: parametros.gol,
                                                                goles2: parametros.gol2,
                                                            }]
                                                        }
                                                    }, { new: true }, (err, ingresaPartido) => {
                                                        if (err) return res.status(500).send({ mensaje: "Error en la peticion 5" });
                                                        if (!ingresaPartido) return res.status(500).send({ mensaje: "No se pudo ingresar el partido 3" });

                                                        if (parametros.gol > parametros.gol2) {
                                                            let gano = 3;
                                                            let perdio = 0;
                                                            let diferenciaGol = parametros.gol - parametros.gol2;
                                                            let diferenciaGol2 = parametros.gol2 - parametros.gol;

                                                            Equipo.findByIdAndUpdate({ nombre: parametros.equipo }, {
                                                                $inc: {
                                                                    puntos: gano,
                                                                    golesFavor: parametros.gol,
                                                                    golesContra: parametros.gol2,
                                                                    diferenciaGoles: diferenciaGol
                                                                },
                                                            }, { new: true }, (err, actualizarEquipo) => {
                                                                console.log({ Equipo: actualizarEquipo });
                                                                Equipo.findByIdAndUpdate({ nombre: parametros.equipo2 }, {
                                                                    $inc: {
                                                                        puntos: perdio,
                                                                        golesFavor: parametros.gol2,
                                                                        golesContra: parametros.gol,
                                                                        diferenciaGoles: diferenciaGol2
                                                                    }
                                                                }, { new: true }, (err, EquipoActualizado2) => {
                                                                    return res.status(200).send({ Equipos: actualizarEquipo, EquipoActualizado2 });
                                                                })
                                                            })
                                                        } else if (parametros.gol2 > parametros.gol) {
                                                            let gano = 3;
                                                            let perdio = 0;
                                                            let diferenciaGol = parametros.gol - parametros.gol2;
                                                            let diferenciaGol2 = parametros.gol2 - parametros.gol;

                                                            Equipo.findByIdAndUpdate({ nombre: parametros.equipo }, {
                                                                $inc: {
                                                                    puntos: perdio,
                                                                    golesFavor: parametros.gol,
                                                                    golesContra: parametros.gol2,
                                                                    diferenciaGoles: diferenciaGol
                                                                },
                                                            }, { new: true }, (err, actualizarEquipo) => {
                                                                console.log({ Equipo: actualizarEquipo });
                                                                Equipo.findByIdAndUpdate({ nombre: parametros.equipo2 }, {
                                                                    $inc: {
                                                                        puntos: gano,
                                                                        golesFavor: parametros.gol2,
                                                                        golesContra: parametros.gol,
                                                                        diferenciaGoles: diferenciaGol2
                                                                    }
                                                                }, { new: true }, (err, EquipoActualizado2) => {
                                                                    return res.status(200).send({ Equipos: actualizarEquipo, EquipoActualizado2 });
                                                                })
                                                            })
                                                        } else {
                                                            let empate = 1;
                                                            let diferenciaGol = parametros.gol - parametros.gol2;
                                                            let diferenciaGol2 = parametros.gol2 - parametros.gol;
                                                            Equipo.findByIdAndUpdate({ nombre: parametros.equipo }, {
                                                                $inc: {
                                                                    puntos: empate,
                                                                    golesFavor: parametros.gol,
                                                                    golesContra: parametros.gol2,
                                                                    diferenciaGoles: diferenciaGol
                                                                },
                                                            }, { new: true }, (err, actualizarEquipo) => {
                                                                console.log({ Equipo: actualizarEquipo });
                                                                Equipo.findByIdAndUpdate({ nombre: parametros.equipo2 }, {
                                                                    $inc: {
                                                                        puntos: empate,
                                                                        golesFavor: parametros.gol2,
                                                                        golesContra: parametros.gol,
                                                                        diferenciaGoles: diferenciaGol2
                                                                    }
                                                                }, { new: true }, (err, EquipoActualizado2) => {
                                                                    return res.status(200).send({ Equipos: actualizarEquipo, EquipoActualizado2 });
                                                                })
                                                            })
                                                        }
                                                    })
                                                }
                                            }
                                        })
                                    })
                                })
                            }
                        })

                    }
                })
            }
        })
    } else {
        return res.status(500).send({ mensaje: "Debe enviar los parametros obligatorios" })
    }
} 

module.exports = {
    ingresarJornada,
    ingresarPartido,

}