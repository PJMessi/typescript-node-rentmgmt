import { NextFunction, Request, Response } from 'express';
import familyService from '@services/family/family.service';

/**
 * POST /families
 * Creates new family with members.
 * @param req
 * @param res
 * @param next
 */
export const createFamily = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void | Response> => {
  try {
    const requestBody: {
      name: string;
      status: 'LEFT' | 'ACTIVE';
      sourceOfIncome: string;
      membersList: {
        name: string;
        email?: string;
        mobile?: string;
        birthDay: Date;
      }[];
    } = req.body;

    const family = await familyService.createFamily(requestBody);

    return res.json({
      success: true,
      data: { family },
    });
  } catch (error) {
    return next(error);
  }
};

/**
 * POST /families/:familyId/rooms/:roomId
 * Assigns room to a family.
 * @param req
 * @param res
 * @param next
 */
export const assignRoom = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void | Response> => {
  try {
    const { roomId, familyId } = req.params;

    await familyService.assignRoom(
      parseInt(familyId, 10),
      parseInt(roomId, 10)
    );

    return res.json({
      status: true,
    });
  } catch (error) {
    return next(error);
  }
};
