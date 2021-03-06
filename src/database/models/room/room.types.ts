import { Model, Document, ObjectId } from 'mongoose';

export interface IRoom {
  name: string;
  description?: string;
  status: 'EMPTY' | 'OCCUPIED';
}

// After defining instance methods in room.methods.ts, declare the method here.
export interface IRoomDocument extends IRoom, Document {
  _id: ObjectId;
  id: string;
}

// After defining static methods in room.statics.ts, declare the method here.
// After defining static property in room.model.ts, declare the property here.
export interface IRoomModel extends Model<IRoomDocument> {
  STATUS: {
    EMPTY: 'EMPTY';
    OCCUPIED: 'OCCUPIED';
  };
}
