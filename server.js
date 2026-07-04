const express = require('express');
const multer = require('multer');
const cors = require('cors');
const path = require('path');
const fs = require('fs');

const app = express();
app.use(cors());
app.use(express.json());

// Create uploads dir
if (!fs.existsSync('uploads')) {
  fs.mkdirSync('uploads');
}

const storage = multer.diskStorage({
  destination: 'uploads/',
  filename: (req, file, cb) => {
    cb(null, Date.now() + '-' + file.originalname);
  }
});

const upload = multer({ storage: storage });

// Mock users for demo (use real DB in production)
let users = [];
let videos = [];

app.post('/register', (req, res) => {
  const { username, password } = req.body;
  users.push({ username, password });
  res.json({ message: 'ثبت نام موفق' });
});

app.post('/login', (req, res) => {
  // Simple auth for demo
  res.json({ token: 'fake-jwt-token' });
});

app.post('/upload', upload.single('video'), (req, res) => {
  if (!req.file) return res.status(400).send('No file');
  const video = {
    id: Date.now(),
    filename: req.file.filename,
    path: `/uploads/${req.file.filename}`,
    title: req.body.title || 'Untitled'
  };
  videos.push(video);
  res.json({ message: 'ویدئو آپلود شد', video });
});

app.get('/videos', (req, res) => {
  res.json(videos);
});

app.use('/uploads', express.static('uploads'));

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
