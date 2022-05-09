exports.verUsuario = function(req, res, next) {
    if(req.user.rol !== "USUARIO") return res.status(403).send({mensaje: "Solo puede acceder el usuario"})
    next();
}

exports.verAdmin = function(req, res, next) {
    if(req.user.rol !== "ADMIN") return res.status(403).send({mensaje: "Solo puede acceder el ADMIN"})
    next();
}