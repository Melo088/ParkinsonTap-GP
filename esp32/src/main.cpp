#include <Arduino.h>
#include <WiFi.h>
#include <HTTPClient.h>
#include <Arduino_JSON.h>
#include <PubSubClient.h>
#include <Adafruit_MPU6050.h>
#include <Adafruit_Sensor.h>
#include <Wire.h>

const char* ssid = "";
const char* password = "";

// MQTT params
const char* mqttServer = "broker.emqx.io";
const int mqttPort = 1883;
const char* clientName = "ESP32ClienteIcesiMelo";

// Objeto WiFiClient
WiFiClient wifiClient;

// Objeto PubSubClient
PubSubClient mqttClient(wifiClient);

// Configuración del topic
const char* topic = "esp32/data";
const char* responseTopic = "esp32/response";

String url = "http://192.168.130.56:8080/api/esp32/batch-readings";

// Variables para el cálculo de ángulos
double compAngleX = 0, compAngleY = 0, compAngleZ = 0;
double accXangle, accYangle, accZangle;
double gyroXrate, gyroYrate, gyroZrate;
double gyroXAngle = 0, gyroYAngle = 0, gyroZAngle = 0;
double ap = 0.955; // Complementary Filter constant

// Adafruit MPU6050 Object
Adafruit_MPU6050 mpu;

// Flag para mostrar o no los datos del IMU
bool showImuData = false;

void displayMenu() {
  Serial.println("\n===== SISTEMA DE CAPTURA DE DATOS IMU =====");
  Serial.println("Comandos disponibles:");
  Serial.println("g - Realizar GET HTTP");
  Serial.println("p - Realizar POST HTTP con datos del MPU6050 (10s por defecto)");
  Serial.println("m - Mostrar este menú nuevamente");
  Serial.println("=========================================");
}

void keepAlive() {
  if (!mqttClient.connected()) {
    Serial.println("Reconectando");
    // Intenta conectarse al servidor MQTT
    while (!mqttClient.connected()) {
      Serial.println("Intentando conectar al servidor MQTT...");
      if (mqttClient.connect(clientName)) {
        Serial.println("Conectado al servidor MQTT!");
      } else {
        Serial.print("Error al conectar: ");
        Serial.println(mqttClient.state());
        delay(5000);
      }
    }
    mqttClient.subscribe(topic);
  }
}

void httpGET() {
  HTTPClient http;
  http.begin(url.c_str());
  int httpResponseCode = http.GET();
  if (httpResponseCode > 0) {
    Serial.print("HTTP Response code: ");
    Serial.println(httpResponseCode);
    String payload = http.getString();
    Serial.println(payload);
  } else {
    Serial.print("Error code: ");
    Serial.println(httpResponseCode);
  }
  http.end();
}

// Inicializa el MPU6050
void initMPU() {
  Serial.println("Inicializando MPU6050...");
  if (!mpu.begin()) {
    Serial.println("No se pudo encontrar el MPU6050!");
    while (1) {
      delay(10);
    }
  }
  Serial.println("MPU6050 encontrado!");
  
  mpu.setAccelerometerRange(MPU6050_RANGE_8_G);
  mpu.setGyroRange(MPU6050_RANGE_500_DEG);
  mpu.setFilterBandwidth(MPU6050_BAND_5_HZ);
  
  Serial.println("MPU6050 configurado correctamente");
}

