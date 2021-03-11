import { Model, DataTypes, Optional } from 'sequelize';
import sequelizeInstance from '../connection';

export interface RoomFamilyHistoryAttributes {
  id: number;
  roomId: number;
  familyId: number;
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

  public createdAt!: Date;

  public updatedAt!: Date;

  public deletedAt!: Date;
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
  }
);

export default RoomFamilyHistory;
