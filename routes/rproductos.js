module.exports = function(app, swig, gestorBDProductos) {
    app.post("/producto", function(req, res) {
        var date = new Date();
        var producto = {
            nombre : req.body.nombre,
            descripcion : req.body.descripcion,
            precio : req.body.precio,
            fecha: date.getUTCDate() + '/' + (date.getUTCMonth() + 1) + '/' + date.getFullYear(),
            propietario : '',
            comprador : ""
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
                            res.send("Agregado id: " + id);
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
    })
};