// Lee los datos del MPU6050 y calcula los ángulos
void updateAngles() {
  // Lectura de los valores del MPU6050
  sensors_event_t a, g, temp;
  mpu.getEvent(&a, &g, &temp);

  // Obtener los valores de aceleración
  double AcX = a.acceleration.x;
  double AcY = a.acceleration.y;
  double AcZ = a.acceleration.z;

  // Calcular los ángulos de aceleración
  accXangle = (atan2(AcY, AcZ) * RAD_TO_DEG);
  accYangle = (atan2(AcX, AcZ) * RAD_TO_DEG);
  accZangle = (atan2(AcX, AcY) * RAD_TO_DEG);

  // Obtener los valores de velocidad angular
  gyroXrate = g.gyro.x;
  gyroYrate = g.gyro.y;
  gyroZrate = g.gyro.z;

  // Calcular la diferencia de tiempo
  static unsigned long lastTime = 0;
  unsigned long currentTime = millis();
  double dt = (currentTime - lastTime) / 1000.0;  // Convertir a segundos
  if (lastTime == 0) {
    dt = 0;
  }
  lastTime = currentTime;

  // Calcular los ángulos de los giroscopios
  gyroXAngle = gyroXrate * dt;
  gyroYAngle = gyroYrate * dt;
  gyroZAngle = gyroZrate * dt;

  // Aplicar el filtro complementario
  compAngleX = ap * (compAngleX + gyroXAngle) + (1 - ap) * accXangle;
  compAngleY = ap * (compAngleY + gyroYAngle) + (1 - ap) * accYangle;
  compAngleZ = ap * (compAngleZ + gyroZAngle) + (1 - ap) * accZangle;
}

int currentTestId = 0;

void httpPOST(int durationSeconds = 10) {
  // Activar la visualización de datos del IMU durante la prueba
  showImuData = true;
  
  // Calcular el número de lecturas basado en la duración y frecuencia de muestreo (25 Hz)
  int totalReadings = durationSeconds * 25;
  int sampleIntervalMs = 40; // 40ms = 25 Hz
  
  Serial.println("\nIniciando captura de datos...");
  Serial.print("Duración: ");
  Serial.print(durationSeconds);
  Serial.print(" segundos (");
  Serial.print(totalReadings);
  Serial.println(" lecturas)");
  Serial.println("-------------------------------------");
  
  // Iniciar la construcción del JSON manualmente
  String json = "{\"testId\":" + String(currentTestId) + ",\"duration\":" + String(durationSeconds) + ",\"readings\":[";
  
  unsigned long startTime = millis();
  unsigned long lastSampleTime = startTime;
  
  for (int i = 0; i < totalReadings; ) {
    unsigned long currentTime = millis();
    
    if (currentTime - lastSampleTime >= sampleIntervalMs) {
      // Actualizar los ángulos
      updateAngles();
      
      // Leer los datos del sensor
      sensors_event_t a, g, temp;
      mpu.getEvent(&a, &g, &temp);
      
      // Añadir esta lectura al JSON como un objeto
      json += "{";
      json += "\"time\":" + String(currentTime - startTime) + ",";
      json += "\"ax\":" + String(a.acceleration.x) + ",";
      json += "\"ay\":" + String(a.acceleration.y) + ",";
      json += "\"az\":" + String(a.acceleration.z) + ",";
      json += "\"y\":" + String(compAngleZ) + ",";
      json += "\"p\":" + String(compAngleY) + ",";
      json += "\"r\":" + String(compAngleX);
      json += "}";
      
      // Añadir coma excepto para el último elemento
      if (i < totalReadings - 1) {
        json += ",";
      }
      
      // Mostrar progreso cada 25 lecturas (1 segundo)
      if (showImuData && i % 25 == 0) {
        int elapsedSeconds = (currentTime - startTime) / 1000;
        Serial.print("Progreso: ");
        Serial.print(elapsedSeconds);
        Serial.print("/");
        Serial.print(durationSeconds);
        Serial.print("s (");
        Serial.print((i * 100) / totalReadings);
        Serial.print("%) - ");
        Serial.print("ax=");
        Serial.print(a.acceleration.x, 2);
        Serial.print(" ay=");
        Serial.print(a.acceleration.y, 2);
        Serial.print(" az=");
        Serial.print(a.acceleration.z, 2);
        Serial.print(" Y=");
        Serial.print(compAngleZ, 1);
        Serial.print(" P=");
        Serial.print(compAngleY, 1);
        Serial.print(" R=");
        Serial.println(compAngleX, 1);
      }
      
      lastSampleTime = currentTime;
      i++;
    }
    
    // Verificar si se ha excedido el tiempo máximo (con un margen del 10%)
    if (currentTime - startTime > (durationSeconds * 1100)) {
      Serial.println("Tiempo máximo excedido, finalizando captura...");
      break;
    }
  }
  
  // Cerrar el array de lecturas y el objeto principal
  json += "]}";
  
  // Desactivar la visualización de datos del IMU
  showImuData = false;
  unsigned long totalTime = millis() - startTime;
  Serial.println("-------------------------------------");
  Serial.print("Captura de datos completada en ");
  Serial.print(totalTime / 1000.0, 2);
  Serial.println(" segundos!");
  
  // Debug: Mostrar información del JSON
  Serial.println("Enviando datos al servidor...");
  Serial.print("Tamaño del JSON: ");
  Serial.print(json.length());
  Serial.println(" bytes");
  
  // Enviar los datos mediante HTTP POST
  HTTPClient http;
  http.begin(url.c_str());
  http.addHeader("Content-Type", "application/json");
  
  // Aumentar el timeout para transmisiones más largas
  http.setTimeout(30000); // 30 segundos
  
  int httpResponseCode = http.POST(json);
  
  // Crear mensaje de respuesta para MQTT
  String responseMessage;
  bool success = false;
  
  if (httpResponseCode > 0) {
    Serial.print("HTTP Response code: ");
    Serial.println(httpResponseCode);
    String payload = http.getString();
    Serial.println(payload);
    
    // Verificar si la respuesta indica éxito (códigos 200-299)
    if (httpResponseCode >= 200 && httpResponseCode < 300) {
      success = true;
      responseMessage = "{\"testId\":" + String(currentTestId) + 
                       ",\"status\":\"success\"" +
                       ",\"message\":\"Datos guardados correctamente\"" +
                       ",\"readingsCount\":" + String(totalReadings) +
                       ",\"duration\":" + String(durationSeconds) + "}";
    } else {
      responseMessage = "{\"testId\":" + String(currentTestId) + 
                       ",\"status\":\"error\"" +
                       ",\"message\":\"Error del servidor: " + String(httpResponseCode) + "\"" +
                       ",\"httpCode\":" + String(httpResponseCode) + "}";
    }
  } else {
    Serial.print("Error code: ");
    Serial.println(httpResponseCode);
    responseMessage = "{\"testId\":" + String(currentTestId) + 
                     ",\"status\":\"error\"" +
                     ",\"message\":\"Error de conexión HTTP\"" +
                     ",\"httpCode\":" + String(httpResponseCode) + "}";
  }
  
  http.end();
  
  // Publicar respuesta en MQTT
  if (mqttClient.connected()) {
    Serial.println("Publicando respuesta en MQTT...");
    Serial.println("Mensaje de respuesta: " + responseMessage);
    mqttClient.publish(responseTopic, responseMessage.c_str());
    Serial.println("Respuesta publicada en topic: " + String(responseTopic));
  } else {
    Serial.println("Cliente MQTT no conectado, no se pudo publicar respuesta");
  }
  
  displayMenu();
}

