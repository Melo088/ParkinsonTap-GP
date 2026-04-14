# Utiliza una imagen base de Java
FROM amazoncorretto:22-jdk

# Establece el directorio de trabajo en la imagen
WORKDIR /app

# Copia el archivo JAR del backend al directorio de trabajo
COPY ./target/ParkinsonTapWeb-0.0.1-SNAPSHOT.jar /app/backend.jar

# Expone el puerto en el que se ejecutará el backend (ajusta el número de puerto según tus necesidades)
EXPOSE 8080

# Comando para ejecutar la aplicación Spring Boot
CMD ["java", "-jar", "backend.jar"]