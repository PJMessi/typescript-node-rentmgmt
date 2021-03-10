import db from '@models/index';
import Family from '@root/database/models/family.model';
import Room from '@root/database/models/room.model';
import createError from 'http-errors';
import sequelizeInstance from '../../database/connection';

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

  const family = await db.Family.create(
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
  const family = await db.Family.findByPk(familyId, {
    include: {
      association: 'rooms',
      required: false,
    },
  });
  if (family === null) {
    throw new createError.NotFound('Family not found.');
  }

  const room = await db.Room.findByPk(roomId);
  if (room === null) {
    throw new createError.NotFound('Room not found.');
  }

  if (room.status === 'OCCUPIED') {
    throw new createError.BadRequest('Room already occupied.');
  }

  const transaction = await sequelizeInstance.transaction();
  try {
    if (family.rooms && family.rooms.length > 0) {
      const oldRoom: Room = family.rooms[0];

      oldRoom.status = 'EMPTY';
      await oldRoom.save({ transaction });

      await oldRoom.removeFamily(family, { transaction });
    }

    await room.addFamily(family, { transaction });

    room.status = 'OCCUPIED';
    await room.save({ transaction });

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
  const family = await db.Family.findByPk(familyId, {
    include: ['members', 'rooms'],
  });

  if (family === null) {
    throw new createError.NotFound('Room with the given id does not exist.');
  }

  return family;
};

export default { createFamily, assignRoom, fetchFamily };
