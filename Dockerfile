FROM node:20.5.0-alpine as builder
WORKDIR /app 
COPY  package.json .
RUN npm install --force
COPY . .
RUN npm run build


FROM nginx:alpine
RUN rm /etc/nginx/conf.d/default.conf
COPY nginx.conf /etc/nginx/conf.d
COPY --from=builder /app/build /usr/share/nginx/html

