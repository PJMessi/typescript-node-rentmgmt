import { Family } from '@root/database/models/family.model';

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

  console.log(family.rooms);

  return family;
};

export default { createFamily };
