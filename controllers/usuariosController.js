const { body, validationResult } = require('express-validator');
const monogoose = require('mongoose');
const Usuarios = monogoose.model('Usuarios');



exports.formCrearCuenta = (req, res) => {
    res.render('crear-Cuenta', {
        nombrePagina: 'Crea tu cuenta en DevJobs',
        tagline: 'Comienza a publicar tus vacantes gratis, solo debes crear una cuenta'
    });
}

exports.crearUsuario = async (req, res) => {
    //Crear el usuario
    const usuario = new Usuarios(req.body);

    try {
        await usuario.save();
        res.redirect('/iniciar-sesion');
    } catch (error) {
        req.flash('error', error);
        res.redirect('/crear-cuenta');
    }
}


exports.validarRegistro = async (req, res, next) => {

    // Sanitizar y validar los campos
    
    const rules = [
        body('nombre').not().isEmpty().withMessage('El nombre es obligatorio').escape(),
        body('email').isEmail().withMessage('El email debe ser valido'),
        body('password').not().isEmpty().withMessage('El password no puede ir vacío').escape(),
        body('confirmar').not().isEmpty().withMessage('Confirmar tu password es obligatorio').escape(),
        body('confirmar').equals(req.body.password).withMessage('Los passwords no son iguales')
    ];


    await Promise.all(rules.map(validation => validation.run(req)));
    const errores = validationResult(req);

    if(!errores.isEmpty()) {
        req.flash('error', errores.array().map(error => error.msg));
        res.render('crear-cuenta', {
            nombrePagina: 'Crea tu cuenta en DevJobs',
            tagline: 'Comienza a publicar tus vacantes gratis, solo debes crear una cuenta',
            mensajes: req.flash()
        });
        return;
    }

    next();
}

// Formulario para iniciar sesión

exports.formIniciarSesion = (req, res) => {

        body('email').isEmail().withMessage('El email debe ser valido').normalizeEmail(),
        body('password').not().isEmpty().withMessage('El password no puede ir vacío').escape(),

    res.render('iniciar-sesion', {
        nombrePagina: 'Iniciar Sesión DevJobs'
    });
}

exports.formEditarPerfil = (req, res) => {
    res.render('editar-perfil', {
        nombrePagina: 'Edita tu perfil en DevJobs',
        usuario: req.user.toObject(),

  });
}


