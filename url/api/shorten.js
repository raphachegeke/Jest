import connectToDatabase from '../utils/mongodb.js';
import mongoose from 'mongoose';
import shortid from 'shortid';

const urlSchema = new mongoose.Schema({
  original: String,
  short: String,
});

const Url = mongoose.models.Url || mongoose.model('Url', urlSchema);

export default async function handler(req, res) {
  if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' });

  await connectToDatabase();

  const { original } = req.body;
  if (!original) return res.status(400).json({ error: 'Missing original URL' });

  const short = shortid.generate();

  try {
    const url = new Url({ original, short });
    await url.save();
    res.status(200).json({ shortUrl: `${req.headers.origin}/${short}` });
  } catch (error) {
    res.status(500).json({ error: 'Database error' });
  }
}
