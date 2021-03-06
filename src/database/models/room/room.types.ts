import { Model, Document, ObjectId } from 'mongoose';

export interface IRoom {
  name: string;
  description?: string;
  status: 'EMPTY' | 'OCCUPIED';
}

export interface IRoomDocument extends IRoom, Document {
  _id: ObjectId;
  id: string;
}
export interface IRoomModel extends Model<IRoomDocument> {}
