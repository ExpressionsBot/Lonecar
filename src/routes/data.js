import express from 'express';
import { addTextToPinecone } from '../index.js';

const router = express.Router();

router.post('/add-text', async (req, res) => {
  const { id, text } = req.body;
  try {
    await addTextToPinecone(id, text);
    res.status(200).send({ message: 'Text added successfully.' });
  } catch (error) {
    res.status(500).send({ error: 'Failed to add text.' });
  }
});

export default router;
