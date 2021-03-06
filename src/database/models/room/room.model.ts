import { model } from 'mongoose';
import roomSchema from './room.schema';
import { IRoomDocument, IRoomModel } from './room.types';

const Room = model<IRoomDocument, IRoomModel>('Room', roomSchema);

/**
 * Define static property here.
 * After defining the property here:
 *  1. make sure to declare the property in IRoomModel in interface in room.types.ts
 */
Room.STATUS = {
  OCCUPIED: 'OCCUPIED',
  EMPTY: 'EMPTY',
};

export default Room;