void initWiFi() {
  Serial.println("\nConectando a WiFi...");
  WiFi.begin(ssid, password);
  Serial.print("Conectando a ");
  Serial.print(ssid);
  Serial.print(" ");
  
  int attempts = 0;
  while (WiFi.status() != WL_CONNECTED && attempts < 20) {
    Serial.print(".");
    delay(1000);
    attempts++;
  }
  
  if (WiFi.status() == WL_CONNECTED) {
    Serial.println("\n¡Conectado correctamente!");
    Serial.print("Dirección IP: ");
    Serial.println(WiFi.localIP());
    
    // Conectar al broker MQTT después de establecer la conexión WiFi
    Serial.println("Conectando al broker MQTT...");
    if (mqttClient.connect(clientName)) {
      Serial.println("Conectado al servidor MQTT!");
      mqttClient.subscribe(topic);
    } else {
      Serial.print("Error al conectar al MQTT: ");
      Serial.println(mqttClient.state());
    }
  } else {
    Serial.println("\nNo se pudo conectar al WiFi. Intente nuevamente.");
  }
  
  displayMenu();
}

void callback(char* topic, byte* payload, unsigned int length) {
  String message = "";
  for (int i = 0; i < length; i++) {
    message += (char)payload[i];
  }
  Serial.print("Mensaje recibido en el topic: ");
  Serial.print(topic);
  Serial.print(" - Mensaje: ");
  Serial.println(message);

  // Verificar si el mensaje es un simple "start" (para compatibilidad)
  if(message == "start"){
    initWiFi();
    if (WiFi.status() == WL_CONNECTED) {
      Serial.println("Realizando HTTP POST con datos del MPU6050 (10s por defecto)...");
      httpPOST(10); // Duración por defecto
    } else {
      Serial.println("Error: No hay conexión WiFi. Usa 'w' para conectarte primero.");
    }
    return;
  }
  
  // Intentar parsear el mensaje como JSON
  JSONVar jsonMessage;
  jsonMessage = JSON.parse(message);
  
  if (JSON.typeof(jsonMessage) == "undefined") {
    Serial.println("El parsing del mensaje JSON falló!");
    return;
  }
  
  // Verificar si el mensaje tiene el comando "start"
  if (jsonMessage.hasOwnProperty("command") && String((const char*)jsonMessage["command"]) == "start") {
    // Obtener el testId
    if (jsonMessage.hasOwnProperty("testId")) {
      currentTestId = (int)jsonMessage["testId"];
      Serial.print("ID del test recibido: ");
      Serial.println(currentTestId);
    }
    
    // Obtener la duración (por defecto 10 segundos)
    int duration = 10;
    if (jsonMessage.hasOwnProperty("duration")) {
      duration = (int)jsonMessage["duration"];
      Serial.print("Duración recibida: ");
      Serial.print(duration);
      Serial.println(" segundos");
    } else {
      Serial.println("Duración no especificada, usando 10 segundos por defecto");
    }
    
    // Validar la duración (entre 5 y 60 segundos)
    if (duration < 5) {
      duration = 5;
      Serial.println("Duración ajustada a 5 segundos (mínimo)");
    } else if (duration > 60) {
      duration = 60;
      Serial.println("Duración ajustada a 60 segundos (máximo)");
    }
    
    initWiFi();
    if (WiFi.status() == WL_CONNECTED) {
      Serial.print("Realizando HTTP POST con datos del MPU6050 por ");
      Serial.print(duration);
      Serial.println(" segundos...");
      httpPOST(duration);
    } else {
      Serial.println("Error: No hay conexión WiFi.");
    }
  } else {
    Serial.println("Comando desconocido en el mensaje JSON");
  }
}

