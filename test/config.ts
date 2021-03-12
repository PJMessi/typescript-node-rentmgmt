/* eslint-disable import/first */
import dotenv from 'dotenv';
import path from 'path';

dotenv.config({
  path: path.resolve(__dirname, '../.env.test'),
});
import 'module-alias/register';
import sequelizeInstance from '../src/database/connection';

before(async () => {
  await sequelizeInstance.sync();
});

afterEach(async () => {
  await sequelizeInstance.truncate();
});
