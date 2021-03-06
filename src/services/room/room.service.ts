import { Room } from '@models/room.model';

/**
 * Creates new room from the given attributes.
 * @param roomAttributes
 */
export const createRoom = async (roomAttributes: {
  name: string;
  description?: string;
}): Promise<Room> => {
  const room = await Room.create({
    ...roomAttributes,
    status: Room.STATUS.EMPTY,
  });
  return room;
};

export default { createRoom };
