require('dotenv').config();

module.exports.development = {
  dialect: 'mysql',
  url: process.env.DB_URL,
};

module.exports.production = {
  dialect: 'mysql',
  url: process.env.DB_URL,
};

module.exports.test = {
  dialect: 'sqlite',
  url: 'sqlite::memory:',
};
