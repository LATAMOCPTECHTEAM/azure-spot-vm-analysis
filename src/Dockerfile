FROM node:14.15.0-alpine3.10

WORKDIR /app

COPY package.json package.json
COPY package-lock.json package-lock.json

RUN npm install

COPY . .

ENTRYPOINT ["node", "index.js","analyze"]
