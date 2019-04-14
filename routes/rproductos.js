module.exports = function(app, swig, mongo) {
    app.post("/producto", function(req, res) {
        var producto = {
            nombre : req.body.nombre,
            descripcion : req.body.descripcion,
            precio : req.body.precio
        }

        // Conectarse
        mongo.MongoClient.connect(app.get('db'), function(err, db) {
            if (err) {
                res.send("Error de conexión: " + err);
            } else {
                var collection = db.collection('productos');
                collection.insert(producto, function(err, result) {
                    if (err) {
                        res.send("Error al insertar " + err);
                    } else {
                        res.send("Agregada id: "+ result.ops[0]._id);
                    }
                    db.close();
                });
            }
        });

    });


    app.get('/productos/agregar', function (req, res) {
        var respuesta = swig.renderFile('views/bagregar.html', {

        });
        res.send(respuesta);
    })


    app.get("/productos", function(req, res) {
        var productos = [ {
            "nombre" : "Blank space",
            "precio" : "1.2"
        }, {
            "nombre" : "See you again",
            "precio" : "1.3"
        }, {
            "nombre" : "Uptown Funk",
            "precio" : "1.1"
        } ];
        var respuesta = swig.renderFile('views/btienda.html', {
            vendedor : 'Tienda de canciones',
            productos : productos
        });
        res.send(respuesta);
    });
};
