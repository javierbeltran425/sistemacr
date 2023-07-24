FROM node:current-alpine as build-stage
WORKDIR /client
COPY package.json ./
COPY ./ ./
RUN npm i

ARG REACT_APP_SERVER_URL
ENV REACT_APP_SERVER_URL=$REACT_APP_SERVER_URL

RUN npm run build

# NGINX
FROM nginx:alpine

COPY --from=build-stage /client/build /usr/share/nginx/html
EXPOSE $REACT_DOCKER_PORT

CMD nginx -g 'daemon off;'