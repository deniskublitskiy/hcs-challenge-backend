FROM node:8.11.2-alpine

WORKDIR /usr/src/app

COPY package*.json ./

COPY ./src ./src
COPY ./seeds ./seeds
COPY ./.env.example ./

# node-gyp fix
# https://github.com/mhart/alpine-node/issues/47

# --no-cache: download package index on-the-fly, no need to cleanup afterwards
# --virtual: bundle packages, remove whole bundle at once, when done

RUN apk --no-cache --virtual build-dependencies add \
    python \
    make \
    g++ \
    && npm install \
    && apk del build-dependencies

RUN npm install --production -q
RUN npm cache clean --force --loglevel error

CMD npm start