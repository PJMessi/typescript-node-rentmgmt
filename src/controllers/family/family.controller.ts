import { NextFunction, Request, Response } from 'express';
import familyService from '@services/family/family.service';

/**
 * POST /families/:familyId/rooms/:roomId
 * Assigns room to a new family OR update the room for an existing family.
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

/**
 * POST /families/:familyId
 * Fetches the Room with given id along with the information about the room they
 * are using and the family members.
 * @param req
 * @param res
 * @param next
 */
export const fetchFamily = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void | Response> => {
  try {
    const { familyId } = req.params;
    const family = await familyService.fetchFamily(parseInt(familyId, 10));

    return res.json({
      status: true,
      data: { family },
    });
  } catch (error) {
    return next(error);
  }
};
