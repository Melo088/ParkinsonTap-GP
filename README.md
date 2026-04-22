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

4. Editar `secrets.h` con las credenciales de la red local y la dirección IP del host que corre el broker MQTT.

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
