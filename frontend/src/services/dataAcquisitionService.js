import mqtt from "mqtt";

const BROKER_URL = "ws://localhost:9001/mqtt";
const CMD_TOPIC = "parkinsontap/icesi/cmd";
const RESPONSE_TOPIC = "parkinsontap/icesi/response";

let client = null;
const responseCallbacks = new Map();

export function connectMQTT() {
    client = mqtt.connect(BROKER_URL, {
        clientId: "ESP32MeloPublisher_" + Math.random().toString(16).slice(2, 8),
        protocol: "ws",
    });

    client.on("connect", () => {
        console.log("Conectado al broker MQTT");
        client.subscribe(CMD_TOPIC);
        client.subscribe(RESPONSE_TOPIC);
    });

    client.on("message", (topic, payload) => {
        const message = payload.toString();
        console.log("Mensaje MQTT recibido:", message);

        if (topic === RESPONSE_TOPIC) {
            try {
                const response = JSON.parse(message);
                const idKey = String(response.testId);

                if (responseCallbacks.has(idKey)) {
                    const callback = responseCallbacks.get(idKey);
                    callback(response);
                    responseCallbacks.delete(idKey);
                } else {
                    console.warn("Callback no encontrado para testId:", idKey);
                }
            } catch (error) {
                console.error("Error al parsear respuesta MQTT:", error);
            }
        }
    });

    client.on("error", (error) => {
        console.error("Error MQTT:", error);
    });

    client.on("close", () => {
        console.warn("Conexión MQTT cerrada");
    });
}

export function sendStartMessage(testId, duration = 10) {
    return new Promise((resolve, reject) => {
        if (!client || !client.connected) {
            reject(new Error("Cliente MQTT no conectado"));
            return;
        }

        const idKey = String(testId);

        const timeout = setTimeout(() => {
            responseCallbacks.delete(idKey);
            reject(new Error("Timeout: No se recibió respuesta del ESP32"));
        }, 60000);

        responseCallbacks.set(idKey, (response) => {
            clearTimeout(timeout);

            if (response.status === "success") {
                resolve({
                    success: true,
                    message: response.message,
                    readingsCount: response.readingsCount,
                    duration: response.duration,
                });
            } else {
                reject(new Error(response.message || "Error desconocido"));
            }
        });

        const messageData = JSON.stringify({
            command: "start",
            testId: parseInt(testId),
            duration: parseInt(duration),
        });

        client.publish(CMD_TOPIC, messageData);
        console.log("Mensaje enviado:", messageData);
    });
}
