import { model } from 'mongoose';
import userSchema from './user.schema';
import { IUserDocument, IUserModel } from './user.types';

const User = model<IUserDocument, IUserModel>('User', userSchema);

export default User;
