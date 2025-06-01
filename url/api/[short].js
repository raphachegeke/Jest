import connectToDatabase from '../utils/mongodb.js';
import mongoose from 'mongoose';

const urlSchema = new mongoose.Schema({
  original: String,
  short: String,
});

const Url = mongoose.models.Url || mongoose.model('Url', urlSchema);

export default async function handler(req, res) {
  await connectToDatabase();

  const { short } = req.query;
  const url = await Url.findOne({ short });

  if (url) {
    res.writeHead(302, { Location: url.original });
    res.end();
  } else {
    res.status(404).send('URL not found');
  }
}
