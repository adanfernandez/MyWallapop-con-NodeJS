module.exports = function(app, gestorBDProductos) {

    app.get("/api/productosdisponibles", function(req, res) {

        var criterio = {
            propietario : { $nin : [res.usuario]},
            comprador : null
        };
        gestorBDProductos.obtenerProductos( criterio, function(productos) {
            if (productos == null) {
                res.status(500);
                res.json({
                    error : "se ha producido un error"
                })
            } else {
                res.status(200);
                res.send( JSON.stringify(productos) );
            }
        });
    });

    app.get("/api/misproductos", function(req, res) {

        var criterio = {
            propietario : res.usuario
        };

        console.log("USUARIO AUTENTIFICADO:  -->  " + res.usuario);

        gestorBDProductos.obtenerProductos( criterio, function(productos) {
            if (productos == null) {
                res.status(500);
                res.json({
                    error : "se ha producido un error"
                })
            } else {
                res.status(200);
                res.send( JSON.stringify(productos) );
            }
        });
    });
}
