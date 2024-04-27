# https://hub.docker.com/_/node/
FROM node:21.7.1-alpine3.19

ENV TZ Asia/Singapore

# https://github.com/nodejs/docker-node/issues/740
USER node
WORKDIR /home/node

COPY package.json package-lock.json ./
RUN npm ci

COPY . .
RUN npm run build

ENTRYPOINT [ "npm", "start" ]
# CMD npm start
