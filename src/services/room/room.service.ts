import { Family, Room, RoomFamilyHistory } from '@models/index';
import createError from 'http-errors';
import sequelizeInstance from '@root/database/connection';

/**
 * Creates new room from the given attributes.
 * @param roomAttributes
 */
export const createRoom = async (roomAttributes: {
  name: string;
  description?: string;
  price: number;
}): Promise<Room> => {
  const room = await Room.create({ ...roomAttributes, status: 'EMPTY' });
  return room;
};

/**
 * Fetches all the rooms with the current family if any.
 */
export const fetchAllRooms = async (): Promise<Room[]> => {
  const rooms = await Room.findAll({
    include: { association: 'family', required: false },
  });
  return rooms;
};

/**
 * Fetches the room with the given id along with the room history.
 * @param roomId
 */
export const fetchRoom = async (roomId: number): Promise<Room> => {
  const room = await Room.findByPk(roomId, {
    include: { association: 'family', required: false },
  });

  if (room === null) throw new createError.NotFound('Room not found.');
  return room;
};

// parameter for addFamily().
type AddFamilyParameters = {
  name: string;
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
export const addFamily = async (
  familyId: number,
  familyAttributes: AddFamilyParameters
) => {
  const room = await Room.findByPk(familyId);
  if (room === null) throw new createError.NotFound('Room not found.');
  if (room.status === 'OCCUPIED')
    throw new createError.BadRequest('Room already occupied.');

  const transaction = await sequelizeInstance.transaction();
  try {
    const { name, sourceOfIncome, membersList } = familyAttributes;

    // creating family and members and relating it to the room..
    const family = await Family.create(
      {
        name,
        status: 'ACTIVE',
        sourceOfIncome,
        members: membersList,
        roomId: room.id,
        history: [
          {
            roomId: room.id,
            amount: room.price,
          },
        ],
      },
      { include: ['members', 'history'], transaction }
    );

    // updating room status.
    room.status = 'OCCUPIED';
    await room.save({ transaction });

    // updating history.
    await RoomFamilyHistory.create(
      {
        roomId: room.id,
        familyId: family.id,
        amount: room.price,
      },
      { transaction }
    );

    await transaction.commit();
    return family;
  } catch (error) {
    await transaction.rollback();
    throw error;
  }
};

export default { createRoom, fetchAllRooms, fetchRoom, addFamily };
