# Multi-stage Dockerfile para SvelteKit con adapter-node
# Construye la app SvelteKit (frontend) y ejecuta el servidor Node resultante

FROM node:22 AS builder
WORKDIR /app

# Copiamos todo el repo (necesario si dependes de ../backend/servers.json u otros archivos)
COPY . .

# Instalar dependencias y construir solo la carpeta frontend
WORKDIR /app/frontend
# preferimos npm ci si hay package-lock.json; si falla, cae a npm install
RUN npm ci --unsafe-perm || npm install
RUN npm run build

# Etapa de producción: runtime ligero con Node para servir build (adapter-node)
FROM node:18-alpine AS runtime
WORKDIR /app
ENV NODE_ENV=production

# Copiamos la build y node_modules desde el builder
COPY --from=builder /app/frontend/build ./build
COPY --from=builder /app/frontend/node_modules ./node_modules

# Si necesitas servers.json en runtime, cópialo desde el backend
COPY --from=builder /app/servers.json ./servers.json

EXPOSE 3000
# Ejecuta el servidor Node generado por SvelteKit (adapter-node)
CMD ["node", "build"]