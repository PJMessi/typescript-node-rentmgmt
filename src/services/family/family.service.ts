import { Family, Room } from '@models/index';
import createError from 'http-errors';
import sequelizeInstance from '../../database/connection';

/** Changes the room for the given family. */
export const changeRoom = async (
  familyId: number,
  roomId: number
): Promise<Family> => {
  const family = await Family.findByPk(familyId, {
    include: { association: 'room', required: false },
  });

  if (family === null) throw new createError.NotFound('Family not found.');
  if (family.roomId === roomId)
    throw new createError.BadRequest('Family already assigned the room.');

  const newRoom = await Room.findByPk(roomId);
  if (newRoom === null) throw new createError.NotFound('Room not found.');
  if (newRoom.status === 'OCCUPIED')
    throw new createError.BadRequest('Room already occupied.');

  const transaction = await sequelizeInstance.transaction();
  try {
    const currentRoom = family.room!;
    await currentRoom.update({ status: 'EMPTY' }, { transaction });

    await newRoom.update({ status: 'OCCUPIED' }, { transaction });
    await family.update({ roomId: newRoom.id }, { transaction });

    await transaction.commit();
  } catch (error) {
    await transaction.rollback();
    throw error;
  }

  await family.reload({ include: ['room', 'histories', 'members'] });

  return family;
};

/** Fetches the room of the family, members and history. */
export const fetchFamily = async (familyId: number): Promise<Family> => {
  const family = await Family.findByPk(familyId, {
    include: ['members', 'room', 'histories'],
  });

  if (family === null) throw new createError.NotFound('Family not found.');
  return family;
};

export default { changeRoom, fetchFamily };
