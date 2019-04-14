const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const inscripcionSchema = new Schema({
    cursoID: {
        type: Number,
        require: true,

    },
    cedula: {
        type: Number,
        require: true
    }
});

inscripcionSchema.index({
    cursoID: 1,
    cedula: 1,
  }, {
    unique: true,
  });

const Inscripcion = mongoose.model('Inscripcion', inscripcionSchema);

module.exports = Inscripcion