import { Family, Room } from '@models/index';
import createError from 'http-errors';
import sequelizeInstance from '../../database/connection';

/**
 * Assigns room to a new family OR update the room for an existing family.
 * @param familyId
 * @param roomId
 */
export const assignRoom = async (
  familyId: number,
  roomId: number
): Promise<void> => {
  const family = await Family.findByPk(familyId, {
    include: { association: 'room', required: false },
  });
  if (family === null) throw new createError.NotFound('Family not found.');
  const currentRoom = family.room!;

  const newRoom = await Room.findByPk(roomId);
  if (newRoom === null) throw new createError.NotFound('Room not found.');

  if (newRoom.status === 'OCCUPIED')
    throw new createError.BadRequest('Room already occupied.');

  const transaction = await sequelizeInstance.transaction();
  try {
    currentRoom.status = 'EMPTY';
    await currentRoom.save({ transaction });

    await family.setRoom(newRoom);

    newRoom.status = 'OCCUPIED';
    await newRoom.save({ transaction });

    transaction.commit();
  } catch (error) {
    transaction.rollback();
    throw error;
  }
};

/**
 * Fetches the Room with given id along with the information about the room they
 * are using and the family members.
 * @param familyId
 */
export const fetchFamily = async (familyId: number): Promise<void | Family> => {
  const family = await Family.findByPk(familyId, {
    include: ['members', 'rooms'],
  });

  if (family === null) throw new createError.NotFound('Room not found.');
  return family;
};

export default { assignRoom, fetchFamily };
