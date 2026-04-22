# Utiliza una imagen base con Nginx instalado
FROM --platform=linux/amd64 nginx:latest

# Copia configuración de NGINX
COPY ngnix.conf /etc/nginx/conf.d/default.conf

# Copia los archivos estáticos construidos
COPY dist/ /usr/share/nginx/html/

# Expone el puerto 3000
EXPOSE 3000