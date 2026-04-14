let client;
let responseCallbacks = new Map(); // Para almacenar callbacks de respuesta por testId

export function connectMQTT() {
    client = new Paho.MQTT.Client("broker.emqx.io", 8083, "ESP32MeloPublisher");
    
    client.onMessageArrived = onMessageArrived;
    
    client.connect({
        onSuccess: () => {
            console.log("Conectado al broker MQTT");
            client.subscribe("esp32/data");
            client.subscribe("esp32/response"); // Suscribirse al topic de respuestas
        },
        onFailure: (error) => {
            console.error("Falló la conexión MQTT:", error);
        }
    });
}

function onMessageArrived(message) {
    console.log("Mensaje MQTT recibido:", message.payloadString);

    if (message.destinationName === "esp32/response") {
        try {
            const response = JSON.parse(message.payloadString);
            const idKey = String(response.testId); 

            if (responseCallbacks.has(idKey)) {
                const callback = responseCallbacks.get(idKey);
                callback(response);
                responseCallbacks.delete(idKey); // Limpiar después de usar
            } else {
                console.warn("Callback no encontrado para testId:", idKey);
            }
        } catch (error) {
            console.error("Error al parsear respuesta MQTT:", error);
        }
    }
}


export function sendStartMessage(testId, duration = 10) {
    return new Promise((resolve, reject) => {
        if (!client || !client.isConnected()) {
            reject(new Error("Cliente MQTT no conectado"));
            return;
        }

        const idKey = String(testId);

        // Configurar timeout de 60 segundos para la respuesta
        const timeout = setTimeout(() => {
            responseCallbacks.delete(idKey);
            reject(new Error("Timeout: No se recibió respuesta del ESP32"));
        }, 60000);

        // Registrar callback para la respuesta
        responseCallbacks.set(idKey, (response) => {
            clearTimeout(timeout);
            
            if (response.status === "success") {
                resolve({
                    success: true,
                    message: response.message,
                    readingsCount: response.readingsCount,
                    duration: response.duration
                });
            } else {
                reject(new Error(response.message || "Error desconocido"));
            }
        });

        // Enviar mensaje de inicio
        let messageData = JSON.stringify({
            command: "start",
            testId: parseInt(testId),
            duration: parseInt(duration)
        });
        
        let message = new Paho.MQTT.Message(messageData);
        message.destinationName = "esp32/data";
        client.send(message);

        console.log("Mensaje enviado:", messageData);
    });
}
