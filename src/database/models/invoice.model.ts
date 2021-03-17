import { Model, DataTypes } from 'sequelize';
import sequelizeInstance from '../connection';

class Invoice extends Model {
  public readonly id!: number;

  public familyId!: number;

  public amount!: number;

  public amountDetails!: {
    roomId: number;
    to: Date;
    from: Date;
    amount: number;
  }[];

  public readonly createdAt!: Date;

  public readonly updatedAt!: Date;

  public readonly deletedAt!: Date;
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

    amountDetails: {
      type: DataTypes.TEXT,
      set(
        value: {
          roomId: number;
          to: Date;
          from: Date;
          amount: number;
        }[]
      ) {
        const amountDetailsInJson = JSON.stringify(value);
        this.setDataValue('amountDetails', amountDetailsInJson);
      },
      get(): {
        roomId: number;
        to: Date;
        from: Date;
        amount: number;
      }[] {
        return JSON.parse(this.getDataValue('amountDetails'));
      },
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
