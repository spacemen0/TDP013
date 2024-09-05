import { ObjectId } from 'mongodb';
import { getDatabaseConnection } from '../db/conn.js';


export const createMessage = async (req, res) => {
    const db = getDatabaseConnection()
    const { message } = req.body;
    if (!message || typeof message !== 'string' || message.trim().length === 0) {
        return res.status(400).json({ error: 'Valid message content is required' });
    }

    try {
        const result = await db.collection('messages').insertOne({ message, read: false });
        res.status(200).json({ message: 'Message saved successfully', id: result.insertedId });
    } catch (error) {
        res.status(500).json({ error: 'Failed to save message' });
    }
}

export const markMessageStatus = async (req, res) => {
    const db = getDatabaseConnection()
    const { id } = req.params;
    const { read } = req.body;

    if (typeof read !== 'boolean') {
        return res.status(400).json({ error: 'Read status must be a boolean' });
    }

    try {
        const result = await db.collection('messages').updateOne({ _id: new ObjectId(id) }, { $set: { read } });

        if (result.matchedCount === 0) {
            return res.status(404).json({ error: 'Message not found' });
        }

        res.status(201).json({ message: 'Message updated successfully' });
    } catch (error) {
        res.status(500).json({ error: 'Failed to update message' });
    }
}

export const getMessage = async (req, res) => {
    const db = getDatabaseConnection()
    const { id } = req.params;

    try {
        const message = await db.collection('messages').findOne({ _id: new ObjectId(id) });

        if (!message) {
            return res.status(404).json({ error: 'Message not found' });
        }

        res.status(200).json(message);
    } catch (error) {
        res.status(500).json({ error: 'Failed to retrieve message' });
    }
}

export const getMessages = async (req, res) => {
    const db = getDatabaseConnection()
    try {
        const messages = await db.collection('messages').find().toArray();
        res.status(200).json(messages);
    } catch (error) {
        res.status(500).json({ error: 'Failed to retrieve messages' });
    }
}