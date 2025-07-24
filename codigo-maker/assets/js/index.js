var IndexUtils = {
    generarCodigo: function (letras, numeros, especiales, cantLetras, cantNumeros, cantEspeciales, longitud) {
        let codigo = [];

        for (let i = 0; i < cantLetras; i++) {
            const l = letras[Math.floor(Math.random() * letras.length)];
            codigo.push(l);
        }

        for (let i = 0; i < cantNumeros; i++) {
            const n = numeros[Math.floor(Math.random() * numeros.length)];
            codigo.push(n);
        }

        for (let i = 0; i < cantEspeciales; i++) {
            const e = especiales[Math.floor(Math.random() * especiales.length)];
            codigo.push(e);
        }

        const restante = longitud - codigo.length;
        const pool = letras + numeros + especiales;
        for (let i = 0; i < restante; i++) {
            const extra = pool[Math.floor(Math.random() * pool.length)];
            codigo.push(extra);
        }

        return codigo.sort(() => Math.random() - 0.5).join('');
    },

    exportarCodigos: function (nombreBase, codigosArray) {
        const timestamp = IndexUtils.obtenerFechaTimestamp();
        const nombreArchivo = `${nombreBase}_${codigosArray.length}_${timestamp}.txt`;

        const blob = new Blob([codigosArray.join('\n')], { type: 'text/plain' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = nombreArchivo;
        a.click();
        URL.revokeObjectURL(url);
    },

    obtenerFechaTimestamp: function () {
        const ahora = new Date();
        const pad = (n) => n.toString().padStart(2, '0');
        return `${ahora.getFullYear()}${pad(ahora.getMonth() + 1)}${pad(ahora.getDate())}_${pad(ahora.getHours())}${pad(ahora.getMinutes())}${pad(ahora.getSeconds())}`;
    }
}


$(document).ready(function () {
    $('#configForm').on('submit', function (e) {
        e.preventDefault();

        // Limpiar preview y duplicados
        $('#codigoEjemplo').text('---');
        $('#duplicadosContainer').empty();
        $('#exportarBtn').prop('disabled', false);

        // Obtener configuraciones
        const longitud = parseInt($('#longitud').val());
        let letras = $('#letras').val().trim() || 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
        let numeros = $('#numeros').val().trim() || '0123456789';
        const cantLetras = parseInt($('#cantidadLetras').val().trim()) || 0;
        const cantNumeros = parseInt($('#cantidadNumeros').val().trim()) || 0;
        const cantEspeciales = parseInt($('#cantidadEspeciales').val().trim()) || 0;
        const usarMayusculas = $('#usarMayusculas').is(':checked');
        let especiales = $('#especiales').val().trim() || '';

        if (usarMayusculas) {
            letras += letras.toLowerCase();
        }

        const total = cantLetras + cantNumeros + cantEspeciales;
        if (total > longitud) {
            alert("❌ La suma de letras y números excede la longitud total.");
            return;
        }

        if (total < longitud) {
            const continuar = confirm(`⚠️ Estás usando solo ${total} de los ${longitud} caracteres. ¿Deseas rellenar los restantes con letras y números aleatorios?`);
            if (!continuar) return;
        }

        const combinaciones = Math.pow(letras.length, cantLetras) * Math.pow(numeros.length, cantNumeros);
        $('#combinaciones').text(combinaciones.toLocaleString());

        const ejemplo = IndexUtils.generarCodigo(letras, numeros, especiales, cantLetras, cantNumeros, cantEspeciales, longitud);
        $('#codigoEjemplo').text(ejemplo);
    });

    $('#exportarBtn').on('click', function () {
        let codigosUnicos = new Set();
        let codigosDuplicados = [];

        // Obtener configuraciones
        const longitud = parseInt($('#longitud').val());
        let letras = $('#letras').val().trim() || 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
        let numeros = $('#numeros').val().trim() || '0123456789';
        const cantLetras = parseInt($('#cantidadLetras').val().trim()) || 0;
        const cantNumeros = parseInt($('#cantidadNumeros').val().trim()) || 0;
        const cantEspeciales = parseInt($('#cantidadEspeciales').val().trim()) || 0;
        const usarMayusculas = $('#usarMayusculas').is(':checked');
        let especiales = $('#especiales').val().trim() || '';

        if (usarMayusculas) {
            letras += letras.toLowerCase();
        }

        const combinaciones = Math.pow(letras.length, cantLetras) * Math.pow(numeros.length, cantNumeros);
        let cantidad = parseInt(prompt("¿Cuántos códigos deseas generar?"));

        const total = cantLetras + cantNumeros + cantEspeciales;
        if (total > longitud) {
            alert("❌ La suma de letras, números y especiales excede la longitud total.");
            return;
        }

        if (total < longitud) {
            const continuar = confirm(`⚠️ Estás usando solo ${total} de los ${longitud} caracteres. ¿Deseas rellenar los restantes con cualquier carácter disponible?`);
            if (!continuar) return;
        }

        while (codigosUnicos.size < cantidad) {
           const nuevo = IndexUtils.generarCodigo(letras, numeros, especiales, cantLetras, cantNumeros, cantEspeciales, longitud);
            if (codigosUnicos.has(nuevo)) {
                codigosDuplicados.push(nuevo);
            } else {
                codigosUnicos.add(nuevo);
            }
        }

        // Mostrar duplicados en pantalla
        if (codigosDuplicados.length > 0) {
            $('#duplicadosContainer').html(`
        <h4>⚠️ Códigos duplicados detectados (${codigosDuplicados.length}):</h4>
        <pre>${codigosDuplicados.join('\n')}</pre>
      `);
        }

        // Exportar archivos
        IndexUtils.exportarCodigos('codigos_validos', Array.from(codigosUnicos));
        if (codigosDuplicados.length > 0) {
            IndexUtils.exportarCodigos('codigos_duplicados', codigosDuplicados);
        }
    });
});
