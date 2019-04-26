module.exports = function(app, swig, gestorBDUsuarios, gestorBDProductos) {
    app.get("/inicio", function(req, res) {
        var respuesta = swig.renderFile('views/busuarioAnonimo.html', {});
        res.send(respuesta);
    });
    app.get("/registrarse", function(req, res) {
        var respuesta = swig.renderFile('views/bregistro.html', {});
        res.send(respuesta);
    });
    app.get("/identificarse", function(req, res) {
        var respuesta = swig.renderFile('views/bidentificacion.html', {});
        res.send(respuesta);
    });
    app.post('/usuario', function(req, res) {
        if(req.body.password !== req.body.passwordConfirm){
            res.redirect("/registrarse?mensaje=Las contraseñas deben coincidir");
            return;
        }
        var seguro = app.get("crypto").createHmac('sha256', app.get('clave'))
            .update(req.body.password).digest('hex');
        var usuario = {
            email : req.body.email,
            nombre : req.body.nombre,
            apellidos : req.body.apellidos,
            password : seguro,
            admin : false,
            dinero : parseFloat("100")
        };
        var criterio = {
            email : req.body.email
        };
        gestorBDUsuarios.obtenerUsuarios(criterio, function (users) {
            if(users.length > 0) {
                res.redirect("/registrarse?mensaje=Usuario ya existente" + "&tipoMensaje=alert-danger");
            }
            else
            {
                gestorBDUsuarios.insertarUsuario(usuario, function(id) {
                    if (id == null){
                        res.redirect("/registrarse?mensaje=Error al registrar usuario")
                    } else {
                        res.redirect("/identificarse?mensaje=Nuevo usuario registrado");
                    }
                });
            }
        });
    });
    app.post("/identificarse", function(req, res) {
        var seguro = app.get("crypto").createHmac('sha256', app.get('clave'))
            .update(req.body.password).digest('hex');
        var criterio = {
            email : req.body.email,
            password : seguro
        };
        gestorBDUsuarios.obtenerUsuarios(criterio, function(usuarios) {
            if (usuarios == null || usuarios.length == 0) {
                req.session.usuario = null;
                res.redirect("/identificarse" +
                    "?mensaje=Email o password incorrecto"+
                    "&tipoMensaje=alert-danger ");
            } else {
                req.session.usuario = usuarios[0].email;
                req.session.dinero = usuarios[0].dinero,
                res.redirect("/tienda");
            }
        });
    });
    app.get('/desconectarse', function (req, res) {
        req.session.usuario = null;
        res.redirect("/inicio");
    });
    app.get('/admin', function (req, res) {
        var criterio = {
                admin : false
            };
        gestorBDUsuarios.obtenerUsuarios(criterio, function(usuarios)
        {
            var respuesta = swig.renderFile('views/blistarUsuarios.html', {
                usuarios : usuarios,
                usuario: req.session.usuario
            });
            res.send(respuesta);
        });
    });

    app.post('/usuario/eliminar', function (req, res) {
        var usuarios = req.body.usuarios;
        var criterio_usuario = {};
        var criterio_producto = {};
        if(typeof usuarios !== 'undefined'){
            //Si solo hay un usuario
            console.log("TIPO: " + typeof usuarios);
            if(typeof usuarios === "string")  {
                criterio_usuario = {
                    email : usuarios
                };
                criterio_producto = {
                    propietario : usuarios
                };
            }
            //Si hay más de un usuario seleccionado
            else if(typeof 'object')  {
                criterio_usuario = {
                    email : {$in : usuarios}
                };
                criterio_producto = {
                    propietario : {$in : usuarios}
                };
            }
            gestorBDUsuarios.eliminarUsuario(criterio_usuario, function (usuarios) {
               if(usuarios == null)
               {
                   res.redirect('/admin?mensaje=Se ha producido un error');
               }
            });
            gestorBDProductos.eliminarProducto(criterio_producto, function(productos)
            {
               if(productos == null)
               {
                   res.redirect('/admin?mensaje=Se ha producido un error');
               }
            });
        }
        res.redirect("/admin");
    });
};
