// Módulos
var express = require('express');
var app = express();

// Variables
app.set('port', 8081);

app.get('/usuarios', function(req, res) {
    res.send('ver usuarios');
});

app.get('/productos', function(req, res) {
    res.send('ver productos');
});

// lanzar el servidor
app.listen(app.get('port'), function() {
    console.log("Servidor activo");
});
