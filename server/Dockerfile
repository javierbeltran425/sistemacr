FROM node:current-alpine
WORKDIR /server
COPY package.json ./
COPY ./ ./
RUN npm i
CMD ["npm", "run", "start"]
