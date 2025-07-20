FROM node:18-alpine AS backend-builder

WORKDIR /app

COPY package*.json ./

RUN npm install

COPY . .

RUN npm run build

FROM node:18-alpine

WORKDIR /app

COPY package*.json ./

RUN npm install --omit=dev

COPY --from=backend-builder /app/dist ./

RUN mkdir -p uploads

EXPOSE 5000

CMD ["node", "server.js"]
