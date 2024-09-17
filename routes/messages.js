import express from 'express';
import { createMessage, getMessage, getMessage_injection, getMessages, markMessageStatus } from '../controllers/messages.js';
import { notAllowed } from '../middlewares/notAllowed.js';

const router = express.Router();

router.post('/', createMessage);
router.patch('/:id', markMessageStatus);
router.get('/injection', getMessage_injection);
router.get('/:id', getMessage);
router.get('/', getMessages);
router.all(['/', '/:id'], notAllowed);


export default router;
