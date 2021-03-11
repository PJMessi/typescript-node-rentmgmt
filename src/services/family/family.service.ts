import { Family, Room, RoomFamilyHistory } from '@models/index';
import createError from 'http-errors';
import { Transaction } from 'sequelize/types';
import sequelizeInstance from '../../database/connection';

/** Detaches the family from their room, updates the room status, deletes history. */
export const removeCurrentRoom = async (
  family: Family,
  transaction: Transaction
): Promise<void> => {
  let currentRoom = family.room;

  if (!currentRoom) currentRoom = await family.getRoom()!;

  await currentRoom.update({ status: 'EMPTY' }, { transaction });

  await RoomFamilyHistory.destroy({
    where: { roomId: currentRoom.id, familyId: family.id },
    transaction,
  });
};

/** Attaches the room to the family, updates the room status, creates history. */
export const assignRoomToFamily = async (
  family: Family,
  room: Room,
  transaction: Transaction
): Promise<Family | void> => {
  if (room.status === 'OCCUPIED')
    throw new createError.BadRequest('Room already occupied.');

  await room.update({ status: 'OCCUPIED' }, { transaction });

  await family.update({ roomId: room.id }, { transaction });

  await RoomFamilyHistory.create(
    {
      roomId: room.id,
      familyId: family.id,
      amount: room.id,
    },
    { transaction }
  );

  return family;
};

/** Changes the room for the given family. */
export const changeRoom = async (
  familyId: number,
  roomId: number
): Promise<Family | void> => {
  const family = await Family.findByPk(familyId, {
    include: { association: 'room', required: false },
  });

  if (family === null) throw new createError.NotFound('Family not found.');

  if (family.roomId === roomId)
    throw new createError.BadRequest('Family already assigned the room.');

  const newRoom = await Room.findByPk(roomId);
  if (newRoom === null) throw new createError.NotFound('Room not found.');

  const transaction = await sequelizeInstance.transaction();
  try {
    await removeCurrentRoom(family, transaction);
    await assignRoomToFamily(family, newRoom, transaction);

    await transaction.commit();
  } catch (error) {
    await transaction.rollback();
    throw error;
  }

  await family.reload({ include: ['room', 'histories', 'members'] });

  return family;
};

/** Fetches the room of the family, members and history. */
export const fetchFamily = async (familyId: number): Promise<void | Family> => {
  const family = await Family.findByPk(familyId, {
    include: ['members', 'room', 'histories'],
  });

  if (family === null) throw new createError.NotFound('Room not found.');
  return family;
};

export default { changeRoom, fetchFamily };
