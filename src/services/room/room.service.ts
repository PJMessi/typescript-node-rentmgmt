import { Family, Room } from '@models/index';
import createError from 'http-errors';
import WelcomeEmail from '@root/email/welcomeEmail/welcomeEmail';
import sequelizeInstance from '@root/database/connection';
import logger from '@helpers/logging/logging.helper';

/** Creates new room from the given attributes. */
export const createRoom = async (
  roomAttributes: CreateRoomParameters
): Promise<Room> => {
  const defaultStatus: typeof Room.prototype.status = 'EMPTY';
  const room = await Room.create({ ...roomAttributes, status: defaultStatus });
  return room;
};

/** Fetches all the rooms along with the family (if any). */
export const fetchAllRooms = async (): Promise<Room[]> => {
  const rooms = await Room.findAll({
    include: { association: 'family', required: false },
  });
  return rooms;
};

/** Fetches the room along with the family and members information. */
export const fetchRoom = async (roomId: number): Promise<Room> => {
  const room = await Room.findByPk(roomId, {
    include: [
      {
        association: 'family',
        include: ['members'],
      },
    ],
  });

  if (room === null) throw new createError.NotFound('Room not found.');
  return room;
};

/** Sends welcome email to all the members of the given family. */
export const sendWelcomeEmailToFamily = async (family: Family) => {
  let { members } = family;

  if (!members) {
    members = await family.getMembers();
  }

  members.forEach((member) => {
    const welcomeEmail = new WelcomeEmail(member);
    if (member.email) {
      welcomeEmail.sendMail().catch((err) => {
        logger.error(`Error while sending welcome email.\n${err.stack}`);
      });
    }
  });
};

/** Addes the new family with members in the room and sends welcome emails. */
export const addFamily = async (
  parameters: AddFamilyParameters
): Promise<Family> => {
  const { familyId, familyAttributes } = parameters;

  const room = await Room.findByPk(familyId);
  if (room === null) throw new createError.NotFound('Room not found.');

  if (room.status === 'OCCUPIED')
    throw new createError.BadRequest('Room already occupied.');

  let family: Family;
  const transaction = await sequelizeInstance.transaction();
  try {
    const { name, sourceOfIncome, membersList } = familyAttributes;

    family = await Family.create(
      {
        name,
        status: 'ACTIVE',
        sourceOfIncome,
        roomId: room.id,
        amount: room.price,
        members: membersList,
      },
      { include: ['members'], transaction }
    );

    await room.update({ status: 'OCCUPIED' }, { transaction });
    await transaction.commit();
  } catch (error) {
    await transaction.rollback();
    throw error;
  }

  sendWelcomeEmailToFamily(family);
  return family;
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
