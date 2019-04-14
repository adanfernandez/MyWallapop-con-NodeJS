// Módulos
var express = require('express');
var app = express();
var fileUpload = require('express-fileupload');
app.use(fileUpload());
var mongo = require('mongodb');
var swig = require('swig');
var bodyParser = require('body-parser');
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
var gestorBDProductos = require("./modules/gestorBDProductos.js");
var gestorBDUsuarios = require("./modules/gestorBDUsuarios.js");
gestorBDProductos.init(app, mongo);
gestorBDUsuarios.init(app, mongo);
app.use(express.static('public'));
// Variables
app.set('port', 8081);
app.set('db', 'mongodb://admin:sdi123456789@sdi-actividad2-204-shard-00-00-pv4pc.mongodb.net:27017,sdi-actividad2-204-shard-00-01-pv4pc.mongodb.net:27017,sdi-actividad2-204-shard-00-02-pv4pc.mongodb.net:27017/test?ssl=true&replicaSet=sdi-actividad2-204-shard-0&authSource=admin&retryWrites=true');
//Rutas/controladores por lógica
//Rutas/controladores por lógica
require("./routes/rusuarios.js")(app, swig, gestorBDUsuarios);
require("./routes/rproductos.js")(app, swig, gestorBDProductos);
// lanzar el servidor
app.listen(app.get('port'), function() {
    console.log("Servidor activo");
});
