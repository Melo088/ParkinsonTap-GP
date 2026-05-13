# ParkinsonTap-GP

Sistema de captura y análisis de datos de movimiento para detección de síntomas asociados al Parkinson. Proyecto desarrollado bajo metodología Scrum para la asignatura Gerencia de Proyectos en la Universidad ICESI.

## Stack Tecnológico

| Capa            | Tecnología                                 |
| --------------- | ------------------------------------------ |
| Firmware        | ESP32 + MPU6050 · PlatformIO · MQTT        |
| Backend         | Spring Boot 3 · Java 17 · PostgreSQL · JWT |
| Frontend        | React · Vite · Material UI                 |
| Mensajería      | MQTT (Mosquitto)                           |
| Infraestructura | Docker · Docker Compose · Dev Container    |

---

## Requisitos Previos

| Herramienta        | Propósito                                        | Enlace                                                      |
| ------------------ | ------------------------------------------------ | ----------------------------------------------------------- |
| **VS Code**        | Editor de código y gestión de contenedores       | [Descargar](https://code.visualstudio.com/)                 |
| **Docker Desktop** | Orquestación de servicios (Java, Node, DB, MQTT) | [Descargar](https://www.docker.com/products/docker-desktop) |

No es necesaria la instalación local de Java, Node.js o Maven, ya que el entorno está estandarizado dentro del contenedor de desarrollo.

---

## Inicio Rápido

### 1. Preparar VS Code

Instalar la extensión **Dev Containers** desde el marketplace de VS Code.

### 2. Clonar y abrir el proyecto

```bash
git clone https://github.com/Melo088/ParkinsonTap-GP.git
code ParkinsonTap-GP
```

### 3. Levantar el entorno

Al abrir la carpeta, VS Code detectará la configuración. Seleccionar la opción **Reopen in Container** en la notificación emergente. La construcción inicial del entorno puede tomar unos minutos dependiendo de la conexión a internet.

---

## Ejecución de Servicios

Una vez dentro del contenedor, abrir terminales independientes para cada capa:

### Backend

```bash
cd backend
./mvnw spring-boot:run
```

El servicio estará disponible en: `http://localhost:8080`

### Frontend (Acceso por red)

```bash
cd frontend
npm install
npm run dev -- --host
```

El servicio estará disponible en: `http://[IP-DE-TU-PC]:5173`

---

## Estructura del Proyecto

```
ParkinsonTap-GP/
├── .devcontainer/         ← Configuración de Docker para desarrollo
├── backend/                ← API REST Spring Boot
├── frontend/               ← Aplicación SPA React
├── esp32/                  ← Código fuente del firmware
├── mosquitto/              ← Configuración del broker MQTT
├── docker-compose.yml      ← Definición de servicios de infraestructura
├── .env.example            ← Plantilla de variables de entorno
└── README.md
```

---

## Configuración de Firmware (ESP32)

Debido a que el flasheo requiere acceso directo al hardware USB, este componente se gestiona fuera de Docker:

1. Instalar la extensión **PlatformIO IDE** en VS Code.
2. Abrir exclusivamente la carpeta `esp32/`.
3. Crear el archivo de configuración de red:

```bash
cp esp32/src/secrets.h.example esp32/src/secrets.h
```

4. Editar `secrets.h` con las credenciales de la red local y la dirección IP del host.

---

## Configuración de Red Local (ESP32 ↔ Backend ↔ Frontend)

Esta sección describe qué cambiar en cada lugar cuando se levanta el sistema en una red diferente o en una nueva máquina.

### Paso 1 — Obtener la IP de tu PC en la red local

```bash
ip addr show | grep "192.168"
# Ejemplo de salida: inet 192.168.1.13/24
```

La IP que aparece (ej. `192.168.1.13`) es la que se usa en todos los pasos siguientes.

### Paso 2 — `esp32/src/secrets.h`

```c
#define WIFI_SSID     "nombre-de-tu-red"
#define WIFI_PASSWORD "contraseña-de-tu-red"

// IP de tu PC (broker Mosquitto y backend corren aquí)
#define MQTT_SERVER   "192.168.1.13"   // ← cambiar
#define MQTT_PORT     1883

#define BACKEND_URL   "http://192.168.1.13:8080/api/esp32/batch-readings"  // ← cambiar
```

Después de editar este archivo, flashear el ESP32 desde la carpeta `esp32/`:

```bash
pio run --target upload && pio device monitor
```

### Paso 3 — `frontend/src/services/dataAcquisitionService.js`

```js
const BROKER_URL = "ws://localhost:9001/mqtt";
```

Este valor **no cambia** siempre que el frontend corra en la misma máquina donde está Docker. El WebSocket va al broker Mosquitto local (puerto 9001).

### Paso 4 — Exponer el puerto 8080 en la red local

El backend corre dentro del devcontainer. Para que el ESP32 pueda enviarle datos HTTP, el puerto 8080 debe estar accesible desde la red local.

**Opción A — `docker-compose.yml` (permanente, recomendada):**

El `docker-compose.yml` ya incluye la línea siguiente en el servicio `devcontainer`. Solo asegúrate de que esté presente:

```yaml
devcontainer:
  ports:
    - "0.0.0.0:8080:8080"
```

Luego reiniciar el servicio:

```bash
docker compose up -d devcontainer
```

**Opción B — `socat` en sesión activa (alternativa temporal):**

Si VS Code ya está conectado al contenedor y no quieres reiniciarlo:

```bash
socat TCP-LISTEN:8080,fork,reuseaddr,bind=192.168.1.13 TCP:127.0.0.1:8080 &
```

Reemplazar `192.168.1.13` con la IP de tu PC. Este proceso vive solo mientras la sesión de terminal esté abierta.

### Resumen de puertos

| Puerto | Protocolo | Quién escucha       | Quién se conecta          |
|--------|-----------|---------------------|---------------------------|
| 1883   | MQTT/TCP  | Mosquitto (Docker)  | ESP32                     |
| 9001   | MQTT/WS   | Mosquitto (Docker)  | Frontend (browser)        |
| 8080   | HTTP      | Spring Boot (Docker)| ESP32 (POST de lecturas)  |
| 5173   | HTTP      | Vite (devcontainer) | Browser                   |
| 5433   | PostgreSQL| Postgres (Docker)   | Spring Boot               |

### Verificación rápida

```bash
# ¿El broker MQTT acepta conexiones?
docker exec parkinsontap-gp-mqtt-1 mosquitto_sub -t "parkinsontap/#" -v

# ¿El backend responde desde la red local?
curl -X POST http://192.168.1.13:8080/api/esp32/batch-readings \
  -H "Content-Type: application/json" \
  -d '{"testId":0,"readings":[]}' 
# Respuesta esperada: HTTP 400 "Test con ID 0 no encontrado"

# ¿El ESP32 está publicando en MQTT?
docker exec parkinsontap-gp-mqtt-1 mosquitto_sub -t "parkinsontap/icesi/response" -v
```

---

## Análisis de Datos e Informe Clínico

El sistema genera un informe por test (`/informe/:testId`) con métricas estadísticas calculadas a partir de las 250 lecturas del sensor (25 Hz × 10 s) y un PDF exportable.

### Métricas calculadas

| Métrica | Fórmula | Descripción |
|---------|---------|-------------|
| RMS por eje | `√(mean(ax²))` | Magnitud cuadrática media — **incluye gravedad**, valor informativo |
| Desviación estándar por eje | `√(mean((ax - mean_ax)²))` | Variabilidad dinámica alrededor de la media |
| Rango por eje | `max(ax) - min(ax)` | Amplitud total de movimiento |
| Amplitud pico a pico | `max(|a|) - min(|a|)` | Rango de la magnitud total de aceleración |
| **RMS Dinámico** | `√(σx² + σy² + σz²)` | Amplitud real del temblor, **sin gravedad** |
| Índice de Temblor | Normalización de RMS Dinámico → 0–100 | Score compuesto orientativo |

### Por qué se usa la desviación estándar para el temblor (no el RMS total)

El acelerómetro MPU6050 mide aceleración **total**, que incluye la gravedad (~9.81 m/s²). Con el sensor orientado como en las pruebas:

```
ax=10.35  ay=-0.18  az=-2.72
√(10.35² + 0.18² + 2.72²) ≈ 10.7 m/s²  ← casi todo es gravedad
```

El `rmsTotal` siempre rondará 9–11 m/s² independientemente del temblor real. Para aislar el movimiento dinámico se usa la desviación estándar, que mide la variación *alrededor* de la media de cada eje (donde la media absorbe el componente estático de la gravedad):

```
RMS Dinámico = √(σx² + σy² + σz²)
```

Este valor sí refleja la amplitud real del temblor y es la base del Índice de Temblor.

### Limitaciones clínicas conocidas

#### 1. Umbrales del Índice de Temblor no están validados clínicamente

Los umbrales actuales (0.10 / 0.50 / 1.00 m/s²) son **orientativos**. Los estudios de referencia (Patel et al. 2009; Salarian et al. 2007) muestran que los umbrales válidos dependen de:

- **Ubicación del sensor**: muñeca, dedo, antebrazo — produce amplitudes muy distintas.
- **Tipo de temblor evaluado**: reposo, postural o de acción.
- **Calibración contra escalas clínicas validadas**: escala UPDRS (Unified Parkinson's Disease Rating Scale).

Para que el índice tenga validez clínica real es necesario medir un grupo de pacientes diagnosticados y un grupo de controles sanos con este protocolo específico, ajustar los umbrales a esos datos, y validar contra puntuaciones UPDRS.

Los umbrales se encuentran en `AnalysisService.java` y están comentados para facilitar su ajuste:

```java
// < 0.10 m/s² → Normal  | 0.10–0.50 → Leve | 0.50–1.00 → Moderado | > 1.00 → Severo
```

#### 2. Deriva del filtro complementario en ángulos

Los ángulos yaw/pitch/roll se calculan con un filtro complementario que integra el giroscopio en el tiempo. En una prueba de 10 segundos la integración acumula deriva significativa:

```
t=0s:  Y=4.1°   P=4.7°   R=-7.9°
t=9s:  Y=90.9°  P=104.6° R=-174.5°   ← sensor en reposo, pero los ángulos derivan
```

Las métricas de rotación (`stdYaw`, `stdPitch`, `stdRoll`) describen el comportamiento del filtro durante el test, no el movimiento articular real. Son útiles para comparar tests entre sí del mismo paciente, pero no para interpretación clínica absoluta.

#### 3. El informe no reemplaza al médico

El informe generado es una herramienta de apoyo cuantitativo. La interpretación clínica definitiva y el diagnóstico corresponden exclusivamente al médico tratante.

---

## Gestión del Proyecto (Scrum)

Se utiliza un flujo de trabajo basado en ramas para mantener la integridad del código:

- **main**: Código estable para entregas finales.
- **develop**: Rama de integración para el sprint actual.
- **feature/US-XX-descripcion**: Desarrollo de historias de usuario específicas.
- **bugfix/descripcion**: Corrección de errores críticos.

Para iniciar un desarrollo:

```bash
git checkout develop
git pull origin develop
git checkout -b feature/nombre-de-la-historia
```

---

## Comandos de Diagnóstico

```bash
# Verificar estado de los contenedores
docker compose ps

# Monitorear tráfico MQTT en tiempo real
docker compose logs mqtt -f

# Suscribirse manualmente a los mensajes del sensor
docker exec -it parkinsontap-gp-mqtt-1 mosquitto_sub -t "esp32/#" -v

# Reiniciar base de datos
docker compose restart db

# Limpiar volumenes y servicios (Cuidado: elimina datos de la DB)
docker compose down -v
```
