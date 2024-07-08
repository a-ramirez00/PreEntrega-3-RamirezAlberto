// Función para cargar alumnos
function cargarAlumnos(e) {
    e.preventDefault(); // Evita que la página se recargue por defecto

    let todoslosAlumnos = JSON.parse(localStorage.getItem('arregloDealumnos')) || [];

    // Cargamos los valores de los input a variables
    let nombreAlumno = document.getElementById('nombre').value.trim().toLowerCase()
    let apellidoAlumno = document.getElementById('apellido').value.trim().toLowerCase()
    let cursoAlumno = document.getElementById('curso').value.toLowerCase()
    let legajoAlumno = document.getElementById('legajo').value.trim()
    let notaAlumno = parseInt(document.getElementById('nota').value)


    // verificar si los campos nombre y apellido están vacíos después de recortar
    if (!nombreAlumno || !apellidoAlumno) {
        mostrarMensaje('Nombre y apellido no pueden estar vacíos o contener solo espacios', 'error');
        return;
    }


    // Los cargamos a un objeto
    let alumno = {
        nombre: nombreAlumno,
        apellido: apellidoAlumno,
        curso: cursoAlumno,
        legajo: legajoAlumno,
        nota: notaAlumno
    }


    // Verificar si ya existe un alumno con el mismo legajo
    function existeLegajo() {
        return todoslosAlumnos.find(alumno => alumno.legajo == legajoAlumno);
    }

    // Verificar si el alumno está registrado en el mismo curso
    function filtradoDeAlumnos() {
        return todoslosAlumnos.find(alumno => alumno.legajo == legajoAlumno && alumno.curso == cursoAlumno);
    }

    let alumnoExistente = existeLegajo();

    // Validaciones
    if (alumnoExistente) {
        if (alumnoExistente.nombre === nombreAlumno && alumnoExistente.apellido === apellidoAlumno) {
            // El alumno con el mismo legajo, nombre y apellido puede registrarse en otro curso
            if (!filtradoDeAlumnos()) {
                if (notaAlumno >= 0 && notaAlumno <= 10) {
                    todoslosAlumnos.push(alumno);
                    let alumnosJson = JSON.stringify(todoslosAlumnos);
                    localStorage.setItem('arregloDealumnos', alumnosJson);
                    mostrarMensaje('✅ Alumno cargado correctamente en un nuevo curso ✅ ', 'success');
                } else {
                    mostrarMensaje('❌ Nota incorrecta. Debe estar entre 0 y 10  ❌', 'error');
                }
            } else {
                mostrarMensaje('❌ Usuario ya registrado en el curso ❌', 'error');
            }
        } else {
            // El legajo ya está en uso por otro alumno
            mostrarMensaje('❌ El legajo ya está en uso por otro alumno ❌ ', 'error');
        }
    } else {
        // Si no existe el legajo, registrar al alumno
        if (notaAlumno >= 0 && notaAlumno <= 10) {
            todoslosAlumnos.push(alumno);
            let alumnosJson = JSON.stringify(todoslosAlumnos);
            localStorage.setItem('arregloDealumnos', alumnosJson);
            mostrarMensaje('✅ Alumno cargado correctamente ✅', 'success');
        } else {
            mostrarMensaje('❌ Nota incorrecta. Debe estar entre 0 y 10 ❌', 'error');
        }
    }
}

// Función para mostrar mensajes en el documento
function mostrarMensaje(mensaje, tipo) {
    let mensajeElemento = document.getElementById('mensaje');
    mensajeElemento.innerHTML = '';
    let mensajeMostrar = document.createElement('p');
    mensajeMostrar.className = tipo;
    mensajeMostrar.innerHTML = mensaje;
    mensajeElemento.appendChild(mensajeMostrar);
}



if (document.getElementById('formulario')) {
    let formulario = document.getElementById('formulario');
    formulario.addEventListener('submit', cargarAlumnos);
}


