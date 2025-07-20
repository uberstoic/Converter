FROM node:18-alpine AS frontend-builder

WORKDIR /app

COPY package*.json ./

RUN npm install

COPY . .

RUN npm run build

FROM nginx:stable-alpine

RUN apk add --no-cache gettext

COPY --from=frontend-builder /app/dist /usr/share/nginx/html

# отладка
RUN ls -la /usr/share/nginx/html

COPY nginx.conf /etc/nginx/templates/default.conf.template

COPY entrypoint.sh /entrypoint.sh
RUN chmod +x /entrypoint.sh

EXPOSE 80

CMD ["/entrypoint.sh"]
