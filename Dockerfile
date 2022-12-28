## Stage 1 - Build
FROM node:16-alpine as builder

ENV NODE_ENV production
ENV SERVER_URL 0.0.0.0

WORKDIR /usr/src/app

# Install app dependencies
COPY package*.json ./
COPY tsconfig.json ./
RUN npm ci
COPY . .
RUN npm run build:prod

## Stage 2 - Run
FROM node:16-alpine

ENV NODE_ENV production
ENV SERVER_URL 0.0.0.0

WORKDIR /usr/src/app

# Install service production dependencies
COPY package*.json ./
COPY config ./config
RUN npm ci --production
COPY --from=builder /usr/src/app/build ./build

# Start service
EXPOSE 3002
CMD [ "npm", "run", "start:prod" ]