void setup() {
  Serial.begin(115200);
  Wire.begin();
  WiFi.mode(WIFI_STA);
  
  delay(3000);
  Serial.println("\n\n\n");
  
  initMPU();
  
  mqttClient.setServer(mqttServer, mqttPort);
  mqttClient.setCallback(callback);
  
  displayMenu();
  
  Serial.println("Iniciando conexión WiFi automáticamente en 3 segundos...");
  delay(3000);
  initWiFi();
}

void loop() {
  if (WiFi.status() == WL_CONNECTED) {
    mqttClient.loop();
    keepAlive();
  }
  
  if (Serial.available() > 0) {
    String data = Serial.readStringUntil('\n');
    
    if (data == "g") {
      if (WiFi.status() == WL_CONNECTED) {
        Serial.println("Realizando HTTP GET...");
        httpGET();
        displayMenu();
      } else {
        Serial.println("Error: No hay conexión WiFi.");
        initWiFi();
      }
    } else if (data == "p") {
      if (WiFi.status() == WL_CONNECTED) {
        Serial.println("Realizando HTTP POST con datos del MPU6050 (10s)...");
        httpPOST(10);
      } else {
        Serial.println("Error: No hay conexión WiFi.");
        initWiFi();
      }
    } else if (data == "m") {
      displayMenu();
    } else {
      Serial.print("Comando desconocido: ");
      Serial.println(data);
      displayMenu();
    }
  }
  
  delay(10);
}
