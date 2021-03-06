import { Schema } from 'mongoose';
import { IRoomDocument, IRoomModel } from './room.types';

const roomSchema = new Schema<IRoomDocument, IRoomModel>({
  name: {
    type: String,
    required: true,
    maxLength: 255,
  },

  description: {
    type: String,
    required: false,
    maxLength: 255,
  },

  status: {
    type: String,
    enum: ['OCCUPIED', 'EMPTY'],
    required: true,
  },
});

// Assign the instance methods defined in room.methods.ts here.
roomSchema.methods = {};

// Assign the static methods defined in room.statics.ts here.
roomSchema.statics = {};

export default roomSchema;
