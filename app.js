// Módulos
var express = require('express');
var app = express();
app.use(function(req, res, next) {
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Credentials", "true");
    res.header("Access-Control-Allow-Methods", "POST, GET, DELETE, UPDATE, PUT");
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept, token");
    next();
});
var jwt = require('jsonwebtoken');
app.set('jwt',jwt);
var expressSession = require('express-session');
app.use(expressSession({
    secret: 'sdi123456789',
    resave: true,
    saveUninitialized: true
}));
var crypto = require('crypto');
var fileUpload = require('express-fileupload');
app.use(fileUpload());
var mongo = require('mongodb');
var swig = require('swig');
var bodyParser = require('body-parser');
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
var gestorBDProductos = require("./modules/gestorBDProductos.js");
var gestorBDUsuarios = require("./modules/gestorBDUsuarios.js");
var gestorBDMensajes = require("./modules/gestorBDMensajes.js");
gestorBDProductos.init(app, mongo);
gestorBDUsuarios.init(app, mongo);
gestorBDMensajes.init(app, mongo);
var routerCompras = express.Router();
routerCompras.use(function(req, res, next) {
    if ( req.session.usuario ) {
        if( req.session.usuario != 'admin@email.com'){
            next();
        }
        else {
            res.redirect("/admin");
        }
    } else {
        res.redirect("/inicio");
    }
});
//Sólo podrán agregar canciones y acceder a publicaciones los usuarios registrados y loggeados.
app.use("/productos/agregar",routerCompras);
app.use("/publicaciones",routerCompras);
app.use("/tienda",routerCompras);
app.use("/producto/comprar",routerCompras);
app.use("/compras",routerCompras);
var routerAdmin = express.Router();
routerAdmin.use(function(req, res, next) {
    if ( req.session.usuario ) {
        if (req.session.usuario == 'admin@email.com') {
            next();
        } else {
            res.redirect('/tienda');
        }
    }
    else {
        res.redirect('/inicio')
    }
});
app.use("/admin",routerAdmin);
//routerUsuarioPropietario
var routerUsuarioPropietario = express.Router();
routerUsuarioPropietario.use(function(req, res, next) {
    var path = require('path');
    var id = path.basename(req.originalUrl);
    gestorBDProductos.obtenerProductos(
        {_id: mongo.ObjectID(id) }, function (productos) {
            if(productos[0].propietario == req.session.usuario ){
                next();
            } else {
                res.redirect("/tienda");
            }
        })
});
var routerAnonimo = express.Router();
routerAnonimo.use(function(req, res, next) {
    if ( req.session.usuario ) {
        if (req.session.usuario == 'admin@email.com') {
            res.redirect('/admin');
        } else {
            res.redirect('/tienda');
        }
    }
    else {
        next();
    }
});

// routerUsuarioToken
var routerUsuarioToken = express.Router();
routerUsuarioToken.use(function(req, res, next) {
    // obtener el token, vía headers (opcionalmente GET y/o POST).
    var token = req.headers['token'] || req.body.token || req.query.token;
    if (token != null) {
        // verificar el token
        jwt.verify(token, 'secreto', function(err, infoToken) {
            if (err || (Date.now()/1000 - infoToken.tiempo) > 240 ){
                res.status(403); // Forbidden
                res.json({
                    acceso : false,
                    error: 'Token invalido o caducado'
                });
                // También podríamos comprobar que intoToken.usuario existe
                return;

            } else {
                // dejamos correr la petición
                res.usuario = infoToken.usuario;
                next();
            }
        });

    } else {
        res.status(403); // Forbidden
        res.json({
            acceso : false,
            mensaje: 'No hay Token'
        });
    }
});
// Aplicar routerUsuarioToken
app.use('/api/productosdisponibles', routerUsuarioToken);
app.use('/api/mensajes', routerUsuarioToken);
app.use('/api/leermensajes', routerUsuarioToken);
app.use('/api/misproductos', routerUsuarioToken);
app.use("/inicio",routerAnonimo);
//Solo podrán modificar y eliminar productos sus propietarios
app.use("/producto/modificar",routerUsuarioPropietario);
app.use("/producto/eliminar",routerUsuarioPropietario);
var routerLogger = express.Router();
routerLogger.use(function (req, res, next) {
    console.log("USUARIO: " + req.session.usuario + ":  " + req.originalUrl);
    next();
});
app.use("/", routerLogger);
app.use(express.static('public'));
app.get('/', function (req, res) {
    if(req.session.usuario)
    {
        if(req.session.usuario == 'admin@email.com')
        {
            res.redirect('/registrarse');
        }
        else
        {
            res.redirect('/tienda');
        }
    }
    else
    {
        res.redirect('/inicio');
    }
});
// Variables
app.set('port', 8081);
app.set('db', 'mongodb://admin:sdi123456789@sdi-actividad2-204-shard-00-00-pv4pc.mongodb.net:27017,sdi-actividad2-204-shard-00-01-pv4pc.mongodb.net:27017,sdi-actividad2-204-shard-00-02-pv4pc.mongodb.net:27017/test?ssl=true&replicaSet=sdi-actividad2-204-shard-0&authSource=admin&retryWrites=true');
app.set('clave','sdi123456789');
app.set('crypto', crypto);
//Rutas/controladores por lógica
require("./routes/rusuarios.js")(app, swig, gestorBDUsuarios, gestorBDProductos);
require("./routes/rproductos.js")(app, swig, gestorBDProductos, gestorBDUsuarios);
require("./routes/rapiproductos.js")(app, gestorBDProductos);
require("./routes/raplicaciones.js")(app, gestorBDUsuarios, gestorBDProductos, gestorBDMensajes);
require("./routes/rtesting.js")(app, gestorBDUsuarios, gestorBDProductos, gestorBDMensajes);
// lanzar el servidor
app.listen(app.get('port'), function() {
    console.log("Servidor activo");
});
