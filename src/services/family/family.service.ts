import sequelize from '@root/database';
import { Family } from '@root/database/models/family.model';
import { Room } from '@root/database/models/room.model';
import createError from 'http-errors';

// parameter for createFamily function.
type CreateFamilyParameter = {
  name: string;
  status: 'ACTIVE' | 'LEFT';
  sourceOfIncome: string;
  membersList: {
    name: string;
    email?: string;
    mobile?: string;
    birthDay: Date;
  }[];
};

/**
 * Creates new family along with the family members.
 * @param familyAttributes
 */
export const createFamily = async (familyAttributes: CreateFamilyParameter) => {
  const { name, status, sourceOfIncome, membersList } = familyAttributes;

  const family = await Family.create(
    { name, status, sourceOfIncome, members: membersList },
    { include: 'members' }
  );

  return family;
};

/**
 * Assigns room to a new family OR update the room for an existing family.
 * @param familyId
 * @param roomId
 */
export const assignRoom = async (
  familyId: number,
  roomId: number
): Promise<void> => {
  const family = await Family.findByPk(familyId, { include: 'rooms' });
  if (family === null) {
    throw new createError.NotFound('Family with the given id does not exist.');
  }

  const room = await Room.findByPk(roomId, { include: 'families' });
  if (room === null) {
    throw new createError.NotFound('Room with the given id does not exist.');
  }

  if (room.families.length > 0) {
    throw new createError.BadRequest('Room already occupied.');
  }

  const transaction = await sequelize.transaction();
  try {
    if (family.rooms.length > 0) {
      const oldRoom = family.rooms[0];
      oldRoom.update({ status: Room.STATUS.EMPTY });
      await family.$remove('rooms', family.rooms[0], { transaction });
    }

    await family.$add('rooms', room, { transaction });
    room.update({ status: Room.STATUS.OCCUPIED });

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

  if (family === null) {
    throw new createError.NotFound('Room with the given id does not exist.');
  }

  return family;
};

export default { createFamily, assignRoom, fetchFamily };
