/* eslint-disable import/first */
import 'module-alias/register';
// eslint-disable-next-line import/newline-after-import
import dotenv from 'dotenv';
dotenv.config();
import express from 'express';
import errorMiddleware from '@root/middlewares/error.middleware';
import logger from '@root/helpers/logging/logging.helper';
import routes from './routes/route';
import sequelize from './database/index';
import { User } from './database/models/user.model';

declare global {
  namespace Express {
    interface Request {
      auth: { user?: User };
    }
  }
}

const app = express();

app.use(express.json());
app.use(routes);
app.use(errorMiddleware);

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  logger.info(`Server started at port: ${PORT}`);
  sequelize
    .authenticate()
    .then(() => {
      logger.info('Connected to MySql');
    })
    .catch((error) => {
      logger.info(`Could not connecte to MySql\n${error}`);
    });
});
