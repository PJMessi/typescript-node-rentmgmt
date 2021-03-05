import { Model, Document } from 'mongoose';

export interface IUser {
  name: string;
  email: string;
  password: string;
}

export interface IUserDocument extends IUser, Document {
  generateToken: (this: IUserDocument) => Promise<string>;
}
export interface IUserModel extends Model<IUserDocument> {
  findCount: (this: IUserModel) => Promise<number>;
}
