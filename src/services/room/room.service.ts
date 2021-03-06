import Room from '@models/room/room.model';
import { IRoomDocument } from '@root/database/models/room/room.types';

/**
 * Creates new room from the given attributes.
 * @param roomAttributes
 */
export const createRoom = async (roomAttributes: {
  name: string;
  description?: string;
}): Promise<IRoomDocument> => {
  const room = await Room.create({
    ...roomAttributes,
    status: Room.STATUS.EMPTY,
  });
  return room;
};

export default { createRoom };
