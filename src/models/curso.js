const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const cursoSchema = new Schema({
    id: {
        type: Number,
        require: true,
        unique: true
    },
    descripcion: {
        type: String,
        require: true
    },
    nombre: {
        type: String,
        require: true
    },
    valor: {
        type: Number,
        require: true
    },
    intensidad:{
        type: Number,
    },
    modalidad: {
        type: String,
        require: true
    },
    estado: {
        type: String,
        require: true
    },
    docenteID :{
        type: Number
    },
    foto:{
        type:Buffer
    }
});

const Curso = mongoose.model('Curso', cursoSchema);

module.exports = Curso