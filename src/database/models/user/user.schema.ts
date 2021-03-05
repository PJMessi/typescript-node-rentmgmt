import { Schema } from 'mongoose';
import { generateToken } from './user.methods';
import { findCount } from './user.statics';
import { IUserDocument, IUserModel } from './user.types';

const userSchema = new Schema<IUserDocument, IUserModel>({
  name: { type: String, required: true },
  email: { type: String, required: true },
  password: { type: String, required: true },
});

userSchema.methods.generateToken = generateToken;
userSchema.statics.findCount = findCount;

export default userSchema;
