import { Model, Document, ObjectId } from 'mongoose';

export interface IUser {
  name: string;
  email: string;
  password: string;
}

export interface IUserDocument extends IUser, Document {
  _id: ObjectId;
  id: string;
  generateToken: (this: IUserDocument) => Promise<string>;
}
export interface IUserModel extends Model<IUserDocument> {
  findCount: (this: IUserModel) => Promise<number>;
}

export type JwtEncodedUserData = {
  id: string;
  name: string;
  email: string;
  password: string;
};
