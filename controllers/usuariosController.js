const { body, validationResult } = require("express-validator");
const monogoose = require("mongoose");
const Usuarios = monogoose.model("Usuarios");
const multer = require("multer");
const shortid = require("shortid");

//Subir imagen
exports.subirImagen = (req, res, next) => {
    upload(req, res, function(error) {
        if(error) {
            if(error instanceof multer.MulterError) {
                if(error.code === 'LIMIT_FILE_SIZE') {
                    req.flash('error', 'El archivo es muy grande: Máximo 100kb ');
                } else {
                    req.flash('error', error.message);
                }
            } else {
                req.flash('error', error.message);
            }
            res.redirect('/administracion');
            return;
        } else {
            return next();
        }
    });
}

// Opciones de multer
const configuracionMulter = {
    limits : { fileSize : 100000 },
    storage: fileStorage = multer.diskStorage({
        destination : (req, file, cb) => {
            cb(null, __dirname+'../../public/uploads/perfiles');
        }, 
        filename : (req, file, cb) => {
            const extension = file.mimetype.split('/')[1];
            cb(null, `${shortid.generate()}.${extension}`);
        }
    }),
    fileFilter(req, file, cb) {
        if(file.mimetype === 'image/jpeg' || file.mimetype === 'image/png' ) {
            // el callback se ejecuta como true o false : true cuando la imagen se acepta
            cb(null, true);
        } else {
            cb(new Error('Formato No Válido'));
        }
    }
}

const upload = multer(configuracionMulter).single("imagen");

exports.formCrearCuenta = (req, res) => {
  res.render("crear-Cuenta", {
    nombrePagina: "Crea tu cuenta en DevJobs",
    tagline:
      "Comienza a publicar tus vacantes gratis, solo debes crear una cuenta",
  });
};

exports.crearUsuario = async (req, res) => {
  //Crear el usuario
  const usuario = new Usuarios(req.body);

  try {
    await usuario.save();
    res.redirect("/iniciar-sesion");
  } catch (error) {
    req.flash("error", error);
    res.redirect("/crear-cuenta");
  }
};

exports.validarRegistro = async (req, res, next) => {
  // Sanitizar y validar los campos

  const rules = [
    body("nombre")
      .not()
      .isEmpty()
      .withMessage("El nombre es obligatorio")
      .escape(),
    body("email").isEmail().withMessage("El email debe ser valido"),
    body("password")
      .not()
      .isEmpty()
      .withMessage("El password no puede ir vacío")
      .escape(),
    body("confirmar")
      .not()
      .isEmpty()
      .withMessage("Confirmar tu password es obligatorio")
      .escape(),
    body("confirmar")
      .equals(req.body.password)
      .withMessage("Los passwords no son iguales"),
  ];

  await Promise.all(rules.map((validation) => validation.run(req)));
  const errores = validationResult(req);

  if (!errores.isEmpty()) {
    req.flash(
      "error",
      errores.array().map((error) => error.msg)
    );
    res.render("crear-cuenta", {
      nombrePagina: "Crea tu cuenta en DevJobs",
      tagline:
        "Comienza a publicar tus vacantes gratis, solo debes crear una cuenta",
      mensajes: req.flash(),
    });
    return;
  }

  next();
};

// Formulario para iniciar sesión

exports.formIniciarSesion = (req, res) => {
  body("email")
    .isEmail()
    .withMessage("El email debe ser valido")
    .normalizeEmail(),
    body("password")
      .not()
      .isEmpty()
      .withMessage("El password no puede ir vacío")
      .escape(),
    res.render("iniciar-sesion", {
      nombrePagina: "Iniciar Sesión DevJobs",
    });
};

// Formulario para editar el perfil
exports.formEditarPerfil = (req, res) => {
  res.render("editar-perfil", {
    nombrePagina: "Edita tu perfil en DevJobs",
    usuario: req.user.toObject(),
    cerrarSesion: true,
    nombre: req.user.nombre,
    imagen: req.user.imagen,
  });
};

// Guardar cambios editar perfil
exports.editarPerfil = async (req, res) => {
  const usuario = await Usuarios.findById(req.user._id);

  usuario.nombre = req.body.nombre;
  usuario.email = req.body.email;
  if (req.body.password) {
    usuario.password = req.body.password;
  }

  if (req.file) {
    usuario.imagen = req.file.filename;
  }

  await usuario.save();

  req.flash("correcto", "Cambios guardados correctamente");

  res.redirect("/administracion");
};

// Sanitizar y validar el formulario de editar perfil

exports.validarPerfil = async (req, res, next) => {
  // Sanitizar y validar los campos

  const rules = [
    body("nombre")
      .not()
      .isEmpty()
      .withMessage("El nombre es obligatorio")
      .escape(),
    body("email").isEmail().withMessage("El email debe ser valido").escape(),
    body("password").escape(),
  ];

  await Promise.all(rules.map((validation) => validation.run(req)));
  const errores = validationResult(req);

  if (!errores.isEmpty()) {
    req.flash(
      "error",
      errores.array().map((error) => error.msg)
    );
    res.render("editar-perfil", {
      nombrePagina: "Edita tu perfil en DevJobs",
      usuario: req.user.toObject(),
      cerrarSesion: true,
      nombre: req.user.nombre,
      mensajes: req.flash(),
    });
    return;
  }

  next();
};
