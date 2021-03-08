import { Optional } from 'sequelize';
import {
  Table,
  Model,
  Column,
  DataType,
  CreatedAt,
  UpdatedAt,
  DeletedAt,
  ForeignKey,
  BelongsTo,
} from 'sequelize-typescript';
// eslint-disable-next-line import/no-cycle
import { Family } from './family.model';

export interface MemberAttributes {
  id: number;
  familyId: number;
  name: string;
  email: string;
  mobile: string;
  birthDay: Date;
  createdAt: Date;
  updatedAt: Date;
  deletedAt: Date;
}

export interface MemberCreationAttributes
  extends Optional<
    MemberAttributes,
    'id' | 'updatedAt' | 'createdAt' | 'deletedAt' | 'email' | 'mobile'
  > {}

@Table({ tableName: 'members' })
export class Member extends Model<MemberAttributes, MemberCreationAttributes> {
  @Column({
    type: DataType.STRING,
    allowNull: false,
  })
  name!: string;

  @ForeignKey(() => Family)
  @Column({
    type: DataType.INTEGER,
    allowNull: false,
  })
  familyId!: number;

  @BelongsTo(() => Family, 'familyId')
  family!: Family;

  @Column({
    type: DataType.STRING,
    allowNull: true,
  })
  email!: string;

  @Column({
    type: DataType.STRING,
    allowNull: true,
  })
  mobile!: string;

  @Column({
    type: DataType.DATE,
    allowNull: false,
  })
  birthDay!: Date;

  @CreatedAt
  createdAt!: Date;

  @UpdatedAt
  updatedAt!: Date;

  @DeletedAt
  deletedAt!: Date;

  /**
   * Overriding default toJSON method to exculde deletedAt attributes while sending member as a response.
   */
  toJSON = (): Omit<MemberAttributes, 'deletedAt'> => {
    return {
      id: this.id,
      familyId: this.familyId,
      name: this.name,
      email: this.email,
      mobile: this.mobile,
      birthDay: this.birthDay,
      createdAt: this.createdAt,
      updatedAt: this.updatedAt,
    };
  };

  // Declare the static variable for this class here.
}

// Initialize the static variable declared in the class here.
