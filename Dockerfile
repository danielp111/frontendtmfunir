# ---- Etapa de construcción ----
FROM node:20-alpine AS build
WORKDIR /app

# Instalar dependencias primero (capa cacheada si package*.json no cambia)
COPY package.json package-lock.json ./
RUN npm ci

# Copiar fuentes y compilar (genera dist/front-end/browser y dist/front-end/server)
COPY . .
RUN npm run build

# ---- Etapa de ejecución (servidor SSR de Angular) ----
FROM node:20-alpine
WORKDIR /app

COPY --from=build /app/dist/front-end ./dist/front-end

ENV NODE_ENV=production \
    PORT=4000
EXPOSE 4000

CMD ["node", "dist/front-end/server/server.mjs"]
