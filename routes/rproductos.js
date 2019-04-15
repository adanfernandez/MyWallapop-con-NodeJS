module.exports = function(app, swig, gestorBDProductos) {
    app.post("/producto", function(req, res) {
        var date = new Date();
        var producto = {
            nombre : req.body.nombre,
            descripcion : req.body.descripcion,
            precio : req.body.precio,
            fecha: date.getUTCDate() + '/' + (date.getUTCMonth() + 1) + '/' + date.getFullYear(),
            propietario : req.session.usuario,
            comprador : null
        };
        gestorBDProductos.insertarProducto(producto, function(id){
            if (id == null) {
                res.send("Error al insertar producto");
            } else {
                if (req.files.imagen != null) {
                    var imagen = req.files.imagen;
                    imagen.mv('public/portadas/' + id + '.png', function(err) {
                        if (err) {
                            res.send("Error al subir la imagen");
                        } else {
                            res.redirect("/publicaciones");
                        }
                    });
                }
            }
        });

    });
    app.get('/productos/agregar', function (req, res) {
        var respuesta = swig.renderFile('views/bagregar.html', {
        });
        res.send(respuesta);
    });

    app.get("/tienda", function(req, res) {
        var criterio  = {};
        if( req.query.busqueda != null ){
            criterio = { "nombre" :  {$regex : ".*"+req.query.busqueda +".*", $options: 'i'} };
        }
        gestorBDProductos.obtenerProductos( criterio, function(productos) {
            if (productos == null) {
                res.send("Error al listar productos");
            } else {
                var respuesta = swig.renderFile('views/btienda.html',
                    {
                        productos : productos
                    });
                res.send(respuesta);
            }
        });
    });

    app.get('/producto/:id', function (req, res) {
        var criterio = { "_id" : gestorBDProductos.mongo.ObjectID(req.params.id)  };
        gestorBDProductos.obtenerProductos(criterio,function(productos){
            if ( productos == null ){
                res.send(respuesta);
            } else {
                var respuesta = swig.renderFile('views/bproducto.html',
                    {
                        producto : productos[0]
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
                        productos : productos
                    });
                res.send(respuesta);
            }
        });
    });
    app.get('/producto/modificar/:id', function (req, res) {
        var criterio = { "_id" : gestorBDProductos.mongo.ObjectID(req.params.id) };
        gestorBDProductos.obtenerProductos(criterio,function(productos){
            if ( productos == null ){
                res.send(respuesta);
            } else {
                var respuesta = swig.renderFile('views/bproductoModificar.html',
                    {
                        producto : productos[0]
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
        }
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
    })
};
