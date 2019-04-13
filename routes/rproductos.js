module.exports = function(app, swig) {
    app.post("/producto", function(req, res) {
        res.send("Nombre:"+req.body.nombre +"<br>"
            +" precio: "+req.body.precio);
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
