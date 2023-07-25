FROM node:18-alpine as build-stage
WORKDIR /app

COPY client/package*.json .
RUN npm i
COPY client/ .

ARG REACT_APP_SERVER_URL
ENV REACT_APP_SERVER_URL=$REACT_APP_SERVER_URL

RUN npm run build


FROM node:18-alpine
WORKDIR /app

COPY server/package*.json ./
RUN npm i --omit=dev
COPY server/ .

ARG BASE_PATH
ENV BASE_PATH=$BASE_PATH

COPY --from=build-stage /app/build /app/public
CMD ["npm", "run", "deploy"]
#RUN ln -s client/build front