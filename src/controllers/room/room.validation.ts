import { NextFunction, Request, Response } from 'express';
import Joi from 'joi';
import createError from 'http-errors';

export default {
  /**
   * Validates request data for the API.
   * @route POST /rooms
   */
  validateForCreateRoom: async (
    request: Request,
    _: Response,
    next: NextFunction
  ): Promise<void> => {
    try {
      const validationSchema = Joi.object({
        name: Joi.string().required().max(255),
        description: Joi.string().max(255),
        price: Joi.number().required().min(1).max(999999.99),
      }).options({ abortEarly: false });

      const requestBody: {
        name?: string;
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
  },

  /**
   * Validates request data for the API.
   * @route POST /rooms/:roomId/family
   */
  validateForAddFamily: async (
    request: Request,
    response: Response,
    next: NextFunction
  ): Promise<void> => {
    try {
      const validationSchema = Joi.object({
        name: Joi.string().required().max(255),
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
  },
};
