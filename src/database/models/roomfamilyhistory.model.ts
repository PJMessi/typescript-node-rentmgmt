import { Model, DataTypes } from 'sequelize';
import sequelizeInstance from '../connection';

class RoomFamilyHistory extends Model {
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
      allowNull: true,
    },
    updatedAt: {
      type: DataTypes.DATE,
      allowNull: true,
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
