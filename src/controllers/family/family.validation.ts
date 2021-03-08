import { NextFunction, Request, Response } from 'express';
import Joi from 'joi';
import createError from 'http-errors';

/**
 * POST /families
 * Validates data for above API.
 * @param request
 * @param response
 * @param next
 */
// eslint-disable-next-line import/prefer-default-export
export const validateForCreateFamily = async (
  request: Request,
  response: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const validationSchema = Joi.object({
      name: Joi.string().required().max(255),
      status: Joi.string().required().valid('LEFT', 'ACTIVE'),
      sourceOfIncome: Joi.string().required().max(255),
      membersList: Joi.array()
        .required()
        .items({
          name: Joi.string().required().max(255),
          email: Joi.string().email(),
          mobile: Joi.string().max(20),
          birthDay: Joi.date().required(),
        }),
    }).options({ abortEarly: false });

    const requestBody: {
      name?: string;
      status: 'LEFT' | 'ACTIVE';
      sourceOfIncome: string;
      membersList: {
        name: string;
        email?: string;
        mobile?: string;
        birthDay: Date;
      }[];
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
