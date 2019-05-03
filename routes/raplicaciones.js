module.exports = function(app, gestorBDUsuarios, gestorBDProductos, gestorBDMensajes) {

    app.post("/api/autenticar/", function(req, res) {
        var seguro = app.get("crypto").createHmac('sha256', app.get('clave'))
            .update(req.body.password).digest('hex');
        var criterio = {
            email : req.body.email,
            password : seguro
        };
        gestorBDUsuarios.obtenerUsuarios(criterio, function(usuarios) {
            if (usuarios == null || usuarios.length == 0) {
                res.status(401); // Unauthorized
                res.json({
                    autenticado : false
                })
            } else {
                var token = app.get('jwt')
                    .sign(
                        {usuario: criterio.email , tiempo: Date.now()/1000},
                        "secreto");

                res.status(200);
                res.json({
                    autenticado : true,
                    token : token
                })
            }
        });
    });




    //Enviar mensajes
    app.post("/api/mensajes", function(req, res){
            var date = new Date();
            var usuario = res.usuario;
            var producto = req.body.producto;
            var criterio_producto = {
                "_id" : gestorBDProductos.mongo.ObjectID(producto)
            };
            gestorBDProductos.obtenerProductos(criterio_producto, function(productos){
                console.log(productos);
                if(productos == null)
                {
                    res.status(500);
                    res.json({
                        error : "se ha producido un error"
                    });
                }
                var propietario = productos[0].propietario;
                var texto = req.body.texto;
                var id_producto = productos[0]._id.toString();
                var criterio_conversacion = {
                    "usuario1" : usuario,
                    "usuario2": propietario,
                    "producto" : id_producto
                };

                if(usuario === propietario && typeof req.body.recep === 'undefined')
                {
                    res.status(500);
                    res.json({
                        error : "Error de formato. El usuario propietario de mensaje ha de indicar el destinatario."
                    })
                }
                else {
                    if (usuario === propietario && typeof req.body.recep !== 'undefined') {
                        var receptor = req.body.recep;
                        criterio_conversacion = {
                            "usuario1" : receptor,
                            "usuario2": propietario,
                            "producto" : id_producto
                        };
                    }
                    gestorBDMensajes.obtenerConversacion(criterio_conversacion, function (conversaciones) {
                        if(conversaciones.length === 0 && usuario === propietario) {
                            res.status(500);
                            res.json({
                                error : "se ha producido un error insertado el mensaje. El usuario propietario de un producto no puede iniciar el chat."
                            })
                        }
                        else if(conversaciones.length > 0) {
                            var id_conversacion = conversaciones[0]._id;
                            var criterio_mensaje = {
                                "emisor" : usuario,
                                "texto" : texto,
                                "leido" : false,
                                "fecha" : date.getUTCDate() + '/' + (date.getUTCMonth() + 1) + '/' + date.getFullYear(),
                                "conversacion" : id_conversacion
                            };
                            gestorBDMensajes.insertarMensaje(criterio_mensaje, function (mensajes) {
                                if(mensajes == null) {
                                    res.status(500);
                                    res.json({
                                        error : "se ha producido un error insertado el mensaje"
                                    })
                                }
                                else  {
                                    res.status(201);
                                    res.json({
                                        error : "Mensaje enviado"
                                    })
                                }
                            });
                        }
                        else {
                            gestorBDMensajes.insertarConversacion(criterio_conversacion, function (convers) {
                                if(convers == null)  {
                                    res.status(500); // Unauthorized
                                    res.json({
                                        error: "se ha producido un error insertando la conversación"
                                    })
                                }
                                else  {
                                    var criterio_mensaje = {
                                        "emisor" : usuario,
                                        "texto" : texto,
                                        "leido" : false,
                                        "fecha" : date.getUTCDate() + '/' + (date.getUTCMonth() + 1) + '/' + date.getFullYear(),
                                        "conversacion" : convers
                                    };
                                    gestorBDMensajes.insertarMensaje(criterio_mensaje, function (mensajes) {
                                        if(mensajes == null)
                                        {
                                            res.status(500);
                                            res.json({
                                                error : "se ha producido un error insertando el mensaje"
                                            })
                                        }
                                        else
                                        {
                                            res.status(201);
                                            res.json({
                                                error : "Mensaje enviado"
                                            })
                                        }
                                    });
                                }
                            });
                            }
                        });
                    }
            });
        }
    );





    app.get("/api/leermensajes/:producto", function(req, res) {
        var usuario = res.usuario;
        var producto = req.params.producto;

        var criterio_producto = {
            _id : gestorBDProductos.mongo.ObjectID(producto)
        };
        gestorBDProductos.obtenerProductos(criterio_producto, function(productos)
        {
            if(productos == null)
            {
                res.status(500);
                res.json({
                    error : "no se ha encontrado el producto"
                })
            }
            else
            {
                if(productos)
                {
                    var criterio_conversacion = {
                        producto : producto
                    };
                    if(productos[0].propietario !== usuario) {
                        criterio_conversacion = {
                            producto : producto,
                            usuario1 : usuario
                        };
                    }
                    else if(productos[0].propietario === usuario)
                    {
                        criterio_conversacion = {
                            producto : producto,
                            usuario2 : usuario
                        }
                    }
                    gestorBDMensajes.obtenerConversacion(criterio_conversacion, function(conversaciones)
                    {
                        if(conversaciones === null) {
                            res.status(501);
                            res.json({
                                error : "se ha producido un error obteniendo las conversaciones las conversaciones"
                            })
                        }
                        else if(productos[0].propietario)
                        {
                            console.log("PROPIETARIO");
                            console.log("conseguirCONVERSACIONES ---------------> " + typeof req.headers['conversacion']);

                            if(typeof req.headers['conversacion'] === 'undefined') {
                                res.status(200);
                                res.send(JSON.stringify(conversaciones));
                            }
                            else if(typeof req.headers['conversacion'] !== 'undefined')
                            {
                                var conversacion = req.headers['conversacion'];
                                var criterio_mensajes = {
                                    "conversacion": gestorBDMensajes.mongo.ObjectID(conversacion)
                                };
                                console.log("CRITERIO MENSAJE --------->   " + criterio_mensajes);
                                gestorBDMensajes.obtenerMensajes(criterio_mensajes, function (mensajes) {
                                    if (mensajes == null) {
                                        res.status(501);
                                        res.json({
                                            error: "se ha producido un error con los mensajes"
                                        })
                                    } else {
                                        res.status(200);
                                        res.send(JSON.stringify(mensajes));
                                    }
                                });
                            }
                        }
                        else {
                            var criterio_mensajes = {
                                conversacion: {
                                    $in: conversaciones.map(c => c._id)
                                }
                            };
                            gestorBDMensajes.obtenerMensajes(criterio_mensajes, function (mensajes) {
                                if (mensajes == null) {
                                    res.status(501);
                                    res.json({
                                        error: "se ha producido un error con los mensajes"
                                    })
                                } else {
                                    res.status(200);
                                    res.send(JSON.stringify(mensajes));
                                }
                            });
                        }
                    });
                }
            }
        });
    });
}
