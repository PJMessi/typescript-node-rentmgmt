import { NextFunction, Request, Response } from 'express';
import Joi from 'joi';
import createError from 'http-errors';

/**
 * PUT /invoices/:invoiceId/status
 * Validates data for above API.
 */
// eslint-disable-next-line import/prefer-default-export
export const validateForUpdateInvoiceStatus = async (
  request: Request,
  response: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const validationSchema = Joi.object({
      status: Joi.string().required().valid('PENDING', 'STATUS'),
    }).options({ abortEarly: false });

    const requestBody: {
      status?: string;
    } = request.body;

    await validationSchema
      .validateAsync(requestBody)
      .catch((validationErrors) => {
        throw new createError.UnprocessableEntity(validationErrors);
      });

    return next();
  } catch (error) {
    return next(error);
  }
};
