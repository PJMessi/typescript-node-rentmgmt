import {
  Model,
  DataTypes,
  Optional,
  HasOneGetAssociationMixin,
  HasOneSetAssociationMixin,
  HasOneCreateAssociationMixin,
} from 'sequelize';
import sequelizeInstance from '../connection';
// eslint-disable-next-line import/no-cycle
import Family from './family.model';
// eslint-disable-next-line import/no-cycle
import RoomFamilyHistory from './roomfamilyhistory.model';

export interface RoomAttributes {
  id: number;
  name: string;
  description: string;
  status: 'OCCUPIED' | 'EMPTY';
  price: number;
  createdAt: Date;
  updatedAt: Date;
  deletedAt: Date;
}

export interface RoomCreationAttributes
  extends Optional<
    RoomAttributes,
    'id' | 'createdAt' | 'updatedAt' | 'deletedAt' | 'description'
  > {}

class Room
  extends Model<RoomAttributes, RoomCreationAttributes>
  implements RoomAttributes {
  public id!: number;

  public name!: string;

  public description!: string;

  public status!: 'OCCUPIED' | 'EMPTY';

  public price!: number;

  public createdAt!: Date;

  public updatedAt!: Date;

  public deletedAt!: Date;

  public readonly family?: Family;

  public readonly histories?: RoomFamilyHistory[];

  public getFamily!: HasOneGetAssociationMixin<Family>;

  public setFamily!: HasOneSetAssociationMixin<Family, number>;

  // It doesnt provide type checking. So its better not to use it.
  public createFamily!: HasOneCreateAssociationMixin<Family>;
}

Room.init(
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
    description: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    status: {
      type: DataTypes.ENUM('OCCUPIED', 'EMPTY'),
      allowNull: false,
    },
    price: {
      type: DataTypes.DECIMAL(8, 2),
      allowNull: true,
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
    tableName: 'rooms',
    modelName: 'Room',
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

export default Room;
