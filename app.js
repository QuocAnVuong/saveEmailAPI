const express = require('express');
const { getDb, connectToDb } = require('./db');
const { ObjectId, GridFSBucket } = require('mongodb');
const cors = require('cors');

const app = express();
app.use(express.json({ limit: '50mb' }));
app.use(cors());

let db;

connectToDb((err) => {
  if (!err) {
    app.listen('8000', () => {
      console.log('app listening on port 8000');
    });
    db = getDb();
  }
});

// Use express.text() middleware for this endpoint to accept raw EML files.
app.post('/mails', express.text({ type: 'message/rfc822' }), async (req, res) => {
  console.log("post mongoDB call")
  try {
    const emlContent = req.body; // The raw EML string.
    const bucket = new GridFSBucket(db, { bucketName: 'emlFiles' });
    const uploadStream = bucket.openUploadStream('email.eml', {
      contentType: 'message/rfc822'
    });

    await new Promise((resolve, reject) => {
      uploadStream.on('finish', resolve);
      uploadStream.on('error', reject);
      uploadStream.end(emlContent);
    });

    res.status(201).json({ message: 'EML file stored successfully', fileId: uploadStream.id });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Server error' });
  }
});

app.get('/mails/:id/eml', async (req, res) => {
  try {
    const fileId = req.params.id;
    const bucket = new GridFSBucket(db, { bucketName: 'emlFiles' });
    // Convert fileId to an ObjectId if needed.
    const objectId = new ObjectId(fileId);

    res.set({
      'Content-Type': 'message/rfc822',
      'Content-Disposition': 'attachment; filename="email.eml"'
    });

    const downloadStream = bucket.openDownloadStream(objectId);
    downloadStream.pipe(res);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Server error' });
  }
});