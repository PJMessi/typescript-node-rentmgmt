import {
  Model,
  DataTypes,
  Optional,
  BelongsToGetAssociationMixin,
  HasManyGetAssociationsMixin,
} from 'sequelize';
import { Invoice } from '.';
import sequelizeInstance from '../connection';
// eslint-disable-next-line import/no-cycle
import Member, { MemberCreationAttributes } from './member.model';
// eslint-disable-next-line import/no-cycle
import Room from './room.model';

export interface FamilyAttributes {
  id: number;
  roomId: number;
  name: string;
  status: 'ACTIVE' | 'LEFT';
  sourceOfIncome: string;
  amount: number;
  createdAt: Date;
  updatedAt: Date;
  deletedAt: Date | null;
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
  public readonly id!: number;

  public roomId!: number;

  public name!: string;

  public status!: 'ACTIVE' | 'LEFT';

  public sourceOfIncome!: string;

  public amount!: number;

  public readonly createdAt!: Date;

  public readonly updatedAt!: Date;

  public readonly deletedAt!: Date;

  // Relations.

  public readonly members?: Member[];

  public getMembers!: HasManyGetAssociationsMixin<Member>;

  public readonly room?: Room;

  public getRoom!: BelongsToGetAssociationMixin<Room>;

  public readonly invoices?: Invoice[];

  public getInvoices!: HasManyGetAssociationsMixin<Invoice>;
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
