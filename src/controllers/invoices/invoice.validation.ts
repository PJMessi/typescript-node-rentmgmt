import { NextFunction, Request, Response } from 'express';
import Joi from 'joi';
import createError from 'http-errors';

export default {
  /**
   * Validates request data for the API.
   * @route PUT /invoices/:invoiceId/status
   */
  validateForUpdateInvoiceStatus: async (
    request: Request,
    _: Response,
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
  },
};
