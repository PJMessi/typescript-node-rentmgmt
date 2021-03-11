import User from './user.model';
import Family from './family.model';
import Member from './member.model';
import Room from './room.model';
import RoomFamilyHistory from './roomfamilyhistory.model';

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

export { User };
export { Family };
export { Member };
export { Room };
export { RoomFamilyHistory };

export default {
  User,
  Family,
  Member,
  Room,
  RoomFamilyHistory,
};
