import { Room } from '@models/room.model';
import createError from 'http-errors';

/**
 * Creates new room from the given attributes.
 * @param roomAttributes
 */
export const createRoom = async (roomAttributes: {
  name: string;
  description?: string;
  price: number;
}): Promise<Room> => {
  const room = await Room.create({
    ...roomAttributes,
    status: Room.STATUS.EMPTY,
  });
  return room;
};

/**
 * Fetches all the rooms with the current family if any.
 */
export const fetchAllRooms = async (): Promise<Room[]> => {
  const rooms = await Room.findAll({ include: 'families' });
  return rooms;
};

/**
 * Fetches the room with the given id along with the room history.
 * @param roomId
 */
export const fetchRoom = async (roomId: number): Promise<Room> => {
  const room = await Room.findByPk(roomId, {
    include: ['families'],
  });

  if (room === null) {
    throw new createError.NotFound('Room with the given id does not exist.');
  }

  return room;
};

export default { createRoom, fetchAllRooms, fetchRoom };
