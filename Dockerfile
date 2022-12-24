FROM node:16-alpine

# Environment variables
ENV NODE_ENV production

# Create Directory for the Container
WORKDIR /usr/src/app

# Install nad build
COPY package*.json .
RUN npm ci --also=dev

# Build app
ADD . /usr/src/app
RUN find . -name "*.spec.ts" -type f -delete
RUN rm -r test
RUN npm run build:prod

# Expose app
EXPOSE 3002
CMD npm run start:prod
