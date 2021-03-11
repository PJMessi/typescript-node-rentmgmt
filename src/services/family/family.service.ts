import { Family, Room } from '@models/index';
import createError from 'http-errors';
import { Transaction } from 'sequelize/types';
import sequelizeInstance from '../../database/connection';

// parameter for createFamily().
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
 * Removes the family from their room, if they had the room to begin with.
 * @param family
 * @param transaction
 */
const removeFamilyFromTheirRoom = async (
  family: Family,
  transaction: Transaction
): Promise<void> => {
  let rooms: Room[];
  if (family.rooms) rooms = family.rooms;
  else rooms = await family.getRooms();

  const room = rooms[0];
  if (room) {
    await family.removeRoom(room, { transaction });

    room.status = 'EMPTY';
    await room.save({ transaction });
  }
};

/**
 * Assigns the family to the room.
 * @param family
 * @param room
 * @param transaction
 */
const assignFamilyToRoom = async (
  family: Family,
  room: Room,
  transaction: Transaction
): Promise<void> => {
  await family.addRoom(room, { transaction });

  // eslint-disable-next-line no-param-reassign
  room.status = 'OCCUPIED';
  room.save({ transaction });
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
  const family = await Family.findByPk(familyId, {
    include: { association: 'rooms', required: false },
  });
  if (family === null) throw new createError.NotFound('Family not found.');

  const room = await Room.findByPk(roomId);
  if (room === null) throw new createError.NotFound('Room not found.');

  if (room.status === 'OCCUPIED')
    throw new createError.BadRequest('Room already occupied.');

  const transaction = await sequelizeInstance.transaction();
  try {
    await removeFamilyFromTheirRoom(family, transaction);
    await assignFamilyToRoom(family, room, transaction);
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

export default { createFamily, assignRoom, fetchFamily };
