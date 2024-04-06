const express = require('express');
const router = express.Router();
const vacantesController = require('../controllers/vacantesController');
const homeController = require('../controllers/homeController');
const usuariosController = require('../controllers/usuariosController');

module.exports = () => {
    router.get('/', homeController.monstrarTrabajos);

    // Agregar vacantes
    router.get('/vacantes/nueva', vacantesController.formularioNuevaVacante);
    router.post('/vacantes/nueva', vacantesController.agregarVacante);

    // Mostrar vacante
    router.get('/vacantes/:url', vacantesController.mostrarVacante);

    // Editar vacante
    router.get('/vacantes/editar/:url', vacantesController.formEditarVacante);
    router.post('/vacantes/editar/:url', vacantesController.editarVacante);

    // Crear cuentas
    router.get('/crear-cuenta', usuariosController.formCrearCuenta);
    router.post('/crear-cuenta',
        usuariosController.validarRegistro,
        usuariosController.crearUsuario);

    return router;
}
