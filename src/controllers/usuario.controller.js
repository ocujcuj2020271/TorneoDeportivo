const Usuario = require("../models/usuario.model");
const bcrypt = require("bcrypt-nodejs");
const jwt = require("../services/jwt");
const Torneo = require("../models/torneos.model");

function registrarAdmin() {
    var modeloUsuario = new Usuario();

    Usuario.find({ email: "ADMIN" }, (err, usuarioEncontrado) => {
        if (usuarioEncontrado.length > 0) {
            return console.log("El Admin ya existe.");
        } else {
            modeloUsuario.nombre = "ADMIN";
            modeloUsuario.email = "ADMIN";
            modeloUsuario.rol = "ADMIN";

            bcrypt.hash("deportes123", null, null, (err, passwordEncriptada) => {
                modeloUsuario.password = passwordEncriptada;

                modeloUsuario.save((err, usuarioGuardado) => {
                    if (err) return console.log("Error en la peticion");
                    if (!usuarioGuardado) return console.log("Error al registrar Admin");

                    return console.log("Admin:" + " " + usuarioGuardado);
                });
            });
        }
    });
}

function Login(req, res) {
    var parametros = req.body;
    Usuario.findOne({ email: parametros.email }, (err, usuarioEncontrado) => {
        if (err) return res.status(500).send({ mensaje: "Error en la peticion" });
        if (usuarioEncontrado) {
            bcrypt.compare(
                parametros.password,
                usuarioEncontrado.password,
                (err, verificationPassword) => {
                    if (verificationPassword) {
                        if (parametros.obtenerToken === "true") {
                            return res.status(200).send({ token: jwt.crearToken(usuarioEncontrado) });
                        } else {
                            usuarioEncontrado.password = undefined;
                            return res.status(200).send({ usuario: usuarioEncontrado });
                        }
                    } else {
                        return res.status(500).send({ mensaje: "la contraseña no coincide" });
                    }
                }
            );
        } else {
            return res.status(500).send({ mensaje: "Error, el correo no coincide" });
        }
    });
}

function crearUsuario(req, res) {
    var usuarioModel = new Usuario();
    var params = req.body;

    if (params.email && params.password) {
        usuarioModel.nombre = params.nombre;
        usuarioModel.email = params.email;
        usuarioModel.rol = "USUARIO";

        Usuario.find({
            nombre: params.nombre
        }).exec((err, usuarioEncontrado) => {
            if (err) { return console.log({ mensaje: "Error en la peticion" }) };
            if (usuarioEncontrado.length >= 1) {
                return res.status(500).send("Este usuario ya existe");
            } else {
                bcrypt.hash(params.password, null, null, (err, passwordEncriptada) => {
                    usuarioModel.password = passwordEncriptada;
                    usuarioModel.save((err, usuarioGuardado) => {
                        if (err) return res.status(500).send({ mensaje: "Error en la peticion" });
                        if (usuarioGuardado) {
                            res.status(200).send({ usuarioGuardado });
                        } else {
                            res.status(500).send({ mensaje: "Error al registrar el usuario" });
                        }
                    })
                })
            }
        });
    } else {
        if (err) return res.status(500).send({ mensaje: "Debe de ingresar parametros obligatorios" })
    }
}

function crearUsuarioAdmin(req, res) {
    const parametro = req.body;
    const modeloUsuario = new Usuario();

    if (parametro.nombre && parametro.email && parametro.password) {
        modeloUsuario.nombre = parametro.nombre;
        modeloUsuario.email = parametro.email;
        modeloUsuario.password = parametro.password;
        modeloUsuario.rol = "ADMIN";
        Usuario.find({ email: parametro.email }, (err, usuarioEncontrado) => {
            if (usuarioEncontrado.length == 0) {
                bcrypt.hash(parametro.password, null, null, (err, passwordEncriptada) => {
                    modeloUsuario.password = passwordEncriptada;
                    modeloUsuario.save((err, usuarioGuardado) => {
                        if (err)
                            return res.status(500)
                                .send({ mensaje: "Error en la petición" });
                        if (!usuarioGuardado)
                            return res.status(500)
                                .send({ mensaje: "Error al agregar usuario admin" });
                        return res.status(200)
                            .send({ usuarioAdminCreado: usuarioGuardado });
                    });
                }
                );
            } else {
                return res.status(500).send({ error: "El correo ya esta en uso" });
            }
        });
    } else {
        return res.status(500)
            .send({ error: "Debe de enviar los parametros obligatorios" });
    }
}

