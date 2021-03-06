import { Model, Document, ObjectId } from 'mongoose';

export interface IUser {
  name: string;
  email: string;
  password: string;
}

// After defining instance methods in user.methods.ts, declare the method here.
export interface IUserDocument extends IUser, Document {
  _id: ObjectId;
  id: string;
  generateToken: (this: IUserDocument) => Promise<string>;
}

// After defining static methods in user.statics.ts, declare the method here.
// After defining static property in room.model.ts, declare the property here.
export interface IUserModel extends Model<IUserDocument> {
  findCount: (this: IUserModel) => Promise<number>;
}

export type JwtEncodedUserData = {
  id: string;
  name: string;
  email: string;
  password: string;
};
