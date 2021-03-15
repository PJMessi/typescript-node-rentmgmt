import { Family, Room } from '@models/index';
import createError from 'http-errors';
import sequelizeInstance from '@root/database/connection';

/** Creates new room from the given attributes. */
export const createRoom = async (
  roomAttributes: CreateRoomParameters
): Promise<Room> => {
  const room = await Room.create({ ...roomAttributes, status: 'EMPTY' });
  return room;
};

/** Fetches all the rooms with the current family if any. */
export const fetchAllRooms = async (): Promise<Room[]> => {
  const rooms = await Room.findAll({
    include: { association: 'family', required: false },
  });
  return rooms;
};

/** Fetches the room with the given id along with the room history. */
export const fetchRoom = async (roomId: number): Promise<Room> => {
  const room = await Room.findByPk(roomId, {
    include: [
      {
        association: 'family',
        include: ['members'],
      },
      {
        association: 'histories',
        attributes: {
          include: ['deletedAt'],
        },
        paranoid: false,
        include: [{ association: 'family', paranoid: false }],
      },
    ],
  });

  if (room === null) throw new createError.NotFound('Room not found.');
  return room;
};

/** Creates new family along with the family members. */
export const addFamily = async (parameters: AddFamilyParameters) => {
  const { familyId, familyAttributes } = parameters;

  const room = await Room.findByPk(familyId);
  if (room === null) throw new createError.NotFound('Room not found.');

  if (room.status === 'OCCUPIED')
    throw new createError.BadRequest('Room already occupied.');

  const transaction = await sequelizeInstance.transaction();
  try {
    const { name, sourceOfIncome, membersList } = familyAttributes;

    const family = await Family.create(
      {
        name,
        status: 'ACTIVE',
        sourceOfIncome,
        members: membersList,
        roomId: room.id,
        histories: [
          {
            roomId: room.id,
            amount: room.price,
          },
        ],
      },
      { include: ['members', 'histories'], transaction }
    );

    await room.update({ status: 'OCCUPIED' });

    await transaction.commit();

    return family;
  } catch (error) {
    await transaction.rollback();
    throw error;
  }
};

export default { createRoom, fetchAllRooms, fetchRoom, addFamily };

type CreateRoomParameters = {
  name: string;
  description?: string;
  price: number;
};

type AddFamilyParameters = {
  familyId: number;
  familyAttributes: {
    name: string;
    sourceOfIncome: string;
    membersList: {
      name: string;
      email?: string;
      mobile?: string;
      birthDay: Date;
    }[];
  };
};
