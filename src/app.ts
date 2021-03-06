/* eslint-disable import/first */
import 'module-alias/register';
// eslint-disable-next-line import/newline-after-import
import dotenv from 'dotenv';
dotenv.config();
import express from 'express';
import errorMiddleware from '@root/middlewares/error.middleware';
import logger from '@root/helpers/logging/logging.helper';
import path from 'path';
import '@root/crons/generateInvoice.cron';
import routes from './routes/route';
import '@root/customTypes';
import corsMiddleware from './middlewares/cors.middleware';

const app = express();

app.use(corsMiddleware);
app.use(express.static(path.join(__dirname, 'public')));
app.use(express.json());
app.use(routes);
app.use(errorMiddleware);

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  logger.info(`Server started at port: ${PORT}`);
});

export default app;
