module.exports = function(app, swig, gestorBD) {
    app.post("/producto", function(req, res) {

        var producto = {
            nombre : req.body.nombre,
            descripcion : req.body.descripcion,
            precio : req.body.precio
        };
        // Conectarse
        gestorBD.insertarProducto(producto, function(id){
            if (id == null) {
                res.send("Error al insertar producto");
            } else {
                res.send("Producto agregado: " + id);
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
