import { model } from 'mongoose';
import userSchema from './user.schema';
import { IUserDocument, IUserModel } from './user.types';

const User = model<IUserDocument, IUserModel>('User', userSchema);

/**
 * Define static property here.
 * After defining the property here:
 *  1. make sure to declare the property in IUserModel in interface in user.types.ts
 */

export default User;
