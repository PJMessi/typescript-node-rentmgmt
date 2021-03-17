import { Model, DataTypes, Optional } from 'sequelize';
import jwt from 'jsonwebtoken';
import bcrypt from 'bcrypt';
import sequelizeInstance from '../connection';

export interface UserAttributes {
  id: number;
  name: string;
  email: string;
  password: string;
  createdAt: Date;
  updatedAt: Date;
  deletedAt: Date | null;
}

export type JwtEncodedUserData = Omit<UserAttributes, 'password' | 'deletedAt'>;

export interface UserCreationAttributes
  extends Optional<
    UserAttributes,
    'id' | 'createdAt' | 'updatedAt' | 'deletedAt'
  > {}

class User
  extends Model<UserAttributes, UserCreationAttributes>
  implements UserAttributes {
  public readonly id!: number;

  public name!: string;

  public email!: string;

  public password!: string;

  public readonly createdAt!: Date;

  public readonly updatedAt!: Date;

  public readonly deletedAt!: Date | null;

  public generateToken = (): string => {
    const secret = process.env.JWT_SECRET || 'jsonwebtoken';
    const dataToEncode: JwtEncodedUserData = {
      id: this.id,
      name: this.name,
      email: this.email,
      createdAt: this.createdAt,
      updatedAt: this.updatedAt,
    };
    const token = jwt.sign(dataToEncode, secret);
    return token;
  };

  public toJSON = (): object => {
    return { ...super.toJSON(), password: undefined };
  };
}

User.init(
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

    email: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true,
    },

    password: {
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
    tableName: 'users',
    modelName: 'User',
    sequelize: sequelizeInstance,
    paranoid: true,
    defaultScope: {
      attributes: {
        exclude: ['deletedAt'],
      },
    },
  }
);

User.beforeCreate(async (user) => {
  const hashedPassword = await bcrypt.hash(user.password, 10);
  // eslint-disable-next-line no-param-reassign
  user.password = hashedPassword;
});

export default User;
