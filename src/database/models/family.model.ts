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
  BelongsToMany,
} from 'sequelize-typescript';
// eslint-disable-next-line import/no-cycle
import { Member, MemberCreationAttributes } from './member.model';
// eslint-disable-next-line import/no-cycle
import { Room } from './room.model';
// eslint-disable-next-line import/no-cycle
import { RoomFamilyHistory } from './roomfamilyhistory.model';

export interface FamilyAttributes {
  id: number;
  name: string;
  status: 'ACTIVE' | 'LEFT';
  sourceOfIncome: string;
  createdAt: Date;
  updatedAt: Date;
  deletedAt: Date;
  members: Member[];
  rooms: Room[];
}

/**
 * For FamilyCreationAttributes, we are not just using 'Optional' utility to make attributes in FamilyAttributes
 * optional.
 * This is because, in FamilyAttributes, there is 'members: Member[]' property. But while creating, we
 * want to receive 'members?: Omit<MemberCreationAttributes, 'familyId'>[]'. Simply making it optional is not
 * enough. And its not possible to update the interface property.
 * So, we are omitting the 'members' from FamilyAttributes using 'Omit' utility, and then we are using
 * 'Optional' utility to make other attributes optional.
 * Then we are re-defining the 'members'.
 */
export interface FamilyCreationAttributes
  extends Optional<
    Omit<FamilyAttributes, 'members'>,
    'id' | 'updatedAt' | 'createdAt' | 'deletedAt' | 'rooms'
  > {
  members?: Omit<MemberCreationAttributes, 'familyId'>[];
}

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

  @BelongsToMany(() => Room, () => RoomFamilyHistory)
  rooms!: Room[];

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
      rooms: this.rooms,
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
