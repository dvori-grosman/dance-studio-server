const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const helmet = require('helmet');
const rateLimit = require('express-rate-limit');
const { seedContent } = require('./utils/seedContent');
require('dotenv').config();

const app = express();

app.use(helmet());

const limiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 100
});
app.use(limiter);

const allowedOrigins = [
  'http://localhost:5173',
  'http://localhost:5174',
  'https://rikud.netlify.app',
  'https://main--rikud.netlify.app',
  /^https:\/\/.*\.netlify\.app$/,
  'https://rikud-baruach-hatova.com',
];

app.use(cors({
  origin: function (origin, callback) {
    if (!origin) return callback(null, true);
    const isAllowed = allowedOrigins.some(allowedOrigin => (
      typeof allowedOrigin === 'string'
        ? allowedOrigin === origin
        : allowedOrigin instanceof RegExp && allowedOrigin.test(origin)
    ));
    if (isAllowed) callback(null, true);
    else {
      console.log(`CORS blocked origin: ${origin}`);
      callback(new Error('Not allowed by CORS'));
    }
  },
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/dance-studio', {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})
.then(async () => {
  console.log('✅ Connected to MongoDB');
  try {
    await seedContent();
    console.log('✅ Content collections ready');
  } catch (error) {
    console.error('❌ Content seed error:', error);
  }
})
.catch(err => console.error('❌ MongoDB connection error:', err));

app.use('/api/auth', require('./routes/auth'));
app.use('/api/classes', require('./routes/classes'));
app.use('/api/teachers', require('./routes/teachers'));
app.use('/api/branches', require('./routes/branches'));
app.use('/api/lessons', require('./routes/lessons'));
app.use('/api/products', require('./routes/products'));
app.use('/api/performances', require('./routes/performances'));

app.get('/api/health', (req, res) => {
  res.json({
    status: 'OK',
    message: 'Dance Studio API is running',
    timestamp: new Date().toISOString()
  });
});

app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({
    message: 'Something went wrong!',
    error: process.env.NODE_ENV === 'development' ? err.message : {}
  });
});

app.use('*', (req, res) => {
  res.status(404).json({ message: 'Route not found' });
});

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`🚀 Server is running on port ${PORT}`);
  console.log(`📍 Environment: ${process.env.NODE_ENV || 'development'}`);
});

module.exports = app;
