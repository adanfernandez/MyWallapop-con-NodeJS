module.exports = function(app, gestorBDUsuarios, gestorBDProductos, gestorBDMensajes) {

    app.get("/testing", function (req, res) {
        gestorBDUsuarios.eliminarUsuario({}, function (usuarios) {
            gestorBDProductos.eliminarProducto({}, function (productos) {
                gestorBDMensajes.eliminarConversacion({}, function (conversaciones) {
                    gestorBDMensajes.eliminarMensaje({}, function (mensajes) {
                        var usuario1 = {
                            email: "josefo@josefo",
                            nombre: "josefo",
                            apellidos: "josefo",
                            password: app.get("crypto").createHmac('sha256', app.get('clave'))
                                .update("123456").digest('hex'),
                            admin: false,
                            dinero: parseFloat("100")
                        };
                        gestorBDUsuarios.insertarUsuario(usuario1, function (usuario) {
                            if (usuario == null) {
                                send("Error pruebas");
                            } else {
                                var usuario2 = {
                                    email: "adalino@adalino",
                                    nombre: "adalino",
                                    apellidos: "adalino",
                                    password: app.get("crypto").createHmac('sha256', app.get('clave'))
                                        .update("123456").digest('hex'),
                                    admin: false,
                                    dinero: parseFloat("100")
                                };
                                gestorBDUsuarios.insertarUsuario(usuario2, function (usuario) {
                                    if (usuario == null) {
                                        send("Error pruebas");
                                    } else {
                                        var usuario3 = {
                                            email: "xurdellu@xurdellu",
                                            nombre: "xurdellu",
                                            apellidos: "xurdellu",
                                            password: app.get("crypto").createHmac('sha256', app.get('clave'))
                                                .update("123456").digest('hex'),
                                            admin: false,
                                            dinero: parseFloat("100")
                                        };
                                        gestorBDUsuarios.insertarUsuario(usuario3, function (usuario) {
                                            if (usuario == null) {
                                                send("Error pruebas");
                                            } else {
                                                var usuario4 = {
                                                    email: "diego@diego",
                                                    nombre: "diego",
                                                    apellidos: "diego",
                                                    password: app.get("crypto").createHmac('sha256', app.get('clave'))
                                                        .update("123456").digest('hex'),
                                                    admin: false,
                                                    dinero: parseFloat("100")
                                                };
                                                gestorBDUsuarios.insertarUsuario(usuario4, function (usuario) {
                                                    if (usuario == null) {
                                                        send("Error pruebas");
                                                    } else {
                                                        var usuario5 = {
                                                            email: "esteban@esteban",
                                                            nombre: "esteban",
                                                            apellidos: "esteban",
                                                            password: app.get("crypto").createHmac('sha256', app.get('clave'))
                                                                .update("123456").digest('hex'),
                                                            admin: false,
                                                            dinero: parseFloat("100")
                                                        };
                                                        gestorBDUsuarios.insertarUsuario(usuario5, function (usuario) {
                                                            if (usuario == null) {
                                                                res.send("Error pruebas");
                                                            } else {
                                                                res.redirect("/inicio");
                                                            }
                                                        });
                                                    }
                                                });
                                            }
                                        });
                                    }
                                });
                            }
                        });
                    });
                });
            });
        });
    })
}
