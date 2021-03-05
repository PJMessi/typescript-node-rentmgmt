import { NextFunction, Request, Response } from 'express';
import logger from '@helpers/logging/loggingHelper';

export default (
  error: any,
  request: Request,
  response: Response,
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  next: NextFunction
) => {
  const status = error.status || 500;

  // for server errors, logs the error and then returns it.
  if (status === 500) {
    const errorMessage = { success: false, message: error.message };
    logger.error(error);
    return response.status(500).json(errorMessage);
  }

  // for validation error, includes the error fields.
  if (status === 422) {
    return response.status(status).json({
      success: false,
      message: 'The given data was invalid.',
      errors: error.message,
    });
  }

  return response
    .status(status)
    .json({ success: false, message: error.message });
};
