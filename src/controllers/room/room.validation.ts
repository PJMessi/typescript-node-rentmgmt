import { NextFunction, Request, Response } from 'express';
import Joi from 'joi';
import createError from 'http-errors';

/**
 * POST /room
 * Validates data for above API.
 * @param request
 * @param response
 * @param next
 */
// eslint-disable-next-line import/prefer-default-export
export const validateForCreateRoom = async (
  request: Request,
  response: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const validationSchema = Joi.object({
      name: Joi.string().required().max(255),
      description: Joi.string().max(255),
    }).options({ abortEarly: false });

    const requestBody: {
      name?: string;
      string?: string;
      description?: string;
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
