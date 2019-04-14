// Módulos
var express = require('express');
var app = express();
var mongo = require('mongodb');
var swig = require('swig');
var bodyParser = require('body-parser');
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
var gestorBD = require("./modules/gestorBD.js");
gestorBD.init(app, mongo);
app.use(express.static('public'));
// Variables
app.set('port', 8081);
app.set('db', 'mongodb://admin:sdi123456789@sdi-actividad2-204-shard-00-00-pv4pc.mongodb.net:27017,sdi-actividad2-204-shard-00-01-pv4pc.mongodb.net:27017,sdi-actividad2-204-shard-00-02-pv4pc.mongodb.net:27017/test?ssl=true&replicaSet=sdi-actividad2-204-shard-0&authSource=admin&retryWrites=true');
//Rutas/controladores por lógica
//Rutas/controladores por lógica
require("./routes/rusuarios.js")(app, swig, gestorBD);
require("./routes/rproductos.js")(app, swig, gestorBD);
// lanzar el servidor
app.listen(app.get('port'), function() {
    console.log("Servidor activo");
});
