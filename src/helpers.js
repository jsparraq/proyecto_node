const hbs = require('hbs');
const fs = require('fs')

let listaUsuarios = [];
let listaCursos = [];
let listaInscripciones = [];
let cedulaSeccion;

hbs.registerHelper('registrarUsuario', (cedula, nombre, correo, telefono, tipo) => {
    let usuario = {
        cedula,
        nombre,
        correo,
        telefono,
        tipo
    }
    let mensajeExito = 'Te has podido prematricular satisfactoriamente.';
    listarUsuarios();
    let duplicated = listaUsuarios.find(usuario => usuario.cedula === cedula);
    if (!duplicated) {
        listaUsuarios.push(usuario);
        fs.writeFile('usuarios.json', JSON.stringify(listaUsuarios), (err) => {
            if (err) throw (err);
        });
    } else {
        mensajeExito = 'Ya existe un usuario con esa cedula.';
    }
    return mensajeExito;
});

hbs.registerHelper('modificarUsuario', (cedula, nombre, correo, telefono, tipo) => {


    listarUsuarios();
    let duplicated = listaUsuarios.find(usuario => usuario.cedula === cedula);
    if (duplicated) {
        duplicated['nombre'] = nombre;
        duplicated['correo'] = correo;
        duplicated['telefono'] = telefono;
        duplicated['tipo'] = tipo;
        fs.writeFile('usuarios.json', JSON.stringify(listaUsuarios), (err) => {
            if (err) throw (err);
        });
    } else {
        mensajeExito = 'No existe un usuario con esa cedula.';
    }
    return listaUsuarios;
});

hbs.registerHelper('crearCurso', (nombre, id, descripcion, valor, tipo) => {
    let curso = {
        id,
        nombre,
        descripcion,
        valor,
        tipo,
        estado: 'disponible'
    }
    listarCursos();
    let duplicated = listaCursos.find(curso => curso.id === id);
    if (!duplicated && curso.id !== null) {
        listaCursos.push(curso);
        fs.writeFile('cursos.json', JSON.stringify(listaCursos), (err) => {
            if (err) throw (err);
        });
        mensajeExito = 'Has creado el curso satisfactoriamente';
    } else {
        mensajeExito = 'Ya existe un curso con ese id.';
    }
    return mensajeExito;
});

hbs.registerHelper('mostrarCursos', () => {

    let duplicated;
    listarUsuarios();
    listarCursos();
    duplicated = listaUsuarios.find(usuario => usuario.cedula === cedulaSeccion);
    if (duplicated && duplicated.tipo === 'interesado' || duplicated.tipo === 'aspirante') {
        return listaCursos.filter(curso => curso.estado === 'disponible');

    } else if (duplicated && duplicated.tipo === 'coordinador') {
        return listaCursos;

    } else {
        return [];
    }
});

hbs.registerHelper('mostrarInscripciones', (cursoID) => {

    let duplicated;
    listarUsuarios();
    listarCursos();
    listarInscripciones();
    duplicated = listaUsuarios.find(usuario => usuario.cedula === cedulaSeccion);
    if (duplicated && duplicated.tipo === 'aspirante') {
        if (cursoID) {
            listaInscripciones.splice(listaInscripciones.indexOf(listaInscripciones.find(inscripciones => inscripciones.cedula === cedulaSeccion && inscripciones.cursoID === cursoID)), 1);
            fs.writeFile('inscripciones.json', JSON.stringify(listaInscripciones), (err) => {
                if (err) throw (err);
            });
        }
        let cursosInscritos = [];
        let inscripciones = listaInscripciones.filter(inscripcion => inscripcion.cedula === cedulaSeccion);
        inscripciones.forEach(inscripcion => {
            cursosInscritos.push(listaCursos.find(curso => curso.id === inscripcion.cursoID));
        });
        return cursosInscritos;

    } else {
        return [];
    }
});

hbs.registerHelper('desincribirUsuario', (cursoID, usuarioCedula) => {

    let duplicated;

    listarUsuarios();
    listarInscripciones();

    listaInscripciones.splice(listaInscripciones.indexOf(listaInscripciones.find(inscripciones => inscripciones.cedula === usuarioCedula && inscripciones.cursoID === cursoID)), 1);
    fs.writeFile('inscripciones.json', JSON.stringify(listaInscripciones), (err) => {
        if (err) throw (err);
    });

    let cursosInscritos = [];
    let inscripciones = listaInscripciones.filter(inscrito => inscrito.cursoID === cursoID);
    inscripciones.forEach(inscrito => {
        cursosInscritos.push(listaUsuarios.find(usuario => usuario.cedula === inscrito.cedula));
    });
    return cursosInscritos;


});

