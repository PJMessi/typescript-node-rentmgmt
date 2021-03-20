import User from './user.model';
import Family from './family.model';
import Member from './member.model';
import Room from './room.model';
import Invoice from './invoice.model';

// Relation between Member and family.
Family.hasMany(Member, {
  sourceKey: 'id',
  foreignKey: 'familyId',
  as: 'members',
});

Member.belongsTo(Family, {
  targetKey: 'id',
  foreignKey: 'familyId',
  as: 'family', // ?
});

// Relation between Room and Family.
Room.hasOne(Family, {
  sourceKey: 'id',
  foreignKey: 'roomId',
  as: 'family',
});

Family.belongsTo(Room, {
  targetKey: 'id',
  foreignKey: 'roomId',
  as: 'room',
});

// Relation between Family and Invoice.
Family.hasMany(Invoice, {
  sourceKey: 'id',
  foreignKey: 'familyId',
  as: 'invoices',
});

Invoice.belongsTo(Family, {
  targetKey: 'id',
  foreignKey: 'familyId',
  as: 'family',
});

export { User };
export { Family };
export { Member };
export { Room };
export { Invoice };

export default {
  User,
  Family,
  Member,
  Room,
  Invoice,
};
