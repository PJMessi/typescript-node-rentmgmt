import { Model, DataTypes, Optional } from 'sequelize';
import sequelizeInstance from '../connection';
// eslint-disable-next-line import/no-cycle
import Family from './family.model';

export interface MemberAttributes {
  id: number;
  familyId: number;
  name: string;
  email: string | null;
  birthDay: Date;
  mobile: string | null;
  createdAt: Date;
  updatedAt: Date;
  deletedAt: Date | null;
}

export interface MemberCreationAttributes
  extends Optional<
    MemberAttributes,
    'id' | 'createdAt' | 'updatedAt' | 'deletedAt' | 'mobile' | 'email'
  > {}

class Member
  extends Model<MemberAttributes, MemberCreationAttributes>
  implements MemberAttributes {
  public readonly id!: number;

  public familyId!: number;

  public name!: string;

  public email!: string | null;

  public birthDay!: Date;

  public mobile!: string | null;

  public readonly createdAt!: Date;

  public readonly updatedAt!: Date;

  public readonly deletedAt!: Date | null;

  // Relations.

  public readonly family?: Family;
}

Member.init(
  {
    id: {
      type: DataTypes.INTEGER.UNSIGNED,
      autoIncrement: true,
      primaryKey: true,
    },

    familyId: {
      type: DataTypes.INTEGER.UNSIGNED,
      allowNull: false,
    },

    name: {
      type: DataTypes.STRING,
      allowNull: false,
    },

    email: {
      type: DataTypes.STRING,
      allowNull: true,
    },

    birthDay: {
      type: DataTypes.DATE,
      allowNull: false,
    },

    mobile: {
      type: DataTypes.STRING,
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
    tableName: 'members',
    modelName: 'Member',
    sequelize: sequelizeInstance,
    paranoid: true,
    defaultScope: {
      attributes: {
        exclude: ['deletedAt'],
      },
    },
  }
);

export default Member;
