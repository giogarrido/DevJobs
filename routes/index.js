const express = require("express");
const router = express.Router();
const vacantesController = require("../controllers/vacantesController");
const homeController = require("../controllers/homeController");
const usuariosController = require("../controllers/usuariosController");
const authController = require("../controllers/authController");

module.exports = () => {
  router.get("/", homeController.monstrarTrabajos);

  // Agregar vacantes
  router.get(
    "/vacantes/nueva",
    authController.verificarUsuario,
    vacantesController.formularioNuevaVacante
  );
  router.post(
    "/vacantes/nueva",
    authController.verificarUsuario,
    vacantesController.validarVacante,
    vacantesController.agregarVacante
  );

  // Mostrar vacante
  router.get("/vacantes/:url", vacantesController.mostrarVacante);

  // Editar vacante
  router.get(
    "/vacantes/editar/:url",
    authController.verificarUsuario,
    vacantesController.formEditarVacante
  );
  router.post(
    "/vacantes/editar/:url",
    authController.verificarUsuario,
    vacantesController.validarVacante,
    vacantesController.editarVacante
  );

  // Eliminar vacante
  router.delete("/vacantes/eliminar/:id", vacantesController.eliminarVacante);

  // Crear cuentas
  router.get("/crear-cuenta", usuariosController.formCrearCuenta);
  router.post(
    "/crear-cuenta",
    usuariosController.validarRegistro,
    usuariosController.crearUsuario
  );

  // Autenticar usuarios
  router.get("/iniciar-sesion", usuariosController.formIniciarSesion);
  router.post("/iniciar-sesion", authController.autenticarUsuario);

  // Cerrar sesión
  router.get(
    "/cerrar-sesion",
    authController.verificarUsuario,
    authController.cerrarSesion
  );

    //Restablecer contraseña
    router.get("/restablecer-password", authController.formRestablecerPassword);
    router.post("/restablecer-password", authController.enviarToken);

    //Resetear contraseña (almacenar en la BD)
    router.get("/restablecer-password/:token", authController.restablecerPassword);
    router.post("/restablecer-password/:token", authController.guardarPassword);

  //Panel de administración
  router.get(
    "/administracion",
    authController.verificarUsuario,
    authController.mostrarPanel
  );

  // Editar perfil
  router.get(
    "/editar-perfil",
    authController.verificarUsuario,
    usuariosController.formEditarPerfil
  );
  router.post(
    "/editar-perfil",
    authController.verificarUsuario,
    //usuariosController.validarPerfil,
    usuariosController.subirImagen,
    usuariosController.editarPerfil
  );

  // Recibir mensajes de candidatos
  router.post(
    "/vacantes/:url",
    vacantesController.subirCV,
    vacantesController.contactar
  );

  // Mostrar candidatos por vacante
  router.get(
    "/candidatos/:id",
    authController.verificarUsuario,
    vacantesController.mostrarCandidatos
  );

  return router;
};
