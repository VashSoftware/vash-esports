FROM node:16 AS build
WORKDIR /app
COPY . .
RUN npm install
FROM nginx:alpine
COPY --from=build /app/build /usr/share/nginx/html
EXPOSE 80