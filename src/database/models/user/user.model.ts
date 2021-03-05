import { model, Schema, Document, Model } from 'mongoose';
import jwt from 'jsonwebtoken';

export interface IUser {
  name: string;
  email: string;
  password: string;
}

export interface IUserDocument extends IUser, Document {
  generateToken: (this: IUserDocument) => Promise<string>;
}
export interface IUserModel extends Model<IUserDocument> {}

const userSchema = new Schema<IUserDocument>({
  name: { type: String, required: true },
  email: { type: String, required: true },
  password: { type: String, required: true },
});

userSchema.methods.generateToken = async function (
  this: IUserDocument
): Promise<string> {
  const tokenData = this.toJSON();
  return jwt.sign(tokenData, process.env.JWT_KEY || 'jsonwebtoken');
};

userSchema.statics.findCount = async function (
  this: IUserModel
): Promise<number> {
  const count = await this.count();
  return count;
};

const User = model<IUserDocument>('User', userSchema);

export default User;
