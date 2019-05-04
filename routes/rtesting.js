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
                                                            email: "admin@email.com",
                                                            nombre: "admin",
                                                            apellidos: "admin",
                                                            password: app.get("crypto").createHmac('sha256', app.get('clave'))
                                                                .update("admin").digest('hex'),
                                                            admin: true,
                                                            dinero: 100
                                                        };
                                                        gestorBDUsuarios.insertarUsuario(usuario5, function (usuario) {
                                                            if (usuario == null) {
                                                                res.send("Error pruebas");
                                                            } else {
                                                                var producto1 = {
                                                                    nombre : "lampara",
                                                                    descripcion : "flexo",
                                                                    precio : 12,
                                                                    fecha : new Date(),
                                                                    propietario : "josefo@josefo",
                                                                    comprador : null
                                                                }
                                                                gestorBDProductos.insertarProducto(producto1, function(producto){
                                                                   if(producto == null){
                                                                       res.send("Error pruebas");
                                                                   }
                                                                   else{
                                                                       var producto2 = {
                                                                           nombre : "ordenador",
                                                                           descripcion : "top",
                                                                           precio : 100,
                                                                           fecha : new Date(),
                                                                           propietario : "josefo@josefo",
                                                                           comprador : null
                                                                       }
                                                                       gestorBDProductos.insertarProducto(producto2, function(producto){
                                                                           if(producto == null){
                                                                               res.send("Error pruebas");
                                                                           }
                                                                           else{
                                                                               var producto3 = {
                                                                                   nombre : "ladron",
                                                                                   descripcion : "util",
                                                                                   precio : 3,
                                                                                   fecha : new Date(),
                                                                                   propietario : "adalino@adalino",
                                                                                   comprador : "xurdellu@xurdellu"
                                                                               }
                                                                               gestorBDProductos.insertarProducto(producto3, function(producto){
                                                                                   if(producto == null){
                                                                                       res.send("Error pruebas");
                                                                                   }
                                                                                   else{
                                                                                       var producto4 = {
                                                                                           nombre : "nokia",
                                                                                           descripcion : "guapo",
                                                                                           precio : 101,
                                                                                           fecha : new Date(),
                                                                                           propietario : "diego@diego",
                                                                                           comprador : null
                                                                                       }
                                                                                       gestorBDProductos.insertarProducto(producto4, function(producto){
                                                                                           if(producto == null){
                                                                                               res.send("Error pruebas");
                                                                                           }
                                                                                           else{
                                                                                               var producto5 = {
                                                                                                   nombre : "balon",
                                                                                                   descripcion : "patalear",
                                                                                                   precio : 10,
                                                                                                   fecha : new Date(),
                                                                                                   propietario : "xurdellu@xurdellu",
                                                                                                   comprador : "diego@diego"
                                                                                               }
                                                                                               gestorBDProductos.insertarProducto(producto5, function(producto){
                                                                                                   if(producto == null) {
                                                                                                       res.send("Error pruebas");
                                                                                                   }
                                                                                                   else {
                                                                                                       var producto6 = {
                                                                                                           nombre : "gafas",
                                                                                                           descripcion : "ver",
                                                                                                           precio : 50,
                                                                                                           fecha : new Date(),
                                                                                                           propietario : "adalino@adalino",
                                                                                                           comprador : "josefo@josefo"
                                                                                                       }
                                                                                                       gestorBDProductos.insertarProducto(producto6, function(producto){
                                                                                                           if(producto == null){
                                                                                                               res.send("Error pruebas");
                                                                                                           }
                                                                                                           else {
                                                                                                               var producto7 = {
                                                                                                                   nombre: "radio",
                                                                                                                   descripcion: "escuchar carrusel deportivo",
                                                                                                                   precio: 15,
                                                                                                                   fecha: new Date(),
                                                                                                                   propietario: "josefo@josefo",
                                                                                                                   comprador: "adalino@adalino"
                                                                                                               }
                                                                                                               gestorBDProductos.insertarProducto(producto7, function (producto) {
                                                                                                                   if (producto == null) {
                                                                                                                       res.send("Error pruebas");
                                                                                                                   } else {
                                                                                                                       var producto8 = {
                                                                                                                           nombre: "llavero",
                                                                                                                           descripcion: "llevar llaves",
                                                                                                                           precio: 2,
                                                                                                                           fecha: new Date(),
                                                                                                                           propietario: "diego@diego",
                                                                                                                           comprador: null
                                                                                                                       }
                                                                                                                       gestorBDProductos.insertarProducto(producto8, function (producto) {
                                                                                                                           if (producto == null) {
                                                                                                                               res.send("Error pruebas");
                                                                                                                           } else {
                                                                                                                               
                                                                                                                               var conversacion = {
                                                                                                                                    "usuario1" :  "adalino@adalino",
                                                                                                                                    "usuario2" : "diego@diego",
                                                                                                                                    "producto" : producto.toString()
                                                                                                                               };
                                                                                                                               gestorBDMensajes.insertarConversacion(conversacion, function (conversacion) {
                                                                                                                                    if(conversacion === null) {
                                                                                                                                        res.send("Error pruebas");
                                                                                                                                    } else{
                                                                                                                                        var mensaje = {
                                                                                                                                            "emisor" : "adalino@adalino",
                                                                                                                                            "texto" : "Hola. Estoy interesado",
                                                                                                                                            "leido" : false,
                                                                                                                                            "fecha" : new Date(),
                                                                                                                                            "conversacion" : conversacion
                                                                                                                                        };
                                                                                                                                        gestorBDMensajes.insertarMensaje(mensaje, function (mensaje) {
                                                                                                                                            if(mensaje === null) {
                                                                                                                                                res.send("Error pruebas");
                                                                                                                                            }
                                                                                                                                            else {
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
