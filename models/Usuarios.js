const mongoose = require('mongoose');
mongoose.Promise = global.Promise;
const bcrypt = require('bcrypt');

const usuariosSchema = new mongoose.Schema({
    email: {
        type: String,
        unique: true,
        lowercase: true,
        trim: true  // Remove spaces
    },
    nombre: {
        type: String,
        required: 'Agrega tu nombre',
        trim: true
    },
    password: {
        type: String,
        required: true,
        trim: true
    },
    token: String,
    expira: Date
});

// Método para hashear los passwords
usuariosSchema.pre('save', async function(next) {
    // Si el password ya está hasheado
    if (!this.isModified('password')) {
        return next(); // Detiene la ejecución
    }
    const hash = await bcrypt.hash(this.password, 12);
    this.password = hash;
    next();
});


module.exports = mongoose.model('Usuarios', usuariosSchema);
