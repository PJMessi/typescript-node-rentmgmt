import 'module-alias/register';
import express from 'express';
import errorMiddleware from '@root/middlewares/error.middleware';
import logger from '@root/helpers/logging/logging.helper';
import dotenv from 'dotenv';
import routes from './routes/route';
import { connectDatabase } from './database/index';

dotenv.config();

const app = express();

app.use(express.json());
app.use(routes);
app.use(errorMiddleware);

connectDatabase();

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  logger.info(`Server started at port: ${PORT}`);
});
