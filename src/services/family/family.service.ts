import { Family } from '@models/index';
import createError from 'http-errors';

/** Fetches the room of the family, members and history. */
export const fetchFamily = async (familyId: number): Promise<Family> => {
  const family = await Family.findByPk(familyId, {
    include: ['members', 'room'],
  });

  if (family === null) throw new createError.NotFound('Family not found.');
  return family;
};

export default { fetchFamily };
