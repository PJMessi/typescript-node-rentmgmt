import { Schema } from 'mongoose';
import { generateToken } from './user.methods';
import { findCount } from './user.statics';
import { IUserDocument, IUserModel } from './user.types';

const userSchema = new Schema<IUserDocument, IUserModel>({
  name: {
    type: String,
    required: true,
    maxLength: 255,
  },

  email: {
    type: String,
    required: true,
    unique: true,
    maxLength: 255,
  },

  password: {
    type: String,
    required: true,
  },
});

// Assign the instance methods defined in user.methods.ts here.
userSchema.methods = {
  generateToken,
};

// Assign the static methods defined in user.statics.ts here.
userSchema.statics = {
  findCount,
};

export default userSchema;
