module.exports = function(app, swig, gestorBDProductos, gestorBDUsuarios) {
    app.post("/producto", function(req, res) {

        if(req.body.nombre === '' || req.body.descripcion === '' || req.body.precio === '')
        {
            res.redirect("/productos/agregar" +
                "?mensaje=Inserte los campos obligatorios" +
                "&tipoMensaje=alert-danger ");
        }
        else {
            var date = new Date();
            var producto = {
                nombre: req.body.nombre,
                descripcion: req.body.descripcion,
                precio: req.body.precio,
                fecha: date.getUTCDate() + '/' + (date.getUTCMonth() + 1) + '/' + date.getFullYear(),
                propietario: req.session.usuario,
                comprador: null
            };
            gestorBDProductos.insertarProducto(producto, function (id) {
                if (id == null) {
                    res.redirect("/productos/agregar" +
                        "?mensaje=Error al insertar el producto" +
                        "&tipoMensaje=alert-danger ");
                } else {
                    if (req.files != null) {
                        if (req.files.imagen != null) {
                            var imagen = req.files.imagen;
                            imagen.mv('public/portadas/' + id + '.png', function (err) {
                                if (err) {
                                    res.redirect("/tienda?mensaje=Se ha producido un error.");
                                }
                            });
                        }
                    }
                    res.redirect("/publicaciones");
                }
            });
        }
    });
    app.get('/productos/agregar', function (req, res) {
        var respuesta = swig.renderFile('views/bagregar.html', {
            usuario : req.session.usuario,
            dinero : req.session.dinero
        });
        res.send(respuesta);
    });
    app.get("/tienda", function(req, res) {
        var criterio  = {};
        if( req.query.busqueda != null ){
            criterio = {
                "nombre" :  {$regex : ".*"+req.query.busqueda +".*", $options: 'i'},
            };
        }

        var pg = parseInt(req.query.pg); // Es String !!!
        if ( req.query.pg == null){ // Puede no venir el param
            pg = 1;
        }

        gestorBDProductos.obtenerProductosPg(criterio, pg , function(productos, total ) {
            if (productos == null) {
                res.send("Error al listar ");
            } else {
                var ultimaPg = total/4;
                if (total % 4 > 0 ){ // Sobran decimales
                    ultimaPg = ultimaPg+1;
                }
                var paginas = []; // paginas mostrar
                for(var i = pg-2 ; i <= pg+2 ; i++){
                    if ( i > 0 && i <= ultimaPg){
                        paginas.push(i);
                    }
                }
                var respuesta = swig.renderFile('views/btienda.html',
                    {
                        productos : productos,
                        usuario : req.session.usuario,
                        dinero : req.session.dinero,
                        paginas: paginas,
                        actual : pg
                    });
                res.send(respuesta);
            }
        });
    });
    app.get('/producto/:id', function (req, res) {
        var criterio = { "_id" : gestorBDProductos.mongo.ObjectID(req.params.id)  };
        gestorBDProductos.obtenerProductos(criterio,function(productos){
            if ( productos == null ){
                res.redirect('/tienda');
            } else {
                var respuesta = swig.renderFile('views/bproducto.html',
                    {
                        producto : productos[0],
                        usuario : req.session.usuario,
                        dinero : req.session.dinero
                    });
                res.send(respuesta);
            }
        });
    });
    app.get("/publicaciones", function(req, res) {
        var criterio = { propietario : req.session.usuario };
        gestorBDProductos.obtenerProductos(criterio, function(productos) {
            if (productos == null) {
                res.send("Error al listar ");
            } else {
                var respuesta = swig.renderFile('views/bpublicaciones.html',
                    {
                        productos : productos,
                        usuario : req.session.usuario,
                        dinero : req.session.dinero
                    });
                res.send(respuesta);
            }
        });
    });
    app.get('/producto/modificar/:id', function (req, res) {
        var criterio = { "_id" : gestorBDProductos.mongo.ObjectID(req.params.id) };
        gestorBDProductos.obtenerProductos(criterio,function(productos){
            if ( productos == null ){
                res.redirect('/publicaciones');
            } else {
                var respuesta = swig.renderFile('views/bproductoModificar.html',
                    {
                        producto : productos[0],
                        usuario : req.session.usuario,
                        dinero : req.session.dinero
                    });
                res.send(respuesta);
            }
        });
    });
    app.post('/producto/modificar/:id', function (req, res) {
        var id = req.params.id;
        var criterio = { "_id" : gestorBDProductos.mongo.ObjectID(id) };
        var producto = {
            nombre : req.body.nombre,
            descripcion : req.body.descripcion,
            precio : req.body.precio
        };
        gestorBDProductos.modificarProducto(criterio, producto, function(result) {
            if (result == null) {
                res.send("Error al modificar ");
            } else {
                modificarFoto(req.files, id, function (result) {
                    if( result == null){
                        res.redirect("/publicaciones");
                    } else {
                        res.redirect("/publicaciones");
                    }
                });
            }
        });
    });
    function modificarFoto(files, id, callback) {
        if(files != null){
            if (files.portada != null) {
                var imagen = files.portada;
                    imagen.mv('public/portadas/' + id + '.png', function (err) {
                        if (err) {
                            callback(null); // ERROR
                        } else {
                            callback(true);
                        }
                    });
            }
        }
        else
        {
            callback(true);
        }
    }
    app.get('/producto/eliminar/:id', function (req, res) {
        var criterio = {"_id" : gestorBDProductos.mongo.ObjectID(req.params.id) };
        gestorBDProductos.eliminarProducto(criterio,function(productos){
            if ( productos == null ){
                res.send(respuesta);
            } else {
                res.redirect("/publicaciones");
            }
        });
    });
    app.get('/producto/comprar/:id', function (req, res) {
        var productoId = gestorBDProductos.mongo.ObjectID(req.params.id);
        var criterio = {
            "_id" : productoId
        };
        var producto = {
            "comprador" : req.session.usuario
        };
        gestorBDProductos.obtenerProductos(criterio, function (productos) {
                if (productos == null) {
                    res.redirect("/tienda?mensaje=Ha ocurrido un error");
                } else {
                    var criterio_usuario = {
                        email : req.session.usuario
                    };
                    gestorBDUsuarios.obtenerUsuarios(criterio_usuario, function(usuarios)
                        {
                            if(productos[0].precio > usuarios[0].dinero)
                            {
                                res.redirect("/tienda?mensaje=No posee suficiente dinero");
                            }
                            else
                            {
                                if (productos[0].propietario !== req.session.usuario && productos[0].comprador == null) {
                                    gestorBDProductos.modificarProducto(criterio, producto, function (idCompra) {
                                        if (idCompra == null) {
                                            res.redirect("/tienda?mensaje=Ha ocurrido un error");
                                        } else {
                                            var actualizacion_usuario = {
                                                dinero : usuarios[0].dinero - productos[0].precio
                                            };
                                            req.session.dinero = usuarios[0].dinero - productos[0].precio;
                                            gestorBDUsuarios.modificarUsuarios(criterio_usuario, actualizacion_usuario, function (users) {
                                                    if(users == null)
                                                        res.redirect("/tienda?mensaje=Ha ocurrido un error");
                                                    else
                                                        res.redirect("/compras");
                                                }
                                            );
                                        }
                                    });
                                } else {
                                    res.redirect("/tienda?mensaje=Ha ocurrido un error");
                                }
                            }
                        }
                    );
                }
            });
    });
    app.get('/compras', function (req, res) {
        var criterio = { "comprador" : req.session.usuario };
        gestorBDProductos.obtenerProductos( criterio, function(productos) {
            if (productos == null) {
                res.send("Error al listar productos");
            } else {
                var respuesta = swig.renderFile('views/bcompras.html',
                    {
                        productos : productos,
                        usuario : req.session.usuario,
                        dinero : req.session.dinero
                    });
                res.send(respuesta);
            }
        });
    });
};
