import { ObjectId } from 'mongodb';
import sanitize from 'mongo-sanitize';
import { getDatabaseConnection } from '../db/conn.js';


export const createMessage = async (req, res) => {
    const db = getDatabaseConnection();
    const { message } = req.body;

    if (!message || typeof message !== 'string' || message.trim().length === 0) {
        return res.status(400).json({ error: 'Valid message content is required' });
    }

    try {
        const result = await db.collection('messages').insertOne({
            message,
            read: false,
            dateTime: new Date().toLocaleString()
        });
        const createdMessage = await db.collection('messages').findOne({ _id: result.insertedId });

        res.status(200).json(createdMessage);
    } catch (error) {
        res.status(500).json({ error: 'Failed to save message' });
    }
};


export const markMessageStatus = async (req, res) => {
    const db = getDatabaseConnection()
    const { id } = req.params;
    const { read } = req.body;
    if (!ObjectId.isValid(id)) {
        return res.status(400).json({ error: "Invalid ID" })
    }
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
    if (!ObjectId.isValid(id)) {
        return res.status(400).json({ error: "Invalid ID" })
    }
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

export const getMessage_injection = async (req, res) => {
    const db = getDatabaseConnection();
    const id = req.body.id;

    try {
        const message = await db.collection('messages').findOne({ _id: sanitize(id) });
        if (!message) {
            return res.status(404).json({ error: 'Message not found' });
        }
        res.status(200).json(message);
    } catch (error) {
        console.log(error)
        res.status(500).json({ error: 'Failed to retrieve message' });
    }
};
