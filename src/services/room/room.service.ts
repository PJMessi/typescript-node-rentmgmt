import { Room } from '@models/room.model';

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
 * Fetches all the rooms.
 */
export const fetchAllRooms = async (): Promise<Room[]> => {
  const rooms = await Room.findAll();
  return rooms;
};

export default { createRoom, fetchAllRooms };
