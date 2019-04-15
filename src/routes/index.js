require('../helpers');
const express = require('express');
const app = express();
const path = require('path');
const hbs = require('hbs');
const bodyParser = require('body-parser');
const Usuario = require('../models/usuario');
const Curso = require('../models/curso');
const Inscripcion = require('../models/inscripciones');
const bcrypt = require('bcrypt');


const directorioViews = path.join(__dirname, '../../views');

app.set('view engine', 'hbs');
app.set('views', directorioViews);

app.get('/', (req, res) => {
    res.render('index');
});

app.post('/inscritosCursos', (req, res) => {
    let contarInscipciones = [];
    let cursosDisponibles = [];
    Inscripcion.find({}).exec((err, respuesta) => {
        if (err) {
            return console.log('Error al buscar las inscripciones');
        }
        respuesta.forEach((inscripcion) => {
            curso = contarInscipciones.find(curso => curso.id === inscripcion.cursoID);

            if (curso) {
                curso.cantidad = curso.cantidad + 1;
            } else {
                contarInscipciones.push({ 'id': inscripcion.cursoID, 'cantidad': 1 });
            }
        });

        Curso.find({ estado: 'disponible' }).exec((err, respuesta) => {
            if (err) {
                return console.log('Error al buscar los Usuarios');
            }
            respuesta.forEach((curso) => {
                contar = contarInscipciones.find(contarcurso => contarcurso.id === curso.id);
                if (contar) {
                    cursosDisponibles.push({ 'id': contar.id, 'cantidad': contar.cantidad, 'nombre': curso.nombre, 'estado': curso.estado });
                } else {
                    cursosDisponibles.push({ 'id': curso.id, 'cantidad': 0, 'nombre': curso.nombre, 'estado': curso.estado })
                }
            });
            res.render('inscritosCursos', {
                cursos: cursosDisponibles
            });
        });
    });

});

app.post('/desinscribir', (req, res) => {
    res.render('desinscribir');
});

app.post('/listaCurso', (req, res) => {

    let cedulas = [];
    Inscripcion.findOneAndDelete({ cedula: req.body.usuarioCedula, cursoID: req.body.cursoID }, (err, respuesta) => {
        if (err) {
            return console.log('Error al eliminar inscripcion');
        }
    })

    Inscripcion.find({ cursoID: req.body.cursoID }).exec((err, respuesta) => {
        if (err) {
            return console.log('Error al buscar las inscripciones');
        }
        respuesta.forEach((inscripcion) => {
            let { id, cursoID, cedula, v } = inscripcion
            if (cedula !== req.body.usuarioCedula) {
                cedulas.push(cedula);
            }
        });

        Usuario.find({ 'cedula': { '$in': cedulas } }).exec((err, respuesta) => {
            if (err) {
                return console.log('Error al buscar los Usuarios');
            }
            console.log(respuesta)
            res.render('listaCurso', {
                usuarios: respuesta
            });
        });
    });
});

app.post('/registro', (req, res) => {

    let usuario = new Usuario({
        cedula: parseInt(req.body.cedula),
        password: bcrypt.hashSync(req.body.password, 10),
        nombre: req.body.nombre,
        correo: req.body.correo,
        telefono: parseInt(req.body.telefono),
        tipo: req.body.tipo
    });

    usuario.save((err, resultado) => {
        if (err) {
            console.log(err);
            return res.render('registro', {
                mensaje: false
            });
        }
        res.render('registro', {
            mensaje: true
        });
    });
});

app.post('/modificarUsuario', (req, res) => {
    if (req.body.cedula) {
        Usuario.findOneAndUpdate({ cedula: req.body.cedula }, req.body, {}, (err, respuesta) => {
            if (err) {
                return console.log('Error al actualizar los usuarios');
            }

            Usuario.find({}).exec((err, respuesta) => {
                if (err) {
                    return console.log('Error al buscar los usuarios');
                }
                return res.render('modificarUsuario', {
                    usuarios: respuesta
                });
            });
        });
    } else {
        Usuario.find({}).exec((err, respuesta) => {
            if (err) {
                return console.log('Error al buscar los usuarios');
            }
            return res.render('modificarUsuario', {
                usuarios: respuesta
            });
        });
    }

});

app.post('/cursos', (req, res) => {
    let estado;
    let detalle;

    if (req.session.tipo === 'interesado' || req.session.tipo === 'aspirante') {
        estado = 'disponible';
    }
    if (req.session.tipo === 'coordinador') {
        estado = { $exists: true };
    }

    if (req.body.detalle) {
        Curso.findOne({ id: req.body.detalle }, (err, respuesta) => {
            if (err) {
                return console.log('Error al buscar los cursos');
            }
            detalle = respuesta
        });
    }

    Curso.find({ estado }).exec((err, respuesta) => {
        if (err) {
            return console.log('Error al buscar los cursos');
        }

        return res.render('cursos', {
            cursos: respuesta,
            detalle
        });
    });
});

