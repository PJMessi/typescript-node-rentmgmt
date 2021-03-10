import {
  Model,
  DataTypes,
  Optional,
  HasManyRemoveAssociationMixin,
  HasManyCountAssociationsMixin,
  HasManyGetAssociationsMixin,
  HasManySetAssociationsMixin,
  HasManyAddAssociationsMixin,
  HasManyAddAssociationMixin,
  HasManyRemoveAssociationsMixin,
  HasManyHasAssociationMixin,
  HasManyHasAssociationsMixin,
} from 'sequelize';
import sequelizeInstance from '../connection';
// eslint-disable-next-line import/no-cycle
import Family from './family.model';

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

  public readonly families?: Family[];

  public getFamilies!: HasManyGetAssociationsMixin<Family>;

  public setFamilies!: HasManySetAssociationsMixin<Family, number>;

  public addFamilies!: HasManyAddAssociationsMixin<Family, number>;

  public addFamily!: HasManyAddAssociationMixin<Family, number>;

  // Does not provide type support. So better not use it.
  // public createFamily!: HasManyCreateAssociationMixin<Family>;

  public removeFamily!: HasManyRemoveAssociationMixin<Family, number>;

  public removeFamilies!: HasManyRemoveAssociationsMixin<Family, number>;

  public hasFamily!: HasManyHasAssociationMixin<Family, number>;

  public hasFamilies!: HasManyHasAssociationsMixin<Family, number>;

  public countFamilies!: HasManyCountAssociationsMixin;
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
    paranoid: true,
  }
);

export default Room;
