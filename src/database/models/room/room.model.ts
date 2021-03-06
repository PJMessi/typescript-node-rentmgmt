import { model } from 'mongoose';
import roomSchema from './room.schema';
import { IRoomDocument, IRoomModel } from './room.types';

const Room = model<IRoomDocument, IRoomModel>('Room', roomSchema);

export default Room;
