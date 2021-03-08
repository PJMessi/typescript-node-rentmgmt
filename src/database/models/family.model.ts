import { Optional } from 'sequelize';
import {
  Table,
  Model,
  Column,
  DataType,
  CreatedAt,
  UpdatedAt,
  DeletedAt,
  HasMany,
} from 'sequelize-typescript';
// eslint-disable-next-line import/no-cycle
import { Member, MemberCreationAttributes } from './member.model';

export interface FamilyAttributes {
  id: number;
  name: string;
  status: 'ACTIVE' | 'LEFT';
  sourceOfIncome: string;
  createdAt: Date;
  updatedAt: Date;
  deletedAt: Date;
  members: Omit<MemberCreationAttributes, 'familyId'>[];
}

export interface FamilyCreationAttributes
  extends Optional<
    FamilyAttributes,
    'id' | 'updatedAt' | 'createdAt' | 'deletedAt' | 'members'
  > {}

@Table({ tableName: 'families' })
export class Family extends Model<FamilyAttributes, FamilyCreationAttributes> {
  @Column({
    type: DataType.STRING,
    allowNull: false,
  })
  name!: string;

  @Column({
    type: DataType.ENUM('ACTIVE', 'LEFT'),
    allowNull: false,
  })
  status!: 'ACTIVE' | 'LEFT';

  @Column({
    type: DataType.STRING,
    allowNull: false,
  })
  sourceOfIncome!: string;

  @CreatedAt
  createdAt!: Date;

  @UpdatedAt
  updatedAt!: Date;

  @DeletedAt
  deletedAt!: Date;

  @HasMany(() => Member, 'familyId')
  members!: Member[];

  /**
   * Overriding default toJSON method to exculde deletedAt attributes while sending family as a response.
   */
  toJSON = (): Omit<FamilyAttributes, 'deletedAt'> => {
    return {
      id: this.id,
      name: this.name,
      status: this.status,
      sourceOfIncome: this.sourceOfIncome,
      createdAt: this.createdAt,
      updatedAt: this.updatedAt,
      members: this.members,
    };
  };

  // Declare the static variable for this class here.
  static STATUS: {
    ACTIVE: 'ACTIVE';
    LEFT: 'LEFT';
  };
}

// Initialize the static variable declared in the class here.
Family.STATUS = {
  ACTIVE: 'ACTIVE',
  LEFT: 'LEFT',
};
