import Mongoose from 'mongoose';
import logger from '@helpers/logging/logging.helper';

let database: Mongoose.Connection;

export const connectDatabase = (): void => {
  const uri = process.env.DB_URL || '';
  if (database) return;

  Mongoose.connect(uri, {
    useNewUrlParser: true,
    useFindAndModify: true,
    useUnifiedTopology: true,
    useCreateIndex: true,
  });

  database = Mongoose.connection;
  database.once('open', async () => {
    logger.info(`Connected to Mongo DB.`);
  });
  database.on('error', (error) => {
    logger.info(`Could not connect to Mongo DB.\n${error}`);
  });
};

export const disconnectDatabase = (): void => {
  if (!database) return;
  Mongoose.disconnect();
};