hbs.registerHelper('detalleCurso', (id) => {
    let detalle;
    listarCursos();
    let curso = listaCursos.find(curso => curso.id === id);
    if (curso) {
        detalle = 'Nombre del Curso: ' + curso.nombre + '\n Descripcion: ' + curso.descripcion + '\n Modalidad: ' + curso.modalidad + '\n Intesidad Horaria: ' + curso.intensidad + ' horas';
    }
    return detalle;

});

hbs.registerHelper('mostrarInscripcion', (cursoID) => {

    let inscripcion = {
        cursoID,
        cedula: cedulaSeccion
    }

    let mensajeExito = 'Te has podido inscribir Satisfactoriamente.';
    listarUsuarios();
    let usuario = listaUsuarios.find(usuario => usuario.cedula === cedulaSeccion);
    console.log(cedulaSeccion);
    if (usuario && usuario.tipo === 'aspirante') {
        listarInscripciones();
        let duplicado = listaInscripciones.find(inscripcion => inscripcion.cedula === cedulaSeccion && inscripcion.cursoID === cursoID);
        if (!duplicado) {
            listaInscripciones.push(inscripcion);
            fs.writeFile('inscripciones.json', JSON.stringify(listaInscripciones), (err) => {
                if (err) throw (err);
            });
        } else {
            mensajeExito = 'Ya tienes ese curso inscrito';
        }
    } else {
        mensajeExito = 'No eres un aspirante';
    }
    return mensajeExito;
});

hbs.registerHelper('menuInteresado', (cedula, options) => {

    cedulaSeccion = cedula;
    listarUsuarios();

    duplicated = listaUsuarios.find(usuario => usuario.cedula === cedula);
    if (duplicated && duplicated.tipo === 'interesado') {
        return options.fn(this);
    } else {
        return options.inverse(this);
    }
});

hbs.registerHelper('menuCoordinador', (cedula, options) => {

    cedulaSeccion = cedula;
    listarUsuarios();

    duplicated = listaUsuarios.find(usuario => usuario.cedula === cedula);
    if (duplicated && duplicated.tipo === 'coordinador') {
        return options.fn(this);
    } else {
        return options.inverse(this);
    }
});

hbs.registerHelper('menuAspirante', (cedula, options) => {

    cedulaSeccion = cedula;
    listarUsuarios();

    duplicated = listaUsuarios.find(usuario => usuario.cedula === cedula);
    if (duplicated && duplicated.tipo === 'aspirante') {
        return options.fn(this);
    } else {
        return options.inverse(this);
    }
});

hbs.registerHelper('menuSinRegistro', (cedula, options) => {

    listarUsuarios();

    duplicated = listaUsuarios.find(usuario => usuario.cedula === cedula);
    if (!duplicated) {
        return options.fn(this);
    } else {
        return options.inverse(this);
    }
});


hbs.registerHelper('mostrarInscritosCursos', (cursoID) => {
    listarInscripciones()
    listarCursos()
    contarInscipciones = []
    if (cursoID) {
        cursoCerrado = listaCursos.find(inscripciones => inscripciones.id === cursoID);
        cursoCerrado['estado'] = 'cerrado';
        fs.writeFile('cursos.json', JSON.stringify(listaCursos), (err) => {
            if (err) throw (err);
        });
    }
    listaInscripciones.forEach((inscripcion) => {
        curso = contarInscipciones.find(inscripcionAux => inscripcionAux.id === inscripcion.cursoID);
        nombreCurso = listaCursos.find(curso => curso.id === inscripcion.cursoID);
        if (curso) {
            curso.cantidad = curso.cantidad + 1
        } else if (nombreCurso.estado === 'disponible') {
            contarInscipciones.push({ 'id': inscripcion.cursoID, 'cantidad': 1, 'nombre': nombreCurso.nombre, 'estado': nombreCurso.estado })
        }
    })
    listaCursos.forEach((cursos) => {
        cursoDispoinble = contarInscipciones.find(curso => curso.id === cursos.id);
        if (!cursoDispoinble && cursos.estado === 'disponible') {
            contarInscipciones.push({ 'id': cursos.id, 'cantidad': 0, 'nombre': cursos.nombre, 'estado': cursos.estado })
        }
    });
    return contarInscipciones
});

const listarInscripciones = () => {
    try {
        listaInscripciones = require('../inscripciones.json');
    } catch (err) {
        listaInscripciones = [];
    }
}

const listarUsuarios = () => {
    try {
        listaUsuarios = require('../usuarios.json');
    } catch (err) {
        listaUsuarios = [];
    }
}

const listarCursos = () => {
    try {
        listaCursos = require('../cursos.json');
    } catch (err) {
        listaCursos = [];
    }
}