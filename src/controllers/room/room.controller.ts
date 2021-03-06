import { NextFunction, Request, Response } from 'express';
import roomService from '@services/room/room.service';

/**
 * POST /rooms
 * Creates new room.
 * @param req
 * @param res
 * @param next
 */
// eslint-disable-next-line import/prefer-default-export
export const createRoom = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void | Response> => {
  try {
    const reqBody: {
      name: string;
      description?: string;
    } = req.body;

    const room = await roomService.createRoom(reqBody);

    return res.json({
      status: true,
      data: { room },
    });
  } catch (error) {
    return next(error);
  }
};
