const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const usuarioSchema = new Schema({
    cedula: {
        type: Number,
        require: true,
        unique: true
    },
    password: {
        type: String,
        require: true
    },
    nombre: {
        type: String,
        require: true
    },
    correo: {
        type: String,
        require: true
    },
    telefono: {
        type: Number,
        require: true
    },
    tipo: {
        type: String,
        require: true
    }
});

const Usuario = mongoose.model('Usuario', usuarioSchema);

module.exports = Usuario