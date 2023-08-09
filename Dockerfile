# APP
FROM node:18-alpine as build-stage
WORKDIR /app

COPY client/package*.json .
RUN npm i
COPY client/ .

ARG REACT_APP_SERVER_URL
ENV REACT_APP_SERVER_URL=$REACT_APP_SERVER_URL
ARG ESLINT_NO_DEV_ERRORS
ENV ESLINT_NO_DEV_ERRORS=$ESLINT_NO_DEV_ERRORS
ARG DISABLE_ESLINT_PLUGIN
ENV DISABLE_ESLINT_PLUGIN=$DISABLE_ESLINT_PLUGIN

RUN npm run build


# CLIENT STATIC FILES
FROM node:18-alpine as integration-stage
WORKDIR /app

COPY server/package*.json ./
RUN npm i --omit=dev
COPY server/ .

COPY --from=build-stage /app/build /app/public
CMD ["npm", "run", "deploy"]