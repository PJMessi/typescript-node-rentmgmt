import { Sequelize, SequelizeOptions } from 'sequelize-typescript';

const DB_URL = process.env.DB_URL || '';

const sequelizeOptions: SequelizeOptions = {
  dialectOptions: {
    charset: 'utf8',
    multipleStatements: true,
  },
  logging: false,
  models: [`${__dirname}/models`],
  modelMatch: (filename, member) => {
    return (
      filename.substring(0, filename.indexOf('.model')) === member.toLowerCase()
    );
  },
};

const sequelize: Sequelize = new Sequelize(DB_URL, sequelizeOptions);

export default sequelize;