function buscarPorLegajo() {
    let valor = document.getElementById('valor').value;

    let arregloRecuperado = JSON.parse(localStorage.getItem('arregloDealumnos')) || [];

    let mostrar = document.getElementById('lista');
    mostrar.innerHTML = '';

    if (arregloRecuperado.length > 0) {

        let filtrado = arregloRecuperado.filter(alumno => alumno.legajo == valor);
        if (filtrado.length > 0) {

            for (let elemento of filtrado) {

                let ul = document.createElement('ul');

                ul.innerHTML = `<li> ${elemento.legajo} </li>
                <li>  ${elemento.nombre}</li>
                <li>  ${elemento.apellido} </li>
                <li>  ${elemento.curso}</li>
                <li>  ${elemento.nota}</li>
                <li> <button class='remover'> X </button> </li>`

                mostrar.append(ul);

                // Añadir event listener al botón de remover
                ul.querySelector('.remover').addEventListener('click', function () {
                    removerAlumno(elemento.legajo, elemento.curso);
                    ul.remove(); // Remover el elemento del DOM
                    actualizarPromedio(valor);
                });

            }

            actualizarPromedio(valor);

        } else {
            let titulo = document.createElement('h2');
            titulo.innerHTML = `<h2> No se encontraron alumnos con ese número de legajo </h2>`;
            mostrar.append(titulo);
        }
    } else {
        let titulo = document.createElement('h2');
        titulo.innerHTML = `<h2> Primero debe cargar los alumnos para poder buscarlos </h2>`;
        mostrar.append(titulo);
    }
}

function removerAlumno(legajo, curso) {
    let arregloRecuperado = JSON.parse(localStorage.getItem('arregloDealumnos')) || [];
    let nuevoArreglo = arregloRecuperado.filter(alumno => !(alumno.legajo == legajo && alumno.curso == curso));
    localStorage.setItem('arregloDealumnos', JSON.stringify(nuevoArreglo));
}

function actualizarPromedio(legajo) {
    let arregloRecuperado = JSON.parse(localStorage.getItem('arregloDealumnos')) || [];
    let filtrado = arregloRecuperado.filter(alumno => alumno.legajo == legajo);

    let totalNotas = filtrado.reduce((sum, alumno) => sum + alumno.nota, 0);
    let promedioNotas = (filtrado.length > 0) ? (totalNotas / filtrado.length).toFixed(2) : 0;

    let promedio = document.createElement('p');
    promedio.innerHTML = `
        <p><strong>Promedio de Notas:</strong></p>
        <p>${promedioNotas}</p>`;

    let mostrar = document.getElementById('lista');
    let existingPromedio = mostrar.querySelector('p');
    if (existingPromedio) {
        existingPromedio.remove();
    }
    mostrar.append(promedio);
}





if (document.getElementById('buscar')) {

    let botonBuscar = document.getElementById('buscar')

    botonBuscar.addEventListener('click', buscarPorLegajo)
}


function buscarPorMateria() {
    let materia = document.getElementById('buscarMateria').value

    let arregloRecuperado = JSON.parse(localStorage.getItem('arregloDealumnos')) || []

    let mostrar = document.getElementById('buscarPorCurso')
    mostrar.innerHTML = ''
    function filtradoDeMaterias() {
        return arregloRecuperado.filter(alumno => alumno.curso.toLowerCase() === materia.toLowerCase())

    }

    function ordenar() {
        return alumnosFiltrados.sort((a, b) => a.legajo - b.legajo)
    }
    let alumnosFiltrados = filtradoDeMaterias()
    let alumnosOrdenados = ordenar().slice()

    if (arregloRecuperado.length === 0) {
        let sinAlumnos = document.createElement('p')
        sinAlumnos.innerHTML = `<p> Primero debe cargar los alumnos para poder buscarlos </p>`
        mostrar.append(sinAlumnos)
        // console.log('No hay alumnos inscriptos')
    } else if (alumnosOrdenados.length > 0) {
        for (let alumno of alumnosFiltrados) {
            let listaCurso = document.createElement('ul')
            listaCurso.innerHTML = `<li> ${alumno.legajo} </li>
            <li> ${alumno.nombre} </li>
            <li> ${alumno.apellido} </li>
            <li> ${alumno.curso} </li>
            <li> ${alumno.nota} </li>`
            mostrar.append(listaCurso)
        }
        let totalNotas = alumnosFiltrados.reduce((sum, alumno) => sum + alumno.nota, 0)
        let promedioNotas = (totalNotas / alumnosFiltrados.length).toFixed(2)

        let promedio = document.createElement('p')
        promedio.innerHTML = `
            <p><strong>Promedio de Notas:</strong></p>
            <p>${promedioNotas}</p>`
        mostrar.append(promedio)


    } else {
        if (materia.toLowerCase() === 'opciones') {
            let sinAlumnos = document.createElement('p')
            sinAlumnos.innerHTML = `<p> Debe elegir una opción para buscar </p>`
            mostrar.append(sinAlumnos)
            // console.log('aaa')
        } else {
            let sinAlumnos = document.createElement('p')
            sinAlumnos.innerHTML = `<p> no se encontraron alumnos en este curso</p>`
            mostrar.append(sinAlumnos)
        }
    }

}

if (document.getElementById('buscarMateria')) {
    let botonBuscarMateria = document.getElementById('buscarMateria')
    botonBuscarMateria.addEventListener('change', buscarPorMateria)
}
