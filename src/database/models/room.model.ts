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

export interface RoomAttributes {
  id: number;
  name: string;
  status: 'OCCUPIED' | 'EMPTY';
  description: string;
  createdAt: Date;
  updatedAt: Date;
  deletedAt: Date;
}

export interface RoomCreationAttributes
  extends Optional<
    RoomAttributes,
    'id' | 'updatedAt' | 'createdAt' | 'deletedAt' | 'description'
  > {}

@Table({ tableName: 'rooms' })
export class Room extends Model<RoomAttributes, RoomCreationAttributes> {
  @Column({
    type: DataType.STRING,
    allowNull: false,
  })
  name!: string;

  @Column({
    type: DataType.STRING,
    allowNull: true,
  })
  description!: string;

  @Column({
    type: DataType.ENUM('OCCUPIED', 'EMPTY'),
    allowNull: true,
  })
  status!: 'OCCUPIED' | 'EMPTY';

  @CreatedAt
  createdAt!: Date;

  @UpdatedAt
  updatedAt!: Date;

  @DeletedAt
  deletedAt!: Date;

  /**
   * Overriding default toJSON method to exculde deletedAt attributes while sending room as a response.
   */
  toJSON = (): Omit<RoomAttributes, 'deletedAt'> => {
    return {
      id: this.id,
      name: this.name,
      description: this.description,
      status: this.status,
      createdAt: this.createdAt,
      updatedAt: this.updatedAt,
    };
  };

  // Declare the static variable for this class here.
  static STATUS: {
    EMPTY: 'EMPTY';
    OCCUPIED: 'OCCUPIED';
  };
}

// Initialize the static variable declared in the class here.
Room.STATUS = {
  EMPTY: 'EMPTY',
  OCCUPIED: 'OCCUPIED',
};
