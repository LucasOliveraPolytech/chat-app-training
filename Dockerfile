FROM node:current-slim

WORKDIR /usr/src/app

COPY . . 

RUN npm install
