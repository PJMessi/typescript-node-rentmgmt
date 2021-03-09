import {
  Table,
  Model,
  Column,
  ForeignKey,
  DeletedAt,
  UpdatedAt,
  CreatedAt,
} from 'sequelize-typescript';
// eslint-disable-next-line import/no-cycle
import { Family } from './family.model';
// eslint-disable-next-line import/no-cycle
import { Room } from './room.model';

@Table({ tableName: 'roomFamilyHistories' })
// eslint-disable-next-line import/prefer-default-export
export class RoomFamilyHistory extends Model {
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
