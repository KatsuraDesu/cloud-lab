require('dotenv').config();
const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');
const Student = require('./models/Student');

const app = express();
const PORT = process.env.PORT || 5000;

// CORS: chỉ cho phép domain Frontend khai báo trong CLIENT_URL
const allowedOrigins = [
  process.env.CLIENT_URL,
  'http://localhost:5173',
  'http://localhost:3000',
].filter(Boolean);

app.use(cors({
  origin: (origin, cb) =>
    (!origin || allowedOrigins.includes(origin))
      ? cb(null, true)
      : cb(new Error('Not allowed by CORS')),
  credentials: true,
}));
app.use(express.json());

mongoose.connect(process.env.MONGODB_URI)
  .then(() => console.log('✅ Kết nối MongoDB Atlas thành công (Connected to MongoDB Atlas successfully)'))
  .catch((err) => console.error('❌ Lỗi kết nối MongoDB:', err));

// Health check cho Render (Buổi 6)
const health = (req, res) =>
  res.status(200).json({ status: 'UP', timestamp: new Date(), uptime: process.uptime() });
app.get('/health', health);
app.get('/api/health', health);

app.get('/api/hello', (req, res) => {
  res.json({ message: 'Backend đang hoạt động!' });
});

// GET - lấy danh sách sinh viên
app.get('/api/students', async (req, res) => {
  try {
    const students = await Student.find();
    res.json(students);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// POST - thêm sinh viên
app.post('/api/students', async (req, res) => {
  try {
    const student = await Student.create(req.body);
    res.status(201).json(student);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// PUT - cập nhật sinh viên
app.put('/api/students/:id', async (req, res) => {
  try {
    const student = await Student.findByIdAndUpdate(req.params.id, req.body, { new: true });
    res.json(student);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// DELETE - xóa sinh viên
app.delete('/api/students/:id', async (req, res) => {
  try {
    await Student.findByIdAndDelete(req.params.id);
    res.json({ message: 'Đã xóa sinh viên thành công' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.listen(PORT, () => {
  console.log(`Server đang chạy tại port ${PORT} - v1.2`);
});