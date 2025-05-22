FROM node:18-alpine

# Configuración para deshabilitar la verificación SSL en Node.js
ENV NODE_TLS_REJECT_UNAUTHORIZED=0

WORKDIR /app

COPY package*.json ./

RUN npm install

COPY . .

RUN npm run build

EXPOSE 5000

CMD ["npm", "start"]