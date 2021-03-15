/* eslint-disable import/first */
import 'module-alias/register';
// eslint-disable-next-line import/newline-after-import
import dotenv from 'dotenv';
dotenv.config();
import express from 'express';
import errorMiddleware from '@root/middlewares/error.middleware';
import logger from '@root/helpers/logging/logging.helper';
import path from 'path';
import routes from './routes/route';
import { User } from './database/models';

declare global {
  namespace Express {
    interface Request {
      auth: { user?: User };
    }
  }
}

const app = express();

app.use(express.static(path.join(__dirname, 'public')));
app.use(express.json());
app.use(routes);
app.use(errorMiddleware);

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  logger.info(`Server started at port: ${PORT}`);
});

export default app;
