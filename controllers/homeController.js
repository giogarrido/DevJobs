const mongoose = require('mongoose');
const Vacante = mongoose.model('Vacante');

exports.monstrarTrabajos = async (req, res) => {

    const vacantes = await Vacante.find().lean();

    if (!vacantes) return next();

    res.render('home', {
        nombrePagina: 'DevJobs',
        tagline: 'Encuentra y publica trabajos para desarrolladores web',
        barra: true,
        boton: true,
        vacantes
    });
}