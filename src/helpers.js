const hbs = require('hbs');
const fs = require('fs');

hbs.registerHelper('registrarUsuario', (mensaje) => {

    let mensajeExito = 'Te has podido prematricular satisfactoriamente.';

    if (!mensaje) {
        mensajeExito = 'Ya existe un usuario con esa cedula.';
    }
    return mensajeExito;
});

hbs.registerHelper('crearCurso', (mensaje) => {

    if (mensaje) {

        return 'Has creado el curso satisfactoriamente';
    } else {
        return 'Ya existe un curso con ese id.';
    }
});

hbs.registerHelper('mostrarCursos', (cursos) => {

    if (cursos) {
        return cursos;

    } else {
        return [];
    }
});

hbs.registerHelper('detalleCurso', (curso) => {
    let detalle;
    if (curso) {
        detalle = 'Nombre del Curso: ' + curso[0].nombre + '\n Descripcion: ' + curso[0].descripcion + '\n Modalidad: ' + curso[0].modalidad + '\n Intesidad Horaria: ' + curso[0].intensidad + ' horas';
    }
    return detalle;

});

hbs.registerHelper('mostrarInscripcion', (mensaje) => {

    if (mensaje) {

        return 'Te has podido inscribir Satisfactoriamente.';
    } else {
        return 'Ya tienes ese curso inscrito';
    }
});

hbs.registerHelper('menuInteresado', (tipoSeccion, options) => {

    if (tipoSeccion === 'interesado') {
        return options.fn(this);
    } else {
        return options.inverse(this);
    }
});

hbs.registerHelper('asignarDocente', (cedula, options) => {

    if (!cedula) {
        return options.fn(this);
    } else {
        return options.inverse(this);
    }
});

hbs.registerHelper('mostrarAsignacion', (mensaje, cedula, options) => {
 
        if (mensaje) {
            return 'El curso fue cerrado satisfactoriamente';
        } else {
            return 'No se pudo cerrar el curos ya que no se le asigno un profesor valido';
        }



});

hbs.registerHelper('menuCoordinador', (tipoSeccion, options) => {

    if (tipoSeccion === 'coordinador') {
        return options.fn(this);
    } else {
        return options.inverse(this);
    }
});

hbs.registerHelper('menuAspirante', (tipoSeccion, options) => {

    if (tipoSeccion === 'aspirante') {
        return options.fn(this);
    } else {
        return options.inverse(this);
    }
});

hbs.registerHelper('menuSinRegistro', (tipoSeccion, options) => {


    if (tipoSeccion === 'err') {
        return options.fn(this);
    } else {
        return options.inverse(this);
    }
});
