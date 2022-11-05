# EmailService
Service for handling emails sending

## Technologies used
* Node 16
* Typescript
* TypeORM
* ClassValidator
* Mocha + Sinon + Chai
* SuperTest
* ESLint
* Config
* Winston
* Nodemon
* TSNode
* NPM
* Nodemailer

## Prerequisites
* Installed Node 16
* Installed NPM

## Setup
1. Install Node 16
2. Go to package.json and install dependencies `npm i`
3. Configuration

    Configuration (server, mail etc.) uses default values and they can be
    changed using environment variables (check `config/default.js` file)
4. Go to docker compose file and run images used for local development
   * Run all images: `docker compose up -d`
   * Run specified images: `docker compose up nodemailer -d`
5. Run unit tests
   * Linux/Mac: `npm run test:unit`
   * Windows: `npm run test:unit:windows`
6. Run API tests
    * Linux/Mac: `npm run test:api`
    * Windows: `npm run test:api:windows`
7. Run integration tests (they require local environment images started with Docker)
    * Linux/Mac: `npm run test:integration`
    * Windows: `npm run test:integration:windows`
8. Start local server
    * Linux/Mac: `npm run start:dev`
    * Windows: `npm run start:dev:windows`
