import {
  Model,
  DataTypes,
  Optional,
  BelongsToGetAssociationMixin,
  BelongsToSetAssociationMixin,
  BelongsToCreateAssociationMixin,
  HasManyGetAssociationsMixin,
} from 'sequelize';
import sequelizeInstance from '../connection';
// eslint-disable-next-line import/no-cycle
import Member, { MemberCreationAttributes } from './member.model';
// eslint-disable-next-line import/no-cycle
import Room from './room.model';
// eslint-disable-next-line import/no-cycle
import RoomFamilyHistory, {
  RoomFamilyHistoryCreationAttributes,
} from './roomfamilyhistory.model';

export interface FamilyAttributes {
  id: number;
  roomId: number;
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
  histories?: Omit<RoomFamilyHistoryCreationAttributes, 'familyId'>[];
}

class Family
  extends Model<FamilyAttributes, FamilyCreationAttributes>
  implements FamilyAttributes {
  public id!: number;

  public roomId!: number;

  public name!: string;

  public status!: 'ACTIVE' | 'LEFT';

  public sourceOfIncome!: string;

  public createdAt!: Date;

  public updatedAt!: Date;

  public deletedAt!: Date;

  public readonly members?: Member[];

  public readonly room?: Room;

  public readonly histories?: RoomFamilyHistory[];

  public getRoom!: BelongsToGetAssociationMixin<Room>;

  public setRoom!: BelongsToSetAssociationMixin<Room, number>;

  // It doesnt provide type checking. So its better not to use it.
  public createRoom!: BelongsToCreateAssociationMixin<Room>;

  public getHistories!: HasManyGetAssociationsMixin<RoomFamilyHistory>;
}

Family.init(
  {
    id: {
      type: DataTypes.INTEGER.UNSIGNED,
      autoIncrement: true,
      primaryKey: true,
    },
    roomId: {
      type: DataTypes.INTEGER.UNSIGNED,
      allowNull: false,
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
    timestamps: true,
    paranoid: true,
    defaultScope: {
      attributes: {
        exclude: ['deletedAt'],
      },
    },
  }
);

export default Family;
