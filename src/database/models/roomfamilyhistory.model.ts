import {
  Model,
  DataTypes,
  Optional,
  BelongsToGetAssociationMixin,
  BelongsToSetAssociationMixin,
  BelongsToCreateAssociationMixin,
} from 'sequelize';
import sequelizeInstance from '../connection';
// eslint-disable-next-line import/no-cycle
import Family from './family.model';
// eslint-disable-next-line import/no-cycle
import Room from './room.model';

export interface RoomFamilyHistoryAttributes {
  id: number;
  roomId: number;
  familyId: number;
  amount: number;
  createdAt: Date;
  updatedAt: Date;
  deletedAt: Date;
}

export interface RoomFamilyHistoryCreationAttributes
  extends Optional<
    RoomFamilyHistoryAttributes,
    'id' | 'createdAt' | 'updatedAt' | 'deletedAt'
  > {}

class RoomFamilyHistory
  extends Model<
    RoomFamilyHistoryAttributes,
    RoomFamilyHistoryCreationAttributes
  >
  implements RoomFamilyHistoryAttributes {
  public id!: number;

  public roomId!: number;

  public familyId!: number;

  public amount!: number;

  public createdAt!: Date;

  public updatedAt!: Date;

  public deletedAt!: Date;

  public readonly room?: Room;

  public readonly family?: Family;

  public getRoom!: BelongsToGetAssociationMixin<Room>;

  public setRoom!: BelongsToSetAssociationMixin<Room, number>;

  // It doesnt provide type checking. So its better not to use it.
  public createRoom!: BelongsToCreateAssociationMixin<Room>;

  public getFamily!: BelongsToGetAssociationMixin<Family>;

  public setFamily!: BelongsToSetAssociationMixin<Family, number>;

  // It doesnt provide type checking. So its better not to use it.
  public createFamily!: BelongsToCreateAssociationMixin<Family>;
}

RoomFamilyHistory.init(
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
    familyId: {
      type: DataTypes.INTEGER.UNSIGNED,
      allowNull: false,
    },
    amount: {
      type: DataTypes.DECIMAL(8, 2),
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
    tableName: 'roomfamilyhistories',
    modelName: 'RoomFamilyHistory',
    sequelize: sequelizeInstance,
    paranoid: true,
    timestamps: true,
    defaultScope: {
      attributes: {
        exclude: ['deletedAt'],
      },
    },
  }
);

export default RoomFamilyHistory;
