# Этап сборки
FROM node:18-alpine AS builder

WORKDIR /app

COPY package*.json ./

RUN npm install

COPY . .

RUN npm run build

# Этап запуска
FROM node:18-alpine

WORKDIR /app

COPY package*.json ./

# Устанавливаем только зависимости для production
RUN npm install --omit=dev

# Копируем скомпилированный код из этапа сборки
COPY --from=builder /app/dist ./

# Создаем папку для загрузок
RUN mkdir -p uploads

EXPOSE 5000

CMD ["node", "server.js"]
