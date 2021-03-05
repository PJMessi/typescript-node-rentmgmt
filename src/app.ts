import 'module-alias/register';
import express from 'express';
import errorMiddleware from '@middlewares/errorMiddleware';
import logger from '@helpers/logging/loggingHelper';
import dotenv from 'dotenv';
import mongoose from 'mongoose';
import routes from './routes/route';

dotenv.config();

const app = express();

app.use(express.json());
app.use(routes);
app.use(errorMiddleware);

const PORT = 5000;
app.listen(PORT, () => {
  logger.info(`Server started at port: ${PORT}`);
  const DB_URL = process.env.DB_URL || '';
  mongoose
    .connect(DB_URL, { useNewUrlParser: true, useUnifiedTopology: true })
    .then(() => {
      logger.info(`Connected to mongodb: ${DB_URL}`);
    })
    .catch((error) => {
      logger.error(`Could not connect to mongodb: ${DB_URL} \n ${error}`);
    });
});