app.post('/login', (req, res) => {

    Usuario.findOne({ cedula: req.body.cedula }, (err, resultado) => {
        if (err) {
            return console.log(err);
        }
        if (!resultado) {
            return res.render('login', {
                tipoSeccion: 'err'
            });
        }
        if (!bcrypt.compareSync(req.body.password, resultado.password)) {
            return res.render('login', {
                tipoSeccion: 'err'
            });
        }
        req.session.id = resultado._id;
        req.session.tipo = resultado.tipo;
        req.session.nombre = resultado.nombre;
        req.session.cedula = resultado.cedula;

        return res.render('login', {
            tipoSeccion: req.session.tipo
        })

    });
});

app.post('/incribir', (req, res) => {

    Curso.find({ estado: 'disponible' }).exec((err, respuesta) => {
        if (err) {
            return console.log('Error al buscar los cursos');
        }

        return res.render('incribir', {
            cursos: respuesta
        });
    });
});

app.post('/inscrito', (req, res) => {
    let inscripcion = new Inscripcion({
        cursoID: parseInt(req.body.cursoID),
        cedula: req.session.cedula
    });

    inscripcion.save((err, resultado) => {
        if (err) {
            console.log(err);
            return res.render('inscrito', {
                mensaje: false
            });
        }
        return res.render('inscrito', {
            mensaje: true
        });
    });

});

app.post('/cerrarRespuesta', (req, res) => {
    Usuario.findOne({ cedula: req.body.cedula }, (err, resultado) => {
        if (err) {
            return console.log('Error al buscar el usuario');
        }
        if (resultado.tipo === 'docente') {
            Curso.findOneAndUpdate({ id: req.body.cursoID }, { $set: { 'docenteID': resultado.cedula, 'estado': 'cerrado' } }, (err, resultado) => {
                if (err) {
                    return console.log('Error al buscar el curso');
                }
                return res.render('cerrarRespuesta', {
                    mensaje: true
                });
            });
        } else {
            return res.render('cerrarRespuesta', {
                mensaje: false
            });
        }
    })
});

app.post('/cerrar', (req, res) => {
    return res.render('cerrar', {
        cursoID: parseInt(req.body.cursoID),
        cedula: parseInt(req.body.cedula)
    });
});

app.post('/eliminar', (req, res) => {
    let cursosID = [];
    if (req.body.cursoID) {
        Inscripcion.findOneAndDelete({ cedula: req.session.cedula, cursoID: req.body.cursoID }, (err, respuesta) => {
            if (err) {
                return console.log('Error al eliminar inscripcion');
            }
        })
    }
    Inscripcion.find({ cedula: req.session.cedula }).exec((err, respuesta) => {
        if (err) {
            return console.log('Error al buscar las inscripciones');
        }
        respuesta.forEach((inscripcion) => {
            let { id, cursoID, cedula, v } = inscripcion
            if (cursoID !== req.body.cursoID) {
                cursosID.push(cursoID);
            }
        });

        Curso.find({ 'id': { '$in': cursosID } }).exec((err, respuesta) => {
            if (err) {
                return console.log('Error al buscar los Cursos');
            }
            return res.render('eliminar', {
                cursos: respuesta
            });
        });
    });
});

app.post('/crear', (req, res) => {
    res.render('crear');
});

app.post('/crearCurso', (req, res) => {
    let curso = new Curso({
        nombre: req.body.nombre,
        id: parseInt(req.body.id),
        descripcion: req.body.descripcion,
        valor: parseInt(req.body.valor),
        modalidad: req.body.modalidad,
        intensidad: parseInt(req.body.intensidad),
        estado: 'disponible',
        docenteID: null
    });

    curso.save((err, resultado) => {
        if (err) {
            console.log(err);
            return res.render('crearCurso', {
                mensaje: false
            });
        }
        return res.render('crearCurso', {
            mensaje: true
        });
    });
});

app.get('/infoCursos', (req, res) => {
    Curso.find({ 'docenteID': req.session.cedula }).exec((err, respuesta) => {
        if (err) {
            return console.log('Error al buscar los Cursos');
        }
        return res.render('infoCursos', {
            cursos: respuesta
        });
    });
});

app.post('/infoEstudiantes', (req, res) => {
    Inscripcion.find({ 'cursoID': req.body.cursoID }).exec((err, respuesta) => {
        if (err) {
            return console.log('Error al buscar las inscripciones');
        }
        let estudiantes = [];
        let itemsProcessed = 0;
        respuesta.forEach((estudianteAuxiliar) => {
            Usuario.findOne({'cedula': estudianteAuxiliar.cedula}).exec((err, usuario) => {
                if (err) {
                    return console.log('Error al buscar los usuarios');
                }
                estudiantes.push(usuario);
                itemsProcessed++;
                if(itemsProcessed === respuesta.length) {
                    return res.render('infoEstudiantes', {
                        estudiantes
                    });
                }
            });
        });
        return res.render('infoEstudiantes', {
            estudiantes
        });
    });
});

app.get('*', (req, res) => {
    res.render('error');
})

module.exports = app