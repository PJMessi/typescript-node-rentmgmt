import winston from 'winston';
import DailyRotateFile from 'winston-daily-rotate-file';

// Log format.
const logFormat = winston.format.combine(
  winston.format.prettyPrint(),
  winston.format.timestamp({ format: 'YYYY-MM-DD HH:mm:ss' }),
  winston.format.align(),
  winston.format.printf((info) => {
    let formattedMessage: string;
    if (info instanceof Error) {
      formattedMessage = `${info.timestamp} ${info.level}: ${info.stack}`;
    } else {
      formattedMessage = `${info.timestamp} ${
        info.level
      }: ${info.message.trim()}`;
    }
    return formattedMessage;
  })
);

// setting up daily logs.
const logger = winston.createLogger({
  level: 'info',
  format: logFormat,
  transports: [
    new DailyRotateFile({
      filename: './logs/express-%DATE%.log',
      datePattern: 'YYYY-MM-DD',
    }),
  ],
});

// If not in production, logging in the console as well.
if (process.env.NODE_ENV !== 'production') {
  logger.add(new winston.transports.Console());
}

export default logger;
