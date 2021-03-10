import {
  Model,
  DataTypes,
  Optional,
  HasManyGetAssociationsMixin,
  HasManySetAssociationsMixin,
  HasManyAddAssociationsMixin,
  HasManyAddAssociationMixin,
  HasManyRemoveAssociationMixin,
  HasManyRemoveAssociationsMixin,
  HasManyHasAssociationMixin,
  HasManyHasAssociationsMixin,
  HasManyCountAssociationsMixin,
} from 'sequelize';
import sequelizeInstance from '../connection';
// eslint-disable-next-line import/no-cycle
import Member, { MemberCreationAttributes } from './member.model';
// eslint-disable-next-line import/no-cycle
import Room from './room.model';

export interface FamilyAttributes {
  id: number;
  name: string;
  status: 'ACTIVE' | 'LEFT';
  sourceOfIncome: string;
  createdAt: Date;
  updatedAt: Date;
  deletedAt: Date;
}

export interface FamilyCreationAttributes
  extends Optional<
    FamilyAttributes,
    'id' | 'createdAt' | 'updatedAt' | 'deletedAt'
  > {
  members?: Omit<MemberCreationAttributes, 'familyId'>[];
}

class Family
  extends Model<FamilyAttributes, FamilyCreationAttributes>
  implements FamilyAttributes {
  public id!: number;

  public name!: string;

  public status!: 'ACTIVE' | 'LEFT';

  public sourceOfIncome!: string;

  public createdAt!: Date;

  public updatedAt!: Date;

  public deletedAt!: Date;

  public readonly members?: Member[];

  public readonly rooms?: Room[];

  public getRooms!: HasManyGetAssociationsMixin<Room>;

  public setRooms!: HasManySetAssociationsMixin<Room, number>;

  public addRooms!: HasManyAddAssociationsMixin<Room, number>;

  public addRoom!: HasManyAddAssociationMixin<Room, number>;

  // Does not provide type support. So better not use it.
  // public createRoom!: HasManyCreateAssociationMixin<Room>;

  public removeRoom!: HasManyRemoveAssociationMixin<Room, number>;

  public removeRooms!: HasManyRemoveAssociationsMixin<Room, number>;

  public hasRoom!: HasManyHasAssociationMixin<Room, number>;

  public hasRooms!: HasManyHasAssociationsMixin<Room, number>;

  public countRooms!: HasManyCountAssociationsMixin;
}

Family.init(
  {
    id: {
      type: DataTypes.INTEGER.UNSIGNED,
      autoIncrement: true,
      primaryKey: true,
    },
    name: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    status: {
      type: DataTypes.ENUM('ACTIVE', 'LEFT'),
      allowNull: false,
    },
    sourceOfIncome: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    createdAt: {
      type: DataTypes.DATE,
      allowNull: false,
    },
    updatedAt: {
      type: DataTypes.DATE,
      allowNull: false,
    },
    deletedAt: {
      type: DataTypes.DATE,
      allowNull: true,
    },
  },
  {
    tableName: 'families',
    modelName: 'Family',
    sequelize: sequelizeInstance,
    paranoid: true,
  }
);

export default Family;
