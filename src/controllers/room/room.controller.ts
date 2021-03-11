import { NextFunction, Request, Response } from 'express';
import roomService from '@services/room/room.service';

/**
 * POST /rooms
 * Creates new room.
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

/**
 * POST /rooms/:roomId/families
 * Adds new family to the room.
 */
export const addFamily = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void | Response> => {
  try {
    const familyId = parseInt(req.params.roomId, 10);
    const requestBody: {
      name: string;
      sourceOfIncome: string;
      membersList: {
        name: string;
        email?: string;
        mobile?: string;
        birthDay: Date;
      }[];
    } = req.body;

    const family = await roomService.addFamily({
      familyId,
      familyAttributes: requestBody,
    });

    return res.json({
      success: true,
      data: { family },
    });
  } catch (error) {
    return next(error);
  }
};
