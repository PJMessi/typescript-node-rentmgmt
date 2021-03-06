import { NextFunction, Request, Response } from 'express';
import logger from '@root/helpers/logging/logging.helper';

export default (
  error: any,
  req: Request,
  res: Response,
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  next: NextFunction
) => {
  const status = error.status || 500;

  // for server errors, logs the error and then returns it.
  if (status === 500) {
    const errorMessage = { success: false, message: error.message };
    logger.error(error);
    return res.status(500).json(errorMessage);
  }

  // for validation error, includes the error fields.
  if (status === 422) {
    return res.status(status).json({
      success: false,
      message: 'The given data was invalid.',
      errors: error.message,
    });
  }

  return res.status(status).json({ success: false, message: error.message });
};
