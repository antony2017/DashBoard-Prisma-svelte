# Dockerfile dentro de la carpeta 'backend/'

FROM node:20-slim
WORKDIR /usr/src/app

# Copia los archivos de manifiesto del proyecto
COPY package*.json ./

# Instala las dependencias
RUN npm install --production

# Copia el resto del código del backend
COPY . .

EXPOSE 3000
CMD [ "node", "server.js" ]