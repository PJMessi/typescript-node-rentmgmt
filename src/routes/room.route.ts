import { Router } from 'express';
import { createRoom } from '@controllers/room/room.controller';
import { validateForCreateRoom } from '@controllers/room/room.validation';

const router = Router();

router.post('/', validateForCreateRoom, createRoom);

export default router;
