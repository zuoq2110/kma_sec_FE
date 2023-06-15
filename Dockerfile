FROM node:20.3.0-alpine3.18 as build-stage

WORKDIR /app

COPY ["package.json", "package-lock.json", "/app/"]

RUN npm install --production --silent;

COPY [".", "/app/"]

RUN npm run build;

FROM nginx:1.25.1-alpine3.17 as package-stage

WORKDIR /usr/share/nginx/html/

COPY --from=build-stage /app/build/ .

COPY --from=build-stage /app/.nginx/default.conf /etc/nginx/conf.d/default.conf

CMD ["nginx", "-g", "daemon off;"]