function editarUsuario(req, res) {
    const idUser = req.params.idUser;
    const parametros = req.body;

    Usuario.find({ _id: idUser }, (err, usuario) => {
        Usuario.find({ email: parametros.email }, (err, usuarioEncontrado) => {
            if (usuarioEncontrado.length == 0) {
                if (req.user.rol == "ADMIN") {
                    if (usuario.rol == "USUARIO") {
                        return res.status(403).send({ error: "No puedes editar otro usuario Administrador" });
                    } else {
                        Usuario.findByIdAndUpdate(
                            idUser, { $set: { email: parametros.email, nombre: parametros.nombre }, }, { new: true }, (err, usuarioActualizando) => {
                                if (err) return res.status(500).send({ error: "Los administradores no se pueden editar" });
                                if (!usuarioActualizando)
                                    return res.status(500).send({ error: "Error en la peticion" });
                                return res.status(200).send({ usuarioActualizado: usuarioActualizando })
                            }
                        );
                    }
                } else {
                    Usuario.findByIdAndUpdate(req.user.sub, { $set: { email: parametros.email, nombre: parametros.nombre } }, { new: true }, (err, usuarioActualizado) => {
                        if (err) return res.status(500).send({ mensaje: "Error en la peticion del usuario" });
                        if (!usuarioActualizado) return res.status(500).send({ mensaje: "Error al editar el Usuario" });
                        return res.status(200).send({ usuarioActualizado: usuarioActualizado })
                    }
                    );
                }
            } else {
                return res.status(500).send({ error: "El correo ya esta en uso" });
            }
        });
    });
}

function eliminarUsuario() {
    var idUser = req.params.idUser;

    Usuario.findOne({ _id: idUser }, (err, usuarioEncontrado) => {
        if (req.user.rol == "ADMIN") {
            if (usuarioEncontrado.rol !== "USUARIO") {
                return res.status.send({ mensaje: "No se puede eliminar otro Usuario Administrador" });
            } else {
                Usuario.findByIdAndDelete(idUser, (err, usuarioEliminado) => {
                    if (err) return res.status(500).send({ mensaje: "error en la peticion" })
                    if (!usuarioEliminado) return res.status(403).send({ mensaje: "Error al eliminar el Usuario" });
                    return res.status(200).send({ usuario: usuarioEliminado });
                });
            }
        }
    });
}

function verUsuario(req, res) {
    Usuario.find({ rol: "USUARIO" }, (err, usuarioEncontrado) => {
        return res.status(200).send({ usuario: usuarioEncontrado });
    });
}

//---------------------------- No Sirve -----------------------------------------
function agregarTorneo(req, res) {
    const torneo = new Torneo();
    const parametros = req.body;

    if (parametros.nombreTorneo) {
        torneo.nombreTorneo = parametros.nombreTorneo;
        torneo.usuario = req.user.sub;

        Torneo.find(
            { nombreTorneo: parametros.nombreTorneo }, (err, TorneoEncontrado) => {
                if (TorneoEncontrado.length === 0) {
                    torneo.save((err, torneoGuardado) => {
                        if (err) return res.status(500).send({ mensaje: "Error en la pertición" });
                        if (!torneoGuardado) return res.status(404).send({ mensaje: "Error al crear el Torneo" });
                    });
                } else {
                    return res.status(400).send({ mensaje: "El Nombre del torneo ya esta siendo utulizado" });
                }
            }
        );
    } else {
        return res.status(400).send({ mensaje: "Debe de enviar el nombre del torneo" });
    }
}

function editarTorneo(req, res) {
    const idTorneo = req.params.idTorneo;
    const parametros = req.body;

    Torneo.find({ nombreTorneo: parametros.nombreTorneo }, (err, TorneoEncontrado) => {
        if (TorneoEncontrado.length === 0) {
            Torneo.findByIdAndUpdate(idTorneo, { $set: { nombreTorneo: parametros.nombreTorneo } }, { new: true }, (err, torneoActualizado) => {
                if(err) return res.status(500).send({ mensaje: "Error en la peticion"})
                if(!torneoActualizado) return res.status(500).send({ mensaje: "Error al actualizar el Torneo"})
                return res.status(200).send({ torneoActualizado: torneoActualizado})
            });
        } else {
            return res.status(403).send({ mensaje: "Ya existe un torneo con ese Nombre"})
        }
    })
}

function eliminarTorne(req, res){
    const idTorneo = req.params.idTorneo;

    Torneo.findByIdAndDelete(idTorneo, (err, eliminarTorneo) => {
        if(err) return res.status(500).send({mensaje: "Error en la petición"});
        if(!eliminarTorneo) return res.status(500).send({mensaje: "Error al eliminar el Torneo"});
        return res.status(200).send({TorneoEliminado: eliminarTorneo})
    })
}

function verTorneos(req, res){
    Torneo.find({}, {nombreTorneo:1}, (err, encontrarTorneo) => {
        if (err) return res.status(500).send({ mensaje: "Error en la petición" })
        if (!encontrarTorneo) return res.status(404).send({ mensaje: "Error en el buscar torneos" })
    
        return res.status(200).send({ Torneos: encontrarTorneo })
    })
}

module.exports = {
    registrarAdmin,
    Login,
    crearUsuario,
    crearUsuarioAdmin,
    editarUsuario,
    eliminarUsuario,
    verUsuario,

//-----------------------
    agregarTorneo,
    editarTorneo,
    eliminarTorne,
    verTorneos

}