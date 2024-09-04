// Funciones para obtener datos
function buscarAlumnos() {
    return fetch('https://apidemo.geoeducacion.com.ar/api/testing/estudiantes/1')
        .then(response => {
            if (!response.ok) throw new Error('Error en la red');
            return response.json();
        })
        .catch(error => console.error('Error al obtener datos de alumnos:', error));
}

function asistencia() {
    return fetch('https://apidemo.geoeducacion.com.ar/api/testing/asistencia/1')
        .then(response => {
            if (!response.ok) throw new Error('Error en la red');
            return response.json();
        })
        .catch(error => console.error('Error al obtener datos de asistencia:', error));
}

function historial_asistencia() {
    return fetch('https://apidemo.geoeducacion.com.ar/api/testing/historial_asistencia/1')
        .then(response => {
            if (!response.ok) throw new Error('Error en la red');
            return response.json();
        })
        .catch(error => console.error('Error al obtener historial de asistencia:', error));
}

function calificaciones() {
    return fetch('https://apidemo.geoeducacion.com.ar/api/testing/calificaciones/1')
        .then(response => {
            if (!response.ok) throw new Error('Error en la red');
            return response.json();
        })
        .catch(error => console.error('Error al obtener calificaciones:', error));
}

function comunicados() {
    return fetch('https://apidemo.geoeducacion.com.ar/api/testing/comunicados/1')
        .then(response => {
            if (!response.ok) throw new Error('Error en la red');
            return response.json();
        })
        .catch(error => console.error('Error al obtener comunicados:', error));
}

