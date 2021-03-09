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
 * Creates new family and members.
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
 * Assigns room to the family.
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

  if (family.rooms.length > 0) {
    throw new createError.BadRequest('Family already assigned to a room.');
  }

  const room = await Room.findByPk(roomId, { include: 'families' });
  if (room === null) {
    throw new createError.NotFound('Room with the given id does not exist.');
  }

  if (room.families.length > 0) {
    throw new createError.BadRequest('Room already occupied.');
  }

  await family.$add('rooms', room);
};

export default { createFamily, assignRoom };
