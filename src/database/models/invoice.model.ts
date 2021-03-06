import {
  Model,
  DataTypes,
  Optional,
  HasOneGetAssociationMixin,
} from 'sequelize';
import sequelizeInstance from '../connection';
// eslint-disable-next-line import/no-cycle
import Family from './family.model';

export interface InvoiceAttributes {
  id: number;
  familyId: number;
  amount: number;
  startDate: Date;
  endDate: Date;
  status: 'PENDING' | 'PAID';
  createdAt: Date;
  updatedAt: Date;
  deletedAt: Date | null;
}

export interface InvoiceCreationAttributes
  extends Optional<
    InvoiceAttributes,
    'id' | 'createdAt' | 'updatedAt' | 'deletedAt'
  > {}

class Invoice
  extends Model<InvoiceAttributes, InvoiceCreationAttributes>
  implements InvoiceAttributes {
  public readonly id!: number;

  public familyId!: number;

  public amount!: number;

  public startDate!: Date;

  public endDate!: Date;

  public status!: 'PENDING' | 'PAID';

  public readonly createdAt!: Date;

  public readonly updatedAt!: Date;

  public readonly deletedAt!: Date | null;

  // Relations.

  public readonly family?: Family;

  public getFamily!: HasOneGetAssociationMixin<Family>;
}

Invoice.init(
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

    amount: {
      type: DataTypes.DECIMAL(8, 2),
      allowNull: false,
    },

    startDate: {
      type: DataTypes.DATE,
      allowNull: false,
    },

    endDate: {
      type: DataTypes.DATE,
      allowNull: false,
    },

    status: {
      type: DataTypes.ENUM('PENDING', 'PAID'),
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
    tableName: 'invoices',
    modelName: 'Invoice',
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

export default Invoice;
