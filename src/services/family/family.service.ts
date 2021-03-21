import { Family } from '@models/index';
import createError from 'http-errors';

/** Fetches the family along with the members, room and invoices information. */
export const fetchFamily = async (familyId: number): Promise<Family> => {
  const family = await Family.findByPk(familyId, {
    include: ['members', 'room', 'invoices'],
  });

  if (family === null) throw new createError.NotFound('Family not found.');
  return family;
};

export default { fetchFamily };
