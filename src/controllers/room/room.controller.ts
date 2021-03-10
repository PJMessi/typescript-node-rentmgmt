import { NextFunction, Request, Response } from 'express';
import roomService from '@services/room/room.service';

/**
 * POST /rooms
 * Creates new room.
 * @param req
 * @param res
 * @param next
 */
export const createRoom = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void | Response> => {
  try {
    const reqBody: {
      name: string;
      description?: string;
      price: number;
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

/**
 * GET /rooms
 * Fetches all the rooms with the current family if any.
 * @param req
 * @param res
 * @param next
 */
export const fetchAllRooms = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void | Response> => {
  try {
    const rooms = await roomService.fetchAllRooms();
    return res.json({
      status: true,
      data: { rooms },
    });
  } catch (error) {
    return next(error);
  }
};

/**
 * GET /rooms/:roomId
 * Fetches the room with the given id along with the room history.
 * @param req
 * @param res
 * @param next
 */
export const fetchRoom = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void | Response> => {
  try {
    const { roomId } = req.params;

    const room = await roomService.fetchRoom(parseInt(roomId, 10));

    return res.json({
      status: true,
      data: { room },
    });
  } catch (error) {
    return next(error);
  }
};