document.addEventListener('DOMContentLoaded', () => {
    // Función para crear gráficos
    function crearGrafico(ctx, tipo, etiquetas, datos, colores, label) {
        new Chart(ctx, {
            type: tipo,
            data: {
                labels: etiquetas,
                datasets: [{
                    label: label,
                    data: datos,
                    backgroundColor: colores,
                    borderColor: 'rgba(0, 0, 0, 0.1)',
                    borderWidth: 1
                }]
            },
            options: {
                responsive: true,
                scales: {
                    y: {
                        beginAtZero: true
                    }
                }
            }
        });
    }

// Gráfico de Composición del Alumnado por Nivel (Barras Conjunto)
buscarAlumnos().then(data => {
    console.log('Datos recibidos de la API de alumnos:', data);

    const ctxComposicion = document.getElementById('graficoComposicionNivel').getContext('2d');

    if (data && data.data && Array.isArray(data.data)) {
        // Agrupar alumnos por nivel
        const niveles = { Inicial: 0, Primario: 0, Secundario: 0 };
        data.data.forEach(alumno => {
            if (niveles[alumno.nivel] !== undefined) {
                niveles[alumno.nivel]++;
            }
        });

        // Extraer los niveles y las cantidades
        const etiquetas = Object.keys(niveles);  // ['Inicial', 'Primario', 'Secundario']
        const cantidades = Object.values(niveles);  // [cantidad_inicial, cantidad_primario, cantidad_secundario]

        const colores = ['#FF6384', '#36A2EB', '#FFCE56'];  // Colores para cada nivel

        crearGrafico(ctxComposicion, 'bar', etiquetas, cantidades, colores, 'Composición del Alumnado por Nivel');
    } else {
        console.error('Error: Los datos de la API no están en el formato esperado');
    }
}).catch(error => console.error('Error al obtener datos de composición del alumnado:', error));

    
    // Gráfico de Nivel de Asistencia General (Líneas)
asistencia().then(data => {
    console.log('Datos de asistencia general:', data);
    const ctxAsistenciaGeneral = document.getElementById('graficoAsistenciaGeneral').getContext('2d');
    if (data && data.data && Array.isArray(data.data)) {
        const cursos = data.data.map(curso => curso.curso);
        const presentes = data.data.map(curso => curso.presentes);
        const ausentes = data.data.map(curso => curso.ausentes);
        const puntos = cursos.map((curso, index) => ({ x: presentes[index], y: ausentes[index] }));
        new Chart(ctxAsistenciaGeneral, {
            type: 'line',
            data: {
                labels: cursos,
                datasets: [{
                    label: 'Asistencia General',
                    data: puntos,
                    borderColor: 'rgba(255, 99, 132, 1)',
                    backgroundColor: 'rgba(255, 99, 132, 0.2)',
                    borderWidth: 1,
                    fill: true
                }]
            },
            options: {
                responsive: true,
                scales: {
                    x: { title: { display: true, text: 'Cursos' } },
                    y: { title: { display: true, text: 'Número de Asistencias' } }
                }
            }
        });
    } else {
        console.error('Datos de asistencia general no están en el formato esperado');
    }
}).catch(error => console.error('Error al obtener datos de asistencia general:', error));
    
    // Gráfico de Comparación de Asistencia por Curso (Histograma)
    asistencia().then(data => {
        console.log('Datos de asistencia por curso:', data);
        const ctxAsistenciaPorCurso = document.getElementById('graficoAsistenciaPorCurso').getContext('2d');
        if (data && data.data && Array.isArray(data.data)) {
            const cursos = data.data.map(curso => curso.curso);
            const presentes = data.data.map(curso => curso.presentes);
            crearGrafico(ctxAsistenciaPorCurso, 'bar', cursos, presentes, '#4CAF50', 'Asistencia por Curso');
        } else {
            console.error('Datos de asistencia por curso no están en el formato esperado');
        }
    }).catch(error => console.error('Error al obtener datos de asistencia por curso:', error));
    
    // Gráfico de Evolución Anual de Asistencia por Mes (Polígono de Frecuencia)
    historial_asistencia().then(data => {
        console.log('Datos de historial de asistencia:', data);
        const ctxEvolucionAsistencia = document.getElementById('graficoEvolucionAsistencia').getContext('2d');
        if (data && data.data && Array.isArray(data.data)) {
            const meses = data.data.map(registro => registro.mes);
            const asistencia = data.data.map(registro => registro.asistencia);
            new Chart(ctxEvolucionAsistencia, {
                type: 'line',
                data: {
                    labels: meses,
                    datasets: [{
                        label: 'Evolución de Asistencia',
                        data: asistencia,
                        borderColor: '#4CAF50',
                        borderWidth: 2,
                        fill: false,
                        tension: 0.4
                    }]
                },
                options: {
                    responsive: true,
                    scales: {
                        y: { beginAtZero: true }
                    }
                }
            });
        } else {
            console.error('Datos de evolución de asistencia no están en el formato esperado');
        }
    }).catch(error => console.error('Error al obtener datos de evolución de asistencia:', error));
    
    // Gráfico de Nivel General de Calificaciones
    calificaciones().then(data => {
        console.log('Datos de calificaciones generales:', data);
        const ctxCalificacionesGenerales = document.getElementById('graficoCalificacionesGenerales').getContext('2d');
        if (data && data.data && Array.isArray(data.data)) {
            const niveles = data.data.map(nivel => nivel.nivel);
            const calificaciones = data.data.map(nivel => nivel.aprobados);
            new Chart(ctxCalificacionesGenerales, {
                type: 'radar',
                data: {
                    labels: niveles,
                    datasets: [{
                        label: 'Calificaciones Generales',
                        data: calificaciones,
                        backgroundColor: 'rgba(255, 99, 132, 0.2)',
                        borderColor: 'rgba(255, 99, 132, 1)',
                        borderWidth: 1
                    }]
                }
            });
        } else {
            console.error('Datos de calificaciones generales no están en el formato esperado');
        }
    }).catch(error => console.error('Error al obtener datos de calificaciones generales:', error));
    
    // Gráfico de Comparativa de Calificaciones por Curso
    calificaciones().then(data => {
        console.log('Datos de calificaciones por curso:', data);
        const ctxCalificacionesPorCurso = document.getElementById('graficoCalificacionesPorCurso').getContext('2d');
        if (data && data.data && Array.isArray(data.data)) {
            const cursos = data.data.map(curso => curso.curso);
            const calificaciones = data.data.map(curso => curso.aprobados);
            crearGrafico(ctxCalificacionesPorCurso, 'bar', cursos, calificaciones, '#FFCE56', 'Calificaciones por Curso');
        } else {
            console.error('Datos de calificaciones por curso no están en el formato esperado');
        }
    }).catch(error => console.error('Error al obtener datos de calificaciones por curso:', error));
    
    // Gráfico de Estado de Envío de Comunicaciones
    comunicados().then(data => {
        console.log('Datos de estado de envío:', data);
        const ctxEstadoEnvio = document.getElementById('graficoEstadoEnvio').getContext('2d');
        if (data && data.data && Array.isArray(data.data)) {
            const estados = ['Entregados', 'Pendientes', 'Errores'];
            const cantidades = [data.data[0].entregados, data.data[0].pendientes, data.data[0].errores];
            crearGrafico(ctxEstadoEnvio, 'pie', estados, cantidades, ['#FF6384', '#36A2EB', '#FFCE56'], 'Estado de Envío');
        } else {
            console.error('Datos de estado de envío no están en el formato esperado');
        }
    }).catch(error => console.error('Error al obtener datos de estado de envío:', error));
});
