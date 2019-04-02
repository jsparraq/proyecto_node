const express = require('express');
const app = express();
const path = require('path');
const hbs = require('hbs');
const bodyParser = require('body-parser');
require('./helpers');

const directorioPublico = path.join(__dirname, '../public');
app.use(express.static(directorioPublico));
app.use(bodyParser.urlencoded({ extended: false }))

app.set('view engine', 'hbs');

app.get('/', (req, res) => {
    res.render('index');
});

app.post('/inscritosCursos', (req, res) => {
    res.render('inscritosCursos', {
        cursoID: parseInt(req.body.cursoID)
    });
});

app.post('/desinscribir', (req, res) => {
    res.render('desinscribir');
});

app.post('/listaCurso', (req, res) => {
    res.render('listaCurso', {
        cursoID: parseInt(req.body.cursoID),
        usuarioCedula: parseInt(req.body.usuarioCedula)
    });
});

app.post('/registro', (req, res) => {
    res.render('registro', {
        cedula: parseInt(req.body.cedula),
        nombre: req.body.nombre,
        correo: req.body.correo,
        telefono: parseInt(req.body.telefono),
        tipo: req.body.tipo
    });
});

app.post('/modificarUsuario', (req, res) => {
    res.render('modificarUsuario', {
        cedula: parseInt(req.body.cedula),
        nombre: req.body.nombre,
        correo: req.body.correo,
        telefono: parseInt(req.body.telefono),
        tipo: req.body.tipo
    });
});

app.post('/cursos', (req, res) => {
    res.render('cursos', {
        detalle: parseInt(req.body.detalle)
    });
});

app.post('/login', (req, res) => {
    res.render('login', {
        cedula: parseInt(req.body.cedula)
    });
});

app.post('/incribir', (req, res) => {
    res.render('incribir');
});

app.post('/inscrito', (req, res) => {
    res.render('inscrito', {
        cursoID: parseInt(req.body.cursoID)
    });
});

app.post('/cerrar', (req, res) => {
    res.render('cerrar', {
        cursoID: parseInt(req.body.cursoID)
    });
});

app.post('/eliminar', (req, res) => {
    res.render('eliminar', {
        cursoID: parseInt(req.body.cursoID)
    });
});

app.post('/crear', (req, res) => {
    res.render('crear');
});

app.post('/crearCurso', (req, res) => {
    res.render('crearCurso', {
        nombre: req.body.nombre,
        id: parseInt(req.body.id),
        descripcion: req.body.descripcion,
        valor: parseInt(req.body.valor),
        tipo: req.body.tipo
    });
});

app.get('*', (req, res) => {
    res.render('error');
})

app.listen(3000, () => {
    console.log('Escuchando en el puerto 3000')
});

