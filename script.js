const btn = document.getElementById('btnSolicitar');
const cuadroResultado = document.getElementById('resultado');
const textoRespuesta = document.getElementById('textoRespuesta');
const estadoTexto = document.querySelector('.status');

btn.addEventListener('click', async () => {
    
    // Preparacion inicial
    btn.innerText = "Consultando...";
    btn.disabled = true;
    cuadroResultado.classList.add('hidden');

    try {
        //Petición a la API 
        const response = await fetch(`https://noasaservice.lol/api/get?t=${new Date().getTime()}`);
        const data = await response.json();

        if (response.ok) {
            estadoTexto.style.color = "#4af626"; 
            estadoTexto.innerText = `Estado: ${response.status} OK - ¡Rechazo recibido!`;
            
            //  todas las variaciones posibles de la respuesta
            const mensajeFinal = data.Respuesta || data.respuesta || data.message || data.error || data.text;
            
            // Si no se encuentra el nombre del campo, toma el primer valor que vea
            textoRespuesta.innerText = mensajeFinal || Object.values(data)[0] || "Formato desconocido";
        } else {
            // Si el servidor responde pero con un error
            estadoTexto.style.color = "#ff5252"; 
            estadoTexto.innerText = `Estado: ${response.status} - El servidor fallo`;
            textoRespuesta.innerText = "La API está teniendo problemas para decir que no.";
        }

        cuadroResultado.classList.remove('hidden');

    } catch (error) {
        // Logica de error de red (Sin internet o API caída)
        console.error("Error de conexión:", error);
        estadoTexto.style.color = "#ff5252"; 
        estadoTexto.innerText = "Estado: Error de Red";
        textoRespuesta.innerText = "No se pudo establecer conexión con el servicio.";
        cuadroResultado.classList.remove('hidden');
    } finally {
        //Restaurar botón
        btn.innerText = "Hacer solicitud";
        btn.disabled = false;
    }
});