# APP
FROM node:18-alpine as build-stage
WORKDIR /app

COPY client/package*.json .
RUN npm i
COPY client/ .

ARG REACT_APP_SERVER_URL
ENV REACT_APP_SERVER_URL=$REACT_APP_SERVER_URL
ENV ESLINT_NO_DEV_ERRORS=true
ENV DISABLE_ESLINT_PLUGIN=true

RUN npm run build


# CLIENT STATIC FILES
FROM node:18-alpine as integration-stage
WORKDIR /app

COPY server/package*.json ./
RUN npm i --omit=dev
COPY server/ .

COPY --from=build-stage /app/build /app/public
CMD ["npm", "run", "deploy"]