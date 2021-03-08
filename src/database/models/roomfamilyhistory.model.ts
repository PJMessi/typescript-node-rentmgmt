import {
  Table,
  Model,
  Column,
  ForeignKey,
  DeletedAt,
  PrimaryKey,
  DataType,
  UpdatedAt,
  CreatedAt,
} from 'sequelize-typescript';
import { Family } from './family.model';
import { Room } from './room.model';

@Table({ tableName: 'roomFamilyHistories' })
// eslint-disable-next-line import/prefer-default-export
export class RoomFamilyHistory extends Model {
  @PrimaryKey
  @Column({
    type: DataType.NUMBER,
    allowNull: false,
  })
  id!: number;

  @ForeignKey(() => Room)
  @Column
  roomId!: number;

  @ForeignKey(() => Family)
  @Column
  familyId!: number;

  @CreatedAt
  createdAt!: Date;

  @UpdatedAt
  updatedAt!: Date;

  @DeletedAt
  deletedAt!: Date;
}
