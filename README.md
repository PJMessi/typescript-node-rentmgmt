# Rent Management Application APIs
Application that tracks the renting rooms, rentees, payments, etc for landlords/houseowners. **Node JS** is used for the backend and **MySQL** is used for storing data. **React** is used in the frontend.

## Links
[Frontend Respository](https://github.com/PJMessi/typescript-react-rentmgmt)

## About
Helps house owners keeps track of rentees renting their rooms and the payments thats done or that needs to be done. Sends emails to the rentees to remind them about the rent 
payments through CRON. Keeps logs of all the CRON jobs and any unexpected errors in daily log files.  

## Tools used
1. **Backend** : Node Js, Express
2. **Database** : MySQL using Sequelize ORM
3. **Typescript** 
4. **Frontend** : React
5. **Tests** : Mocha and Chai
6. **Email** : Nodemailer and Handlebars for template
7. **CRON** : node-cron used for CRON jobs
8. **Eslint** (airbnb) with **Prettier**
9. **Logging**: Wiston for daily logs.

## Commands
Rename .env.example to .env and fill up your credentials.
For test, rename .env.test.example to .env.test and fill up you credentials for tests.

1. `yarn lint`: To verify the application is linted.
2. `yarn watch`: To run the express server and watch for changes.
3. `yarn build`: To compile the project.
4. `yarn start`: To start the compiled project.
5. `yarn test`: To run tests.