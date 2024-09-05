import express from 'express';
import { createMessage, getMessage, getMessages, markMessageStatus } from '../controllers/messages.js';

const router = express.Router();

router.post('/', createMessage);
router.patch('/:id', markMessageStatus);
router.get('/:id', getMessage);
router.get('/', getMessages);

router.all('/', (req, res) => {
    res.set('Allow', 'POST, GET');
    res.status(405).send('Method Not Allowed');
});

router.all('/:id', (req, res) => {
    res.set('Allow', 'PATCH, GET');
    res.status(405).send('Method Not Allowed');
});

export default router;
