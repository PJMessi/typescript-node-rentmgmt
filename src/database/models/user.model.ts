import { Optional } from 'sequelize';
import {
  Table,
  Model,
  Column,
  DataType,
  CreatedAt,
  UpdatedAt,
  DeletedAt,
} from 'sequelize-typescript';
import jwt from 'jsonwebtoken';

export interface UserAttributes {
  id: number;
  name: string;
  email: string;
  password: string;
  createdAt: Date;
  updatedAt: Date;
  deletedAt: Date;
}

export type JwtEncodedUserData = Omit<UserAttributes, 'password' | 'deletedAt'>;

export interface UserCreationAttributes
  extends Optional<
    UserAttributes,
    'id' | 'updatedAt' | 'createdAt' | 'deletedAt'
  > {}

@Table({ tableName: 'users' })
export class User extends Model<UserAttributes, UserCreationAttributes> {
  @Column({
    type: DataType.STRING,
    allowNull: false,
  })
  name!: string;

  @Column({
    type: DataType.STRING,
    allowNull: false,
    unique: true,
  })
  email!: string;

  @Column({
    type: DataType.STRING,
    allowNull: false,
  })
  password!: string;

  @CreatedAt
  createdAt!: Date;

  @UpdatedAt
  updatedAt!: Date;

  @DeletedAt
  deletedAt!: Date;

  /**
   * Generates json web token for the user.
   */
  generateToken = (): string => {
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

  /**
   * Overriding default toJSON method to exculde password and deletedAt attributes while sending
   * user as a response.
   */
  toJSON = (): Omit<UserAttributes, 'password' | 'deletedAt'> => {
    return {
      id: this.id,
      name: this.name,
      email: this.email,
      createdAt: this.createdAt,
      updatedAt: this.updatedAt,
    };
  };

  // Declare the static variable for this class here.
}

// Initialize the static variable declared in the class here.
