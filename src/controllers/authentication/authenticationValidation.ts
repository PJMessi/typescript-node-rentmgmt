import { NextFunction, Request, Response } from 'express';
import Joi from 'joi';
import createError from 'http-errors';

/**
 * POST /auth/register
 * Validates data for above API.
 * @param request
 * @param response
 * @param next
 */
export const validateForLoginUser = async (
  request: Request,
  response: Response,
  next: NextFunction
) => {
  try {
    const validationSchema = Joi.object({
      email: Joi.string().required().email().max(255),
      password: Joi.string().required().min(5).max(255),
    }).options({ abortEarly: false });

    const requestBody: {
      email?: string;
      password?: string;
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

/**
 * POST /auth/login
 * Validates data for above API.
 * @param request
 * @param response
 * @param next
 */
export const validateForRegisterUser = async (
  request: Request,
  response: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const validationSchema = Joi.object({
      name: Joi.string().required().max(255),
      email: Joi.string().required().email(),
      password: Joi.string().required().min(5).max(255),
      passwordConfirmation: Joi.any()
        .equal(Joi.ref('password'))
        .required()
        .label('Password confirmation')
        .messages({ 'any.only': '{{#label}} does not match' }),
    }).options({ abortEarly: false });

    const requestBody: {
      name?: string;
      email?: string;
      password?: string;
      passwordConfirmation?: string;
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
