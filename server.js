const express = require('express');
const multer = require('multer');
const cors = require('cors');
const path = require('path');
const fs = require('fs');

const app = express();

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Ensure uploads directory exists
const uploadsDir = path.join(__dirname, 'uploads');
if (!fs.existsSync(uploadsDir)) {
  fs.mkdirSync(uploadsDir, { recursive: true });
}

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, uploadsDir);
  },
  filename: function (req, file, cb) {
    cb(null, Date.now() + '-' + file.originalname);
  }
});

const upload = multer({ 
  storage: storage,
  limits: { fileSize: 100 * 1024 * 1024 } // 100MB limit
});

// In-memory storage for demo
let users = [];
let videos = [];

app.post('/register', (req, res) => {
  const { username, password } = req.body;
  if (!username || !password) return res.status(400).json({ error: 'اطلاعات ناقص' });
  users.push({ username, password });
  res.json({ success: true, message: 'ثبت نام با موفقیت انجام شد!' });
});

app.post('/login', (req, res) => {
  const { username, password } = req.body;
  res.json({ success: true, token: 'fake-jwt-' + Date.now(), message: 'لاگین موفق' });
});

app.post('/upload', upload.single('video'), (req, res) => {
  if (!req.file) {
    return res.status(400).json({ error: 'هیچ فایلی آپلود نشد' });
  }
  const video = {
    id: Date.now(),
    filename: req.file.filename,
    url: `/uploads/${req.file.filename}`,
    title: req.body.title || req.file.originalname,
    uploadedAt: new Date()
  };
  videos.push(video);
  res.json({ success: true, message: 'ویدئو با موفقیت آپلود شد!', video });
});

app.get('/videos', (req, res) => {
  res.json(videos);
});

// Serve uploaded files
app.use('/uploads', express.static(uploadsDir));

// Serve static frontend
app.use(express.static(path.join(__dirname, '.')));

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`🚀 سرور ماهان ویدئو روی پورت ${PORT} در حال اجراست!`);
});
