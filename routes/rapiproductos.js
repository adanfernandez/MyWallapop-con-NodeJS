module.exports = function(app, gestorBDProductos) {

    app.get("/api/producto", function(req, res) {
        gestorBDProductos.obtenerProductos( {} , function(productos) {
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

    app.get("/api/producto/:id", function(req, res) {
        var criterio = { "_id" : gestorBD.mongo.ObjectID(req.params.id)}

        gestorBDProductos.obtenerProductos(criterio,function(productos){
            if ( productos == null ){
                res.status(500);
                res.json({
                    error : "se ha producido un error"
                })
            } else {
                res.status(200);
                res.send( JSON.stringify(productos[0]) );
            }
        });
    });
}
